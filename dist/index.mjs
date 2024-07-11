// src/nject_ioc/core/context_decorator.ts
var IOCContextDecorator = class {
  constructor(context) {
    this.context = context;
  }
  addConstructor(id, constructor) {
    this.context.addConstructor(id, constructor);
  }
  addDependancy(dependant, dependancy) {
    this.context.addDependancy(dependant, dependancy);
  }
  addTag(id, tag) {
    this.context.addTag(id, tag);
  }
  getIdTags(id) {
    return this.context.getIdTags(id);
  }
  getIdsWithTag(tag) {
    return this.context.getIdsWithTag(tag);
  }
  getObjectByID(id) {
    return this.context.getObjectByID(id);
  }
  getObjectIds() {
    return this.context.getObjectIds();
  }
  getAllObjects() {
    return this.context.getAllObjects();
  }
  getConstructorIDs() {
    return this.context.getConstructorIDs();
  }
  build() {
    this.context.build();
  }
};

// src/nject_express/error/controller_error.ts
var ControllerError = class {
  static controllerIdNotFound(id) {
    return new Error(`Controller with ID: ${id} not found.`);
  }
  static controllerIdDuplicate(id) {
    return new Error(`Container with ID: ${id} already found.`);
  }
  static handlerIdNotFound(id) {
    return new Error(`Handler with ID: ${id} not found.`);
  }
  static handlerIdDuplicate(id) {
    return new Error(`Handler with ID: ${id} already found.`);
  }
};

// src/nject_express/core/route_controller_manager.ts
var RouteControllerManager = class {
  controllerToRouteMap;
  handlerMap;
  constructor() {
    this.controllerToRouteMap = /* @__PURE__ */ new Map();
    this.handlerMap = /* @__PURE__ */ new Map();
  }
  addController(id, path, handlerIds) {
    if (this.controllerToRouteMap.has(id)) {
      throw ControllerError.controllerIdDuplicate(id);
    }
    this.controllerToRouteMap.set(id, path);
    this.handlerMap.set(id, handlerIds);
  }
  getControllerRoute(id) {
    const model = this.controllerToRouteMap.get(id);
    if (!model) {
      throw ControllerError.controllerIdNotFound(id);
    }
    return model;
  }
  getControllerHandlers(id) {
    return this.handlerMap.get(id) ?? [];
  }
  getAllControllersWithRoutes() {
    return Array.from(this.controllerToRouteMap.entries());
  }
};

// src/nject_express/core/express_application_manager.ts
import express from "express";
import http from "http";
import cors from "cors";

// src/nject_ioc/util/id_util.ts
var sep = "::";
var IdType = class {
  static COMPONENT = "component";
};
var IDBuilder = class _IDBuilder {
  constructor(type = "", content = []) {
    this.type = type;
    this.content = content;
  }
  setType(type) {
    this.type = type;
    return this;
  }
  addContent(content) {
    this.content.push(content);
    return this;
  }
  build() {
    return [this.type, ...this.content].join(sep);
  }
  static fromComponent(constructor) {
    return new _IDBuilder(IdType.COMPONENT).addContent(constructor.name);
  }
  static fromType(type) {
    return new _IDBuilder(type);
  }
};
var IDUtil = class {
  static getIdData(id) {
    return id.split(sep);
  }
};

// src/nject_express/error/route_model_error.ts
var HTTPRouteModelError = class {
  static invalidString(id) {
    return new Error(
      `String "${id}" is an invalid representation of a HTTPRouteModel`
    );
  }
};

// src/nject_express/util/http_util.ts
var HttpMethod = /* @__PURE__ */ ((HttpMethod2) => {
  HttpMethod2["GET"] = "GET";
  HttpMethod2["POST"] = "POST";
  HttpMethod2["PUT"] = "PUT";
  HttpMethod2["DELETE"] = "DELETE";
  HttpMethod2["PATCH"] = "PATCH";
  HttpMethod2["OPTIONS"] = "OPTIONS";
  HttpMethod2["HEAD"] = "HEAD";
  HttpMethod2["ALL"] = "ALL";
  HttpMethod2["CONNECT"] = "CONNECT";
  HttpMethod2["TRACE"] = "TRACE";
  return HttpMethod2;
})(HttpMethod || {});

// src/nject_express/util/id_util.ts
var ExpressIdType = class {
  static CONTROLLER = "express_controller";
  static HANDLER = "express_handler";
  static APPLICATION = "express_application";
  static ROUTE_MODEL = "express_route_model";
};
var ExpressIdBuilder = class _ExpressIdBuilder extends IDBuilder {
  static fromController(consructor) {
    return new _ExpressIdBuilder(ExpressIdType.CONTROLLER).addContent(
      consructor.name
    );
  }
  static fromHandler(methodName) {
    return new _ExpressIdBuilder(ExpressIdType.HANDLER).addContent(methodName);
  }
};

// src/nject_express/util/http_route_model.ts
var HTTPRouteModel = class _HTTPRouteModel {
  constructor(path, method) {
    this.path = path;
    this.method = method;
  }
  get Path() {
    return this.path;
  }
  get Method() {
    return this.method;
  }
  toString() {
    return new ExpressIdBuilder().setType(ExpressIdType.ROUTE_MODEL).addContent(this.Method).addContent(this.Path).build();
  }
  addPrefix(lhs) {
    this.path = `${lhs}${this.Path}`;
  }
  // Factory methods
  static fromString(id) {
    const data = IDUtil.getIdData(id);
    if (data[0] !== ExpressIdType.ROUTE_MODEL || data.length < 3) {
      throw HTTPRouteModelError.invalidString(id);
    }
    return new _HTTPRouteModel(data[2], data[1]);
  }
  static GET(path) {
    return new _HTTPRouteModel(path, "GET" /* GET */);
  }
  static POST(path) {
    return new _HTTPRouteModel(path, "POST" /* POST */);
  }
  static PUT(path) {
    return new _HTTPRouteModel(path, "PUT" /* PUT */);
  }
  static DELETE(path) {
    return new _HTTPRouteModel(path, "DELETE" /* DELETE */);
  }
  static PATCH(path) {
    return new _HTTPRouteModel(path, "PATCH" /* PATCH */);
  }
  static OPTIONS(path) {
    return new _HTTPRouteModel(path, "OPTIONS" /* OPTIONS */);
  }
  static HEAD(path) {
    return new _HTTPRouteModel(path, "HEAD" /* HEAD */);
  }
  static ALL(path) {
    return new _HTTPRouteModel(path, "ALL" /* ALL */);
  }
};

