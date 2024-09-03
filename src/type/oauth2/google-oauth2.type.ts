import { OAuth2UserInfo } from './oauth2.type';

export class GoogleOAuth2UserInfo extends OAuth2UserInfo {
  public constructor(public readonly attribute: Record<string, string>) {
    super(attribute);
  }

  public getOAuth2ProviderId(): string {
    return this.attribute.sub;
  }
  public getName(): string {
    return this.attribute.name;
  }
  public getEmail(): string {
    return this.attribute.email;
  }
}
