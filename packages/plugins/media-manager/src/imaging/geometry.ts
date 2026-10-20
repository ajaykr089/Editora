/**
 * The maths of editing a picture, kept apart from the canvas so that it can be tested exactly.
 *
 * What a person edits is what they see, so the crop rectangle lives in the *transformed* picture (after the
 * flips and the rotation) and in fractions of it (0..1), which stay true as the preview is scaled to fit.
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Rotation = 0 | 90 | 180 | 270;
export type OutputFormat = 'keep' | 'image/jpeg' | 'image/webp' | 'image/png';

export interface EditState {
  rotation: Rotation;
  /** Mirrored in the *source* picture, before it is rotated (see `flipVisual` for what a person means by it). */
  flipH: boolean;
  flipV: boolean;
  /** In the transformed picture, as fractions. `null`: no crop. */
  crop: Rect | null;
  /** Scale down so that the result is no wider than this; `null`: as it is. */
  maxWidth: number | null;
  format: OutputFormat;
  /** 0..1, for JPEG and WebP. */
  quality: number;
}

export const initialState = (): EditState => ({
  rotation: 0,
  flipH: false,
  flipV: false,
  crop: null,
  maxWidth: null,
  format: 'keep',
  quality: 0.85,
});

export const isUnchanged = (state: EditState): boolean =>
  state.rotation === 0 && !state.flipH && !state.flipV && state.crop === null && state.maxWidth === null;

/** The picture's size once rotated: a quarter turn swaps the sides. */
export const transformedSize = (width: number, height: number, rotation: Rotation): { width: number; height: number } =>
  rotation === 90 || rotation === 270 ? { width: height, height: width } : { width, height };

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Keep a rectangle inside the picture. */
export const clampRect = (rect: Rect): Rect => {
  const width = Math.min(1, Math.max(0, rect.width));
  const height = Math.min(1, Math.max(0, rect.height));
  return { x: Math.min(1 - width, clamp01(rect.x)), y: Math.min(1 - height, clamp01(rect.y)), width, height };
};

/** The crop turned a quarter with the picture. */
export const rotateRect = (rect: Rect, direction: 1 | -1): Rect =>
  direction === 1
    ? { x: 1 - (rect.y + rect.height), y: rect.x, width: rect.height, height: rect.width }
    : { x: rect.y, y: 1 - (rect.x + rect.width), width: rect.height, height: rect.width };

export const flipRect = (rect: Rect, axis: 'h' | 'v'): Rect =>
  axis === 'h' ? { ...rect, x: 1 - (rect.x + rect.width) } : { ...rect, y: 1 - (rect.y + rect.height) };

/** A quarter turn, clockwise (1) or counter-clockwise (-1); the crop turns with the picture. */
export const rotate = (state: EditState, direction: 1 | -1): EditState => ({
  ...state,
  rotation: ((state.rotation + direction * 90 + 360) % 360) as Rotation,
  crop: state.crop ? rotateRect(state.crop, direction) : null,
});

/**
 * Mirror the picture as it is seen. The flips are kept in the source (they are applied before the rotation), so
 * after a quarter turn what looks like a horizontal flip is a vertical one in the source, and the other way round.
 */
export const flipVisual = (state: EditState, axis: 'h' | 'v'): EditState => {
  const turned = state.rotation === 90 || state.rotation === 270;
  const inSource = turned ? (axis === 'h' ? 'v' : 'h') : axis;
  return {
    ...state,
    flipH: inSource === 'h' ? !state.flipH : state.flipH,
    flipV: inSource === 'v' ? !state.flipV : state.flipV,
    crop: state.crop ? flipRect(state.crop, axis) : null,
  };
};

/** The crop in whole pixels of the transformed picture, at least one pixel each way. */
export const cropPixels = (crop: Rect | null, width: number, height: number): { x: number; y: number; width: number; height: number } => {
  if (!crop) return { x: 0, y: 0, width, height };
  const x = Math.min(width - 1, Math.max(0, Math.round(crop.x * width)));
  const y = Math.min(height - 1, Math.max(0, Math.round(crop.y * height)));
  return {
    x,
    y,
    width: Math.max(1, Math.min(width - x, Math.round(crop.width * width))),
    height: Math.max(1, Math.min(height - y, Math.round(crop.height * height))),
  };
};

/** The size of the result: the crop, scaled down to `maxWidth` when it is wider (never scaled up). */
export const outputSize = (cropWidth: number, cropHeight: number, maxWidth: number | null): { width: number; height: number } => {
  if (!maxWidth || cropWidth <= maxWidth) return { width: cropWidth, height: cropHeight };
  const scale = maxWidth / cropWidth;
  return { width: maxWidth, height: Math.max(1, Math.round(cropHeight * scale)) };
};

/**
 * A rectangle of a given shape, as large as fits in the picture and centred on `around` (or the picture).
 * `ratio` is width / height in pixels; the picture's own size turns it into fractions.
 */