// src/nject_express/util/express_route_params_util.ts
var HTTPRouteHandlerParameter = /* @__PURE__ */ ((HTTPRouteHandlerParameter3) => {
  HTTPRouteHandlerParameter3["REQUEST"] = "REQUEST";
  HTTPRouteHandlerParameter3["RESPONSE"] = "RESPONSE";
  HTTPRouteHandlerParameter3["REQUEST_BODY"] = "REQUEST_BODY";
  HTTPRouteHandlerParameter3["REQUSET_QUERY"] = "REQUEST_QUERY";
  HTTPRouteHandlerParameter3["REQUEST_PARAMS"] = "REQUEST_PARAMS";
  HTTPRouteHandlerParameter3["REQUEST_HEADERS"] = "REQUEST_HEADERS";
  return HTTPRouteHandlerParameter3;
})(HTTPRouteHandlerParameter || {});
var HTTPRequestParamUtil = class {
  static getProperty(param, req, res) {
    switch (param) {
      case "REQUEST" /* REQUEST */:
        return req;
      case "RESPONSE" /* RESPONSE */:
        return res;
      case "REQUEST_BODY" /* REQUEST_BODY */:
        return req.body;
      case "REQUEST_PARAMS" /* REQUEST_PARAMS */:
        return req.params;
      case "REQUEST_HEADERS" /* REQUEST_HEADERS */:
        return req.headers;
      case "REQUEST_QUERY" /* REQUSET_QUERY */:
        return req.query;
    }
  }
};

// src/nject_ioc/error/ioc_error.ts
var IOCError = class {
  static duplicateComponentId(id) {
    return new Error(`Container with ID: ${id} already exists.`);
  }
  static componentIdNotFound(id) {
    return new Error(`Container with ID: ${id} not found.`);
  }
  static dependancyNotFound(id, depId) {
    return new Error(
      `Couldn't create object with ID: ${id} as object with dependancies with IDS: [ ${depId.join(
        ", "
      )}] does not exixt`
    );
  }
  static contextNotFound(id) {
    return new Error(`Context with ID: ${id} does not exists.`);
  }
  static duplicateContextId(id) {
    return new Error(`Context with ID: ${id} already exists.`);
  }
  static canOnlyInjectInConstructor(injectId) {
    return new Error(
      `Trying to inject Object with ID: ${injectId} outside constructor `
    );
  }
};

// src/nject_ioc/core/container_repository.ts
var IOCContainerRepository = class {
  containerConstructorMap;
  containerObjectMap;
  constructor() {
    this.containerObjectMap = /* @__PURE__ */ new Map();
    this.containerConstructorMap = /* @__PURE__ */ new Map();
  }
  addConstructor(id, constructor) {
    if (this.containerObjectMap.has(id)) {
      throw IOCError.duplicateComponentId(id);
    }
    this.containerConstructorMap.set(id, constructor);
  }
  findConstructorById(id) {
    const constructor = this.containerConstructorMap.get(id);
    if (!constructor) {
      throw IOCError.componentIdNotFound(id);
    }
    return constructor;
  }
  findObjectById(id) {
    const object = this.containerObjectMap.get(id);
    if (!object) {
      throw IOCError.componentIdNotFound(id);
    }
    return object;
  }
  findAllObjectIds() {
    return Array.from(this.containerObjectMap.keys());
  }
  findAllObjects() {
    return Array.from(this.containerObjectMap.values());
  }
  findAllConstructorIds() {
    return Array.from(this.containerConstructorMap.keys());
  }
  buildConstructorObject(id, dependancies) {
    if (this.containerObjectMap.has(id)) {
      return;
    }
    const dependacyObjects = dependancies.map(
      (dependancy) => this.containerObjectMap.get(dependancy)
    );
    const unbuiltDependancies = dependancies.filter(
      (dependancy) => !this.containerObjectMap.has(dependancy)
    );
    if (unbuiltDependancies.length > 0) {
      throw IOCError.dependancyNotFound(id, unbuiltDependancies);
    }
    const constructor = this.findConstructorById(id);
    const object = new constructor(...dependacyObjects);
    this.containerConstructorMap.delete(id);
    this.containerObjectMap.set(id, object);
  }
};

// src/nject_ioc/error/dependancy_error.ts
var DependancyError = class {
  static cyclicDependanct(cycle) {
    return new Error(
      `Found a dependancy cycle. Make sure to use setter injection in case of cyclic dependancy.
Cycle: ${cycle.join(
        " -> "
      )}`
    );
  }
};

// src/nject_ioc/core/dependancy_manager.ts
var DependancyManager = class {
  dependancies;
  nodes;
  constructor() {
    this.dependancies = /* @__PURE__ */ new Map();
    this.nodes = /* @__PURE__ */ new Set();
  }
  add(dependant, dependancy) {
    this.nodes.add(dependant);
    this.nodes.add(dependancy);
    if (!this.dependancies.has(dependant)) {
      this.dependancies.set(dependant, []);
    }
    this.dependancies.get(dependant).push(dependancy);
  }
  addNode(id) {
    this.nodes.add(id);
  }
  getDependancies(id) {
    return this.dependancies.get(id) ?? [];
  }
  getResolutionOrder() {
    const order = [];
    const currentPath = /* @__PURE__ */ new Set();
    const visited = /* @__PURE__ */ new Set();
    const currStack = [];
    const dfs = (node) => {
      if (currentPath.has(node)) {
        const cycle = [node];
        while (currStack[currStack.length - 1] != node)
          cycle.push(currStack.pop());
        currStack.push(node);
        throw DependancyError.cyclicDependanct(cycle);
      }
      if (visited.has(node)) {
        return;
      }
      visited.add(node);
      currentPath.add(node);
      currStack.push(node);
      for (const child of this.dependancies.get(node) ?? []) {
        dfs(child);
      }
      order.push(node);
      currentPath.delete(node);
      currStack.pop();
    };
    for (const node of this.nodes) {
      dfs(node);
    }
    return order;
  }
};

