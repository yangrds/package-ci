import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { _File, EnvInfo } from 'src/equipment/equipment.interface';
import { ReleaseService } from 'src/release/release.service'

@Controller('release')
export class ReleaseController {
    constructor(private readonly releaseService: ReleaseService) { }
    @Post('dev_release')
    @UseInterceptors(FileInterceptor("file"))
    async dev_release(@UploadedFile() file: _File, @Body() body) {
        body.file = file
        return this.releaseService.env_release(body)
    }
    @Post('prod_release')
    @UseInterceptors(FileInterceptor("file"))
    async prod_release(@UploadedFile() file: _File, @Body() body) {
        body.file = file
        return this.releaseService.env_release(body)
    }
    @Post('init-env')
    async init_env(@Body() body: { id: string; envInfo: EnvInfo, type: string; name: string }) {
        return this.releaseService.init_env(body)
    }

}
