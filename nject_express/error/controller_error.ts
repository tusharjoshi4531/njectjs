export class ControllerError {
  static controllerIdNotFound(id: string) {
    return new Error(`Controller with ID: ${id} not found.`);
  }

  static controllerIdDuplicate(id: string) {
    return new Error(`Container with ID: ${id} already found.`);
  }

  static handlerIdNotFound(id: string) {
    return new Error(`Handler with ID: ${id} not found.`);
  }

  static handlerIdDuplicate(id: string) {
    return new Error(`Handler with ID: ${id} already found.`);
  }
}
