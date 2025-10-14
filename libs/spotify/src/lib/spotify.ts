import {
  none,
  ok,
  Option,
  ResultAsync,
  safeTryBind,
  some,
} from '@music-ai/common';
import {
  Recommendation,
  RecommendationError,
  RecommendationsMetadata,
  RecommendationType,
} from '@music-ai/recommendations';
import { Injectable } from '@nestjs/common';
import { match, P } from 'ts-pattern';
import { SpotifyToken } from './spotify-token';
import { SpotifyApi } from './spotify.api';
import { SpotifyError } from './spotify.errors';

@Injectable()
export class Spotify implements RecommendationsMetadata {
  private _token: Option<SpotifyToken> = none;

  constructor(private readonly _api: SpotifyApi) {}

  public async fetch(
    recommendations: Recommendation[],
    type: RecommendationType,
  ): ResultAsync<Recommendation[], RecommendationError> {
    const result = await safeTryBind(this, async function* ({ $async }) {
      const token = yield* $async(this.token());
      const search = await this._api.search(recommendations, type, token);
      return search.map((response) => response.map((r) => r.recommendation()));
    });

    return result.mapErr((error) => this._error(error));
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

  private _error(error: SpotifyError): RecommendationError {
    return match(error.type)
      .with(
        P.union('search_error', 'fetch_token_error', 'invalid_token_payload'),
        () => RecommendationError.metadata(error),
      )
      .exhaustive();
  }
}
