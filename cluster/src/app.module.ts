import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EquipmentModule } from './equipment/equipment.module';
import { ReleaseModule } from './release/release.module';
import { PermissionMiddleware } from './middleware/permission.middleware'

@Module({
  imports: [EquipmentModule, ReleaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PermissionMiddleware)
      .forRoutes('*')
  }
}
