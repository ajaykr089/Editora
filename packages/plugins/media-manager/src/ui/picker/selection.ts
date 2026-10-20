/**
 * What is chosen in the picker. In single mode (replacing an image) choosing replaces; otherwise it accumulates, in
 * the order things were chosen, which is the order they are inserted in.
 */
export class SelectionModel<T extends { id: string }> {
  private chosen = new Map<string, T>();

  constructor(
    readonly multiple: boolean,
    private readonly onChange: () => void = () => {},
  ) {}

  get items(): T[] {
    return [...this.chosen.values()];
  }

  get size(): number {
    return this.chosen.size;
  }

  has(id: string): boolean {
    return this.chosen.has(id);
  }

  /** Choose exactly this one. */
  only(item: T): void {
    this.chosen = new Map([[item.id, item]]);
    this.onChange();
  }

  toggle(item: T): void {
    if (!this.multiple) {
      this.only(item);
      return;
    }
    if (this.chosen.has(item.id)) this.chosen.delete(item.id);
    else this.chosen.set(item.id, item);
    this.onChange();
  }

  /** Choose everything between two items of `ordered`, inclusive, keeping what was already chosen. */
  range(ordered: T[], fromId: string, toId: string): void {
    if (!this.multiple) return;
    const a = ordered.findIndex((item) => item.id === fromId);
    const b = ordered.findIndex((item) => item.id === toId);
    if (a === -1 || b === -1) return;
    for (const item of ordered.slice(Math.min(a, b), Math.max(a, b) + 1)) this.chosen.set(item.id, item);
    this.onChange();
  }

  all(items: T[]): void {
    if (!this.multiple) return;
    items.forEach((item) => this.chosen.set(item.id, item));
    this.onChange();
  }

  remove(id: string): void {
    if (this.chosen.delete(id)) this.onChange();
  }

  clear(): void {
    if (this.chosen.size === 0) return;
    this.chosen.clear();
    this.onChange();
  }
}
