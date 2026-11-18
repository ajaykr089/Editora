import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';

// The editor is built once per configuration, not once per attribute, and `content-change` reports a
// change once. A `plugins` or `toolbar` attribute used to rebuild the editor while the element was being
// upgraded (editor-ready fired once per attribute, plus once more), and every blur repeated the HTML
// that the debounced event had just reported.

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const probePlugin = () => ({
  name: 'probe',
  toolbar: [{ id: 'probe', label: 'Probe', command: 'probeCommand' }],
  commands: { probeCommand: () => true },
});

const seen = { ready: new Map<string, number>(), destroy: new Map<string, number>() };
const bump = (map: Map<string, number>, target: EventTarget | null) => {
  const id = (target as HTMLElement | null)?.id ?? '?';
  map.set(id, (map.get(id) ?? 0) + 1);
};
const readyCount = (id: string) => seen.ready.get(id) ?? 0;
const destroyCount = (id: string) => seen.destroy.get(id) ?? 0;

async function settle(el: HTMLElement) {
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) await sleep(25);
  return el.querySelector('.editora-content') as HTMLElement;
}

async function mount(id: string, attrs: Record<string, string> = {}) {
  const el = document.createElement('editora-editor') as any;
  el.id = id;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.innerHTML = '<p>start</p>';
  document.body.appendChild(el);
  const content = await settle(el);
  expect(content, 'editor content element').toBeTruthy();
  await sleep(50);
  return { el, content };
}

describe('<editora-editor> builds itself once', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    const loader = new PluginLoader();
    loader.register('probe', probePlugin);
    (RichTextEditorElement as any).__globalPluginLoader = loader;

    document.addEventListener('editor-ready', (e) => bump(seen.ready, e.target), true);
    document.addEventListener('editor-destroy', (e) => bump(seen.destroy, e.target), true);

    // The usual page: the markup is parsed first and the script that defines the element comes after
    // it, so every element is upgraded in place with all of its attributes already set.
    document.body.innerHTML = `
      <editora-editor id="up-none"><p>a</p></editora-editor>
      <editora-editor id="up-plugins" plugins="probe"><p>a</p></editora-editor>
      <editora-editor id="up-toolbar" toolbar="probeCommand"><p>a</p></editora-editor>
      <editora-editor id="up-both" plugins="probe" toolbar="probeCommand" theme="dark" readonly><p>a</p></editora-editor>`;
    customElements.define('editora-editor', RichTextEditorElement);
  });

  afterEach(() => {
    // The upgraded elements from beforeAll are checked by the first test only.
    document.querySelectorAll('editora-editor:not([id^="up-"])').forEach((el) => el.remove());
  });

  it.each(['up-none', 'up-plugins', 'up-toolbar', 'up-both'])(
    'upgrades %s with a single editor-ready and no rebuild',
    async (id) => {
      const el = document.getElementById(id) as HTMLElement;
      await settle(el);
      await sleep(300);
      expect(readyCount(id)).toBe(1);
      expect(destroyCount(id)).toBe(0);
      expect(el.querySelectorAll('.editora-content')).toHaveLength(1);
      expect(el.querySelectorAll('.editora-toolbar')).toHaveLength(1);
    },
  );

  it('keeps the configuration the attributes asked for', async () => {
    const el = document.getElementById('up-both') as HTMLElement;
    expect(el.querySelectorAll('.editora-toolbar button[data-command="probeCommand"]')).toHaveLength(1);
    expect(el.classList.contains('editora-theme-dark')).toBe(true);
    expect(el.classList.contains('editora-theme-light')).toBe(false);
    expect((el.querySelector('.editora-content') as HTMLElement).contentEditable).toBe('false');
  });

  it('rebuilds once for a change made after the editor is up', async () => {
    const { el } = await mount('late-one');
    expect(readyCount('late-one')).toBe(1);

    el.setAttribute('plugins', 'probe');
    await sleep(300);

    expect(readyCount('late-one')).toBe(2);
    expect(destroyCount('late-one')).toBe(1);
    expect(el.querySelectorAll('.editora-content')).toHaveLength(1);
  });

  it('rebuilds once for several changes made together', async () => {
    const { el } = await mount('late-many');

    el.setAttribute('plugins', 'probe');
    el.setAttribute('toolbar', 'probeCommand');
    el.setAttribute('toolbar-sticky', 'true');
    await sleep(300);

    expect(readyCount('late-many')).toBe(2);
    expect(destroyCount('late-many')).toBe(1);
    expect(el.querySelectorAll('.editora-toolbar button[data-command="probeCommand"]')).toHaveLength(1);
  });

  it('builds nothing if it is taken out of the page before it finished starting', async () => {
    const el = document.createElement('editora-editor') as any;
    el.id = 'gone';
    el.setAttribute('plugins', 'probe');
    document.body.appendChild(el);
    el.remove();
    await sleep(300);

    expect(readyCount('gone')).toBe(0);
    expect(el.querySelector('.editora-content')).toBeNull();
  });

  it('builds with the final configuration when attributes are set right after it is added', async () => {
    const el = document.createElement('editora-editor') as any;
    el.id = 'eager';
    document.body.appendChild(el);
    el.setAttribute('plugins', 'probe');
    el.setAttribute('toolbar', 'probeCommand');
    await settle(el);
    await sleep(300);

    expect(readyCount('eager')).toBe(1);
    expect(el.querySelectorAll('.editora-toolbar button[data-command="probeCommand"]')).toHaveLength(1);
  });
});

