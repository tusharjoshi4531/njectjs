import { HTTPRouteHandlerParameter } from "../util/express_route_params_util";
import { HTTPRouteHandlerModel } from "../util/http_route_handler_model";
import { RouteHandlerManager } from "./route_handler_manager";

export class ExpressRouteHandlerManager extends RouteHandlerManager<
  HTTPRouteHandlerModel,
  HTTPRouteHandlerParameter
> {
  public getAllRoutesWithHandlers() {
    const intermediateRoutes = new Map<string, [number, string][]>();
    const handlers = this.getAllHandlersWithRoute();

    for (const [id, routeHandlerModel] of handlers) {
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
    ) as [string, Array<[string, HTTPRouteHandlerParameter[]]>][];

    return routes;
  }
}
