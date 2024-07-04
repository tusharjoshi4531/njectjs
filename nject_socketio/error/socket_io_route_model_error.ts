export class SocketIORouteModelError {
  static invalidString(id: string) {
    return new Error(
      `String "${id}" is an invalid representation of a SocketIORouteModel`
    );
  }
}