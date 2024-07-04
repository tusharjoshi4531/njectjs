import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  EXPRESS_CONTEXT_NAME,
  ExpressApplicationContainer,
  ExpressApplicationContext,
} from "../../nject_express/core/express_application_context";
import { ExpressApplication } from "../../nject_express/decorators/express_application_decorator";
import { contextRegistry } from "../../nject_ioc/core/context_registry";
import {
  DEFAULT,
  SOCKETIO_CONTEXT_NAME,
  SocketIOApplicationContainer,
  SocketIOApplicationContext,
} from "../core/socket_io_application_context";
import { SocketIOApplication } from "../decorators/socket_application_decorator";

const context = contextRegistry.registerContext(DEFAULT);
const expessContext = new ExpressApplicationContext(context);
const socketContext = new SocketIOApplicationContext(
  expessContext,
  expessContext
);

contextRegistry.registerContext(EXPRESS_CONTEXT_NAME, expessContext);
contextRegistry.registerContext(SOCKETIO_CONTEXT_NAME, socketContext);

console.log(context.getAllObjects());

@ExpressApplication
class ExpressApp implements ExpressApplicationContainer {}

console.log();

@SocketIOApplication
class SocketApp implements SocketIOApplicationContainer {
  preconfigSocket = (io: Server) => {
    io.of("test").on("connection", (socket) => {});
  };
}

expessContext.startServer();
