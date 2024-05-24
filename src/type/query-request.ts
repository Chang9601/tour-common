import { Request } from 'express';

export type RequsetParam = {};
export type RequestBody = {};
export type RequestQuery = { [key: string]: string };
export type ResponseBody = {};
// TODO: <>에 타입을 사용하면 오류 발생하지만 {} 리터럴 사용 시 오류 없음.
export type QueryRequest = Request<{}, {}, {}, {}>;
