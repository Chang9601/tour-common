import { JwtType } from '../enum/jwt-type.enum';

export class CookieUtil {
  private static readonly COOKIE_ACCESS_TOKEN_EXPIRATION = 1;
  private static readonly COOKIE_REFRESH_TOKEN_EXPIRATION = 30;

  public static set(
    key: string,
    value: string,
    httpOnly: boolean,
    maxAge: number,
    sameSite: string,
    path: string,
    secure: boolean
  ): string {
    const cookie = `${key}=${value}; ${
      httpOnly ? 'HttpOnly;' : ''
    } Max-Age=${maxAge}; SameSite=${sameSite}; Path=${path}; ${
      secure ? 'Secure;' : ''
    }`;

    return cookie;
  }

  /* 쿠키를 제거하려면 키와 값 옵션이 정확히 일치해야 한다. (단, expires 옵션과 maxAge 옵션은 제외.) */
  public static clear(
    key: string,
    httpOnly: boolean,
    sameSite: string,
    path: string,
    secure: boolean
  ): string {
    //const cookie = `${key}=; Max-Age=0; Path=${path};`;

    const cookie = `${key}=; ${
      httpOnly ? 'HttpOnly;' : ''
    } Max-Age=0; SameSite=${sameSite}; Path=${path}; ${
      secure ? 'Secure;' : ''
    }`;

    return cookie;
  }

  public static setJwtCookies(accessToken: string, refreshToken: string) {
    return [
      this.set(
        JwtType.AccessToken,
        accessToken,
        true,
        this.COOKIE_ACCESS_TOKEN_EXPIRATION * 60 * 60,
        'Strict',
        '/',
        process.env.NODE_ENV === 'production' ? true : false
      ),
      this.set(
        JwtType.RefreshToken,
        refreshToken,
        true,
        this.COOKIE_REFRESH_TOKEN_EXPIRATION * 60 * 60 * 24,
        'Strict',
        '/',
        process.env.NODE_ENV === 'production' ? true : false
      ),
    ];
  }

  public static clearJwtCookies() {
    return [
      this.clear(
        JwtType.AccessToken,
        true,
        'Strict',
        '/',
        process.env.NODE_ENV === 'production' ? true : false
      ),
      this.clear(
        JwtType.RefreshToken,
        true,
        'Strict',
        '/',
        process.env.NODE_ENV === 'production' ? true : false
      ),
    ];
  }
}
