/**
 * The document tools an agent calls. They work on a DraftDocument, so the
 * same tools serve the built-in agent, an app's own agent and MCP clients.
 */
import type { DraftDocument } from './draft.js';
import { AgentToolError, type AgentTool, type DocBlock, type NewBlock, type ToolResult } from './types.js';

export interface DocumentToolsOptions {
  /** Longest block text returned by get_document before it is cut (default 2000 characters). */
  maxBlockChars?: number;
  /** Most blocks returned by one get_document call (default 200). */
  maxBlocks?: number;
  /** Called after every edit (for live previews and the MCP commit timer). */
  onEdit?: (tool: string) => void;
}

const describeBlock = (block: DocBlock) =>
  block.type === 'heading' ? `heading ${block.level ?? 2}` : block.type === 'list-item' ? (block.ordered ? 'numbered item' : 'bullet item') : block.type;

function line(block: DocBlock, max: number): string {
  const text = block.text.length > max ? `${block.text.slice(0, max)}… [cut: ${block.text.length} characters]` : block.text;
  return `[${block.id}] ${describeBlock(block)}: ${text.replace(/\n/g, '\\n')}`;
}

const str = (args: Record<string, unknown>, key: string, required = true): string => {
  const value = args[key];
  if (typeof value === 'string') return value;
  if (value === undefined && !required) return '';
  throw new AgentToolError(`"${key}" must be a string.`);
};

const ok = (text: string): ToolResult => ({ text });

function parseBlocks(value: unknown): NewBlock[] {
  if (!Array.isArray(value)) throw new AgentToolError('"blocks" must be an array of { type, text } objects.');
  return value.map((item, index) => {
    if (!item || typeof item !== 'object') throw new AgentToolError(`blocks[${index}] must be an object.`);
    const { type = 'paragraph', text, level } = item as Record<string, unknown>;
    if (typeof text !== 'string') throw new AgentToolError(`blocks[${index}].text must be a string.`);
    return { type: type as NewBlock['type'], text, level: typeof level === 'number' ? level : undefined };
  });
}

