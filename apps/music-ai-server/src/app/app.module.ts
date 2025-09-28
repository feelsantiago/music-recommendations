import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ResultInterceptor } from './interceptors/result.interceptor';
import { MidlewaresModule } from './middlewares/middlewares.module';
import { RecommendationModule } from './recommendations/recommendation.module';
import { TagModule } from './tags/tags.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigurationModule,
    MidlewaresModule,
    AuthModule,
    TagModule,
    RecommendationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultInterceptor,
    },
  ],
})
export class AppModule {}
