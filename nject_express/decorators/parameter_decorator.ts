import { RouteHandlerParameter } from "../util/express_route_params_util";
import { ExpressIdBuilder } from "../util/id_util";

export function RequestParam(paramType: RouteHandlerParameter) {
  return function (
    targetPrototype: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    const target = targetPrototype.constructor;
    const handlerId = ExpressIdBuilder.fromHandler(
      propertyKey.toString()
    ).build();

    if (!target.params) {
      target.params = new Map<string, Array<[number, string]>>();
    }
    const params = target.params as Map<
      string,
      Array<[number, RouteHandlerParameter]>
    >;
    if (!params.get(handlerId)) {
      params.set(handlerId, []);
    }
    params.get(handlerId)!.push([parameterIndex, paramType]);
  };
}
