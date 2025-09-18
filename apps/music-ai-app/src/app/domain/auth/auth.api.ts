import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly _url = '/api/auth';

  constructor(private readonly _http: HttpClient) {}

  public session(): Observable<Session> {
    return this._http.get<Session>(`${this._url}/session`);
  }

  // TODO: remove
  public test(): Observable<void> {
    return this._http.post<void>(`${this._url}/test`, {});
  }
}
