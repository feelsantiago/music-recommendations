import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RecommendationLimitInterceptor implements NestInterceptor {
  public intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    // another minute | another day -> go ahead
    // same minute | same day -> look limits

    return next.handle();
  }
}
