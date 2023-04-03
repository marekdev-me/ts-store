import { assert, expect } from 'chai';
import Store, { ColumnType } from '../src';
import Record from '../src/struct/Record';

describe('manage table records', () => {
  const dbName: string = 'MyDatabase';
  const tableName: string = 'users';

  // Create a new store
  const store = new Store();
  // Create a new database
  const database = store.createDatabase(dbName);
  // Create a new table
  database.createTable(tableName, new Map<string, ColumnType>(
      [
          ["username", 'string'],
          ["email", 'string'],
          ["password", 'string'],
      ]
  ), { uniqueFields: ['username'] });
  const table = database.getTable('users');

  // Map
  const rec: Map<string, any> = new Map<string, any>(
    [
      ['username', 'marekdev'],
      ['email', 'marek@marekdev.me'],
      ['password', 'password'],
    ],
  );

  const recTwo: Map<string, any> = new Map<string, any>(
    [
      ['username', 'example'],
      ['email', 'marek@marekdev.me'],
      ['password', 'password'],
    ],
  );

  it('should add a new record to database table called users', () => {
    const record = table.insertOne(rec);

    assert.equal(record.getColumnValuesMap().get('username'), rec.get('username'));
    assert.instanceOf(record, Record);

    table.delete(record.getRowId());
  });

  it('should add 2 records with different IDs', () => {
    const recordOne = table.insertOne(rec);

    const recordTwo = table.insertOne(recTwo);

    // eslint-disable-next-line no-underscore-dangle
    assert.notEqual(recordOne.getRowId(), recordTwo.getRowId());

    // eslint-disable-next-line no-underscore-dangle
    table.delete(recordOne.getRowId());

    // eslint-disable-next-line no-underscore-dangle
    table.delete(recordTwo.getRowId());
  });

  it('should update record in database table', () => {
    const record = table.insertOne(rec);

    const updatedData: Map<string, any> = new Map<string, any>(
      [
        ['username', 'just-changed'],
      ],
    );

    const updatedRecord = table.updateOne(record.getRowId(), updatedData);

    assert.instanceOf(updatedRecord, Record);
    assert.equal(updatedRecord.getColumnValuesMap().get('username'), updatedData.get('username'));

    table.delete(record.getRowId());
  });

  it('should find a record by key/value', () => {
    const record = table.insertOne(rec);

    const foundRecord = table.findWhere({ srcColumn: 'email', srcValue: 'marek@marekdev.me' });

    assert.instanceOf(foundRecord, Record);
    assert.equal(record.getColumnValuesMap().get('username'), foundRecord.getColumnValuesMap().get('username'));

    table.delete(record.getRowId());
  });

  it('should delete record based on field/value provided', () => {
    const record = table.insertOne(rec);

    assert.instanceOf(record, Record);
    assert.equal(record.getColumnValuesMap().get('username'), rec.get('username'));

    let records = table.find();
    expect(records).have.length(1);

    const deletedRecord = table.delete(record.getRowId());
    assert.instanceOf(deletedRecord, Record);

    records = table.find();
    expect(records).have.length(0);
  });

  it('should not allow duplicate creation', () => {
    const dubRec: Map<string, any> = new Map<string, any>(
      [
        ['username', 'oops'],
        ['email', 'marek@wd.me'],
        ['password', 'password'],
      ],
    );

    const dubRecTwo: Map<string, any> = new Map<string, any>(
      [
        ['username', 'oops'],
        ['email', 'marek@wd.me'],
        ['password', 'password'],
      ],
    );

    const recOriginal = table.insertOne(dubRec);

    expect(recOriginal).instanceOf(Record);
    assert.throws(() => table.insertOne(dubRecTwo));

    table.delete(recOriginal.getRowId());
  });

  it('should delete single record where key/value and multiple tag is set to false', () => {
    table.insertOne(rec);
    const recToDelete = table.insertOne(recTwo);

    // Assert that database has 2 records
    expect(table.find()).to.have.length(2);

    // Attempt to delete records
    table.deleteWhere({ srcColumn: 'email', srcValue: rec.get('email') }, false);

    // Assert table has no records
    expect(table.find()).to.have.length(1);

    table.delete(recToDelete.getRowId());
  });

  it('should delete multiple records where key/value and multiple tag set to true', () => {
    table.insertOne(rec);
    table.insertOne(recTwo);

    // Assert that database has 2 records
    expect(table.find()).to.have.length(2);

    // Attempt to delete records
    table.deleteWhere({ srcColumn: 'email', srcValue: rec.get('email') }, true);

    // Assert table has no records
    expect(table.find()).to.have.length(0);
  });
});
