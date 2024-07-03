import { IOCContextInterface } from "../../nject_ioc/core/context";
import { IOCContextDecorator } from "../../nject_ioc/core/context_decorator";
import { HTTPRouteHandlerModel } from "../util/http_route_handler_model";
import { RouteControllerManager } from "./route_controller_manager";
import { RouteHandlerManager } from "./route_handler_manager";
import express from "express";
import {
  ExpressApplicationManager,
  ExpressServerOptions,
} from "./express_application_manager";
import { ExpressContextError } from "../error/express_context_error";
import { RouteHandlerParameter } from "../util/express_route_params_util";

export interface ExpressApplicationContainer {
  getServerOptions?: () => Partial<ExpressServerOptions>;
  preconfig?: (app: express.Express) => void;
}

export class ExpressApplicationContext extends IOCContextDecorator {
  private routeControllerManager: RouteControllerManager;
  private routeHandlerManager: RouteHandlerManager;
  private expressApplicationManager: ExpressApplicationManager;
  private applicationContainer: ExpressApplicationContainer | undefined;

  constructor(context: IOCContextInterface) {
    super(context);
    this.routeControllerManager = new RouteControllerManager();
    this.routeHandlerManager = new RouteHandlerManager();
    this.expressApplicationManager = new ExpressApplicationManager(
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
    handlers: [string, HTTPRouteHandlerModel, RouteHandlerParameter[]][]
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
      this.applicationContainer.getServerOptions ??
      function () {
        return {};
      };

    this.expressApplicationManager.ServerOptions = getServerOptions();
    this.expressApplicationManager.boot(this.applicationContainer.preconfig);
  }
}
