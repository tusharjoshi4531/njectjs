import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { Component } from "../../nject_ioc/decorators/component_decorator";
import { Constructor } from "../../nject_ioc/util/types";
import { ExpressApplicationContext } from "../core/application_context";
import { HTTPRouteHandlerModel } from "../util/http_route_handler_model";
import { ExpressIdBuilder } from "../util/id_util";
import { expressContextName, restTag } from "./express_application_decorator";

export function RestController(path: string = "") {
  return function (constructor: Constructor) {
    Component(expressContextName, [restTag]);

    const constructorId = ExpressIdBuilder.fromController(constructor).build();
    const handlers: [string, HTTPRouteHandlerModel][] =
      (constructor as any).handlers ?? [];
    const context = contextRegistry.getContextById(
      expressContextName
    ) as ExpressApplicationContext;

    console.log({
      constructorId,
      handlers,
    });

    context.addController(constructorId, path, handlers);
    console.log(context.displayControllersString());
  };
}
