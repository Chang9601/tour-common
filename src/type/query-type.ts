import { Document, Query } from 'mongoose';

export type AbstractQuery = Query<Document[], Document, {}, Document, 'find'>;
