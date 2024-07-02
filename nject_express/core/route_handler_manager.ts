import { ControllerError } from "../error/controller_error";
import { HTTPRouteHandlerModel } from "../util/http_route_handler_model";

export class RouteHandlerManager {
  private handlerToPath: Map<string, HTTPRouteHandlerModel>;

  constructor() {
    this.handlerToPath = new Map();
  }

  public addHandler(id: string, model: HTTPRouteHandlerModel) {
    if (this.handlerToPath.has(id)) {
      throw ControllerError.handlerIdNotFound(id);
    }
    this.handlerToPath.set(id, model);
  }

  public getModelById(id: string) {
    const model = this.handlerToPath.get(id);
    if (!model) {
      throw ControllerError.handlerIdDuplicate(id);
    }
    return model;
  }

  public getAllHandlersWithRoute() {
    return Array.from(this.handlerToPath.entries());
  }
}
