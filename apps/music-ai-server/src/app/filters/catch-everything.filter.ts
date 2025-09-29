import { AppError } from '@music-ai/common';
import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { match, P } from 'ts-pattern';
import { Config } from '../configuration/config';

@Catch()
export class CatchEverythingFilter extends BaseExceptionFilter {
  private readonly _logger = new Logger('CatchEverythingFilter');

  constructor(private readonly _config: Config) {
    super();
  }

  public override catch(exception: unknown, host: ArgumentsHost): void {
    super.catch(exception, host);
    this._log(exception);
  }

  private _log(error: unknown): void {
    match(error)
      .with(P.instanceOf(HttpException), (exception) => {
        this._logger.error(
          `[HTTP Exception] - ${exception.getStatus()} - ${exception.message}`,
        );

        if (this._config.env() === 'development') {
          this._debud(exception.cause);
        }
      })
      .otherwise(() => this._logger.error(error));
  }

  private _debud(error: unknown): void {
    match(error)
      .with(P.instanceOf(AppError), (appError) => {
        this._logger.debug(`\n${appError.log()}\n`);
        this._logger.debug(appError.sourceStack());
      })
      .otherwise(() => this._logger.debug(error));
  }
}
