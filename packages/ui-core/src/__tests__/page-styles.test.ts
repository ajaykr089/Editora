import { afterEach, describe, expect, it } from 'vitest';
import { adoptPageStyles } from '../primitives/page-styles';

// jsdom has neither constructable stylesheets nor adoptedStyleSheets: give the shadow root a
// minimal stand-in, so the copying and layering can be checked.
class FakeSheet {
  text = '';
  replaceSync(text: string) { this.text = text; }
}

afterEach(() => { document.head.innerHTML = ''; document.body.innerHTML = ''; });

describe('adoptPageStyles', () => {
  it('copies the page CSS into one layered sheet on the shadow root, and removes it on release', async () => {
    const original = (globalThis as any).CSSStyleSheet;
    (globalThis as any).CSSStyleSheet = FakeSheet;
    const style = document.createElement('style');
    style.textContent = '.app-card { color: red; }';
    document.head.appendChild(style);
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' }) as ShadowRoot & { adoptedStyleSheets: any[] };
    Object.defineProperty(root, 'adoptedStyleSheets', { value: [], writable: true, configurable: true });

    const release = adoptPageStyles(root);
    expect(root.adoptedStyleSheets).toHaveLength(1);
    const sheet = root.adoptedStyleSheets[0] as FakeSheet;
    expect(sheet.text).toMatch(/^@layer editora-page-styles \{/);
    expect(sheet.text).toContain('.app-card');

    // CSS added to the page later is picked up.
    const later = document.createElement('style');
    later.textContent = '.app-badge { color: blue; }';
    document.head.appendChild(later);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(sheet.text).toContain('.app-badge');

    release();
    expect(root.adoptedStyleSheets).toHaveLength(0);
    (globalThis as any).CSSStyleSheet = original;
  });
});
