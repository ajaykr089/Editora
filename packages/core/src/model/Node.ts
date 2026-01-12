import { Fragment } from './Fragment';
import { Mark, MarkType } from './Mark';
import { Attrs, AttributeSpec, ParseRule, DOMOutputSpec } from './types';

// Re-export types from types.ts
export type { Attrs, AttributeSpec, ParseRule, DOMOutputSpec };

/**
 * A node in the document tree.
 * Nodes can be either block nodes (like paragraphs, headings) or inline nodes (like text).
 */
export class Node {
  readonly type: NodeType;
  readonly attrs: Attrs;
  readonly content: Fragment;
  readonly marks: readonly Mark[];

  constructor(type: NodeType, attrs: Attrs = {}, content?: Fragment, marks: readonly Mark[] = []) {
    this.type = type;
    this.attrs = attrs;
    this.content = content || Fragment.from([]);
    this.marks = marks;

    // Validate node structure
    this.validate();
  }

  /**
   * Create a node from a NodeType.
   */
  static create(type: NodeType, attrs: Attrs = {}, content?: Fragment, marks: readonly Mark[] = []): Node {
    return new Node(type, attrs, content, marks);
  }

  /**
   * Create a text node.
   */
  static text(text: string, marks: readonly Mark[] = []): Node {
    // This requires access to schema, so we'll create a simple implementation
    const textNode = new Node(
      { name: 'text', isText: true } as any, // Simplified NodeType
      { text },
      undefined,
      marks
    );
    return textNode;
  }

  /**
   * Create a node from JSON representation.
   */
  static fromJSON(schema: any, json: any): Node {
    const type = schema.nodes[json.type];
    if (!type) {
      throw new Error(`Unknown node type: ${json.type}`);
    }

    const attrs = json.attrs || {};
    const content = json.content ? Fragment.fromJSON(schema, json.content) : undefined;
    const marks = (json.marks || []).map((markJSON: any) => Mark.fromJSON(schema, markJSON));

    return new Node(type, attrs, content, marks);
  }

  /**
   * Validate that this node conforms to its type specification.
   */
  private validate(): void {
    // Basic validation - more comprehensive validation would be implemented
    if (this.type.isBlock && this.content.size === 0 && !this.type.spec.content?.includes('empty')) {
      // Allow empty blocks for now
    }
  }

  /**
   * Check if this is a block node.
   */
  get isBlock(): boolean {
    return this.type.isBlock;
  }

  /**
   * Check if this is an inline node.
   */
  get isInline(): boolean {
    return this.type.isInline;
  }

  /**
   * Check if this is a text node.
   */
  get isText(): boolean {
    return this.type.isText;
  }

  /**
   * Check if this is a leaf node (has no content).
   */
  get isLeaf(): boolean {
    return this.content.childCount === 0;
  }

  /**
   * Replace content in a range with new content.
   */
  replace(from: number, to: number, replacement: Fragment): Node {
    if (this.isText) {
      const text = this.attrs.text || '';
      const before = text.slice(0, from);
      const after = text.slice(to);
      const newText = before + replacement.textContent + after;
      return this.withText(newText);
    }

    const newContent = this.content.replace(from, to, replacement);
    return this.withContent(newContent);
  }

  /**
   * Get the text content of the entire document.
   */
  get textContent(): string {
    if (this.isText) {
      return this.attrs.text || '';
    }

    let text = '';
    this.content.children.forEach(child => {
      text += child.textContent;
    });
    return text;
  }

  /**
   * Get the size of this node in the document.
   */
  get nodeSize(): number {
    if (this.isText) {
      return (this.attrs.text || '').length;
    }
    return 1 + this.content.size;
  }

  /**
   * Create a new node with different attributes.
   */
  withAttrs(attrs: Attrs): Node {
    return new Node(this.type, { ...this.attrs, ...attrs }, this.content, this.marks);
  }

  /**
   * Create a new node with different content.
   */
  withContent(content: Fragment): Node {
    return new Node(this.type, this.attrs, content, this.marks);
  }

  /**
   * Create a new node with different marks.
   */
  withMarks(marks: readonly Mark[]): Node {
    return new Node(this.type, this.attrs, this.content, marks);
  }

  /**
   * Create a new text node with different text.
   */
  withText(text: string): Node {
    if (!this.isText) {
      throw new Error('Can only set text on text nodes');
    }
    return new Node(this.type, { ...this.attrs, text }, this.content, this.marks);
  }

  /**
   * Create a slice of this node's content.
   */
  slice(from: number, to?: number): Fragment {
    // For text nodes, return a fragment with the sliced text
    if (this.isText) {
      const text = this.attrs.text || '';
      const actualTo = to ?? text.length;
      const slicedText = text.slice(from, actualTo);
      if (slicedText) {
        return Fragment.from([this.withText(slicedText)]);
      }
      return Fragment.from([]);
    }

    // For complex nodes, this would need more sophisticated slicing
    // For now, return the entire content
    return this.content;
  }

