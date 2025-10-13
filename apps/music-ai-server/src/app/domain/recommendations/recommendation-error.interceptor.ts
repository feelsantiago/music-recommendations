import { AppErrorInterceptor } from '@music-ai/common';
import { RecommendationError } from '@music-ai/recommendations';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { match, P } from 'ts-pattern';

@Injectable()
export class RecommendationErrorInterceptor extends AppErrorInterceptor<RecommendationError> {
  public transform(error: RecommendationError): HttpException {
    return match(error.type)
      .with(
        P.union('recommendation_generation', 'empty_music_metadata'),
        () => new BadRequestException(error.message, { cause: error }),
      )
      .with(
        'invalid_recommendation',
        () => new BadRequestException(error.message, { cause: error }),
      )
      .exhaustive();
  }
}
