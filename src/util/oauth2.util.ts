import { OAuth2Provider } from '../enum/oauth2-provider.enum';

export class OAuth2Util {
  public buildGoogleAuthroizationUri() {}
  public requestGoogleAuthorizationToken() {}
  public requestGoogleAccessToken() {}

  private buildAuthorizationUri(oAuth2Provider: OAuth2Provider) {}

  private requestAuthorizationToken() {}

  private requestAccessToken() {}

  public getOAuth2AuthorizationGrant(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return process.env.GOOGLE_OAUTH2_AUTHORIZATION_GRANT;
      case OAuth2Provider.Naver:
        return process.env.NAVER_OAUTH2_AUTHORIZATION_GRANT;
      default:
        return '';
    }
  }

  public getOAuth2AuthorizationUri(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return process.env.GOOGLE_OAUTH2_AUTHORIZATION_URI;
      case OAuth2Provider.Naver:
        return process.env.NAVER_OAUTH2_AUTHORIZATION_URI;
      default:
        return '';
    }
  }

  public getOAuth2ClientId(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return process.env.GOOGLE_OAUTH2_CLIENT_SECRET;
      case OAuth2Provider.Naver:
        return process.env.NAVER_OAUTH2_CLIENT_SECRET;
      default:
        return '';
    }
  }

  public getOAuth2ClientSecret(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return process.env.GOOGLE_OAUTH2_CLIENT_SECRET;
      case OAuth2Provider.Naver:
        return process.env.NAVER_OAUTH2_CLIENT_SECRET;
      default:
        return '';
    }
  }

  public getOAuth2RedirectUri(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return process.env.GOOGLE_OAUTH2_REDIRECT_URI;
      case OAuth2Provider.Naver:
        return process.env.NAVER_OAUTH2_REDIRECT_URI;
      default:
        return '';
    }
  }

  public getOAuth2Scope(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return process.env.GOOGLE_OAUTH2_SCOPE;
      case OAuth2Provider.Naver:
        return process.env.NAVER_OAUTH2_SCOPE;
      default:
        return '';
    }
  }

  public getOAuth2TokenUri(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return process.env.GOOGLE_OAUTH2_TOKEN_URI;
      case OAuth2Provider.Naver:
        return process.env.NAVER_OAUTH2_TOKEN_URI;
      default:
        return '';
    }
  }

  public getOAuth2UserInfoUri(oAuth2Provider: OAuth2Provider): string {
    switch (oAuth2Provider) {
      case OAuth2Provider.Google:
        return process.env.GOOGLE_OAUTH2_USER_INFO_URI;
      case OAuth2Provider.Naver:
        return process.env.NAVER_OAUTH2_USER_INFO_URI;
      default:
        return '';
    }
  }
}
