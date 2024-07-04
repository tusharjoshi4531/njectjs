import {
  Server as SocketIOServer,
  ServerOptions as SocketIOServerOptions,
} from "socket.io";
import { ServerContext } from "../../nject_express/core/express_application_context";
import { RouteControllerManager } from "../../nject_express/core/route_controller_manager";
import { IOCContextDecorator } from "../../nject_ioc/core/context_decorator";
import { SocketIOApplicationManager } from "./socket_io_application_manager";
import { SocketIORouteHandlerManager } from "./socket_route_handler_manager";
import { SocketIORouteHandlerParameter } from "../utils/socketio_route_parameter_util";
import { SocketIORouteHandlerModel } from "../utils/socketio_route_handler_model";
import { SocketIOContextError } from "../error/socket_io_context_error";

export const DEFAULT = "default";
export const SOCKETIO_CONTEXT_NAME = "socketio_context";
export const SOCKET_TAG = "socket";

export interface SocketIOApplicationContainer {
  getSocketServerOptions?: () => Partial<SocketIOServerOptions>;
  preconfigSocket?: (app: SocketIOServer) => void;
}

export class SocketIOApplicationContext extends IOCContextDecorator {
  private routeControllerManager: RouteControllerManager;
  private routeHandlerManager: SocketIORouteHandlerManager;
  private applicationManager: SocketIOApplicationManager;
  private applicationContainer: SocketIOApplicationContainer | undefined;

  constructor(
    context: IOCContextDecorator,
    private serverContext: ServerContext
  ) {
    super(context);
    this.routeControllerManager = new RouteControllerManager();
    this.routeHandlerManager = new SocketIORouteHandlerManager();
    this.applicationManager = new SocketIOApplicationManager(
      this.routeHandlerManager
    );
  }

  public set ApplicationContainer(
    applicationContainer: SocketIOApplicationContainer
  ) {
    this.applicationContainer = applicationContainer;
  }

  public addController(
    controllerId: string,
    namespace: string,
    handlers: [
      string,
      SocketIORouteHandlerModel,
      SocketIORouteHandlerParameter[]
    ][]
  ) {
    this.routeControllerManager.addController(
      controllerId,
      namespace,
      handlers.map(([id, _]) => id)
    );
    handlers.forEach(([id, model, params]) => {
      this.routeHandlerManager.addHandler(id, controllerId, model);
      this.routeHandlerManager.addParams(id, params);
    });
  }

  override build(): void {
    super.build();
    console.log("3");

    if (!this.applicationContainer) {
      throw SocketIOContextError.noApplicationContainer();
    }

    const getServerOptions = this.applicationContainer.getSocketServerOptions;

    if (getServerOptions)
      this.applicationManager.ServerOptions = getServerOptions!();
    this.applicationManager.HttpServer = this.serverContext.HttpServer;
    this.applicationManager.createServer(this.applicationContainer.preconfigSocket);
  }
}