describe('<editora-editor> content-change', () => {
  const collect = (el: HTMLElement) => {
    const changes: string[] = [];
    el.addEventListener('content-change', (e) => changes.push((e as CustomEvent).detail.html));
    return changes;
  };
  const type = (content: HTMLElement, html: string) => {
    content.innerHTML = html;
    content.dispatchEvent(new Event('input', { bubbles: true }));
  };

  afterEach(() => {
    document.querySelectorAll('editora-editor:not([id^="up-"])').forEach((el) => el.remove());
  });

  it('fires once for an edit, however it is followed by a blur', async () => {
    const { el, content } = await mount('cc-edit');
    const changes = collect(el);

    type(content, '<p>edited</p>');
    await sleep(250);
    expect(changes).toEqual(['<p>edited</p>']);

    content.dispatchEvent(new Event('blur'));
    await sleep(50);
    expect(changes).toEqual(['<p>edited</p>']);
  });

  it('does not fire on blur when nothing changed', async () => {
    const { el, content } = await mount('cc-idle');
    const changes = collect(el);

    content.dispatchEvent(new Event('blur'));
    await sleep(250);

    expect(changes).toEqual([]);
  });

  it('flushes an edit that is still waiting for the debounce when the editor loses focus', async () => {
    const { el, content } = await mount('cc-flush');
    const changes = collect(el);

    type(content, '<p>quick</p>');
    content.dispatchEvent(new Event('blur'));
    expect(changes).toEqual(['<p>quick</p>']);

    await sleep(250);
    expect(changes).toEqual(['<p>quick</p>']);
  });

  it('still reports a change that was made without an input event', async () => {
    const { el, content } = await mount('cc-silent');
    const changes = collect(el);

    content.innerHTML = '<p>changed by a plugin</p>';
    content.dispatchEvent(new Event('blur'));

    expect(changes).toEqual(['<p>changed by a plugin</p>']);
  });

  it('reports each distinct edit once', async () => {
    const { el, content } = await mount('cc-two');
    const changes = collect(el);

    type(content, '<p>one</p>');
    await sleep(250);
    type(content, '<p>two</p>');
    await sleep(250);
    content.dispatchEvent(new Event('blur'));

    expect(changes).toEqual(['<p>one</p>', '<p>two</p>']);
  });
});
