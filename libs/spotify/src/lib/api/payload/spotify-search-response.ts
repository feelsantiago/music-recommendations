import { NotEmptyList, Option, Result } from '@music-ai/common';
import { Recommendation, RecommendationCover } from '@music-ai/recommendations';
import { match } from 'ts-pattern';
import z from 'zod';
import { SpotifyError } from '../../spotify.errors';
import { SpotifySearchType } from '../../spotify.types';

export interface SpotifySearchTypeResponse {
  recommendation(): Recommendation;
}

export class SpotifySearchResponse implements SpotifySearchTypeResponse {
  public static item$ = z.object({
    name: z.string(),
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
  });

  public static items$ = z.array(SpotifySearchResponse.item$);

  constructor(
    private readonly _data: z.infer<typeof SpotifySearchResponse.items$>,
    private readonly _recommendation: Recommendation,
  ) {}

  public static from(
    type: SpotifySearchType,
    recommendation: Recommendation,
    data: Record<string, unknown>,
  ): Result<SpotifySearchTypeResponse, SpotifyError> {
    return match(type)
      .with('track', () =>
        SpotifySearchTrackResponse.create(recommendation, data),
      )
      .with('album', () =>
        SpotifySearchAlbumResponse.create(recommendation, data),
      )
      .with('artist', () =>
        SpotifySearchArtistResponse.create(recommendation, data),
      )
      .exhaustive();
  }

  public static createOrEmpty(
    type: SpotifySearchType,
    recommendation: Recommendation,
    data: Record<string, unknown>,
  ): SpotifySearchTypeResponse {
    return SpotifySearchResponse.from(type, recommendation, data).match({
      ok: (response) => response,
      err: () => SpotifySearchResponse.empty(recommendation),
    });
  }

  public static empty(
    recommendation: Recommendation,
  ): SpotifySearchTypeResponse {
    return new SpotifySearchResponse(
      [
        {
          name: recommendation.name,
          images: [],
          external_urls: { spotify: '' },
        },
      ],
      recommendation,
    );
  }

  public recommendation(): Recommendation {
    const recommendation = NotEmptyList.create(this._data)
      .map((list) => list.head())
      .map((item) => ({
        ...this._recommendation,
        metadata: [
          {
            name: 'spotify',
            images: item.images as RecommendationCover[],
            url: item.external_urls.spotify,
          },
        ],
      }));

    return recommendation.unwrapOr({ ...this._recommendation, metadata: [] });
  }
}

export class SpotifySearchAlbumResponse extends SpotifySearchResponse {
  public static album$ = z.object({
    albums: z.object({
      items: SpotifySearchResponse.items$,
    }),
  });

  private constructor(
    data: z.infer<typeof SpotifySearchAlbumResponse.album$>,
    recommendation: Recommendation,
  ) {
    super(data.albums.items, recommendation);
  }

  public static create(
    recommendation: Recommendation,
    data: Record<string, unknown>,
  ): Result<SpotifySearchTypeResponse, SpotifyError> {
    return Result.from(() => SpotifySearchAlbumResponse.album$.parse(data))
      .map((data) => new SpotifySearchAlbumResponse(data, recommendation))
      .mapErr((error) =>
        SpotifyError.search('album', error as Error, { metadata: data }),
      );
  }
}

export class SpotifySearchArtistResponse extends SpotifySearchResponse {
  public static artist$ = z.object({
    artists: z.object({
      items: SpotifySearchResponse.items$,
    }),
  });

  private constructor(
    data: z.infer<typeof SpotifySearchArtistResponse.artist$>,
    recommendation: Recommendation,
  ) {
    super(data.artists.items, recommendation);
  }

  public static create(
    recommendation: Recommendation,
    data: Record<string, unknown>,
  ): Result<SpotifySearchTypeResponse, SpotifyError> {
    return Result.from(() => SpotifySearchArtistResponse.artist$.parse(data))
      .map((data) => new SpotifySearchArtistResponse(data, recommendation))
      .mapErr((error) =>
        SpotifyError.search('artist', error as Error, { metadata: data }),
      );
  }
}

export class SpotifySearchTrackResponse extends SpotifySearchResponse {
  public static track$ = z.object({
    tracks: z.object({
      items: z.array(
        z.object({
          album: SpotifySearchResponse.item$,
        }),
      ),
    }),
  });

  private constructor(
    data: z.infer<typeof SpotifySearchTrackResponse.items$>,
    recommendation: Recommendation,
  ) {
    super(data, recommendation);
  }

  public static create(
    recommendation: Recommendation,
    data: Record<string, unknown>,
  ): Result<SpotifySearchTypeResponse, SpotifyError> {
    return Result.from(() => SpotifySearchTrackResponse.track$.parse(data))
      .map((response) => Option.from(response.tracks.items[0]))
      .inspectErr((item) => console.log(item))
      .map((item) =>
        item.match({
          some: (item) =>
            new SpotifySearchTrackResponse([item.album], recommendation),
          none: () => SpotifySearchTrackResponse.empty(recommendation),
        }),
      )
      .mapErr((error) =>
        SpotifyError.search('track', error as Error, { metadata: data }),
      );
  }
}
