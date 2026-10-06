import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';

// The editing surface is exposed as role="textbox"; a textbox without an accessible name is
// announced by screen readers as just "edit text, multi line" (WCAG 4.1.2).

async function mount(attrs: Record<string, string> = {}, config?: Record<string, unknown>) {
  const el = document.createElement('editora-editor') as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (config) el.jsConfig = config;
  document.body.appendChild(el);
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  const content = el.querySelector('.editora-content') as HTMLElement | null;
  expect(content, 'editor content element').toBeTruthy();
  return { el, content: content! };
}

describe('<editora-editor> accessible name', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    (RichTextEditorElement as any).__globalPluginLoader = new PluginLoader();
    if (!customElements.get('editora-editor')) {
      customElements.define('editora-editor', RichTextEditorElement);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('names the surface even with the default configuration', async () => {
    const { content } = await mount();
    expect(content.getAttribute('role')).toBe('textbox');
    expect(content.getAttribute('aria-label')?.trim()).toBeTruthy();
  });

  it('falls back to a generic name when the placeholder is empty and there is no aria-label', async () => {
    const { content } = await mount({}, { placeholder: '' });
    expect(content.getAttribute('aria-label')).toBe('Rich text editor');
  });

  it('uses the placeholder when there is one', async () => {
    const { content } = await mount({ placeholder: 'Write a note…' });
    expect(content.getAttribute('aria-label')).toBe('Write a note…');
  });

  it('prefers an aria-label set on the host over the placeholder', async () => {
    const { content } = await mount({ placeholder: 'Write a note…', 'aria-label': 'Release notes' });
    expect(content.getAttribute('aria-label')).toBe('Release notes');
  });

  it('follows changes to aria-label and placeholder', async () => {
    const { el, content } = await mount({ 'aria-label': 'Draft' });
    expect(content.getAttribute('aria-label')).toBe('Draft');

    el.setAttribute('aria-label', 'Final');
    expect(content.getAttribute('aria-label')).toBe('Final');

    el.removeAttribute('aria-label');
    el.setAttribute('placeholder', 'Type here');
    expect(content.getAttribute('aria-label')).toBe('Type here');
  });

  it('adds no role or name when ARIA support is switched off', async () => {
    const { content } = await mount({}, { accessibility: { enableARIA: false } });
    expect(content.hasAttribute('role')).toBe(false);
    expect(content.hasAttribute('aria-label')).toBe(false);
  });
});
