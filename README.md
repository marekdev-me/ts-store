# Simple NodeJs In-Memory database implementation

### `NOTE! This implementation does not support browser but support is being added`

### Usage
- Download the latest version from NPM `npm i in-mem-store` to your Node.js project

#### Creating new store
```ts
const store = new Store();
```

#### Adding a database to store
Single store can have multiple databases
```ts
const myNewDatabse = store.createDatabase("<database_name>");
```

#### Adding a table to database
```ts
const table = myNewDatabse.createTable("<table_name>", /* table options */);
```

Table options (object):
- `uniqueFields` - An array of strings/fields to be checked for uniqueness
- `timestampData` - true/false whether to add timestamp data to record
