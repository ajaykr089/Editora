import { applyChanges, diffText, diffTokens, opsToChanges, tokenize, type TextChange } from './diff';

export type HunkStatus = 'pending' | 'accepted' | 'rejected';

/**
 * One reviewable suggestion.
 *
 * `inline` hunks change `blocks[block].slice(start, end)` into `inserted`.
 * A `blocks` hunk replaces every original block with `insertedBlocks`; it is
 * used when the model changed the number of paragraphs, so per-paragraph
 * changes cannot be lined up.
 */
export interface ReviewHunk extends TextChange {
  id: string;
  kind: 'inline' | 'blocks';
  block: number;
  status: HunkStatus;
  /** Still being written by the model; it may change and cannot be resolved yet. */
  provisional: boolean;
  insertedBlocks?: string[];
}

export interface ReviewSnapshot {
  original: string[];
  proposal: string;
  hunks: ReviewHunk[];
  streaming: boolean;
  /** The model's paragraphs did not line up with the original ones. */
  structureChanged: boolean;
}

export type ReviewListener = (snapshot: ReviewSnapshot) => void;

export interface ReviewOptions {
  /** Cap on the word-level edit distance before a block is suggested as one replacement. */
  maxEditDistance?: number;
}

const BLOCK_SEPARATOR = /\n(?:[ \t]*\n)+/;

/** Split model output into paragraphs (blank-line separated). */
export function splitBlocks(text: string): string[] {
  const trimmed = text.replace(/\r\n?/g, '\n').replace(/^\n+|\s+$/g, '');
  return trimmed ? trimmed.split(BLOCK_SEPARATOR) : [];
}

/**
 * Review state for one AI rewrite of a list of blocks (paragraphs, list items,
 * headings). Feed it the model output as it streams with `update`, call
 * `finish` when the stream ends, then accept or reject hunks.
 */
export class AIReview {
  readonly original: string[];
  private proposal = '';
  private streaming = true;
  private structureChanged = false;
  private hunkList: ReviewHunk[] = [];
  private decisions = new Map<string, HunkStatus>();
  private listeners = new Set<ReviewListener>();
  private readonly maxEditDistance?: number;

  constructor(original: string[] | string, options: ReviewOptions = {}) {
    this.original = typeof original === 'string' ? splitBlocks(original) : original.slice();
    this.maxEditDistance = options.maxEditDistance;
  }

  get hunks(): readonly ReviewHunk[] {
    return this.hunkList;
  }

  get isStreaming(): boolean {
    return this.streaming;
  }

  get pendingCount(): number {
    return this.hunkList.filter((hunk) => hunk.status === 'pending').length;
  }

  snapshot(): ReviewSnapshot {
    return {
      original: this.original.slice(),
      proposal: this.proposal,
      hunks: this.hunkList.map((hunk) => ({ ...hunk })),
      streaming: this.streaming,
      structureChanged: this.structureChanged,
    };
  }

