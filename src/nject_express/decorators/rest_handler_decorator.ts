import { HTTPRouteHandlerModel } from "../util/http_route_handler_model";
import { HTTPRouteModel } from "../util/http_route_model";
import { HttpMethod } from "../util/http_util";
import { ExpressIdBuilder } from "../util/id_util";

export function RestHandler(
  method: HttpMethod,
  path: string = "",
  order: number = Number.MAX_SAFE_INTEGER,
  detatched: boolean = false
) {
  return function (
    targetPrototype: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const target = targetPrototype.constructor;

    if (!target.handlers) {
      target.handlers = [];
    }

    const handlerId = ExpressIdBuilder.fromHandler(
      propertyKey.toString()
    ).build();
    const routeHandlerModel = new HTTPRouteHandlerModel(
      order,
      new HTTPRouteModel(path, method)
    );

    target.handlers.push([handlerId, detatched, routeHandlerModel]);
  };
}

export const GET = RestHandler.bind(this, HttpMethod.GET);
export const POST = RestHandler.bind(this, HttpMethod.POST);
export const DELETE = RestHandler.bind(this, HttpMethod.DELETE);
export const PATCH = RestHandler.bind(this, HttpMethod.PATCH);
export const PUT = RestHandler.bind(this, HttpMethod.PUT);
