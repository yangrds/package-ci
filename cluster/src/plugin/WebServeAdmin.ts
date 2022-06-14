import http from 'http';
import * as path from 'path';
import { ChildProcess, fork } from 'child_process';
import { ENV, ServeParameter } from './interface';
import { uuid } from './tool';
import PackageConfig from '../config'

class ServeAdmin {
  child: ChildProcess;
  id: string;
  project_id: string;
  env: ENV = {};
  status: string;
  constructor(serveParameter: ServeParameter) {
    this.env.port = serveParameter.port;
    this.env.dist = serveParameter.dist;
    this.env.name = serveParameter.name;
    this.env.id = serveParameter.id;
    this.project_id = serveParameter.project_id
    this.id = serveParameter.id;
    this.env.project = serveParameter.project;
    this.init();
  }
  init() {
    const _this = this
    /* 
    进程启动之后，在获取进程列表，会有一个延迟，所以包装一个微任务进行栈内等待
    原本获取进程列表的时候可以用定时器延迟，但是那并不是一个标准解决方式
    */
    return new Promise((resolove) => {
      _this.child = fork(PackageConfig.package_server, {
        env: _this.env as any,
      });
      // 监听子进程关闭
      _this.child.on('exit', () => {
        _this.exit(_this.env);
      });
      // 监听子进程消息
      _this.child.on('message', (data) => {
        _this.message.call(_this, data)
        resolove(true)
      })
    })
  }

  kill() {
    this.child.kill();
  }

  message(data: { type: string; msg: string }) {
    switch (data.type) {
      case 'close':
        this.child.kill();
        break;
      case 'listen':
        this.listen(this.env);
        break;
    }
  }

  public listen(env: ENV): void {
    console.log('\x1B[33m%s\x1B[33m', `服务：项目【${this.env.project}】Id:【${this.env.id}】${this.env.name}环境->${this.env.port}端口运行正常`);
    this.status = 'open';
  }

  public exit(env: ENV): void {
    console.log('\x1B[31m%s\x1B[31m', `错误：项目【${this.env.project}】Id:【${this.env.id}】${this.env.name}环境 ${this.env.port}端口已停止；`)
    this.status = 'exit';
  }
}

export default ServeAdmin;
