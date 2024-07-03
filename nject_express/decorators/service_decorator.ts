import { Component } from "../../nject_ioc/decorators/component_decorator";
import { Constructor } from "../../nject_ioc/util/types";
import { EXPRESS_CONTEXT_NAME, REST_TAG } from "./express_application_decorator";

export function Service(constructor: Constructor) {
  Component(EXPRESS_CONTEXT_NAME, [REST_TAG])(constructor);
}
