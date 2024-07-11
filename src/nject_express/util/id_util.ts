import { IDBuilder } from "../../nject_ioc/util/id_util";
import { Constructor } from "../../nject_ioc/util/types";

export class ExpressIdType {
  static CONTROLLER = "express_controller";
  static HANDLER = "express_handler";
  static APPLICATION = "express_application";
  static ROUTE_MODEL = "express_route_model";
}

export class ExpressIdBuilder extends IDBuilder {
  static fromController(consructor: Constructor) {
    return new ExpressIdBuilder(ExpressIdType.CONTROLLER).addContent(
      consructor.name
    );
  }

  static fromHandler(methodName: string) {
    return new ExpressIdBuilder(ExpressIdType.HANDLER).addContent(methodName);
  }
}
