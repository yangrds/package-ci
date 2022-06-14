import { Injectable } from '@nestjs/common';
import { commandModel } from '@/project/project.sql'
import { _find, _findOne, _remove, _save } from '@/utils/sql';
import { uuid } from '@/utils/tool';

@Injectable()
export class CommandService {
    // 添加指令
    async CommandAdd(body: { command: string; args: string | string[]; project_id: string; commandId?: string }) {
        body.args = (body.args as string).split(',')
        body.commandId = uuid(16, 32)
        const sql = new commandModel(body)
        const data = await _save(sql)
        return data
    }

    // 指令列表
    async CommandList(body: { project_id: string }) {
        const res: any = await _find({ sql: commandModel, params: { project_id: body.project_id }, sort: { date: -1 } })
        return res
    }

    // 删除指令
    async CommandRemove(body: { commandId: string }) {
        const res = await _remove(commandModel, { commandId: body.commandId })
        return res
    }





}
