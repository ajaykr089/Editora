import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';

// setConfig() rebuilds the editor from a new set of options. `content` and `theme` were accepted and
// then dropped: the old content came back, and the new theme class piled up next to the old one.

async function settle(el: HTMLElement) {
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  return el.querySelector('.editora-content') as HTMLElement;
}

async function mount(html = '<p>old text</p>', attrs: Record<string, string> = {}) {
  const el = document.createElement('editora-editor') as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.innerHTML = html;
  document.body.appendChild(el);
  const content = await settle(el);
  expect(content, 'editor content element').toBeTruthy();
  return el;
}

const themeClasses = (el: HTMLElement) => Array.from(el.classList).filter((c) => c.startsWith('editora-theme-'));

describe('<editora-editor> setConfig()', () => {
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

  describe('content', () => {
    it('replaces the content of an editor that is already running', async () => {
      const el = await mount();
      await el.setConfig({ content: '<p>new text</p>' });
      await settle(el);
      expect(el.getContent()).toBe('<p>new text</p>');
    });

    it('can empty the editor', async () => {
      const el = await mount();
      await el.setConfig({ content: '' });
      await settle(el);
      expect(el.querySelector('.editora-content').textContent).toBe('');
    });

    it('sanitises the content it is given', async () => {
      const el = await mount();
      await el.setConfig({ content: '<p>kept</p><img src="x" onerror="window.__pwned = 1"><script>window.__pwned = 2</script>' });
      await settle(el);
      const content = el.querySelector('.editora-content') as HTMLElement;
      expect(content.innerHTML).toContain('kept');
      expect(content.querySelector('script')).toBeNull();
      expect(content.querySelector('[onerror]')).toBeNull();
    });

    it('uses the content when setConfig is called before the element is in the page', async () => {
      const el = document.createElement('editora-editor') as any;
      await el.setConfig({ content: '<p>from the config</p>' });
      document.body.appendChild(el);
      await settle(el);
      expect(el.getContent()).toBe('<p>from the config</p>');
    });

    it('wins over the markup the element was written with', async () => {
      const el = document.createElement('editora-editor') as any;
      el.innerHTML = '<p>from the markup</p>';
      await el.setConfig({ content: '<p>from the config</p>' });
      document.body.appendChild(el);
      await settle(el);
      expect(el.getContent()).toBe('<p>from the config</p>');
    });

    it('keeps what the user typed when the new options have no content', async () => {
      const el = await mount();
      (el.querySelector('.editora-content') as HTMLElement).innerHTML = '<p>typed by the user</p>';
      await el.setConfig({ height: 300 });
      await settle(el);
      expect(el.getContent()).toBe('<p>typed by the user</p>');
    });

    it('does not bring the config content back when the editor is rebuilt later', async () => {
      const el = await mount();
      await el.setConfig({ content: '<p>from the config</p>' });
      await settle(el);
      (el.querySelector('.editora-content') as HTMLElement).innerHTML = '<p>typed afterwards</p>';

      el.setAttribute('toolbar', 'bold');
      for (let i = 0; i < 20; i++) await new Promise((r) => setTimeout(r, 25));

      expect(el.getContent()).toBe('<p>typed afterwards</p>');
    });
  });

  describe('theme', () => {
    it('swaps the theme class instead of adding to it', async () => {
      const el = await mount('<p>x</p>', { theme: 'light' });
      expect(themeClasses(el)).toEqual(['editora-theme-light']);

      await el.setConfig({ theme: 'dark' });
      await settle(el);
      expect(themeClasses(el)).toEqual(['editora-theme-dark']);

      await el.setConfig({ theme: 'light' });
      await settle(el);
      expect(themeClasses(el)).toEqual(['editora-theme-light']);
    });

    it('still swaps the class when the attribute changes afterwards', async () => {
      const el = await mount('<p>x</p>', { theme: 'light' });
      await el.setConfig({ theme: 'dark' });
      await settle(el);

      el.setAttribute('theme', 'dark-blue');
      expect(themeClasses(el)).toEqual(['editora-theme-dark-blue']);
    });

    it('removes every theme class when the attribute changes, however many there are', async () => {
      const el = await mount('<p>x</p>', { theme: 'light' });
      el.classList.add('editora-theme-extra', 'editora-theme-other');

      el.setAttribute('theme', 'dark');
      expect(themeClasses(el)).toEqual(['editora-theme-dark']);
    });

    it('leaves unrelated classes alone', async () => {
      const el = await mount('<p>x</p>', { theme: 'light' });
      el.classList.add('my-class');
      await el.setConfig({ theme: 'dark' });
      await settle(el);
      expect(el.classList.contains('my-class')).toBe(true);
      expect(el.classList.contains('editora-editor')).toBe(true);
    });
  });
});
