import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { Component } from "../../nject_ioc/decorators/component_decorator";
import { Constructor } from "../../nject_ioc/util/types";
import {
  SOCKETIO_CONTEXT_NAME,
  SOCKET_TAG,
  SocketIOApplicationContext,
} from "../core/socket_io_application_context";
import { SocketIOIdBuilder, SocketIOIdType } from "../utils/id_utils";
import { SocketIORouteHandlerModel } from "../utils/socketio_route_handler_model";
import { SocketIORouteHandlerParameter } from "../utils/socketio_route_parameter_util";

export function SocketController(namespace: string) {
  return function (constructor: Constructor) {
    Component(
      SOCKETIO_CONTEXT_NAME,
      [SOCKET_TAG],
      SocketIOIdType.CONTROLLER
    )(constructor);

    const constructorId = SocketIOIdBuilder.fromController(constructor).build();
    const handlers: [string, string][] = (constructor as any).handlers ?? [];

    const params: Map<string, [number, SocketIORouteHandlerParameter][]> =
      (constructor as any).params ?? new Map();

    const context = contextRegistry.getContextById(
      SOCKETIO_CONTEXT_NAME
    ) as SocketIOApplicationContext;

    const handlersWithParams = handlers.map(([id, event]) => {
      const model = new SocketIORouteHandlerModel(namespace, event);
      const handlerParams = params.get(id) ?? [];
      handlerParams.sort((a, b) => a[0] - b[0]);
      return [id, model, handlerParams.map(([_, param]) => param)];
    }) as [
      string,
      SocketIORouteHandlerModel,
      SocketIORouteHandlerParameter[]
    ][];

    context.addController(constructorId, namespace, handlersWithParams);
  };
}
