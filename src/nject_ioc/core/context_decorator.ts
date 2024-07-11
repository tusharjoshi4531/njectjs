import { Constructor } from "../util/types";
import { IOCContextInterface } from "./context";

export class IOCContextDecorator implements IOCContextInterface {
  constructor(private context: IOCContextInterface) {}

  addConstructor(id: string, constructor: Constructor<any>): void {
    this.context.addConstructor(id, constructor);
  }

  addDependancy(dependant: string, dependancy: string): void {
    this.context.addDependancy(dependant, dependancy);
  }

  addTag(id: string, tag: string): void {
    this.context.addTag(id, tag);
  }

  getIdTags(id: string): string[] {
    return this.context.getIdTags(id);
  }

  getIdsWithTag(tag: string): string[] {
    return this.context.getIdsWithTag(tag);
  }

  getObjectByID(id: string) {
    return this.context.getObjectByID(id);
  }

  getObjectIds(): string[] {
    return this.context.getObjectIds();
  }

  getAllObjects(): [string, any][] {
    return this.context.getAllObjects();
  }

  getConstructorIDs(): string[] {
    return this.context.getConstructorIDs();
  }

  build(): void {
    this.context.build();
  }
}
