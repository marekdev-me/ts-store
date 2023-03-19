import Database from './Database';
import DatabaseExistsError from '../errors/database-exists-error';
import DatabaseDoesNotExist from '../errors/database-does-not-exist';

export default class Store {
  /**
     * Store databases map
     *
     * @private
     */
  readonly databaseHashMap: Map<string, Database>;

  constructor() {
    this.databaseHashMap = new Map<string, Database>();
  }

  public createDatabase = (databaseName: string): Database => {
    if (this.databaseHashMap.has(databaseName)) {
      throw new DatabaseExistsError(`Database with the name ${databaseName} already exists!`);
    }

    const database: Database = new Database(databaseName);

    this.databaseHashMap.set(databaseName, database);

    return database;
  };

  /**
     * Delete database
     *
     * @param databaseName {string} Database name to delete
     */
  public deleteDatabase = (databaseName: string): void => {
    this.databaseHashMap.delete(databaseName);
  };

  /**
     * Get database map
     *
     * @returns {Map<string, Database>} Database map
     */
  public getDatabaseHashMap = (): Map<string, Database> => this.databaseHashMap;

  /**
     * Get database from database map by database name
     *
     * @param databaseName {string} Database name to return
     * @returns {Database} Database
     */
  public getDatabase = (databaseName: string): Database => {
    if (!this.databaseHashMap.has(databaseName)) {
      throw new DatabaseDoesNotExist(`Database with the name ${databaseName} does not exist!`);
    }

    return this.databaseHashMap.get(databaseName);
  };
}