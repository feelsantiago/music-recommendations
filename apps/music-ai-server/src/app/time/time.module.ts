import { Global, Module } from '@nestjs/common';
import { ApplicationTime } from './application-time';

@Global()
@Module({
  providers: [ApplicationTime],
  exports: [ApplicationTime],
})
export class TimeModule {}
