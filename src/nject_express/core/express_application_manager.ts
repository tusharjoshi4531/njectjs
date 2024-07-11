import express, { RequestHandler } from "express";
import http from "http";
import cors from "cors";

import { HTTPRouteModel } from "../util/http_route_model";
import {
  HTTPRequestParamUtil,
  HTTPRouteHandlerParameter,
} from "../util/express_route_params_util";
import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { IDUtil } from "../../nject_ioc/util/id_util";
import { HttpMethod } from "../util/http_util";
import { ResponseEntity } from "./server_entities/server_response_entity";
import { NextEntity } from "./server_entities/server_next_entity";
import { HttpStatusCode } from "./server_entities/server_response_status";
import { ExpressRouteHandlerManager } from "./express_route_handler_manager";
import { ExpressContextError } from "../error/express_context_error";
import { EXPRESS_CONTEXT_NAME } from "./express_application_context";

export interface ExpressServerOptions {
  port: number;
  cors: cors.CorsOptions;
}

export class ExpressApplicationManager {
  private app: express.Express;
  private server: http.Server | undefined;
  private serverOptions: ExpressServerOptions;

  constructor(private routeHanlderManager: ExpressRouteHandlerManager) {
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

  public get HttpServer() {
    return this.server;
  }

  public createServer(preconfig?: (app: express.Express) => void) {
    this.app.use(express.json());
    this.app.use(cors(this.serverOptions.cors));

    preconfig && preconfig(this.app);

    this.server = http.createServer(this.app);

    const routes = this.routeHanlderManager.getAllRoutesWithHandlers();

    routes.forEach(([route, handlersWithParams]) => {
      const routeModel = HTTPRouteModel.fromString(route);
      const method = routeModel.Method;
      const path = routeModel.Path;

      const requestHandlers = handlersWithParams.map(([handlerId, params]) =>
        this.createExpessHandler(handlerId, params)
      );

      this.attachRouteHandler(method, path, requestHandlers);
    });
  }

  public startServer() {
    if (!this.server) {
      throw ExpressContextError.noHttpServer();
    }
    this.server.listen(this.serverOptions.port, () => {
      console.log(`Server is running at port ${this.serverOptions.port}`);
    });
  }

  private createExpessHandler(
    handlerId: string,
    params: HTTPRouteHandlerParameter[]
  ) {
    const parentId = this.routeHanlderManager.getParentById(handlerId);
    const handlerName = IDUtil.getIdData(handlerId)[1];

    const context = contextRegistry.getContextById(EXPRESS_CONTEXT_NAME);
    const controllerObject = context.getObjectByID(parentId);

    const requestHandler: RequestHandler = async (req, res, next) => {
      const functionParams = params.map((routeHandlerParam) =>
        HTTPRequestParamUtil.getProperty(routeHandlerParam, req, res)
      );

      const fn = controllerObject[handlerName].bind(controllerObject);

      try {
        const result = await fn(...functionParams);

        if (result instanceof ResponseEntity) {
          return res.status(result.Status).json(result.Body);
        } else if (result instanceof NextEntity) {
          result.updateRequest(req);
          return next();
        } else {
          return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json("Controller gives invalid response");
        }
      } catch (e) {
        return res
          .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
          .json({ message: "Uncaught exception in controllers" });
      }
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
