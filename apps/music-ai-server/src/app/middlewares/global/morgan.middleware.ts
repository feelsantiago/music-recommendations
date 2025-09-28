import { INestApplication, Injectable, Logger } from '@nestjs/common';
import morgan from 'morgan';
import { GlobalMiddleware } from '../middlewares.types';

@Injectable()
export class MorganMiddleware implements GlobalMiddleware {
  private readonly _logger = new Logger(MorganMiddleware.name);

  public apply(app: INestApplication): void {
    app.use(
      morgan('dev', {
        stream: { write: (message) => this._logger.log(message) },
      }),
    );
  }
}
