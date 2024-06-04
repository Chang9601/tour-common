import { Request } from 'express';
import { Types } from 'mongoose';

type UserPayload = {
  id: Types.ObjectId;
  iat: number;
  exp: number;
};

type RequestWithUser = Request & { user: UserPayload };

type TokenPayload = {
  id: Types.ObjectId;
};

export { UserPayload, RequestWithUser, TokenPayload };
