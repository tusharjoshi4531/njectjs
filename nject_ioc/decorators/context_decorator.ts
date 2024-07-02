import { contextRegistry } from "../core/context_registry";
import { Constructor } from "../util/types";

export function IOCContext(contextId: string = "default") {
  return function (constructor: Constructor<any>) {
    contextRegistry.registerContext(contextId);
  };
}
