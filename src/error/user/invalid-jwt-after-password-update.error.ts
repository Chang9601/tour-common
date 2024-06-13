import { CodeAttr } from '../../code/code';
import { AbstractError } from '../../error/abstract.error';

export class InvalidJwtAfterPasswordUpdateError extends AbstractError {
  constructor(
    public readonly codeAttr: CodeAttr,
    public readonly detail: string | string[],
    public readonly isOperational: boolean
  ) {
    super(codeAttr, detail, isOperational);
  }
}
