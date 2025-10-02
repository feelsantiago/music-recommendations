import { Duration } from '@music-ai/common';
import { Provider } from '@nestjs/common';
import { CookieOptions } from 'express-session';
import { Config } from '../configuration/config';

export const GLOBAL_MIDDLEWARES = Symbol('GLOBAL_MIDDLEWARES');
export const COOKIE_MAX_AGE = Symbol('COOKIE_MAX_AGE');
export const COOKIE_SETTINGS = Symbol('COOKIE_SETTINGS');

export const globalMiddlewaresProviders: Provider[] = [
  {
    provide: COOKIE_MAX_AGE,
    useValue: Duration.minutes(15),
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
];