  subscribe(listener: ReviewListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Replace the proposal with the model output received so far. */
  update(proposal: string): void {
    if (!this.streaming) throw new Error('AIReview: update() called after finish()');
    this.proposal = proposal;
    this.recompute();
  }

  /** The model finished; `proposal` is its complete output if given. */
  finish(proposal: string = this.proposal): void {
    this.proposal = proposal;
    this.streaming = false;
    this.recompute();
  }

  accept(id: string): boolean {
    return this.decide(id, 'accepted');
  }

  reject(id: string): boolean {
    return this.decide(id, 'rejected');
  }

  acceptAll(): number {
    return this.decideAll('accepted');
  }

  rejectAll(): number {
    return this.decideAll('rejected');
  }

  /** Blocks with accepted hunks applied; pending ones count as rejected unless `pendingAs` says otherwise. */
  resolve(pendingAs: 'accepted' | 'rejected' = 'rejected'): string[] {
    const applies = (hunk: ReviewHunk) =>
      !hunk.provisional && (hunk.status === 'accepted' || (hunk.status === 'pending' && pendingAs === 'accepted'));

    const replacement = this.hunkList.find((hunk) => hunk.kind === 'blocks');
    if (replacement) return applies(replacement) ? replacement.insertedBlocks!.slice() : this.original.slice();

    return this.original.map((text, block) =>
      applyChanges(
        text,
        this.hunkList.filter((hunk) => hunk.block === block && applies(hunk)),
      ),
    );
  }

  private decide(id: string, status: HunkStatus): boolean {
    const hunk = this.hunkList.find((candidate) => candidate.id === id);
    if (!hunk || hunk.provisional || hunk.status === status) return false;
    hunk.status = status;
    this.decisions.set(id, status);
    this.emit();
    return true;
  }

  private decideAll(status: HunkStatus): number {
    let count = 0;
    for (const hunk of this.hunkList) {
      if (hunk.provisional || hunk.status !== 'pending') continue;
      hunk.status = status;
      this.decisions.set(hunk.id, status);
      count += 1;
    }
    if (count > 0) this.emit();
    return count;
  }

  private recompute(): void {
    const proposed = splitBlocks(this.proposal);
    // While streaming, the last proposed block may be cut mid-word.
    const complete = this.streaming ? Math.max(0, proposed.length - 1) : proposed.length;
    const hunks: ReviewHunk[] = [];

    this.structureChanged = this.streaming
      ? complete > this.original.length
      : proposed.length !== this.original.length;

    if (this.structureChanged) {
      if (!this.streaming) hunks.push(this.blockReplacement(proposed));
      this.hunkList = hunks;
      this.emit();
      return;
    }

    for (let block = 0; block < proposed.length && block < this.original.length; block += 1) {
      const partial = block >= complete;
      const changes = partial
        ? this.diffPrefix(this.original[block], proposed[block])
        : diffText(this.original[block], proposed[block], this.maxEditDistance) ?? [
            { start: 0, end: this.original[block].length, deleted: this.original[block], inserted: proposed[block] },
          ];

      for (const change of changes) {
        hunks.push(this.makeHunk({ ...change, kind: 'inline', block, provisional: partial }));
      }
    }

    this.hunkList = hunks;
    this.emit();
  }

  /**
   * Diff a block the model is still writing: the original text past the end
   * of the partial output has not been reached yet, so a trailing deletion is
   * not a suggestion, and the last change may still grow.
   */
  private diffPrefix(original: string, partial: string): TextChange[] {
    const ops = diffTokens(tokenize(original), tokenize(partial), this.maxEditDistance);
    if (!ops) return [];
    while (ops.length > 0 && ops[ops.length - 1].type === 'delete') ops.pop();
    return opsToChanges(ops);
  }

  private blockReplacement(proposed: string[]): ReviewHunk {
    const deleted = this.original.join('\n\n');
    return this.makeHunk({
      kind: 'blocks',
      block: 0,
      start: 0,
      end: deleted.length,
      deleted,
      inserted: proposed.join('\n\n'),
      insertedBlocks: proposed,
      provisional: false,
    });
  }

  private makeHunk(fields: Omit<ReviewHunk, 'id' | 'status'>): ReviewHunk {
    const id = `${fields.kind === 'blocks' ? 'all' : fields.block}:${fields.start}:${fields.end}:${hash(fields.inserted)}`;
    const status = fields.provisional ? 'pending' : this.decisions.get(id) ?? 'pending';
    return { ...fields, id, status };
  }

  private emit(): void {
    if (this.listeners.size === 0) return;
    const snapshot = this.snapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }
}

function hash(text: string): string {
  let value = 5381;
  for (let index = 0; index < text.length; index += 1) value = ((value << 5) + value + text.charCodeAt(index)) | 0;
  return (value >>> 0).toString(36);
}
