/** What a block of the document is, as an agent sees it. */
export type BlockType = 'heading' | 'paragraph' | 'list-item' | 'quote' | 'code' | 'table-cell' | 'caption' | 'other';

export interface DocBlock {
  /** Short id ("b4") valid for one agent run. */
  id: string;
  type: BlockType;
  /** Heading level 1-6. */
  level?: number;
  /** List items: numbered list. */
  ordered?: boolean;
  text: string;
}

/** A block an agent asks to insert. */
export interface NewBlock {
  type: 'heading' | 'paragraph' | 'list-item' | 'quote';
  text: string;
  level?: number;
}

/** JSON Schema for a tool's arguments (the subset tool-calling APIs accept). */
export interface JsonSchema {
  type: 'object' | 'string' | 'number' | 'integer' | 'boolean' | 'array';
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: Array<string | number>;
  minimum?: number;
  maximum?: number;
  additionalProperties?: boolean;
}

export interface ToolResult {
  text: string;
  isError?: boolean;
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: JsonSchema;
  run(args: Record<string, unknown>): ToolResult | Promise<ToolResult>;
}

/** An error a tool reports back to the model (wrong id, text not found). */
export class AgentToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgentToolError';
  }
}
