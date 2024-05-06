import { Router } from 'express';

export abstract class AbstractController {
  public abstract path: string;
  public abstract router: Router;
}
