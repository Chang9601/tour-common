import { CodeAttribute } from '../../code/code';
import { CoreError } from '../core.error';

export class MongoValidationError extends CoreError {
  constructor(
    public readonly codeAttribute: CodeAttribute,
    public readonly detail: string | string[]
  ) {
    super(codeAttribute, detail);
  }
}
