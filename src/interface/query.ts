export interface Query {
  srcColumn: string;
  srcValue: string;
}

export interface UpdateQuery {
  srcColumn: string;
  srcValue: string;
  data: Map<string, any>;
}
