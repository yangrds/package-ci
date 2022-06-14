import { Body, Controller, Post } from '@nestjs/common';
import { CommandService } from './command.service'

@Controller('command')
export class CommandController {
    constructor(private readonly commandService: CommandService) { }
    @Post('add')
    CommandAdd(@Body() body: { command: string; args: string; project_id: string }) {
        return this.commandService.CommandAdd(body)
    }
    @Post('list')
    CommandList(@Body() body: { project_id: string }) {
        return this.commandService.CommandList(body)
    }

    @Post('remove')
    CommandRemove(@Body() body: { commandId: string }) {
        return this.commandService.CommandRemove(body)
    }


}
