import { INestApplication, Inject, Injectable } from '@nestjs/common';
import { GLOBAL_MIDDLEWARES } from './middlewares.providers';
import { GlobalMiddleware } from './middlewares.types';

@Injectable()
export class Middlewares implements GlobalMiddleware {
  constructor(
    @Inject(GLOBAL_MIDDLEWARES)
    private readonly _middlewares: GlobalMiddleware[],
  ) {}

  public apply(app: INestApplication): void {
    for (const middleware of this._middlewares) {
      middleware.apply(app);
    }
  }
}
