import { afterEach, describe, expect, it, vi } from 'vitest';
import { ImageEditError, drawTransformed, encodeCanvas, loadImage, renderEdited } from '../imaging/canvas';
import { initialState, rotate, flipVisual } from '../imaging/geometry';
import { isOptimizable, optimizeImageFile, resolveOptimize, type OptimizeDeps } from '../imaging/optimize';
import { uploadMedia, validateFile } from '../uploadService';
import { DEFAULT_ALLOWED_TYPES, DEFAULT_MAX_FILE_SIZE } from '../constants';

import { fakeDeps, type FakeCanvas } from './canvasStub';

const source = {} as CanvasImageSource;

describe('drawing the transformed picture', () => {
  it('is the size of the picture, or its other way round after a quarter turn', () => {
    const { deps } = fakeDeps();
    expect(drawTransformed(source, 300, 200, initialState(), 1, deps)).toMatchObject({ width: 300, height: 200 });
    expect(drawTransformed(source, 300, 200, rotate(initialState(), 1), 1, deps)).toMatchObject({ width: 200, height: 300 });
    expect(drawTransformed(source, 300, 200, initialState(), 0.5, deps)).toMatchObject({ width: 150, height: 100 });
  });

  it('turns about the middle and draws the picture centred, flipped before it is turned', () => {
    const { deps } = fakeDeps();
    const state = flipVisual(rotate(initialState(), 1), 'h'); // source flipV, turned
    const canvas = drawTransformed(source, 300, 200, state, 1, deps) as FakeCanvas;
    expect(canvas.calls).toEqual([
      ['translate', 100, 150],
      ['rotate', Math.PI / 2],
      ['scale', 1, -1],
      ['drawImage', -150, -100, 300, 200],
    ]);
  });

  it('says so when the browser cannot draw', () => {
    expect(() => drawTransformed(source, 10, 10, initialState(), 1, fakeDeps({ noContext: true }).deps)).toThrowError(
      expect.objectContaining({ code: 'canvas' }),
    );
  });
});

describe('the finished picture', () => {
  it('is the crop of the transformed picture, scaled down', () => {
    const { deps, canvases } = fakeDeps();
    const state = { ...initialState(), crop: { x: 0.25, y: 0.5, width: 0.5, height: 0.5 }, maxWidth: 100 };
    const out = renderEdited(source, 400, 200, state, 'image/png', deps);
    expect(out).toMatchObject({ width: 100, height: 50 });
    const draw = (out as FakeCanvas).calls.find((c) => c[0] === 'drawImage')!;
    expect(draw.slice(1)).toEqual([100, 100, 200, 100, 0, 0, 100, 50]);
    expect(canvases).toHaveLength(2);
  });

  it('crops what is seen: after a turn the crop is in the turned picture', () => {
    const { deps } = fakeDeps();
    const state = { ...rotate(initialState(), 1), crop: { x: 0, y: 0, width: 1, height: 0.5 } };
    const out = renderEdited(source, 400, 200, state, 'image/png', deps) as FakeCanvas;
    expect(out).toMatchObject({ width: 200, height: 200 });
  });

  it('fills a JPEG with white first, because it has no clear pixels', () => {
    const jpeg = renderEdited(source, 10, 10, { ...initialState(), format: 'image/jpeg' }, 'image/png', fakeDeps().deps) as FakeCanvas;
    expect(jpeg.calls[0]).toEqual(['fillRect', 0, 0, 10, 10]);
    const png = renderEdited(source, 10, 10, initialState(), 'image/png', fakeDeps().deps) as FakeCanvas;
    expect(png.calls.some((c) => c[0] === 'fillRect')).toBe(false);
  });

  it('refuses a picture past what a browser can edit', () => {
    expect(() => renderEdited(source, 6000, 4000, initialState(), 'image/png', fakeDeps().deps)).toThrowError(
      expect.objectContaining({ code: 'too-large' }),
    );
    expect(() => renderEdited(source, 6000, 4000, { ...initialState(), maxWidth: 2000 }, 'image/png', fakeDeps().deps)).not.toThrow();
  });

  it('encodes, and says so when the browser cannot', async () => {
    const { deps } = fakeDeps();
    const blob = await encodeCanvas(deps.createCanvas(2, 2), 'image/webp', 0.8);
    expect(blob.type).toBe('image/webp');
    const broken = { toBlob: (cb: (b: Blob | null) => void) => cb(null) } as unknown as HTMLCanvasElement;
    await expect(encodeCanvas(broken, 'image/png', 1)).rejects.toMatchObject({ code: 'encode' });
  });
});

describe('opening a picture', () => {
  const stubImage = (outcome: 'load' | 'error') => {
    const made: any[] = [];
    vi.stubGlobal(
      'Image',
      class {
        crossOrigin = '';
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        set src(value: string) {
          made.push({ src: value, crossOrigin: this.crossOrigin });
          queueMicrotask(() => (outcome === 'load' ? this.onload?.() : this.onerror?.()));
        }
      },
    );
    return made;
  };
  afterEach(() => vi.unstubAllGlobals());

  it('asks a server for permission to read it, but not for a data or blob address', async () => {
    const made = stubImage('load');
    await loadImage('https://cdn.test/a.png');
    await loadImage('data:image/png;base64,AAAA');
    await loadImage('blob:http://localhost/1');
    expect(made.map((m) => m.crossOrigin)).toEqual(['anonymous', '', '']);
  });

  it('explains a picture from a server that does not allow it', async () => {
    stubImage('error');
    await expect(loadImage('https://cdn.test/a.png')).rejects.toMatchObject({ code: 'cors', message: expect.stringMatching(/CORS/) });
    await expect(loadImage('data:image/png;base64,AAAA')).rejects.toMatchObject({ code: 'load' });
    expect(await loadImage('x').catch((e) => e)).toBeInstanceOf(ImageEditError);
  });
});

