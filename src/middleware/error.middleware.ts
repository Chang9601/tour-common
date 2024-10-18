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

interface ErrorAttribute {
  name: string;
  code: number;
  errmsg: string;
}

const handleAxiosError = () => {};

const handleJwtError = (error: ErrorAttribute) => {
  const detail = '로그인이 필요합니다.';

  if (error.name === 'JsonWebTokenError') {
    return new JwtValidationError(Code.JWT_VALIDATION_ERROR, detail);
  }

  return new JwtExpirationError(Code.JWT_EXPIRATION_ERROR, detail);
};

const handleMongooseError = (error: ErrorAttribute) => {
  if (error instanceof MongooseError.CastError) {
    const detail = error.value;

    return new MongoIdError(Code.MONGO_ID_ERROR, detail);
  }

  if (error instanceof MongooseError.ValidationError) {
    const detail = Object.values(error.errors).map((value) => value.message);

    return new MongoValidationError(Code.MONGO_VALIDATION_ERROR, detail);
  }

  // TODO: 따옴표 제거(e.g., \"서울숲\").
  const detail = error.errmsg.match(/(["'])(\\?.)*?\1/)![0];

  return new MongoDuplicateError(
    Code.MONGO_DUPLICATE_ERROR,
    detail.substring(1, detail.length - 1)
  );
};

// TODO: 환경(e.g, 개발, 운영)에 따른 오류 처리가 필요한지 고민.
export const errorMiddleware = (
  error: ErrorAttribute,
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

    code = handledError.codeAttribute.code;
    message = handledError.codeAttribute.message;
    detail = handledError.detail;
    /* 2. JWT 오류. */
  } else if (
    error.name === 'JsonWebTokenError' ||
    error.name === 'TokenExpiredError'
  ) {
    const handledError = handleJwtError(error);

    code = handledError.codeAttribute.code;
    message = handledError.codeAttribute.message;
    detail = handledError.detail;

    /* 3. 애플리케이션 오류. */
  } else if (error instanceof CoreError) {
    code = error.codeAttribute.code;
    message = error.codeAttribute.message;
    detail = error.detail;
    /* 4. Error 인터페이스를 구현한 오류. */
  } else if (error instanceof Error) {
    detail = error.message;
  } else {
    /*
     * 5. 나머지 오류(프로그래밍 오류나 제3자 패키지 오류 등).
     * 운영 환경에서 오류에 대한 정보를 최소한 전달해야 한다.
     */
    console.error(error);
  }

  return response
    .status(code)
    .json(ApiResponse.handleFailure(code, message, detail, null));
};
