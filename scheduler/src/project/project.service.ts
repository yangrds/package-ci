import { Injectable } from '@nestjs/common';
import {
  Clone,
  localVersion,
  checkout,
  pull,
  originBranch,
  localBranch,
  checkoutOrigin,
  deleteBranch,
} from '../utils/git';
import { dir_copy, emptyDir, BaleDirectory } from '../utils/file';
import { dateFormat, uuid } from '../utils/tool';
import { _save, _find, _remove, _findOne, _updateOne, _deleteMany, _updateMany, _findCount } from '../utils/sql';
import { Project, ENVS } from './project.interface';
import { projectModel, releaseModel, testTaskModel, uatTaskModel, prodTaskModel, commandModel } from './project.sql';
import * as fs from 'fs-extra';
import * as path from 'path'
import got from 'got';
import PackageConfig from '@/config'
@Injectable()
export class ProjectService {
  async Create(body: Project) {
    let localDir = `${PackageConfig.static_path}/${body.name}`;
    const sourceCode = `${body.name}/sourceCode`;
    const historyVersion = `${body.name}/historyVersion`;
    const compile = `${body.name}/compile`;
    fs.emptyDirSync(path.join(PackageConfig.static_path, sourceCode));
    fs.emptyDirSync(path.join(PackageConfig.static_path, historyVersion));
    fs.emptyDirSync(path.join(PackageConfig.static_path, compile));
    body.sourceCode = sourceCode;
    body.historyVersion = historyVersion;
    body.compile = compile;
    body.project_id = uuid(16, 32)
    // 项目信息
    const sql = new projectModel(body);
    // 解构
    const { gitUrl, branch } = body;
    // 克隆
    const result: any = await Clone({
      repoPath: gitUrl,
      branch,
      localPath: path.join(PackageConfig.static_path, body.sourceCode),
    });

    if (result.code != 200) {
      return result;
    }

    // 存储写入
    const res: any = await _save(sql);

    // 将源码复制进构建空间
    const copy_res: any = await dir_copy(path.join(PackageConfig.static_path, sourceCode), path.join(PackageConfig.static_path, compile));
    if (copy_res.code != 200) return copy_res;

    return res;
  }
  async init_compile(data: any) {
    // 清空构建空间
    const empty_res: any = await emptyDir(path.join(PackageConfig.static_path, data.compile));
    if (empty_res.code != 200) return empty_res;

    // 将源码复制进构建空间path.join(PackageConfig.static_path, data.compile)
    const copy_res: any = await dir_copy(path.join(PackageConfig.static_path, data.sourceCode), path.join(PackageConfig.static_path, data.compile));
    if (copy_res.code != 200) return copy_res;

    return { code: 200 };
  }
  async Read() {
    const res = await _find({ sql: projectModel });
    if (res.code != 200) return res;
    let list = []
    try {
      for (let i = 0; i < res.data.length; i++) {
        let child = JSON.parse(JSON.stringify(res.data[i]))
        let testCount = await _findCount(testTaskModel, { project_id: child.project_id })
        let uatCount = await _findCount(uatTaskModel, { project_id: child.project_id })
        let prodCount = await _findCount(prodTaskModel, { project_id: child.project_id })
        child.testCount = testCount.data
        child.uatCount = uatCount.data
        child.prodCount = prodCount.data
        list.push(child)
      }
      return { code: 200, data: list, msg: '' }
    } catch (error) {
      return { code: 500, msg: error.message }
    }
  }
  async Remove(body: { id: string }) {
    const res: any = await _findOne(projectModel, { project_id: body.id });
    if (res.code != 200) {
      return res;
    }
    try {
      // 清空项目所关联的部署版本记录
      await _deleteMany(releaseModel, { project_id: body.id })
      // 清空项目所关联的测试工单记录
      await _deleteMany(testTaskModel, { project_id: body.id })
      // 清空项目所关联的测试工单记录
      await _deleteMany(uatTaskModel, { project_id: body.id })
      // 清空项目所关联的测试工单记录
      await _deleteMany(prodTaskModel, { project_id: body.id })
      // 清空项目所关联的指令集合记录
      await _deleteMany(commandModel, { project_id: body.id })
      // 根据项目ID清空进程池
      await this.process_delete({ ip: res.data.dev_ip, id: body.id })
      // 比对PROD节点和DEV节点是否同一台服务器，如果是的话，清空进程池只需要执行一次。
      if (res.data.dev_ip != res.data.prod_ip) {
        await this.process_delete({ ip: res.data.prod_ip, id: body.id })
      }
      // 删除项目
      await _remove(projectModel, { project_id: body.id })
      // 删除项目项目所关联的文件目录
      fs.removeSync(path.join(PackageConfig.static_path, res.data.name))
      return { code: 200, msg: '删除完毕' }
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

  async read_version(body: { id: string }) {
    const res: any = await _findOne(projectModel, { project_id: body.id });
    if (res.code != 200) {
      return res;
    }
    try {
      let dir = fs.readdirSync(path.join(PackageConfig.static_path, res.data.historyVersion));
      let builds = []
      dir.forEach((item: string) => {
        if (item.includes('.zip')) {
          let obj = { ...fs.statSync(path.join(PackageConfig.static_path, res.data.historyVersion, item)), name: item.split('.')[0] }
          builds.push(obj)
        }
      });
      builds = builds.sort(function (a, b) {
        return b.atimeMs - a.atimeMs;
      });
      return { code: 200, data: builds };
    } catch (err) {
      return { code: 500, data: [], msg: err.message };
    }
  }

  async build_version(body: { id: string; pack: string }) {
    const projectRes: any = await _findOne(projectModel, { project_id: body.id });
    if (projectRes.code != 200) {
      return projectRes;
    }

    let resInfo = {
      project_id: projectRes.data.project_id,
      compile: path.join(PackageConfig.static_path, projectRes.data.compile),
      historyVersion: path.join(PackageConfig.static_path, projectRes.data.historyVersion),
      buildName: projectRes.data.buildName,
    }

    const isPath = await fs.pathExists(`${resInfo.compile}/${resInfo.buildName}`);
    if (!isPath)
      return {
        code: 500,
        msg: `${resInfo.buildName}构建目录不存在，请在build之后在尝试版本构建`,
      };

    const v_res: any = await localVersion(path.join(PackageConfig.static_path, projectRes.data.compile));

    if (v_res.code != 200) {
      return v_res;
    }

    // 包版本
    let pack_id = uuid(8, 32);

    if (!body.pack) {
      try {
        await BaleDirectory(
          `${resInfo.compile}/${resInfo.buildName}`,
          resInfo.historyVersion,
          `${pack_id}.zip`,
        );
      } catch (error) {
        return { code: 500, msg: error.message }
      }
    } else {
      pack_id = body.pack.split('.')[0]
    }

    const states = fs.statSync(`${resInfo.historyVersion}/${pack_id}.zip`);

    const sql = new releaseModel({
      project_id: resInfo.project_id,
      uid: uuid(8, 32),
      pack_id,
      size: states.size,
      commit_id: v_res.data.latest.hash.substring(0, 8),
    });

    const new_res = await _save(sql);
    return new_res
  }

  // 远程分支列表
  async origin_branch(body: { id: string }) {
    const res: any = await _findOne(projectModel, { project_id: body.id });
    if (res.code != 200) {
      return res;
    }
    const data = await originBranch(path.join(PackageConfig.static_path, res.data.sourceCode));
    return data;
  }
  // 本地分支列
  async local_branch(body: { id: string }) {
    const res: any = await _findOne(projectModel, { project_id: body.id });
    if (res.code != 200) {
      return res;
    }
    const data = await localBranch(path.join(PackageConfig.static_path, res.data.sourceCode));
    return data;
  }
  // 切换本地分支
  async local_checkout(body: { branch: string; id: string }) {
    const res: any = await _findOne(projectModel, { project_id: body.id });
    if (res.code != 200) return res;
    // 切换分支
    const checkout_res: any = await checkout(path.join(PackageConfig.static_path, res.data.sourceCode), body.branch);
    // 清空构建空间
    const empty_res: any = await emptyDir(path.join(PackageConfig.static_path, res.data.compile));
    if (empty_res.code != 200) return empty_res;

    // 将源码复制进构建空间 
    const copy_res: any = await dir_copy(path.join(PackageConfig.static_path, res.data.sourceCode), path.join(PackageConfig.static_path, res.data.compile));
    if (copy_res.code != 200) return copy_res;

    return checkout_res;
  }
  // 检出远程分支
  async checkout_origin(body: { id: string; branch: string }) {
    const res: any = await _findOne(projectModel, { project_id: body.id });
    if (res.code != 200) {
      return res;
    }
    const checkout_res: any = await checkoutOrigin(
      path.join(PackageConfig.static_path, res.data.sourceCode),
      body.branch,
    );

    // 清空构建空间
    const empty_res: any = await emptyDir(path.join(PackageConfig.static_path, res.data.compile));
    if (empty_res.code != 200) return empty_res;
    // 将源码复制进构建空间
    const copy_res: any = await dir_copy(path.join(PackageConfig.static_path, res.data.sourceCode), path.join(PackageConfig.static_path, res.data.compile));
    if (copy_res.code != 200) return copy_res;

    return checkout_res;
  }
  // 删除本地分支
  async delete_branch(body: { id: string; branch: string }) {
    const res: any = await _findOne(projectModel, { project_id: body.id });
    if (res.code != 200) {
      return res;
    }
    const data = await deleteBranch(path.join(PackageConfig.static_path, res.data.sourceCode), body.branch);
    return data;
  }

  async origin_pull(body: { id: string; }) {
    const res: any = await _findOne(projectModel, { project_id: body.id });
    if (res.code != 200) {
      return res;
    }
    const data = await pull(path.join(PackageConfig.static_path, res.data.sourceCode));
    const copy_res: any = await dir_copy(path.join(PackageConfig.static_path, res.data.sourceCode), path.join(PackageConfig.static_path, res.data.compile));
    if (copy_res.code != 200) return copy_res;
    return data;
  }


  // 版本列表
  async local_version(body: { id: string }) {
    const res: any = await _findOne(projectModel, { project_id: body.id });
    if (res.code != 200) {
      return res;
    }
    const data = await localVersion(path.join(PackageConfig.static_path, res.data.compile));
    return data;
  }
  // 详情
  async Details(body: { id: string }) {
    const res: any = await _findOne(projectModel, { project_id: body.id });

    if (res.code === 200) {
      const Data = JSON.parse(JSON.stringify(res.data));
      delete Data.pwd;
      return { code: 200, data: Data };
    } else {
      return res;
    }
  }
  async Update(body: { project_id: string; devs: string; pm: ENVS; qa: string; buildName: string; describe: string; notice: string }) {
    const updateRes: any = await _updateOne(
      projectModel,
      { devs: body.devs, pm: body.pm, qa: body.qa, buildName: body.buildName, describe: body.describe, notice: body.notice },
      { project_id: body.project_id },
    );
    return updateRes
  }
  // 更新
  async ServerUpdate(body: { dev_ip: string; prod_ip: string; envs: ENVS; _id: string; name: string }) {
    const updateRes: any = await _updateOne(
      projectModel,
      { envs: body.envs, dev_ip: body.dev_ip, prod_ip: body.prod_ip },
      { project_id: body._id },
    );

    async function setEvnDist() {
      try {
        const envs = []
        const env_host: any = [{ ip: body.dev_ip, type: 'dev' }, { ip: body.prod_ip, type: 'prod' }]
        const envInfo = {
          dev: { port: body.envs.DEV.port },
          test: { port: body.envs.TEST.port },
          uat: { port: body.envs.UAT.port },
          prod: { port: body.envs.PROD.port },
        }
        for (let i = 0; i < env_host.length; i++) {
          const { ip, type } = env_host[i]
          const res: any = await got.post(`http://${ip}:${PackageConfig.process_port}/release/init-env`, {
            json: { id: body._id, envInfo, type, name: body.name },
            headers: {
              token: PackageConfig.sign()
            },
            timeout: {
              lookup: 100,
              connect: 3000
            }
          }).json();
          envs.push({ ip, list: res })
        }
        return { code: 200, ips: envs }
      } catch (error) {
        return { code: 500, ips: [] }
      }
    }





    if (updateRes.code === 200) {
      const distRes: any = await setEvnDist()
      distRes.modifiedCount = updateRes.data.modifiedCount
      return distRes;
    } else {
      return updateRes
    }

  }
}
