import { err, ok, Result, ResultAsync } from '@music-ai/common';
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
import {
  SpotifySearchResponse,
  SpotifySearchResponsePayload,
} from './spotify-search-response';
import { SpotifyToken, SpotifyTokenPayload } from './spotify-token';
import { SpotifyError } from './spotify.errors';
import {
  MODULE_OPTIONS_TOKEN,
  SpotifyModuleOptions,
} from './spotify.module-definitions';

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
    token: SpotifyToken,
  ): ResultAsync<SpotifySearchResponse[], SpotifyError> {
    const request = from(recommendations).pipe(
      mergeMap((recommendation) => {
        // TODO: make payload for each type track, album, artist
        const params = new URLSearchParams({
          q: `album:${recommendation.name} artist:${recommendation.artist}`,
          type: 'album',
          limit: '1',
        });

        return this._http
          .get<SpotifySearchResponsePayload>(
            `${this._spotify}/search?${params.toString()}`,
            {
              headers: {
                Authorization: token.authorization(),
              },
            },
          )
          .pipe(
            // TODO: Retry When?
            retry(3),
            map((response) =>
              SpotifySearchResponse.create(recommendation, response.data),
            ),
            catchError(() =>
              of(ok(SpotifySearchResponse.empty(recommendation))),
            ),
          );
      }),
      toArray(),
      map((response) => response.map((search) => search.unwrap())),
    );

    return Result.fromAsync(() => lastValueFrom(request));
  }
}
