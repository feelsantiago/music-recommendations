import { INestApplication } from '@nestjs/common';

export interface GlobalMiddleware {
  apply(app: INestApplication): void;
}
