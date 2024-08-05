# NjectJS

## Table of Contents

- [NjectJS](#njectjs)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Http Application Documentation](#http-application-documentation)
    - [Express Application](#express-application)
    - [Controllers](#controllers)
      - [Controller](#controller)
      - [Routes](#routes)
      - [Response](#response)
      - [Middleware](#middleware)
      - [Next Entities](#next-entities)
    - [Services](#services)
      - [Defining a service](#defining-a-service)
      - [Using a service](#using-a-service)

## Description

A **TypeScript** library for building server-side applications with Object-Oriented Programming and Dependency Injection

## Installation

Assuming you have configured your project with typescript

```console
npm i njectjs
```

## Quick Start

Consider the following file structure

```plaintext
project-name/
├── src/
│   ├── controllers/
│   │   ├── hello_controller.ts
│   │   └── index.ts
│   ├── services/
│   │   └── ...
│   └── index.ts
├── index.ts
└── package.json
```

---
tsconfig.json

```json
{
  ...
  "experimentalDecorators": true,       
  "emitDecoratorMetadata": true, 
  ...
}
```

To enable decorators

---

Index.ts

```ts
import {
  contextRegistry,
  DEFAULT,
  ExpressApplicationContext,
  EXPRESS_CONTEXT_NAME,
} from "njectjs";

const context = contextRegistry.registerContext(DEFAULT);
const expressContext = new ExpressApplicationContext(context);

contextRegistry.registerContext(EXPRESS_CONTEXT_NAME, expressContext);

import "./src";

expressContext.startServer();
```

This sets up the contexts which manage all the containers present in our application. For now you can coppy it as it is

---

src/index.ts

```ts
import {
  ExpressApplication,
  ExpressApplicationContainer,
  ExpressServerOptions,
} from "njectjs";

import "./controllers"

@ExpressApplication
class ExpressApp implements ExpressApplicationContainer {
  getExpressServerOptions = (): Partial<ExpressServerOptions> => ({
    port: 8080,   // Set Application Port
    cors: {
      origin: "*",  // Set CORS options
    },
  });
}
```

Njectjs uses express under the hood to create http servers

---

src/controllers/index.ts

```ts
export * from "./hello_controller";
```

---

src/controllers/hello_controller.ts

```ts
import { GET, ResponseEntity, RestController } from "njectjs";

@RestController("/hello")
export class HelloController {
  @GET("/greet")
  public greet() {
    console.log("Server Says Hi!!!");
    return ResponseEntity.ok("Hi!!!");
  }
}
```

This mapps the root path of the controller to `:8080/hello` and creates a route `:8080/hello/great` which returs with `STATUS OK`

---

run index.ts with ts-node, nodemon, etc.

## Http Application Documentation

Nject js uses `express` under the hood to create Http servers.

### Express Application

```ts
import { ExpressApplication, ExpressApplicationContainer, ExpressServerOptions } from "njectjs";
import "./controller";
import { Express } from "express";

@ExpressApplication
class ExpressApp implements ExpressApplicationContainer {
  getExpressServerOptions = (): Partial<ExpressServerOptions> => ({
    // Define server options here
  });

  preconfigExpress = (app: Express) => {
    // Configure express application before creating routes
  };
}
```

Create a class which implements ```ExpressApplicationContainer``` and is annotated with ```@ExpressApplication```.

```getExpressServerOptions```: is function which returns a options object used to configure the server. As of now only port and CORS options are present. Any other advanced configuration can be done in the preconfig method

```preconfigExpress```: function is called just before binding controllers to routes and lets user access the express application object being used. Here users can further configure their express application. Eg. add third party middlewares. Users can even embed an entire express application within this function.

> **Note:** it is essential to import all controller classes in this file as the files need to be imported for the preprocessing to run.

---

### Controllers

#### Controller 

```ts
@RestController("/path")
export class AuthController {
  // Define routes and middlewares
}
```

Create a class anotated with ```@RestController([path])``` to create a controller. This class is automatically captured and monitored by the application context.

#### Routes

```ts
@RestController("/path")
export class AuthController {
  @POST("/path")
  public async login(@RequestBody body: ILoginRequestBody) {
    ...
  }
}
```

Annotate methods with `@POST([path])`, `@GET([path])` , `@PATCH([path])`, etc. To create route handlers. Access request information by annotating parameters with:

- `@RequestBody` - populates the argument with request body
- `@RequestQuery` - populates the argument with request query params
- `@RequestHeaders` - populates the argument with request headers
- `@RequestObject` - populates the argument with express request object
- `@PathVariables` - populates the argument with url parameters
- `@ResponseObject` - opulates the argument with express response object

#### Response

```ts
@RestController("/path")
export class AuthController {
  @POST("/path")
  public async login(@RequestBody body: ILoginRequestBody) {
    ...
    return ResponseEntity(status, body)
  }
}
```

Each route handler must either return a ```ResponseEntity``` object or throw an error.

```ResponseEntitiy``` can be created by using factory methods like

- ```ResponseEntity.ok(body)```  
- ```ResponseEntity.ok(body)```  
- ```ResponseEntity.badRequest(body)```  
- etc.

#### Middleware

```ts
@RestController("/path")
export class AuthController {
  
  @Middleware.POST("/path1")
  @Middleware.PATCH("/path1/:id/")
  @Middleware.PATCH("/path2/subpath")
  public async authorizeToken(@RequestHeaders headers: IncomingHttpHeaders) {
    ...
  }
}
```

Create a middle ware by anotating a method with `@Middleware.[Method]([path])` annotation. this handler will be executed before the actual route handler.

> **Note**: Rest controller path will not be inserted before the paths defined in middleware like how they do in defineing controllers. In the above example `authorizeToken` will execute before the route `/path1` and not `/path/paht1`

#### Next Entities

```ts
@RestController("/path")
export class AuthController {
  
  @Middleware.POST("/path1")
  @Middleware.PATCH("/path1/:id/")
  @Middleware.PATCH("/path2/subpath")
  public async authorizeToken(@RequestHeaders headers: IncomingHttpHeaders) {
    return NextEntity.fromObject({
      userData: user,
    });
  }
}
```

Middleware should return a `NextEntity(body: Map<stirng, any>, headers: Map<string, any>)` which is used to inject / modify data in the request object before passing it to the controller. The body and headers which are passed in the constructor are injected in the request object. Users can create `NextEntity` objects using the following factory methods:

- `NextEntity.fromObject(data = {}, headers = {})`: pass in body and header data as a javascript object instead of map
- `NextEntity.NoUpdate()`: creates an object with empty body and header value

---

### Services

#### Defining a service

```ts
@Service
export class HashService {
  ...
}
```

Annotate any class with `@Service` to make it a service. A service class is automatically monitored by the application context and can be injected to other service / controller classes

#### Using a service

```ts
@RestController("/auth")
export class AuthController {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(HashService) private hashService: HashService,
    @Inject(TokenService) private tokenService: TokenService
  ) {}
}
```

Users can inject services within the constructor of a controller / service by anotating constructor parameters with `@Inject(ServiceClass)`. The application context manages the dependancy graph and makes sure that a dependancy is consumed by each dependant class properly.
