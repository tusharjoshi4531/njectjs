import {
  ServerOptions as SocketIOServerOptions,
  Server as SocketIOServer,
  Socket,
  ServerOptions,
} from "socket.io";
import { SocketIORouteHandlerManager } from "./socket_route_handler_manager";
import http from "http";
import {
  SocketIORequestParamUtil,
  SocketIORouteHandlerParameter,
} from "../utils/socketio_route_parameter_util";
import { IDUtil } from "../../nject_ioc/util/id_util";
import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { SOCKETIO_CONTEXT_NAME } from "./socket_io_application_context";
import { SocketIOContextError } from "../error/socket_io_context_error";

export class SocketIOApplicationManager {
  private io: SocketIOServer | undefined;
  private serverOptions: Partial<SocketIOServerOptions>;
  private httpServer: http.Server | undefined;
  constructor(private routeHandlerManager: SocketIORouteHandlerManager) {
    this.serverOptions = {
      cors: {
        origin: "*",
      },
    };
  }

  public set ServerOptions(options: Partial<ServerOptions>) {
    // TODO: change when add more default options
    this.serverOptions = options;
  }

  public set HttpServer(server: http.Server) {
    this.httpServer = server;
  }

  public createServer(preconfig?: (io: SocketIOServer) => void) {
    if (!this.httpServer) {
      throw SocketIOContextError.noHttpServer();
    }
    this.io = new SocketIOServer(this.httpServer, this.serverOptions);

    preconfig && preconfig(this.io);

    const routes = this.routeHandlerManager.getAllNamespacesWithEvents();

    routes.forEach(([namespace, events]) => {
      const serverNamespace = this.io!.of(namespace);

      serverNamespace.on("connection", (socket) => {
        events.forEach(([eventName, handlerId, params]) => {
          const eventHandler = this.createSocketHandler(
            socket,
            handlerId,
            params
          );

          socket.on(eventName, eventHandler);
        });
      });
    });
  }

  private createSocketHandler(
    socket: Socket,
    handlerId: string,
    params: SocketIORouteHandlerParameter[]
  ) {
    const parentId = this.routeHandlerManager.getParentById(handlerId);
    const handlerName = IDUtil.getIdData(handlerId)[1];

    const context = contextRegistry.getContextById(SOCKETIO_CONTEXT_NAME);
    const controllerObject = context.getObjectByID(parentId);

    const messageHandler: (...args: any[]) => void = async (
      data: any,
      callback: Function
    ) => {
      const functionParams = params.map((routeHandlerParam) =>
        SocketIORequestParamUtil.getProperty(
          routeHandlerParam,
          this.io!,
          socket,
          data,
          callback
        )
      );

      const fn = controllerObject[handlerName].bind(controllerObject);

      try {
        await fn(...functionParams);
      } catch {
        console.log("Socket Error");
      }
    };

    return messageHandler;
  }
}
