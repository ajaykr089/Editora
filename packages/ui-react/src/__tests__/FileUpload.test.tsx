import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/FileUpload';
import '../../../ui-core/src/components/ui-file-upload';
import '../../../ui-core/src/components/ui-dropzone';

import { Dropzone, FileUpload } from '../components/FileUpload';

describe('FileUpload wrappers', () => {
  it('forwards file change events from ui-file-upload', async () => {
    let count = 0;
    const { container } = render(
      <FileUpload multiple onChange={(files) => { count = files.length; }} />
    );

    const el = container.querySelector('ui-file-upload') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('.input')).toBeTruthy();
    });

    const input = el?.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [file]
    });

    input!.dispatchEvent(new Event('change', { bubbles: true }));

    await waitFor(() => {
      expect(count).toBe(1);
    });
  });

  it('renders the specialized dropzone tag', () => {
    const { container } = render(<Dropzone />);
    expect(container.querySelector('ui-dropzone')).toBeTruthy();
  });

  it('syncs preview and progress attrs', () => {
    const { container } = render(
      <FileUpload showPreviews progress={{ 'notes.txt::5::1': 60 }} />
    );

    const el = container.querySelector('ui-file-upload') as HTMLElement | null;
    expect(el?.hasAttribute('show-previews')).toBe(true);
    expect(el?.getAttribute('progress')).toContain('60');
  });

  it('forwards upload lifecycle props and uploadRequest bridge', async () => {
    const events: string[] = [];
    const onUploadRequest = async ({ setProgress }: { setProgress(progress: number): void }) => {
      setProgress(55);
    };
    const { container } = render(
      <FileUpload
        uploadButtonText="Upload now"
        onUploadRequest={onUploadRequest}
        onUploadStart={() => events.push('start')}
        onUploadProgress={() => events.push('progress')}
        onUploadSuccess={() => events.push('success')}
        onUploadComplete={() => events.push('complete')}
      />
    );

    const el = container.querySelector('ui-file-upload') as (HTMLElement & {
      setFiles(files: File[]): void;
      startUpload(): Promise<void>;
      uploadRequest?: unknown;
    }) | null;

    expect(typeof el?.uploadRequest).toBe('function');
    expect(el?.getAttribute('upload-button-text')).toBe('Upload now');

    const file = new File(['hello'], 'notes.txt', { type: 'text/plain', lastModified: 3 });
    el?.setFiles([file]);
    await el?.startUpload();

    await waitFor(() => {
      expect(events).toEqual(['start', 'progress', 'success', 'complete']);
    });
  });

  it('syncs upload-on-select attribute', () => {
    const { container } = render(<FileUpload uploadOnSelect />);
    const el = container.querySelector('ui-file-upload') as HTMLElement | null;
    expect(el?.hasAttribute('upload-on-select')).toBe(true);
  });
});
