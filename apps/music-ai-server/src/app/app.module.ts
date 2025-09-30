import { TimeTrackerModule } from '@music-ai/time-tracker';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { CatchEverythingFilter } from './filters/catch-everything.filter';
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
    TimeTrackerModule,
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
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
  ],
})
export class AppModule {}
