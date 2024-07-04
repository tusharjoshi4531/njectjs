import { IDUtil } from "../../nject_ioc/util/id_util";
import { HTTPRouteModelError } from "../error/route_model_error";
import { HttpMethod } from "./http_util";
import { ExpressIdBuilder, ExpressIdType } from "./id_util";

export class HTTPRouteModel {
  constructor(private path: string, private method: HttpMethod) {}

  public get Path() {
    return this.path;
  }

  public get Method() {
    return this.method;
  }

  public toString() {
    return new ExpressIdBuilder()
      .setType(ExpressIdType.ROUTE_MODEL)
      .addContent(this.Method)
      .addContent(this.Path)
      .build();
  }

  public addPrefix(lhs: string) {
    this.path = `${lhs}${this.Path}`;
  }

  // Factory methods
  static fromString(id: string) {
    const data = IDUtil.getIdData(id);
    if (data[0] !== ExpressIdType.ROUTE_MODEL || data.length < 3) {
      throw HTTPRouteModelError.invalidString(id);
    }

    return new HTTPRouteModel(data[2], data[1] as HttpMethod);
  }

  static GET(path: string) {
    return new HTTPRouteModel(path, HttpMethod.GET);
  }

  static POST(path: string) {
    return new HTTPRouteModel(path, HttpMethod.POST);
  }

  static PUT(path: string) {
    return new HTTPRouteModel(path, HttpMethod.PUT);
  }

  static DELETE(path: string) {
    return new HTTPRouteModel(path, HttpMethod.DELETE);
  }

  static PATCH(path: string) {
    return new HTTPRouteModel(path, HttpMethod.PATCH);
  }

  static OPTIONS(path: string) {
    return new HTTPRouteModel(path, HttpMethod.OPTIONS);
  }

  static HEAD(path: string) {
    return new HTTPRouteModel(path, HttpMethod.HEAD);
  }

  static ALL(path: string) {
    return new HTTPRouteModel(path, HttpMethod.ALL);
  }
}
