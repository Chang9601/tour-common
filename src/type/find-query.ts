import { Query } from 'mongoose';

export type FindQuery<TDocument> = Query<
  TDocument[],
  TDocument,
  {},
  TDocument,
  'find'
>;