  /**
   * Cut out a slice of this node.
   */
  cut(from: number, to?: number): Node | null {
    if (this.isText) {
      const text = this.attrs.text || '';
      const actualTo = to ?? text.length;
      if (from === 0 && actualTo === text.length) {
        return this;
      }
      const cutText = text.slice(from, actualTo);
      return cutText ? this.withText(cutText) : null;
    }

    // For non-text nodes, cutting is more complex
    // This is a simplified implementation
    if (from === 0 && (to === undefined || to >= this.nodeSize)) {
      return this;
    }

    // For now, return null for partial cuts of complex nodes
    return null;
  }

  /**
   * Get the node at a specific position within this node.
   */
  nodeAt(pos: number): Node | null {
    if (pos === 0) {
      return this;
    }

    if (this.isText) {
      return pos <= (this.attrs.text || '').length ? this : null;
    }

    const child = this.content.findChildAt(pos - 1);
    if (child) {
      return child.node.nodeAt(pos - 1 - child.offset);
    }

    return null;
  }

  /**
   * Iterate over nodes between two positions.
   */
  nodesBetween(from: number, to: number, callback: (node: Node, pos: number, parent: Node | null) => void | boolean, startPos = 0): void {
    if (this.isText) {
      callback(this, startPos, null);
      return;
    }

    let pos = startPos;
    this.content.children.forEach((child, index) => {
      const childStart = pos + 1;
      const childEnd = childStart + child.nodeSize;

      if (childEnd > from && childStart < to) {
        const result = callback(child, childStart, this);
        if (result !== false && !child.isText) {
          child.nodesBetween(
            Math.max(0, from - childStart),
            Math.min(child.nodeSize, to - childStart),
            callback,
            childStart
          );
        }
      }

      pos = childEnd;
    });
  }

  /**
   * Check if this node has a mark in the given range.
   */
  rangeHasMark(from: number, to: number, markType: MarkType): boolean {
    if (this.isText) {
      return this.marks.some(mark => mark.type === markType);
    }

    // Check if ALL text nodes in the range have the mark
    let hasAnyText = false;
    let allHaveMark = true;
    let pos = 1;
    
    for (const child of this.content.children) {
      const childStart = pos;
      const childEnd = pos + child.nodeSize;
      
      if (child.isText && childEnd > from && childStart < to) {
        hasAnyText = true;
        if (!child.marks.some(mark => mark.type === markType)) {
          allHaveMark = false;
          break;
        }
      } else if (!child.isText && childEnd > from && childStart < to) {
        const childHasMark = child.rangeHasMark(
          Math.max(0, from - childStart),
          Math.min(child.nodeSize, to - childStart),
          markType
        );
        if (childHasMark) {
          hasAnyText = true;
        } else {
          allHaveMark = false;
          break;
        }
      }
      
      pos = childEnd;
    }

    return hasAnyText && allHaveMark;
  }

  /**
   * Remove a mark from a range in this node.
   */
  removeMark(from: number, to: number, markType: MarkType): Node {
    if (this.isText) {
      const newMarks = this.marks.filter(mark => mark.type !== markType);
      return this.withMarks(newMarks);
    }

    const newChildren: Node[] = [];
    let pos = 1;
    
    this.content.children.forEach(child => {
      const childStart = pos;
      const childEnd = pos + child.nodeSize;
      
      if (child.isText && childEnd > from && childStart < to) {
        const text = child.attrs.text || '';
        const textStart = Math.max(0, from - childStart);
        const textEnd = Math.min(text.length, to - childStart + 1);
        
        if (textStart > 0) {
          newChildren.push(child.withText(text.slice(0, textStart)));
        }
        
        const selectedText = text.slice(textStart, textEnd);
        if (selectedText) {
          const unmarkedNode = child.withText(selectedText).withMarks(
            child.marks.filter(mark => mark.type !== markType)
          );
          newChildren.push(unmarkedNode);
        }
        
        if (textEnd < text.length) {
          newChildren.push(child.withText(text.slice(textEnd)));
        }
      } else if (!child.isText && childEnd > from && childStart < to) {
        newChildren.push(child.removeMark(
          Math.max(0, from - childStart),
          Math.min(child.nodeSize, to - childStart),
          markType
        ));
      } else {
        newChildren.push(child);
      }
      
      pos = childEnd;
    });
    
    return this.withContent(Fragment.from(newChildren));
  }

