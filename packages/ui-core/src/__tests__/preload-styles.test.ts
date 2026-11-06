import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PRELOAD_CSS } from '../standalone/preload';

const componentsDir = resolve(__dirname, '../components');

function hostDisplays(): Map<string, string> {
  const result = new Map<string, string>();
  for (const file of readdirSync(componentsDir).filter((name) => /^ui-.*\.ts$/.test(name))) {
    const source = readFileSync(resolve(componentsDir, file), 'utf8');
    const host = /:host\s*\{([^}]*)\}/.exec(source);
    const display = host && /display:\s*([a-z-]+)/.exec(host[1]);
    if (!display) continue;
    for (const [, tag] of source.matchAll(/customElements\.define\('(ui-[a-z-]+)'/g)) result.set(tag, display[1]);
  }
  return result;
}

function preloadDisplays(): Map<string, string> {
  const result = new Map<string, string>();
  const block = /((?:\s*ui-[a-z-]+:not\(:defined\),?)+)\s*\{\s*display:\s*([a-z-]+);\s*\}/g;
  for (const [, selectors, display] of PRELOAD_CSS.matchAll(block)) {
    for (const [, tag] of selectors.matchAll(/(ui-[a-z-]+):not\(:defined\)/g)) {
      if (!result.has(tag)) result.set(tag, display);
    }
  }
  return result;
}

describe('preload styles', () => {
  it('give every element the display its :host rule has, before it is defined', () => {
    const expected = hostDisplays();
    const actual = preloadDisplays();
    const wrong = [...expected].filter(([tag, display]) => actual.get(tag) !== display).map(([tag, display]) => `${tag}: ${display} (preload has ${actual.get(tag) ?? 'nothing'})`);
    // Regenerate the display block in src/preload.ts when this fails.
    expect(wrong).toEqual([]);
  });

  it('only apply to undefined elements and hide what the elements hide', () => {
    const rules = PRELOAD_CSS.replace(/\/\*[\s\S]*?\*\//g, '').match(/[^{}]+\{[^{}]*\}/g) || [];
    for (const rule of rules) {
      // Split on top-level commas only (not the ones inside :is(...)).
      const selectors = rule.slice(0, rule.indexOf('{')).split(/,(?![^(]*\))/).map((part) => part.trim()).filter(Boolean);
      for (const selector of selectors) expect(selector).toMatch(/^(ui-[a-z-]+|:is\([^)]*\))(\[[a-z-]+\])*:not\(:defined\)/);
    }
    expect(PRELOAD_CSS).toContain('ui-tabs:not(:defined) > [slot="panel"] ~ [slot="panel"]');
    expect(PRELOAD_CSS).toMatch(/ui-dialog:not\(:defined\),[\s\S]*?display: none/);
  });

  it('is a plain string module that is safe to import on the server', () => {
    const source = readFileSync(resolve(__dirname, '../preload.ts'), 'utf8');
    expect(source).not.toMatch(/^import /m);
  });

  it('behaves in a document before the elements are defined', () => {
    // jsdom does not match :not(:defined) for a tag that is registered later in this run, so
    // check with names that are never defined, using the real rules rewritten to them.
    const style = document.createElement('style');
    style.textContent = PRELOAD_CSS.replace(/@layer editora-preload \{/, '').replace(/\}\s*$/, '').replace(/ui-tabs/g, 'x-tabs').replace(/ui-dialog/g, 'x-dialog');
    document.head.append(style);
    document.body.innerHTML = `
      <x-tabs><div slot="tab">A</div><div slot="tab">B</div><div slot="panel" id="p1">1</div><div slot="panel" id="p2">2</div></x-tabs>
      <x-dialog id="d">secret</x-dialog>`;
    expect(getComputedStyle(document.getElementById('p1')!).display).not.toBe('none');
    expect(getComputedStyle(document.getElementById('p2')!).display).toBe('none');
    expect(getComputedStyle(document.getElementById('d')!).display).toBe('none');
    style.remove();
  });
});
