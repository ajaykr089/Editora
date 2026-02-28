export interface NodeSpec {
  content?: string;
  marks?: string;
  group?: string;
  inline?: boolean;
  attrs?: Record<string, any>;
  toDOM?: (node: Node) => [string, (Record<string, any> | number | undefined)?, ...any[]];
  parseDOM?: Array<{
    tag: string;
    style?: string;
    getAttrs?: (dom: HTMLElement) => Record<string, any> | null | false;
  }>;
}

export interface Node {
  type: string;
  content?: Node[];
  text?: string;
  marks?: string[];
  attrs?: Record<string, any>;
}

export class Schema {
  nodes: Map<string, NodeSpec>;
  marks: Map<string, NodeSpec>;

  constructor(nodes: Record<string, NodeSpec>, marks: Record<string, NodeSpec>) {
    this.nodes = new Map(Object.entries(nodes));
    this.marks = new Map(Object.entries(marks));
  }

  node(type: string, attrs?: Record<string, any>, content?: Node[]): Node {
    return { type, attrs, content };
  }

  text(text: string, marks?: string[]): Node {
    return { type: 'text', text, marks };
  }
}
