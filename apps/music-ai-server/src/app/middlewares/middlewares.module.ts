import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../configuration/configuration.module';
import { CookieMiddleware } from './global/cookie.middleware';
import { CorsMiddleware } from './global/cors.middleware';
import { CsrfMiddleware } from './global/csrf.middleware';
import { HelmetMiddleware } from './global/helmet.middleware';
import { MorganMiddleware } from './global/morgan.middleware';
import { SessionMiddleware } from './global/session.middleware';
import {
  GLOBAL_MIDDLEWARES,
  globalMiddlewaresProviders,
} from './middlewares.providers';
import { Middlewares } from './middlewares.service';

@Module({
  imports: [ConfigurationModule],
  providers: [
    MorganMiddleware,
    HelmetMiddleware,
    CorsMiddleware,
    SessionMiddleware,
    CookieMiddleware,
    CsrfMiddleware,
    Middlewares,
    {
      provide: GLOBAL_MIDDLEWARES,
      useFactory: (morgan, helmet, cors, session, cookie, csrf) => [
        morgan,
        helmet,
        cors,
        session,
        cookie,
        csrf,
      ],
      inject: [
        MorganMiddleware,
        HelmetMiddleware,
        CorsMiddleware,
        SessionMiddleware,
        CookieMiddleware,
        CsrfMiddleware,
      ],
    },
    ...globalMiddlewaresProviders,
  ],
  exports: [GLOBAL_MIDDLEWARES, CsrfMiddleware, Middlewares],
})
export class MidlewaresModule {}