// src/nject_ioc/core/tag_manager.ts
var TagManager = class {
  tags;
  constructor() {
    this.tags = /* @__PURE__ */ new Map();
  }
  addTag(id, tag) {
    if (!this.tags.has(id)) {
      this.tags.set(id, /* @__PURE__ */ new Set());
    }
    this.tags.get(id).add(tag);
  }
  getIdTags(id) {
    return this.tags.get(id) ?? [];
  }
  getIdsWithTag(tag) {
    return [...this.tags.entries()].filter(([_, tags]) => tags.has(tag)).map(([id, _]) => id);
  }
};

// src/nject_ioc/core/context.ts
var IOCContext = class {
  containerRepository;
  dependancyManager;
  tagManager;
  constructor() {
    this.containerRepository = new IOCContainerRepository();
    this.dependancyManager = new DependancyManager();
    this.tagManager = new TagManager();
  }
  addConstructor(id, constructor) {
    this.containerRepository.addConstructor(id, constructor);
    this.dependancyManager.addNode(id);
  }
  addDependancy(dependant, dependancy) {
    this.dependancyManager.add(dependant, dependancy);
  }
  addTag(id, tag) {
    this.tagManager.addTag(id, tag);
  }
  getIdTags(id) {
    return Array.from(this.tagManager.getIdTags(id));
  }
  getIdsWithTag(tag) {
    return this.tagManager.getIdsWithTag(tag);
  }
  getObjectByID(id) {
    return this.containerRepository.findObjectById(id);
  }
  getObjectIds() {
    return this.containerRepository.findAllObjectIds();
  }
  getAllObjects() {
    return this.containerRepository.findAllObjects();
  }
  getConstructorIDs() {
    return this.containerRepository.findAllConstructorIds();
  }
  build() {
    const order = this.dependancyManager.getResolutionOrder();
    for (const id of order) {
      const dependancies = this.dependancyManager.getDependancies(id);
      this.containerRepository.buildConstructorObject(id, dependancies);
    }
    console.log("---- Managed Components ----");
    const ids = this.containerRepository.findAllObjectIds();
    ids.forEach((id) => {
      const objConstructor = this.containerRepository.findObjectById(id).constructor.name;
      console.log(`${id} : ${objConstructor}`);
    });
    console.log("----------------------------\n");
  }
};

// src/nject_ioc/core/context_registry.ts
var IOCContextRegistry = class {
  contextMap;
  constructor() {
    this.contextMap = /* @__PURE__ */ new Map();
  }
  getDefaultContext() {
    return this.getContextById("default");
  }
  getContextById(id) {
    const context = this.contextMap.get(id);
    if (!context) {
      throw IOCError.contextNotFound(id);
    }
    return context;
  }
  registerContext(id, context) {
    if (this.contextMap.has(id)) {
      throw IOCError.duplicateContextId(id);
    }
    context = context ?? new IOCContext();
    this.contextMap.set(id, context);
    return context;
  }
  getRegisteredContextIds() {
    return this.contextMap.keys();
  }
  replaceContext(id, context) {
    if (!this.contextMap.has(id)) {
      throw IOCError.contextNotFound(id);
    }
    this.contextMap.set(id, context);
  }
  isRegistered(id) {
    return this.contextMap.has(id);
  }
};
var contextRegistry = new IOCContextRegistry();

