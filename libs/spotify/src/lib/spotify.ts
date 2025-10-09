import {
  none,
  ok,
  Option,
  ResultAsync,
  safeTryBind,
  some,
} from '@music-ai/common';
import { Recommendation } from '@music-ai/recommendations';
import { Injectable } from '@nestjs/common';
import { SpotifyToken } from './spotify-token';
import { SpotifyApi } from './spotify.api';
import { SpotifyError } from './spotify.errors';

@Injectable()
export class Spotify {
  private _token: Option<SpotifyToken> = none;

  constructor(private readonly _api: SpotifyApi) {}

  public async metadata(
    recommendations: Recommendation[],
  ): ResultAsync<Recommendation[], SpotifyError> {
    return await safeTryBind(this, async function* ({ $async }) {
      const token = yield* $async(this.token());
      const search = yield* $async(this._api.search(recommendations, token));
      return ok(search.map((response) => response.recommendation()));
    });
  }

  public async token(): ResultAsync<SpotifyToken, SpotifyError> {
    if (this._token.isNone() || this._token.unwrap().expired()) {
      const result = await this._api.token();
      return result.inspect((token) => {
        this._token = some(token);
      });
    }

    return ok(this._token.unwrap());
  }
}
