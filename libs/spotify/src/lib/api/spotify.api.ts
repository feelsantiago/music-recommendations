import { err, Result, ResultAsync } from '@music-ai/common';
import { Recommendation } from '@music-ai/recommendations';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import {
  catchError,
  from,
  lastValueFrom,
  map,
  mergeMap,
  of,
  retry,
  toArray,
} from 'rxjs';
import { SpotifyError } from '../spotify.errors';
import {
  MODULE_OPTIONS_TOKEN,
  SpotifyModuleOptions,
} from '../spotify.module-definitions';
import { SpotifySearchType } from '../spotify.types';
import { SpotifySearchRequest } from './payload/spotify-search-request';
import {
  SpotifySearchResponse,
  SpotifySearchTypeResponse,
} from './payload/spotify-search-response';
import { SpotifyToken, SpotifyTokenPayload } from './spotify-token';

@Injectable()
export class SpotifyApi {
  private _accounts = 'https://accounts.spotify.com/api';
  private _spotify = 'https://api.spotify.com/v1';

  constructor(
    private readonly _http: HttpService,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly _options: SpotifyModuleOptions,
  ) {}

  public async token(): ResultAsync<SpotifyToken, SpotifyError> {
    const form = `grant_type=client_credentials&client_id=${this._options.clientId}&client_secret=${this._options.clientSecret}`;

    const request = this._http
      .post<SpotifyTokenPayload>(`${this._accounts}/token`, form, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        catchError((error) => err(SpotifyError.fetchToken(error))),
        map((response) => SpotifyToken.create(response.data)),
      );

    return lastValueFrom(request);
  }

  public async search(
    recommendations: Recommendation[],
    type: SpotifySearchType,
    token: SpotifyToken,
  ): ResultAsync<SpotifySearchTypeResponse[], SpotifyError> {
    const request = from(recommendations).pipe(
      mergeMap((recommendation) => {
        const payload = new SpotifySearchRequest(type, recommendation);
        return this._http
          .get(`${this._spotify}/search?${payload.params().toString()}`, {
            headers: {
              Authorization: token.authorization(),
            },
          })
          .pipe(
            retry(3),
            map((response) =>
              SpotifySearchResponse.createOrEmpty(
                type,
                recommendation,
                response.data,
              ),
            ),
            catchError(() => of(SpotifySearchResponse.empty(recommendation))),
          );
      }),
      toArray(),
    );

    return Result.fromAsync(() => lastValueFrom(request));
  }
}
