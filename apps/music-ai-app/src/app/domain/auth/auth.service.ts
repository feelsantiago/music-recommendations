import { Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { map } from 'rxjs';
import { AuthApi } from './auth.api';
import { Session } from './auth.types';

interface AuthState {
  session: Session;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private _state = rxState<AuthState>(({ set }) =>
    set({ session: { csrf: '' } }),
  );

  public session$ = this._state.select('session');
  public csrf$ = this.session$.pipe(map(({ csrf }) => csrf));

  constructor(private readonly _api: AuthApi) {
    this._state.connect('session', this._api.session());
  }
}
