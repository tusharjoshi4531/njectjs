import { RouteHandlerManager } from "../../nject_express/core/route_handler_manager";
import { SocketIORouteHandlerModel } from "../utils/socketio_route_handler_model";
import { SocketIORouteHandlerParameter } from "../utils/socketio_route_parameter_util";

export class SocketIORouteHandlerManager extends RouteHandlerManager<
  SocketIORouteHandlerModel,
  SocketIORouteHandlerParameter
> {
  public getAllNamespacesWithEvents() {
    const handlers = this.getAllHandlersWithRoute();
    const routes = new Map<
      string,
      [string, string, SocketIORouteHandlerParameter[]][]
    >();

    for (const [id, routeHandlerModels] of handlers) {
      for (const routeHandlerModel of routeHandlerModels) {
        const namespace = routeHandlerModel.Namespace;
        const event = routeHandlerModel.Event;
        const params = this.getHandlerParams(id);

        if (!routes.has(namespace)) {
          routes.set(namespace, []);
        }
        routes.get(namespace)!.push([event, id, params]);
      }
    }

    return Array.from(routes.entries());
  }
}
