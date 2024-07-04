import { Request, Response } from "express";

export enum HTTPRouteHandlerParameter {
  REQUEST = "REQUEST",
  RESPONSE = "RESPONSE",
  REQUEST_BODY = "REQUEST_BODY",
  REQUSET_QUERY = "REQUEST_QUERY",
  REQUEST_PARAMS = "REQUEST_PARAMS",
  REQUEST_HEADERS = "REQUEST_HEADERS",
}

export class HTTPRequestParamUtil {
  static getProperty(
    param: HTTPRouteHandlerParameter,
    req: Request,
    res: Response
  ) {
    switch (param) {
      case HTTPRouteHandlerParameter.REQUEST:
        return req;
      case HTTPRouteHandlerParameter.RESPONSE:
        return res;
      case HTTPRouteHandlerParameter.REQUEST_BODY:
        return req.body;
      case HTTPRouteHandlerParameter.REQUEST_PARAMS:
        return req.params;
      case HTTPRouteHandlerParameter.REQUEST_HEADERS:
        return req.headers;
      case HTTPRouteHandlerParameter.REQUSET_QUERY:
        return req.query;
    }
  }
}