// src/nject_express/core/server_entities/server_response_status.ts
var HttpStatusCode = /* @__PURE__ */ ((HttpStatusCode2) => {
  HttpStatusCode2[HttpStatusCode2["CONTINUE"] = 100] = "CONTINUE";
  HttpStatusCode2[HttpStatusCode2["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
  HttpStatusCode2[HttpStatusCode2["PROCESSING"] = 102] = "PROCESSING";
  HttpStatusCode2[HttpStatusCode2["OK"] = 200] = "OK";
  HttpStatusCode2[HttpStatusCode2["CREATED"] = 201] = "CREATED";
  HttpStatusCode2[HttpStatusCode2["ACCEPTED"] = 202] = "ACCEPTED";
  HttpStatusCode2[HttpStatusCode2["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
  HttpStatusCode2[HttpStatusCode2["NO_CONTENT"] = 204] = "NO_CONTENT";
  HttpStatusCode2[HttpStatusCode2["RESET_CONTENT"] = 205] = "RESET_CONTENT";
  HttpStatusCode2[HttpStatusCode2["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
  HttpStatusCode2[HttpStatusCode2["MULTI_STATUS"] = 207] = "MULTI_STATUS";
  HttpStatusCode2[HttpStatusCode2["ALREADY_REPORTED"] = 208] = "ALREADY_REPORTED";
  HttpStatusCode2[HttpStatusCode2["IM_USED"] = 226] = "IM_USED";
  HttpStatusCode2[HttpStatusCode2["MULTIPLE_CHOICES"] = 300] = "MULTIPLE_CHOICES";
  HttpStatusCode2[HttpStatusCode2["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
  HttpStatusCode2[HttpStatusCode2["FOUND"] = 302] = "FOUND";
  HttpStatusCode2[HttpStatusCode2["SEE_OTHER"] = 303] = "SEE_OTHER";
  HttpStatusCode2[HttpStatusCode2["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
  HttpStatusCode2[HttpStatusCode2["USE_PROXY"] = 305] = "USE_PROXY";
  HttpStatusCode2[HttpStatusCode2["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
  HttpStatusCode2[HttpStatusCode2["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
  HttpStatusCode2[HttpStatusCode2["BAD_REQUEST"] = 400] = "BAD_REQUEST";
  HttpStatusCode2[HttpStatusCode2["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
  HttpStatusCode2[HttpStatusCode2["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
  HttpStatusCode2[HttpStatusCode2["FORBIDDEN"] = 403] = "FORBIDDEN";
  HttpStatusCode2[HttpStatusCode2["NOT_FOUND"] = 404] = "NOT_FOUND";
  HttpStatusCode2[HttpStatusCode2["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
  HttpStatusCode2[HttpStatusCode2["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
  HttpStatusCode2[HttpStatusCode2["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
  HttpStatusCode2[HttpStatusCode2["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
  HttpStatusCode2[HttpStatusCode2["CONFLICT"] = 409] = "CONFLICT";
  HttpStatusCode2[HttpStatusCode2["GONE"] = 410] = "GONE";
  HttpStatusCode2[HttpStatusCode2["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
  HttpStatusCode2[HttpStatusCode2["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
  HttpStatusCode2[HttpStatusCode2["PAYLOAD_TOO_LARGE"] = 413] = "PAYLOAD_TOO_LARGE";
  HttpStatusCode2[HttpStatusCode2["URI_TOO_LONG"] = 414] = "URI_TOO_LONG";
  HttpStatusCode2[HttpStatusCode2["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
  HttpStatusCode2[HttpStatusCode2["RANGE_NOT_SATISFIABLE"] = 416] = "RANGE_NOT_SATISFIABLE";
  HttpStatusCode2[HttpStatusCode2["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
  HttpStatusCode2[HttpStatusCode2["IM_A_TEAPOT"] = 418] = "IM_A_TEAPOT";
  HttpStatusCode2[HttpStatusCode2["MISDIRECTED_REQUEST"] = 421] = "MISDIRECTED_REQUEST";
  HttpStatusCode2[HttpStatusCode2["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
  HttpStatusCode2[HttpStatusCode2["LOCKED"] = 423] = "LOCKED";
  HttpStatusCode2[HttpStatusCode2["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
  HttpStatusCode2[HttpStatusCode2["TOO_EARLY"] = 425] = "TOO_EARLY";
  HttpStatusCode2[HttpStatusCode2["UPGRADE_REQUIRED"] = 426] = "UPGRADE_REQUIRED";
  HttpStatusCode2[HttpStatusCode2["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
  HttpStatusCode2[HttpStatusCode2["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
  HttpStatusCode2[HttpStatusCode2["REQUEST_HEADER_FIELDS_TOO_LARGE"] = 431] = "REQUEST_HEADER_FIELDS_TOO_LARGE";
  HttpStatusCode2[HttpStatusCode2["UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "UNAVAILABLE_FOR_LEGAL_REASONS";
  HttpStatusCode2[HttpStatusCode2["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
  HttpStatusCode2[HttpStatusCode2["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
  HttpStatusCode2[HttpStatusCode2["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
  HttpStatusCode2[HttpStatusCode2["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
  HttpStatusCode2[HttpStatusCode2["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
  HttpStatusCode2[HttpStatusCode2["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
  HttpStatusCode2[HttpStatusCode2["VARIANT_ALSO_NEGOTIATES"] = 506] = "VARIANT_ALSO_NEGOTIATES";
  HttpStatusCode2[HttpStatusCode2["INSUFFICIENT_STORAGE"] = 507] = "INSUFFICIENT_STORAGE";
  HttpStatusCode2[HttpStatusCode2["LOOP_DETECTED"] = 508] = "LOOP_DETECTED";
  HttpStatusCode2[HttpStatusCode2["NOT_EXTENDED"] = 510] = "NOT_EXTENDED";
  HttpStatusCode2[HttpStatusCode2["NETWORK_AUTHENTICATION_REQUIRED"] = 511] = "NETWORK_AUTHENTICATION_REQUIRED";
  return HttpStatusCode2;
})(HttpStatusCode || {});

// src/nject_express/core/server_entities/server_response_entity.ts
var ResponseCategory = class {
  static INFO = "1";
  static SUCCESS = "2";
  static REDIRECT = "3";
  static CLIENT_ERROR = "4";
  static SERVER_ERROR = "5";
  static fromStatus(status) {
    return status.toString()[0];
  }
};
var ResponseEntity = class _ResponseEntity {
  constructor(status, body = {}, headers = /* @__PURE__ */ new Map()) {
    this.status = status;
    this.body = body;
    this.headers = headers;
  }
  get Status() {
    return this.status;
  }
  get Category() {
    return ResponseCategory.fromStatus(this.status);
  }
  get isError() {
    return [
      ResponseCategory.CLIENT_ERROR,
      ResponseCategory.SERVER_ERROR
    ].includes(this.Category);
  }
  get Body() {
    return this.body;
  }
  get Headers() {
    return this.headers;
  }
  static ok(body = {}) {
    return new _ResponseEntity(200 /* OK */, body);
  }
  static created(body = {}) {
    return new _ResponseEntity(201 /* CREATED */, body);
  }
  static noContent() {
    return new _ResponseEntity(204 /* NO_CONTENT */);
  }
  static badRequest(body = {}) {
    return new _ResponseEntity(400 /* BAD_REQUEST */, body);
  }
  static unauthorized(body = {}) {
    return new _ResponseEntity(401 /* UNAUTHORIZED */, body);
  }
  static forbidden(body = {}) {
    return new _ResponseEntity(403 /* FORBIDDEN */, body);
  }
  static notFound(body = {}) {
    return new _ResponseEntity(404 /* NOT_FOUND */, body);
  }
  static internalServerError(body = {}) {
    return new _ResponseEntity(500 /* INTERNAL_SERVER_ERROR */, body);
  }
  // TODO: Add more response
};

// src/nject_express/core/server_entities/server_next_entity.ts
var NextEntity = class _NextEntity {
  constructor(requestBodyUpdates = /* @__PURE__ */ new Map(), requestHeaderUpdates = /* @__PURE__ */ new Map()) {
    this.requestBodyUpdates = requestBodyUpdates;
    this.requestHeaderUpdates = requestHeaderUpdates;
  }
  updateRequest(req) {
    this.requestBodyUpdates.forEach((value, key) => {
      req.body[key] = value;
    });
    this.requestHeaderUpdates.forEach((value, key) => {
      req.headers[key] = value;
    });
  }
  static noUpdate() {
    return new _NextEntity();
  }
  static fromObject(body = {}, headers = {}) {
    return new _NextEntity(
      this.objectToMap(body),
      this.objectToMap(headers)
    );
  }
  static objectToMap(obj) {
    const map = /* @__PURE__ */ new Map();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        map.set(key, obj[key]);
      }
    }
    return map;
  }
};

// src/nject_express/error/express_context_error.ts
var ExpressContextError = class {
  static noApplicationContainer() {
    return new Error(
      "Application container is not assigned to express server context"
    );
  }
  static noHttpServer() {
    return new Error(
      "Http server is not built yet"
    );
  }
};

// src/nject_express/core/express_application_manager.ts
var ExpressApplicationManager = class {
  constructor(routeHanlderManager) {
    this.routeHanlderManager = routeHanlderManager;
    this.app = express();
    this.serverOptions = {
      port: 8080,
      cors: {
        origin: "*"
      }
    };
  }
  app;
  server;
  serverOptions;
  set ServerOptions(options) {
    this.serverOptions.port = options.port ?? this.serverOptions.port;
    this.serverOptions.cors = options.cors ?? this.serverOptions.cors;
  }
  get HttpServer() {
    return this.server;
  }
  createServer(preconfig) {
    this.app.use(express.json());
    this.app.use(cors(this.serverOptions.cors));
    preconfig && preconfig(this.app);
    this.server = http.createServer(this.app);
    const routes = this.routeHanlderManager.getAllRoutesWithHandlers();
    routes.forEach(([route, handlersWithParams]) => {
      const routeModel = HTTPRouteModel.fromString(route);
      const method = routeModel.Method;
      const path = routeModel.Path;
      const requestHandlers = handlersWithParams.map(
        ([handlerId, params]) => this.createExpessHandler(handlerId, params)
      );
      this.attachRouteHandler(method, path, requestHandlers);
    });
  }
  startServer() {
    if (!this.server) {
      throw ExpressContextError.noHttpServer();
    }
    this.server.listen(this.serverOptions.port, () => {
      console.log(`Server is running at port ${this.serverOptions.port}`);
    });
  }
  createExpessHandler(handlerId, params) {
    const parentId = this.routeHanlderManager.getParentById(handlerId);
    const handlerName = IDUtil.getIdData(handlerId)[1];
    const context = contextRegistry.getContextById(EXPRESS_CONTEXT_NAME);
    const controllerObject = context.getObjectByID(parentId);
    const requestHandler = async (req, res, next) => {
      const functionParams = params.map(
        (routeHandlerParam) => HTTPRequestParamUtil.getProperty(routeHandlerParam, req, res)
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
          return res.status(500 /* INTERNAL_SERVER_ERROR */).json("Controller gives invalid response");
        }
      } catch (e) {
        return res.status(500 /* INTERNAL_SERVER_ERROR */).json({ message: "Uncaught exception in controllers" });
      }
    };
    return requestHandler;
  }
  attachRouteHandler(method, path, handlers) {
    switch (method) {
      case "ALL" /* ALL */:
        return this.app.all(path, handlers);
      case "GET" /* GET */:
        return this.app.get(path, handlers);
      case "POST" /* POST */:
        return this.app.post(path, handlers);
      case "PUT" /* PUT */:
        return this.app.put(path, handlers);
      case "DELETE" /* DELETE */:
        return this.app.delete(path, handlers);
      case "PATCH" /* PATCH */:
        return this.app.patch(path, handlers);
      case "OPTIONS" /* OPTIONS */:
        return this.app.options(path, handlers);
      case "HEAD" /* HEAD */:
        return this.app.head(path, handlers);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
};

// src/nject_express/core/route_handler_manager.ts
var RouteHandlerManager = class {
  handlerToPath;
  handlerToParent;
  handlerToParams;
  constructor() {
    this.handlerToPath = /* @__PURE__ */ new Map();
    this.handlerToParent = /* @__PURE__ */ new Map();
    this.handlerToParams = /* @__PURE__ */ new Map();
  }
  addHandler(id, parentId, model) {
    if (!this.handlerToPath.has(id)) {
      this.handlerToPath.set(id, []);
    }
    this.handlerToPath.get(id).push(model);
    this.handlerToParent.set(id, parentId);
  }
  addParams(id, params) {
    this.handlerToParams.set(id, params);
  }
  getHandlerParams(id) {
    return this.handlerToParams.get(id) ?? [];
  }
  getModelById(id) {
    const model = this.handlerToPath.get(id);
    if (!model) {
      throw ControllerError.handlerIdDuplicate(id);
    }
    return model;
  }
  getParentById(id) {
    const parent = this.handlerToParent.get(id);
    if (!parent) {
      throw ControllerError.handlerIdDuplicate(id);
    }
    return parent;
  }
  getAllHandlersWithRoute() {
    return Array.from(this.handlerToPath.entries());
  }
};

// src/nject_express/core/express_route_handler_manager.ts
var ExpressRouteHandlerManager = class extends RouteHandlerManager {
  getAllRoutesWithHandlers() {
    const intermediateRoutes = /* @__PURE__ */ new Map();
    const handlers = this.getAllHandlersWithRoute();
    for (const [id, routeHandlerModels] of handlers) {
      for (const routeHandlerModel of routeHandlerModels) {
        const routeModel = routeHandlerModel.Route;
        const routeModelString = routeModel.toString();
        const order = routeHandlerModel.Order;
        if (!intermediateRoutes.has(routeModelString)) {
          intermediateRoutes.set(routeModelString, []);
        }
        intermediateRoutes.get(routeModelString).push([order, id]);
      }
    }
    for (const key of intermediateRoutes.keys()) {
      intermediateRoutes.get(key)?.sort((a, b) => a[0] - b[0]);
    }
    const routes = Array.from(intermediateRoutes.entries()).map(
      ([id, value]) => [
        id,
        value.map(([_, handlerId]) => [
          handlerId,
          this.getHandlerParams(handlerId)
        ])
      ]
    );
    return routes;
  }
};

// src/nject_express/core/express_application_context.ts
var DEFAULT = "default";
var EXPRESS_CONTEXT_NAME = "express_context";
var REST_TAG = "rest";
var ExpressApplicationContext = class extends IOCContextDecorator {
  routeControllerManager;
  routeHandlerManager;
  applicationManager;
  applicationContainer;
  constructor(context) {
    super(context);
    this.routeControllerManager = new RouteControllerManager();
    this.routeHandlerManager = new ExpressRouteHandlerManager();
    this.applicationManager = new ExpressApplicationManager(
      this.routeHandlerManager
    );
  }
  set ApplicationContainer(applicationContainer) {
    this.applicationContainer = applicationContainer;
  }
  addController(controllerId, path, handlers) {
    this.routeControllerManager.addController(
      controllerId,
      path,
      handlers.map(([id, _]) => id)
    );
    handlers.forEach(([id, model, params]) => {
      this.routeHandlerManager.addHandler(id, controllerId, model);
      this.routeHandlerManager.addParams(id, params);
    });
  }
  displayControllersString() {
    return this.routeControllerManager.getAllControllersWithRoutes().map(([id, path]) => `${id}:${path}`).join("\n");
  }
  displayHandlersString() {
    return this.routeHandlerManager.getAllRoutesWithHandlers().map(([route, handlers]) => `${route}:${handlers.join(", ")}`).join("\n");
  }
  build() {
    super.build();
    if (!this.applicationContainer) {
      throw ExpressContextError.noApplicationContainer();
    }
    const getServerOptions = this.applicationContainer.getExpressServerOptions ?? function() {
      return {};
    };
    this.applicationManager.ServerOptions = getServerOptions();
    this.applicationManager.createServer(
      this.applicationContainer.preconfigExpress
    );
  }
  startServer() {
    console.log("SERVER STARTING");
    this.applicationManager.startServer();
    console.log("---- Bound Routes ----");
    const routes = this.routeHandlerManager.getAllRoutesWithHandlers().map(([route, handlers]) => [
      route,
      handlers.map(([handlerId, _]) => handlerId)
    ]);
    routes.forEach((route) => console.log(`${route[0]} - ${route[1].join(", ")}`));
    console.log("----------------------\n");
    console.log("SERVER STARTED");
  }
  get HttpServer() {
    const server = this.applicationManager.HttpServer;
    if (!server) {
      throw ExpressContextError.noHttpServer();
    }
    return server;
  }
};

// src/nject_ioc/decorators/component_decorator.ts
function Component(contextId = "default", tags = [], type = IdType.COMPONENT) {
  return function(constructor) {
    const dependancies = constructor.dependancies ?? [];
    const context = contextRegistry.getContextById(contextId);
    const constructorId = IDBuilder.fromType(type).addContent(constructor.name).build();
    context.addConstructor(constructorId, constructor);
    tags.forEach((tag) => context.addTag(constructorId, tag));
    dependancies.sort((a, b) => a[0] - b[0]).forEach(([_, dependancy]) => {
      context.addDependancy(constructorId, dependancy);
    });
  };
}

// src/nject_express/decorators/express_application_decorator.ts
function ExpressApplication(constructor) {
  Component(
    EXPRESS_CONTEXT_NAME,
    [REST_TAG],
    ExpressIdType.APPLICATION
  )(constructor);
  const expressContext = contextRegistry.getContextById(
    EXPRESS_CONTEXT_NAME
  );
  expressContext.ApplicationContainer = new constructor();
  expressContext.build();
}

// src/nject_express/decorators/express_parameter_decorator.ts
function ExpressRequestParam(paramType) {
  return function(targetPrototype, propertyKey, parameterIndex) {
    const target = targetPrototype.constructor;
    const handlerId = ExpressIdBuilder.fromHandler(
      propertyKey.toString()
    ).build();
    if (!target.params) {
      target.params = /* @__PURE__ */ new Map();
    }
    const params = target.params;
    if (!params.get(handlerId)) {
      params.set(handlerId, []);
    }
    params.get(handlerId).push([parameterIndex, paramType]);
  };
}
var RequestObject = ExpressRequestParam("REQUEST" /* REQUEST */);
var RequestBody = ExpressRequestParam("REQUEST_BODY" /* REQUEST_BODY */);
var RequestQuery = ExpressRequestParam("REQUEST_QUERY" /* REQUSET_QUERY */);
var PathVariables = ExpressRequestParam("REQUEST_PARAMS" /* REQUEST_PARAMS */);
var RequestHeaders = ExpressRequestParam(
  "REQUEST_HEADERS" /* REQUEST_HEADERS */
);
var ResponseObject = ExpressRequestParam("RESPONSE" /* RESPONSE */);

// src/nject_express/decorators/rest_controller_decorator.ts
function RestController(path = "") {
  return function(constructor) {
    Component(
      EXPRESS_CONTEXT_NAME,
      [REST_TAG],
      ExpressIdType.CONTROLLER
    )(constructor);
    const constructorId = ExpressIdBuilder.fromController(constructor).build();
    const handlers = constructor.handlers ?? [];
    const params = constructor.params ?? /* @__PURE__ */ new Map();
    const context = contextRegistry.getContextById(
      EXPRESS_CONTEXT_NAME
    );
    const intermediateHandlers = handlers.map(([id, detatched, model]) => {
      if (!detatched) model.Route.addPrefix(path);
      return [id, model];
    });
    const handlersWithParams = intermediateHandlers.map(([id, model]) => {
      const handlerParams = params.get(id) ?? [];
      handlerParams.sort((a, b) => a[0] - b[0]);
      return [id, model, handlerParams.map(([_, parameter]) => parameter)];
    });
    context.addController(constructorId, path, handlersWithParams);
  };
}

// src/nject_express/util/http_route_handler_model.ts
var HTTPRouteHandlerModel = class {
  constructor(order, route) {
    this.order = order;
    this.route = route;
  }
  get Order() {
    return this.order;
  }
  get Route() {
    return this.route;
  }
  set Route(route) {
    this.route = route;
  }
};

// src/nject_express/decorators/rest_handler_decorator.ts
function RestHandler(method, path = "", order = Number.MAX_SAFE_INTEGER, detatched = false) {
  return function(targetPrototype, propertyKey, descriptor) {
    const target = targetPrototype.constructor;
    if (!target.handlers) {
      target.handlers = [];
    }
    const handlerId = ExpressIdBuilder.fromHandler(
      propertyKey.toString()
    ).build();
    const routeHandlerModel = new HTTPRouteHandlerModel(
      order,
      new HTTPRouteModel(path, method)
    );
    target.handlers.push([handlerId, detatched, routeHandlerModel]);
  };
}
var GET = RestHandler.bind(void 0, "GET" /* GET */);
var POST = RestHandler.bind(void 0, "POST" /* POST */);
var DELETE = RestHandler.bind(void 0, "DELETE" /* DELETE */);
var PATCH = RestHandler.bind(void 0, "PATCH" /* PATCH */);
var PUT = RestHandler.bind(void 0, "PUT" /* PUT */);
var Middleware = class {
  static DEFAULT = (method, path) => RestHandler(method, path, 0, true);
  static GET = (path) => this.DEFAULT("GET" /* GET */, path);
  static POST = (path) => this.DEFAULT("POST" /* POST */, path);
  static DELETE = (path) => this.DEFAULT("DELETE" /* DELETE */, path);
  static PATCH = (path) => this.DEFAULT("PATCH" /* PATCH */, path);
  static PUT = (path) => this.DEFAULT("PUT" /* PUT */, path);
};

// src/nject_express/decorators/service_decorator.ts
function Service(constructor) {
  Component(EXPRESS_CONTEXT_NAME, [REST_TAG])(constructor);
}

// src/nject_ioc/decorators/inject_decorator.ts
function Inject(parameterConstructor) {
  return function(target, propertyKey, parameterIndex) {
    const parameterId = IDBuilder.fromComponent(parameterConstructor).build();
    if (propertyKey !== void 0) {
      throw IOCError.canOnlyInjectInConstructor(
        parameterId
      );
    }
    if (!target.dependancies) {
      target.dependancies = [];
    }
    target.dependancies.push([parameterIndex, parameterId]);
  };
}

// src/nject_socketio/core/socket_io_application_manager.ts
import {
  Server as SocketIOServer
} from "socket.io";

// src/nject_socketio/utils/socketio_route_parameter_util.ts
var SocketIORequestParamUtil = class {
  static getProperty(param, io, socket, data, cb) {
    const params = /* @__PURE__ */ new Map([
      ["SOCKET" /* SOCKET */, socket],
      ["SOCKET_SERVER" /* SOCKET_SERVER */, io],
      ["DATA" /* DATA */, data],
      ["CALLBACK" /* CALLBACK */, cb]
    ]);
    return params.get(param);
  }
};

// src/nject_socketio/error/socket_io_context_error.ts
var SocketIOContextError = class {
  static noApplicationContainer() {
    return new Error(
      "Application container is not assigned to express server context"
    );
  }
  static noHttpServer() {
    return new Error(
      "Http server is not built yet"
    );
  }
};

// src/nject_socketio/core/socket_io_application_manager.ts
var SocketIOApplicationManager = class {
  constructor(routeHandlerManager) {
    this.routeHandlerManager = routeHandlerManager;
    this.serverOptions = {
      cors: {
        origin: "*"
      }
    };
  }
  io;
  serverOptions;
  httpServer;
  set ServerOptions(options) {
    this.serverOptions = options;
  }
  set HttpServer(server) {
    this.httpServer = server;
  }
  createServer(preconfig) {
    if (!this.httpServer) {
      throw SocketIOContextError.noHttpServer();
    }
    this.io = new SocketIOServer(this.httpServer, this.serverOptions);
    preconfig && preconfig(this.io);
    const routes = this.routeHandlerManager.getAllNamespacesWithEvents();
    routes.forEach(([namespace, events]) => {
      const serverNamespace = this.io.of(namespace);
      serverNamespace.on("connection", (socket) => {
        events.forEach(([eventName, handlerId, params]) => {
          const eventHandler = this.createSocketHandler(
            socket,
            handlerId,
            params
          );
          socket.on(eventName, eventHandler);
        });
      });
    });
  }
  createSocketHandler(socket, handlerId, params) {
    const parentId = this.routeHandlerManager.getParentById(handlerId);
    const handlerName = IDUtil.getIdData(handlerId)[1];
    const context = contextRegistry.getContextById(SOCKETIO_CONTEXT_NAME);
    const controllerObject = context.getObjectByID(parentId);
    const messageHandler = async (data, callback) => {
      const functionParams = params.map(
        (routeHandlerParam) => SocketIORequestParamUtil.getProperty(
          routeHandlerParam,
          this.io,
          socket,
          data,
          callback
        )
      );
      const fn = controllerObject[handlerName].bind(controllerObject);
      try {
        await fn(...functionParams);
      } catch {
        console.log("Socket Error");
      }
    };
    return messageHandler;
  }
};

// src/nject_socketio/core/socket_route_handler_manager.ts
var SocketIORouteHandlerManager = class extends RouteHandlerManager {
  getAllNamespacesWithEvents() {
    const handlers = this.getAllHandlersWithRoute();
    const routes = /* @__PURE__ */ new Map();
    for (const [id, routeHandlerModels] of handlers) {
      for (const routeHandlerModel of routeHandlerModels) {
        const namespace = routeHandlerModel.Namespace;
        const event = routeHandlerModel.Event;
        const params = this.getHandlerParams(id);
        if (!routes.has(namespace)) {
          routes.set(namespace, []);
        }
        routes.get(namespace).push([event, id, params]);
      }
    }
    return Array.from(routes.entries());
  }
};

// src/nject_socketio/core/socket_io_application_context.ts
var SOCKETIO_CONTEXT_NAME = "socketio_context";
var SOCKET_TAG = "socket";
var SocketIOApplicationContext = class extends IOCContextDecorator {
  constructor(context, serverContext) {
    super(context);
    this.serverContext = serverContext;
    this.routeControllerManager = new RouteControllerManager();
    this.routeHandlerManager = new SocketIORouteHandlerManager();
    this.applicationManager = new SocketIOApplicationManager(
      this.routeHandlerManager
    );
  }
  routeControllerManager;
  routeHandlerManager;
  applicationManager;
  applicationContainer;
  set ApplicationContainer(applicationContainer) {
    this.applicationContainer = applicationContainer;
  }
  addController(controllerId, namespace, handlers) {
    this.routeControllerManager.addController(
      controllerId,
      namespace,
      handlers.map(([id, _]) => id)
    );
    handlers.forEach(([id, model, params]) => {
      this.routeHandlerManager.addHandler(id, controllerId, model);
      this.routeHandlerManager.addParams(id, params);
    });
  }
  build() {
    super.build();
    if (!this.applicationContainer) {
      throw SocketIOContextError.noApplicationContainer();
    }
    const getServerOptions = this.applicationContainer.getSocketServerOptions;
    if (getServerOptions)
      this.applicationManager.ServerOptions = getServerOptions();
    this.applicationManager.HttpServer = this.serverContext.HttpServer;
    this.applicationManager.createServer(
      this.applicationContainer.preconfigSocket
    );
  }
};

// src/nject_socketio/utils/id_utils.ts
var SocketIOIdType = class {
  static CONTROLLER = "socketio_controller";
  static HANDLER = "socketio_handler";
  static APPLICATION = "socketio_application";
  static ROUTE_MODEL = "socketio_route_model";
};
var SocketIOIdBuilder = class _SocketIOIdBuilder extends IDBuilder {
  static fromController(constructor) {
    return new _SocketIOIdBuilder(SocketIOIdType.CONTROLLER).addContent(
      constructor.name
    );
  }
  static fromHandler(methodName) {
    return new _SocketIOIdBuilder(SocketIOIdType.HANDLER).addContent(
      methodName
    );
  }
  static fromRouteModel() {
    return new _SocketIOIdBuilder(SocketIOIdType.ROUTE_MODEL);
  }
};

// src/nject_socketio/decorators/socket_application_decorator.ts
function SocketIOApplication(constructor) {
  Component(
    SOCKETIO_CONTEXT_NAME,
    [SOCKET_TAG],
    SocketIOIdType.APPLICATION
  )(constructor);
  const socketContext = contextRegistry.getContextById(
    SOCKETIO_CONTEXT_NAME
  );
  socketContext.ApplicationContainer = new constructor();
  socketContext.build();
}

// src/nject_socketio/error/socket_io_route_model_error.ts
var SocketIORouteModelError = class {
  static invalidString(id) {
    return new Error(
      `String "${id}" is an invalid representation of a SocketIORouteModel`
    );
  }
};

// src/nject_socketio/utils/socketio_route_handler_model.ts
var SocketIORouteHandlerModel = class _SocketIORouteHandlerModel {
  constructor(namespace, event) {
    this.namespace = namespace;
    this.event = event;
  }
  get Namespace() {
    return this.namespace;
  }
  get Event() {
    return this.event;
  }
  toString() {
    return SocketIOIdBuilder.fromRouteModel().addContent(this.Namespace).addContent(this.Event).build();
  }
  static fromString(id) {
    const data = IDUtil.getIdData(id);
    if (data[0] !== SocketIOIdType.ROUTE_MODEL || data.length < 3) {
      throw SocketIORouteModelError.invalidString(id);
    }
    return new _SocketIORouteHandlerModel(data[1], data[2]);
  }
};

// src/nject_socketio/decorators/socket_controller_decorator.ts
function SocketController(namespace) {
  return function(constructor) {
    Component(
      SOCKETIO_CONTEXT_NAME,
      [SOCKET_TAG],
      SocketIOIdType.CONTROLLER
    )(constructor);
    const constructorId = SocketIOIdBuilder.fromController(constructor).build();
    const handlers = constructor.handlers ?? [];
    const params = constructor.params ?? /* @__PURE__ */ new Map();
    const context = contextRegistry.getContextById(
      SOCKETIO_CONTEXT_NAME
    );
    const handlersWithParams = handlers.map(([id, event]) => {
      const model = new SocketIORouteHandlerModel(namespace, event);
      const handlerParams = params.get(id) ?? [];
      handlerParams.sort((a, b) => a[0] - b[0]);
      return [id, model, handlerParams.map(([_, param]) => param)];
    });
    context.addController(constructorId, namespace, handlersWithParams);
  };
}

// src/nject_socketio/decorators/socket_handler_decorator.ts
function SocketEvent(event) {
  return function(targetPrototype, propertyKey, descriptor) {
    const target = targetPrototype.constructor;
    if (!target.handlers) {
      target.handlers = [];
    }
    const handlerId = SocketIOIdBuilder.fromHandler(
      propertyKey.toString()
    ).build();
    target.handlers.push([handlerId, event]);
  };
}

// src/nject_socketio/decorators/socket_parameter_decorator.ts
function SocketRequestParam(paramType) {
  return function(targetPrototype, propertyKey, parameterIndex) {
    const target = targetPrototype.constructor;
    const handlerId = SocketIOIdBuilder.fromHandler(
      propertyKey.toString()
    ).build();
    if (!target.params) {
      target.params = /* @__PURE__ */ new Map();
    }
    const params = target.params;
    if (!params.get(handlerId)) {
      params.set(handlerId, []);
    }
    params.get(handlerId).push([parameterIndex, paramType]);
  };
}
var IOSocket = SocketRequestParam("SOCKET" /* SOCKET */);
var IOServer = SocketRequestParam(
  "SOCKET_SERVER" /* SOCKET_SERVER */
);
var IOData = SocketRequestParam("DATA" /* DATA */);
var IOCallBack = SocketRequestParam("CALLBACK" /* CALLBACK */);
export {
  Component,
  DEFAULT,
  DELETE,
  DependancyManager,
  EXPRESS_CONTEXT_NAME,
  ExpressApplication,
  ExpressApplicationContext,
  ExpressApplicationManager,
  ExpressIdBuilder,
  ExpressIdType,
  ExpressRequestParam,
  ExpressRouteHandlerManager,
  GET,
  HTTPRequestParamUtil,
  HTTPRouteHandlerModel,
  HTTPRouteHandlerParameter,
  HTTPRouteModel,
  HttpMethod,
  HttpStatusCode,
  IDBuilder,
  IDUtil,
  IOCContainerRepository,
  IOCContext,
  IOCContextDecorator,
  IOCallBack,
  IOData,
  IOServer,
  IOSocket,
  IdType,
  Inject,
  Middleware,
  NextEntity,
  PATCH,
  POST,
  PUT,
  PathVariables,
  REST_TAG,
  RequestBody,
  RequestHeaders,
  RequestObject,
  RequestQuery,
  ResponseCategory,
  ResponseEntity,
  ResponseObject,
  RestController,
  RestHandler,
  RouteControllerManager,
  RouteHandlerManager,
  SOCKETIO_CONTEXT_NAME,
  SOCKET_TAG,
  Service,
  SocketController,
  SocketEvent,
  SocketIOApplication,
  SocketIOApplicationContext,
  SocketIOApplicationManager,
  SocketIORouteHandlerManager,
  SocketRequestParam,
  TagManager,
  contextRegistry
};
