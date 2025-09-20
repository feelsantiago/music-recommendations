import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, Env } from '../../../environments/env';
import { Session } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private get _url(): string {
    return `${this._config.api}/auth`;
  }

  constructor(
    @Inject(APP_CONFIG) private readonly _config: Env,
    private readonly _http: HttpClient,
  ) {}

  public session(): Observable<Session> {
    return this._http.get<Session>(`${this._url}/session`);
  }

  // TODO: remove
  public test(): Observable<void> {
    return this._http.post<void>(`${this._url}/test`, {});
  }
}
