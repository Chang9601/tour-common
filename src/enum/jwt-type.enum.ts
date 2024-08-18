/*
 * TypeScript 명명 관습에 따라서 대문자를 사용한다.
 * 하지만 쿠키는 일반적으로 소문자이기에 소문자를 사용한다.
 */
export enum JwtType {
  AccessToken = 'access_token',
  RefreshToken = 'refresh_token',
}
