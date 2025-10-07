import { Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';

interface LoaderState {
  pending: number;
}

@Injectable({ providedIn: 'root' })
export class Loader {
  private _state = rxState<LoaderState>(({ set }) => set({ pending: 0 }));

  public loading$ = this._state.select('pending', (pending) => pending > 0);
  public pending$ = this._state.select('pending');

  public start(): void {
    this._state.set('pending', ({ pending }) => pending + 1);
  }

  public finish(): void {
    this._state.set('pending', ({ pending }) =>
      pending > 0 ? pending - 1 : 0,
    );
  }

  public clear(): void {
    this._state.set('pending', () => 0);
  }
}
