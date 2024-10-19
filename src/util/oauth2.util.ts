import axios, { AxiosResponse } from 'axios';

import { Code } from '../code/code';
import { OAuth2Provider } from '../enum/oauth2-provider.enum';
import { OAuth2TokensError } from '../error/oauth2/oauth2-tokens.error';
import { OAuth2UnlinkError } from '../error/oauth2/oauth2-unlink.error';
import { OAuth2UserInfoError } from '../error/oauth2/oauth2-userinfo.error';
import {
  OAuth2AccessTokenBody,
  OAuth2RefreshTokenBody,
  OAuth2Token,
  OAuth2UserInfo,
} from '../type/oauth2.type';

export class OAuth2Util {
  private static CONTENT_TYPE =
    'application/x-www-form-urlencoded; charset=utf-8';

  private static GOOGLE_OAUTH2_AUTHORIZATION_GRANT = 'authorization_code';
  private static GOOGLE_OAUTH2_AUTHORIZATION_URI =
    'https://accounts.google.com/o/oauth2/v2/auth';
  private static GOOGLE_OAUTH2_SCOPE = 'email profile';
  private static GOOGLE_OAUTH2_STATE = 'oauth2-google';
  private static GOOGLE_OAUTH2_TOKEN_URI =
    'https://oauth2.googleapis.com/token';
  private static GOOGLE_OAUTH2_UNLINK = 'https://oauth2.googleapis.com/revoke';
  private static GOOGLE_OAUTH2_USERINFO_URI =
    'https://www.googleapis.com/oauth2/v2/userinfo';

  private static NAVER_OAUTH2_AUTHORIZATION_GRANT = 'authorization_code';
  private static NAVER_OAUTH2_AUTHORIZATION_URI =
    'https://nid.naver.com/oauth2.0/authorize';
  private static NAVER_OAUTH2_SCOPE = 'email name';
  private static NAVER_OAUTH2_STATE = 'oauth2-naver';
  private static NAVER_OAUTH2_TOKEN_URI =
    'https://nid.naver.com/oauth2.0/token';
  private static NAVER_OAUTH2_UNLINK = 'https://nid.naver.com/oauth2.0/token	';
  private static NAVER_OAUTH2_USERINFO_URI =
    'https://openapi.naver.com/v1/nid/me';

  private static get GOOGLE_OAUTH2_CLIENT_ID(): string {
    return process.env.GOOGLE_OAUTH2_CLIENT_ID;
  }

  private static get GOOGLE_OAUTH2_CLIENT_SECRET(): string {
    return process.env.GOOGLE_OAUTH2_CLIENT_SECRET;
  }

  private static get GOOGLE_OAUTH2_REDIRECT_URI(): string {
    return process.env.GOOGLE_OAUTH2_REDIRECT_URI;
  }

  private static get NAVER_OAUTH2_CLIENT_ID(): string {
    return process.env.NAVER_OAUTH2_CLIENT_ID;
  }

  private static get NAVER_OAUTH2_CLIENT_SECRET(): string {
    return process.env.NAVER_OAUTH2_CLIENT_SECRET;
  }

  private static get NAVER_OAUTH2_REDIRECT_URI(): string {
    return process.env.NAVER_OAUTH2_REDIRECT_URI;
  }

  public static buildGoogleAuthroizationUri(): string {
    const parameters =
      `?client_id=${this.getOAuth2ClientId(OAuth2Provider.Google)}` +
      `&redirect_uri=${this.getOAuth2RedirectUri(OAuth2Provider.Google)}` +
      `&response_type=code` +
      `&scope=${this.GOOGLE_OAUTH2_SCOPE}` +
      `&access_type=offline` +
      `&state=${this.GOOGLE_OAUTH2_STATE}`;

    return this.buildAuthorizationUri(OAuth2Provider.Google, parameters);
  }

  public static async issueGoogleTokens(code: string): Promise<OAuth2Token> {
    return this.issueTokens(OAuth2Provider.Google, code);
  }

  public static async reissueGoogleToken(
    oAuth2RefreshToken: string
  ): Promise<string> {
    return this.reissueToken(OAuth2Provider.Google, oAuth2RefreshToken);
  }

  public static async getGoogleUserInfo(
    accessToken: string
  ): Promise<OAuth2UserInfo> {
    return this.getUserInfo(OAuth2Provider.Google, accessToken);
  }

