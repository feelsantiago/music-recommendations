import { INestApplication, Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';
import { Config } from '../config';
import { ServerConfiguration } from '../types';

@Injectable()
export class Cors implements ServerConfiguration {
  private readonly _origin: string | string[];

  constructor(private readonly _config: Config) {
    this._origin = match(this._config.env())
      .with('development', () => '*')
      .otherwise(() => [this._config.appUrl()]);
  }

  public setup(app: INestApplication): void {
    app.enableCors({
      origin: this._origin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  }
}
