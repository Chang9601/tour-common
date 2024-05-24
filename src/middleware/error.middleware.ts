import { NextFunction, Request, Response } from 'express';

import { ApiResponse } from '../api/api-response';
import { Code } from '../code/code';
import { AbstractError } from '../error/abstract.error';

export function errorMiddleware(
  error: AbstractError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const codeAttr = error.codeAttr || Code.INTERNAL_SERVER_ERROR;
  const detail = error.detail || '오류가 발생했습니다.';

  const code = codeAttr.code;
  const message = codeAttr.message;

  response
    .status(error.codeAttr.code)
    .json(ApiResponse.handleFailure(code, message, detail, null));
}
