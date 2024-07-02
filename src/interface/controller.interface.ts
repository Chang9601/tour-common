import { Router } from 'express';

// TODO: <TDocument extends CoreDocument> 혹은 any?
export interface CoreController {
  path: string;
  router: Router;
  repository: any;

  initializeRoutes(): void;
}
