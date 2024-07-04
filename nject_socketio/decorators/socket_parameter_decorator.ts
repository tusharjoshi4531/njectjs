import { SocketIOIdBuilder } from "../utils/id_utils";
import { SocketIORouteHandlerParameter } from "../utils/socketio_route_parameter_util";

export function RequestParam(paramType: SocketIORouteHandlerParameter) {
  return function (
    targetPrototype: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    const target = targetPrototype.constructor;
    const handlerId = SocketIOIdBuilder.fromHandler(
      propertyKey.toString()
    ).build();

    if (!target.params) {
      target.params = new Map<
        string,
        Array<[number, SocketIORouteHandlerParameter]>
      >();
    }

    const params = target.params as Map<
      string,
      Array<[number, SocketIORouteHandlerParameter]>
    >;
    if (!params.get(handlerId)) {
      params.set(handlerId, []);
    }
    params.get(handlerId)!.push([parameterIndex, paramType]);
  };
}

export const IOSocket = RequestParam(SocketIORouteHandlerParameter.SOCKET);
export const IOServer = RequestParam(
  SocketIORouteHandlerParameter.SOCKET_SERVER
);
export const IOData = RequestParam(SocketIORouteHandlerParameter.DATA);
export const IOCallBAck = RequestParam(SocketIORouteHandlerParameter.CALLBACK);
