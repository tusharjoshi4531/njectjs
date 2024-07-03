export class ExpressContextError {
  static noApplicationContainer() {
    return new Error(
      "Application container is not assigned to express server context"
    );
  }
}
