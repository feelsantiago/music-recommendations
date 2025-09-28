import { INestApplication, Injectable } from '@nestjs/common';
import helmet from 'helmet';
import { GlobalMiddleware } from '../middlewares.types';

@Injectable()
export class HelmetMiddleware implements GlobalMiddleware {
  public apply(app: INestApplication): void {
    app.use(helmet());
  }
}
