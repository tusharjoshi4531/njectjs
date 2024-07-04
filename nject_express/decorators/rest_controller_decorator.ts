import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { Component } from "../../nject_ioc/decorators/component_decorator";
import { Constructor } from "../../nject_ioc/util/types";
import {
  EXPRESS_CONTEXT_NAME,
  ExpressApplicationContext,
  REST_TAG,
} from "../core/express_application_context";
import { HTTPRouteHandlerParameter } from "../util/express_route_params_util";
import { HTTPRouteHandlerModel } from "../util/http_route_handler_model";
import { ExpressIdBuilder, ExpressIdType } from "../util/id_util";

export function RestController(path: string = "") {
  return function (constructor: Constructor) {
    Component(
      EXPRESS_CONTEXT_NAME,
      [REST_TAG],
      ExpressIdType.CONTROLLER
    )(constructor);

    const constructorId = ExpressIdBuilder.fromController(constructor).build();
    const handlers: [string, boolean, HTTPRouteHandlerModel][] =
      (constructor as any).handlers ?? [];

    const params: Map<string, Array<[number, HTTPRouteHandlerParameter]>> = (
      constructor as any
    ).params ?? new Map();

    const context = contextRegistry.getContextById(
      EXPRESS_CONTEXT_NAME
    ) as ExpressApplicationContext;

    const intermediateHandlers = handlers.map(([id, detatched, model]) => {
      if (!detatched) model.Route.addPrefix(path);
      return [id, model];
    }) as [string, HTTPRouteHandlerModel][];

    const handlersWithParams = intermediateHandlers.map(([id, model]) => {
      const handlerParams = params.get(id) ?? [];
      handlerParams.sort((a, b) => a[0] - b[0]);
      return [id, model, handlerParams.map(([_, parameter]) => parameter)];
    }) as [string, HTTPRouteHandlerModel, HTTPRouteHandlerParameter[]][];

    context.addController(constructorId, path, handlersWithParams);
  };
}
