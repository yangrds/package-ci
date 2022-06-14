import { Module } from '@nestjs/common';
import { ClusterController } from './cluster.controller';
import { ClusterService } from './cluster.service';

@Module({
  controllers: [ClusterController],
  providers: [ClusterService]
})
export class ClusterModule {}
