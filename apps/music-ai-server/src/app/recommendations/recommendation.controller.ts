import { ResultAsync } from '@music-ai/common';
import {
  Recommendation,
  RecommendationError,
  Recommendations,
} from '@music-ai/recommendations';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecommendationRateLimitGuard } from './rate-limits/recommendation-rate-limit.guard';
import { RecommendationRateLimits } from './rate-limits/recommendations-rate-limits';
import { RecommendationErrorInterceptor } from './recommendation-error.interceptor';

@UseInterceptors(RecommendationErrorInterceptor)
@UseGuards(RecommendationRateLimitGuard)
@Controller('recommendations')
export class RecommendationController {
  constructor(
    private readonly _recommendations: Recommendations,
    private readonly _limits: RecommendationRateLimits,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async generate(): ResultAsync<Recommendation[], RecommendationError> {
    const result = await this._recommendations.generate('album');
    return result
      .inspect((response) => this._limits.used(response))
      .map((response) => response.recommendations);
  }
}
