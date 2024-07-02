import { CoreError } from '../core.error';
import { CodeAttr } from '../../code/code';

export class JwtValidationError extends CoreError {
  constructor(
    public readonly codeAttr: CodeAttr,
    public readonly detail: string | string[],
    public readonly isOperational: boolean
  ) {
    super(codeAttr, detail, isOperational);
  }
}
