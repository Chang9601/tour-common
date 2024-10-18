import { CoreError } from './core.error';
import { CodeAttribute } from '../code/code';

export class MissingRequiredParametersError extends CoreError {
  constructor(
    public readonly codeAttribute: CodeAttribute,
    public readonly detail: string | string[]
  ) {
    super(codeAttribute, detail);
  }
}
