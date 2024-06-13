import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema';

import { ApiResponse } from '../api/api-response';
import { Code } from '../code/code';

export const validationMiddleware = (
  schema: RunnableValidationChains<ValidationChain>
) => {
  return [
    schema,
    (request: Request, response: Response, next: NextFunction) => {
      const result = validationResult(request);
      const errors = result.formatWith((error) => error.msg).array();

      if (!result.isEmpty()) {
        const failure = ApiResponse.handleFailure(
          Code.BAD_REQUEST.code,
          Code.BAD_REQUEST.message,
          errors,
          null
        );

        /*
         * 반환문이 없으면 응답을 보내지만 함수 내의 코드 실행을 계속한다.
         * 그래서 응답을 보낸 후에도 다음 미들웨어로 넘어가 다른 응답을 보낸다.
         * 이를 방지하기 위해서 반환문을 사용한다.
         */
        return response.status(Code.BAD_REQUEST.code).json(failure);
      }

      next();
    },
  ];
};
