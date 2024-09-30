import express from 'express';

import { CoreController } from './controller.interface';

export interface CoreApplication {
  app: express.Application;
  port: number;
  uri: string;

  listen(): void;
  connectToDatabase(): Promise<void>;
  connectToMessagingSystem(): Promise<void>;
  initializeMiddlewares(): void;
  initializeControllers(controllers: CoreController[]): void;
  initializeErrorHandler(): void;
}
