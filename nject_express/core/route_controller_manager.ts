import { ControllerError } from "../error/controller_error";
import { HTTPRouteModel } from "../util/http_route_model";

export class RouteControllerManager {
  private controllerToRouteMap: Map<string, string>;
  private handlerMap: Map<string, string[]>;

  constructor() {
    this.controllerToRouteMap = new Map();
    this.handlerMap = new Map();
  }

  public addController(id: string, path: string, handlerIds: string[]) {
    if (this.controllerToRouteMap.has(id)) {
      throw ControllerError.controllerIdDuplicate(id);
    }
    this.controllerToRouteMap.set(id, path);
    this.handlerMap.set(id, handlerIds);
    console.log({ con: this.controllerToRouteMap });
  }

  public getControllerRoute(id: string) {
    const model = this.controllerToRouteMap.get(id);
    if (!model) {
      throw ControllerError.controllerIdNotFound(id);
    }
    return model;
  }

  public getControllerHandlers(id: string) {
    return this.handlerMap.get(id) ?? [];
  }

  public getAllControllersWithRoutes() {
    return Array.from(this.controllerToRouteMap.entries());
  }
}
