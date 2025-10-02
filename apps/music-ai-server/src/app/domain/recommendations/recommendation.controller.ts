import { ResultAsync } from '@music-ai/common';
import {
  Recommendation,
  RecommendationError,
  Recommendations,
  RecommendationType,
} from '@music-ai/recommendations';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecommendationDto } from './dtos/recommendation.dto';
import { RecommendationTypePipe } from './pipes/recommendation-type.pipe';
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

  @Post()
  @HttpCode(HttpStatus.OK)
  public async generate(
    @Body() body: RecommendationDto,
    @Query('type', RecommendationTypePipe) type: RecommendationType,
  ): ResultAsync<Recommendation[], RecommendationError> {
    const tags = body.tags.map((tag) => tag.value);
    const result = await this._recommendations.generate(type, tags);
    return result
      .inspect((response) => this._limits.used(response))
      .map((response) => response.recommendations);
  }
}
