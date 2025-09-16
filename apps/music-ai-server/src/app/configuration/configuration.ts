import { INestApplication, Inject, Injectable } from '@nestjs/common';
import { SERVER_CONFIGURATIONS, ServerConfiguration } from './types';

@Injectable()
export class Configuration implements ServerConfiguration {
  constructor(
    @Inject(SERVER_CONFIGURATIONS)
    private readonly _configs: ServerConfiguration[],
  ) {}

  public setup(app: INestApplication): void {
    for (const config of this._configs) {
      config.setup(app);
    }
  }
}
