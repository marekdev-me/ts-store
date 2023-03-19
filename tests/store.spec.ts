import { assert } from 'chai';
import { Store } from '../index';

describe('it should create new store', () => {
  it('create new store', () => {
    const store = new Store();
    assert.instanceOf(store, Store);
  });
});
