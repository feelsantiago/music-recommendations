import { INestApplication, Injectable } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { GlobalMiddleware } from '../middlewares.types';

@Injectable()
export class CookieMiddleware implements GlobalMiddleware {
  public apply(app: INestApplication): void {
    app.use(cookieParser());
  }
}
