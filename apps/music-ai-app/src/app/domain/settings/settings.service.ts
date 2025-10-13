import { Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';

interface SettingsState {
  autoFetch: boolean;
}

@Injectable({ providedIn: 'root' })
export class Settings {
  private readonly _state = rxState<SettingsState>(({ set }) =>
    set({ autoFetch: true }),
  );

  public autoFetch$ = this._state.select('autoFetch');

  public autoFetch(status: boolean): void {
    this._state.set('autoFetch', () => status);
  }
}
