import { Request } from 'express';

export type RequsetParam = {};
export type RequestBody = {};
export type RequestQuery = { [key: string]: string };
export type ResponseBody = {};

export type QueryRequest = Request<
  RequsetParam,
  ResponseBody,
  RequestBody,
  RequestQuery
>;
