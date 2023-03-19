import { assert, expect } from 'chai';
import { Store } from '../index';
import Table from '../src/struct/Table';

describe('manage database tables', () => {
  const dbName: string = 'MyDatabase';
  // const tableNames = ['users', 'posts', 'comments'];

  // Create a new store
  const store = new Store();
  // Create a new database
  const database = store.createDatabase(dbName);

  it('should add single new table to database', () => {
    // Add a new table to database
    const table = database.createTable('users');

    // Expect returned table to be Instance Of Table class
    assert.instanceOf(table, Table);

    // Remove tables
    database.dropTable('users');
  });
});
