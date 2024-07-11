import express, { Request, Response } from 'express';
import http, { Server } from 'http';
import cors from 'cors';
import { ServerOptions, Server as Server$1 } from 'socket.io';

type Constructor<T = unknown> = {
    new (...args: any[]): T;
};

interface IOCContextInterface {
    addConstructor(id: string, constructor: Constructor<any>): void;
    addDependancy(dependant: string, dependancy: string): void;
    addTag(id: string, tag: string): void;
    getIdTags(id: string): string[];
    getIdsWithTag(tag: string): string[];
    getObjectByID(id: string): any;
    getObjectIds(): string[];
    getAllObjects(): [string, any][];
    getConstructorIDs(): string[];
    build(): void;
}
declare class IOCContext implements IOCContextInterface {
    private containerRepository;
    private dependancyManager;
    private tagManager;
    constructor();
    addConstructor(id: string, constructor: Constructor<any>): void;
    addDependancy(dependant: string, dependancy: string): void;
    addTag(id: string, tag: string): void;
    getIdTags(id: string): string[];
    getIdsWithTag(tag: string): string[];
    getObjectByID(id: string): any;
    getObjectIds(): string[];
    getAllObjects(): [string, any][];
    getConstructorIDs(): string[];
    build(): void;
}

declare class IOCContextDecorator implements IOCContextInterface {
    private context;
    constructor(context: IOCContextInterface);
    addConstructor(id: string, constructor: Constructor<any>): void;
    addDependancy(dependant: string, dependancy: string): void;
    addTag(id: string, tag: string): void;
    getIdTags(id: string): string[];
    getIdsWithTag(tag: string): string[];
    getObjectByID(id: string): any;
    getObjectIds(): string[];
    getAllObjects(): [string, any][];
    getConstructorIDs(): string[];
    build(): void;
}

declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
    ALL = "ALL",
    CONNECT = "CONNECT",
    TRACE = "TRACE"
}

declare class HTTPRouteModel {
    private path;
    private method;
    constructor(path: string, method: HttpMethod);
    get Path(): string;
    get Method(): HttpMethod;
    toString(): string;
    addPrefix(lhs: string): void;
    static fromString(id: string): HTTPRouteModel;
    static GET(path: string): HTTPRouteModel;
    static POST(path: string): HTTPRouteModel;
    static PUT(path: string): HTTPRouteModel;
    static DELETE(path: string): HTTPRouteModel;
    static PATCH(path: string): HTTPRouteModel;
    static OPTIONS(path: string): HTTPRouteModel;
    static HEAD(path: string): HTTPRouteModel;
    static ALL(path: string): HTTPRouteModel;
}

declare class HTTPRouteHandlerModel {
    private order;
    private route;
    constructor(order: number, route: HTTPRouteModel);
    get Order(): number;
    get Route(): HTTPRouteModel;
    set Route(route: HTTPRouteModel);
}

declare enum HTTPRouteHandlerParameter {
    REQUEST = "REQUEST",
    RESPONSE = "RESPONSE",
    REQUEST_BODY = "REQUEST_BODY",
    REQUSET_QUERY = "REQUEST_QUERY",
    REQUEST_PARAMS = "REQUEST_PARAMS",
    REQUEST_HEADERS = "REQUEST_HEADERS"
}
declare class HTTPRequestParamUtil {
    static getProperty(param: HTTPRouteHandlerParameter, req: Request, res: Response): any;
}

declare class RouteHandlerManager<RouteHandlerModel, ParameterModel> {
    private handlerToPath;
    private handlerToParent;
    private handlerToParams;
    constructor();
    addHandler(id: string, parentId: string, model: RouteHandlerModel): void;
    addParams(id: string, params: ParameterModel[]): void;
    getHandlerParams(id: string): ParameterModel[];
    getModelById(id: string): RouteHandlerModel[];
    getParentById(id: string): string;
    getAllHandlersWithRoute(): [string, RouteHandlerModel[]][];
}

