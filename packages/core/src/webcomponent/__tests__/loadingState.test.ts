import { beforeAll, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';

// Plugins load on demand; meanwhile the element was an empty box with nothing to say why.
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('<editora-editor> while plugins load', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    if (!customElements.get('editora-editor')) customElements.define('editora-editor', RichTextEditorElement);
    const loader = new PluginLoader();
    loader.register('slow', async () => {
      await sleep(60);
      return { name: 'slow', toolbar: [{ label: 'Slow', command: 'slowCommand' }], commands: { slowCommand: () => true } } as any;
    });
    (RichTextEditorElement as any).__globalPluginLoader = loader;
  });

  it('is marked loading and busy, then clears both when ready', async () => {
    const el = document.createElement('editora-editor');
    el.setAttribute('plugins', 'slow');
    el.setAttribute('toolbar', 'slowCommand');
    const ready = new Promise((resolve) => el.addEventListener('editor-ready', resolve, { once: true }));
    document.body.appendChild(el);
    await sleep(20);
    expect(el.getAttribute('data-loading')).toBe('true');
    expect(el.getAttribute('aria-busy')).toBe('true');
    await ready;
    expect(el.hasAttribute('data-loading')).toBe(false);
    expect(el.hasAttribute('aria-busy')).toBe(false);
    el.remove();
  });
});
