import { IOCContextInterface } from "../../nject_ioc/core/context";
import { IOCContextDecorator } from "../../nject_ioc/core/context_decorator";
import { HTTPRouteHandlerModel } from "../util/http_route_handler_model";
import { RouteControllerManager } from "./route_controller_manager";
import express from "express";
import {
  ExpressApplicationManager,
  ExpressServerOptions,
} from "./express_application_manager";
import { ExpressContextError } from "../error/express_context_error";
import { HTTPRouteHandlerParameter } from "../util/express_route_params_util";
import { Server } from "http";
import { ExpressRouteHandlerManager } from "./express_route_handler_manager";

// TODO: figure out how to globalize this
export const DEFAULT = "default";
export const EXPRESS_CONTEXT_NAME = "express_context";
export const REST_TAG = "rest";

export interface ExpressApplicationContainer {
  getExpressServerOptions?: () => Partial<ExpressServerOptions>;
  preconfigExpress?: (app: express.Express) => void;
}

export interface ServerContext {
  get HttpServer(): Server;
  startServer(): void;
}

export class ExpressApplicationContext
  extends IOCContextDecorator
  implements ServerContext
{
  private routeControllerManager: RouteControllerManager;
  private routeHandlerManager: ExpressRouteHandlerManager;
  private applicationManager: ExpressApplicationManager;
  private applicationContainer: ExpressApplicationContainer | undefined;

  constructor(context: IOCContextInterface) {
    super(context);
    this.routeControllerManager = new RouteControllerManager();
    this.routeHandlerManager = new ExpressRouteHandlerManager();
    this.applicationManager = new ExpressApplicationManager(
      this.routeHandlerManager
    );
  }

  public set ApplicationContainer(
    applicationContainer: ExpressApplicationContainer
  ) {
    this.applicationContainer = applicationContainer;
  }

  public addController(
    controllerId: string,
    path: string,
    handlers: [string, HTTPRouteHandlerModel, HTTPRouteHandlerParameter[]][]
  ) {
    this.routeControllerManager.addController(
      controllerId,
      path,
      handlers.map(([id, _]) => id)
    );
    handlers.forEach(([id, model, params]) => {
      this.routeHandlerManager.addHandler(id, controllerId, model);
      this.routeHandlerManager.addParams(id, params);
    });
  }

  public displayControllersString() {
    return this.routeControllerManager
      .getAllControllersWithRoutes()
      .map(([id, path]) => `${id}:${path}`)
      .join("\n");
  }

  public displayHandlersString() {
    return this.routeHandlerManager
      .getAllRoutesWithHandlers()
      .map(([route, handlers]) => `${route}:${handlers.join(", ")}`)
      .join("\n");
  }

  override build(): void {
    super.build();

    if (!this.applicationContainer) {
      throw ExpressContextError.noApplicationContainer();
    }
    const getServerOptions =
      this.applicationContainer.getExpressServerOptions ??
      function () {
        return {};
      };

    this.applicationManager.ServerOptions = getServerOptions();
    this.applicationManager.createServer(
      this.applicationContainer.preconfigExpress
    );
  }

  public startServer(): void {
    this.applicationManager.startServer();
  }

  get HttpServer(): Server {
    const server = this.applicationManager.HttpServer;
    if (!server) {
      throw ExpressContextError.noHttpServer();
    }
    return server;
  }
}
