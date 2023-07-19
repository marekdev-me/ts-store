import { assert } from 'chai';
import Store, {ColumnOptions} from '../src';
import Table from '../src/struct/Table';

describe('manage database tables', () => {
  const dbName: string = 'MyDatabase';

  // Create a new store
  const store = new Store();
  // Create a new database
  const database = store.createDatabase(dbName);

  it('should add single new table to database', () => {
    // Add a new table to database
    const table = database.createTable('users', new Map<string, ColumnOptions>(
        [
          ['username', { type: 'string', editable: false, unique: true }],
          ['email', { type: 'string', editable: true, unique: true }],
          ['password', { type: 'string', editable: true }],
        ]
    ), { timestampData: false});

    // Expect returned table to be Instance Of Table class
    assert.instanceOf(table, Table);

    // Remove tables
    database.dropTable('users');
  });
});
