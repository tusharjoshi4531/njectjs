export class DependancyError {
  static cyclicDependanct(cycle: string[]) {
    return new Error(
      `Found a dependancy cycle. Make sure to use setter injection in case of cyclic dependancy.\nCycle: ${cycle.join(
        " -> "
      )}`
    );
  }
}
