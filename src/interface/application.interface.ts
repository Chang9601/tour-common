import express from 'express';

import { CoreController } from './controller.interface';

export interface CoreApplication {
  app: express.Application;
  port: number;
  uri: string;

  listen(): void;
  initializeMiddlewares(): void;
  initializeControllers(controllers: CoreController[]): void;
  connectToDatabase(): void;
  connectToMessagingSystem(): void;
  initializeErrorHandler(): void;
}
