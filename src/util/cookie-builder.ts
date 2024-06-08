export class CookieUtil {
  public static build = (
    key: string,
    value: string,
    httpOnly: boolean,
    maxAge: number,
    sameSite: string,
    path: string,
    secure: boolean,
  ): string => {
    const cookie = `${key}=${value}; ${httpOnly ? 'HttpOnly;' : ''} Max-Age=${maxAge}; SameSite=${sameSite}; Path=${path}; ${secure ? 'Secure;' : ''}`;

    return cookie;
  };

  /* 경로와 도메인이 일치해야 쿠키가 삭제된다. */
  public static clear = (key: string, path: string): string => {
    const cookie = `${key}=; Max-Age=0; Path=${path};`;

    return cookie;
  };
}
