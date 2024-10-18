import { Request } from 'express';

import { UserPayload } from './auth.type';

type RequsetParam = {};
type RequestBody = {};
type RequestQuery = { [key: string]: string } & {};
type ResponseBody = {};
// TODO: <>에 타입을 사용하면 오류 발생하지만 {} 리터럴 사용 시 오류 없음.
type QueryRequest = Request<any, any, any, any> & { user?: UserPayload };

export { RequsetParam, RequestBody, RequestQuery, ResponseBody, QueryRequest };
