import { describe, expect, it } from 'vitest';
import {
  MIN_CROP,
  aspectInFractions,
  clampRect,
  cropPixels,
  editedFileName,
  flipRect,
  flipVisual,
  initialState,
  isUnchanged,
  moveRect,
  outputSize,
  rectWithAspect,
  resizeRect,
  resolveFormat,
  rotate,
  rotateRect,
  transformedSize,
  type Handle,
  type Rect,
} from '../imaging/geometry';

const close = (a: number, b: number) => expect(a).toBeCloseTo(b, 9);
const rect = (x: number, y: number, width: number, height: number): Rect => ({ x, y, width, height });
const inside = (r: Rect) => {
  expect(r.x).toBeGreaterThanOrEqual(-1e-9);
  expect(r.y).toBeGreaterThanOrEqual(-1e-9);
  expect(r.x + r.width).toBeLessThanOrEqual(1 + 1e-9);
  expect(r.y + r.height).toBeLessThanOrEqual(1 + 1e-9);
};

describe('turning a picture', () => {
  it('swaps the sides with a quarter turn', () => {
    expect(transformedSize(300, 200, 0)).toEqual({ width: 300, height: 200 });
    expect(transformedSize(300, 200, 90)).toEqual({ width: 200, height: 300 });
    expect(transformedSize(300, 200, 180)).toEqual({ width: 300, height: 200 });
    expect(transformedSize(300, 200, 270)).toEqual({ width: 200, height: 300 });
  });

  it('goes round in both directions', () => {
    let state = initialState();
    for (let i = 0; i < 4; i++) state = rotate(state, 1);
    expect(state.rotation).toBe(0);
    expect(rotate(initialState(), -1).rotation).toBe(270);
    expect(rotate(rotate(initialState(), 1), 1).rotation).toBe(180);
  });

  it('turns the crop with the picture, so that it still covers the same part', () => {
    // The top-left corner of a picture, turned clockwise, is its top-right corner.
    expect(rotateRect(rect(0, 0, 0.5, 0.25), 1)).toEqual(rect(0.75, 0, 0.25, 0.5));
    // And counter-clockwise it is the bottom-left.
    expect(rotateRect(rect(0, 0, 0.5, 0.25), -1)).toEqual(rect(0, 0.5, 0.25, 0.5));
  });

  it('gets the crop back after four turns, and after a turn each way', () => {
    const start = rect(0.1, 0.2, 0.3, 0.4);
    let r = start;
    for (let i = 0; i < 4; i++) r = rotateRect(r, 1);
    expect(r.x).toBeCloseTo(start.x);
    expect(r.y).toBeCloseTo(start.y);
    expect(r.width).toBeCloseTo(start.width);
    expect(r.height).toBeCloseTo(start.height);
    const back = rotateRect(rotateRect(start, 1), -1);
    expect(back.x).toBeCloseTo(start.x);
    expect(back.height).toBeCloseTo(start.height);
  });

  it('rotates the crop of the state', () => {
    const state = rotate({ ...initialState(), crop: rect(0, 0, 0.5, 0.25) }, 1);
    expect(state.crop).toEqual(rect(0.75, 0, 0.25, 0.5));
    expect(rotate(initialState(), 1).crop).toBeNull();
  });
});

describe('flipping a picture', () => {
  it('mirrors the crop across the middle', () => {
    expect(flipRect(rect(0.1, 0.2, 0.3, 0.4), 'h')).toEqual(rect(0.6, 0.2, 0.3, 0.4));
    const v = flipRect(rect(0.1, 0.2, 0.3, 0.4), 'v');
    close(v.y, 0.4);
    close(v.x, 0.1);
  });

  it('is undone by flipping again', () => {
    let state = initialState();
    state = flipVisual(state, 'h');
    expect(state.flipH).toBe(true);
    state = flipVisual(state, 'h');
    expect(state.flipH).toBe(false);
  });

  it('means what is seen: after a quarter turn a horizontal flip is a vertical one in the source', () => {
    const turned = rotate(initialState(), 1);
    expect(flipVisual(turned, 'h')).toMatchObject({ flipH: false, flipV: true });
    expect(flipVisual(turned, 'v')).toMatchObject({ flipH: true, flipV: false });
    expect(flipVisual(rotate(turned, 1), 'h')).toMatchObject({ flipH: true, flipV: false });
    expect(flipVisual(rotate(rotate(turned, 1), 1), 'h')).toMatchObject({ flipH: false, flipV: true });
  });
});

