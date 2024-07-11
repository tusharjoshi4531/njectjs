import { Server, Socket } from "socket.io";

export enum SocketIORouteHandlerParameter {
  SOCKET = "SOCKET",
  SOCKET_SERVER = "SOCKET_SERVER",
  DATA = "DATA",
  CALLBACK = "CALLBACK",
}

export class SocketIORequestParamUtil {
  static getProperty(
    param: SocketIORouteHandlerParameter,
    io: Server,
    socket: Socket,
    data: any,
    cb: Function
  ) {
    const params = new Map<SocketIORouteHandlerParameter, any>([
      [SocketIORouteHandlerParameter.SOCKET, socket],
      [SocketIORouteHandlerParameter.SOCKET_SERVER, io],
      [SocketIORouteHandlerParameter.DATA, data],
      [SocketIORouteHandlerParameter.CALLBACK, cb],
    ]);

    return params.get(param)!;
  }
}
