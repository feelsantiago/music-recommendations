import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createClient } from 'redis';
import { Config } from './config';
import { Cookie } from './configs/cookie';
import { Cors } from './configs/cors';
import { Csrf } from './configs/csrf';
import { Helmet } from './configs/helmet';
import { Session } from './configs/session';
import { Configuration } from './configuration';
import { REDIS_CONNECTION, SERVER_CONFIGURATIONS } from './types';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    Configuration,
    Helmet,
    Cors,
    Session,
    Cookie,
    Csrf,
    Config,
    {
      provide: SERVER_CONFIGURATIONS,
      useFactory: (helmet, cors, session, cookie, csrf) => [
        helmet,
        cors,
        session,
        cookie,
        csrf,
      ],
      inject: [Helmet, Cors, Session, Cookie, Csrf],
    },
    {
      provide: REDIS_CONNECTION,
      useFactory: async (config: Config) => {
        const url = config.redis();
        return createClient({ url });
      },
      inject: [Config],
    },
  ],
  exports: [Configuration, Csrf, Config, REDIS_CONNECTION],
})
export class ConfigurationModule {}
