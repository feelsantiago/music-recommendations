import { INestApplication, Injectable } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ServerConfiguration } from '../types';

@Injectable()
export class Cookie implements ServerConfiguration {
  public setup(app: INestApplication): void {
    app.use(cookieParser());
  }
}
