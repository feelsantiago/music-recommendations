import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../configuration/configuration.module';
import { AuthController } from './auth.controller';
import { SessionInterceptor } from './interceptors/session.interceptor';

@Module({
  controllers: [AuthController],
  providers: [SessionInterceptor],
  imports: [ConfigurationModule],
  exports: [],
})
export class AuthModule {}
