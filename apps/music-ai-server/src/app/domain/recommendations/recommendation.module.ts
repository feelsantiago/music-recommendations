import { Gemini, GeminiModule } from '@music-ai/gemini';
import { Recommendations } from '@music-ai/recommendations';
import { Module } from '@nestjs/common';
import { Config } from '../../configuration/config';
import { ConfigurationModule } from '../../configuration/configuration.module';
import { RecommendationRateLimits } from './rate-limits/recommendations-rate-limits';
import { RecommendationController } from './recommendation.controller';

@Module({
  imports: [
    GeminiModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [Config],
      useFactory: (config: Config) => ({
        apiKey: config.aiKey(),
        recommendations: config.recommendationLength(),
        model: config.model(),
        spotify: {
          clientId: config.spotifyClientId(),
          clientSecret: config.spotifyClientSecret(),
        },
      }),
    }),
  ],
  controllers: [RecommendationController],
  providers: [
    {
      provide: Recommendations,
      useFactory: (gemini: Gemini) => gemini,
      inject: [Gemini],
    },
    RecommendationRateLimits,
  ],
})
export class RecommendationModule {}
