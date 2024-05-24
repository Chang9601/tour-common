import { Request } from 'express';

export type RequsetParam = { [key: string]: string };
export type RequestBody = {};
export type RequestQuery = { [key: string]: undefined | string | string[] };
export type ResponseBody = {};

export type QueryRequest = Request<
  RequsetParam,
  ResponseBody,
  RequestBody,
  RequestQuery
>;