export const rectWithAspect = (ratio: number, imageWidth: number, imageHeight: number, around?: Rect): Rect => {
  const pictureRatio = imageWidth / imageHeight;
  const width = ratio >= pictureRatio ? 1 : ratio / pictureRatio;
  const height = ratio >= pictureRatio ? pictureRatio / ratio : 1;
  const centreX = around ? around.x + around.width / 2 : 0.5;
  const centreY = around ? around.y + around.height / 2 : 0.5;
  return clampRect({ x: centreX - width / 2, y: centreY - height / 2, width, height });
};

/** The MIME type to write: what was asked for, or (keep) what the picture was when the browser can write it. */
export const resolveFormat = (format: OutputFormat, sourceType: string): 'image/jpeg' | 'image/webp' | 'image/png' => {
  if (format !== 'keep') return format;
  return sourceType === 'image/jpeg' || sourceType === 'image/webp' ? sourceType : 'image/png';
};

export const extensionFor = (type: string): string => (type === 'image/jpeg' ? 'jpg' : type === 'image/webp' ? 'webp' : 'png');

/** `photo.jpg` edited into a JPEG: `photo-edited.jpg`. */
export const editedFileName = (original: string, type: string): string => {
  const base = (original || 'image').replace(/\.[^./\\]+$/, '').replace(/-edited$/, '');
  return `${base || 'image'}-edited.${extensionFor(type)}`;
};

export type Handle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

/** The smallest crop, as a fraction of the picture. */
export const MIN_CROP = 0.04;

export const moveRect = (rect: Rect, dx: number, dy: number): Rect => clampRect({ ...rect, x: rect.x + dx, y: rect.y + dy });

/**
 * Drag one handle of a crop by (dx, dy), in fractions of the picture. The opposite side stays where it is.
 * With `aspect` (width / height in fractions: a ratio in pixels times the picture's height over its width) the
 * shape is kept: a corner follows whichever of the two directions the pointer went further, an edge changes the
 * other dimension about the middle of the box. The result stays inside the picture and above the minimum size.
 */
export const resizeRect = (rect: Rect, handle: Handle, dx: number, dy: number, aspect: number | null = null, min = MIN_CROP): Rect => {
  const goesEast = handle.includes('e');
  const goesWest = handle.includes('w');
  const goesSouth = handle.includes('s');
  const goesNorth = handle.includes('n');
  let left = rect.x;
  let right = rect.x + rect.width;
  let top = rect.y;
  let bottom = rect.y + rect.height;
  if (goesEast) right = clamp01(right + dx);
  if (goesWest) left = clamp01(left + dx);
  if (goesSouth) bottom = clamp01(bottom + dy);
  if (goesNorth) top = clamp01(top + dy);

  if (right - left < min) {
    if (goesWest) left = right - min;
    else if (goesEast) right = left + min;
  }
  if (bottom - top < min) {
    if (goesNorth) top = bottom - min;
    else if (goesSouth) bottom = top + min;
  }
  left = clamp01(left);
  top = clamp01(top);
  right = Math.max(left, clamp01(right));
  bottom = Math.max(top, clamp01(bottom));

  if (aspect === null) return { x: left, y: top, width: right - left, height: bottom - top };

  const corner = (goesEast || goesWest) && (goesNorth || goesSouth);
  let width = right - left;
  let height = bottom - top;

  if (corner) {
    // Anchored at the opposite corner.
    if (width >= height * aspect) height = width / aspect;
    else width = height * aspect;
    const room = { w: goesEast ? 1 - left : right, h: goesSouth ? 1 - top : bottom };
    const fit = Math.min(1, room.w / width, room.h / height);
    width *= fit;
    height *= fit;
    const lift = Math.max(1, min / width, min / height);
    width *= lift;
    height *= lift;
    const x = goesEast ? left : right - width;
    const y = goesSouth ? top : bottom - height;
    return clampRect({ x, y, width, height });
  }

  const centreX = rect.x + rect.width / 2;
  const centreY = rect.y + rect.height / 2;
  if (goesNorth || goesSouth) {
    width = height * aspect;
    const room = { w: 2 * Math.min(centreX, 1 - centreX), h: goesSouth ? 1 - top : bottom };
    const fit = Math.min(1, room.w / width, room.h / height);
    width *= fit;
    height *= fit;
    const lift = Math.max(1, min / width, min / height);
    width *= lift;
    height *= lift;
    return clampRect({ x: centreX - width / 2, y: goesSouth ? top : bottom - height, width, height });
  }
  height = width / aspect;
  const room = { w: goesEast ? 1 - left : right, h: 2 * Math.min(centreY, 1 - centreY) };
  const fit = Math.min(1, room.w / width, room.h / height);
  width *= fit;
  height *= fit;
  const lift = Math.max(1, min / width, min / height);
  width *= lift;
  height *= lift;
  return clampRect({ x: goesEast ? left : right - width, y: centreY - height / 2, width, height });
};

/** A crop's shape as the pair of fractions the maths above wants, from a pixel ratio. */
export const aspectInFractions = (ratio: number, imageWidth: number, imageHeight: number): number => (ratio * imageHeight) / imageWidth;
