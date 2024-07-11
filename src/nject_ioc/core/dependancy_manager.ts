import { DependancyError } from "../error/dependancy_error";

export class DependancyManager {
  private dependancies: Map<string, string[]>;
  private nodes: Set<string>;

  constructor() {
    this.dependancies = new Map();
    this.nodes = new Set();
  }

  public add(dependant: string, dependancy: string) {
    this.nodes.add(dependant);
    this.nodes.add(dependancy);

    if (!this.dependancies.has(dependant)) {
      this.dependancies.set(dependant, []);
    }
    this.dependancies.get(dependant)!.push(dependancy);
  }

  public addNode(id: string) {
    this.nodes.add(id);
  }

  public getDependancies(id: string) {
    return this.dependancies.get(id) ?? [];
  }

  public getResolutionOrder() {
    const order: string[] = [];
    const currentPath: Set<string> = new Set();
    const visited: Set<string> = new Set();
    const currStack: string[] = [];
    const dfs = (node: string) => {
      // Cycle present
      if (currentPath.has(node)) {
        const cycle = [node];
        while (currStack[currStack.length - 1] != node)
          cycle.push(currStack.pop()!);
        currStack.push(node);

        throw DependancyError.cyclicDependanct(cycle);
      }

      // Node already visited
      if (visited.has(node)) {
        return;
      }

      visited.add(node);
      currentPath.add(node);
      currStack.push(node);

      for (const child of this.dependancies.get(node) ?? []) {
        dfs(child);
      }
      order.push(node);

      currentPath.delete(node);
      currStack.pop();
    };

    for (const node of this.nodes) {
      dfs(node);
    }

    return order;
  }
}
