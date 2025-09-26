import { ResultAsync, safeTry, SafeTryUnwraper } from '@music-ai/common';
import { Recommendation, Recommendations } from '@music-ai/recommendations';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly _recommendations: Recommendations) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async generate(): ResultAsync<Recommendation[]> {
    return safeTry(
      async function* (
        this: RecommendationController,
        { $async }: SafeTryUnwraper,
      ) {
        const result = yield* $async(this._recommendations.generate('album'));
        return result.recommendations;
      }.bind(this),
    );
  }
}
