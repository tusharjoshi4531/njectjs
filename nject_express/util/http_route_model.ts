import { HttpMethod } from "./http_util";

export class HTTPRouteModel {
  constructor(private path: string, private method: HttpMethod) {}

  public get Path() {
    return this.path;
  }

  public get Method() {
    return this.method;
  }

  public toString() {
    return `${this.method}:${this.path}`;
  }

  static add(lhs: string, rhs: HTTPRouteModel) {
    return new HTTPRouteModel(`${lhs}${rhs.Path}`, rhs.Method);
  }

  // Factory methods
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
