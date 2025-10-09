import { Option, Result } from '@music-ai/common';
import { Recommendation, RecommendationData } from '@music-ai/recommendations';
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
    public readonly recommendation: RecommendationData,
    public readonly data: SpotifySearchResponsePayload,
  ) {}

  public static create(
    recommendation: RecommendationData,
    payload: SpotifySearchResponsePayload,
  ): Result<SpotifySearchResponse, SpotifyError> {
    return Result.from<SpotifySearchResponsePayload, SpotifyError>(() =>
      SpotifySearchResponse.schema$.parse(payload),
    )
      .map((payload) => new SpotifySearchResponse(recommendation, payload))
      .mapErr((error) => SpotifyError.search(error, { metadata: payload }));
  }

  public static empty(
    recommendation: RecommendationData,
  ): SpotifySearchResponse {
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

  public streaming(): Recommendation['streaming'] {
    if (this.data.albums.items.length === 0) {
      return [];
    }

    const items = this.data.albums.items[0];
    const images = items.images.map((image) => image.url);

    return [
      {
        name: 'spotify',
        cover: Option.from(images[0]).unwrapOr(''),
        url: items.external_urls.spotify,
      },
    ];
  }
}
