import * as jwt from 'jsonwebtoken';

import { JwtType } from '../enum/jwt-type.enum';
import { JwtPayload } from '../type/auth.type';
import { JwtBundle } from '../type/jwt-bundle.type';

export class JwtUtil {
  private static readonly ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
  private static readonly ACCESS_TOKEN_EXPIRATION = '1h';
  private static readonly REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;
  private static readonly REFRESH_TOKEN_EXPIRATION = '30d';

  public static issue = (payload: JwtPayload): JwtBundle => {
    return {
      accessToken: this.build(
        payload,
        this.ACCESS_TOKEN_SECRET,
        this.ACCESS_TOKEN_EXPIRATION
      ),
      refreshToken: this.build(
        payload,
        this.REFRESH_TOKEN_SECRET,
        this.REFRESH_TOKEN_EXPIRATION
      ),
    };
  };

  // TODO: 새로고침 토큰 기준 재발급 메서드.
  public static reissue = (refreshToken: string) => {};

  public static verify = (
    token: string,
    tokenType: JwtType
  ): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        tokenType === JwtType.AccessToken
          ? this.ACCESS_TOKEN_SECRET
          : this.REFRESH_TOKEN_SECRET,
        {},
        (error, decoded) => {
          if (error) {
            reject(error);
          } else {
            resolve(decoded);
          }
        }
      );
    });
  };

  public static build = (
    payload: JwtPayload,
    secret: string,
    expiration: number | string
  ): string => {
    return jwt.sign(payload, secret, {
      expiresIn: expiration,
    });
  };
}
