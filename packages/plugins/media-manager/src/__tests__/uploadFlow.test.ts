import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaManagerPlugin } from '../MediaManagerPlugin.native';
import { DEFAULT_ALLOWED_TYPES, setMediaManagerConfig } from '../constants';
import { acceptFor, isTypeAllowed, uploadMedia, validateFile } from '../uploadService';

const file = (name = 'cat.png', type = 'image/png', size = 3) => {
  const f = new File(['x'.repeat(Math.min(size, 10))], name, { type });
  Object.defineProperty(f, 'size', { value: size });
  return f;
};

afterEach(() => {
  setMediaManagerConfig({ provider: undefined, uploadHandler: undefined, apiUrl: undefined, fallbackToBase64: undefined, maxFileSize: 10 * 1024 * 1024 });
});

describe('what may be uploaded', () => {
  it('matches exact types and image/* wildcards, ignoring case', () => {
    expect(isTypeAllowed('image/webp', ['image/*'])).toBe(true);
    expect(isTypeAllowed('IMAGE/PNG', ['image/png'])).toBe(true);
    expect(isTypeAllowed('video/mp4', ['image/*'])).toBe(false);
    expect(isTypeAllowed('anything/else', undefined)).toBe(true);
  });

  it('accepts WebP and AVIF by default', () => {
    expect(isTypeAllowed('image/webp', DEFAULT_ALLOWED_TYPES)).toBe(true);
    expect(isTypeAllowed('image/avif', DEFAULT_ALLOWED_TYPES)).toBe(true);
  });

  it('narrows the file chooser to the kind being inserted', () => {
    expect(acceptFor('image')).toContain('image/png');
    expect(acceptFor('image')).not.toContain('video/');
    expect(acceptFor('video')).toContain('video/mp4');
    expect(acceptFor('image', { allowedTypes: ['video/mp4'] })).toBe('image/*');
  });

  it('rejects a file that is too large or of the wrong type, with a message a person can act on', async () => {
    await expect(uploadMedia(file('big.png', 'image/png', 30 * 1024 * 1024))).rejects.toMatchObject({
      code: 'too-large',
      message: expect.stringMatching(/big\.png is 30 MB\. The limit is 10 MB/),
    });
    await expect(uploadMedia(file('doc.pdf', 'application/pdf'))).rejects.toMatchObject({ code: 'type-not-allowed' });
    expect(() => validateFile(file(), { allowedTypes: ['image/png'], maxFileSize: 100 })).not.toThrow();
  });

  it('lets a per-plugin limit override the global one', async () => {
    await expect(uploadMedia(file('a.png', 'image/png', 2000), { config: { maxFileSize: 1000 } })).rejects.toMatchObject({ code: 'too-large' });
  });
});

describe('sending the file', () => {
  it('reports progress from the provider, and resolves with what it stored', async () => {
    const fractions: number[] = [];
    const item = await uploadMedia(file(), {
      config: {
        uploadHandler: async (_f, ctx) => {
          ctx.onProgress?.({ loaded: 1, total: 3, fraction: 1 / 3 });
          return 'https://cdn.test/cat.png';
        },
      },
      onProgress: ({ fraction }) => fractions.push(fraction),
    });
    expect(item.src).toBe('https://cdn.test/cat.png');
    expect(fractions).toEqual([1 / 3]);
  });

  it('shows the error by default, and falls back to a data URL only when asked to', async () => {
    const failing = async () => {
      throw new Error('Server down');
    };
    await expect(uploadMedia(file(), { config: { uploadHandler: failing } })).rejects.toMatchObject({ message: 'Server down' });
    const item = await uploadMedia(file(), { config: { uploadHandler: failing, fallbackToBase64: true } });
    expect(item.src).toMatch(/^data:/);
  });

  it('does not fall back after a cancel', async () => {
    const controller = new AbortController();
    const pending = uploadMedia(file(), { signal: controller.signal, config: { uploadHandler: () => new Promise(() => {}), fallbackToBase64: true } });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ code: 'aborted' });
  });
});

