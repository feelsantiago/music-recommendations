import { INestApplication, Inject, Injectable } from '@nestjs/common';
import { RedisStore } from 'connect-redis';
import session, { CookieOptions } from 'express-session';
import { RedisClientType } from 'redis';
import { Config } from '../config';
import {
  COOKIE_SETTINGS,
  REDIS_CONNECTION,
  ServerConfiguration,
  SessionConfig,
} from '../types';

@Injectable()
export class Session implements ServerConfiguration {
  private readonly _session: SessionConfig;
  private readonly _store: RedisStore;

  constructor(
    private readonly _config: Config,
    @Inject(REDIS_CONNECTION) private readonly _redis: RedisClientType,
    @Inject(COOKIE_SETTINGS) private readonly _cookie: CookieOptions,
  ) {
    this._session = this._config.session();
    this._store = new RedisStore({
      client: this._redis,
      prefix: this._session.store,
    });
  }

  public setup(app: INestApplication): void {
    app.use(
      session({
        store: this._store,
        secret: this._session.secret,
        resave: false,
        saveUninitialized: true,
        cookie: this._cookie,
      }),
    );
  }
}
