import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { init } from './plugin/start';
import PackageConfig from './config'


async function bootstrap() {
  PackageConfig.init()
  const app = await NestFactory.create(AppModule);
  await app.listen(9001);
  init()
}
bootstrap(); 
