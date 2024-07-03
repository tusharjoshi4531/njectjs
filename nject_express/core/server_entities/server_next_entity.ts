import { Request } from "express";

export class ServerNextEntity {
  constructor(
    private requestBodyUpdates: Map<string, any> = new Map(),
    private requestHeaderUpdates: Map<string, string> = new Map()
  ) {}

  public updateRequest(req: Request) {
    this.requestBodyUpdates.forEach((value, key) => {
      req.body[key] = value;
    });
    this.requestHeaderUpdates.forEach((value, key) => {
      req.headers[key] = value;
    });
  }

  static noUpdate() {
    return new ServerNextEntity();
  }

  static fromObject(
    body: Record<string, any> = {},
    headers: Record<string, string> = {}
  ) {
    return new ServerNextEntity(
      this.objectToMap(body),
      this.objectToMap(headers)
    );
  }

  private static objectToMap<T>(obj: Record<string, T>) {
    const map = new Map<string, T>();

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        map.set(key, obj[key]);
      }
    }
    return map;
  }
}
