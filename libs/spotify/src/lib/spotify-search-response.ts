import { Option, Result } from '@music-ai/common';
import { Recommendation } from '@music-ai/recommendations';
import z from 'zod';
import { SpotifyError } from './spotify.errors';

export type SpotifySearchResponsePayload = z.infer<
  typeof SpotifySearchResponse.schema$
>;

export class SpotifySearchResponse {
  public static schema$ = z.object({
    albums: z.object({
      items: z.array(
        z.object({
          name: z.string(),
          artists: z.array(
            z.object({
              name: z.string(),
            }),
          ),
          images: z.array(
            z.object({
              url: z.string(),
              height: z.number(),
              width: z.number(),
            }),
          ),
          external_urls: z.object({
            spotify: z.string(),
          }),
        }),
      ),
    }),
  });

  private constructor(
    private readonly _recommendation: Recommendation,
    public readonly data: SpotifySearchResponsePayload,
  ) {}

  public static create(
    recommendation: Recommendation,
    payload: SpotifySearchResponsePayload,
  ): Result<SpotifySearchResponse, SpotifyError> {
    return Result.from<SpotifySearchResponsePayload, SpotifyError>(() =>
      SpotifySearchResponse.schema$.parse(payload),
    )
      .map((payload) => new SpotifySearchResponse(recommendation, payload))
      .mapErr((error) => SpotifyError.search(error, { metadata: payload }));
  }

  public static empty(recommendation: Recommendation): SpotifySearchResponse {
    return new SpotifySearchResponse(recommendation, {
      albums: {
        items: [
          {
            name: recommendation.name,
            artists: [{ name: recommendation.artist }],
            images: [],
            external_urls: { spotify: '' },
          },
        ],
      },
    });
  }

  public recommendation(): Recommendation {
    if (this.data.albums.items.length === 0) {
      return { ...this._recommendation, metadata: [] };
    }

    const items = this.data.albums.items[0];
    const images = items.images.map((image) => image.url);

    return {
      ...this._recommendation,
      metadata: [
        {
          name: 'spotify',
          cover: Option.from(images[0]).unwrapOr(''),
          url: items.external_urls.spotify,
        },
      ],
    };
  }
}
