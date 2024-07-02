import { IOCError } from "../error/ioc_error";
import { IOCContext } from "./context";

class IOCContenxtRegistry {
  contextMap: Map<string, IOCContext>;
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

  public registerContext(id: string, context?: IOCContext) {
    if (this.contextMap.has(id)) {
      throw IOCError.duplicateContextId(id);
    }
    if (!context) context = new IOCContext();
    this.contextMap.set(id, context);
  }

  public getRegisteredContextIds() {
    return this.contextMap.keys();
  }
}

export const contextRegistry = new IOCContenxtRegistry();
