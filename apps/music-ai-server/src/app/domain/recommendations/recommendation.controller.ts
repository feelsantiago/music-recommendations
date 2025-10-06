import { ResultAsync } from '@music-ai/common';
import {
  RecommendationError,
  RecommendationHistory,
  RecommendationResponse,
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
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { match, P } from 'ts-pattern';
import { RecommendationDto } from './dtos/recommendation.dto';
import { RecommendationTypePipe } from './pipes/recommendation-type.pipe';
import { RecommendationRateLimitGuard } from './rate-limits/recommendation-rate-limit.guard';
import { RecommendationErrorInterceptor } from './recommendation-error.interceptor';
import { RecommendationResultInterceptor } from './recommendation-result.interceptor';

@UseInterceptors(RecommendationErrorInterceptor)
@UseGuards(RecommendationRateLimitGuard)
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly _recommendations: Recommendations) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(RecommendationResultInterceptor)
  public async generate(
    @Body() body: RecommendationDto,
    @Query('type', RecommendationTypePipe) type: RecommendationType,
  ): ResultAsync<RecommendationResponse, RecommendationError> {
    const tags = body.tags.map((tag) => tag.value);
    return this._recommendations.generate(type, tags);
  }

  @Post('extend')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(RecommendationResultInterceptor)
  public async extend(
    @Body() body: RecommendationDto,
    @Query('type', RecommendationTypePipe) type: RecommendationType,
    @Session() session: Record<string, unknown>,
  ): ResultAsync<RecommendationResponse, RecommendationError> {
    const history = match(session.history)
      .with(
        P.array({ role: P.any }),
        () => session.history as RecommendationHistory[],
      )
      .otherwise(() => []);

    const tags = body.tags.map((tag) => tag.value);
    return this._recommendations.generate(type, tags, history);
  }
}
