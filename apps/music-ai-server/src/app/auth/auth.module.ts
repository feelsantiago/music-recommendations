import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../configuration/configuration.module';
import { AuthController } from './auth.controller';
import { RegenerateSessionInterceptor } from './interceptors/regenerate-session.interceptor';

@Module({
  controllers: [AuthController],
  providers: [RegenerateSessionInterceptor],
  imports: [ConfigurationModule],
  exports: [],
})
export class AuthModule {}
