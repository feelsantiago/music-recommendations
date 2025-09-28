import { AppErrorInterceptor } from '@music-ai/common';
import { RecommendationError } from '@music-ai/recommendations';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

@Injectable()
export class RecommendationInterceptor extends AppErrorInterceptor<RecommendationError> {
  public transform(error: RecommendationError): HttpException {
    return match(error.type)
      .with(
        'recommendation_generation',
        () => new BadRequestException(error.message, { cause: error }),
      )
      .with(
        'invalid_recommendation',
        () => new BadRequestException(error.message, { cause: error }),
      )
      .exhaustive();
  }
}
