import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createClient } from 'redis';
import { Config } from './config';
import { REDIS_CONNECTION } from './configuration.providers';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    Config,
    {
      provide: REDIS_CONNECTION,
      useFactory: async (config: Config) => {
        const url = config.redis();
        return await createClient({ url }).connect();
      },
      inject: [Config],
    },
  ],
  exports: [Config, REDIS_CONNECTION],
})
export class ConfigurationModule {}
