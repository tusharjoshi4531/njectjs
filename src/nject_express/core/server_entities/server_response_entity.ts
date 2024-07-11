import { HttpStatusCode } from "./server_response_status";

export class ResponseCategory {
  static INFO = "1";
  static SUCCESS = "2";
  static REDIRECT = "3";
  static CLIENT_ERROR = "4";
  static SERVER_ERROR = "5";

  static fromStatus(status: number) {
    return status.toString()[0];
  }
}

export class ResponseEntity {
  constructor(
    private status: HttpStatusCode,
    private body: any = {},
    private headers: Map<string, string> = new Map()
  ) {}

  public get Status() {
    return this.status;
  }

  public get Category() {
    return ResponseCategory.fromStatus(this.status);
  }

  public get isError() {
    return [
      ResponseCategory.CLIENT_ERROR,
      ResponseCategory.SERVER_ERROR,
    ].includes(this.Category);
  }

  public get Body() {
    return this.body;
  }

  public get Headers() {
    return this.headers;
  }

  static ok(body: any = {}) {
    return new ResponseEntity(HttpStatusCode.OK, body);
  }

  static noContent() {
    return new ResponseEntity(HttpStatusCode.NO_CONTENT);
  }

  static badRequest(body: any = {}) {
    return new ResponseEntity(HttpStatusCode.BAD_REQUEST, body);
  }

  static unauthorized(body: any = {}) {
    return new ResponseEntity(HttpStatusCode.UNAUTHORIZED, body);
  }

  static forbidden(body: any = {}) {
    return new ResponseEntity(HttpStatusCode.FORBIDDEN, body);
  }

  static notFound(body: any = {}) {
    return new ResponseEntity(HttpStatusCode.NOT_FOUND, body);
  }

  static internalServerError(body: any = {}) {
    return new ResponseEntity(HttpStatusCode.INTERNAL_SERVER_ERROR, body);
  }

  // TODO: Add more response
}


