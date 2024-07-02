import { IOCContext } from "../../nject_ioc/core/context";
import { HTTPRouteHandlerModel } from "../util/http_route_handler_model";
import { HTTPRouteModel } from "../util/http_route_model";
import { RouteControllerManager } from "./route_controller_manager";
import { RouteHandlerManager } from "./route_handler_manager";

export class ExpressApplicationContext extends IOCContext {
  private routeControllerManager: RouteControllerManager;
  private routeHandlerManager: RouteHandlerManager;

  constructor() {
    super();
    this.routeControllerManager = new RouteControllerManager();
    this.routeHandlerManager = new RouteHandlerManager();
  }

  public addController(
    id: string,
    path: string,
    handlers: [string, HTTPRouteHandlerModel][]
  ) {
    this.routeControllerManager.addController(
      id,
      path,
      handlers.map(([id, _]) => id)
    );
    handlers.forEach(([id, model]) =>
      this.routeHandlerManager.addHandler(id, model)
    );
  }

  public displayControllersString() {
    return this.routeControllerManager
      .getAllControllersWithRoutes()
      .map(([id, path]) => `${id}:${path}`)
      .join("\n");
  }

  public displayHandlersString() {
    return this.routeHandlerManager
      .getAllHandlersWithRoute()
      .map(([id, model]) => `${id}:${model.Order} ${model.Route.toString()}`)
      .join("\n");
  }

  override build(): void {
    super.build();
  }
}
