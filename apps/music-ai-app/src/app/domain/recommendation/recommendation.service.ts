import { Injectable } from '@angular/core';
import { filter, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Recommendation {
  private readonly _controller$ = new Subject<'next' | 'prev'>();

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
}
