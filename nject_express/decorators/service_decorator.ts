import { Component } from "../../nject_ioc/decorators/component_decorator";
import { Constructor } from "../../nject_ioc/util/types";
import { expressContextName, restTag } from "./express_application_decorator";

export function Service(constructor: Constructor) {
  Component(expressContextName, [restTag])(constructor);
}
