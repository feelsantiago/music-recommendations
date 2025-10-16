import { Result } from '@music-ai/common';
import {
  Recommendation,
  RecommendationError,
  RecommendationResponse,
} from '@music-ai/recommendations';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { RecommendationRateLimits } from './rate-limits/recommendations-rate-limits';

@Injectable()
export class RecommendationResultInterceptor implements NestInterceptor {
  constructor(private readonly _limits: RecommendationRateLimits) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler<Result<RecommendationResponse, RecommendationError>>,
  ): Observable<Result<Recommendation[], RecommendationError>> {
    const req = context.switchToHttp().getRequest();
    const session = req.session;

    return next.handle().pipe(
      map((data) =>
        data
          .inspect((data) => this._limits.used(data))
          .inspect((data) => {
            session.history = data.metadata.history;
            session.tags = data.metadata.tags;
            session.type = data.metadata.type;
          })
          .map((response) => response.recommendations),
      ),
    );
  }
}
