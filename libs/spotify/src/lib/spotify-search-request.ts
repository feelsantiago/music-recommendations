import { Recommendation, RecommendationType } from '@music-ai/recommendations';
import { match } from 'ts-pattern';

type SpotifySearchType = 'album' | 'artist' | 'track';

export class SpotifySearchRequest {
  constructor(
    private readonly _type: SpotifySearchType,
    private readonly _recommendation: Recommendation,
  ) {}

  public static create(
    type: RecommendationType,
    recommendation: Recommendation,
  ): SpotifySearchRequest {
    return match(type)
      .with('album', () => new SpotifySearchRequest('album', recommendation))
      .with('artist', () => new SpotifySearchRequest('artist', recommendation))
      .with('song', () => new SpotifySearchRequest('track', recommendation))
      .exhaustive();
  }

  public params(): URLSearchParams {
    const artist =
      this._type !== 'track' ? `artist:${this._recommendation.artist}` : '';
    return new URLSearchParams({
      q: `${this._type}:${this._recommendation.name} ${artist}`.trim(),
      type: this._type,
      limit: '1',
    });
  }
}
