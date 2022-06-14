import { Injectable } from '@nestjs/common';
import { hostModel } from './cluster.sql'
import { projectModel } from '../project/project.sql'
import { Host } from './cluster.interface'
import { _save, _find, _findOne, _remove } from '../utils/sql';
import got from 'got';
import PackageConfig from '@/config'


@Injectable()
export class ClusterService {
    async loadConfig(body: { ip: string; port: number }) {
        try {
            const res = await got.post(`http://${body.ip}:${body.port}/equipment/system`, {
                json: body,
                headers: {
                    token: PackageConfig.sign()
                },
                timeout: {
                    lookup: 100,
                    connect: 3000
                }
            }).json();
            return { code: 200, data: res }
        } catch (error) {
            return { code: 500, msg: '配置加载失败' }
        }
    }
    async clusterCreate(body: Host) {
        const host: any = await _findOne(hostModel, { ip: body.ip })
        if (host && host.data) {
            return { code: 500, msg: '该主机IP已存在' }
        }
        const sql = new hostModel(body)
        const res = await _save(sql)
        return res
    }
    async clusterRemove(body: { ip: string }) {
        const res = await _remove(hostModel, { ip: body.ip })
        return res
    }
    async clusterList() {
        const res = await _find({ sql: hostModel })
        if (res.code != 200) return res
        res.data.forEach((item: any) => item.port = PackageConfig.process_port);
        return res
    }

    async process_kill(body: { ip: string; id: string }) {
        try {
            const processRes: any = await got.post(`http://${body.ip}:${PackageConfig.process_port}/equipment/process-kill`, {
                json: body,
                headers: {
                    token: PackageConfig.sign()
                },
                timeout: {
                    lookup: 100,
                    connect: 3000
                }
            }).json();

            return processRes

        } catch (error) {
            return { code: 500, msg: error.message }
        }
    }

    async process_killAll(body: { ip: string; }) {
        try {
            const processRes: any = await got.post(`http://${body.ip}:${PackageConfig.process_port}/equipment/process-kill-all`, {
                json: {},
                headers: {
                    token: PackageConfig.sign()
                },
                timeout: {
                    lookup: 100,
                    connect: 3000
                }
            }).json();

            return processRes
        } catch (error) {
            return { code: 500, msg: error.message }
        }
    }

    async process_init(body: { ip: string; }) {
        try {
            const processRes: any = await got.post(`http://${body.ip}:${PackageConfig.process_port}/equipment/process-init`, {
                json: {},
                headers: {
                    token: PackageConfig.sign()
                },
                timeout: {
                    lookup: 100,
                    connect: 3000
                }
            }).json();
            return processRes
        } catch (error) {
            return { code: 500, msg: error.message }
        }
    }

    async process_delete(body: { ip: string; id: string }) {
        try {
            const processRes: any = await got.post(`http://${body.ip}:${PackageConfig.process_port}/equipment/process-delete`, {
                json: { id: body.id },
                headers: {
                    token: PackageConfig.sign()
                },
                timeout: {
                    lookup: 100,
                    connect: 3000
                }
            }).json();
            return processRes
        } catch (error) {
            return { code: 500, msg: error.message }
        }
    }

    async process_start(body: { ip: string; id: string }) {
        try {
            const processRes: any = await got.post(`http://${body.ip}:${PackageConfig.process_port}/equipment/process-start`, {
                json: body,
                headers: {
                    token: PackageConfig.sign()
                },
                timeout: {
                    lookup: 100,
                    connect: 3000
                }
            }).json();

            return processRes

        } catch (error) {
            return { code: 500, msg: error.message }
        }
    }

    async process_list(body: { ip: string }) {
        const projectRes = await _find({ sql: projectModel })
        if (projectRes.code != 200) return projectRes
        let process_list = []
        let project_list = projectRes.data
        try {
            const processRes: any = await got.post(`http://${body.ip}:${PackageConfig.process_port}/equipment/process-list`, {
                json: {},
                headers: {
                    token: PackageConfig.sign()
                },
                timeout: {
                    lookup: 100,
                    connect: 3000
                }
            }).json();
            if (processRes.code != 200) return processRes

            try {
                process_list = processRes.list.map((item) => {
                    const project = project_list.find((k) => k.project_id === item.project_id)
                    let Data: any = {
                        project: { describe: project ? project.describe : '该项目已删除', name: project ? project.name : '该项目已删除' },
                        env: item.env,
                        status: item.status,
                        project_id: item.project_id,
                        id: item.id
                    }
                    return Data
                })
                return { code: 200, systemInfo: { ...processRes.data, ip: body.ip, port: PackageConfig.process_port }, process_list }
            } catch (error) {
                return { code: 500, msg: error.message }
            }
        } catch (error) {
            return { code: 500, msg: error.message }
        }
    }
}
