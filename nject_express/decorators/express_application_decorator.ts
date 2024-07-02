import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { Component } from "../../nject_ioc/decorators/component_decorator";
import { Constructor } from "../../nject_ioc/util/types";
import { ExpressApplicationContext } from "../core/application_context";

export const expressContextName = "express_context"
export const restTag = "rest";

export function ExpressApplication() {
  return function(constructor: Constructor) {
    Component(expressContextName, [restTag])
    // TODO: preconfiguration
  }
}