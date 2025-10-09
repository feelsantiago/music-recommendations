import { AppError, AppErrorOptions } from '@music-ai/common';

export type SpotifyErrorName =
  | 'fetch_token_error'
  | 'invalid_token_payload'
  | 'search_error';

export class SpotifyError extends AppError {
  private constructor(
    public readonly type: SpotifyErrorName,
    message: string,
    options: Omit<AppErrorOptions, 'name'> = {},
  ) {
    super(message, { ...options, name: type });
  }

  public static invalidToken(
    source: Error,
    options: Omit<AppErrorOptions, 'name'> = {},
  ): SpotifyError {
    return new SpotifyError(
      'invalid_token_payload',
      '[Spotify] - Invalid token payload',
      {
        ...options,
        source,
      },
    );
  }

  public static fetchToken(
    source: Error,
    options: Omit<AppErrorOptions, 'name'> = {},
  ): SpotifyError {
    return new SpotifyError(
      'fetch_token_error',
      '[Spotify] - Unable to fetch token',
      {
        ...options,
        source,
      },
    );
  }

  public static search(
    source: Error,
    options: Omit<AppErrorOptions, 'name'> = {},
  ): SpotifyError {
    return new SpotifyError('search_error', '[Spotify] - Unable to search', {
      ...options,
      source,
    });
  }
}
