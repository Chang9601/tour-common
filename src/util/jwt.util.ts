import * as jwt from 'jsonwebtoken';

import { JwtType } from '../enum/jwt-type.enum';
import { JwtPayload } from '../type/auth.type';
import { JwtBundle } from '../type/jwt-bundle.type';

export class JwtUtil {
  private static readonly ACCESS_TOKEN_EXPIRATION = '1h';
  private static readonly REFRESH_TOKEN_EXPIRATION = '30d';

  /*
   * 테스트 환경 설정에서 정적 필드로 선언하면 환경 변수가 초기화 되기 전에 접근되기 때문에 오류가 발생한다.
   * 정적 필드는 클래스가 처음 로드될 때 초기화 된다. 즉, 클래스를 가져오거나(import) 인스턴스화 될 때이다.
   * 게터를 사용하여 초기화를 지연시킨다.
   */
  private static get ACCESS_TOKEN_SECRET(): string {
    return process.env.JWT_ACCESS_SECRET;
  }
  private static get REFRESH_TOKEN_SECRET(): string {
    return process.env.JWT_REFRESH_SECRET;
  }

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

  private static build = (
    payload: JwtPayload,
    secret: string,
    expiration: number | string
  ): string => {
    return jwt.sign(payload, secret, {
      expiresIn: expiration,
    });
  };
}
