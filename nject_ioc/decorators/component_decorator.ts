import { contextRegistry } from "../core/context_registry";
import { IDBuilder, IdType } from "../util/id_util";
import { Constructor } from "../util/types";

export function Component(
  contextId: string = "default",
  tags: string[] = [],
  type: string = IdType.COMPONENT
) {
  return function (constructor: Constructor<any>) {
    const dependancies: [number, string][] =
      (constructor as any).dependancies ?? [];

    const context = contextRegistry.getContextById(contextId);
    console.log({ context });
    const constructorId = IDBuilder.fromType(type)
      .addContent(constructor.name)
      .build();

    context.addConstructor(constructorId, constructor);
    tags.forEach((tag) => context.addTag(constructorId, tag));

    dependancies
      .sort((a, b) => a[0] - b[0])
      .forEach(([_, dependancy]) => {
        context.addDependancy(constructorId, dependancy);
      });
  };
}