describe('the crop in pixels and the size of the result', () => {
  it('is the whole picture without a crop', () => {
    expect(cropPixels(null, 300, 200)).toEqual({ x: 0, y: 0, width: 300, height: 200 });
  });

  it('rounds to whole pixels and stays inside', () => {
    expect(cropPixels(rect(0.1, 0.25, 0.5, 0.5), 300, 200)).toEqual({ x: 30, y: 50, width: 150, height: 100 });
    const edge = cropPixels(rect(0.999, 0.999, 0.5, 0.5), 300, 200);
    expect(edge.x + edge.width).toBeLessThanOrEqual(300);
    expect(edge.y + edge.height).toBeLessThanOrEqual(200);
    expect(edge.width).toBeGreaterThanOrEqual(1);
  });

  it('scales down to a maximum width, never up', () => {
    expect(outputSize(3000, 2000, 1500)).toEqual({ width: 1500, height: 1000 });
    expect(outputSize(800, 600, 1500)).toEqual({ width: 800, height: 600 });
    expect(outputSize(800, 600, null)).toEqual({ width: 800, height: 600 });
    expect(outputSize(1000, 1, 10).height).toBe(1);
  });

  it('knows an untouched state', () => {
    expect(isUnchanged(initialState())).toBe(true);
    expect(isUnchanged({ ...initialState(), quality: 0.5, format: 'image/webp' })).toBe(true);
    expect(isUnchanged(rotate(initialState(), 1))).toBe(false);
    expect(isUnchanged({ ...initialState(), maxWidth: 800 })).toBe(false);
  });
});

describe('a crop of a given shape', () => {
  it('fills the picture along its short side and is centred', () => {
    const wide = rectWithAspect(1, 400, 200);
    close(wide.width * 400, wide.height * 200);
    expect(wide.height).toBe(1);
    close(wide.x, 0.25);
    const tall = rectWithAspect(16 / 9, 300, 600);
    close((tall.width * 300) / (tall.height * 600), 16 / 9);
    expect(tall.width).toBe(1);
  });

  it('is centred on the crop it replaces, kept inside the picture', () => {
    const near = rectWithAspect(1, 400, 200, rect(0.8, 0, 0.2, 0.2));
    inside(near);
    expect(near.x + near.width).toBeLessThanOrEqual(1);
  });

  it('turns a pixel ratio into fractions', () => {
    close(aspectInFractions(1, 400, 200), 0.5);
    close(aspectInFractions(2, 400, 200), 1);
  });
});

describe('moving a crop', () => {
  it('stops at the edges of the picture', () => {
    expect(moveRect(rect(0.1, 0.1, 0.5, 0.5), 0.5, 0.5)).toEqual(rect(0.5, 0.5, 0.5, 0.5));
    expect(moveRect(rect(0.1, 0.1, 0.5, 0.5), -0.5, -0.5)).toEqual(rect(0, 0, 0.5, 0.5));
  });

  it('clamps whatever it is given', () => {
    expect(clampRect(rect(-1, 2, 3, -1))).toEqual(rect(0, 1, 1, 0));
  });
});

