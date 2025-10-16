import { Injectable, Injector } from '@angular/core';
import { Option } from '@music-ai/common';
import { Recommendation, RecommendationType } from '@music-ai/recommendations';
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
  shareReplay,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { notifyError } from '../../helpers/http-error';
import { Settings } from '../settings/settings.service';
import { Tags } from '../tags/tags.service';
import { TagSelected } from '../tags/tags.types';
import { RecommendationsApi } from './recommendations.api';

interface RecommendationState {
  recommendations: Recommendation[];
  current: number;
  type: RecommendationType;
}

@Injectable({ providedIn: 'root' })
export class Recommendations {
  private _state = rxState<RecommendationState>(({ set }) =>
    set({ recommendations: [], current: 0, type: 'album' }),
  );
  private readonly _controller$ = new Subject<'next' | 'prev'>();

  public recommendations$ = this._state.select('recommendations');
  public type$ = this._state.select('type');
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
    const recommendations$ = combineLatest([
      this._tags.selected$,
      this.type$,
    ]).pipe(
      tap(() => this.current(0)),
      switchMap(([tags, type]) => merge(of([]), this.fetch(tags, type))),
      shareReplay(1),
    );

    const selection$ = combineLatest({
      tags: this._tags.selected$,
      type: this.type$,
    });

    const next$ = combineLatest({
      autoFetch: this._settings.autoFetch$,
      index: this.index$,
      length: this.length$,
    }).pipe(
      filter(({ autoFetch }) => autoFetch),
      filter(({ length }) => length > 0),
      filter(({ index, length }) => index === length),
      withLatestFrom(selection$),
      switchMap(([_, { tags, type }]) => {
        const names = tags.map((tag) => tag.name);
        return this._api.fetch({ tags: names }, type).pipe(
          notifyError(this._injector),
          catchError(() => of([])),
        );
      }),
      scan(
        (recommendations, next) => [...recommendations, ...next],
        <Recommendation[]>[],
      ),
      withLatestFrom(recommendations$),
      map(([next, tags]) => [...tags, ...next]),
    );

    this._state.connect(
      'recommendations',
      merge(recommendations$, this.type$.pipe(switchMap(() => next$))),
    );
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

  public type(type: RecommendationType): void {
    this._state.set('type', () => type);
  }

  public fetch(
    tags: TagSelected[],
    type: RecommendationType,
  ): Observable<Recommendation[]> {
    const names = tags.map((tag) => tag.name);
    const fetch$ = this._api.fetch({ tags: names }, type).pipe(
      notifyError(this._injector),
      catchError(() => of([])),
    );

    return iif(() => tags.length === 0, of([]), fetch$);
  }
}
