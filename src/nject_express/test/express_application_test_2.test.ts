import { IncomingHttpHeaders } from "http";
import { contextRegistry } from "../../nject_ioc/core/context_registry";
import { Inject } from "../../nject_ioc/decorators/inject_decorator";
import {
  DEFAULT,
  EXPRESS_CONTEXT_NAME,
  ExpressApplicationContainer,
  ExpressApplicationContext,
} from "../core/express_application_context";
import { ResponseEntity } from "../core/server_entities/server_response_entity";
import {
  ExpressApplication,
} from "../decorators/express_application_decorator";
import {
  PathVariable,
  RequestBody,
  RequestHeaders,
  RequestQuery,
} from "../decorators/express_parameter_decorator";
import { RestController } from "../decorators/rest_controller_decorator";
import { GET, PATCH, POST } from "../decorators/rest_handler_decorator";
import { Service } from "../decorators/service_decorator";
import { NextEntity } from "../core/server_entities/server_next_entity";

const context = contextRegistry.registerContext(DEFAULT);
const expressContext = new ExpressApplicationContext(context);
contextRegistry.registerContext(EXPRESS_CONTEXT_NAME, expressContext);

type User = {
  username: string;
  password: string;
};

@Service
class AuthService {
  private users: User[] = [];
  private hashToUser = new Map<number, User>();

  public createUser(username: string, password: string) {
    this.users.push({ username, password });
  }

  public login(username: string, password: string) {
    let user: User | undefined;
    console.log("USERS: ", this.users);
    this.users.forEach((i_user) => {
      if (i_user.username === username) {
        user = i_user;
      }
    });

    if (user?.password !== password) throw new Error("Wrong password");

    const userHash = AuthService.nextHash++;
    this.hashToUser.set(userHash, { username, password });

    return userHash;
  }

  public authenticate(hash: number) {
    const user = this.hashToUser.get(hash);
    if (!user) {
      throw new Error("unauthorized");
    }

    return user;
  }

  static nextHash: number = 0;
}

@RestController("/auth")
class Auth {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @POST()
  public signUp(
    @RequestBody { username, password }: { username: string; password: string }
  ) {
    this.authService.createUser(username, password);
    return ResponseEntity.noContent();
  }

  @GET()
  public signIn(
    @RequestQuery { username, password }: { username: string; password: string }
  ) {
    console.log({ username, password });
    const token = this.authService.login(username, password);
    return ResponseEntity.ok({ token });
  }

  @POST("/store", 0, true)
  @GET("/store/:key", 0, true)
  @PATCH("/store/:key", 0, true)
  public authenticate(@RequestHeaders headers: IncomingHttpHeaders) {
    const token = Number.parseInt(headers.authorization ?? "-1");

    try {
      const user = this.authService.authenticate(token);
      return NextEntity.fromObject({ user });
    } catch (e) {
      return ResponseEntity.unauthorized("Unauthorized");
    }
  }
}

@RestController("/store")
class Store {
  private store = new Map<string, string>();

  @POST()
  public addItem(@RequestBody { key, item }: { key: string; item: string }) {
    this.store.set(key, item);
    return ResponseEntity.noContent();
  }

  @GET("/:key")
  public getItem(@PathVariable pathVar: { key: string }) {
    const result = this.store.get(pathVar.key);
    if (!result) {
      return ResponseEntity.notFound();
    }
    return ResponseEntity.ok({ result });
  }

  @PATCH("/:key")
  public updateItem(
    @PathVariable { key }: { key: string },
    @RequestBody { item }: { item: string }
  ) {
    if (this.store.has(key)) {
      this.store.set(key, item);
      return ResponseEntity.noContent();
    } else {
      return ResponseEntity.notFound();
    }
  }
}

@ExpressApplication
class Application implements ExpressApplicationContainer {}

expressContext.startServer();