import { INestApplication, Injectable, Logger } from '@nestjs/common';
import morgan from 'morgan';
import { ServerConfiguration } from '../types';

@Injectable()
export class Morgan implements ServerConfiguration {
  private readonly _logger = new Logger(Morgan.name);

  public setup(app: INestApplication): void {
    app.use(
      morgan('dev', {
        stream: { write: (message) => this._logger.log(message) },
      }),
    );
  }
}
