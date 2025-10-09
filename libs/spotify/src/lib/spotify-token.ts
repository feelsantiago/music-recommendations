import { Duration, Result } from '@music-ai/common';
import * as z from 'zod';
import { SpotifyError } from './spotify.errors';

export type SpotifyTokenPayload = z.infer<typeof SpotifyToken.schema$>;

export class SpotifyToken {
  public static schema$ = z.object({
    access_token: z.string(),
    token_type: z.literal('Bearer'),
    expires_in: z.number(),
  });

  private _createdAt = Date.now();

  constructor(public readonly token: string) {}

  public static create(
    payload: SpotifyTokenPayload,
  ): Result<SpotifyToken, SpotifyError> {
    return Result.from<SpotifyTokenPayload, SpotifyError>(() =>
      SpotifyToken.schema$.parse(payload),
    )
      .map((token) => new SpotifyToken(token.access_token))
      .mapErr((error) =>
        SpotifyError.invalidToken(error, { metadata: payload }),
      );
  }

  public expired(): boolean {
    const hour = Duration.hours(1);
    return Date.now() - this._createdAt > hour.calculate();
  }

  public authorization(): string {
    return `Bearer ${this.token}`;
  }
}
