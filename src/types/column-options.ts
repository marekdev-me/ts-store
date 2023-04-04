import { ColumnType } from './column-type';

export type ColumnOptions = {
  type: ColumnType,
  editable?: boolean,
  unique?: boolean,
  // FIXME: Not yet implemented - Nothing implemented beyond this point
  hidden?: boolean,
  validate?: {
    min?: number,
    max?: number,
    length?: number,
    email?: boolean,
    pattern?: string,
  }
};
