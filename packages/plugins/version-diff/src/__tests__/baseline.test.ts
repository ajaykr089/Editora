import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { VersionDiffPlugin } from '../VersionDiffPlugin.native';

// Which baseline the dialog compares against: the one passed to the plugin, the one the user set,
// or (only when neither exists) the content the editor started with.

const flush = async () => {
  for (let i = 0; i < 5; i++) await new Promise((resolve) => setTimeout(resolve, 0));
};

function mountEditor(html: string, root?: { initial?: string }) {
  const host = document.createElement('div');
  host.className = 'editora-editor';
  if (root?.initial) host.setAttribute('data-initial-content', root.initial);
  const content = document.createElement('div');
  content.className = 'editora-content';
  content.setAttribute('contenteditable', 'true');
  content.innerHTML = html;
  host.appendChild(content);
  document.body.appendChild(host);
  return content;
}

/** What the user does before opening the dialog: click into the editor. */
function focusEditor(content: HTMLElement) {
  content.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
}

async function open(plugin: ReturnType<typeof VersionDiffPlugin>, content: HTMLElement, args?: unknown) {
  (plugin.commands as any).openVersionDiff(args, { contentElement: content });
  await flush();
  const overlay = document.querySelector('.rte-version-diff-overlay') as HTMLElement;
  expect(overlay, 'dialog overlay').toBeTruthy();
  return {
    overlay,
    baselineText: overlay.querySelector('[data-side="baseline"]')?.textContent ?? '',
    summary: overlay.querySelector('.rte-version-diff-summary')?.textContent ?? '',
    showsNoChanges: Boolean(overlay.querySelector('.rte-version-diff-empty')),
  };
}

describe('VersionDiffPlugin baseline', () => {
  let plugin: ReturnType<typeof VersionDiffPlugin> | undefined;

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.querySelector<HTMLElement>('.rte-version-diff-overlay')?.remove();
    plugin?.destroy?.();
    plugin = undefined;
    document.body.innerHTML = '';
  });

  it('compares against the baselineHtml option, even after the editor has been focused', async () => {
    plugin = VersionDiffPlugin({ baselineHtml: '<p>Approved</p>' });
    plugin.init?.({} as any);
    const content = mountEditor('<p>Edited</p>', { initial: '<p>Edited</p>' });
    focusEditor(content);

    const dialog = await open(plugin, content);

    expect(dialog.baselineText).toContain('Approved');
    expect(dialog.baselineText).not.toContain('Edited');
    expect(dialog.showsNoChanges).toBe(false);
  });

  it('uses the baselineHtml option when the editor was never focused', async () => {
    plugin = VersionDiffPlugin({ baselineHtml: '<p>Approved</p>' });
    plugin.init?.({} as any);
    const content = mountEditor('<p>Edited</p>');

    const dialog = await open(plugin, content);

    expect(dialog.baselineText).toContain('Approved');
  });

  it('falls back to the content the editor started with when there is no baselineHtml', async () => {
    plugin = VersionDiffPlugin();
    plugin.init?.({} as any);
    const content = mountEditor('<p>Edited</p>', { initial: '<p>Started</p>' });
    focusEditor(content);

    const dialog = await open(plugin, content);

    expect(dialog.baselineText).toContain('Started');
    expect(dialog.baselineText).not.toContain('Edited');
  });

  it('lets a baseline set at run time win over the baselineHtml option', async () => {
    plugin = VersionDiffPlugin({ baselineHtml: '<p>Approved</p>' });
    plugin.init?.({} as any);
    const content = mountEditor('<p>Edited</p>');
    focusEditor(content);

    (plugin.commands as any).setVersionDiffBaseline('<p>Saved</p>', { contentElement: content });
    const dialog = await open(plugin, content);

    expect(dialog.baselineText).toContain('Saved');
    expect(dialog.baselineText).not.toContain('Approved');
  });

  it('keeps the baseline the user set with "Set Current as Baseline"', async () => {
    plugin = VersionDiffPlugin({ baselineHtml: '<p>Approved</p>' });
    plugin.init?.({} as any);
    const content = mountEditor('<p>Edited</p>');
    focusEditor(content);

    const first = await open(plugin, content);
    first.overlay.querySelector<HTMLButtonElement>('.rte-version-diff-set-baseline')!.click();
    await flush();
    first.overlay.remove();

    content.innerHTML = '<p>Again</p>';
    const second = await open(plugin, content);

    expect(second.baselineText).toContain('Edited');
    expect(second.baselineText).not.toContain('Approved');
  });

  it('prefers getBaselineHtml over the baselineHtml option', async () => {
    plugin = VersionDiffPlugin({
      baselineHtml: '<p>Approved</p>',
      getBaselineHtml: async () => '<p>Server</p>',
    });
    plugin.init?.({} as any);
    const content = mountEditor('<p>Edited</p>');
    focusEditor(content);

    const dialog = await open(plugin, content);

    expect(dialog.baselineText).toContain('Server');
  });
});
