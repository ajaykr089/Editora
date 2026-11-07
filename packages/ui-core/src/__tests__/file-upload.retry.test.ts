import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-file-upload';

type Upload = HTMLElement & {
  setFiles(files: File[]): void;
  startUpload(): Promise<void>;
  retryUpload(file: File | string): Promise<void>;
  uploadRequest?: (context: { file: File }) => Promise<void>;
};

afterEach(() => { document.body.innerHTML = ''; });

describe('ui-file-upload retry', () => {
  it("Retry uploads only that file, and the others' states stay as they were", async () => {
    const el = document.createElement('ui-file-upload') as Upload;
    el.setAttribute('multiple', '');
    document.body.appendChild(el);
    const a = new File(['a'], 'a.txt', { type: 'text/plain' });
    const b = new File(['b'], 'b.txt', { type: 'text/plain' });
    const attempts: string[] = [];
    let failing = true;
    el.uploadRequest = async ({ file }) => {
      attempts.push(file.name);
      if (failing) throw new Error('Network down');
    };
    el.setFiles([a, b]);
    await el.startUpload();
    expect(attempts).toEqual(['a.txt', 'b.txt']);
    const statuses = () => Array.from(el.shadowRoot!.querySelectorAll('.status')).map((node) => node.getAttribute('data-state'));
    expect(statuses()).toEqual(['error', 'error']);

    failing = false;
    const retry = el.shadowRoot!.querySelector('button[aria-label="Retry a.txt"]') as HTMLButtonElement;
    expect(retry).not.toBeNull();
    retry.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(attempts).toEqual(['a.txt', 'b.txt', 'a.txt']);
    expect(statuses()).toEqual(['success', 'error']);

    await el.retryUpload(b);
    expect(statuses()).toEqual(['success', 'success']);
    // a file that already succeeded is not uploaded again
    await el.retryUpload(a);
    expect(attempts).toEqual(['a.txt', 'b.txt', 'a.txt', 'b.txt']);
  });
});
