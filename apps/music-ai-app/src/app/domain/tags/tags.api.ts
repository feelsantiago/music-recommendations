import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SystemTags } from '@music-ai/tags';
import { Observable } from 'rxjs';
import { APP_CONFIG, Env } from '../../../environments/env';

@Injectable({ providedIn: 'root' })
export class TagsApi {
  public get url(): string {
    return `${this._config.api}/tags`;
  }

  constructor(
    @Inject(APP_CONFIG) private readonly _config: Env,
    private readonly _http: HttpClient,
  ) {}

  public all(): Observable<SystemTags> {
    return this._http.get<SystemTags>(`${this.url}`);
  }
}
