import { Request } from 'express';

export type RequsetParam = {};
export type RequestBody = {};
export type RequestQuery = { [key: string]: string };
export type ResponseBody = {};
// TODO: why?
export type QueryRequest = Request<{}, {}, {}, {}>;
