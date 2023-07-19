import { uuid } from 'uuidv4';
import Record from './Record';
import { Query, UpdateQuery } from '../types/query';
import { TableOptions } from '../types/table-options';
import { ColumnType } from '../types/column-type';
import { ColumnOptions } from '../types/column-options';

// TODO: Add an options to the columns such as unique
// TODO: ['username', { type: 'string', editable: false, unique: true }],

export default class Table {
  /**
   * Table name
   *
   * @readonly
   */
  readonly tableName: string;

  /**
   * Current table options
   *
   * @readonly
   */
  readonly tableOptions: TableOptions | null;

  /**
   * Table columns
   *
   * @readonly
   */
  readonly tableColumns: Map<string, ColumnOptions>;

  /**
   * Table records map
   *
   * @readonly
   */
  readonly records: Map<string, Record>;

  /**
   * Table creation date
   *
   * @readonly
   */
  readonly createdAt: Date;

  /**
   * Table class constructor
   *
   * @param tableName {string} Table name
   * @param tableColumns {Map<string, any>} Table columns
   * @param options? {TableOptions} Table options
   */
  constructor(tableName: string, tableColumns: Map<string, ColumnOptions>, options?: TableOptions) {
    this.tableName = tableName;
    this.createdAt = new Date();
    this.records = new Map<string, Record>();
    this.tableOptions = options || null;
    this.tableColumns = tableColumns;
  }

  /**
   * Check if values are unique if specified in table options
   *
   * @param rawData {Map<string, any>} Raw data to be checked against
   * @returns {boolean} Whether values are unique
   */
  // TODO: Check if values are unique and column config contains unique config
  private isUnique = (rawData: Map<string, any>): void => {
    // Loop over data keys
    for (const key of rawData.keys()) {
      const columnOptions = this.tableColumns.get(key);

      // Check if column exists
      if (!columnOptions) {
        throw new Error(`Column ${key} does not exist on table ${this.tableName}`);
      }

      if (columnOptions.unique) {
        const value = rawData.get(key);
        Array.from(this.records.values()).forEach((record) => {
          if (record.getColumnValuesMap().get(key) === value) {
            throw new Error(`Value ${value} already exists on table ${this.tableName}`);
          }
        });
      }
    }
  };

  private validateFields = (rawData: Map<string, ColumnType>, action: 'create' | 'update'): void => {
    if (this.records.size > 0) {
      this.isUnique(rawData);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [fieldName, fieldValue] of rawData.entries()) {
      if (!this.tableColumns.has(fieldName)) {
        throw new Error(`Unknown field ${fieldName} specified for ${this.tableName} table`);
      }

      const column = this.tableColumns.get(fieldName);

      // if (action === 'create') {}

      if (action === 'update') {
        if (!column.editable) {
          throw new Error(`Field ${fieldName} is not editable in ${this.tableName} table`);
        }
      }

      const expectedType = column.type;
      const actualType = typeof fieldValue;

      if (actualType !== expectedType) {
        throw new Error(`Type mismatch for field '${fieldName}': expected ${expectedType}, but got ${actualType}.`);
      }
    }
  };

  /**
   * Insert new record into a table
   *
   * @param data {Map<string, any>} Column values map
   * @returns {Record} Created record
   */
  public insertOne = (data: Map<string, any>): Record => {
    this.validateFields(data, 'create');

    const objectId = uuid();

    // eslint-disable-next-line max-len
    const newRecord: Record = new Record(objectId, data, this.tableOptions.timestampData);

    this.records.set(objectId, newRecord);

    return newRecord;
  };

  /**
   * Update a single row by ID
   *
   * @param rowId {string} Row ID
   * @param rawData {Map<string, any>} Updated column values map
   * @returns {Record} Updated record
   */
  public updateOne = (rowId: string, rawData: Map<string, any>): Record | undefined => {
    const record = this.records.get(rowId);

    this.validateFields(rawData, 'update');

    rawData.forEach((k, v) => {
      record?.getColumnValuesMap().set(v, k);
    });

    record?.setUpdatedAt();

    return this.records?.get(rowId);
  };

  /**
   * Delete a single row by ID
   *
   * @param rowId {string} Row ID to delete
   * @returns {Record} Deleted record
   */
  public delete = (rowId: string): Record | undefined => {
    const record: Record | undefined = this.records.get(rowId);

    if (record) {
      this.records.delete(record?.getRowId());

      return record;
    }

    return undefined;
  };

  /**
   * Get row data by ID
   *
   * @param rowId {string} Row ID to find
   * @returns {Map<string, any>} Row column values map
   */
  // eslint-disable-next-line max-len
  public findOne = (rowId: string): Map<string, any> => this.records?.get(rowId).getColumnValuesMap();

  /**
   * Find record/row by field and value
   *
   * @param query {Query} Query parameters
   */
  public findWhere = (query: Query): Record | undefined => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key] of this.records.entries()) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [rKey, rValue] of this.records.get(key).getColumnValuesMap().entries()) {
        if (query.srcColumn === rKey && query.srcValue === rValue) {
          return this.records?.get(key);
        }
      }
    }
    if (query.throw) {
      throw new Error(`Could not find record with srcColumn: ${query.srcColumn} and srcValue: ${query.srcValue}`);
    }
    return undefined;
  };

  /**
   * Update where key/value
   *
   * @param query {UpdateQuery} Update query
   * @param affectAll
   */
  public updateWhere = ({ query: { srcColumn, srcValue }, data }: UpdateQuery, affectAll: boolean = false): void => {
    // TODO: Optimise
    // eslint-disable-next-line no-restricted-syntax
    for (const [key] of this.records.entries()) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [rKey, rValue] of this.records.get(key).getColumnValuesMap().entries()) {
        if (srcColumn === rKey && srcValue === rValue) {
          this.updateOne(this.records?.get(key).getRowId(), data).setUpdatedAt();
          if (!affectAll) return;
        }
      }
    }
  };

  /**
   * Delete record where key/value
   *
   * @param query {Query} Delete query
   * @param multiple {boolean} Whether to affect single or multiple records
   */
  public deleteWhere = (query: Query, multiple: boolean = false): void => {
    // TODO: Optimise
    // eslint-disable-next-line no-restricted-syntax
    for (const [key] of this.records.entries()) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [rKey, rValue] of this.records.get(key).getColumnValuesMap().entries()) {
        if (query.srcColumn === rKey && query.srcValue === rValue) {
          this.records.delete(key);
          if (!multiple) {
            return;
          }
        }
      }
    }
  };

  /**
   * Get all rows in a table
   *
   * @returns {Map<string, Record>} Map of all the records in a table
   */
  public find = (): Map<string, Record> => this.records;

  public toObject = () => Array.from(this.records, ([key, value]) => ({ key, value }));

  /**
   * Get current table name
   *
   * @returns {string} Table name
   */
  public getTableName = (): string => this.tableName;

  /**
   * Get table creation date
   *
   * @returns {Date} Table creation date
   */
  public getCreatedAt = (): Date => this.createdAt;
}
