import { Node } from './model/Node';
import { Fragment } from './model/Fragment';

/**
 * Base selection interface representing a range or position in the document.
 */
export abstract class Selection {
  abstract readonly $from: ResolvedPos;
  abstract readonly $to: ResolvedPos;
  abstract readonly from: number;
  abstract readonly to: number;
  abstract readonly empty: boolean;

  /**
   * Create a selection at the start of the document.
   */
  static atStart(doc: Node): Selection {
    return TextSelection.create(doc, 0);
  }

  /**
   * Create a selection at the end of the document.
   */
  static atEnd(doc: Node): Selection {
    return TextSelection.create(doc, doc.content.size);
  }

  /**
   * Create a selection from positions.
   */
  static create(doc: Node, from: number, to?: number): Selection {
    if (to === undefined || from === to) {
      return TextSelection.create(doc, from);
    }
    return new TextSelection(
      ResolvedPos.resolve(doc, from),
      ResolvedPos.resolve(doc, to)
    );
  }

  /**
   * Check if this selection equals another selection.
   */
  abstract equals(other: Selection): boolean;

  /**
   * Map this selection through a document change.
   */
  abstract map(doc: Node, mapping: any): Selection;

  /**
   * Convert to JSON representation.
   */
  abstract toJSON(): any;

  /**
   * Get the content of this selection.
   */
  get content(): Slice {
    return new Slice(this.$from.doc.slice(this.from, this.to), 0, 0);
  }
}

/**
 * Text selection representing a cursor position or range in text.
 */
export class TextSelection extends Selection {
  readonly $from: ResolvedPos;
  readonly $to: ResolvedPos;
  readonly from: number;
  readonly to: number;

  constructor($from: ResolvedPos, $to?: ResolvedPos) {
    super();
    this.$from = $from;
    this.$to = $to || $from;
    this.from = $from.pos;
    this.to = this.$to.pos;
  }

  get empty(): boolean {
    return this.from === this.to;
  }

  static create(doc: Node, pos: number): TextSelection {
    return new TextSelection(ResolvedPos.resolve(doc, pos));
  }

  equals(other: Selection): boolean {
    return other instanceof TextSelection &&
           this.$from.pos === other.$from.pos &&
           this.$to.pos === other.$to.pos;
  }

  map(doc: Node, mapping: any): Selection {
    // Basic mapping implementation - will be enhanced
    const newFrom = mapping.map(this.from);
    const newTo = mapping.map(this.to);
    return TextSelection.create(doc, Math.min(newFrom, newTo));
  }

  toJSON(): any {
    return {
      type: 'text',
      from: this.from,
      to: this.to
    };
  }
}

/**
 * Node selection representing the selection of a single node.
 */
export class NodeSelection extends Selection {
  readonly $from: ResolvedPos;
  readonly $to: ResolvedPos;
  readonly from: number;
  readonly to: number;
  readonly node: Node;

  constructor($from: ResolvedPos) {
    super();
    this.$from = $from;
    this.$to = ResolvedPos.resolve($from.doc, $from.pos + $from.nodeAfter!.nodeSize);
    this.from = $from.pos;
    this.to = this.$to.pos;
    this.node = $from.nodeAfter!;
  }

  get empty(): boolean {
    return false;
  }

  static create(doc: Node, pos: number): NodeSelection {
    const $pos = ResolvedPos.resolve(doc, pos);
    if (!$pos.nodeAfter) {
      throw new Error('No node at position ' + pos);
    }
    return new NodeSelection($pos);
  }

  equals(other: Selection): boolean {
    return other instanceof NodeSelection &&
           this.$from.pos === other.$from.pos;
  }

  map(doc: Node, mapping: any): Selection {
    const newPos = mapping.map(this.from);
    try {
      return NodeSelection.create(doc, newPos);
    } catch {
      return TextSelection.create(doc, newPos);
    }
  }

  toJSON(): any {
    return {
      type: 'node',
      from: this.from,
      to: this.to
    };
  }
}

/**
 * Resolved position in the document with context information.
 */
export class ResolvedPos {
  readonly pos: number;
  readonly doc: Node;
  readonly depth: number;
  readonly parentOffset: number;

  constructor(pos: number, doc: Node, depth: number, parentOffset: number) {
    this.pos = pos;
    this.doc = doc;
    this.depth = depth;
    this.parentOffset = parentOffset;
  }

  /**
   * Resolve a position in the document to a ResolvedPos.
   */
  static resolve(doc: Node, pos: number): ResolvedPos {
    if (pos < 0) pos = 0;
    if (pos > doc.content.size) pos = doc.content.size;

    let depth = 0;
    let parentOffset = pos;
    let node = doc;

    while (depth < 100 && parentOffset > 0) {
      const child = node.content.findChildAt(parentOffset - 1);
      if (!child) break;

      if (parentOffset <= child.offset + child.node.nodeSize) {
        depth++;
        parentOffset -= child.offset;
        node = child.node;
      } else {
        break;
      }
    }

    return new ResolvedPos(pos, doc, depth, parentOffset);
  }

  /**
   * Get the node at this position.
   */
  get node(): Node {
    return this.doc.nodeAt(this.pos)!;
  }

  /**
   * Get the node after this position.
   */
  get nodeAfter(): Node | null {
    return this.doc.nodeAt(this.pos);
  }

  /**
   * Get the node before this position.
   */
  get nodeBefore(): Node | null {
    return this.pos > 0 ? this.doc.nodeAt(this.pos - 1) : null;
  }

  /**
   * Get the parent node at the given depth.
   */
  parent(depth?: number): Node {
    const targetDepth = depth ?? this.depth - 1;
    if (targetDepth < 0) return this.doc;

    let pos: ResolvedPos = this;
    for (let i = this.depth; i > targetDepth; i--) {
      pos = pos.parentPos();
    }
    return pos.node;
  }

  /**
   * Get the resolved position of the parent.
   */
  private parentPos(): ResolvedPos {
    let pos = 0;
    let node = this.doc;
    const path = this.path();

    for (let i = 0; i < path.length - 1; i++) {
      pos += path[i].offset + 1;
      node = path[i].node;
    }

    return ResolvedPos.resolve(this.doc, pos);
  }

  /**
   * Get the path from root to this position.
   */
  private path(): Array<{ node: Node; offset: number }> {
    const path: Array<{ node: Node; offset: number }> = [];
    let pos = 0;
    let node = this.doc;

    while (pos < this.pos) {
      const child = node.content.findChildAt(pos);
      if (!child) break;

      path.push({ node: child.node, offset: child.offset });
      pos += child.offset;
      node = child.node;
    }

    return path;
  }

  /**
   * Check if this position is at the start of its parent.
   */
  get isAtStart(): boolean {
    return this.parentOffset === 0;
  }

  /**
   * Check if this position is at the end of its parent.
   */
  get isAtEnd(): boolean {
    return this.parentOffset === this.parent().content.size;
  }
}

/**
 * A slice of document content.
 */
export class Slice {
  readonly content: Fragment;
  readonly openStart: number;
  readonly openEnd: number;

  constructor(content: Fragment, openStart: number, openEnd: number) {
    this.content = content;
    this.openStart = openStart;
    this.openEnd = openEnd;
  }
}
// Placeholder - will be implemented in model/Fragment.ts
