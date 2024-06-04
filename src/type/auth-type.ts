import { Request } from 'express';
import { Types } from 'mongoose';

type UserPayload = {
  id: Types.ObjectId;
};

type RequestWithUser = Request & { user?: UserPayload };

type TokenPayload = {
  id: Types.ObjectId;
};

export { UserPayload, RequestWithUser, TokenPayload };
