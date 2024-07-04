import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { Component } from "../../nject_ioc/decorators/component_decorator";
import { Constructor } from "../../nject_ioc/util/types";
import {
  SOCKETIO_CONTEXT_NAME,
  SOCKET_TAG,
  SocketIOApplicationContainer,
  SocketIOApplicationContext,
} from "../core/socket_io_application_context";
import { SocketIOIdType } from "../utils/id_utils";

export function SocketIOApplication(
  constructor: Constructor<SocketIOApplicationContainer>
) {
  Component(
    SOCKETIO_CONTEXT_NAME,
    [SOCKET_TAG],
    SocketIOIdType.APPLICATION
  )(constructor);

  const socketContext = contextRegistry.getContextById(
    SOCKETIO_CONTEXT_NAME
  ) as SocketIOApplicationContext;

  console.log("1");

  socketContext.ApplicationContainer = new constructor();

  console.log("2");

  console.log("BUILD SOCKET");
  socketContext.build();
}
