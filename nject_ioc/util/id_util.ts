import { Constructor } from "./types";
const sep = ":";

export class IdType {
  static COMPONENT = "component";
}

export class IDBuilder {
  constructor(private tag: string = "", private content: string[] = []) {}

  public addContent(content: string) {
    this.content.push(content);
    return this;
  }

  public build() {
    return [this.tag, ...this.content].join(sep);
  }

  static fromComponent(constructor: Constructor<any>) {
    return new IDBuilder(IdType.COMPONENT).addContent(constructor.name);
  }
}

export class IDUtil {
  public getIdData(id: string) {
    return id.split(sep);
  }
}
