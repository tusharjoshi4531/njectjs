export class IOCError {
  static duplicateComponentId(id: string) {
    return new Error(`Container with ID: ${id} already exists.`);
  }

  static componentIdNotFound(id: string) {
    return new Error(`Container with ID: ${id} not found.`);
  }

  static dependancyNotFound(id: string, depId: string[]) {
    return new Error(
      `Couldn't create object with ID: ${id} as object with dependancies with IDS: [ ${depId.join(
        ", "
      )}] does not exixt`
    );
  }

  static contextNotFound(id: string) {
    return new Error(`Context with ID: ${id} does not exists.`);
  }

  static duplicateContextId(id: string) {
    return new Error(`Context with ID: ${id} already exists.`);
  }

  static canOnlyInjectInConstructor(injectId: string) {
    return new Error(
      `Trying to inject Object with ID: ${injectId} outside constructor `
    );
  }
}
