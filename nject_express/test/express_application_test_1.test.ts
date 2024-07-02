import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { ExpressApplicationContext } from "../core/application_context";
import { expressContextName } from "../decorators/express_application_decorator";
import { RestController } from "../decorators/rest_controller_decorator";
import { GET, POST, RestHandler } from "../decorators/rest_handler_decorator";

const context = new ExpressApplicationContext();
contextRegistry.registerContext(expressContextName, context);

@RestController("/api/a")
class A {}

@RestController("/api/b")
class B {
  @GET("/test")
  public a() {}

  @POST("/test")
  public b() {}
}

console.log(context.displayControllersString());
console.log(context.displayHandlersString());
