import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Config } from './app/configuration/config';
import { Configuration } from './app/configuration/configuration';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configuration = app.get(Configuration);
  configuration.setup(app);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = app.get(Config);
  const port = config.port();

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
