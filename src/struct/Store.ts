import { lstatSync, readdirSync } from 'fs';
import Database from './Database';
import DatabaseExistsError from '../errors/database-exists-error';
import DatabaseDoesNotExist from '../errors/database-does-not-exist';
import { StoreOptions } from '../types/store-options';

export default class Store {
  /**
   * Store databases map
   *
   * @private
   */
  readonly databaseHashMap: Map<string, Database>;

  readonly storeOptions: StoreOptions | null;

  constructor(storeOptions?: StoreOptions) {
    this.databaseHashMap = new Map<string, Database>();

    if (storeOptions) {
      this.storeOptions = storeOptions || null;
    }
  }

  /**
   * Create new store database
   *
   * @param databaseName {string} Database name to create
   */
  public createDatabase = (databaseName: string): Database => {
    if (this.databaseHashMap.has(databaseName)) {
      throw new DatabaseExistsError(`Database with the name ${databaseName} already exists!`);
    }

    const database: Database = new Database(databaseName);

    this.databaseHashMap.set(databaseName, database);

    return database;
  };

  public load = (): void => {
    if (!this.storeOptions || !this.storeOptions.dataDirectory) {
      throw new Error('Data directory was not provided in StoreOptions');
    }

    if (!lstatSync(this.storeOptions.dataDirectory).isDirectory()) {
      throw new Error('Data directory provided in StoreOptions is not a directory');
    }

    const dbDirectories = readdirSync(this.storeOptions.dataDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    dbDirectories.forEach((dbDir) => this.createDatabase(dbDir));
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
  public getDatabase = (databaseName: string): Database | undefined => {
    if (!this.databaseHashMap.has(databaseName)) {
      throw new DatabaseDoesNotExist(`Database with the name ${databaseName} does not exist!`);
    }

    return this.databaseHashMap.get(databaseName);
  };
}
