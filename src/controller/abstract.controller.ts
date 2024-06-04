import { Router } from 'express';

export abstract class AbstractController {
  public abstract path: string;
  public abstract router: Router;
  // TODO: 레포지토리 필드와 메서드.
}
