import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { link } from './utils/link'
import PackageConfig from './config'

async function bootstrap() {
  PackageConfig.keyInit()
  PackageConfig.staticInit()
  PackageConfig.adminInit()
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(7001);
  link()
}

bootstrap();
