import { Gemini, GeminiModule } from '@music-ai/gemini';
import { Recommendations } from '@music-ai/recommendations';
import { Module } from '@nestjs/common';
import { Config } from '../configuration/config';
import { ConfigurationModule } from '../configuration/configuration.module';
import { TimeModule } from '../time/time.module';
import { RecommendationLimits } from './recommendation-limits';
import { RecommendationController } from './recommendation.controller';

@Module({
  imports: [
    GeminiModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [Config],
      useFactory: (config: Config) => ({
        apiKey: config.aiKey(),
      }),
    }),
    TimeModule,
  ],
  controllers: [RecommendationController],
  providers: [
    {
      provide: Recommendations,
      useClass: Gemini,
    },
    RecommendationLimits,
  ],
})
export class RecommendationModule {}
