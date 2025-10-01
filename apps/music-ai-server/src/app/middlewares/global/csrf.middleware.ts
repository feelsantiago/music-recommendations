import { INestApplication, Inject, Injectable } from '@nestjs/common';
import {
  CsrfRequestValidator,
  CsrfTokenCookieOptions,
  CsrfTokenGenerator,
  doubleCsrf,
  DoubleCsrfProtection,
} from 'csrf-csrf';
import { Request, Response } from 'express';
import { Config } from '../../configuration/config';
import { COOKIE_SETTINGS } from '../middlewares.providers';
import { GlobalMiddleware } from '../middlewares.types';

@Injectable()
export class CsrfMiddleware implements GlobalMiddleware {
  public middleware!: DoubleCsrfProtection;

  private _generator!: CsrfTokenGenerator;
  private _validate!: CsrfRequestValidator;

  constructor(
    private readonly _config: Config,
    @Inject(COOKIE_SETTINGS) private readonly _cookie: CsrfTokenCookieOptions,
  ) {}

  public apply(app: INestApplication): void {
    const csrf = this._config.csrf();

    const { generateCsrfToken, doubleCsrfProtection, validateRequest } =
      doubleCsrf({
        getSecret: () => csrf.secret,
        getSessionIdentifier: (req) => req.session.id,
        cookieName: csrf.name,
        cookieOptions: this._cookie,
      });

    this._generator = generateCsrfToken;
    this._validate = validateRequest;
    this.middleware = doubleCsrfProtection;

    // app.use(doubleCsrfProtection);
  }

  public token(req: Request, res: Response): string {
    return this._generator(req, res);
  }

  public validate(req: Request): boolean {
    return this._validate(req);
  }
}
