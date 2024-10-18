type CoreOAuth2AccessTokenBody = {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: string;
};

type GoogleOAuth2AccessTokenBody = CoreOAuth2AccessTokenBody & {
  redirect_uri: string;
  provider: 'google';
};

type NaverOAuth2AccessTokenBody = CoreOAuth2AccessTokenBody & {
  state: string;
  provider: 'naver';
};

type CoreOAuth2RefreshTokenBody = {
  client_id: string;
  client_secret: string;
  refresh_token: string;
  grant_type: string;
};

type GoogleOAuth2RefreshTokenBody = CoreOAuth2RefreshTokenBody & {
  provider: 'google';
};

type NaverOAuth2RefreshTokenBody = CoreOAuth2RefreshTokenBody & {
  provider: 'naver';
};

type CoreOAuth2UserInfo = {
  id: string;
  name: string;
  email: string;
};

type GoogleOAuth2UserInfo = CoreOAuth2UserInfo & { provider: 'google' };

type NaverOAuth2UserInfo = CoreOAuth2UserInfo & { provider: 'naver' };

export type OAuth2AccessTokenBody =
  | GoogleOAuth2AccessTokenBody
  | NaverOAuth2AccessTokenBody;

export type OAuth2RefreshTokenBody =
  | GoogleOAuth2RefreshTokenBody
  | NaverOAuth2RefreshTokenBody;

export type OAuth2Token = {
  accessToken: string;
  refreshToken: string;
};

export type OAuth2UserInfo = GoogleOAuth2UserInfo | NaverOAuth2UserInfo;
