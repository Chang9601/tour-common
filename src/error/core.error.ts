import { CodeAttribute } from '../code/code';

export abstract class CoreError extends Error {
  public readonly isOperational: boolean = true;

  constructor(
    public readonly codeAttribute: CodeAttribute,
    public readonly detail: string | string[]
  ) {
    super();

    this.name = this.constructor.name;

    /* 새로운 객체가 생성되고 생성자 함수가 호출되면 함수 호출이 스택 트레이스에 나타나지 않는다. */
    Error.captureStackTrace(this, this.constructor);
  }
}
