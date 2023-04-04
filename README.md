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
const table = myNewDatabse.createTable("<table_name>", /* Table Columns Map /*, /* table options */);
```

Table columns (Map):
Table columns are defined in the following format:

```ts
import {ColumnOptions} from "in-mem-store/lib";

const tableColumns = new Map<string, ColumnOptions>(
    ["username", { type: 'string' }],
    ["email", { type: 'string' }],
    ["password", { type: 'string'}]
);
```

Each time a table record is updated or inserted it will be checked for validity including columns and value type

Table options (object):
- `uniqueFields` - An array of strings/fields to be checked for uniqueness
- `timestampData` - true/false whether to add timestamp data to record
