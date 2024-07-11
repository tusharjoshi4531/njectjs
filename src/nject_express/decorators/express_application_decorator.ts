import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { Component } from "../../nject_ioc/decorators/component_decorator";
import { Constructor } from "../../nject_ioc/util/types";
import {
  EXPRESS_CONTEXT_NAME,
  ExpressApplicationContainer,
  ExpressApplicationContext,
  REST_TAG,
} from "../core/express_application_context";
import { ExpressIdType } from "../util/id_util";

export function ExpressApplication(
  constructor: Constructor<ExpressApplicationContainer>
) {
  Component(
    EXPRESS_CONTEXT_NAME,
    [REST_TAG],
    ExpressIdType.APPLICATION
  )(constructor);

  const expressContext = contextRegistry.getContextById(
    EXPRESS_CONTEXT_NAME
  ) as ExpressApplicationContext;
  expressContext.ApplicationContainer = new constructor();

  console.log("BUILD EXPRESS")
  expressContext.build();
  // TODO: preconfiguration
}
