export interface Query {
  srcColumn: string;
  srcValue: string;
  throw?: boolean;
}

export interface UpdateQuery {
  srcColumn: string;
  srcValue: string;
  data: Map<string, any>;
}
