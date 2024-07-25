import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import { ApiResponse } from '../api/api-response';
import { Code } from '../code/code';

import { CoreError } from '../error/core.error';
import { JwtExpirationError } from '../error/jwt/jwt-expiration.error';
import { JwtValidationError } from '../error/jwt/jwt-validation.error';
import { MongoDuplicateError } from '../error/mongodb/mongo-duplicate.error';
import { MongoIdError } from '../error/mongodb/mongo-id.error';
import { MongoValidationError } from '../error/mongodb/mongo-validation.error';

interface ErrorAttr {
  name: string;
  code: number;
  errmsg: string;
}

const handleMongooseError = (error: ErrorAttr) => {
  if (error instanceof MongooseError.CastError) {
    const detail = error.value;

    return new MongoIdError(Code.MONGO_ID_ERROR, detail, false);
  }

  if (error instanceof MongooseError.ValidationError) {
    const detail = Object.values(error.errors).map((value) => value.message);

    return new MongoValidationError(Code.MONGO_VALIDATION_ERROR, detail, false);
  }

  // TODO: 따옴표 제거(e.g., \"서울숲\").
  const detail = error.errmsg.match(/(["'])(\\?.)*?\1/)![0];

  return new MongoDuplicateError(
    Code.MONGO_DUPLICATE_ERROR,
    detail.substring(1, detail.length - 1),
    false
  );
};

const handleJwtError = (error: ErrorAttr) => {
  const detail = '로그인이 필요합니다.';

  if (error.name === 'JsonWebTokenError') {
    return new JwtValidationError(Code.JWT_VALIDATION_ERROR, detail, false);
  }

  return new JwtExpirationError(Code.JWT_EXPIRATION_ERROR, detail, false);
};

// TODO: 환경(e.g, 개발, 운영)에 따른 오류 처리가 필요한지 고민.
export const errorMiddleware = (
  error: ErrorAttr,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let code: number = Code.INTERNAL_SERVER_ERROR.code;
  let message: string = Code.INTERNAL_SERVER_ERROR.message;
  let detail: string | string[] = '오류가 발생했습니다.';

  /* 1. MongoDB 오류. */
  if (
    error.name === 'CastError' ||
    error.name === 'ValidationError' ||
    error.code === 11000
  ) {
    const handledError = handleMongooseError(error);

    code = handledError.codeAttr.code;
    message = handledError.codeAttr.message;
    detail = handledError.detail;
    /* 2. 애플리케이션 오류. */
  } else if (error instanceof CoreError) {
    code = error.codeAttr.code;
    message = error.codeAttr.message;
    detail = error.detail;
    /* 3. JWT 오류. */
  } else if (
    error.name === 'JsonWebTokenError' ||
    error.name === 'TokenExpiredError'
  ) {
    const handledError = handleJwtError(error);

    code = handledError.codeAttr.code;
    message = handledError.codeAttr.message;
    detail = handledError.detail;
    /* 4. 나머지 오류. */
  } else if (error instanceof Error) {
    detail = error.message;
  } else {
    /* 5. Error 인터페이스를 구현하지 않는 오류. */
    console.log(error);
  }

  return response
    .status(code)
    .json(ApiResponse.handleFailure(code, message, detail, null));
};
