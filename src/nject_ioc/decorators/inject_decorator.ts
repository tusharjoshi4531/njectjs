import { IOCError } from "../error/ioc_error";
import { IDBuilder } from "../util/id_util";
import { Constructor } from "../util/types";

export function Inject(parameterConstructor: Constructor) {
  return function (
    target: any,
    propertyKey: string | undefined,
    parameterIndex: number
  ) {
    const parameterId = IDBuilder.fromComponent(parameterConstructor).build();

    if (propertyKey !== undefined) {
      throw IOCError.canOnlyInjectInConstructor(
       parameterId
      );
    }

    if(!target.dependancies) {
      target.dependancies = [];
    }
    target.dependancies.push([parameterIndex, parameterId])
  };
}
