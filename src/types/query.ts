export type Query = {
  srcColumn: string;
  srcValue: string;
  throw?: boolean;
};

export type UpdateQuery = {
  query: Query;
  data: Map<string, any>;
};
