import { SocketIOIdBuilder } from "../utils/id_utils";
import { SocketIORouteHandlerParameter } from "../utils/socketio_route_parameter_util";

export function SocketRequestParam(paramType: SocketIORouteHandlerParameter) {
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

export const IOSocket = SocketRequestParam(SocketIORouteHandlerParameter.SOCKET);
export const IOServer = SocketRequestParam(
  SocketIORouteHandlerParameter.SOCKET_SERVER
);
export const IOData = SocketRequestParam(SocketIORouteHandlerParameter.DATA);
export const IOCallBack = SocketRequestParam(SocketIORouteHandlerParameter.CALLBACK);
