import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as compressing from 'compressing';
import { dir_remove } from 'src/plugin/file';
import { emptyDir } from '../plugin/file'
import { EnvInfo } from 'src/equipment/equipment.interface';
import PackageConfig from '../config'

@Injectable()
export class ReleaseService {
  async init_env(body: { id: string; envInfo: EnvInfo, type: string; name: string }) {

    /* 
     1、根据【项目id】在当前环境目录下遍历
     2、检测'DEV', 'TEST', 'UAT', 'PROD'下是否存在该项目，不存在则创建一个空目录
     3、然后在该目录写入配置文件信息，
     */

    async function envEmptyDir() {
      // 执行结果
      let list = [];
      // 环境集合
      let envs: { name: string; port: string }[] = []

      if (body.type === 'dev') {
        envs = [
          { name: 'DEV', port: body.envInfo.dev.port },
          { name: 'TEST', port: body.envInfo.test.port },
          { name: 'UAT', port: body.envInfo.uat.port },
        ]
      } else {
        envs = [
          { name: 'PROD', port: body.envInfo.prod.port },
        ]
      }


      // 遍历环境
      for (let i = 0; i < envs.length; i++) {
        // 当前环境
        let env: { name: string; port: string } = envs[i]

        // 地址拼接
        const envPath = path.join(
          PackageConfig.package_ci,
          env.name,
          body.id,
        );
        // 判断当前环境项目目录是否存在，如果不存在讲生成一个空目录
        if (!fs.existsSync(envPath)) {
          const res: any = await emptyDir(envPath)
          list.push({ ...env, code: res.code, msg: res.msg })
        } else {
          list.push({ ...env, code: 200, msg: null })
        }
        // 项目配置信息
        const config = {
          id: body.id,
          project_name: body.name,
          port: env.port,
        };

        // 写入项目配置信息
        fs.writeFileSync(
          path.join(envPath, 'env_release_config.json'),
          JSON.stringify(config),
        );

      }
      return list
    }
    const res = await envEmptyDir()
    return res
  }


  // DEV、TEST、UAT 环境部署
  async env_release(body: any) {
    function sync() {
      return new Promise((resolve) => {
        const devPath = path.join(
          PackageConfig.package_ci,
          body.env,
          body.id,
        );
        try {
          // 清空目录，参数1：指定目录路径，参数2：排除指定目录文件
          dir_remove(devPath, 'env_release_config.json');
        } catch (error) {
          resolve({ code: 500, msg: error.message });
          return
        }
        // 解压静态资源
        compressing.zip
          .uncompress(body.file.buffer, devPath)
          .then(() => {
            resolve({ code: 200, msg: '资源更新成功' });
          })
          .catch((err: Error) => {
            resolve({ code: 500, msg: err.message });
          });
      });
    }
    const res = await sync();
    return res
  }
}
