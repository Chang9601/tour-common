import * as jwt from 'jsonwebtoken';

import { JwtPayload } from '../type/auth-type';

export class JwtUtil {
  public static issue = (
    payload: JwtPayload,
    secret: string,
    expiration: string | number
  ): string => {
    return jwt.sign(payload, secret, {
      expiresIn: expiration,
    });
  };

  // TODO: 새로고침 토큰 기준 재발급 메서드.
  public static reissue = () => {};

  public static verify = (token: string, secret: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, {}, (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded);
        }
      });
    });
  };
}
