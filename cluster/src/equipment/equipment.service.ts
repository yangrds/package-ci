import { Injectable } from '@nestjs/common';
import { SystemInfo, Disk, _File } from './equipment.interface'
import * as os from 'os';
import * as fs from 'fs-extra';
import * as path from 'path';
import { get_process_container, init, process_container } from '../plugin/start';
import got from 'got';
import PackageConfig from '../config'

// 心跳检查
function ServerStatus(port: string): Promise<{ status: boolean, msg: string }> {
    return new Promise(async (resolove) => {
        try {
            await got.post(`http://0.0.0.0:${port}/status`, {
                json: {},
                timeout: {
                    lookup: 100,
                    connect: 3000
                }
            }).json();
            resolove({ status: true, msg: '' })
        } catch (error) {
            resolove({ status: false, msg: error.message })
        }
    })

}


@Injectable()
export class EquipmentService {
    async getSystem() {
        const syatemInfo: SystemInfo = {}
        // 处理器
        syatemInfo.cpus = os.cpus()
        // 操作系统 CPU 架构
        syatemInfo.arch = os.arch()
        // 以整数形式返回空闲的系统内存量（以字节为单位）
        syatemInfo.totalmem = os.totalmem()
        // 以字符串形式返回操作系统的主机名。
        syatemInfo.hostname = os.hostname()
        // 返回包含已分配网络地址的网络接口的对象。
        syatemInfo.networkInterfaces = os.networkInterfaces()
        /* 
        返回标识操作系统平台的字符串。 该值在编译时设置。 
        可能的值为 'aix'、'darwin'、'freebsd'、'linux'、'openbsd'、'sunos' 和 'win32'。
        */
        if (os.platform() === 'darwin') {
            syatemInfo.platform = 'MacOS'
        } else if (os.platform() === 'win32') {
            syatemInfo.platform = 'Windows'
        } else if (os.platform() === 'linux') {
            syatemInfo.platform = 'Linux'
        }
        return syatemInfo
    }

    async process_list() {
        const data = await this.getSystem()
        const list = []
        let process_list = get_process_container()
        for (let i = 0; i < process_list.length; i++) {
            let child = process_list[i]
            let serve = {
                env: child.env,
                id: child.id,
                project_id: child.project_id,
                status: false,
                message: ''
            }
            try {
                const before = await ServerStatus(child.env.port)
                serve.status = before.status
            } catch (error) {
                serve.status = false
                serve.message = error.message
            }
            list.push(serve)
        }
        return { code: 200, data, list }
    }

    async process_kill(body: { id: string }) {
        // 根据进程ID从进程池找出当前操作的进程
        const child = process_container.find((item) => item.id === body.id)
        if (!child) return { code: 500, msg: '未知错误，请重试或者联系管理员。' }
        // 关闭进程之前先检测心跳状态
        const before = await ServerStatus(child.env.port)
        // 心跳正常关闭进程，心跳异常将错误抛给前端
        if (before.status) {
            // 关闭进程
            child.kill()
            // 关闭进程之后在次检测心跳状态
            const after = await ServerStatus(child.env.port)
            if (after.status) {
                return { code: 500, msg: `端口【${child.env.port}】关闭失败，请检查服务器配置` }
            } else {
                return { code: 200, msg: `端口【${child.env.port}】关闭成功` }
            }
        } else {
            return { code: 500, msg: before.msg }
        }
    }

    async process_killAll() {
        try {
            for (let i = 0; i < process_container.length; i++) {
                const child = process_container[i]
                // 关闭进程之前先检测心跳状态
                const before = await ServerStatus(child.env.port)
                if (before.status) {
                    // 关闭进程
                    child.kill()
                }
            }
            return { code: 200, msg: `进程池冻结完毕` }
        } catch (error) {
            return { code: 500, msg: error.message }
        }
    }


    async process_init() {
        const res = await this.process_killAll()
        if (res.code === 200) {
            init()
            return { code: 200, msg: '进程池刷新完毕' }
        } else {
            return res
        }
    }


    async process_delete(body: { id: string }) {
        try {
            ['DEV', 'TEST', 'UAT', 'PROD'].forEach((item: string) => {
                const envPath = path.join(PackageConfig.package_ci, item, body.id);
                fs.removeSync(envPath)
            })
            return { code: 200, msg: '' }
        } catch (error) {
            return { code: 500, msg: error.message }
        }


    }

    async process_start(body: { id: string }) {
        const child = process_container.find((item) => item.id === body.id)
        if (!child) return { code: 500, msg: '未知错误，请重试或者联系管理员。' }
        // 启动进程之前先检测心跳状态
        const before = await ServerStatus(child.env.port)
        /* 
          心跳正常不需要启动进程，向前端抛错误警告。
          心跳异常说明进程没启动，将启动进程。
         */

        if (before.status) {
            return { code: 500, msg: `端口【${child.env.port}】运行正常，请勿重复启动！` }
        } else {
            await child.init()
            // 启动进程之后在次检测心跳状态
            const after = await ServerStatus(child.env.port)
            if (after.status) {
                return { code: 200, msg: `端口【${child.env.port}】启动成功` }
            } else {
                return { code: 200, msg: after.msg }
            }

        }
    }
}
