import { NextFunction, Response } from 'express';
import { Types } from 'mongoose';

import { Code } from '../code/code';
import { UserRole } from '../enum/user-role.enum';
import { InvalidJwtAfterPasswordUpdateError } from '../error/user/invalid-jwt-after-password-update.error';
import { UnauthenticatedUserError } from '../error/user/unauthenticated-user.error';
import { UnauthorizedUserError } from '../error/user/unauthorized-user.error';
import { UserNotFoundError } from '../error/user/user-not-found.error';
import { User } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';
import { RequestWithUser, UserPayload } from '../type/auth-type';
import { catchAsync } from '../util/catch-async';
import { JwtUtil } from '../util/jwt-util';

const authenticationMiddleware = catchAsync(
  async (request: RequestWithUser, response: Response, next: NextFunction) => {
    let token = null;

    /* Authorinzation 헤더의 Beaer 토큰을 사용하는 경우. */
    // if (
    //   request.headers.authorization &&
    //   request.headers.authorization.startsWith('Bearer')
    // ) {
    //   token = request.headers.authorization.split(' ')[1];
    // }

    /* 1. 토큰을 추출한다. */
    if (request.cookies && request.cookies.AccessToken) {
      token = request.cookies.AccessToken;
    }

    if (!token) {
      return next(
        new UnauthenticatedUserError(
          Code.UNAUTHORIZED,
          '로그인이 필요합니다.',
          true
        )
      );
    }

    /* 2. 토큰을 검증한다. */
    /* 콜백함수를 프로미스로 변형한다. */
    const decoded = (await JwtUtil.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    )) as {
      id: Types.ObjectId;
      iat: number;
      exp: number;
    };

    /* 3. 사용자가 존재하는지 확인한다. */
    const repository = new UserRepository(User);
    const user = await repository.find({ _id: decoded.id });
    if (!user) {
      return next(
        new UserNotFoundError(
          Code.NOT_FOUND,
          '사용자가 존재하지 않습니다.',
          true
        )
      );
    }

    /* 4. 토큰 발행 후 비밀번호를 수정했는지 확인한다. */
    if (user.isPasswordUpdatedAfterJwtIssued(decoded.iat)) {
      return next(
        new InvalidJwtAfterPasswordUpdateError(
          Code.JWT_AFTER_PASSWORD_UPDATE_ERROR,
          '로그인이 필요합니다.',
          true
        )
      );
    }

    /* 접근 제어되는 경로에 접근을 허락한다. */
    const userPayload: UserPayload = {
      id: user._id,
      role: user.userRole,
    };

    request.user = userPayload;

    next();
  }
);

/*
 * 일반적으로 미들웨어 함수에 인자를 전달할 수 없다.
 * 따라서 포장 함수를 만들고 이 함수에서 미들웨어 함수를 반환한다.
 */
const authorizationMiddleware = (...roles: UserRole[]) => {
  return (request: RequestWithUser, response: Response, next: NextFunction) => {
    if (!roles.includes(request.user!.role)) {
      return next(
        new UnauthorizedUserError(
          Code.FORBIDDEN,
          '작업을 수행할 권한이 없습니다.',
          true
        )
      );
    }

    next();
  };
};

export { authenticationMiddleware, authorizationMiddleware };
