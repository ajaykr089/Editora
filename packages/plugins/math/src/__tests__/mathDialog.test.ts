import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MathPlugin } from '../MathPlugin.native';

let editor: HTMLElement;

/** The dialog is built after KaTeX has loaded, so it appears a moment after the command. */
const open = async () => {
  (MathPlugin().commands as any).insertMath(undefined, { contentElement: editor });
  await vi.waitFor(() => expect(document.querySelector('.math-dialog-overlay')).not.toBeNull(), { timeout: 5000 });
  vi.advanceTimersByTime(5);
  return document.querySelector('[data-rte-dialog]') as HTMLElement;
};

/** The name a screen reader gives a control: aria-label, aria-labelledby, a label for it, a label around it, or its own text. */
function accessibleName(control: HTMLElement): string {
  const label = control.getAttribute('aria-label');
  if (label) return label.trim();
  const by = control.getAttribute('aria-labelledby');
  if (by) return by.split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim();
  const labels = (control as HTMLInputElement).labels;
  if (labels && labels.length) return Array.from(labels).map((l) => l.textContent ?? '').join(' ').trim();
  return (control.textContent ?? '').trim();
}

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p>Alpha</p></div>';
  editor = document.querySelector('.rte-content') as HTMLElement;
});

afterEach(() => {
  document.querySelectorAll('[data-rte-dialog]').forEach((node) => node.remove());
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('the math dialog', () => {
  it('gives every control a name', async () => {
    const dialog = await open();
    const controls = Array.from(dialog.querySelectorAll<HTMLElement>('input, textarea, select, button'));
    expect(controls.length).toBeGreaterThan(8);
    const unnamed = controls.filter((control) => accessibleName(control).length === 0).map((c) => c.id || c.className || c.tagName);
    expect(unnamed).toEqual([]);
  });

  it('ties the Formula label to its field, so activating the label focuses it', async () => {
    const dialog = await open();
    const field = dialog.querySelector('#formula-input') as HTMLTextAreaElement;
    expect(field.labels?.[0]?.textContent).toMatch(/Formula/);
  });

  it('names the format choice as a group, and the templates', async () => {
    const dialog = await open();
    const group = dialog.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(accessibleName(group)).toMatch(/Format/);
    expect(accessibleName(dialog.querySelector('#templates-grid') as HTMLElement)).toMatch(/Templates/);
  });

  it('shows every template without a second scroll area inside the dialog\'s own, which hid the last row', async () => {
    const dialog = await open();
    const grid = dialog.querySelector('#templates-grid') as HTMLElement;
    expect(grid.style.maxHeight).toBe('');
    expect(grid.style.overflowY).toBe('');
    expect(grid.querySelectorAll('button').length).toBeGreaterThan(8);
  });

  it('announces the preview as it changes', async () => {
    const dialog = await open();
    const preview = dialog.querySelector('#preview-area') as HTMLElement;
    expect(preview.getAttribute('role')).toBe('status');
    expect(accessibleName(preview)).toMatch(/Preview/);
  });
});

describe('loading KaTeX', () => {
  const typeFormula = (dialog: HTMLElement, formula: string) => {
    const field = dialog.querySelector('#formula-input') as HTMLTextAreaElement;
    field.value = formula;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    // The preview waits for a pause in the typing.
    vi.advanceTimersByTime(600);
  };

  afterEach(() => {
    vi.doUnmock('katex');
    vi.resetModules();
    delete (window as any).katex;
    document.head.querySelectorAll('link[data-rte-katex-css], script, #rte-katex-layout').forEach((node) => node.remove());
  });

  it('renders formulas with the katex package and injects no script from anywhere', async () => {
    const dialog = await open();
    typeFormula(dialog, 'x^{2}');

    expect(dialog.querySelector('#preview-area .katex')).not.toBeNull();
    expect(document.querySelectorAll('script[src]').length).toBe(0);
  });

  it('puts KaTeX\'s layout rules in the page itself, without its font files, so formulas are laid out with no network', async () => {
    await open();
    const style = document.getElementById('rte-katex-layout') as HTMLStyleElement;
    expect(style).not.toBeNull();
    expect(style.textContent).toMatch(/\.katex-mathml/);
    expect(style.textContent).toMatch(/\.katex \.mfrac|\.mfrac/);
    expect(style.textContent).not.toMatch(/@font-face/);
    expect(document.querySelectorAll('#rte-katex-layout').length).toBe(1);
  });

  it('adds the stylesheet for the version of KaTeX that is installed', async () => {
    await open();
    const link = document.querySelector('link[data-rte-katex-css]') as HTMLLinkElement;
    const { default: katex } = await import('katex');
    expect(link.href).toContain(`katex@${katex.version}/dist/katex.min.css`);
    expect(document.querySelectorAll('link[data-rte-katex-css]').length).toBe(1);
  });

  it('still opens the dialog when KaTeX cannot be loaded, and shows the formula as typed', async () => {
    vi.resetModules();
    vi.doMock('katex', () => {
      throw new Error('KaTeX is not reachable');
    });
    const { MathPlugin: Fresh } = await import('../MathPlugin.native');
    (Fresh().commands as any).insertMath(undefined, { contentElement: editor });
    await vi.waitFor(() => expect(document.querySelector('.math-dialog-overlay')).not.toBeNull(), { timeout: 5000 });
    vi.advanceTimersByTime(5);

    const dialog = document.querySelector('[data-rte-dialog]') as HTMLElement;
    typeFormula(dialog, '\\frac{a}{b} <b>');
    const preview = dialog.querySelector('#preview-area')!;
    expect(preview.querySelector('code')!.textContent).toBe('\\frac{a}{b} <b>');
    expect(preview.querySelector('b')).toBeNull();
    expect((dialog.querySelector('.insert-btn, button[class*="insert"]') as HTMLButtonElement | null)?.disabled ?? false).toBe(false);
  });

  it('tries again the next time it is opened, after a failed load', async () => {
    vi.resetModules();
    let attempts = 0;
    vi.doMock('katex', () => {
      attempts++;
      throw new Error('KaTeX is not reachable');
    });
    const { MathPlugin: Fresh } = await import('../MathPlugin.native');
    const openFresh = async () => {
      document.querySelectorAll('.math-dialog-overlay').forEach((node) => node.remove());
      (Fresh().commands as any).insertMath(undefined, { contentElement: editor });
      await vi.waitFor(() => expect(document.querySelector('.math-dialog-overlay')).not.toBeNull(), { timeout: 5000 });
    };
    await openFresh();
    await openFresh();
    expect(attempts).toBe(2);
  });
});
