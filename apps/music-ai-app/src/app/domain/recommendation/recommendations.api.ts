import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  Recommendation,
  RecommendationPayload,
} from '@music-ai/recommendations';
import { Observable } from 'rxjs';
import { APP_CONFIG, Env } from '../../../environments/env';

@Injectable({ providedIn: 'root' })
export class RecommendationsApi {
  public get url(): string {
    return `${this._config.api}/recommendations`;
  }

  constructor(
    @Inject(APP_CONFIG) private readonly _config: Env,
    private readonly _http: HttpClient,
  ) {}

  public fetch(tags: RecommendationPayload): Observable<Recommendation[]> {
    return this._http.post<Recommendation[]>(`${this.url}?type=album`, tags);
  }

  public more(tags: RecommendationPayload): Observable<Recommendation[]> {
    return this._http.post<Recommendation[]>(
      `${this.url}/extend?type=album`,
      tags,
    );
  }
}
