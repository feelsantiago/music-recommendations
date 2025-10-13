import { Injectable, Injector } from '@angular/core';
import { Option } from '@music-ai/common';
import { Recommendation, RecommendationTag } from '@music-ai/recommendations';
import { rxState } from '@rx-angular/state';
import {
  catchError,
  combineLatest,
  filter,
  iif,
  map,
  merge,
  Observable,
  of,
  scan,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { notifyError } from '../../helpers/http-error';
import { Settings } from '../settings/settings.service';
import { Tags } from '../tags/tags.service';
import { RecommendationsApi } from './recommendations.api';

interface RecommendationState {
  recommendations: Recommendation[];
  current: number;
}

@Injectable({ providedIn: 'root' })
export class Recommendations {
  private _state = rxState<RecommendationState>(({ set }) =>
    set({ recommendations: [], current: 0 }),
  );
  private readonly _controller$ = new Subject<'next' | 'prev'>();

  public recommendations$ = this._state.select('recommendations');
  public current$ = this._state.select(
    ['recommendations', 'current'],
    ({ recommendations, current }) => Option.from(recommendations[current]),
  );
  public index$ = this._state.select('current');
  public length$ = this._state.select(
    'recommendations',
    (r) => r.length && r.length - 1,
  );

  constructor(
    private readonly _tags: Tags,
    private readonly _api: RecommendationsApi,
    private readonly _settings: Settings,
    private readonly _injector: Injector,
  ) {
    const tags$ = this._tags.selected$.pipe(
      map((tags) => tags.map((tag) => tag.name)),
      switchMap((tags) => merge(of([]), this.fetch(tags))),
    );

    const next$ = combineLatest({
      autoFetch: this._settings.autoFetch$,
      tags: this._tags.selected$,
      index: this.index$,
      length: this.length$,
    }).pipe(
      filter(({ autoFetch }) => autoFetch),
      filter(({ length }) => length > 0),
      filter(({ index, length }) => index === length),
      map(({ tags }) => tags.map((tag) => tag.name)),
      switchMap((tags) =>
        this._api.fetch({ tags }).pipe(
          notifyError(this._injector),
          catchError(() => of([])),
        ),
      ),
      scan(
        (recommendations, next) => [...recommendations, ...next],
        <Recommendation[]>[],
      ),
    );

    const recommendations$ = combineLatest([
      tags$,
      next$.pipe(startWith([])),
    ]).pipe(map(([tags, next]) => [...tags, ...next]));

    this._state.connect('recommendations', recommendations$);
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

  public current(index: number): void {
    this._state.set('current', () => index);
  }

  public fetch(tags: RecommendationTag[]): Observable<Recommendation[]> {
    const fetch$ = this._api.fetch({ tags }).pipe(
      notifyError(this._injector),
      catchError(() => of([])),
    );

    return iif(() => tags.length === 0, of([]), fetch$);
  }
}