describe('making a picture ready to be stored', () => {
  const png = (name = 'big.png', type = 'image/png', size = 5000) => {
    const file = new File(['x'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };
  const depsFor = (width: number, height: number, canvas = fakeDeps()) => {
    const deps: OptimizeDeps = { ...canvas.deps, load: async () => ({ source, width, height }) };
    return { deps, canvases: canvas.canvases };
  };

  it('is off unless asked for, and has defaults when asked for with true', () => {
    expect(resolveOptimize(undefined)).toBeNull();
    expect(resolveOptimize(false)).toBeNull();
    expect(resolveOptimize(true)).toEqual({ maxWidth: 2048, quality: 0.85, format: 'keep' });
    expect(resolveOptimize({ maxWidth: 800, format: 'webp' })).toEqual({ maxWidth: 800, quality: 0.85, format: 'webp' });
  });

  it('leaves GIFs, SVGs and other types alone', async () => {
    expect(isOptimizable('image/gif')).toBe(false);
    expect(isOptimizable('image/svg+xml')).toBe(false);
    expect(isOptimizable('image/png')).toBe(true);
    const gif = png('a.gif', 'image/gif');
    expect(await optimizeImageFile(gif, resolveOptimize(true)!)).toBe(gif);
  });

  it('scales a wide picture down, in the same format, keeping its name', async () => {
    const { deps, canvases } = depsFor(4000, 3000, fakeDeps({ blobSize: 100 }));
    const out = await optimizeImageFile(png('photo.png'), resolveOptimize({ maxWidth: 1000 })!, deps);
    expect(out.name).toBe('photo.png');
    expect(out.type).toBe('image/png');
    expect(out.size).toBe(100);
    expect(canvases[canvases.length - 1]).toMatchObject({ width: 1000, height: 750 });
  });

  it('leaves a picture that is narrow enough, and one that would only come out larger', async () => {
    const small = png();
    expect(await optimizeImageFile(small, resolveOptimize(true)!, depsFor(800, 600).deps)).toBe(small);
    const jpeg = png('a.jpg', 'image/jpeg', 50);
    expect(await optimizeImageFile(jpeg, resolveOptimize({ format: 'jpeg' })!, depsFor(800, 600, fakeDeps({ blobSize: 500 })).deps)).toBe(jpeg);
  });

  it('converts to WebP when asked, and renames', async () => {
    const out = await optimizeImageFile(png('shot.png'), resolveOptimize({ format: 'webp' })!, depsFor(800, 600).deps);
    expect(out.type).toBe('image/webp');
    expect(out.name).toBe('shot.webp');
  });

  it('keeps the file when the browser answers in another format than asked for', async () => {
    const jpeg = png('a.jpg', 'image/jpeg');
    const deps = depsFor(4000, 3000, fakeDeps({ blobType: 'image/png' })).deps;
    expect(await optimizeImageFile(jpeg, resolveOptimize({ maxWidth: 1000 })!, deps)).toBe(jpeg);
  });

  it('keeps the file rather than fail when it cannot be read or drawn', async () => {
    const file = png();
    const broken: OptimizeDeps = { ...fakeDeps({ noContext: true }).deps, load: async () => ({ source, width: 4000, height: 3000 }) };
    expect(await optimizeImageFile(file, resolveOptimize(true)!, broken)).toBe(file);
    expect(await optimizeImageFile(file, resolveOptimize(true)!, { ...broken, load: async () => { throw new Error('x'); } })).toBe(file);
  });
});

describe('the size limit with optimizing on', () => {
  const big = () => {
    const file = new File(['x'], 'huge.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: DEFAULT_MAX_FILE_SIZE * 2 });
    return file;
  };
  const config = { allowedTypes: DEFAULT_ALLOWED_TYPES, maxFileSize: DEFAULT_MAX_FILE_SIZE };

  it('is not held against a picture that is about to be made smaller, but is against anything else', () => {
    expect(() => validateFile(big(), config)).toThrowError(expect.objectContaining({ code: 'too-large' }));
    expect(() => validateFile(big(), { ...config, optimizeImages: true })).not.toThrow();
    const video = new File(['x'], 'v.mp4', { type: 'video/mp4' });
    Object.defineProperty(video, 'size', { value: DEFAULT_MAX_FILE_SIZE * 2 });
    expect(() => validateFile(video, { ...config, optimizeImages: true })).toThrowError(expect.objectContaining({ code: 'too-large' }));
  });

  it('is still held against the result: a picture that could not be made smaller is refused when it is stored', async () => {
    await expect(
      uploadMedia(big(), { config: { optimizeImages: true, uploadHandler: async () => 'https://cdn.test/x.png' } }),
    ).rejects.toMatchObject({ code: 'too-large' });
  });
});
