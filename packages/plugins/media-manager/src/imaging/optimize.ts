import { defaultCanvasDeps, encodeCanvas, loadImage, renderEdited, type CanvasDeps } from './canvas';
import { editedFileName, initialState, resolveFormat } from './geometry';

export interface OptimizeOptions {
  /** Pictures wider than this are scaled down to it. Default 2048. */
  maxWidth?: number;
  /** JPEG and WebP quality, 0..1. Default 0.85. */
  quality?: number;
  /** `webp` or `jpeg` to convert PNG and the like; `keep` writes what the picture was. Default `keep`. */
  format?: 'keep' | 'webp' | 'jpeg';
}

export interface ResolvedOptimize {
  maxWidth: number;
  quality: number;
  format: 'keep' | 'webp' | 'jpeg';
}

/** `true` is the defaults; a falsy value is off. */
export const resolveOptimize = (value: boolean | OptimizeOptions | undefined): ResolvedOptimize | null => {
  if (!value) return null;
  const options = value === true ? {} : value;
  return { maxWidth: options.maxWidth ?? 2048, quality: options.quality ?? 0.85, format: options.format ?? 'keep' };
};

/** Pictures worth re-encoding. GIFs may be animated and SVGs are not pixels, so they are left as they are. */
export const isOptimizable = (type: string): boolean => type === 'image/jpeg' || type === 'image/png' || type === 'image/webp';

export interface OptimizeDeps extends CanvasDeps {
  load: (file: File) => Promise<{ source: CanvasImageSource; width: number; height: number }>;
}

const defaultDeps: OptimizeDeps = {
  ...defaultCanvasDeps,
  load: async (file) => {
    const url = URL.createObjectURL(file);
    try {
      const image = await loadImage(url);
      return { source: image, width: image.naturalWidth, height: image.naturalHeight };
    } finally {
      URL.revokeObjectURL(url);
    }
  },
};

/**
 * A picture ready to be stored: scaled down when it is wider than `maxWidth`, and written in the format asked
 * for. Hands back the file untouched when there is nothing to gain (it is small, or the result would be larger),
 * and also when the browser cannot do it; an upload must not fail because it could not be made smaller.
 */
export const optimizeImageFile = async (
  file: File,
  options: ResolvedOptimize,
  deps: OptimizeDeps = defaultDeps,
): Promise<File> => {
  if (!isOptimizable(file.type)) return file;
  try {
    const { source, width, height } = await deps.load(file);
    const wanted = options.format === 'webp' ? 'image/webp' : options.format === 'jpeg' ? 'image/jpeg' : 'keep';
    const type = resolveFormat(wanted, file.type);
    const scales = width > options.maxWidth;
    const converts = type !== file.type;
    if (!scales && !converts) return file;

    const state = { ...initialState(), maxWidth: scales ? options.maxWidth : null, format: wanted, quality: options.quality } as const;
    const canvas = renderEdited(source, width, height, state, file.type, deps);
    const blob = await encodeCanvas(canvas, type, options.quality);
    // The browser writes what it can: asked for WebP, Safari answers PNG.
    if (blob.type && blob.type !== type && !converts) return file;
    if (!scales && blob.size >= file.size) return file;
    return new File([blob], editedFileName(file.name, blob.type || type).replace('-edited', ''), { type: blob.type || type });
  } catch {
    return file;
  }
};
