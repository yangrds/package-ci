import { SubscribeMessage, OnGatewayInit, MessageBody, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { implementShell, ImplementShell, kill, ShellParameter } from '../utils/shell'
import { _findOne } from '../utils/sql'
import * as path from 'path'
import { projectModel } from './project.sql'
import PackageConfig from '@/config'
@WebSocketGateway({
  path: '/socket',
  allowEIO3: true,
  cors: {
    origin: /.*/,
    credentials: true
  }
})
export class ProjectGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() private ws: Server;
  /**
   * 初始化
   */
  afterInit() {
    console.log('socket初始化成功');
  }

  /**
   * 链接成功
   */
  handleConnection(client: Socket) {
    this.ws.emit('init', { msg: '初始化成功' })
    this.ws.emit('install', { msg: 'install' })
  }

  /**
   * 断开链接
   */
  handleDisconnect(client: Socket) {

  }

  // 结束shell命令
  @SubscribeMessage('shell-kill')
  handleKill(client: Socket, body: { id: string }) {
    kill(body.id)
  }


  // shell 命令执行
  @SubscribeMessage('shell-project')
  async handleProject(client: Socket, body: ShellParameter): Promise<void> {
    const res: any = await _findOne(projectModel, { project_id: body.id })
    let cwd: string = ''
    if (res.code === 200) {
      cwd = path.join(PackageConfig.static_path, res.data.compile)
    }
    if (!cwd) {
      return
    }
    implementShell(
      {
        id: body.sid,
        command: body.command,
        args: body.args,
        options: { cwd },
        callback: (type: string, data: string) => {
          if (type === 'stdout') {
            client.emit('project', { type: 'stdout', text: data.toString() })
          } else if (type === 'stderr') {
            client.emit('project', { type: 'stderr', text: data.toString() })
          } else {
            client.emit('project', { type: 'close', text: data.toString() })
          }
        }
      })
  }
}

