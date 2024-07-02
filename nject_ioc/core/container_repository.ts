import { IOCError } from "../error/ioc_error";
import { Constructor } from "../util/types";

export class IOCContainerRepository {
  private containerConstructorMap: Map<string, Constructor<any>>;
  private containerObjectMap: Map<string, any>;

  constructor() {
    this.containerObjectMap = new Map();
    this.containerConstructorMap = new Map();

  }

  public addConstructor(id: string, constructor: Constructor<any>) {
    if (this.containerObjectMap.has(id)) {
      throw IOCError.duplicateComponentId(id);
    }
    this.containerConstructorMap.set(id, constructor);
  }

  public findConstructorById(id: string) {
    const constructor = this.containerConstructorMap.get(id);
    if (!constructor) {
      throw IOCError.componentIdNotFound(id);
    }
    return constructor;
  }

  public findObjectById(id: string) {
    const object = this.containerObjectMap.get(id);
    if (!object) {
      throw IOCError.componentIdNotFound(id);
    }
    return object;
  }

  public findAllObjectIds() {
    return [...this.containerObjectMap.keys()];
  }

  public findAllConstructorIds() {
    return [...this.containerConstructorMap.keys()];
  }

  public buildConstructorObject(id: string, dependancies: string[]) {
    const dependacyObjects = dependancies.map((dependancy) =>
      this.containerObjectMap.get(dependancy)
    );

    const unbuiltDependancies = dependancies.filter(
      (dependancy) => !this.containerObjectMap.has(dependancy)
    );

    if (unbuiltDependancies.length > 0) {
      throw IOCError.dependancyNotFound(id, unbuiltDependancies);
    }

    const constructor = this.findConstructorById(id);
    const object = new constructor(...dependacyObjects);

    this.containerConstructorMap.delete(id);
    this.containerObjectMap.set(id, object);
  }
}
