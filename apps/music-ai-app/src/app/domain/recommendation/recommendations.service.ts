import { Injectable } from '@angular/core';
import { Recommendation, RecommendationTag } from '@music-ai/recommendations';
import { rxState } from '@rx-angular/state';
import {
  filter,
  iif,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { Tags } from '../tags/tags.service';
import { RecommendationsApi } from './recommendations.api';

interface RecommendationState {
  recommendations: Recommendation[];
}

@Injectable({ providedIn: 'root' })
export class Recommendations {
  private _state = rxState<RecommendationState>(({ set }) =>
    set({ recommendations: [] }),
  );
  private readonly _controller$ = new Subject<'next' | 'prev'>();

  public recommendations$ = this._state.select('recommendations');

  constructor(
    private readonly _tags: Tags,
    private readonly _api: RecommendationsApi,
  ) {
    const tags$ = this._tags.selected$.pipe(
      map((tags) => tags.map((tag) => tag.name)),
      switchMap((tags) => merge(of([]), this.fetch(tags))),
    );

    this._state.connect('recommendations', tags$);
  }

  public readonly controller$ = this._controller$.asObservable();
  public readonly next$ = this._controller$.pipe(
    filter((action) => action === 'next'),
  );
  public readonly prev$ = this._controller$.pipe(
    filter((action) => action === 'prev'),
  );

  public next(): void {
    this._controller$.next('next');
  }

  public prev(): void {
    this._controller$.next('prev');
  }

  public fetch(tags: RecommendationTag[]): Observable<Recommendation[]> {
    const fetch$ = this._api
      .fetch({ tags })
      .pipe
      // catch rate limit errors
      ();

    return iif(() => tags.length === 0, of([]), fetch$);
  }
}
