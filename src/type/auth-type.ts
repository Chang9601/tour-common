import { Request } from 'express';
import { Types } from 'mongoose';

import { UserRole } from '../enum/user-role.enum';

type UserPayload = {
  id: Types.ObjectId;
  role: UserRole;
};

// TODO: 옵션을 제거할 수 있는 개선법.
type RequestWithUser = Request & { user?: UserPayload };

type JwtPayload = {
  id: Types.ObjectId;
};

export { UserPayload, RequestWithUser, JwtPayload };
