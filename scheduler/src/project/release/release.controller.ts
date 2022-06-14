import { Body, Controller, Post } from '@nestjs/common';
import { ReleaseService } from './release.service';
@Controller('release')
export class ReleaseController {
  constructor(private readonly releaseService: ReleaseService) { }
  @Post('release-list')
  release_list(@Body() body: { id: string }) {
    return this.releaseService.release_list({ id: body.id });
  }
  @Post('dev-release')
  dev_release(@Body() body: { id: string; release_id: string; uid: string; env: string }) {
    body.env = 'DEV';
    return this.releaseService.env_release(body);
  }
  @Post('test-release')
  test_release(@Body() body: { id: string; release_id: string; uid: string; env: string }) {
    body.env = 'TEST';
    return this.releaseService.env_release(body);
  }
  @Post('uat-release')
  uat_release(@Body() body: { id: string; release_id: string; uid: string; env: string }) {
    body.env = 'UAT';
    return this.releaseService.env_release(body);
  }
  @Post('prod-release')
  prod_release(@Body() body: { id: string; release_id: string; uid: string; env: string }) {
    body.env = 'PROD';
    return this.releaseService.env_release(body);
  }
}
