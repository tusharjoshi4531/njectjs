import { Constructor } from "../util/types";
import { IOCContainerRepository } from "./container_repository";
import { DependancyManager } from "./dependancy_manager";
import { TagManager } from "./tag_manager";

export interface IOCContextInterface {
  addConstructor(id: string, constructor: Constructor<any>): void;
  addDependancy(dependant: string, dependancy: string): void;
  addTag(id: string, tag: string): void;
  getIdTags(id: string): string[];
  getIdsWithTag(tag: string): string[];
  getObjectByID(id: string): any; // Assuming any return type for simplicity
  getObjectIds(): string[];
  getAllObjects(): [string, any][]
  getConstructorIDs(): string[];
  build(): void;
}

export class IOCContext implements IOCContextInterface {
  private containerRepository: IOCContainerRepository;
  private dependancyManager: DependancyManager;
  private tagManager: TagManager;

  constructor() {
    this.containerRepository = new IOCContainerRepository();
    this.dependancyManager = new DependancyManager();
    this.tagManager = new TagManager();
  }
  

  public addConstructor(id: string, constructor: Constructor<any>) {
    this.containerRepository.addConstructor(id, constructor);
    this.dependancyManager.addNode(id);
  }

  public addDependancy(dependant: string, dependancy: string) {
    this.dependancyManager.add(dependant, dependancy);
  }

  public addTag(id: string, tag: string) {
    this.tagManager.addTag(id, tag);
  }

  public getIdTags(id: string) {
    return Array.from(this.tagManager.getIdTags(id));
  }

  public getIdsWithTag(tag: string) {
    return this.tagManager.getIdsWithTag(tag);
  }

  public getObjectByID(id: string) {
    return this.containerRepository.findObjectById(id);
  }

  public getObjectIds() {
    return this.containerRepository.findAllObjectIds();
  }

  getAllObjects(): [string, any][] {
    return this.containerRepository.findAllObjects();
  }

  public getConstructorIDs() {
    return this.containerRepository.findAllConstructorIds();
  }

  public build() {
    console.log("BUILD");
    const order = this.dependancyManager.getResolutionOrder();

    for (const id of order) {
      const dependancies = this.dependancyManager.getDependancies(id);
      this.containerRepository.buildConstructorObject(id, dependancies);
    }

    console.log({ order: order.join(", ") });
    order.forEach((id) =>
      console.log({ id: this.containerRepository.findObjectById(id) })
    );
  }
}
