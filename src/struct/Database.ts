import Table from './Table';
import { TableOptions } from '../interface/table-options';
import TableExists from '../errors/table-exists-error';
import TableDoesNotExist from '../errors/table-does-not-exist-error';
import { DatabaseOptions } from '../interface/database-options';

export default class Database {
  /**
   * Database name
   *
   * @private
   */
  readonly databaseName: string;

  /**
   * Database options
   */
  readonly databaseOptions: DatabaseOptions | null;

  /**
   * Tables map
   *
   * @private
   */
  private readonly tables: Map<string, Table>;

  /**
   * Database creation date
   *
   */
  readonly createdAt: Date;

  /**
   * Database class constructor
   *
   * @param dbName {string} Database name
   * @param options {DatabaseOptions} Database options
   */
  constructor(dbName: string, options?: DatabaseOptions) {
    this.databaseName = dbName;
    this.createdAt = new Date();
    this.tables = new Map<string, Table>();
    this.databaseOptions = options;
  }

  /**
   * Add a new table to database
   *
   * @param tableName {string} Table name to create
   * @param tableOptions Table options
   */
  public createTable = (tableName: string, tableOptions?: TableOptions): Table => {
    if (this.tables.has(tableName)) {
      throw new TableExists(`Table with name ${tableName} already exists!`);
    }

    const table = new Table(tableName, tableOptions);
    this.tables.set(tableName, table);

    return table;
  };

  /**
   * Get table by table name
   *
   * @param tableName {string} Table name to return
   */
  public getTable = (tableName: string): Table | undefined => {
    if (!this.tables.has(tableName)) {
      throw new TableDoesNotExist(`Table with the name ${tableName} does not exist!`);
    }

    return this.tables.get(tableName);
  };

  /**
   * Drop the table from database by table name
   *
   * @param tableName {string} Table name to drop
   */
  public dropTable = (tableName: string): void => {
    if (!this.tables.has(tableName)) {
      throw new TableExists(`Table with the name ${tableName} does not exist!`);
    }

    this.tables.delete(tableName);
  };

  /**
   * Get database table map
   *
   * @returns {Map<string, Table>} Database tables map
   */
  public getTablesHashMap = (): Map<string, Table> => this.tables;

  /**
   * Get database name
   *
   * @returns {string} Database name
   */
  public getName = (): string => this.databaseName;

  /**
   * Get database creation date
   *
   * @returns {Date} Database creation date
   */
  public getCreatedAt = (): Date => this.createdAt;
}
