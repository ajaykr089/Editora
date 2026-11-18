import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';

// `disabled` has to do what it does on a form control: nothing can be typed, no toolbar button can be
// pressed, and the control leaves the tab order. It used to be accepted and ignored.

const probeCommand = vi.fn(() => true);

function probePlugin() {
  return {
    name: 'probe',
    toolbar: [
      { id: 'probe', label: 'Probe', command: 'probeCommand' },
      { id: 'other', label: 'Other', command: 'otherCommand' },
    ],
    commands: { probeCommand, otherCommand: () => true },
  };
}

async function mount(attrs: Record<string, string> = {}, config: Record<string, unknown> = {}) {
  const el = document.createElement('editora-editor') as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.jsConfig = { plugins: [probePlugin()], ...config };
  el.innerHTML = '<p>hello</p>';
  document.body.appendChild(el);
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  const content = el.querySelector('.editora-content') as HTMLElement | null;
  expect(content, 'editor content element').toBeTruthy();
  const buttons = () => Array.from(el.querySelectorAll('.editora-toolbar button[data-command]')) as HTMLButtonElement[];
  expect(buttons().length, 'toolbar buttons').toBe(2);
  return { el, content: content!, buttons };
}

describe('<editora-editor disabled>', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    (RichTextEditorElement as any).__globalPluginLoader = new PluginLoader();
    if (!customElements.get('editora-editor')) {
      customElements.define('editora-editor', RichTextEditorElement);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
    probeCommand.mockClear();
  });

  it('is enabled by default', async () => {
    const { el, content, buttons } = await mount();
    expect(content.contentEditable).toBe('true');
    expect(content.getAttribute('aria-disabled')).toBe('false');
    expect(content.tabIndex).toBe(0);
    expect(buttons().every((b) => !b.disabled)).toBe(true);
    expect(el.classList.contains('editora-disabled')).toBe(false);
  });

  it.each([['disabled', ''], ['disabled', 'true'], ['disabled', 'disabled']])(
    'locks the content and the toolbar for %s="%s"',
    async (name, value) => {
      const { el, content, buttons } = await mount({ [name]: value });
      expect(content.contentEditable).toBe('false');
      expect(content.getAttribute('aria-disabled')).toBe('true');
      expect(content.tabIndex).toBe(-1);
      expect(buttons().every((b) => b.disabled)).toBe(true);
      expect(el.classList.contains('editora-disabled')).toBe(true);
    },
  );

  it('does not run a command from a disabled toolbar button', async () => {
    const { buttons } = await mount({ disabled: '' });
    buttons()[0].click();
    expect(probeCommand).not.toHaveBeenCalled();
  });

  it('treats disabled="false" as enabled', async () => {
    const { el, content, buttons } = await mount({ disabled: 'false' });
    expect(content.contentEditable).toBe('true');
    expect(buttons().every((b) => !b.disabled)).toBe(true);
    expect(el.classList.contains('editora-disabled')).toBe(false);
  });

  it('honours disabled passed through setConfig / jsConfig', async () => {
    const { el, content, buttons } = await mount({}, { disabled: true });
    expect(content.contentEditable).toBe('false');
    expect(buttons().every((b) => b.disabled)).toBe(true);
    expect(el.classList.contains('editora-disabled')).toBe(true);
  });

  it('follows the attribute when it is added and removed', async () => {
    const { el, content, buttons } = await mount();

    el.setAttribute('disabled', '');
    expect(content.contentEditable).toBe('false');
    expect(content.getAttribute('aria-disabled')).toBe('true');
    expect(buttons().every((b) => b.disabled)).toBe(true);

    el.removeAttribute('disabled');
    expect(content.contentEditable).toBe('true');
    expect(content.getAttribute('aria-disabled')).toBe('false');
    expect(content.tabIndex).toBe(0);
    expect(buttons().every((b) => !b.disabled)).toBe(true);
    expect(el.classList.contains('editora-disabled')).toBe(false);
  });

  it('gives back only the buttons it disabled', async () => {
    const { el, buttons } = await mount();
    buttons()[1].disabled = true; // a plugin that has no use for this button right now

    el.setAttribute('disabled', '');
    el.removeAttribute('disabled');

    expect(buttons()[0].disabled).toBe(false);
    expect(buttons()[1].disabled).toBe(true);
  });

  it('stays read-only when disabled is removed but readonly is still set', async () => {
    const { el, content } = await mount({ readonly: '', disabled: '' });
    expect(content.contentEditable).toBe('false');

    el.removeAttribute('disabled');
    expect(content.contentEditable).toBe('false');

    el.removeAttribute('readonly');
    expect(content.contentEditable).toBe('true');
  });

  it('stays disabled when readonly is removed', async () => {
    const { el, content } = await mount({ readonly: '', disabled: '' });
    el.removeAttribute('readonly');
    expect(content.contentEditable).toBe('false');
  });

  it('is still locked after the editor is rebuilt', async () => {
    const { el } = await mount({ disabled: '' });
    el.setAttribute('toolbar', 'probeCommand otherCommand');
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 25));
    }
    const content = el.querySelector('.editora-content') as HTMLElement;
    expect(content.contentEditable).toBe('false');
    const buttons = Array.from(el.querySelectorAll('.editora-toolbar button[data-command]')) as HTMLButtonElement[];
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons.every((b) => b.disabled)).toBe(true);
  });
});