  public static async unlinkGoogle(oAuth2AccessToken: string) {
    this.unlink(OAuth2Provider.Google, oAuth2AccessToken);
  }

  public static buildNaverAuthorizationUri(): string {
    const parameters =
      `?response_type=code` +
      `&client_id=${this.getOAuth2ClientId(OAuth2Provider.Naver)}` +
      `&redirect_uri=${this.getOAuth2RedirectUri(OAuth2Provider.Naver)}` +
      `&state=${this.NAVER_OAUTH2_STATE}`;

    return this.buildAuthorizationUri(OAuth2Provider.Naver, parameters);
  }

  public static async issueNaverTokens(code: string): Promise<OAuth2Token> {
    return this.issueTokens(OAuth2Provider.Naver, code);
  }

  public static async reissueNaverToken(
    oAuth2RefreshToken: string
  ): Promise<string> {
    return this.reissueToken(OAuth2Provider.Naver, oAuth2RefreshToken);
  }

  public static async getNaverUserInfo(
    accessToken: string
  ): Promise<OAuth2UserInfo> {
    return this.getUserInfo(OAuth2Provider.Naver, accessToken);
  }

  public static async unlinkNaver(oAuth2AccessToken: string) {
    this.unlink(OAuth2Provider.Naver, oAuth2AccessToken);
  }

