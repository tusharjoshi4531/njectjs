import { HTTPRouteHandlerParameter } from "../util/express_route_params_util";
import { ExpressIdBuilder } from "../util/id_util";

export function ExpressRequestParam(paramType: HTTPRouteHandlerParameter) {
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
      target.params = new Map<string, Array<[number, HTTPRouteHandlerParameter]>>();
    }
    const params = target.params as Map<
      string,
      Array<[number, HTTPRouteHandlerParameter]>
    >;
    if (!params.get(handlerId)) {
      params.set(handlerId, []);
    }
    params.get(handlerId)!.push([parameterIndex, paramType]);
  };
}

export const RequestObject = ExpressRequestParam(HTTPRouteHandlerParameter.REQUEST);
export const RequestBody = ExpressRequestParam(HTTPRouteHandlerParameter.REQUEST_BODY);
export const RequestQuery = ExpressRequestParam(HTTPRouteHandlerParameter.REQUSET_QUERY);
export const PathVariable = ExpressRequestParam(HTTPRouteHandlerParameter.REQUEST_PARAMS);
export const RequestHeaders = ExpressRequestParam(
  HTTPRouteHandlerParameter.REQUEST_HEADERS
);
export const ResponseObject = ExpressRequestParam(HTTPRouteHandlerParameter.RESPONSE);
