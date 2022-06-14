import { Body, Controller, Post, Req } from '@nestjs/common';
import { ProcessService } from './process.service'
import { Request } from 'express';
import { encrypt, decrypt } from '@/utils/verify'
@Controller('process')
export class ProcessController {
    constructor(private readonly processService: ProcessService) { }

    // TEST环境创建工单
    @Post('test-create')
    test_create(@Body() body: { id: string; userId: string, uid: string; job_id?: string }, @Req() req: Request) {
        let headers: any = req.headers
        try {
            let token: {
                account: string;
                password: string;
                job_id: string;
                valid: number;
                date: number
            } = JSON.parse(decrypt(headers.token))

            body.job_id = token.job_id
            return this.processService.test_create(body)
        } catch (error) {
            return { code: 500, msg: error.message }
        }

    }
    // UAT环境创建工单
    @Post('uat-create')
    uat_create(@Body() body: { id: string; userId: string, uid: string; job_id?: string }, @Req() req: Request) {

        let headers: any = req.headers
        try {
            let token: {
                account: string;
                password: string;
                job_id: string;
                valid: number;
                date: number
            } = JSON.parse(decrypt(headers.token))

            body.job_id = token.job_id
            return this.processService.uat_create(body)
        } catch (error) {
            return { code: 500, msg: error.message }
        }
    }
    // PROD环境创建工单
    @Post('prod-create')
    prod_create(@Body() body: { id: string; userId: string, uid: string; job_id?: string }, @Req() req: Request) {
        let headers: any = req.headers
        try {
            let token: {
                account: string;
                password: string;
                job_id: string;
                valid: number;
                date: number
            } = JSON.parse(decrypt(headers.token))

            body.job_id = token.job_id
            return this.processService.prod_create(body)
        } catch (error) {
            return { code: 500, msg: error.message }
        }
    }

    // TEST环境列表
    @Post('test-list')
    test_list(@Body() body: { pageIndex: number, pageSize: number, name: string, task_id: string, commit_id: string, releaseStatus: string, status: string, project_id: string }) {
        return this.processService.task_list({ ...body, env: 'TEST' })
    }
    // UAT环境列表
    @Post('uat-list')
    uat_list(@Body() body: { pageIndex: number, pageSize: number, name: string, task_id: string, commit_id: string, releaseStatus: string, status: string, project_id: string }) {
        return this.processService.task_list({ ...body, env: 'UAT' })
    }

    // PROD环境列表
    @Post('prod-list')
    prod_list(@Body() body: { pageIndex: number, pageSize: number, name: string, task_id: string, commit_id: string, releaseStatus: string, status: string, project_id: string }) {
        return this.processService.task_list({ ...body, env: 'PROD' })
    }

    // TEST环境工单详情
    @Post('test-task')
    test_task(@Body() body: { task_id: string }) {
        return this.processService.task_details({ ...body, env: 'TEST' })
    }
    // UAT环境工单详情
    @Post('uat-task')
    uat_task(@Body() body: { task_id: string }) {
        return this.processService.task_details({ ...body, env: 'UAT' })
    }
    // PROD环境工单详情
    @Post('prod-task')
    prod_task(@Body() body: { task_id: string }) {
        return this.processService.task_details({ ...body, env: 'PROD' })
    }
    // 工单更新
    @Post('task-update')
    task_update(@Body() body: { task_id: string; params: any, env: string }) {
        return this.processService.task_update(body)
    }
}


