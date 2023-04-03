import { ColumnType } from './column-type';

export type ColumnOptions = {
  type: ColumnType,
  editable?: boolean,
  unique?: boolean,
  hidden?: boolean, // FIXME: Not yet implemented
};
