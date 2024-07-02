export class TagManager {
  private tags: Map<string, Set<string>>;

  constructor() {
    this.tags = new Map();
  }

  public addTag(id: string, tag: string) {
    if (!this.tags.has(id)) {
      this.tags.set(id, new Set());
    }
    this.tags.get(id)!.add(tag);
  }

  public getIdTags(id: string) {
    return this.tags.get(id) ?? [];
  }

  public getIdsWithTag(tag: string) {
    return [...this.tags.entries()]
      .filter(([_, tags]) => tags.has(tag))
      .map(([id, _]) => id);
  }
}
