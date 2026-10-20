import type { CanvasDeps } from '../imaging/canvas';

type Call = [string, ...unknown[]];
export interface FakeCanvas extends HTMLCanvasElement {
  calls: Call[];
  blobSize: number;
}

/** jsdom has no canvas: this one writes down what it is asked to draw. */
export const fakeDeps = (options: { noContext?: boolean; blobSize?: number; blobType?: string } = {}) => {
  const canvases: FakeCanvas[] = [];
  const blobSize = options.blobSize ?? 100;
  const deps: CanvasDeps = {
    createCanvas: (width, height) => {
      const calls: Call[] = [];
      const context = {
        imageSmoothingQuality: '',
        fillStyle: '',
        translate: (...a: unknown[]) => calls.push(['translate', ...a]),
        rotate: (...a: unknown[]) => calls.push(['rotate', ...a]),
        scale: (...a: unknown[]) => calls.push(['scale', ...a]),
        drawImage: (...a: unknown[]) => calls.push(['drawImage', ...a.slice(1)]),
        fillRect: (...a: unknown[]) => calls.push(['fillRect', ...a]),
      };
      const canvas = {
        width,
        height,
        calls,
        blobSize,
        getContext: () => (options.noContext ? null : context),
        toBlob(cb: (b: Blob | null) => void, type: string) {
          cb(new Blob(['x'.repeat(blobSize)], { type: options.blobType ?? type }));
        },
      } as unknown as FakeCanvas;
      canvases.push(canvas);
      return canvas;
    },
  };
  return { deps, canvases };
};
