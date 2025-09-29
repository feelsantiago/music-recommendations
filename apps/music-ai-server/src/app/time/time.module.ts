import { Module } from '@nestjs/common';
import { ApplicationTime } from './application-time';

@Module({
  providers: [ApplicationTime],
  exports: [ApplicationTime],
})
export class TimeModule {}
