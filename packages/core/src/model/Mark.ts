import { Attrs } from './Node';

/**
 * A mark represents inline formatting like bold, italic, links, etc.
 * Marks can be applied to text nodes and can span multiple characters.
 */
export class Mark {
  readonly type: MarkType;
  readonly attrs: Attrs;

  constructor(type: MarkType, attrs: Attrs = {}) {
    this.type = type;
    this.attrs = attrs;
  }

  /**
   * Create a mark from a MarkType.
   */
  static create(type: MarkType, attrs: Attrs = {}): Mark {
    return new Mark(type, attrs);
  }

  /**
   * Create a mark from JSON representation.
   */
  static fromJSON(schema: any, json: any): Mark {
    const type = schema.marks[json.type];
    if (!type) {
      throw new Error(`Unknown mark type: ${json.type}`);
    }

    const attrs = json.attrs || {};
    return new Mark(type, attrs);
  }

  /**
   * Check if this mark is in a set of marks.
   */
  isInSet(marks: readonly Mark[]): boolean {
    return marks.some(mark => mark.type === this.type && this.attrsEqual(mark.attrs));
  }

  /**
   * Add this mark to a set of marks.
   */
  addToSet(marks: readonly Mark[]): readonly Mark[] {
    // Remove any existing marks of the same type first
    const filtered = marks.filter(mark => mark.type !== this.type);
    
    // Check if this mark excludes any existing marks
    const compatible = filtered.filter(mark => !this.type.excludes(mark.type));
    
    return [...compatible, this];
  }

  /**
   * Remove this mark from a set of marks.
   */
  removeFromSet(marks: readonly Mark[]): readonly Mark[] {
    return marks.filter(mark => !(mark.type === this.type && this.attrsEqual(mark.attrs)));
  }

  /**
   * Remove marks of a specific type from a set.
   */
  static removeFromSet(marks: readonly Mark[], markType: MarkType): readonly Mark[] {
    return marks.filter(mark => mark.type !== markType);
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
   * Check if this mark equals another mark.
   */
  equals(other: Mark): boolean {
    return this.type === other.type && this.attrsEqual(other.attrs);
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

    return result;
  }

  /**
   * Create a string representation for debugging.
   */
  toString(): string {
    const attrs = Object.keys(this.attrs).length > 0
      ? `(${Object.entries(this.attrs).map(([k, v]) => `${k}=${v}`).join(', ')})`
      : '';

    return `<${this.type.name}${attrs}>`;
  }
}

/**
 * Mark type definition with specifications.
 */
export class MarkType {
  readonly name: string;
  readonly spec: MarkSpec;
  readonly schema: any;

  constructor(name: string, spec: MarkSpec, schema: any) {
    this.name = name;
    this.spec = spec;
    this.schema = schema;
  }

  /**
   * Check if this mark type excludes another mark type.
   */
  excludes(other: MarkType): boolean {
    const excludes = this.spec.excludes;
    if (excludes) {
      if (typeof excludes === 'string') {
        return excludes === other.name || excludes === (other.spec.group || '');
      }
      return excludes.includes(other.name) || excludes.includes(other.spec.group || '');
    }
    return false;
  }

  /**
   * Create a mark of this type.
   */
  create(attrs: Attrs = {}): Mark {
    return Mark.create(this, attrs);
  }

  /**
   * Check if this mark is active in a set of marks.
   */
  isInSet(marks: readonly Mark[]): boolean {
    for (const mark of marks) {
      if (mark.type === this) {
        return true;
      }
    }
    return false;
  }
}

/**
 * Specification for a mark type.
 */
export interface MarkSpec {
  attrs?: { [key: string]: AttributeSpec };
  inclusive?: boolean;
  excludes?: string | string[];
  group?: string;
  spanning?: boolean;
  parseDOM?: ParseRule[];
  toDOM?: (mark: Mark) => DOMOutputSpec;
}

/**
 * Specification for a node or mark attribute.
 */
export interface AttributeSpec {
  default?: any;
  validate?: (value: any) => boolean;
}

/**
 * Parse rule for DOM parsing.
 */
export interface ParseRule {
  tag?: string;
  style?: string;
  attrs?: { [key: string]: any };
  getAttrs?: (node: HTMLElement | string) => any | null;
  clearMark?: (mark: Mark) => boolean;
}

/**
 * DOM output specification.
 */
export type DOMOutputSpec = string | [string, ...any[]];