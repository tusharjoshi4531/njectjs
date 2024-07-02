import { Constructor } from "../util/types";
import { IOCContainerRepository } from "./container_repository";
import { DependancyManager } from "./dependancy_manager";
import { TagManager } from "./tag_manager";

export class IOCContext {
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
    this.tagManager.getIdTags(id);
  }

  public getIdsWithTag(tag: string) {
    this.tagManager.getIdsWithTag(tag);
  }

  public getObjectByID(id: string) {
    this.containerRepository.findObjectById(id);
  }

  public getObjectIds() {
    return this.containerRepository.findAllObjectIds();
  }

  public getConstructorIDs() {
    return this.containerRepository.findAllConstructorIds();
  }

  public build() {
    const order = this.dependancyManager.getResolutionOrder();

    for (const id of order) {
      const dependancies = this.dependancyManager.getDependancies(id);
      this.containerRepository.buildConstructorObject(id, dependancies);
    }
  }
}
