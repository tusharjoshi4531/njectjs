import { ControllerError } from "../error/controller_error";
import { RouteHandlerParameter } from "../util/express_route_params_util";
import { HTTPRouteHandlerModel } from "../util/http_route_handler_model";
import { HTTPRouteModel } from "../util/http_route_model";

export class RouteHandlerManager {
  private handlerToPath: Map<string, HTTPRouteHandlerModel>;
  private handlerToParent: Map<string, string>;
  private handlerToParams: Map<string, RouteHandlerParameter[]>;

  constructor() {
    this.handlerToPath = new Map();
    this.handlerToParent = new Map();
    this.handlerToParams = new Map();
  }

  public addHandler(
    id: string,
    parentId: string,
    model: HTTPRouteHandlerModel
  ) {
    if (this.handlerToPath.has(id)) {
      throw ControllerError.handlerIdNotFound(id);
    }
    this.handlerToPath.set(id, model);
    this.handlerToParent.set(id, parentId);
  }

  public addParams(id: string, params: RouteHandlerParameter[]) {
    this.handlerToParams.set(id, params);
  }

  public getHandlerParams(id: string) {
    return this.handlerToParams.get(id) ?? [];
  }

  public getModelById(id: string) {
    const model = this.handlerToPath.get(id);
    if (!model) {
      throw ControllerError.handlerIdDuplicate(id);
    }
    return model;
  }

  public getParentById(id: string) {
    const parent = this.handlerToParent.get(id);
    if (!parent) {
      throw ControllerError.handlerIdDuplicate(id);
    }
    return parent;
  }

  public getAllHandlersWithRoute() {
    return Array.from(this.handlerToPath.entries());
  }

  public getAllRoutesWithHandlers() {
    const intermediateRoutes = new Map<string, [number, string][]>();

    for (const [id, routeHandlerModel] of this.handlerToPath.entries()) {
      const routeModel = routeHandlerModel.Route;
      const routeModelString = routeModel.toString();
      const order = routeHandlerModel.Order;

      if (!intermediateRoutes.has(routeModelString)) {
        intermediateRoutes.set(routeModelString, []);
      }
      intermediateRoutes.get(routeModelString)!.push([order, id]);
    }

    for (const key of intermediateRoutes.keys()) {
      intermediateRoutes.get(key)?.sort((a, b) => a[0] - b[0]);
    }

    const routes = Array.from(intermediateRoutes.entries()).map(
      ([id, value]) => [
        id,
        value.map(([_, handlerId]) => [
          handlerId,
          this.getHandlerParams(handlerId),
        ]),
      ]
    ) as [string, Array<[string, RouteHandlerParameter[]]>][];

    return routes;
  }
}
