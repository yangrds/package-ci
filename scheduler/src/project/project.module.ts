import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectGateway } from './project.gateway';
import { ReleaseService } from './release/release.service';
import { ReleaseController } from './release/release.controller';
import { ProcessController } from './process/process.controller';
import { ProcessService } from './process/process.service';
import { CommandController } from './command/command/command.controller';
import { CommandService } from './command/command/command.service';

@Module({
  controllers: [ProjectController, ReleaseController, ProcessController, CommandController],
  providers: [ProjectService, ProjectGateway, ReleaseService, ProcessService, CommandService]
})
export class ProjectModule {}