  /**
   * Add a mark to a range in this node.
   */
  addMark(from: number, to: number, mark: Mark): Node {
    if (this.isText) {
      const newMarks = mark.addToSet(this.marks);
      return this.withMarks(newMarks);
    }

    const newChildren: Node[] = [];
    let pos = 1;
    
    this.content.children.forEach((child, idx) => {
      const childStart = pos;
      const childEnd = pos + child.nodeSize;
      
      if (child.isText && childEnd > from && childStart < to) {
        const text = child.attrs.text || '';
        const textStart = Math.max(0, from - childStart);
        const textEnd = Math.min(text.length, to - childStart + 1);
        
        if (textStart > 0) {
          newChildren.push(child.withText(text.slice(0, textStart)));
        }
        
        const selectedText = text.slice(textStart, textEnd);
        if (selectedText) {
          const markedNode = child.withText(selectedText).withMarks(mark.addToSet(child.marks));
          newChildren.push(markedNode);
        }
        
        if (textEnd < text.length) {
          newChildren.push(child.withText(text.slice(textEnd)));
        }
      } else if (!child.isText && childEnd > from && childStart < to) {
        newChildren.push(child.addMark(
          Math.max(0, from - childStart),
          Math.min(child.nodeSize, to - childStart),
          mark
        ));
      } else {
        newChildren.push(child);
      }
      
      pos = childEnd;
    });
    
    return this.withContent(Fragment.from(newChildren));
  }

  /**
   * Check if this node can be joined with another node.
   */
  canJoin(other: Node): boolean {
    return this.type === other.type && this.type.spec.content === other.type.spec.content;
  }

  /**
   * Join this node with another compatible node.
   */
  join(other: Node): Node {
    if (!this.canJoin(other)) {
      throw new Error('Cannot join incompatible nodes');
    }

    if (this.isText && other.isText) {
      return this.withText(this.textContent + other.textContent);
    }

    return this.withContent(this.content.appendFragment(other.content));
  }

  /**
   * Check if this node equals another node.
   */
  equals(other: Node): boolean {
    if (this.type !== other.type) {
      return false;
    }

    if (!this.attrsEqual(other.attrs)) {
      return false;
    }

    if (!this.content.equals(other.content)) {
      return false;
    }

    if (this.marks.length !== other.marks.length) {
      return false;
    }

    for (let i = 0; i < this.marks.length; i++) {
      if (!this.marks[i].equals(other.marks[i])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if attributes are equal.
   */
  private attrsEqual(otherAttrs: Attrs): boolean {
    const keys1 = Object.keys(this.attrs);
    const keys2 = Object.keys(otherAttrs);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (this.attrs[key] !== otherAttrs[key]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Convert to JSON representation.
   */
  toJSON(): any {
    const result: any = {
      type: this.type.name,
    };

    if (Object.keys(this.attrs).length > 0) {
      result.attrs = this.attrs;
    }

    if (!this.content.equals(Fragment.from([]))) {
      result.content = this.content.toJSON();
    }

    if (this.marks.length > 0) {
      result.marks = this.marks.map(mark => mark.toJSON());
    }

    return result;
  }

  /**
   * Create a string representation for debugging.
   */
  toString(): string {
    if (this.isText) {
      return this.attrs.text || '';
    }

    const attrs = Object.keys(this.attrs).length > 0
      ? `(${Object.entries(this.attrs).map(([k, v]) => `${k}=${v}`).join(', ')})`
      : '';

    if (this.isLeaf) {
      return `<${this.type.name}${attrs} />`;
    }

    const content = this.content.toString();
    return `<${this.type.name}${attrs}>${content}</${this.type.name}>`;
  }

  // Placeholder for schema - will be set by the schema system
  private static schema: any = null;
}

/**
 * Node type definition with specifications.
 */
export class NodeType {
  readonly name: string;
  readonly spec: NodeSpec;
  readonly schema: any;

  constructor(name: string, spec: NodeSpec, schema: any) {
    this.name = name;
    this.spec = spec;
    this.schema = schema;
  }

  /**
   * Check if this is a block node type.
   */
  get isBlock(): boolean {
    return !this.spec.inline && !this.spec.isText;
  }

  /**
   * Check if this is an inline node type.
   */
  get isInline(): boolean {
    return !!this.spec.inline;
  }

  /**
   * Check if this is a text node type.
   */
  get isText(): boolean {
    return !!this.spec.isText;
  }

  /**
   * Create a node of this type.
   */
  create(attrs: Attrs = {}, content?: Fragment, marks: readonly Mark[] = []): Node {
    return Node.create(this, attrs, content, marks);
  }
}

/**
 * Specification for a node type.
 */
export interface NodeSpec {
  content?: string;
  attrs?: { [key: string]: AttributeSpec };
  group?: string;
  inline?: boolean;
  isText?: boolean;
  selectable?: boolean;
  draggable?: boolean;
  code?: boolean;
  whitespace?: 'pre' | 'normal';
  defining?: boolean;
  parseDOM?: ParseRule[];
  toDOM?: (node: Node) => DOMOutputSpec;
}
// Types are imported from types.ts
