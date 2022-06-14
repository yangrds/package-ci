import * as fs from 'fs-extra';
import * as path from 'path';
import ServeAdmin from './WebServeAdmin';
import { ENV, ServeParameter } from './interface';
import { uuid } from './tool';
import PackageConfig from '../config'

export const process_container = [];


export function get_process_container() {
  return JSON.parse(JSON.stringify(process_container))
}

export function start(config: ServeParameter) {
  const sub_process = new ServeAdmin(config);
  process_container.push(sub_process)
}

export function init() {
  process_container.splice(0, process_container.length)
  const dev_path = {
    path: path.join(PackageConfig.package_ci, 'DEV'),
    dir: 'DEV',
  };
  const test_path = {
    path: path.join(PackageConfig.package_ci, 'TEST'),
    dir: 'TEST',
  };
  const uat_path = {
    path: path.join(PackageConfig.package_ci, 'UAT'),
    dir: 'UAT',
  };
  const prod_path = {
    path: path.join(PackageConfig.package_ci, 'PROD'),
    dir: 'PROD',
  };

  let ENVS = [dev_path, test_path, uat_path, prod_path];

  ENVS.forEach((env) => {
    // 判断当前环境地址是否存在
    if (fs.existsSync(env.path)) {
      // 在当前环境目录内所有静态资源目录
      const dirs = fs.readdirSync(env.path);

      /*
      dirs环境目录，DEV/TEST/UAT/PROD
      遍历部署项目静态资源
       */
      dirs.forEach((id: string) => {
        // 静态资源目录
        const dist_path = path.join(env.path, id);

        // 配置文件地址
        const config_path = path.join(dist_path, 'env_release_config.json');

        // 检测配置文件是否存在
        if (!fs.existsSync(dist_path) || !fs.existsSync(config_path)) {
          return;
        }
        // 从配置文件读取配置信息
        const config_json = JSON.parse(fs.readFileSync(config_path).toString());

        if (!config_json.port) {
          console.log('\x1B[31m%s\x1B[31m', `错误：项目【${config_json.project_name}】Id:【${config_json.id}】${env.dir}环境 端口未指定->启动失败；`)
          return;
        }
        // 启动服务
        start({
          id: uuid(16, 32),
          project_id: config_json.id,
          port: config_json.port,
          dist: dist_path,
          name: env.dir,
          project: config_json.project_name,
        });
      });
    }
  });
}
