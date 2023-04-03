import Record from './Record';
import ObjectId from '../utils/object-id';
import { Query, UpdateQuery } from '../types/query';
import { TableOptions } from '../types/table-options';
import { ColumnType } from '../types/column-type';

// TODO: Validate record fields to table columns before adding them to the table

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
  readonly tableColumns: Map<string, ColumnType>;

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
  constructor(tableName: string, tableColumns: Map<string, ColumnType>, options?: TableOptions) {
    this.tableName = tableName;
    this.createdAt = new Date();
    this.records = new Map<string, Record>();
    this.tableOptions = options || null;
    this.tableColumns = tableColumns;
  }

  /**
   * Check if values are unique if specified in table options
   *
   * @param data {Map<string, any>} Raw data to be checked against
   * @returns {boolean} Whether values are unique
   */
  private isUnique = (data: Map<string, any>): boolean => {
    let isUnique = true;

    if (this.tableOptions) {
      Array.from(this.records.keys()).forEach((r) => {
        const record = this.records.get(r)?.getColumnValuesMap();
        // Check for unknown fields
        this.tableOptions.uniqueFields.map((k) => {
          if (!record.has(k)) {
            throw new Error(`Non-existing unique field ${k} specified for ${this.tableName} table`);
          }

          if (record.get(k) === data.get(k)) {
            isUnique = false;
            return true; // exit the loop early
          }
          return isUnique;
        });
      });
    }
    return isUnique;
  };

  validateFields = (rawData: Map<string, ColumnType>): void => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [fieldName, fieldValue] of rawData.entries()) {
      if (!this.tableColumns.has(fieldName)) {
        throw new Error(`Unknown field ${fieldName} specified for ${this.tableName} table`);
      }

      const expectedType = this.tableColumns.get(fieldName);
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
    if (this.records.size > 0 && this.tableOptions && !this.isUnique(data)) {
      throw new Error(`Unique data check failed in ${this.tableName} table`);
    }

    this.validateFields(data);

    const objectId = ObjectId();

    // eslint-disable-next-line max-len
    const newRecord: Record = new Record(objectId, data, this.tableOptions.timestampData);

    this.records.set(objectId, newRecord);

    return newRecord;
  };

  /**
   * Update a single row by ID
   *
   * @param rowId {string} Row ID
   * @param valuesMap {Map<string, any>} Updated column values map
   * @returns {Record} Updated record
   */
  public updateOne = (rowId: string, valuesMap: Map<string, any>): Record | undefined => {
    const record = this.records.get(rowId);

    if (this.records.size > 0 && this.tableOptions && !this.isUnique(valuesMap)) {
      throw new Error(`Unique data check failed in ${this.tableName} table`);
    }

    valuesMap.forEach((k, v) => {
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
   * @param multiple {boolean} Whether to affect multiple records
   */
  public updateWhere = ({ query: { srcColumn, srcValue }, data }: UpdateQuery, multiple: boolean = false): void => {
    // TODO: Optimise
    // eslint-disable-next-line no-restricted-syntax
    for (const [key] of this.records.entries()) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [rKey, rValue] of this.records.get(key).getColumnValuesMap().entries()) {
        if (srcColumn === rKey && srcValue === rValue) {
          this.updateOne(this.records?.get(key).getRowId(), data).setUpdatedAt();
          if (!multiple) return;
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
