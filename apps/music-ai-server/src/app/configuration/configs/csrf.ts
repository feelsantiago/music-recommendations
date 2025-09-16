import { INestApplication, Injectable } from '@nestjs/common';
import { Option, some } from '@sapphire/result';
import { CsrfTokenGenerator, doubleCsrf } from 'csrf-csrf';
import { Request, Response } from 'express';
import { Config } from '../config';
import { ServerConfiguration } from '../types';

@Injectable()
export class Csrf implements ServerConfiguration {
  private _generator: Option<CsrfTokenGenerator>;

  constructor(private readonly _config: Config) {}

  public setup(app: INestApplication): void {
    const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
      getSecret: () => this._config.csrf(),
      getSessionIdentifier: (req) => req.session.id,
    });

    this._generator = some(generateCsrfToken);
    app.use(doubleCsrfProtection);
  }

  public token(req: Request, res: Response): string {
    return this._generator.match({
      some: (generator) => generator(req, res),
      // TODO: return error
      none: () => '',
    });
  }
}
