import express from 'express';

import { CoreController } from './controller.interface';

export interface CoreApplication {
  app: express.Application;
  port: number;
  uri: string;

  listen(): void;
  initializeMiddlewares(): void;
  initializeControllers(controllers: CoreController[]): void;
  connectToMessagingSystem(): Promise<void>;
  connectToDatabase(): Promise<void>;
  initializeErrorHandler(): void;
}
