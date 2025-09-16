import { INestApplication, Injectable } from '@nestjs/common';
import helmet from 'helmet';
import { ServerConfiguration } from '../types';

@Injectable()
export class Helmet implements ServerConfiguration {
  public setup(app: INestApplication): void {
    app.use(helmet());
  }
}
