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

// The dialog, driven the way a person drives it.
describe('uploading from the insert dialog', () => {
  let editor: HTMLElement;
  const dialog = () => document.querySelector('.rte-media-dialog') as HTMLElement;
  const q = (selector: string) => dialog().querySelector(selector) as HTMLElement;
  const choose = (f: File) => {
    const input = q('#file-input') as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: [f], configurable: true });
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const open = (config: Parameters<typeof MediaManagerPlugin>[0]) => {
    (MediaManagerPlugin(config).commands as any).insertImage(undefined, { contentElement: editor });
  };

  beforeEach(() => {
    document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p>Hello</p></div>';
    editor = document.querySelector('.rte-content') as HTMLElement;
  });
  afterEach(() => {
    document.querySelectorAll('.rte-media-overlay').forEach((n) => n.remove());
    document.body.innerHTML = '';
  });

  it('shows true progress, then moves to the URL tab with the stored address filled in', async () => {
    let finish!: (url: string) => void;
    let report!: (fraction: number) => void;
    open({
      uploadHandler: (_f, ctx) =>
        new Promise((resolve) => {
          report = (fraction) => ctx.onProgress?.({ loaded: fraction * 100, total: 100, fraction });
          finish = resolve as any;
        }),
    });

    choose(file());
    expect(q('#upload-progress').style.display).toBe('block');
    report(0.42);
    expect(q('#progress-text').textContent).toBe('Uploading… 42%');
    expect(q('#progress-bar').style.width).toBe('42%');
    expect(q('.rte-media-progress-track').getAttribute('aria-valuenow')).toBe('42');

    finish('https://cdn.test/cat.png');
    await vi.waitFor(() => expect((q('#url-input') as HTMLInputElement).value).toBe('https://cdn.test/cat.png'));
    expect(q('.tab-url').getAttribute('aria-selected')).toBe('true');
    expect((q('#insert-btn') as HTMLButtonElement).disabled).toBe(false);
  });

  it('says what went wrong, in an alert, and lets the same file be chosen again', async () => {
    let attempts = 0;
    open({
      uploadHandler: async () => {
        attempts++;
        if (attempts === 1) throw new Error('The server is busy. Try again.');
        return 'https://cdn.test/cat.png';
      },
    });
    const f = file();
    choose(f);
    await vi.waitFor(() => expect(q('#upload-error').hidden).toBe(false));
    expect(q('#upload-error').textContent).toBe('The server is busy. Try again.');
    expect(q('#upload-error').getAttribute('role')).toBe('alert');
    expect(q('#upload-progress').style.display).toBe('none');

    choose(f);
    await vi.waitFor(() => expect((q('#url-input') as HTMLInputElement).value).toBe('https://cdn.test/cat.png'));
  });

  it('rejects a file that is too large before sending anything', async () => {
    const handler = vi.fn(async () => 'x');
    open({ uploadHandler: handler, maxFileSize: 1000 });
    choose(file('big.png', 'image/png', 5000));
    await vi.waitFor(() => expect(q('#upload-error').hidden).toBe(false));
    expect(q('#upload-error').textContent).toMatch(/big\.png/);
    expect(handler).not.toHaveBeenCalled();
  });

  it('cancels with the Cancel upload button, with no error shown', async () => {
    let signal!: AbortSignal;
    open({ uploadHandler: (_f, ctx) => ((signal = ctx.signal!), new Promise(() => {})) });
    choose(file());
    q('.cancel-upload-btn').click();
    expect(signal.aborted).toBe(true);
    await vi.waitFor(() => expect(q('#upload-progress').style.display).toBe('none'));
    expect(q('#upload-error').hidden).toBe(true);
  });

  it('cancels the upload when the dialog is closed', () => {
    let signal!: AbortSignal;
    open({ uploadHandler: (_f, ctx) => ((signal = ctx.signal!), new Promise(() => {})) });
    choose(file());
    q('.cancel-btn').click();
    expect(signal.aborted).toBe(true);
    expect(document.querySelector('.rte-media-overlay')).toBeNull();
  });

  it('states the real limit in the drop zone, not a fixed 50MB', () => {
    open({ maxFileSize: 2 * 1024 * 1024 });
    expect(q('.rte-media-hint').textContent).toBe('Max file size: 2 MB');
    expect(q('.dropzone').getAttribute('aria-label')).toMatch(/Max file size: 2 MB/);
  });
});
