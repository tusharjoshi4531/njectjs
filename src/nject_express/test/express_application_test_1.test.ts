import { contextRegistry } from "../../nject_ioc/core/context_registry";
import {
  DEFAULT,
  EXPRESS_CONTEXT_NAME,
  ExpressApplicationContainer,
  ExpressApplicationContext,
} from "../core/express_application_context";

import { RestController } from "../decorators/rest_controller_decorator";
import { GET, POST } from "../decorators/rest_handler_decorator";
import { ExpressRequestParam } from "../decorators/express_parameter_decorator";
import { HTTPRouteHandlerParameter } from "../util/express_route_params_util";
import { ResponseEntity } from "../core/server_entities/server_response_entity";
import { NextEntity } from "../core/server_entities/server_next_entity";
import { ExpressApplication } from "../decorators/express_application_decorator";

const context = contextRegistry.registerContext(DEFAULT);
const expressContext = new ExpressApplicationContext(context);
contextRegistry.registerContext(EXPRESS_CONTEXT_NAME, expressContext);

@RestController("/api/a")
class A {}

@RestController("/api/b")
class B {
  // TODO: fix parameter error
  @GET("/test", 100)
  public a(@ExpressRequestParam(HTTPRouteHandlerParameter.REQUEST_BODY) body: any) {
    console.log(body);
    body.t = "b";
    return ResponseEntity.ok(body);
  }

  @GET("/test", 10)
  public c() {
    return NextEntity.fromObject({
      test: "a",
    });
  }

  @POST("/test")
  public b() {}
}

@ExpressApplication
class App implements ExpressApplicationContainer {
  getExpressServerOptions = () => ({
    port: 8081,
  });
}
// const context = contextRegistry.getContextById(
//   EXPRESS_CONTEXT_NAME
// ) as ExpressApplicationContext;

console.log(expressContext.displayControllersString());
console.log(expressContext.displayHandlersString());