export function createDocumentTools(draft: DraftDocument, options: DocumentToolsOptions = {}): AgentTool[] {
  const maxChars = options.maxBlockChars ?? 2000;
  const maxBlocks = options.maxBlocks ?? 200;
  const edited = (tool: string, text: string) => {
    options.onEdit?.(tool);
    return ok(`${text} The user will see this as a suggestion to accept or reject.`);
  };

  return [
    {
      name: 'get_document',
      description:
        'Read the document as a list of blocks (headings, paragraphs, list items, quotes, table cells). Each line starts with the block id in brackets; use these ids with the editing tools. Read the document before editing it.',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'integer', description: 'Index of the first block to return (default 0).', minimum: 0 },
          limit: { type: 'integer', description: `How many blocks to return (default and maximum ${maxBlocks}).`, minimum: 1, maximum: maxBlocks },
        },
      },
      run(args) {
        const blocks = draft.blocks();
        const from = typeof args.from === 'number' ? Math.max(0, Math.floor(args.from)) : 0;
        const limit = typeof args.limit === 'number' ? Math.min(maxBlocks, Math.max(1, Math.floor(args.limit))) : maxBlocks;
        const page = blocks.slice(from, from + limit);
        if (!blocks.length) return ok('The document is empty. Use insert_blocks with after_block_id "start" to add text.');
        const more = from + page.length < blocks.length ? `\n(${blocks.length - from - page.length} more blocks: call again with from=${from + page.length}.)` : '';
        return ok(`${blocks.length} blocks.\n${page.map((block) => line(block, maxChars)).join('\n')}${more}`);
      },
    },
    {
      name: 'get_selection',
      description: 'Get the text the user selected (or the block with the cursor) when they asked for help. Use it when the request says "this", "here" or "the selection".',
      parameters: { type: 'object', properties: {} },
      run() {
        const selection = draft.selection;
        if (!selection || (!selection.text && !selection.blockIds.length)) return ok('Nothing is selected.');
        return ok(`Selected text: ${JSON.stringify(selection.text)}\nIn blocks: ${selection.blockIds.join(', ')}`);
      },
    },
    {
      name: 'search',
      description: 'Find text in the document. Returns the ids of matching blocks with a little context.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Text to find (or a regular expression when regex is true).' },
          regex: { type: 'boolean', description: 'Treat query as a JavaScript regular expression.' },
          case_sensitive: { type: 'boolean', description: 'Match case exactly (default false).' },
        },
        required: ['query'],
      },
      run(args) {
        const query = str(args, 'query');
        if (!query) throw new AgentToolError('"query" must not be empty.');
        let pattern: RegExp;
        try {
          const source = args.regex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          pattern = new RegExp(source, args.case_sensitive ? 'g' : 'gi');
        } catch (error) {
          throw new AgentToolError(`Invalid regular expression: ${(error as Error).message}`);
        }
        const hits: string[] = [];
        let total = 0;
        for (const block of draft.blocks()) {
          for (const match of block.text.matchAll(pattern)) {
            total += 1;
            if (hits.length >= 50) continue;
            const start = Math.max(0, (match.index ?? 0) - 40);
            const end = Math.min(block.text.length, (match.index ?? 0) + match[0].length + 40);
            hits.push(`[${block.id}] …${block.text.slice(start, end).replace(/\n/g, '\\n')}…`);
            if (!match[0].length) break;
          }
        }
        if (!total) return ok(`No matches for ${JSON.stringify(query)}.`);
        return ok(`${total} match${total === 1 ? '' : 'es'}${total > hits.length ? ` (first ${hits.length} shown)` : ''}:\n${hits.join('\n')}`);
      },
    },
    {
      name: 'replace_text',
      description: 'Replace exact text inside one block. Best for small fixes (a word, a phrase, a sentence); formatting of the untouched text is kept.',
      parameters: {
        type: 'object',
        properties: {
          block_id: { type: 'string', description: 'Id from get_document, like "b4".' },
          find: { type: 'string', description: 'Exact text to replace, as it appears in the block.' },
          replace: { type: 'string', description: 'New text (empty to delete the found text).' },
          occurrence: { type: 'integer', description: 'Which match to replace when the text appears more than once (1 = first). Leave out to replace all.', minimum: 1 },
        },
        required: ['block_id', 'find', 'replace'],
      },
      run(args) {
        const id = str(args, 'block_id');
        const find = str(args, 'find');
        const replace = str(args, 'replace', false);
        if (!find) throw new AgentToolError('"find" must not be empty.');
        const block = draft.get(id);
        const parts = block.text.split(find);
        const count = parts.length - 1;
        if (!count) throw new AgentToolError(`${JSON.stringify(find)} is not in ${id}. The block reads: ${JSON.stringify(block.text.slice(0, 300))}`);
        let text: string;
        if (typeof args.occurrence === 'number') {
          const n = Math.floor(args.occurrence);
          if (n < 1 || n > count) throw new AgentToolError(`${id} has ${count} match${count === 1 ? '' : 'es'}; occurrence ${n} does not exist.`);
          text = parts.slice(0, n).join(find) + replace + parts.slice(n).join(find);
        } else text = parts.join(replace);
        draft.rewrite(id, text);
        return edited('replace_text', `Replaced ${typeof args.occurrence === 'number' ? '1' : count} occurrence${count === 1 || typeof args.occurrence === 'number' ? '' : 's'} in ${id}.`);
      },
    },
    {
      name: 'rewrite_block',
      description: 'Replace the whole text of one block. Use for rewording a paragraph or heading; only the changed words become suggestions.',
      parameters: {
        type: 'object',
        properties: {
          block_id: { type: 'string', description: 'Id from get_document.' },
          text: { type: 'string', description: 'The complete new text of the block (plain text; "\\n" for a line break).' },
        },
        required: ['block_id', 'text'],
      },
      run(args) {
        const id = str(args, 'block_id');
        const text = str(args, 'text');
        if (!text.trim()) throw new AgentToolError('The new text is empty; use delete_blocks to remove a block.');
        draft.rewrite(id, text);
        return edited('rewrite_block', `Rewrote ${id}.`);
      },
    },
    {
      name: 'insert_blocks',
      description: 'Insert new blocks after a block (or at the start of the document). Each block is a paragraph, heading (with level 1-6), list-item or quote.',
      parameters: {
        type: 'object',
        properties: {
          after_block_id: { type: 'string', description: 'Id of the block to insert after, or "start".' },
          blocks: {
            type: 'array',
            description: 'Blocks to insert, in order.',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['paragraph', 'heading', 'list-item', 'quote'] },
                text: { type: 'string' },
                level: { type: 'integer', minimum: 1, maximum: 6, description: 'Heading level.' },
              },
              required: ['type', 'text'],
            },
          },
        },
        required: ['after_block_id', 'blocks'],
      },
      run(args) {
        const after = str(args, 'after_block_id');
        const ids = draft.insert(after === 'start' ? null : after, parseBlocks(args.blocks));
        return edited('insert_blocks', `Inserted ${ids.length} block${ids.length === 1 ? '' : 's'}: ${ids.join(', ')}.`);
      },
    },
    {
      name: 'delete_blocks',
      description: 'Delete whole blocks.',
      parameters: {
        type: 'object',
        properties: { block_ids: { type: 'array', items: { type: 'string' }, description: 'Ids to delete.' } },
        required: ['block_ids'],
      },
      run(args) {
        const ids = args.block_ids;
        if (!Array.isArray(ids) || !ids.length || ids.some((id) => typeof id !== 'string')) throw new AgentToolError('"block_ids" must be a non-empty array of ids.');
        draft.remove(ids as string[]);
        return edited('delete_blocks', `Deleted ${ids.join(', ')}.`);
      },
    },
  ];
}

/** Run a tool by name, turning thrown errors into an error result for the model. */
export async function callTool(tools: AgentTool[], name: string, args: Record<string, unknown>): Promise<ToolResult> {
  const tool = tools.find((candidate) => candidate.name === name);
  if (!tool) return { text: `Error: there is no tool "${name}". Available: ${tools.map((t) => t.name).join(', ')}.`, isError: true };
  if (args && typeof args.__invalid_arguments === 'string') {
    return { text: `Error: the arguments for ${name} were not valid JSON: ${args.__invalid_arguments.slice(0, 200)}`, isError: true };
  }
  try {
    return await tool.run(args ?? {});
  } catch (error) {
    if (error instanceof AgentToolError) return { text: `Error: ${error.message}`, isError: true };
    return { text: `Error: ${(error as Error)?.message ?? String(error)}`, isError: true };
  }
}
