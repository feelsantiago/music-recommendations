import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  Recommendation,
  RecommendationPayload,
  RecommendationType,
} from '@music-ai/recommendations';
import { Observable } from 'rxjs';
import { APP_CONFIG, Env } from '../../../environments/env';
import { toAppError } from '../../helpers/http-error';

@Injectable({ providedIn: 'root' })
export class RecommendationsApi {
  public get url(): string {
    return `${this._config.api}/recommendations`;
  }

  constructor(
    @Inject(APP_CONFIG) private readonly _config: Env,
    private readonly _http: HttpClient,
  ) {}

  public fetch(
    tags: RecommendationPayload,
    type: RecommendationType,
  ): Observable<Recommendation[]> {
    return this._http
      .post<Recommendation[]>(`${this.url}?type=${type}`, tags)
      .pipe(toAppError());
  }
}
