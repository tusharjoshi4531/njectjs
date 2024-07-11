import { ControllerError } from "../error/controller_error";
import { HTTPRouteHandlerParameter } from "../util/express_route_params_util";
import { HTTPRouteHandlerModel } from "../util/http_route_handler_model";

export class RouteHandlerManager<RouteHandlerModel, ParameterModel> {
  private handlerToPath: Map<string, RouteHandlerModel[]>;
  private handlerToParent: Map<string, string>;
  private handlerToParams: Map<string, ParameterModel[]>;

  constructor() {
    this.handlerToPath = new Map();
    this.handlerToParent = new Map();
    this.handlerToParams = new Map();
  }

  public addHandler(id: string, parentId: string, model: RouteHandlerModel) {
    if (!this.handlerToPath.has(id)) {
      this.handlerToPath.set(id, []);
    }
    this.handlerToPath.get(id)!.push(model);
    this.handlerToParent.set(id, parentId);
  }

  public addParams(id: string, params: ParameterModel[]) {
    this.handlerToParams.set(id, params);
  }

  public getHandlerParams(id: string) {
    return this.handlerToParams.get(id) ?? [];
  }

  public getModelById(id: string) {
    const model = this.handlerToPath.get(id);
    if (!model) {
      throw ControllerError.handlerIdDuplicate(id);
    }
    return model;
  }

  public getParentById(id: string) {
    const parent = this.handlerToParent.get(id);
    if (!parent) {
      throw ControllerError.handlerIdDuplicate(id);
    }
    return parent;
  }

  public getAllHandlersWithRoute() {
    return Array.from(this.handlerToPath.entries());
  }
}
