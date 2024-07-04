import { SocketIOIdBuilder } from "../utils/id_utils";

export function SocketEvent(event: string) {
  return function (
    targetPrototype: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const target = targetPrototype.constructor;

    if (!target.handlers) {
      target.handlers = [];
    }

    const handlerId = SocketIOIdBuilder.fromHandler(
      propertyKey.toString()
    ).build();

    target.handlers.push([handlerId, event]);
  };
}
