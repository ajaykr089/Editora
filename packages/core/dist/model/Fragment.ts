import { Node } from './Node';

/**
 * An immutable sequence of nodes.
 * Fragments are the content of block nodes and represent the document structure.
 */
export class Fragment {
  private readonly content: readonly Node[];

  constructor(content: readonly Node[] = []) {
    this.content = content;
  }

  /**
   * Create a fragment from an array of nodes.
   */
  static from(nodes: readonly Node[]): Fragment {
    return new Fragment(nodes);
  }

  /**
   * Create a fragment from JSON.
   */
  static fromJSON(schema: any, json: any[]): Fragment {
    const nodes = json.map(nodeJSON => Node.fromJSON(schema, nodeJSON));
    return new Fragment(nodes);
  }

  /**
   * Get the number of child nodes.
   */
  get childCount(): number {
    return this.content.length;
  }

  /**
   * Get the child nodes as an array.
   */
  get children(): readonly Node[] {
    return this.content;
  }

  /**
   * Get a child node by index.
   */
  child(index: number): Node {
    if (index < 0 || index >= this.content.length) {
      throw new Error(`Index ${index} out of bounds`);
    }
    return this.content[index];
  }

  /**
   * Get the first child node.
   */
  get firstChild(): Node | null {
    return this.content.length > 0 ? this.content[0] : null;
  }

  /**
   * Get the last child node.
   */
  get lastChild(): Node | null {
    return this.content.length > 0 ? this.content[this.content.length - 1] : null;
  }

  /**
   * Find the child node at the given document position.
   */
  findChildAt(pos: number): { node: Node; offset: number } | null {
    let offset = 0;

    for (const child of this.content) {
      const childSize = child.nodeSize;
      if (pos >= offset && pos < offset + childSize) {
        return { node: child, offset };
      }
      offset += childSize;
    }

    // Return last child if position is at the end
    if (pos === offset && this.content.length > 0) {
      const lastChild = this.content[this.content.length - 1];
      return { node: lastChild, offset: offset - lastChild.nodeSize };
    }

    return null;
  }

  /**
   * Get the total size of this fragment in the document.
   */
  get size(): number {
    return this.content.reduce((size, node) => size + node.nodeSize, 0);
  }

  /**
   * Create a new fragment with a node appended.
   */
  append(node: Node): Fragment {
    return new Fragment([...this.content, node]);
  }

  /**
   * Create a new fragment by cutting out a slice.
   */
  cut(from: number = 0, to?: number): Fragment {
    const actualTo = to ?? this.size;
    if (from === 0 && actualTo === this.size) {
      return this;
    }

    const result: Node[] = [];
    let pos = 0;

    for (const child of this.content) {
      const childSize = child.nodeSize;

      if (pos + childSize <= from) {
        // Child is entirely before the cut
        pos += childSize;
        continue;
      }

      if (pos >= actualTo) {
        // Child is entirely after the cut
        break;
      }

      // Child overlaps with the cut range
      const childFrom = Math.max(0, from - pos);
      const childTo = Math.min(childSize, actualTo - pos);

      if (childFrom === 0 && childTo === childSize) {
        // Include entire child
        result.push(child);
      } else {
        // Cut the child
        const cutChild = child.cut(childFrom, childTo);
        if (cutChild) {
          result.push(cutChild);
        }
      }

      pos += childSize;
    }

    return new Fragment(result);
  }

  /**
   * Replace a range of this fragment with new content.
   */
  replace(from: number, to: number, fragment: Fragment): Fragment {
    const before = this.cut(0, from);
    const after = this.cut(to);
    return before.appendFragment(fragment).appendFragment(after);
  }

  /**
   * Append another fragment to this one.
   */
  appendFragment(other: Fragment): Fragment {
    return new Fragment([...this.content, ...other.content]);
  }

  /**
   * Check if this fragment equals another fragment.
   */
  equals(other: Fragment): boolean {
    if (this.content.length !== other.content.length) {
      return false;
    }

    for (let i = 0; i < this.content.length; i++) {
      if (!this.content[i].equals(other.content[i])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Convert to JSON representation.
   */
  toJSON(): any[] {
    return this.content.map(node => node.toJSON());
  }

  /**
   * Get the text content of this fragment.
   */
  get textContent(): string {
    return this.content.map(node => node.textContent).join('');
  }

  /**
   * Create a string representation for debugging.
   */
  toString(): string {
    return this.content.map(node => node.toString()).join('');
  }
}