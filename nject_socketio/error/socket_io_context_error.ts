export class SocketIOContextError {
  static noApplicationContainer() {
    return new Error(
      "Application container is not assigned to express server context"
    );
  }

  static noHttpServer() {
    return new Error(
      "Http server is not built yet"
    )
  }
}
