import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { Component } from "../../nject_ioc/decorators/component_decorator";
import { Constructor } from "../../nject_ioc/util/types";
import {
  ExpressApplicationContainer,
  ExpressApplicationContext,
} from "../core/application_context";
import { ExpressIdType } from "../util/id_util";

// TODO: figure out how to globalize this
export const DEFAULT = "default";
export const EXPRESS_CONTEXT_NAME = "express_context";
export const REST_TAG = "rest";

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

  expressContext.build();
  // TODO: preconfiguration
}
