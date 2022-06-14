import { Injectable } from '@nestjs/common';
import { Parameter, MembersList } from './members.interface'
import { memberModel } from './members.sql'
import { _save, _find, _remove, _updateOne, _findCount, _findOne, ModelResult } from '../utils/sql'
import { uuid } from '@/utils/tool';
import { encrypt, decrypt } from '@/utils/verify'
@Injectable()
export class MembersService {
    async Login(body: { account: string; password: string; valid: number }): Promise<any> {
        const isRepeatRes: any = await _findOne(memberModel, { account: body.account })
        if (isRepeatRes.code != 200) return isRepeatRes
        if (!isRepeatRes.data) return { code: 500, msg: '无效用户名' }
        if (isRepeatRes.data.pwd != body.password) return { code: 500, msg: '密码错误' }
        let token = {
            account: isRepeatRes.data.account,
            access: isRepeatRes.data.access,
            password: isRepeatRes.data.pwd,
            job_id: isRepeatRes.data.job_id,
            valid: (body.valid * 86400000),
            date: Math.round(new Date() as any)
        }
        return { code: 200, data: encrypt(JSON.stringify(token)) }
    }
    async UserInfo(str: string): Promise<any> {
        let token: {
            account: string;
            access: string;
            password: string;
            job_id: string;
            valid: number;
            date: number
        } = JSON.parse(decrypt(str))


        // 用户数据数据查询
        const user: ModelResult = await _findOne(memberModel, { account: token.account })


        if (user.code != 200) {
            return { code: 500, data: null, msg: '数据查询失败' }
        }

        return {
            code: 200,
            data: {
                name: user.data.name,
                account: user.data.account,
                access: user.data.access,
                user: user.data.account,
                jobName: user.data.jobName,
                remark: user.data.remark,
                job_id: user.data.job_id
            },
        }
    }
    // 录入团队成员
    async Create(body: Parameter): Promise<any> {
        body.job_id = uuid(16, 32)
        delete body._id
        delete body.__v

        const isRepeatRes: any = await _findOne(memberModel, { account: body.account })
        if (isRepeatRes.data) return { code: 500, msg: '用户名已存在' }

        const sql = new memberModel(body)
        const data = await _save(sql)
        return data
    }
    // 团队成员列表
    async Read(body: MembersList) {
        const query: any = { sql: memberModel }
        if (query.skip) {
            query.skip = body.pageIndex
            query.limit = body.pageSize
        }
        try {
            const res: any = await _find(query)
            if (res.code === 200) {
                res.data.forEach((item: any) => item.pwd = '')
            }
            const total: any = await _findCount(memberModel)
            res.total = total.data
            return res
        } catch (error) {
            return { code: 500, msg: error.message }
        }

    }
    // 删除团队成员
    async Delete(body: { id: string }) {
        const data = await _remove(memberModel, { _id: body.id })
        return data
    }

    async Update(body: Parameter) {
        let job_id = body.job_id
        delete body.job_id
        delete body._id
        delete body.__v
        const data = await _updateOne(memberModel, body, { job_id })
        return data
    }
}