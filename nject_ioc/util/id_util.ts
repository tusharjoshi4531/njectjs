import { Constructor } from "./types";
const sep = ":";

export class IdType {
  static COMPONENT = "component";
}

export class IDBuilder {
  constructor(private type: string = "", private content: string[] = []) {}

  public setType(type: string) {
    this.type = type;
    return this;
  }

  public addContent(content: string) {
    this.content.push(content);
    return this;
  }

  public build() {
    return [this.type, ...this.content].join(sep);
  }

  static fromComponent(constructor: Constructor<any>) {
    return new IDBuilder(IdType.COMPONENT).addContent(constructor.name);
  }

  static fromType(type: string) {
    return new IDBuilder(type);
  }
}

export class IDUtil {
  static getIdData(id: string) {
    return id.split(sep);
  }
}
