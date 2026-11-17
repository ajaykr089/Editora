import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EditoraEditor } from '@editora/react';
import * as enterprise from '@editora/plugins/enterprise';
import * as lite from '@editora/plugins/lite';
import * as plugins from '@editora/plugins';

// What a Next.js `'use client'` page does on the server: build the plugin list while rendering
// (`plugins={[BoldPlugin(), ...]}`) and render <EditoraEditor /> to HTML. Hydration compares that HTML with
// the first client render, so it also has to come out the same every time.
const factories = (mod: Record<string, unknown>) =>
  Object.entries(mod).filter(([name, value]) => typeof value === 'function' && /Plugin$/.test(name)) as [string, () => unknown][];

describe('server rendering <EditoraEditor /> without a DOM', () => {
  let errors: ReturnType<typeof vi.spyOn>;
  let warnings: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    warnings = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('has no DOM here', () => {
    expect(typeof document).toBe('undefined');
  });

  it('renders the editor shell with no arguments', () => {
    const html = renderToString(createElement(EditoraEditor));
    expect(html).toContain('data-editora-editor="true"');
    expect(html).toContain('class="rte-content');
    expect(errors).not.toHaveBeenCalled();
    expect(warnings).not.toHaveBeenCalled();
  });

  it('renders with plugins, a toolbar and initial content, and renders the same markup every time', () => {
    const render = () =>
      renderToString(
        createElement(EditoraEditor, {
          plugins: [plugins.BoldPlugin(), plugins.ItalicPlugin(), plugins.HistoryPlugin(), plugins.TextColorPlugin(), plugins.TablePlugin()],
          defaultValue: '<p>Hello</p>',
          toolbar: { items: ['undo', 'redo', 'bold', 'italic', 'textColor', 'table'] },
        } as never),
      );
    const first = render();
    expect(first).toContain('data-command="toggleBold"');
    expect(first).toContain('data-command="undo"');
    expect(render()).toBe(first);
    expect(errors).not.toHaveBeenCalled();
    expect(warnings).not.toHaveBeenCalled();
  });

  it.each([
    ['@editora/plugins', plugins],
    ['@editora/plugins/lite', lite],
    ['@editora/plugins/enterprise', enterprise],
  ])('every plugin factory in %s can run on the server and render', (_name, mod) => {
    const list = factories(mod as Record<string, unknown>);
    expect(list.length).toBeGreaterThan(20);
    const built = list.map(([, factory]) => factory());
    expect(built.every((p) => p && typeof p === 'object')).toBe(true);
    const html = renderToString(createElement(EditoraEditor, { plugins: built } as never));
    expect(html).toContain('data-editora-editor="true"');
    expect(errors).not.toHaveBeenCalled();
    expect(warnings).not.toHaveBeenCalled();
  });
});
