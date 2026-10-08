import { describe, expect, it } from 'vitest';
import { lineForPreviewTop, previewTopForLine, type Anchor } from '../components/scrollSync';

// A 40-line document whose preview is 1000px tall: a heading (lines 0-1), a paragraph (2-9), a code block
// (10-29, drawn taller than it is long) and a closing paragraph (30-39).
const anchors: Anchor[] = [
  { line: 0, top: 16 },
  { line: 2, top: 80 },
  { line: 10, top: 300 },
  { line: 30, top: 900 },
];
const TOTAL = 40;
const HEIGHT = 1000;

describe('previewTopForLine', () => {
  it('is the anchor itself at the line a block starts on', () => {
    expect(previewTopForLine(anchors, 2, TOTAL, HEIGHT)).toBe(80);
    expect(previewTopForLine(anchors, 10, TOTAL, HEIGHT)).toBe(300);
    expect(previewTopForLine(anchors, 30, TOTAL, HEIGHT)).toBe(900);
  });

  it('moves through a block in proportion to the lines of source it covers', () => {
    // Halfway through the paragraph (lines 2-10) is halfway through its 220px.
    expect(previewTopForLine(anchors, 6, TOTAL, HEIGHT)).toBe(190);
    // The code block is 20 lines of source and 600px: 30px a line, not the 25px of the document as a whole.
    expect(previewTopForLine(anchors, 20, TOTAL, HEIGHT)).toBe(600);
    expect(previewTopForLine(anchors, 15.5, TOTAL, HEIGHT)).toBe(465);
  });

  it('reaches the top before the first block and the bottom after the last', () => {
    expect(previewTopForLine(anchors, 0, TOTAL, HEIGHT)).toBe(0);
    expect(previewTopForLine(anchors, 1, TOTAL, HEIGHT)).toBe(48);
    expect(previewTopForLine(anchors, TOTAL, TOTAL, HEIGHT)).toBe(HEIGHT);
    expect(previewTopForLine(anchors, 35, TOTAL, HEIGHT)).toBe(950);
  });

  it('clamps lines outside the document', () => {
    expect(previewTopForLine(anchors, -5, TOTAL, HEIGHT)).toBe(0);
    expect(previewTopForLine(anchors, 500, TOTAL, HEIGHT)).toBe(HEIGHT);
  });

  it('falls back to proportion when there are no anchors', () => {
    expect(previewTopForLine([], 10, TOTAL, HEIGHT)).toBe(250);
    expect(previewTopForLine([], 0, 0, 0)).toBe(0);
  });

  it('copes with a single anchor, blocks on the same line, and zero-height blocks', () => {
    expect(previewTopForLine([{ line: 5, top: 100 }], 5, 10, 200)).toBe(100);
    expect(previewTopForLine([{ line: 5, top: 100 }, { line: 5, top: 100 }], 5, 10, 200)).toBe(100);
    expect(previewTopForLine([{ line: 0, top: 0 }, { line: 4, top: 50 }, { line: 8, top: 50 }], 6, 10, 200)).toBe(50);
  });
});

describe('lineForPreviewTop', () => {
  it('is the inverse of previewTopForLine', () => {
    for (const line of [0, 1, 2, 4.5, 10, 17, 29.5, 30, 38, 40]) {
      const top = previewTopForLine(anchors, line, TOTAL, HEIGHT);
      expect(lineForPreviewTop(anchors, top, TOTAL, HEIGHT)).toBeCloseTo(line, 6);
    }
  });

  it('reads the line a block starts on at its top, and a fraction part of the way down it', () => {
    expect(lineForPreviewTop(anchors, 300, TOTAL, HEIGHT)).toBe(10);
    expect(lineForPreviewTop(anchors, 600, TOTAL, HEIGHT)).toBe(20);
  });

  it('is 0 at the top and the last line at the bottom, and clamps outside', () => {
    expect(lineForPreviewTop(anchors, 0, TOTAL, HEIGHT)).toBe(0);
    expect(lineForPreviewTop(anchors, HEIGHT, TOTAL, HEIGHT)).toBe(TOTAL);
    expect(lineForPreviewTop(anchors, -10, TOTAL, HEIGHT)).toBe(0);
    expect(lineForPreviewTop(anchors, 5000, TOTAL, HEIGHT)).toBe(TOTAL);
  });

  it('is monotonic: scrolling down never goes back up the source', () => {
    let previous = -1;
    for (let top = 0; top <= HEIGHT; top += 7) {
      const line = lineForPreviewTop(anchors, top, TOTAL, HEIGHT);
      expect(line).toBeGreaterThanOrEqual(previous);
      previous = line;
    }
  });
});
