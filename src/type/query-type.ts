import { Query } from 'mongoose';

export type AbstractQuery<TData> = Query<TData[], TData, {}, TData, 'find'>;
