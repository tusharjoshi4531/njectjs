import { Request } from "express";
import { contextRegistry } from "../../nject_ioc/core/context_registry";
import {
  ExpressApplicationContainer,
  ExpressApplicationContext,
} from "../core/application_context";
import {
  DEFAULT,
  EXPRESS_CONTEXT_NAME,
  ExpressApplication,
} from "../decorators/express_application_decorator";
import { RestController } from "../decorators/rest_controller_decorator";
import { GET, POST } from "../decorators/rest_handler_decorator";
import { RequestParam } from "../decorators/parameter_decorator";
import { RouteHandlerParameter } from "../util/express_route_params_util";

const context = contextRegistry.registerContext(DEFAULT);
const expressContext = new ExpressApplicationContext(context);
contextRegistry.registerContext(EXPRESS_CONTEXT_NAME, expressContext);

@RestController("/api/a")
class A {}

@RestController("/api/b")
class B {
  @GET("/test", 100)
  public a(@RequestParam(RouteHandlerParameter.REQUEST) req: Request) {}

  @GET("/test", 10)
  public c() {}

  @POST("/test")
  public b() {}
}

@ExpressApplication
class App implements ExpressApplicationContainer {
  getServerOptions = () => ({
    port: 8081,
  });
}
// const context = contextRegistry.getContextById(
//   EXPRESS_CONTEXT_NAME
// ) as ExpressApplicationContext;

console.log(expressContext.displayControllersString());
console.log(expressContext.displayHandlersString());
