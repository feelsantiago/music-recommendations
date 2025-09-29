import { ok, ResultAsync, safeTryBind } from '@music-ai/common';
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
import { RecommendationErrorInterceptor } from './recommendation-error.interceptor';
import { RecommendationLimitGuard } from './recommendation-limit.guard';
import { RecommendationLimits } from './recommendation-limits';

@UseInterceptors(RecommendationErrorInterceptor)
@UseGuards(RecommendationLimitGuard)
@Controller('recommendations')
export class RecommendationController {
  constructor(
    private readonly _recommendations: Recommendations,
    private readonly _limits: RecommendationLimits,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async generate(): ResultAsync<Recommendation[], RecommendationError> {
    return safeTryBind(this, async function* ({ $async }) {
      const result = yield* $async(this._recommendations.generate('album'));
      this._limits.used(result.metadata.tokens);

      return ok(result.recommendations);
    });
  }
}
