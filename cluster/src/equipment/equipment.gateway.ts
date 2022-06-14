import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway(
  {
    path: '/socket',
    allowEIO3: true,
    cors: {
      origin: /.*/,
      credentials: true
    }
  }
)
export class EquipmentGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() private ws: Server;
  afterInit(server: any) { }
  handleConnection(client: any, ...args: any[]) { }
  handleDisconnect(client: any) { }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
