import { Body, Controller, Post } from '@nestjs/common';
import { ClusterService } from './cluster.service'
import { Host } from './cluster.interface'

@Controller('cluster')
export class ClusterController {
    constructor(private readonly clusterService: ClusterService) { }
    @Post('load-config')
    loadConfig(@Body() body: { ip: string; port: number }) {
        return this.clusterService.loadConfig(body)
    }
    @Post('cluster-create')
    clusterCreate(@Body() body: Host) {
        return this.clusterService.clusterCreate(body)
    }
    @Post('cluster-list')
    clusterList() {
        return this.clusterService.clusterList()
    }
    @Post('cluster-remove')
    clusterRemove(@Body() body: { ip: string }) {
        return this.clusterService.clusterRemove(body)
    }

    @Post('process-list')
    processList(@Body() body: { ip: string }) {
        return this.clusterService.process_list(body)
    }
    @Post('process-kill')
    ProcessKill(@Body() body: { ip: string; id: string }) {
        return this.clusterService.process_kill(body)
    }
    @Post('process-kill-all')
    ProcessKillAll(@Body() body: { ip: string; }) {
        return this.clusterService.process_killAll(body)
    }

    @Post('process-init')
    processInit(@Body() body: { ip: string; }) {
        return this.clusterService.process_init(body)
    }

    @Post('process-start')
    ProcessStart(@Body() body: { ip: string; id: string }) {
        return this.clusterService.process_start(body)
    }

    @Post('process-delete')
    ProcessDelete(@Body() body: { ip: string; id: string }) {
        return this.clusterService.process_delete(body)
    }
}
