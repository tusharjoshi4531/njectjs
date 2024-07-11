import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  DEFAULT,
  EXPRESS_CONTEXT_NAME,
  ExpressApplicationContainer,
  ExpressApplicationContext,
} from "../../nject_express/core/express_application_context";
import { ExpressApplication } from "../../nject_express/decorators/express_application_decorator";
import { contextRegistry } from "../../nject_ioc/core/context_registry";
import {
  SOCKETIO_CONTEXT_NAME,
  SocketIOApplicationContainer,
  SocketIOApplicationContext,
} from "../core/socket_io_application_context";
import { SocketIOApplication } from "../decorators/socket_application_decorator";
import { SocketController } from "../decorators/socket_controller_decorator";
import { SocketEvent } from "../decorators/socket_handler_decorator";
import { RestController } from "../../nject_express/decorators/rest_controller_decorator";
import { GET } from "../../nject_express/decorators/rest_handler_decorator";
import { ResponseEntity } from "../../nject_express/core/server_entities/server_response_entity";

const context = contextRegistry.registerContext(DEFAULT);
const expessContext = new ExpressApplicationContext(context);
const socketContext = new SocketIOApplicationContext(
  expessContext,
  expessContext
);

contextRegistry.registerContext(EXPRESS_CONTEXT_NAME, expessContext);
contextRegistry.registerContext(SOCKETIO_CONTEXT_NAME, socketContext);

@RestController("/test")
class T {
  @GET("/")
  public a() {
    return ResponseEntity.noContent();
  }
}

console.log(context.getConstructorIDs());
console.log(expessContext.getConstructorIDs());
console.log(socketContext.getConstructorIDs());

// TODO: fix why controllers not being stored in context
@SocketController("sock")
class Sock {
  @SocketEvent("ping")
  public event() {
    console.log("ping");
  }
}

console.log(context.getConstructorIDs());
console.log(expessContext.getConstructorIDs());
console.log(socketContext.getConstructorIDs());

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
