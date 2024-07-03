import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { Component } from "../../nject_ioc/decorators/component_decorator";
import { Constructor } from "../../nject_ioc/util/types";
import { ExpressApplicationContext } from "../core/application_context";
import { RouteHandlerParameter } from "../util/express_route_params_util";
import { HTTPRouteHandlerModel } from "../util/http_route_handler_model";
import { ExpressIdBuilder, ExpressIdType } from "../util/id_util";
import {
  EXPRESS_CONTEXT_NAME,
  REST_TAG,
} from "./express_application_decorator";

export function RestController(path: string = "") {
  return function (constructor: Constructor) {
    Component(EXPRESS_CONTEXT_NAME, [REST_TAG], ExpressIdType.CONTROLLER)(constructor);

    const constructorId = ExpressIdBuilder.fromController(constructor).build();
    const handlers: [string, HTTPRouteHandlerModel][] =
      (constructor as any).handlers ?? [];

    const params: Map<string, Array<[number, RouteHandlerParameter]>> = (
      constructor as any
    ).params ?? new Map();

    console.log({ par: params.get("a") });

    const context = contextRegistry.getContextById(
      EXPRESS_CONTEXT_NAME
    ) as ExpressApplicationContext;

    handlers.forEach(([_, model]) => {
      model.Route.addPrefix(path);
    });

    const handlersWithParams = handlers.map(([id, model]) => {
      const handlerParams = params.get(id) ?? [];
      handlerParams.sort((a, b) => a[0] - b[0]);
      console.log({ hp: handlerParams });
      return [id, model, handlerParams.map(([_, parameter]) => parameter)];
    }) as [string, HTTPRouteHandlerModel, RouteHandlerParameter[]][];

    context.addController(constructorId, path, handlersWithParams);
    console.log(context.displayControllersString());
  };
}
