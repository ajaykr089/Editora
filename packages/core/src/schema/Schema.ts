import { NodeType, NodeSpec } from '../model/Node';
import { MarkType, MarkSpec, Mark } from '../model/Mark';

/**
 * Schema defines the structure and types allowed in a document.
 * It contains specifications for all node and mark types.
 */
export class Schema {
  readonly nodes: Record<string, NodeType>;
  readonly marks: Record<string, MarkType>;
  readonly spec: SchemaSpec;

  constructor(spec: SchemaSpec) {
    this.spec = spec;
    this.nodes = this.createNodeTypes(spec.nodes);
    this.marks = this.createMarkTypes(spec.marks, this);
  }

  /**
   * Create node types from specifications.
   */
  private createNodeTypes(nodeSpecs: Record<string, NodeSpec>): Record<string, NodeType> {
    const nodes: Record<string, NodeType> = {};

    for (const [name, spec] of Object.entries(nodeSpecs)) {
      nodes[name] = new NodeType(name, spec, this);
    }

    return nodes;
  }

  /**
   * Create mark types from specifications.
   */
  private createMarkTypes(markSpecs: Record<string, MarkSpec>, schema: Schema): Record<string, MarkType> {
    const marks: Record<string, MarkType> = {};

    for (const [name, spec] of Object.entries(markSpecs)) {
      marks[name] = new MarkType(name, spec, schema);
    }

    return marks;
  }

  /**
   * Check if a node type is allowed as a child of another node type.
   */
  allowsNodeType(parentType: NodeType, childType: NodeType): boolean {
    const content = parentType.spec.content;
    if (!content) return false;

    // Parse content expression (simplified)
    // This would need more sophisticated parsing for complex expressions
    const allowedTypes = content.split(/\s+/);
    return allowedTypes.some(type => {
      if (type === 'text') return childType.isText;
      if (type === 'inline') return childType.isInline;
      if (type === 'block') return childType.isBlock;
      return childType.name === type;
    });
  }

  /**
   * Get the text node type.
   */
  get text(): NodeType {
    return this.nodes.text;
  }

  /**
   * Get the document node type.
   */
  get doc(): NodeType {
    return this.nodes.doc;
  }

  /**
   * Get the paragraph node type.
   */
  get paragraph(): NodeType {
    return this.nodes.paragraph;
  }

  /**
   * Convert to JSON representation.
   */
  toJSON(): SchemaSpec {
    return this.spec;
  }
}

/**
 * Specification for a complete schema.
 */
export interface SchemaSpec {
  nodes: Record<string, NodeSpec>;
  marks: Record<string, MarkSpec>;
  topNode?: string;
}

/**
 * Enhanced default schema with comprehensive node and mark types.
 */
