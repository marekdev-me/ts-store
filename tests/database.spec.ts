import { assert } from 'chai';
import Store from '../src';
import Database from '../src/struct/Database';

describe('add a database to a newly created store', () => {
  it('should add new database and return created database', () => {
    const dbName = 'MyNewDatabase';
    // Create new store
    const store = new Store();
    // Add database to store
    const database = store.createDatabase(dbName);
    // Expect returned value to be an instance of Database
    assert.instanceOf(database, Database);
    assert.equal(database.getName(), dbName);
  });
});
