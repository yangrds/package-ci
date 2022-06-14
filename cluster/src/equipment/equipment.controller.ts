import { Body, Controller, Post, UploadedFile, UseInterceptors, Headers } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EquipmentService } from './equipment.service'
import { _File } from './equipment.interface';

@Controller('equipment')
export class EquipmentController {
    constructor(private readonly equipmentService: EquipmentService) { }
    @Post('system')
    getSystem() {
        return this.equipmentService.getSystem()
    }
    @Post('process-list')
    ProcessList() {
        return this.equipmentService.process_list()
    }

    @Post('process-kill')
    ProcessKill(@Body() body: { ip: string; id: string }) {
        return this.equipmentService.process_kill(body)
    }

    @Post('process-kill-all')
    ProcessKillAll() {
        return this.equipmentService.process_killAll()
    }

    @Post('process-init')
    ProcessInit() {
        return this.equipmentService.process_init()
    }

    @Post('process-start')
    ProcessStart(@Body() body: { ip: string; id: string }) {
        return this.equipmentService.process_start(body)
    }
    @Post('process-delete')
    ProcessDelete(@Body() body: {id: string }) {
        return this.equipmentService.process_delete(body)
    }
}
