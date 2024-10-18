import * as jwt from 'jsonwebtoken';

import { JwtType } from '../enum/jwt-type.enum';
import { JwtPayload } from '../type/auth.type';
import { JwtBundle } from '../type/jwt-bundle.type';
import { JwtDecoded } from '../type/jwt-decoded.type';

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

  public static issue(payload: JwtPayload, email: string): JwtBundle {
    return {
      accessToken: this.build(
        payload,
        email,
        this.ACCESS_TOKEN_SECRET,
        this.ACCESS_TOKEN_EXPIRATION
      ),
      refreshToken: this.build(
        payload,
        email,
        this.REFRESH_TOKEN_SECRET,
        this.REFRESH_TOKEN_EXPIRATION
      ),
    };
  }

  public static async reissue(refreshToken: string) {
    const decoded = (await this.verify(
      refreshToken,
      JwtType.RefreshToken
    )) as JwtDecoded;

    const payload: JwtPayload = {
      id: decoded.id,
    };

    /* TODO
     * 로그인 시 이벤트로 각 서비스의 Redis에 새로고침 토큰 저장
     * 로그아웃 시 이벤트로 각 서비스의 Redis에 새로고침 토큰 삭제
     * 뭔가 비효율적
     */

    return this.issue(payload, decoded.sub);
  }

  public static verify(token: string, tokenType: JwtType): Promise<unknown> {
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
  }

  private static build(
    payload: JwtPayload,
    email: string,
    secret: string,
    expiration: number | string
  ): string {
    return jwt.sign(payload, secret, {
      expiresIn: expiration,
      subject: email,
    });
  }
}
