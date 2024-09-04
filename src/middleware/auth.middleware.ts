import { NextFunction, Response } from 'express';
import { Types } from 'mongoose';

import { Code } from '../code/code';
import { JwtType } from '../enum/jwt-type.enum';
import { UserRole } from '../enum/user-role.enum';
import { InvalidJwtAfterPasswordUpdateError } from '../error/user/invalid-jwt-after-password-update.error';
import { UnauthenticatedUserError } from '../error/user/unauthenticated-user.error';
import { UnauthorizedUserError } from '../error/user/unauthorized-user.error';
import { UserNotFoundError } from '../error/user/user-not-found.error';
import { User, UserDocument } from '../model/user.model';
import { RequestWithUser, UserPayload } from '../type/auth.type';
import { Nullable } from '../type/nullish.type';
import { catchAsync, mapRoleToEnum } from '../util/helper.util';
import { JwtUtil } from '../util/jwt.util';
import axios, { AxiosResponse } from 'axios';

export const authenticationMiddleware = catchAsync(
  async (request: RequestWithUser, response: Response, next: NextFunction) => {
    let jwt = null;

    /* Authorinzation 헤더의 Beaer 토큰을 사용하는 경우. */
    // if (
    //   request.headers.authorization &&
    //   request.headers.authorization.startsWith('Bearer')
    // ) {
    //   token = request.headers.authorization.split(' ')[1];
    // }

    /* 1. 토큰을 추출한다. */
    if (request.cookies && request.cookies[JwtType.AccessToken]) {
      jwt = request.cookies[JwtType.AccessToken];
    }

    if (!jwt) {
      return next(
        new UnauthenticatedUserError(Code.UNAUTHORIZED, '로그인이 필요합니다.')
      );
    }

    /* 2. 토큰을 검증한다. */
    /* 콜백함수를 프로미스로 변형한다. */
    const decoded = (await JwtUtil.verify(jwt, JwtType.AccessToken)) as {
      id: Types.ObjectId;
      iat: number;
      exp: number;
    };

    let user: Nullable<UserDocument>;
    let currentUser: AxiosResponse<any, any>;

    /* 3. 사용자가 존재하는지 확인한다(테스트 환경에서 생략한다.). -> TODO: 코드 수정 */
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'production'
    ) {
      // const repository = new UserRepository(User);
      // user = await User.findOne({ _id: decoded.id }); // await repository.find({ _id: decoded.id });

      try {
        /* 외부 요청이 아니라 서비스간 요청이라서 서비스 URL을 사용한다. */
        currentUser = await axios.get(
          `http://auth:3000/api/v1/users/current-user/${decoded.id}`
        );

        console.log(currentUser.data.data);
      } catch (error) {
        console.error(error);
      }

      user = currentUser!.data.data;
      console.log(user);

      if (!user) {
        return next(
          new UserNotFoundError(Code.NOT_FOUND, '사용자가 존재하지 않습니다.')
        );
      }

      /* 4. 토큰 발행 후 비밀번호를 수정했는지 확인한다. */
      if (user.isPasswordUpdatedAfterJwtIssued(decoded.iat)) {
        return next(
          new InvalidJwtAfterPasswordUpdateError(
            Code.JWT_AFTER_PASSWORD_UPDATE_ERROR,
            '로그인이 필요합니다.'
          )
        );
      }
    }

    /* 접근 제어되는 경로에 접근을 허락한다. */
    const userPayload: UserPayload = {
      id: process.env.NODE_ENV === 'test' ? decoded.id : user!._id,
      userRole:
        process.env.NODE_ENV === 'test'
          ? mapRoleToEnum(process.env.TEST_USER_ROLE)
          : user!.userRole,
    };

    request.user = userPayload;

    next();
  }
);

/*
 * 일반적으로 미들웨어 함수에 인자를 전달할 수 없다.
 * 따라서 포장 함수를 만들고 이 함수에서 미들웨어 함수를 반환한다.
 */
export const authorizationMiddleware = (...userRoles: UserRole[]) => {
  return (request: RequestWithUser, response: Response, next: NextFunction) => {
    if (!userRoles.includes(request.user!.userRole)) {
      return next(
        new UnauthorizedUserError(
          Code.FORBIDDEN,
          '작업을 수행할 권한이 없습니다.'
        )
      );
    }

    next();
  };
};
