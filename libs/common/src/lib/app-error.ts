import { Option } from '@sapphire/result';
import { match, P } from 'ts-pattern';

export interface AppErrorOptions {
  name?: string;
  source?: Error;
  metadata?: Record<string, unknown>;
}

export class AppError extends Error {
  public readonly source: Option<Error>;
  public readonly metadata: Record<string, unknown>;

  public constructor(message: string, options: AppErrorOptions = {}) {
    super(message);

    this.source = Option.from(options.source);
    this.metadata = options.metadata ?? {};
    this.name = options.name ?? this.constructor.name;
  }

  public static create(
    message: string,
    options: AppErrorOptions = {},
  ): AppError {
    return new AppError(message, options);
  }

  public context(
    message: string,
    metadata: Record<string, unknown> = {},
  ): AppError {
    return new AppError(message, { source: this, metadata, name: this.name });
  }

  public log(): string {
    const source = this.source.match({
      some: (error) => error,
      none: () => new Error(),
    });

    const trace = match(source)
      .with(P.instanceOf(AppError), (error) => `\n\t|- ${error.log()}`)
      .with({ message: P.string.length(0) }, () => '')
      .otherwise((error) => `\n\t[${error.name}] - ${error.message}`);

    return `[${this.name}] - ${this.message}${trace} - Metadata: ${JSON.stringify(
      this.metadata,
    )}`;
  }
}
