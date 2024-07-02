import { HTTPRouteModel } from "./http_route_model";

export class HTTPRouteHandlerModel {
  constructor(private order: number, private route: HTTPRouteModel) {}

  public get Order() {
    return this.order;
  }

  public get Route() {
    return this.route;
  }

  public set Route(route: HTTPRouteModel) {
    this.route = route;
  }
}
