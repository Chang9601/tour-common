import { Code } from '../code/code';
import { AbstractError } from './abstract.error';

export class DocumentNotFoundError extends AbstractError {
  public code: number;
  public message: string;
  public details: string | string[];

  constructor(code: number, message: string, details: string | string[]) {
    super();

    this.code = code || Code.NOT_FOUND.code;
    this.message = message || Code.NOT_FOUND.message;
    this.details = details;
  }
}
