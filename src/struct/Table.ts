import Record from './Record';
import ObjectId from '../utils/object-id';

export default class Table {
  /**
   * Table name
   *
   * @private
   */
  readonly tableName: string;

  /**
   * Table records map
   *
   * @private
   */
  private records: Map<string, Record>;

  /**
   * Table creation date
   *
   * @private
   */
  readonly createdAt: Date;

  /**
   * Table class constructor
   *
   * @param tableName {string} Table name
   */
  constructor(tableName: string) {
    this.tableName = tableName;
    this.createdAt = new Date();
    this.records = new Map<string, Record>();
  }

  /**
   * Insert new record into a table
   *
   * @param data {Map<string, any>} Column values map
   * @returns {Record} Created record
   */
  public insertOne = (data: Map<string, any>): Record => {
    const objectId = ObjectId();

    const record: Record = new Record(objectId, data, new Date(), new Date());

    this.records.set(objectId, record);

    return record;
  };

  /**
   * Update a single row by ID
   *
   * @param rowId {string} Row ID
   * @param valuesMap {Map<string, any>} Updated column values map
   * @returns {Record} Updated record
   */
  public updateOne = (rowId: string, valuesMap: Map<string, any>): Record => {
    const record = this.records.get(rowId);

    valuesMap.forEach((k, v) => {
      record.getColumnValuesMap().set(v, k);
    });

    record.setUpdatedAt(new Date());

    return this.records.get(rowId);
  };

  /**
   * Delete a single row by ID
   *
   * @param rowId {string} Row ID to delete
   * @returns {Record} Deleted record
   */
  public delete = (rowId: string): Record => {
    const record: Record = this.records.get(rowId);

    this.records.delete(record.getRowId());

    return record;
  };

  /**
   * Get row data by ID
   *
   * @param rowId {string} Row ID to find
   * @returns {Map<string, any>} Row column values map
   */
  // eslint-disable-next-line max-len
  public findOne = (rowId: string): Map<string, any> => this.records.get(rowId).getColumnValuesMap();

  /**
   * Get all rows in a table
   *
   * @returns {Map<string, Record>} Map of all the records in a table
   */
  public find = (): Map<string, Record> => this.records;

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
