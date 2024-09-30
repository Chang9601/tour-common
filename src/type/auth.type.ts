import { Request } from 'express';
import { Types } from 'mongoose';

import { UserRole } from '../enum/user-role.enum';

export type UserPayload = {
  id: Types.ObjectId;
  banned: boolean;
  userRole: UserRole;
};

// TODO: 옵션을 제거할 수 있는 개선법.
export type RequestWithUser = Request & { user?: UserPayload };

export type JwtPayload = {
  id: Types.ObjectId;
};