declare class ExpressRouteHandlerManager extends RouteHandlerManager<HTTPRouteHandlerModel, HTTPRouteHandlerParameter> {
    getAllRoutesWithHandlers(): [string, [string, HTTPRouteHandlerParameter[]][]][];
}

interface ExpressServerOptions {
    port: number;
    cors: cors.CorsOptions;
}
declare class ExpressApplicationManager {
    private routeHanlderManager;
    private app;
    private server;
    private serverOptions;
    constructor(routeHanlderManager: ExpressRouteHandlerManager);
    set ServerOptions(options: Partial<ExpressServerOptions>);
    get HttpServer(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | undefined;
    createServer(preconfig?: (app: express.Express) => void): void;
    startServer(): void;
    private createExpessHandler;
    private attachRouteHandler;
}

declare const DEFAULT = "default";
declare const EXPRESS_CONTEXT_NAME = "express_context";
declare const REST_TAG = "rest";
interface ExpressApplicationContainer {
    getExpressServerOptions?: () => Partial<ExpressServerOptions>;
    preconfigExpress?: (app: express.Express) => void;
}
interface ServerContext {
    get HttpServer(): Server;
    startServer(): void;
}
declare class ExpressApplicationContext extends IOCContextDecorator implements ServerContext {
    private routeControllerManager;
    private routeHandlerManager;
    private applicationManager;
    private applicationContainer;
    constructor(context: IOCContextInterface);
    set ApplicationContainer(applicationContainer: ExpressApplicationContainer);
    addController(controllerId: string, path: string, handlers: [string, HTTPRouteHandlerModel, HTTPRouteHandlerParameter[]][]): void;
    displayControllersString(): string;
    displayHandlersString(): string;
    build(): void;
    startServer(): void;
    get HttpServer(): Server;
}

declare class RouteControllerManager {
    private controllerToRouteMap;
    private handlerMap;
    constructor();
    addController(id: string, path: string, handlerIds: string[]): void;
    getControllerRoute(id: string): string;
    getControllerHandlers(id: string): string[];
    getAllControllersWithRoutes(): [string, string][];
}

declare class NextEntity {
    private requestBodyUpdates;
    private requestHeaderUpdates;
    constructor(requestBodyUpdates?: Map<string, any>, requestHeaderUpdates?: Map<string, string>);
    updateRequest(req: Request): void;
    static noUpdate(): NextEntity;
    static fromObject(body?: Record<string, any>, headers?: Record<string, string>): NextEntity;
    private static objectToMap;
}

declare enum HttpStatusCode {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    MULTI_STATUS = 207,
    ALREADY_REPORTED = 208,
    IM_USED = 226,
    MULTIPLE_CHOICES = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    USE_PROXY = 305,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    IM_A_TEAPOT = 418,// RFC 2324
    MISDIRECTED_REQUEST = 421,
    UNPROCESSABLE_ENTITY = 422,
    LOCKED = 423,
    FAILED_DEPENDENCY = 424,
    TOO_EARLY = 425,
    UPGRADE_REQUIRED = 426,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
    UNAVAILABLE_FOR_LEGAL_REASONS = 451,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505,
    VARIANT_ALSO_NEGOTIATES = 506,
    INSUFFICIENT_STORAGE = 507,
    LOOP_DETECTED = 508,
    NOT_EXTENDED = 510,
    NETWORK_AUTHENTICATION_REQUIRED = 511
}

declare class ResponseCategory {
    static INFO: string;
    static SUCCESS: string;
    static REDIRECT: string;
    static CLIENT_ERROR: string;
    static SERVER_ERROR: string;
    static fromStatus(status: number): string;
}
declare class ResponseEntity {
    private status;
    private body;
    private headers;
    constructor(status: HttpStatusCode, body?: any, headers?: Map<string, string>);
    get Status(): HttpStatusCode;
    get Category(): string;
    get isError(): boolean;
    get Body(): any;
    get Headers(): Map<string, string>;
    static ok(body?: any): ResponseEntity;
    static created(body?: any): ResponseEntity;
    static noContent(): ResponseEntity;
    static badRequest(body?: any): ResponseEntity;
    static unauthorized(body?: any): ResponseEntity;
    static forbidden(body?: any): ResponseEntity;
    static notFound(body?: any): ResponseEntity;
    static internalServerError(body?: any): ResponseEntity;
}

declare function ExpressApplication(constructor: Constructor<ExpressApplicationContainer>): void;

declare function ExpressRequestParam(paramType: HTTPRouteHandlerParameter): (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;
declare const RequestObject: (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;
declare const RequestBody: (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;
declare const RequestQuery: (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;
declare const PathVariables: (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;
declare const RequestHeaders: (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;
declare const ResponseObject: (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;

declare function RestController(path?: string): (constructor: Constructor) => void;

declare function RestHandler(method: HttpMethod, path?: string, order?: number, detatched?: boolean): (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
declare const GET: (path?: string | undefined, order?: number | undefined, detatched?: boolean | undefined) => (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
declare const POST: (path?: string | undefined, order?: number | undefined, detatched?: boolean | undefined) => (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
declare const DELETE: (path?: string | undefined, order?: number | undefined, detatched?: boolean | undefined) => (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
declare const PATCH: (path?: string | undefined, order?: number | undefined, detatched?: boolean | undefined) => (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
declare const PUT: (path?: string | undefined, order?: number | undefined, detatched?: boolean | undefined) => (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
declare class Middleware {
    static DEFAULT: (method: HttpMethod, path: string) => (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
    static GET: (path: string) => (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
    static POST: (path: string) => (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
    static DELETE: (path: string) => (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
    static PATCH: (path: string) => (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
    static PUT: (path: string) => (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;
}

declare function Service(constructor: Constructor): void;

declare class IdType {
    static COMPONENT: string;
}
declare class IDBuilder {
    private type;
    private content;
    constructor(type?: string, content?: string[]);
    setType(type: string): this;
    addContent(content: string): this;
    build(): string;
    static fromComponent(constructor: Constructor<any>): IDBuilder;
    static fromType(type: string): IDBuilder;
}
declare class IDUtil {
    static getIdData(id: string): string[];
}

declare class ExpressIdType {
    static CONTROLLER: string;
    static HANDLER: string;
    static APPLICATION: string;
    static ROUTE_MODEL: string;
}
declare class ExpressIdBuilder extends IDBuilder {
    static fromController(consructor: Constructor): ExpressIdBuilder;
    static fromHandler(methodName: string): ExpressIdBuilder;
}

declare class IOCContainerRepository {
    private containerConstructorMap;
    private containerObjectMap;
    constructor();
    addConstructor(id: string, constructor: Constructor<any>): void;
    findConstructorById(id: string): Constructor<any>;
    findObjectById(id: string): any;
    findAllObjectIds(): string[];
    findAllObjects(): any[];
    findAllConstructorIds(): string[];
    buildConstructorObject(id: string, dependancies: string[]): void;
}

declare class IOCContextRegistry {
    contextMap: Map<string, IOCContextInterface>;
    constructor();
    getDefaultContext(): IOCContextInterface;
    getContextById(id: string): IOCContextInterface;
    registerContext(id: string, context?: IOCContextInterface): IOCContextInterface;
    getRegisteredContextIds(): IterableIterator<string>;
    replaceContext(id: string, context: IOCContextInterface): void;
    isRegistered(id: string): boolean;
}
declare const contextRegistry: IOCContextRegistry;

declare class DependancyManager {
    private dependancies;
    private nodes;
    constructor();
    add(dependant: string, dependancy: string): void;
    addNode(id: string): void;
    getDependancies(id: string): string[];
    getResolutionOrder(): string[];
}

declare class TagManager {
    private tags;
    constructor();
    addTag(id: string, tag: string): void;
    getIdTags(id: string): Set<string> | never[];
    getIdsWithTag(tag: string): string[];
}

declare function Component(contextId?: string, tags?: string[], type?: string): (constructor: Constructor<any>) => void;

declare function Inject(parameterConstructor: Constructor): (target: any, propertyKey: string | undefined, parameterIndex: number) => void;

declare enum SocketIORouteHandlerParameter {
    SOCKET = "SOCKET",
    SOCKET_SERVER = "SOCKET_SERVER",
    DATA = "DATA",
    CALLBACK = "CALLBACK"
}

declare class SocketIORouteHandlerModel {
    private namespace;
    private event;
    constructor(namespace: string, event: string);
    get Namespace(): string;
    get Event(): string;
    toString(): string;
    static fromString(id: string): SocketIORouteHandlerModel;
}

declare const SOCKETIO_CONTEXT_NAME = "socketio_context";
declare const SOCKET_TAG = "socket";
interface SocketIOApplicationContainer {
    getSocketServerOptions?: () => Partial<ServerOptions>;
    preconfigSocket?: (app: Server$1) => void;
}
declare class SocketIOApplicationContext extends IOCContextDecorator {
    private serverContext;
    private routeControllerManager;
    private routeHandlerManager;
    private applicationManager;
    private applicationContainer;
    constructor(context: IOCContextDecorator, serverContext: ServerContext);
    set ApplicationContainer(applicationContainer: SocketIOApplicationContainer);
    addController(controllerId: string, namespace: string, handlers: [
        string,
        SocketIORouteHandlerModel,
        SocketIORouteHandlerParameter[]
    ][]): void;
    build(): void;
}

declare class SocketIORouteHandlerManager extends RouteHandlerManager<SocketIORouteHandlerModel, SocketIORouteHandlerParameter> {
    getAllNamespacesWithEvents(): [string, [string, string, SocketIORouteHandlerParameter[]][]][];
}

declare class SocketIOApplicationManager {
    private routeHandlerManager;
    private io;
    private serverOptions;
    private httpServer;
    constructor(routeHandlerManager: SocketIORouteHandlerManager);
    set ServerOptions(options: Partial<ServerOptions>);
    set HttpServer(server: http.Server);
    createServer(preconfig?: (io: Server$1) => void): void;
    private createSocketHandler;
}

declare function SocketIOApplication(constructor: Constructor<SocketIOApplicationContainer>): void;

declare function SocketController(namespace: string): (constructor: Constructor) => void;

declare function SocketEvent(event: string): (targetPrototype: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => void;

declare function SocketRequestParam(paramType: SocketIORouteHandlerParameter): (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;
declare const IOSocket: (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;
declare const IOServer: (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;
declare const IOData: (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;
declare const IOCallBack: (targetPrototype: any, propertyKey: string | symbol, parameterIndex: number) => void;

export { Component, DEFAULT, DELETE, DependancyManager, EXPRESS_CONTEXT_NAME, ExpressApplication, type ExpressApplicationContainer, ExpressApplicationContext, ExpressApplicationManager, ExpressIdBuilder, ExpressIdType, ExpressRequestParam, ExpressRouteHandlerManager, type ExpressServerOptions, GET, HTTPRequestParamUtil, HTTPRouteHandlerModel, HTTPRouteHandlerParameter, HTTPRouteModel, HttpMethod, HttpStatusCode, IDBuilder, IDUtil, IOCContainerRepository, IOCContext, IOCContextDecorator, type IOCContextInterface, IOCallBack, IOData, IOServer, IOSocket, IdType, Inject, Middleware, NextEntity, PATCH, POST, PUT, PathVariables, REST_TAG, RequestBody, RequestHeaders, RequestObject, RequestQuery, ResponseCategory, ResponseEntity, ResponseObject, RestController, RestHandler, RouteControllerManager, RouteHandlerManager, SOCKETIO_CONTEXT_NAME, SOCKET_TAG, type ServerContext, Service, SocketController, SocketEvent, SocketIOApplication, type SocketIOApplicationContainer, SocketIOApplicationContext, SocketIOApplicationManager, SocketIORouteHandlerManager, SocketRequestParam, TagManager, contextRegistry };
