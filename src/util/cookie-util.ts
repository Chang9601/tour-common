export class CookieUtil {
  public static set = (
    key: string,
    value: string,
    httpOnly: boolean,
    maxAge: number,
    sameSite: string,
    path: string,
    secure: boolean
  ): string => {
    const cookie = `${key}=${value}; ${
      httpOnly ? 'HttpOnly;' : ''
    } Max-Age=${maxAge}; SameSite=${sameSite}; Path=${path}; ${
      secure ? 'Secure;' : ''
    }`;

    return cookie;
  };

  /* 쿠키를 제거하려면 키와 값 옵션이 정확히 일치해야 한다. (단, expires 옵션과 maxAge 옵션은 제외.) */
  public static clear = (key: string, path: string): string => {
    const cookie = `${key}=; Max-Age=0; Path=${path};`;

    return cookie;
  };
}
