import { Body, Controller, Post } from '@nestjs/common';
import { ProjectService } from './project.service'
import { ENVS, Project } from './project.interface'
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }
    @Post('create')
    Create(@Body() body: Project) {
        return this.projectService.Create(body)
    }
    @Post('read')
    Read() {
        return this.projectService.Read()
    }
    @Post('remove')
    Remove(@Body() body: { id: string }) {
        return this.projectService.Remove(body)
    }
    @Post('details')
    Details(@Body() body: { id: string }) {
        return this.projectService.Details(body)
    }

    @Post('build-version')
    build_version(@Body() body: { id: string; pack: string }) {
        return this.projectService.build_version(body)
    }


    @Post('origin-pull')
    origin_pull(@Body() body: { id: string }) {
        return this.projectService.origin_pull(body)
    }


    @Post('read-version')
    read_version(@Body() body: { id: string }) {
        return this.projectService.read_version(body)
    }

    @Post('origin-branch')
    origin_branch(@Body() body: { id: string }) {
        return this.projectService.origin_branch(body)
    }

    @Post('local-version')
    local_version(@Body() body: { id: string }) {
        return this.projectService.local_version(body)
    }

    @Post('local-branch')
    local_branch(@Body() body: { id: string }) {
        return this.projectService.local_branch(body)
    }
    @Post('local-checkout')
    local_checkout(@Body() body: { localPath: string; branch: string; id: string }) {
        return this.projectService.local_checkout(body)
    }
    @Post('checkout-origin')
    checkout_origin(@Body() body: { id: string, branch: string }) {
        return this.projectService.checkout_origin(body)
    }
    @Post('delete-branch')
    delete_branch(@Body() body: { id: string, branch: string }) {
        return this.projectService.delete_branch(body)
    }

    @Post('server-update')
    ServerUpdate(@Body() body: { dev_ip: string; prod_ip: string; envs: ENVS; _id: string; name: string }) {
        return this.projectService.ServerUpdate(body)
    }

    @Post('update')
    Update(@Body() body: { project_id: string; devs: string; pm: ENVS; qa: string; buildName: string; describe: string; notice: string }) {
        return this.projectService.Update(body)
    }
}
