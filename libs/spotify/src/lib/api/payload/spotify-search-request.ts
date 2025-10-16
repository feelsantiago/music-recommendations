import { Recommendation } from '@music-ai/recommendations';
import { SpotifySearchType } from '../../spotify.types';

export class SpotifySearchRequest {
  constructor(
    public readonly type: SpotifySearchType,
    public readonly recommendation: Recommendation,
  ) {}

  public params(): URLSearchParams {
    const artist =
      this.type === 'artist' ? '' : `artist:${this.recommendation.artist}`;
    return new URLSearchParams({
      q: `${this.type}:${this.recommendation.name} ${artist}`.trim(),
      type: this.type,
      limit: '1',
    });
  }
}
