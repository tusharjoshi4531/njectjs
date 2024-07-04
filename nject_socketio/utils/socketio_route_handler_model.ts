import { IDUtil } from "../../nject_ioc/util/id_util";
import { SocketIORouteModelError } from "../error/socket_io_route_model_error";
import { SocketIOIdBuilder, SocketIOIdType } from "./id_utils";

export class SocketIORouteHandlerModel {
  constructor(private namespace: string, private event: string) {}

  public get Namespace() {
    return this.namespace;
  }

  public get Event() {
    return this.event;
  }

  public toString() {
    return SocketIOIdBuilder.fromRouteModel()
      .addContent(this.Namespace)
      .addContent(this.Event)
      .build();
  }

  static fromString(id: string) {
    const data = IDUtil.getIdData(id);
    if (data[0] !== SocketIOIdType.ROUTE_MODEL || data.length < 3) {
      throw SocketIORouteModelError.invalidString(id);
    }

    return new SocketIORouteHandlerModel(data[1], data[2]);
  }
}
