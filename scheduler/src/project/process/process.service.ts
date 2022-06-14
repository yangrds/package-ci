import { Injectable } from '@nestjs/common';
import { uuid } from '@/utils/tool'
import { _save, _find, _remove, _findOne, _updateOne, _findCount } from '../../utils/sql';
import { projectModel, testTaskModel, releaseModel, uatTaskModel, prodTaskModel } from '../project.sql';
import { ReleaseService } from '../release/release.service'
@Injectable()
export class ProcessService {
    constructor(private readonly releaseService: ReleaseService) { }

    // 任务工单列表
    async task_list(body: { pageIndex: number, pageSize: number, name: string, task_id: string, commit_id: string, releaseStatus: string, status: string, project_id: string, env: string }) {
        // 初始化检索参数
        let params: {
            task_id?: string,
            releaseStatus?: string,
            status?: string,
            project_id?: string;
        } = {}

        // 当前数据模型
        let TargetModel: any = {}

        // 根据环境不同，指定不同的数据模型
        switch (body.env) {
            case 'TEST':
                TargetModel = testTaskModel
                break;
            case 'UAT':
                TargetModel = uatTaskModel
                break;
            case 'PROD':
                TargetModel = prodTaskModel
                break;
        }

        /* 
        project_id、task_id、releaseStatus、status
        以上属性如果存在于body中，则加入检索条件中查询数据
        */

        if (body.project_id) {
            params.project_id = body.project_id
        }

        if (body.task_id) {
            params.task_id = body.task_id
        }
        if (body.releaseStatus != '99') {
            params.releaseStatus = body.releaseStatus
        }
        if (body.status != '99') {
            params.status = body.status
        }

        try {
            let parameter: any = [
                { $sort: { date: -1 } }
            ]
            // 如果body存在分页参数，则开启分页
            if (body.pageIndex && body.pageSize) {
                if (body.pageIndex > 0) {
                    body.pageIndex = (body.pageIndex - 1) * body.pageSize
                }
                parameter.push({ $skip: body.pageIndex })
                parameter.push({ $limit: body.pageSize })
            }

            parameter.push({
                $lookup: {
                    from: "project",
                    localField: "project_id",
                    foreignField: "project_id",
                    as: "project",
                }
            })

            parameter.push({
                $match: params
            })

            /* 
            聚合管道分类查询
            对聚合查询不是太熟悉，后期继续优化
            */
            let tasks = await TargetModel.aggregate([
                {
                    $facet: {
                        Data: parameter,
                        total: [
                            {
                                $match: params
                            },
                            {
                                $count: "total",
                            },
                        ]
                    }
                },
            ])
            let Data = JSON.parse(JSON.stringify(tasks[0]?.Data))
            /* 
            聚合管道数据加工
            将查询到的从表数据（project）从数组格式更改为键值对
            */
            Data = Data.map((item: any) => {
                let obj = JSON.parse(JSON.stringify(item))
                obj.project = {}
                if (item.project) {
                    let project = item.project[0]
                    project && (obj.project = {
                        qa: item.project[0].qa,
                        pm: item.project[0].pm,
                        devs: item.project[0].devs,
                        name: item.project[0].name,
                        describe: item.project[0].describe,
                    })
                }
                return obj
            })
            return { code: 200, data: Data, total: tasks[0]?.total[0]?.total, msg: null }
        } catch (error) {
            return { code: 500, data: [], total: 0, msg: error.message }
        }
    }
    // 工单详情
    async task_details(body: { task_id: string, env: string }) {
        let TargetModel: any = {}
        switch (body.env) {
            case 'TEST':
                TargetModel = testTaskModel
                break;
            case 'UAT':
                TargetModel = uatTaskModel
                break;
            case 'PROD':
                TargetModel = prodTaskModel
                break;
        }
        const taskRes: any = await _findOne(TargetModel, { task_id: body.task_id })

        if (taskRes.code != 200) {
            return taskRes;
        }

        // 查询工单对应项目
        const projectRes: any = await _findOne(projectModel, { project_id: taskRes.data.project_id });
        if (projectRes.code != 200) {
            return projectRes;
        }
        let Data = JSON.parse(JSON.stringify(taskRes.data))
        Data.project = {
            qa: projectRes.data.qa,
            pm: projectRes.data.pm,
            devs: projectRes.data.devs,
            name: projectRes.data.name,
            describe: projectRes.data.describe,
        }
        return { code: 200, data: Data }
    }

