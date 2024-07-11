export class HTTPRouteModelError {
  static invalidString(id: string) {
    return new Error(
      `String "${id}" is an invalid representation of a HTTPRouteModel`
    );
  }
}
