import { IDBuilder } from "../../nject_ioc/util/id_util";
import { Constructor } from "../../nject_ioc/util/types";

export class SocketIOIdType {
  static CONTROLLER = "socketio_controller";
  static HANDLER = "socketio_handler";
  static APPLICATION = "socketio_application";
  static ROUTE_MODEL = "socketio_route_model";
}

export class SocketIOIdBuilder extends IDBuilder {
  static fromController(constructor: Constructor) {
    return new SocketIOIdBuilder(SocketIOIdType.CONTROLLER).addContent(
      constructor.name
    );
  }

  static fromHandler(methodName: string) {
    return new SocketIOIdBuilder(SocketIOIdType.HANDLER).addContent(
      methodName
    );
  }

  static fromRouteModel() {
    return new SocketIOIdBuilder(SocketIOIdType.ROUTE_MODEL);
  }
}
