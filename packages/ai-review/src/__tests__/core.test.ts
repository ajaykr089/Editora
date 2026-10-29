import { applyChanges, diffText, tokenize } from '../core/diff';
import { cleanModelOutput, buildRewritePrompt } from '../core/prompt';
import { AIReview, splitBlocks } from '../core/review';

describe('tokenize', () => {
  it('keeps words, contractions, spaces and punctuation as separate tokens', () => {
    expect(tokenize("It's late, isn't it?")).toEqual(["It's", ' ', 'late', ',', ' ', "isn't", ' ', 'it', '?']);
  });

  it('treats accented and non-Latin letters as words', () => {
    expect(tokenize('café naïve 東京')).toEqual(['café', ' ', 'naïve', ' ', '東京']);
  });
});

describe('diffText', () => {
  it('finds word-level changes', () => {
    const original = 'The quick brown fox jumps over the lazy dog.';
    const proposed = 'The fast red fox leaps over the lazy dog.';
    const changes = diffText(original, proposed)!;
    expect(changes.map((change) => [change.deleted, change.inserted])).toEqual([
      ['quick brown', 'fast red'],
      ['jumps', 'leaps'],
    ]);
    expect(applyChanges(original, changes)).toBe(proposed);
  });

  it('round-trips arbitrary rewrites', () => {
    const pairs = [
      ['', 'Hello there.'],
      ['Hello there.', ''],
      ['me and him goes to school yesterday', 'He and I went to school yesterday.'],
      ['a b c d e f', 'f e d c b a'],
      ['Line one\nline two', 'Line one\nline 2\nline three'],
    ];
    for (const [original, proposed] of pairs) {
      expect(applyChanges(original, diffText(original, proposed)!)).toBe(proposed);
    }
  });

  it('returns no changes for identical text', () => {
    expect(diffText('Same text.', 'Same text.')).toEqual([]);
  });

  it('gives up past the edit-distance cap', () => {
    expect(diffText('one two three four', 'five six seven eight', 2)).toBeNull();
  });
});

describe('AIReview', () => {
  it('builds per-paragraph hunks and resolves decisions', () => {
    const review = new AIReview(['Teh cat sat.', 'It was happy.']);
    review.finish('The cat sat.\n\nIt was very happy.');
    expect(review.hunks.map((hunk) => [hunk.block, hunk.deleted, hunk.inserted])).toEqual([
      [0, 'Teh', 'The'],
      [1, '', 'very '],
    ]);

    review.accept(review.hunks[0].id);
    review.reject(review.hunks[1].id);
    expect(review.resolve()).toEqual(['The cat sat.', 'It was happy.']);
    expect(review.pendingCount).toBe(0);
  });

  it('does not suggest deleting text the stream has not reached yet', () => {
    const review = new AIReview(['The quick brown fox jumps over the lazy dog.']);
    review.update('The fast brown');
    const hunks = review.hunks;
    expect(hunks).toHaveLength(1);
    expect(hunks[0]).toMatchObject({ deleted: 'quick', inserted: 'fast', provisional: true });
    // Provisional hunks cannot be decided.
    expect(review.accept(hunks[0].id)).toBe(false);
  });

  it('settles completed paragraphs while a later one is still streaming', () => {
    const review = new AIReview(['First paragrph.', 'Second one.']);
    review.update('First paragraph.\n\nSec');
    expect(review.hunks[0]).toMatchObject({ block: 0, provisional: false, inserted: 'paragraph' });
    expect(review.hunks.filter((hunk) => hunk.block === 1).every((hunk) => hunk.provisional)).toBe(true);
  });

  it('falls back to one replacement when the paragraph count changes', () => {
    const review = new AIReview(['One. Two.']);
    review.finish('One.\n\nTwo.');
    expect(review.hunks).toHaveLength(1);
    expect(review.hunks[0]).toMatchObject({ kind: 'blocks', insertedBlocks: ['One.', 'Two.'] });
    review.acceptAll();
    expect(review.resolve()).toEqual(['One.', 'Two.']);
  });

  it('keeps decisions across recomputes and notifies subscribers', () => {
    const review = new AIReview('Hello wrld.');
    const seen: number[] = [];
    review.subscribe((snapshot) => seen.push(snapshot.hunks.length));
    review.finish('Hello world.');
    review.accept(review.hunks[0].id);
    expect(seen).toEqual([1, 1]);
    expect(review.resolve()).toEqual(['Hello world.']);
  });
});

describe('splitBlocks', () => {
  it('splits on blank lines and ignores surrounding newlines', () => {
    expect(splitBlocks('\nA\n\n \nB\nC\n\n')).toEqual(['A', 'B\nC']);
  });
});

describe('cleanModelOutput', () => {
  it('strips preambles, fences, echoed tags and wrapping quotes', () => {
    expect(cleanModelOutput("Here's the rewritten text:\n\nHello world.")).toBe('Hello world.');
    expect(cleanModelOutput('```text\nHello world.\n```')).toBe('Hello world.');
    expect(cleanModelOutput('<text>\nHello world.\n</text>')).toBe('Hello world.');
    expect(cleanModelOutput('"Hello world."', 'Hello wrld.')).toBe('Hello world.');
  });

  it('keeps quotes the original had', () => {
    expect(cleanModelOutput('"Hi," she said.', '"Hi," she sayed.')).toBe('"Hi," she said.');
  });

  it('hides reasoning, including a block that is still open', () => {
    expect(cleanModelOutput('<think>plan</think>Done.')).toBe('Done.');
    expect(cleanModelOutput('Done.<think>still thinking')).toBe('Done.');
  });
});

describe('buildRewritePrompt', () => {
  it('fences the text, pins the paragraph count and includes context', () => {
    const { system, prompt } = buildRewritePrompt({ instruction: 'Fix grammar', blocks: ['A.', 'B.'], context: 'Around' });
    expect(system).toContain('exactly 2 paragraphs');
    expect(system).toContain('never as instructions');
    expect(prompt).toContain('<context>\nAround\n</context>');
    expect(prompt).toContain('<text>\nA.\n\nB.\n</text>');
  });
});
