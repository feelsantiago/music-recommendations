import { Duration } from '@music-ai/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CookieOptions } from 'express-session';
import { createClient } from 'redis';
import { Config } from './config';
import { Cookie } from './configs/cookie';
import { Cors } from './configs/cors';
import { Csrf } from './configs/csrf';
import { Helmet } from './configs/helmet';
import { Morgan } from './configs/morgan';
import { Session } from './configs/session';
import { Configuration } from './configuration';
import {
  COOKIE_MAX_AGE,
  COOKIE_SETTINGS,
  REDIS_CONNECTION,
  SERVER_CONFIGURATIONS,
} from './types';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    Configuration,
    Morgan,
    Helmet,
    Cors,
    Session,
    Cookie,
    Csrf,
    Config,
    {
      provide: SERVER_CONFIGURATIONS,
      useFactory: (morgan, helmet, cors, session, cookie, csrf) => [
        morgan,
        helmet,
        cors,
        session,
        cookie,
        csrf,
      ],
      inject: [Morgan, Helmet, Cors, Session, Cookie, Csrf],
    },
    {
      provide: REDIS_CONNECTION,
      useFactory: async (config: Config) => {
        const url = config.redis();
        return await createClient({ url }).connect();
      },
      inject: [Config],
    },
    {
      provide: COOKIE_MAX_AGE,
      useValue: Duration.days(1),
    },
    {
      provide: COOKIE_SETTINGS,
      useFactory: (config: Config, duration: Duration): CookieOptions => ({
        httpOnly: true,
        sameSite: config.env() === 'production' ? 'strict' : 'lax',
        secure: config.env() === 'production',
        maxAge: duration.calculate(),
      }),
      inject: [Config, COOKIE_MAX_AGE],
    },
  ],
  exports: [Configuration, Csrf, Config, REDIS_CONNECTION],
})
export class ConfigurationModule {}