    // 更新工单数据
    async task_update(body: { task_id: string; params: any, env: string }) {

        let TargetModel = {}
        switch (body.env) {
            case 'TEST':
                TargetModel = testTaskModel
                break;
            case 'UAT':
                TargetModel = uatTaskModel
                break;
            case 'PROD':
                TargetModel = prodTaskModel
                break;
        }
        const updateRes = await _updateOne(
            TargetModel,
            body.params,
            { task_id: body.task_id },
        );
        return updateRes
    }

    // 创建TEST工单
    async test_create(body: { id: string; userId: string; uid: string; job_id?: string }) {

        // 查询工单对应项目
        const projectRes: any = await _findOne(projectModel, { project_id: body.id });
        if (projectRes.code != 200) {
            return projectRes;
        }

        // 查询工单对应构建数据
        const releaseRes: any = await _findOne(releaseModel, { uid: body.uid });
        if (releaseRes.code != 200) {
            return releaseRes;
        }

        let processInfo = {
            // 项目ID
            project_id: projectRes.data.project_id,
            // 构建ID
            release_id: releaseRes.data._id,
            // 任务ID
            task_id: uuid(8, 32),
            // 初始化状态
            status: '0',
            // 对应的版本ID
            uid: body.uid,
            // 初始化部署状态
            releaseStatus: '0',
            // 测试记录
            reason: "",
            // 创建者用户ID
            createUserId: body.job_id,
            // 静态资源压缩包大小
            size: releaseRes.data.size,
            // 构建时间
            build_date: releaseRes.data.date,
            // 源码提交版本
            commit_id: releaseRes.data.commit_id,
            // 部署时间
            releaseTime: false,
            // 审批时间
            taskEndTime: false
        }
        // 存储数据
        const sql = testTaskModel(processInfo)
        const processRes = await _save(sql)
        return processRes

    }

    // 创建UAT工单
    async uat_create(body: { id: string; userId: string, uid: string;job_id?: string }) {

        // 查询工单对应项目
        const projectRes: any = await _findOne(projectModel, { project_id: body.id });
        if (projectRes.code != 200) {
            return projectRes;
        }

        // 查询工单对应构建数据
        const releaseRes: any = await _findOne(releaseModel, { uid: body.uid });
        if (releaseRes.code != 200) {
            return releaseRes;
        }


        let processInfo = {
            // 项目ID
            project_id: projectRes.data.project_id,
            // 部署ID
            release_id: releaseRes.data._id,
            // 任务ID
            task_id: uuid(8, 32),
            // 初始化状态
            status: '0',
            // 对应版本ID
            uid: body.uid,
            // 初始化部署状态
            releaseStatus: '0',
            // UAT记录
            reason: "",
            // 创建者ID
            createUserId: body.job_id,
            // 静态资源压缩包大小
            size: releaseRes.data.size,
            // 构建ID
            build_date: releaseRes.data.date,
            // 源码提交版本
            commit_id: releaseRes.data.commit_id,
            // 部署时间
            releaseTime: false,
            // 审批时间
            taskEndTime: false
        }
        // 存储数据
        const sql = uatTaskModel(processInfo)
        const processRes = await _save(sql)
        return processRes

    }

    // 创建PROD工单
    async prod_create(body: { id: string; userId: string, uid: string;job_id?: string }) {

        // 查询工单对应项目
        const projectRes: any = await _findOne(projectModel, { project_id: body.id });
        if (projectRes.code != 200) {
            return projectRes;
        }

        // 查询工单对应构建数据
        const releaseRes: any = await _findOne(releaseModel, { uid: body.uid });
        if (releaseRes.code != 200) {
            return releaseRes;
        }


        let processInfo = {
            // 项目ID
            project_id: projectRes.data.project_id,
            // 构建ID
            release_id: releaseRes.data._id,
            // 任务ID
            task_id: uuid(8, 32),
            // 初始化状态
            status: '0',
            // 对应版本ID
            uid: body.uid,
            // 初始化部署状态
            releaseStatus: '0',
            // 记录
            reason: "",
            // 创建者ID
            createUserId: body.job_id,
            // 静态资源压缩包大小
            size: releaseRes.data.size,
            // 构建时间
            build_date: releaseRes.data.date,
            // 源码提交版本
            commit_id: releaseRes.data.commit_id,
            // 构建时间
            releaseTime: false,
            // 任务结束时间
            taskEndTime: false
        }
        const sql = prodTaskModel(processInfo)
        const processRes = await _save(sql)
        return processRes

    }
}
