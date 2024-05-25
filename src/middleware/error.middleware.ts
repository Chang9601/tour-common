import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import { ApiResponse } from '../api/api-response';
import { Code } from '../code/code';
import { MongoIdError } from '../error/mongo-id.error';
import { MongoValidationError } from '../error/mongo-validation.error';
import { AbstractError } from '../error/abstract.error';
import { MongoDuplicateError } from '../error/mongo-duplicate.error';

interface ErrorAttr {
  name: string;
  code: number;
  errmsg: string;
}

const handleMongooseError = (error: ErrorAttr) => {
  if (error instanceof MongooseError.CastError) {
    const detail = `유효하지 않은 ${error.path}: ${error.value}.`;

    return new MongoIdError(Code.MONGO_ID_ERROR, detail, true);
  }

  if (error instanceof MongooseError.ValidationError) {
    const detail = Object.values(error.errors).map((value) => value.message);

    return new MongoValidationError(Code.MONGO_VALIDATION_ERROR, detail, true);
  }

  const detail = error.errmsg.match(/(["'])(\\?.)*?\1/)![0];

  return new MongoDuplicateError(Code.MONGO_DUPLICATE_ERROR, detail, true);
};

// TODO: 환경(e.g, 개발, 운영)에 따른 오류 처리가 필요한지 고민.
export function errorMiddleware(
  error: ErrorAttr,
  request: Request,
  response: Response,
  next: NextFunction
) {
  let code: number = Code.INTERNAL_SERVER_ERROR.code;
  let message: string = Code.INTERNAL_SERVER_ERROR.message;
  let detail: string | string[] = '오류가 발생했습니다.';

  if (
    error.name === 'CastError' ||
    error.name === 'ValidationError' ||
    error.code === 11000
  ) {
    const handledError = handleMongooseError(error);

    code = handledError.codeAttr.code;
    message = handledError.codeAttr.message;
    detail = handledError.detail;
  } else if (error instanceof AbstractError) {
    code = error.codeAttr.code;
    message = error.codeAttr.message;
    detail = error.detail;
  } else if (error instanceof Error) {
    detail = error.message;
  }

  response
    .status(code)
    .json(ApiResponse.handleFailure(code, message, detail, null));
}
