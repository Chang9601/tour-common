export abstract class AbstractError extends Error {
  public abstract code: number;
  public abstract message: string;
  public abstract details: string | string[];

  constructor() {
    super();

    this.name = this.constructor.name;
  }
}