describe('resizing a crop without a shape', () => {
  const start = rect(0.2, 0.2, 0.4, 0.4);

  it('moves one side and leaves the opposite one', () => {
    const e = resizeRect(start, 'e', 0.1, 0.5);
    close(e.x, 0.2);
    close(e.width, 0.5);
    close(e.height, 0.4);
    const w = resizeRect(start, 'w', 0.1, 0.5);
    close(w.x, 0.3);
    close(w.width, 0.3);
    close(w.height, 0.4);
    const n = resizeRect(start, 'n', 0.5, -0.1);
    close(n.y, 0.1);
    close(n.height, 0.5);
  });

  it('moves two sides at a corner', () => {
    const r = resizeRect(start, 'se', 0.1, 0.2);
    close(r.width, 0.5);
    close(r.height, 0.6);
    const nw = resizeRect(start, 'nw', -0.1, -0.1);
    close(nw.x, 0.1);
    close(nw.y, 0.1);
    close(nw.width, 0.5);
  });

  it('stays inside the picture and above the minimum', () => {
    inside(resizeRect(start, 'se', 5, 5));
    inside(resizeRect(start, 'nw', -5, -5));
    const squeezed = resizeRect(start, 'e', -5, 0);
    close(squeezed.width, MIN_CROP);
    close(squeezed.x, 0.2);
    const squeezedWest = resizeRect(start, 'w', 5, 0);
    close(squeezedWest.width, MIN_CROP);
    close(squeezedWest.x + squeezedWest.width, 0.6);
  });
});

describe('resizing a crop that keeps its shape', () => {
  const k = 0.5; // twice as high as wide, in fractions
  const start = rect(0.3, 0.2, 0.2, 0.4);

  it('keeps the shape at every handle, and inside the picture, whatever the drag', () => {
    const handles: Handle[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
    for (const handle of handles) {
      for (const [dx, dy] of [[0.1, 0.1], [-0.1, -0.1], [0.5, -0.5], [-0.9, 0.9], [2, 2], [-2, -2], [0, 0]]) {
        const r = resizeRect(start, handle, dx, dy, k);
        close(r.width / r.height, k);
        inside(r);
        expect(r.width).toBeGreaterThanOrEqual(MIN_CROP - 1e-9);
        expect(r.height).toBeGreaterThanOrEqual(MIN_CROP - 1e-9);
      }
    }
  });

  it('keeps the opposite corner where it is', () => {
    const r = resizeRect(start, 'se', 0.05, 0.05, k);
    close(r.x, start.x);
    close(r.y, start.y);
    const nw = resizeRect(start, 'nw', -0.05, -0.05, k);
    close(nw.x + nw.width, start.x + start.width);
    close(nw.y + nw.height, start.y + start.height);
  });

  it('follows whichever direction the pointer went further', () => {
    const wide = resizeRect(start, 'se', 0.2, 0, k);
    close(wide.width, 0.4);
    const tall = resizeRect(start, 'se', 0, 0.4, k);
    close(tall.height, 0.8);
  });

  it('changes the other dimension about the middle at an edge', () => {
    const r = resizeRect(start, 's', 0, 0.1, k);
    close(r.height, 0.5);
    close(r.width, 0.25);
    close(r.x + r.width / 2, start.x + start.width / 2);
    const e = resizeRect(start, 'e', 0.1, 0, k);
    close(e.width, 0.3);
    close(e.height, 0.6);
    close(e.y + e.height / 2, start.y + start.height / 2);
  });
});

describe('what is written', () => {
  it('keeps JPEG and WebP and writes PNG for the rest', () => {
    expect(resolveFormat('keep', 'image/jpeg')).toBe('image/jpeg');
    expect(resolveFormat('keep', 'image/webp')).toBe('image/webp');
    expect(resolveFormat('keep', 'image/gif')).toBe('image/png');
    expect(resolveFormat('keep', 'image/avif')).toBe('image/png');
    expect(resolveFormat('image/webp', 'image/png')).toBe('image/webp');
  });

  it('names the edited file after the original, once', () => {
    expect(editedFileName('photo.jpg', 'image/jpeg')).toBe('photo-edited.jpg');
    expect(editedFileName('photo.JPEG', 'image/webp')).toBe('photo-edited.webp');
    expect(editedFileName('photo-edited.png', 'image/png')).toBe('photo-edited.png');
    expect(editedFileName('', 'image/png')).toBe('image-edited.png');
    expect(editedFileName('archive.tar.gz', 'image/png')).toBe('archive.tar-edited.png');
  });
});
