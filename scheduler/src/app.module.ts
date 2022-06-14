import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './members/members.module';
import { ProjectModule } from './project/project.module';
import { ClusterModule } from './cluster/cluster.module';
import { AuthenticationMiddleware } from './middleware/authentication/authentication.middleware'
import { RootMiddleware } from './middleware/root/root.middleware'
import { UserUpdateMiddleware } from './middleware/user-update/user-update.middleware'

@Module({
  imports: [MembersModule, ProjectModule, ClusterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({ path: '/members/login', method: RequestMethod.ALL })
      .forRoutes('project', 'release', 'process', 'cluster', 'members')
      .apply(UserUpdateMiddleware)
      .forRoutes({ path: '/members/update', method: RequestMethod.ALL })
      .apply(RootMiddleware)
      .forRoutes(
        { path: '/cluster/cluster-remove', method: RequestMethod.ALL },
        { path: '/members/delete', method: RequestMethod.ALL },
        { path: '/project/remove', method: RequestMethod.ALL },
        { path: '/project/create', method: RequestMethod.ALL },
        )
  }
}