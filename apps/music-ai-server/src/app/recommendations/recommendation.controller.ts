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
  UseInterceptors,
} from '@nestjs/common';
import { RecommendationErrorInterceptor } from './recommendation-error.interceptor';

@UseInterceptors(RecommendationErrorInterceptor)
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly _recommendations: Recommendations) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async generate(): ResultAsync<Recommendation[], RecommendationError> {
    return safeTryBind(this, async function* ({ $async }) {
      const result = yield* $async(this._recommendations.generate('album'));
      return ok(result.recommendations);
    });
  }
}
