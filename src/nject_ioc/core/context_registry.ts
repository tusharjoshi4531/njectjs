import { IOCError } from "../error/ioc_error";
import { IOCContainerRepository } from "./container_repository";
import { IOCContext, IOCContextInterface } from "./context";

class IOCContextRegistry {
  contextMap: Map<string, IOCContextInterface>;
  constructor() {
    this.contextMap = new Map();
  }

  public getDefaultContext() {
    return this.getContextById("default");
  }

  public getContextById(id: string) {
    const context = this.contextMap.get(id);
    if (!context) {
      throw IOCError.contextNotFound(id);
    }
    return context;
  }

  public registerContext(id: string, context?: IOCContextInterface) {
    if (this.contextMap.has(id)) {
      throw IOCError.duplicateContextId(id);
    }
    context = context ?? new IOCContext();
    this.contextMap.set(id, context);
    return context;
  }

  public getRegisteredContextIds() {
    return this.contextMap.keys();
  }

  public replaceContext(id: string, context: IOCContextInterface) {
    if (!this.contextMap.has(id)) {
      throw IOCError.contextNotFound(id);
    }
    this.contextMap.set(id, context);
  }

  public isRegistered(id: string) {
    return this.contextMap.has(id);
  }
}

export const contextRegistry = new IOCContextRegistry();
