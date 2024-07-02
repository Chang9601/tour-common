import { CodeAttr } from '../code/code';
import { CoreError } from './core.error';

export class DocumentNotFoundError extends CoreError {
  constructor(
    public readonly codeAttr: CodeAttr,
    public readonly detail: string | string[],
    public readonly isOperational: boolean
  ) {
    super(codeAttr, detail, isOperational);
  }
}
