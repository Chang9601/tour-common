import { AbstractError } from '../abstract.error';
import { CodeAttr } from '../../code/code';

export class UnauthenticatedUserError extends AbstractError {
  constructor(
    public readonly codeAttr: CodeAttr,
    public readonly detail: string | string[],
    public readonly isOperational: boolean
  ) {
    super(codeAttr, detail, isOperational);
  }
}
