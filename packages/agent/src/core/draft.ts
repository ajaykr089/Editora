/**
 * The document as an agent run sees it: the blocks read at the start, with
 * the run's edits applied in memory. Nothing touches the page until the
 * draft is committed as suggestions, so a run can be stopped at any point.
 */
import { AgentToolError, type BlockType, type DocBlock, type NewBlock } from './types.js';

export interface DraftBlock extends DocBlock {
  /** Text when the run started; undefined for a block the run inserted. */
  original?: string;
  deleted: boolean;
  /** Inserted blocks: the original block they follow (null: start of the document). */
  after?: string | null;
}

export interface DraftChanges {
  rewritten: Array<{ id: string; from: string; to: string }>;
  deleted: string[];
  inserted: Array<{ id: string; after: string | null; block: NewBlock }>;
}

export interface Selection {
  text: string;
  blockIds: string[];
}

const NEW_TYPES = new Set<BlockType>(['heading', 'paragraph', 'list-item', 'quote']);

export class DraftDocument {
  private list: DraftBlock[];
  private nextId: number;
  readonly selection: Selection | null;

  constructor(blocks: DocBlock[], selection: Selection | null = null) {
    this.list = blocks.map((block) => ({ ...block, original: block.text, deleted: false }));
    this.nextId = blocks.length + 1;
    this.selection = selection;
  }

  /** Blocks as they are now, deleted ones left out. */
  blocks(): DocBlock[] {
    return this.list.filter((block) => !block.deleted).map(({ id, type, level, ordered, text }) => ({ id, type, level, ordered, text }));
  }

  get(id: string): DraftBlock {
    const block = this.list.find((candidate) => candidate.id === id);
    if (!block) throw new AgentToolError(`There is no block "${id}". Call get_document to see the current ids.`);
    if (block.deleted) throw new AgentToolError(`Block "${id}" was deleted in this run.`);
    return block;
  }

  rewrite(id: string, text: string): void {
    const block = this.get(id);
    block.text = clean(text);
  }

  /** Insert after `afterId` (or at the start for null); returns the new ids. */
  insert(afterId: string | null, blocks: NewBlock[]): string[] {
    if (!blocks.length) throw new AgentToolError('Give at least one block to insert.');
    let index = afterId === null ? -1 : this.list.indexOf(this.get(afterId));
    // An insert after a block the run itself inserted belongs to that block's anchor.
    const anchor = afterId === null ? null : (this.list[index].original === undefined ? this.list[index].after ?? null : afterId);
    const ids: string[] = [];
    for (const block of blocks) {
      if (!NEW_TYPES.has(block.type)) throw new AgentToolError(`Cannot insert a "${block.type}" block; use heading, paragraph, list-item or quote.`);
      const level = block.type === 'heading' ? Math.min(6, Math.max(1, Math.round(block.level ?? 2))) : undefined;
      const id = `b${this.nextId++}`;
      const entry: DraftBlock = { id, type: block.type, level, text: clean(block.text), deleted: false, after: anchor };
      this.list.splice(index + 1, 0, entry);
      index += 1;
      ids.push(id);
    }
    return ids;
  }

  remove(ids: string[]): void {
    const blocks = ids.map((id) => this.get(id));
    for (const block of blocks) {
      if (block.original === undefined) this.list.splice(this.list.indexOf(block), 1);
      else block.deleted = true;
    }
  }

  /** Every block in document order, deleted and inserted ones included. */
  entries(): readonly DraftBlock[] {
    return this.list.map((block) => ({ ...block }));
  }

  /** What the run changed, in document order. */
  changes(): DraftChanges {
    const rewritten: DraftChanges['rewritten'] = [];
    const deleted: string[] = [];
    const inserted: DraftChanges['inserted'] = [];
    for (const block of this.list) {
      if (block.original === undefined) {
        inserted.push({ id: block.id, after: block.after ?? null, block: { type: block.type as NewBlock['type'], text: block.text, level: block.level } });
      } else if (block.deleted) deleted.push(block.id);
      else if (block.text !== block.original) rewritten.push({ id: block.id, from: block.original, to: block.text });
    }
    return { rewritten, deleted, inserted };
  }

  get changeCount(): number {
    const { rewritten, deleted, inserted } = this.changes();
    return rewritten.length + deleted.length + inserted.length;
  }
}

/** Models sometimes send Windows newlines or a trailing newline. */
function clean(text: string): string {
  if (typeof text !== 'string') throw new AgentToolError('Text must be a string.');
  return text.replace(/\r\n?/g, '\n').replace(/\n+$/g, '');
}
