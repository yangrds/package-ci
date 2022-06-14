import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { MembersService } from './members.service'
import { Parameter, MembersList } from './members.interface'
import { Request } from 'express';
@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) { }
    // 录入成员
    @Post('create')
    Create(@Body() body: Parameter) {
        return this.membersService.Create(body)
    }
    // 成员列表
    @Post('read')
    Read(@Body() body: MembersList) {
        return this.membersService.Read(body)
    }

    // 成员删除
    @Post('delete')
    Delete(@Body() body: { id: string }) {
        return this.membersService.Delete(body)
    }

    // 成员修改
    @Post('update')
    Update(@Body() body: Parameter) {
        return this.membersService.Update(body)
    }

    // 成员登陆
    @Get('login')
    Login(@Query() params: { account: string; password: string; valid: number }) {
        return this.membersService.Login(params)
    }

    // 成员信息
    @Post('user-info')
    UserInfo(@Req() req: any) {
        return this.membersService.UserInfo(req.headers.token)
    }


}
