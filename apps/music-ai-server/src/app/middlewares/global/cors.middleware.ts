import { INestApplication, Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';
import { Config } from '../../configuration/config';
import { GlobalMiddleware } from '../middlewares.types';

@Injectable()
export class CorsMiddleware implements GlobalMiddleware {
  private readonly _origin: string | string[];

  constructor(private readonly _config: Config) {
    this._origin = match(this._config.env())
      .with('development', () => [
        `http://localhost:${this._config.port()}`,
        'http://localhost:4200',
      ])
      .otherwise(() => [this._config.appUrl()]);
  }

  public apply(app: INestApplication): void {
    app.enableCors({
      origin: this._origin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    });
  }
}
