import { CodeAttribute } from '../../code/code';
import { CoreError } from '../../error/core.error';

export class OAuth2UnlinkError extends CoreError {
  constructor(
    public readonly codeAttribute: CodeAttribute,
    public readonly detail: string | string[]
  ) {
    super(codeAttribute, detail);
  }
}
