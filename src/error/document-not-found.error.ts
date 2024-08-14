import { CoreError } from './core.error';
import { CodeAttribute } from '../code/code';

export class DocumentNotFoundError extends CoreError {
  constructor(
    public readonly codeAttribute: CodeAttribute,
    public readonly detail: string | string[],
    public readonly isOperational: boolean
  ) {
    super(codeAttribute, detail, isOperational);
  }
}