export const defaultSchema = new Schema({
  nodes: {
    doc: {
      content: 'block+'
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM: () => ['p', 0]
    },
    heading: {
      attrs: {
        level: { default: 1, validate: (value: number) => value >= 1 && value <= 6 }
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
        { tag: 'h4', attrs: { level: 4 } },
        { tag: 'h5', attrs: { level: 5 } },
        { tag: 'h6', attrs: { level: 6 } }
      ],
      toDOM: (node) => [`h${node.attrs.level}`, 0]
    },
    blockquote: {
      content: 'block+',
      group: 'block',
      defining: true,
      parseDOM: [{ tag: 'blockquote' }],
      toDOM: () => ['blockquote', 0]
    },
    code_block: {
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      attrs: {
        language: { default: null }
      },
      parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
      toDOM: () => ['pre', ['code', 0]]
    },
    horizontal_rule: {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM: () => ['hr']
    },
    bullet_list: {
      content: 'list_item+',
      group: 'block',
      parseDOM: [{ tag: 'ul' }],
      toDOM: () => ['ul', 0]
    },
    ordered_list: {
      content: 'list_item+',
      group: 'block',
      attrs: {
        order: { default: 1 }
      },
      parseDOM: [{ tag: 'ol', getAttrs: (dom: any) => ({ order: dom.hasAttribute('start') ? +dom.getAttribute('start') : 1 }) }],
      toDOM: (node) => node.attrs.order === 1 ? ['ol', 0] : ['ol', { start: node.attrs.order }, 0]
    },
    list_item: {
      content: 'paragraph block*',
      parseDOM: [{ tag: 'li' }],
      toDOM: () => ['li', 0],
      defining: true
    },
    table: {
      content: 'table_row+',
      group: 'block',
      isolating: true,
      parseDOM: [{ tag: 'table' }],
      toDOM: () => ['table', ['tbody', 0]]
    },
    table_row: {
      content: 'table_cell+',
      parseDOM: [{ tag: 'tr' }],
      toDOM: () => ['tr', 0]
    },
    table_cell: {
      content: 'block+',
      attrs: {
        colspan: { default: 1 },
        rowspan: { default: 1 },
        colwidth: { default: null }
      },
      isolating: true,
      parseDOM: [{ tag: 'td' }, { tag: 'th' }],
      toDOM: (node) => {
        const attrs: any = {};
        if (node.attrs.colspan !== 1) attrs.colspan = node.attrs.colspan;
        if (node.attrs.rowspan !== 1) attrs.rowspan = node.attrs.rowspan;
        if (node.attrs.colwidth) attrs.style = `width: ${node.attrs.colwidth.join(', ')}px`;
        return ['td', attrs, 0];
      }
    },
    hard_break: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM: () => ['br']
    },
    image: {
      inline: true,
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null },
        width: { default: null },
        height: { default: null }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [{
        tag: 'img[src]',
        getAttrs: (dom: any) => ({
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt'),
          width: dom.getAttribute('width'),
          height: dom.getAttribute('height')
        })
      }],
      toDOM: (node) => ['img', node.attrs]
    },
    text: {
      group: 'inline',
      isText: true
    }
  },
  marks: {
    bold: {
      parseDOM: [
        { tag: 'strong' },
        { tag: 'b', getAttrs: (node: HTMLElement | string) => typeof node === 'string' ? null : node.style.fontWeight !== 'normal' && null },
        { style: 'font-weight=400', clearMark: (m: Mark) => m.type.name === 'strong' },
        { style: 'font-weight', getAttrs: (value: string | HTMLElement) => typeof value === 'string' && /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null }
      ],
      toDOM: () => ['strong', 0]
    },
    italic: {
      parseDOM: [
        { tag: 'i' },
        { tag: 'em' },
        { style: 'font-style=italic' }
      ],
      toDOM: () => ['em', 0]
    },
    underline: {
      parseDOM: [
        { tag: 'u' },
        { style: 'text-decoration=underline' }
      ],
      toDOM: () => ['u', 0]
    },
    strikethrough: {
      parseDOM: [
        { tag: 's' },
        { tag: 'strike' },
        { style: 'text-decoration=line-through' }
      ],
      toDOM: () => ['s', 0]
    },
    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM: () => ['code', 0]
    },
    link: {
      attrs: {
        href: {},
        title: { default: null },
        target: { default: null }
      },
      inclusive: false,
      parseDOM: [{
        tag: 'a[href]',
        getAttrs: (dom: any) => ({
          href: dom.getAttribute('href'),
          title: dom.getAttribute('title'),
          target: dom.getAttribute('target')
        })
      }],
      toDOM: (node) => ['a', node.attrs, 0]
    },
    subscript: {
      parseDOM: [{ tag: 'sub' }],
      toDOM: () => ['sub', 0],
      excludes: 'superscript'
    },
    superscript: {
      parseDOM: [{ tag: 'sup' }],
      toDOM: () => ['sup', 0],
      excludes: 'subscript'
    },
    highlight: {
      attrs: {
        color: { default: 'yellow' }
      },
      parseDOM: [{
        tag: 'mark',
        getAttrs: (dom: any) => ({ color: dom.style.backgroundColor || 'yellow' })
      }],
      toDOM: (node) => ['mark', { style: `background-color: ${node.attrs.color}` }, 0]
    }
  }
});