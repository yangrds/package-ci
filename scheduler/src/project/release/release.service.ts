import { Injectable } from '@nestjs/common';
import { _save, _find, _remove, _findOne, _updateOne } from '../../utils/sql';
import { projectModel, releaseModel } from '../project.sql';
import * as fs from 'fs-extra';
import got from 'got';
import * as path from 'path'
import * as FormData from 'form-data';
import PackageConfig from '@/config'
@Injectable()
export class ReleaseService {
  async release_list(body: { id: string }) {
    const project: any = await _findOne(projectModel, { project_id: body.id });
    if (project.code != 200) {
      return project;
    }
    const res: any = await _find({
      sql: releaseModel,
      params: { project_id: body.id },
      sort: { date: -1 },
      skip: 0,
      limit: 20
    });
    return res;
  }

  async env_release(body: { id: string; uid: string; release_id: string; env: string }) {
    // 项目数据
    const projectRes: any = await _findOne(projectModel, { project_id: body.id });
    if (projectRes.code != 200) return { code: 501, msg: '项目数据查找失败' }


    // 部署数据
    const releaseRes: any = await _findOne(releaseModel, { uid: body.uid });
    if (releaseRes.code != 200) return { code: 501, msg: '部署数据查找失败' }


    const resInfo = {
      // 开发环境IP地址
      dev_ip: projectRes.data.dev_ip,
      // 正式环境IP地址
      prod_ip: projectRes.data.prod_ip,
      // 当前环境指定主机节点IP
      target_ip: projectRes.data[body.env === 'PROD' ? 'prod_ip' : 'dev_ip'],
      // 项目列表主键
      project_id: projectRes.data.project_id.toString(),
      // 当前环境数据
      env: releaseRes.data[body.env],
      // 当前项目静态资源压缩包路径（历史版本）
      historyVersion: path.join(PackageConfig.static_path, projectRes.data.historyVersion),
      // 当前部署数据对应的压缩包（静态资源）版本
      pack_id: releaseRes.data.pack_id,
      // 当前部署数据列表主键
      release_id: releaseRes.data._id.toString()
    }

    // 收集数据，准备向指定主机节点传输静态资源，执行部署。
    const form = new FormData();
    form.append(
      'file',
      fs.createReadStream(`${resInfo.historyVersion}/${resInfo.pack_id}.zip`),
    );
    form.append('id', String(resInfo.project_id));
    form.append('env', String(body.env));

    let env_res: any
    try {
      env_res = await got
        .post(`http://${resInfo.target_ip}:${PackageConfig.process_port}/release/dev_release`, {
          body: form,
          headers: {
            token: PackageConfig.sign()
          },
          timeout: {
            lookup: 100,
            connect: 3000
          }
        })
        .json();
    } catch (error) {
      return { code: 500, msg: error.message }
    }

    if (env_res.code === 200) {
      resInfo.env.status = true;
      resInfo.env.date = Math.round(new Date() as any);
      // 修改指定uid部署数据
      let update_res: any
      try {
        update_res = await _updateOne(
          releaseModel,
          { [body.env]: resInfo.env },
          { _id: resInfo.release_id },
        );
        if (update_res.code != 200) return { code: 501, msg: '部署完毕，但是依赖数据更新失败。' }
      } catch (error) {
        return { code: 501, msg: error.message }
      }

    }
    return env_res;
  }
}
