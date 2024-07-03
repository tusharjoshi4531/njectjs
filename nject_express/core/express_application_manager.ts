import express, { RequestHandler } from "express";
import http from "http";
import cors from "cors";
import { RouteHandlerManager } from "./route_handler_manager";
import { HTTPRouteModel } from "../util/http_route_model";
import {
  RequestParamUtil,
  RouteHandlerParameter,
} from "../util/express_route_params_util";
import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { EXPRESS_CONTEXT_NAME } from "../decorators/express_application_decorator";
import { IDUtil } from "../../nject_ioc/util/id_util";
import { HttpMethod } from "../util/http_util";

export interface ExpressServerOptions {
  port: number;
  cors: cors.CorsOptions;
}

export class ExpressApplicationManager {
  private app: express.Express;
  private server: http.Server | undefined;
  private serverOptions: ExpressServerOptions;

  constructor(private routeHanlderManager: RouteHandlerManager) {
    this.app = express();
    this.serverOptions = {
      port: 8080,
      cors: {
        origin: "*",
      },
    };
  }

  public set ServerOptions(options: Partial<ExpressServerOptions>) {
    this.serverOptions.port = options.port ?? this.serverOptions.port;
    this.serverOptions.cors = options.cors ?? this.serverOptions.cors;
  }

  public boot(preconfig?: (app: express.Express) => void) {
    this.app.use(express.json());
    this.app.use(cors(this.serverOptions.cors));

    preconfig && preconfig(this.app);

    this.server = http.createServer(this.app);

    const routes = this.routeHanlderManager.getAllRoutesWithHandlers();

    console.log(routes[0]);
    routes.forEach(([route, handlersWithParams]) => {
      const routeModel = HTTPRouteModel.fromString(route);
      const method = routeModel.Method;
      const path = routeModel.Path;

      const requestHandlers = handlersWithParams.map(([handlerId, params]) => {
        const requestHandler = this.createExpessHandler(handlerId, params);
        return requestHandler;
      });

      this.attachRouteHandler(method, path, requestHandlers);
    });

    this.server.listen(this.serverOptions.port, () => {
      console.log(`Server is running at port ${this.serverOptions.port}`);
    });
  }

  private createExpessHandler(
    handlerId: string,
    params: RouteHandlerParameter[]
  ) {
    const parentId = this.routeHanlderManager.getParentById(handlerId);
    const handlerName = IDUtil.getIdData(handlerId)[1];

    const context = contextRegistry.getContextById(EXPRESS_CONTEXT_NAME);
    const controllerObject = context.getObjectByID(parentId);

    const requestHandler: RequestHandler = (req, res, next) => {
      const functionParams = params.map((routeHandlerParam) =>
        RequestParamUtil.getProperty(routeHandlerParam, req, res)
      );

      const result = controllerObject[handlerName](...functionParams);
      console.log(result);

      res.status(200).json({ handlerName });
    };

    return requestHandler;
  }

  private attachRouteHandler(
    method: HttpMethod,
    path: string,
    handlers: RequestHandler[]
  ) {
    switch (method) {
      case HttpMethod.ALL:
        return this.app.all(path, handlers);
      case HttpMethod.GET:
        return this.app.get(path, handlers);
      case HttpMethod.POST:
        return this.app.post(path, handlers);
      case HttpMethod.PUT:
        return this.app.put(path, handlers);
      case HttpMethod.DELETE:
        return this.app.delete(path, handlers);
      case HttpMethod.PATCH:
        return this.app.patch(path, handlers);
      case HttpMethod.OPTIONS:
        return this.app.options(path, handlers);
      case HttpMethod.HEAD:
        return this.app.head(path, handlers);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}