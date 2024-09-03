export abstract class OAuth2UserInfo {
  public constructor(protected readonly attribute: Record<string, string>) {}

  public abstract getOAuth2ProviderId(): string;
  public abstract getName(): string;
  public abstract getEmail(): string;
}
