import { NextFunction, Request, Response } from 'express';

import { QueryRequest } from './request-type';

export type AsyncFunction = (
  request: Request | QueryRequest,
  response: Response,
  next: NextFunction
) => Promise<void>;
