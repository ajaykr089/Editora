import { describe, expect, it } from 'vitest';
import '../components/ui-sidebar';
import '../components/ui-layout';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const css = (el: Element) => Array.from(el.shadowRoot!.querySelectorAll('style')).map((node) => node.textContent).join('\n');

describe('ui-sidebar styles', () => {
  it('has the inset, indicator and pill variants, and a neutral dark contrast', async () => {
    const el = document.createElement('ui-sidebar');
    el.setAttribute('items', JSON.stringify([{ value: 'a', label: 'A' }]));
    document.body.appendChild(el);
    await tick();
    const text = css(el);
    for (const variant of ['inset', 'indicator', 'pill']) expect(text).toContain(`:host([variant="${variant}"])`);
    // the old navy gradient is gone
    expect(text).not.toContain('#07162d');
    el.remove();
  });

  it('marks the current item without a tinted border, and draws the indicator bar from a token', async () => {
    const el = document.createElement('ui-sidebar');
    document.body.appendChild(el);
    await tick();
    const text = css(el);
    expect(text).toMatch(/\.item-button\[aria-current="page"\]::before[\s\S]*?background: var\(--ui-sidebar-indicator\)/);
    for (const variant of ['surface', 'soft', 'floating', 'minimal', 'split']) {
      expect(text).toMatch(new RegExp(`:host\\(\\[variant="${variant}"\\]\\) \\{[^}]*--ui-sidebar-item-border: transparent`));
    }
    el.remove();
  });
});

describe('ui-layout inset shell', () => {
  it('puts the content on a card when inset is set', async () => {
    const el = document.createElement('ui-layout');
    el.setAttribute('variant', 'shell');
    el.setAttribute('inset', '');
    document.body.appendChild(el);
    await tick();
    expect(css(el)).toMatch(/:host\(\[variant="shell"\]\[inset\]:not\(\[data-drawer\]\)\) \.content-panel \{/);
    el.remove();
  });
});
