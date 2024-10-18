import { Types } from 'mongoose';

export type JwtDecoded = {
  id: Types.ObjectId;
  iat: number;
  exp: number;
  sub: string;
};
