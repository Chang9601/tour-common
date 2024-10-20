import axios, { AxiosResponse } from 'axios';
import { NextFunction, Response } from 'express';
import { Redis } from 'ioredis';

import { Code } from '../code/code';
import { JwtType } from '../enum/jwt-type.enum';
import { RedisType } from '../enum/redis-tye.enum';
import { UserRole } from '../enum/user-role.enum';
import { UnauthenticatedUserError } from '../error/user/unauthenticated-user.error';
import { UnauthorizedUserError } from '../error/user/unauthorized-user.error';
import { UserNotFoundError } from '../error/user/user-not-found.error';
import { UserDocument } from '../model/user.model';
import { RequestWithUser, UserPayload } from '../type/auth.type';
import { JwtDecoded } from '../type/jwt-decoded.type';
import { Nullable } from '../type/nullish.type';
import {
  catchAsync,
  mapStringToBoolean,
  mapStringToUserRole,
} from '../util/helper.util';
import { JwtUtil } from '../util/jwt.util';
import { RedisUtil } from '../util/redis.util';
import { CookieUtil } from '../util/cookie.util';
//import { cacheUser, findCachedUser } from '../util/redis.util';

// TODO: cachedUser 타입 수정.
export const authenticationMiddleware = (redis: Redis) => {
  return catchAsync(
    async (
      request: RequestWithUser,
      response: Response,
      next: NextFunction
    ) => {
      let jwtAccess, jwtRefresh;
      let result;
      /* Authorinzation 헤더의 Beaer 토큰을 사용하는 경우. */
      // if (
      //   request.headers.authorization &&
      //   request.headers.authorization.startsWith('Bearer')
      // ) {
      //   token = request.headers.authorization.split(' ')[1];
      // }

      /* 1. 토큰을 추출한다. */
      if (request.cookies && request.cookies[JwtType.AccessToken]) {
        jwtAccess = request.cookies[JwtType.AccessToken];
      }

      if (request.cookies && request.cookies[JwtType.RefreshToken]) {
        jwtRefresh = request.cookies[JwtType.RefreshToken];
      }

      if (!jwtAccess) {
        return next(
          new UnauthenticatedUserError(
            Code.UNAUTHORIZED,
            '로그인이 필요합니다.'
          )
        );
      }

      /* 2. 토큰을 검증한다. */
      /* 콜백함수를 프로미스로 변형한다. */
      try {
        result = await JwtUtil.verify(jwtAccess, JwtType.AccessToken);
      } catch (error: any) {
        /*
         * 접근토큰이 만료되면 새로고침 토큰 재발급 과정을 거친다.
         * 새로고침 토큰이 유효하면 접근토큰과 새로고침 토큰을 재발급을 한다.
         */
        if (error.name === 'TokenExpiredError') {
          const jwtBundle = await JwtUtil.reissue(jwtRefresh);

          const cookies = CookieUtil.setJwtCookies(
            jwtBundle.accessToken,
            jwtBundle.refreshToken
          );

          response.setHeader('Set-Cookie', cookies);
        }
      }

      const decoded = result as JwtDecoded;

      let user: Nullable<UserDocument>;
      let getCurrentUser: AxiosResponse<any, any>;
      let cachedUser: Record<any, any> = {};

      /* 3. 사용자가 존재하는지 확인한다(테스트 환경에서 생략한다.). -> TODO: 코드 수정 */
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'production'
      ) {
        const isCached = await RedisUtil.isCached(
          decoded.id,
          RedisType.User,
          redis
        );

        if (!isCached) {
          try {
            getCurrentUser = await axios.get(
              `http://auth:3000/api/v1/users/current-user/${decoded.id}`
            );
          } catch (error) {
            return next(
              new UserNotFoundError(
                Code.NOT_FOUND,
                '사용자가 존재하지 않습니다.'
              )
            );
          }
          // if (getCurrentUser.status === Code.NOT_FOUND.code) {
          //   return next(
          //     new UserNotFoundError(
          //       Code.NOT_FOUND,
          //       '사용자가 존재하지 않습니다.'
          //     )
          //   );
          // }

          user = getCurrentUser.data.data;

          console.log(user);

          cachedUser = {
            id: user!.id,
            banned: user!.banned,
            userRole: user!.userRole,
          };

          await RedisUtil.cacheUser(cachedUser, 1 * 60 * 60, redis);
        } else {
          cachedUser = await RedisUtil.findUser(decoded.id, redis);
        }

        /* 4. 토큰 발행 후 비밀번호를 수정했는지 확인한다. */
        // if (user.isPasswordUpdatedAfterJwtIssued(decoded.iat)) {
        //   return next(
        //     new InvalidJwtAfterPasswordUpdateError(
        //       Code.JWT_AFTER_PASSWORD_UPDATE_ERROR,
        //       '로그인이 필요합니다.'
        //     )
        //   );
        // }
      }

      console.log(cachedUser);

      /* 접근 제어되는 경로에 접근을 허락한다. */
      const userPayload: UserPayload = {
        id: process.env.NODE_ENV === 'test' ? decoded.id : cachedUser!.id,
        banned:
          process.env.NODE_ENV === 'test'
            ? false
            : mapStringToBoolean(cachedUser!.banned),
        userRole:
          process.env.NODE_ENV === 'test'
            ? mapStringToUserRole(process.env.TEST_USER_ROLE)
            : mapStringToUserRole(cachedUser!.userRole),
      };

      request.user = userPayload;

      next();
    }
  );
};

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
