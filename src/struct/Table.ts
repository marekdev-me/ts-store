import Record from './Record';
import ObjectId from '../utils/object-id';
// import {
//   Events, onUpdate, onInsert, onDelete,
//   onBeforeInsert, onBeforeUpdate, onBeforeDelete,
// } from '../events/events';
// import EventEmitter = NodeJS.EventEmitter;

interface Query {
  srcColumn: string;
  srcValue: string
}

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
  readonly records: Map<string, Record>;

  /**
   * Table creation date
   *
   * @private
   */
  readonly createdAt: Date;

  // private eventEmitter: EventEmitter;

  /**
   * Table class constructor
   *
   * @param tableName {string} Table name
   */
  constructor(tableName: string) {
    this.tableName = tableName;
    this.createdAt = new Date();
    this.records = new Map<string, Record>();
    // this.eventEmitter = Events;
  }

  /**
   * Insert new record into a table
   *
   * @param data {Map<string, any>} Column values map
   * @returns {Record} Created record
   */
  public insertOne = (data: Map<string, any>): Record => {
    // // Emit before row insert
    // onBeforeInsert(data);

    const objectId = ObjectId();

    const record: Record = new Record(objectId, data, new Date(), new Date());

    this.records.set(objectId, record);

    // Emit after row insert
    // onInsert(record);

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

    // Emit before update
    // onBeforeUpdate(valuesMap, record);

    valuesMap.forEach((k, v) => {
      record.getColumnValuesMap().set(v, k);
    });

    record.setUpdatedAt(new Date());

    // Emit after update
    // onUpdate(record);

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

    // Emit before delete
    // onBeforeDelete(record);

    this.records.delete(record.getRowId());

    // Emit after delete
    // onDelete(record);

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
   * Find record/row by field and value
   *
   * @param query {Query} Query parameters
   */
  public findWhere = (query: Query): Record => {
    // TODO: Optimise
    // eslint-disable-next-line no-restricted-syntax
    for (const [key] of this.records.entries()) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [rKey, rValue] of this.records.get(key).getColumnValuesMap().entries()) {
        if (query.srcColumn === rKey && query.srcValue === rValue) {
          return this.records.get(key);
        }
      }
    }
    return new Record('NULL', new Map(), new Date(), new Date());
  };

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
