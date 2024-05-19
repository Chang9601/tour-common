import { Query } from 'mongoose';

export type AbstractQuery<TDocument> = Query<
  TDocument[],
  TDocument,
  {},
  TDocument,
  'find'
>;
