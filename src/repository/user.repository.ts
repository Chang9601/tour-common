import { AbstractRepository } from './abstract.repository';
import { UserDocument, UserModel } from '../model/user.model';

export class UserRepository extends AbstractRepository<UserDocument> {
  constructor(public readonly userModel: UserModel) {
    super(userModel);
  }
}
