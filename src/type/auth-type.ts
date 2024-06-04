import { Request } from 'express';
import { Types } from 'mongoose';

type UserPayload = {
  id: Types.ObjectId;
};

interface RequestWithUser extends Request {
  user: UserPayload;
}

type TokenPayload = {
  id: Types.ObjectId;
};

export { UserPayload, RequestWithUser, TokenPayload };
