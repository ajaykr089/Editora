import {
  cropPixels,
  outputSize,
  resolveFormat,
  transformedSize,
  type EditState,
} from './geometry';

/** Where canvases come from; a test supplies its own, since jsdom has none. */
export interface CanvasDeps {
  createCanvas: (width: number, height: number) => HTMLCanvasElement;
}

export const defaultCanvasDeps: CanvasDeps = {
  createCanvas: (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },
};

export class ImageEditError extends Error {
  constructor(
    readonly code: 'load' | 'cors' | 'canvas' | 'encode' | 'too-large',
    message: string,
  ) {
    super(message);
    this.name = 'ImageEditError';
  }
}

/** Browsers refuse canvases past about this many pixels (iOS Safari's limit is the lowest). */
const MAX_PIXELS = 16_000_000;

/**
 * Load a picture for drawing. It is asked for with CORS so that the canvas stays readable: a picture from a server
 * that does not allow it can be shown but not edited, and says so.
 */
export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    if (!src.startsWith('data:') && !src.startsWith('blob:')) image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(
        new ImageEditError(
          src.startsWith('data:') || src.startsWith('blob:') ? 'load' : 'cors',
          src.startsWith('data:') || src.startsWith('blob:')
            ? "This image couldn't be opened."
            : "This image couldn't be opened for editing. Its server may not allow it (CORS), or the address no longer works.",
        ),
      );
    image.src = src;
  });

/**
 * Draw the picture as edited, up to (and not including) the crop: flipped, then rotated. The result has the
 * transformed size. `scale` draws it smaller, for a preview.
 */
export const drawTransformed = (
  source: CanvasImageSource,
  width: number,
  height: number,
  state: EditState,
  scale: number,
  deps: CanvasDeps = defaultCanvasDeps,
): HTMLCanvasElement => {
  const size = transformedSize(width, height, state.rotation);
  const canvas = deps.createCanvas(Math.max(1, Math.round(size.width * scale)), Math.max(1, Math.round(size.height * scale)));
  const context = canvas.getContext('2d');
  if (!context) throw new ImageEditError('canvas', "This browser can't edit images.");

  context.imageSmoothingQuality = 'high';
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((state.rotation * Math.PI) / 180);
  context.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);
  // Drawn centred, in the picture's own (unrotated) shape, at the same scale.
  context.drawImage(source, (-width * scale) / 2, (-height * scale) / 2, width * scale, height * scale);
  return canvas;
};

/** The finished picture: flipped, rotated, cropped and scaled down. */
export const renderEdited = (
  source: CanvasImageSource,
  width: number,
  height: number,
  state: EditState,
  sourceType: string,
  deps: CanvasDeps = defaultCanvasDeps,
): HTMLCanvasElement => {
  const turned = transformedSize(width, height, state.rotation);
  const crop = cropPixels(state.crop, turned.width, turned.height);
  const out = outputSize(crop.width, crop.height, state.maxWidth);
  if (out.width * out.height > MAX_PIXELS) {
    throw new ImageEditError('too-large', 'This image is too large to edit in the browser. Resize it first.');
  }

  const full = drawTransformed(source, width, height, state, 1, deps);
  const canvas = deps.createCanvas(out.width, out.height);
  const context = canvas.getContext('2d');
  if (!context) throw new ImageEditError('canvas', "This browser can't edit images.");
  context.imageSmoothingQuality = 'high';
  // JPEG has no transparency: what was clear would come out black.
  if (resolveFormat(state.format, sourceType) === 'image/jpeg') {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, out.width, out.height);
  }
  context.drawImage(full, crop.x, crop.y, crop.width, crop.height, 0, 0, out.width, out.height);
  return canvas;
};

export const encodeCanvas = (canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new ImageEditError('encode', "The picture couldn't be saved in this format."))),
      type,
      quality,
    );
  });
