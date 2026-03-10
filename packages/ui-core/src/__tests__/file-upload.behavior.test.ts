import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-file-upload';
import '../components/ui-dropzone';
import '../components/ui-form';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-file-upload', () => {
  it('collects files from the hidden input and emits change', async () => {
    const el = document.createElement('ui-file-upload');
    el.setAttribute('multiple', '');
    document.body.appendChild(el);
    await flushMicrotask();

    let count = 0;
    el.addEventListener('change', (event) => {
      count = ((event as CustomEvent<{ files: File[] }>).detail.files || []).length;
    });

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    const fileA = new File(['alpha'], 'alpha.txt', { type: 'text/plain' });
    const fileB = new File(['beta'], 'beta.txt', { type: 'text/plain' });
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [fileA, fileB]
    });

    input!.dispatchEvent(new Event('change', { bubbles: true }));

    expect(count).toBe(2);
    expect(el.shadowRoot?.querySelectorAll('.file').length).toBe(2);
  });

  it('registers file arrays with ui-form', async () => {
    const form = document.createElement('ui-form') as HTMLElement & { getValues(): Record<string, unknown> };
    form.innerHTML = `<ui-file-upload name="attachments"></ui-file-upload>`;
    document.body.appendChild(form);
    await flushMicrotask();

    const upload = form.querySelector('ui-file-upload') as HTMLElement;
    const input = upload.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    const file = new File(['demo'], 'demo.pdf', { type: 'application/pdf' });
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [file]
    });

    input!.dispatchEvent(new Event('change', { bubbles: true }));
    expect(form.getValues().attachments).toEqual([file]);
  });

  it('uses dropzone surface on ui-dropzone', async () => {
    const el = document.createElement('ui-dropzone');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.getAttribute('surface')).toBe('dropzone');
  });

  it('renders previews and progress when configured', async () => {
    const createObjectURL = URL.createObjectURL;
    const revokeObjectURL = URL.revokeObjectURL;
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: () => 'blob:preview'
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: () => {}
    });

    const el = document.createElement('ui-file-upload');
    el.setAttribute('show-previews', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    const image = new File(['img'], 'photo.png', { type: 'image/png', lastModified: 1 });
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [image]
    });
    input!.dispatchEvent(new Event('change', { bubbles: true }));

    el.setAttribute('progress', JSON.stringify({ 'photo.png::3::1': 55 }));
    await flushMicrotask();

    expect(el.shadowRoot?.querySelector('.preview img')).toBeTruthy();
    const bar = el.shadowRoot?.querySelector('.progress-bar') as HTMLElement | null;
    expect(bar?.style.inlineSize || bar?.style.width).toContain('55');

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL
    });
  });

  it('applies accept and max-files validation to setFiles()', async () => {
    const el = document.createElement('ui-file-upload') as HTMLElement & { setFiles(files: File[]): void };
    el.setAttribute('accept', 'text/plain');
    el.setAttribute('max-files', '1');
    document.body.appendChild(el);
    await flushMicrotask();

    let latestRejected: Array<{ reason: string }> = [];
    el.addEventListener('reject', (event) => {
      latestRejected = (event as CustomEvent<{ rejected: Array<{ reason: string }> }>).detail.rejected || [];
    });

    el.setFiles([
      new File(['bad'], 'image.png', { type: 'image/png' }),
      new File(['good'], 'note.txt', { type: 'text/plain' }),
      new File(['extra'], 'extra.txt', { type: 'text/plain' })
    ]);
    await flushMicrotask();

    expect(el.shadowRoot?.querySelectorAll('.file').length).toBe(1);
    expect((el.shadowRoot?.querySelector('.file-name') as HTMLElement | null)?.textContent).toBe('note.txt');
    expect(latestRejected.map((entry) => entry.reason)).toEqual(['accept', 'max-files']);
  });

  it('supports explicit upload start with progress and success events', async () => {
    const el = document.createElement('ui-file-upload') as HTMLElement & {
      setFiles(files: File[]): void;
      startUpload(): Promise<void>;
      uploadRequest?: (context: { file: File; setProgress(progress: number): void }) => Promise<void>;
    };
    document.body.appendChild(el);
    await flushMicrotask();

    const file = new File(['alpha'], 'alpha.txt', { type: 'text/plain', lastModified: 1 });
    const events: string[] = [];
    el.addEventListener('upload-start', () => events.push('start'));
    el.addEventListener('upload-progress', () => events.push('progress'));
    el.addEventListener('upload-success', () => events.push('success'));
    el.addEventListener('upload-complete', () => events.push('complete'));

    el.uploadRequest = async ({ setProgress }) => {
      setProgress(40);
      setProgress(100);
    };
    el.setFiles([file]);
    await el.startUpload();

    const status = el.shadowRoot?.querySelector('.status') as HTMLElement | null;
    expect(status?.textContent).toBe('Uploaded');
    expect(events).toEqual(['start', 'progress', 'progress', 'success', 'complete']);
  });

  it('cancels in-flight uploads and exposes retry state', async () => {
    const el = document.createElement('ui-file-upload') as HTMLElement & {
      setFiles(files: File[]): void;
      startUpload(): Promise<void>;
      cancelUploads(): void;
      uploadRequest?: (context: { signal: AbortSignal; setProgress(progress: number): void }) => Promise<void>;
    };
    document.body.appendChild(el);
    await flushMicrotask();

    const file = new File(['alpha'], 'alpha.txt', { type: 'text/plain', lastModified: 2 });
    let cancelCount = 0;
    el.addEventListener('upload-cancel', () => {
      cancelCount += 1;
    });

    el.uploadRequest = ({ signal, setProgress }) => new Promise<void>((resolve, reject) => {
      setProgress(20);
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    });
    el.setFiles([file]);
    const uploadPromise = el.startUpload();
    el.cancelUploads();
    await uploadPromise;

    const status = el.shadowRoot?.querySelector('.status') as HTMLElement | null;
    expect(status?.textContent).toBe('Canceled');
    expect(cancelCount).toBe(1);
    expect((el.shadowRoot?.querySelector('.list .file-remove') as HTMLButtonElement | null)?.textContent).toBe('Remove');
  });

  it('auto-starts upload on selection when configured', async () => {
    const el = document.createElement('ui-file-upload') as HTMLElement & {
      uploadRequest?: () => Promise<void>;
    };
    el.setAttribute('upload-on-select', '');
    const uploadRequest = vi.fn(async () => {});
    el.uploadRequest = uploadRequest;
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    const file = new File(['demo'], 'demo.pdf', { type: 'application/pdf' });
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [file]
    });
    input!.dispatchEvent(new Event('change', { bubbles: true }));
    await flushMicrotask();
    await flushMicrotask();

    expect(uploadRequest).toHaveBeenCalledTimes(1);
  });
});
