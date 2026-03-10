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
});