  private static buildAuthorizationUri(
    oAuth2Provider: OAuth2Provider,
    parameters: string
  ) {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return `${this.GOOGLE_OAUTH2_AUTHORIZATION_URI}${parameters}`;
      case OAuth2Provider.Naver:
        return `${this.NAVER_OAUTH2_AUTHORIZATION_URI}${parameters}`;
      default:
        return '';
    }
  }

  private static async issueTokens(
    oAuth2Provider: OAuth2Provider,
    code: string
  ): Promise<OAuth2Token> {
    let oAuth2AccessTokenBody: OAuth2AccessTokenBody;
    let tokenResponse: AxiosResponse<any, any>;

    const oAuth2TokenUri = this.getOAuth2TokenUri(oAuth2Provider);
    const clientId = this.getOAuth2ClientId(oAuth2Provider);
    const clientSecret = this.getOAuth2ClientSecret(oAuth2Provider);
    const grantType = this.getOAuth2AuthorizationGrant(oAuth2Provider);

    if (oAuth2Provider === OAuth2Provider.Google) {
      oAuth2AccessTokenBody = {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: grantType,
        redirect_uri: this.getOAuth2RedirectUri(oAuth2Provider),
        provider: 'google',
      };
    } else {
      oAuth2AccessTokenBody = {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: grantType,
        state: this.NAVER_OAUTH2_STATE,
        provider: 'naver',
      };
    }

    try {
      tokenResponse = await axios.post(oAuth2TokenUri, oAuth2AccessTokenBody, {
        headers: {
          'Content-Type': this.CONTENT_TYPE,
        },
      });
      const tokens: OAuth2Token = {
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token,
      };

      return tokens;
    } catch (error) {
      console.log(error);

      throw new OAuth2TokensError(
        Code.INTERNAL_SERVER_ERROR,
        '토큰 발급 중 오류가 발생했습니다.'
      );
    }
  }

  private static async reissueToken(
    oAuth2Provider: OAuth2Provider,
    oAuth2RefreshToken: string
  ): Promise<string> {
    let oAuth2RefreshTokenBody: OAuth2RefreshTokenBody;
    let tokenResponse: AxiosResponse<any, any>;

    const oAuth2TokenUri = this.getOAuth2TokenUri(oAuth2Provider);
    const clientId = this.getOAuth2ClientId(oAuth2Provider);
    const clientSecret = this.getOAuth2ClientSecret(oAuth2Provider);
    const grantType = this.getOAuth2AuthorizationGrant(oAuth2Provider);

    if (oAuth2Provider === OAuth2Provider.Google) {
      oAuth2RefreshTokenBody = {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: oAuth2RefreshToken,
        grant_type: grantType,
        provider: 'google',
      };
    } else {
      oAuth2RefreshTokenBody = {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: oAuth2RefreshToken,
        grant_type: grantType,
        provider: 'naver',
      };
    }

    try {
      tokenResponse = await axios.post(oAuth2TokenUri, oAuth2RefreshTokenBody, {
        headers: {
          'Content-Type': this.CONTENT_TYPE,
        },
      });

      return tokenResponse.data.access_token;
    } catch (error) {
      console.log(error);

      throw new OAuth2TokensError(
        Code.INTERNAL_SERVER_ERROR,
        '토큰 재발급 중 오류가 발생했습니다.'
      );
    }
  }

  private static async getUserInfo(
    oAuth2Provider: OAuth2Provider,
    accessToken: string
  ): Promise<OAuth2UserInfo> {
    const userInfoUri = this.getOAuth2UserInfoUri(oAuth2Provider);

    try {
      const userInfoResponse = await axios.get(userInfoUri, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': this.CONTENT_TYPE,
        },
      });

      const userInfo = this.getOAuth2UserInfo(
        oAuth2Provider,
        userInfoResponse.data
      );

      let oAuth2UserInfo: OAuth2UserInfo;

      if (oAuth2Provider === OAuth2Provider.Google) {
        oAuth2UserInfo = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          provider: 'google',
        };
      } else {
        oAuth2UserInfo = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          provider: 'naver',
        };
      }

      return oAuth2UserInfo;
    } catch (error) {
      console.log(error);

      throw new OAuth2UserInfoError(
        Code.INTERNAL_SERVER_ERROR,
        '사용자 정보 요청 중 오류가 발생했습니다.'
      );
    }
  }

  private static async unlink(
    oAuth2Provider: OAuth2Provider,
    oAuth2AccessToken: string
  ) {
    let unlinkUri = this.getOAuth2Unlink(oAuth2Provider);
    let unlinkBody = {};
    const clientId = this.getOAuth2ClientId(oAuth2Provider);
    const clientSecret = this.getOAuth2ClientSecret(oAuth2Provider);
    const grantType = this.getOAuth2AuthorizationGrant(oAuth2Provider);

    if (oAuth2Provider === OAuth2Provider.Google) {
      unlinkUri += `?${oAuth2AccessToken}`;
    } else {
      unlinkBody = {
        client_id: clientId,
        client_secret: clientSecret,
        access_token: oAuth2AccessToken,
        grant_type: grantType,
      };
    }

    try {
      await axios.post(unlinkUri, unlinkBody);
    } catch (error) {
      console.log(error);

      throw new OAuth2UnlinkError(
        Code.INTERNAL_SERVER_ERROR,
        '연동 해제 중 오류가 발생했습니다.'
      );
    }
  }

  private static getOAuth2AuthorizationGrant(
    oAuth2Provider: OAuth2Provider
  ): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return this.GOOGLE_OAUTH2_AUTHORIZATION_GRANT;
      case OAuth2Provider.Naver:
        return this.NAVER_OAUTH2_AUTHORIZATION_GRANT;
      default:
        return '';
    }
  }

  private static getOAuth2ClientId(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return this.GOOGLE_OAUTH2_CLIENT_ID;
      case OAuth2Provider.Naver:
        return this.NAVER_OAUTH2_CLIENT_ID;
      default:
        return '';
    }
  }

  private static getOAuth2ClientSecret(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return this.GOOGLE_OAUTH2_CLIENT_SECRET;
      case OAuth2Provider.Naver:
        return this.NAVER_OAUTH2_CLIENT_SECRET;
      default:
        return '';
    }
  }

  private static getOAuth2RedirectUri(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return this.GOOGLE_OAUTH2_REDIRECT_URI;
      case OAuth2Provider.Naver:
        return this.NAVER_OAUTH2_REDIRECT_URI;
      default:
        return '';
    }
  }

  private static getOAuth2TokenUri(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return this.GOOGLE_OAUTH2_TOKEN_URI;
      case OAuth2Provider.Naver:
        return this.NAVER_OAUTH2_TOKEN_URI;
      default:
        return '';
    }
  }

  private static getOAuth2UserInfo(
    oAuth2Provider: OAuth2Provider,
    userInfo: any
  ): any {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return userInfo;
      case OAuth2Provider.Naver:
        return userInfo.response;
      default:
        return null;
    }
  }

  private static getOAuth2UserInfoUri(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return this.GOOGLE_OAUTH2_USERINFO_URI;
      case OAuth2Provider.Naver:
        return this.NAVER_OAUTH2_USERINFO_URI;
      default:
        return '';
    }
  }

  private static getOAuth2Unlink(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return this.GOOGLE_OAUTH2_UNLINK;
      case OAuth2Provider.Naver:
        return this.NAVER_OAUTH2_UNLINK;
      default:
        return '';
    }
  }
}
