import { NextFunction, Request, Response } from 'express';

import { QueryRequest } from './query-request.type';
import { RequestWithUser } from './auth.type';

export type AsyncFunction = (
  request: Request | QueryRequest | RequestWithUser,
  response: Response,
  next: NextFunction
) => Promise<void>;
