import { NextFunction, Request, Response } from 'express';

import { AsyncFunction } from '../type/async-function';
import { QueryRequest } from '../type/query-request';
import { RequestWithUser } from '../type/auth-type';

/*
 * catchAsync() 함수는 익명 함수를 반환하고 익명 함수는 경로 핸들러에 할당된다.
 * 즉, 익명 함수가 경로 핸들러 사용 시 호출된다.
 * 익명 함수는 매개변수 함수(즉, fn)를 호출한다.
 * 매개변수 함수가 비동기 함수이기 때문에 프로미스를 반환한다.
 * 따라서, 프로미스에서 오류가 발생하면(거부되면) catch() 메서드를 사용하여 발생한 오류를 잡을 수 있다.
 * catch() 메서드는 오류를 다음 함수로 전달하여 전역 오류 처리 미들웨어로 오류가 넘어간다.
 */
export const catchAsync = (fn: AsyncFunction) => {
  return (
    request: Request | QueryRequest | RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    /* 콜백함수는 매개변수와 함께 자동으로 호출된다. */
    fn(request, response, next).catch(next); // (error) => next(error)
  };
};
