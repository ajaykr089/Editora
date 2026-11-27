import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-spinner';
import '../components/ui-kbd';
import '../components/ui-heading';
import '../components/ui-text';
import '../components/ui-prose';
import '../components/ui-accessible-icon';
import '../components/ui-announcer';
import { parseKbdKeys } from '../components/ui-kbd';
import { headingLevel } from '../components/ui-heading';
import { installProseStyles, PROSE_CSS } from '../components/ui-prose';
import { announce, clearAnnouncements } from '../announce';

const flush = () => new Promise<void>((resolve) => queueMicrotask(resolve));

function mount<T extends HTMLElement>(html: string): T {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  return host.firstElementChild as T;
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('ui-spinner', () => {
  it('is a status named "Loading" by default', async () => {
    const el = mount('<ui-spinner></ui-spinner>');
    await flush();
    expect(el.getAttribute('role')).toBe('status');
    expect(el.shadowRoot?.querySelector('.label')?.textContent).toBe('Loading');
  });

  it('uses the label and drops out of the accessibility tree when decorative', async () => {
    const el = mount('<ui-spinner label="Saving draft"></ui-spinner>');
    await flush();
    expect(el.shadowRoot?.querySelector('.label')?.textContent).toBe('Saving draft');
    el.setAttribute('decorative', '');
    await flush();
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.shadowRoot?.querySelector('.label')).toBeNull();
    el.removeAttribute('decorative');
    await flush();
    expect(el.getAttribute('role')).toBe('status');
    expect(el.hasAttribute('aria-hidden')).toBe(false);
  });

  it('takes a custom size as a length, a named size as a token', async () => {
    const el = mount('<ui-spinner size="20"></ui-spinner>');
    await flush();
    expect(el.style.getPropertyValue('--ui-spinner-size')).toBe('20px');
    el.setAttribute('size', '2rem');
    expect(el.style.getPropertyValue('--ui-spinner-size')).toBe('2rem');
    el.setAttribute('size', 'lg');
    expect(el.style.getPropertyValue('--ui-spinner-size')).toBe('');
  });

  it('renders three marks for the dots variant', async () => {
    const el = mount('<ui-spinner variant="dots"></ui-spinner>');
    await flush();
    expect(el.shadowRoot?.querySelectorAll('.dots i').length).toBe(3);
  });

  it('escapes the label', async () => {
    const el = mount('<ui-spinner></ui-spinner>');
    el.setAttribute('label', '<img src=x onerror=alert(1)>');
    await flush();
    expect(el.shadowRoot?.querySelector('img')).toBeNull();
  });
});

describe('ui-kbd', () => {
  it('parses "+" shortcuts, the plus key and JSON arrays', () => {
    expect(parseKbdKeys('Ctrl+Shift+P')).toEqual(['Ctrl', 'Shift', 'P']);
    expect(parseKbdKeys('Ctrl++')).toEqual(['Ctrl', '+']);
    expect(parseKbdKeys('+')).toEqual(['+']);
    expect(parseKbdKeys(' Meta + K ')).toEqual(['Meta', 'K']);
    expect(parseKbdKeys('["⌘", "K"]')).toEqual(['⌘', 'K']);
    expect(parseKbdKeys('')).toEqual([]);
  });

  it('renders a key combination as nested kbd elements', async () => {
    const el = mount('<ui-kbd keys="Ctrl+K"></ui-kbd>');
    await flush();
    const combo = el.shadowRoot?.querySelector('kbd.combo');
    expect(combo?.querySelectorAll('kbd.key').length).toBe(2);
    expect(combo?.textContent).toBe('Ctrl+K');
  });

  it('wraps slotted text in one kbd without keys', async () => {
    const el = mount('<ui-kbd>Esc</ui-kbd>');
    await flush();
    expect(el.shadowRoot?.querySelector('kbd.key slot')).not.toBeNull();
  });

  it('can drop the separator', async () => {
    const el = mount('<ui-kbd keys=\'["⌘","K"]\' separator=""></ui-kbd>');
    await flush();
    expect(el.shadowRoot?.querySelector('.sep')).toBeNull();
  });
});

describe('ui-heading', () => {
  it('is a heading of its level with a matching default size', async () => {
    const el = mount('<ui-heading level="1">Billing</ui-heading>');
    await flush();
    expect(el.getAttribute('role')).toBe('heading');
    expect(el.getAttribute('aria-level')).toBe('1');
    expect(el.getAttribute('data-size')).toBe('3xl');
  });

  it('defaults to level 2 and lets size differ from level', async () => {
    const el = mount('<ui-heading size="sm">Invoices</ui-heading>');
    await flush();
    expect(el.getAttribute('aria-level')).toBe('2');
    expect(el.getAttribute('data-size')).toBe('sm');
    el.setAttribute('level', '4');
    el.removeAttribute('size');
    expect(el.getAttribute('aria-level')).toBe('4');
    expect(el.getAttribute('data-size')).toBe('lg');
  });

  it('rejects out-of-range levels', () => {
    expect(headingLevel('0')).toBe(2);
    expect(headingLevel('7')).toBe(2);
    expect(headingLevel('abc')).toBe(2);
    expect(headingLevel('6')).toBe(6);
  });
});

describe('ui-text', () => {
  it('sets the line clamp from lines', async () => {
    const el = mount('<ui-text lines="3">Long text</ui-text>');
    await flush();
    expect(el.style.getPropertyValue('--ui-text-lines')).toBe('3');
    el.setAttribute('lines', 'x');
    expect(el.style.getPropertyValue('--ui-text-lines')).toBe('');
  });
});

describe('ui-prose', () => {
  it('adopts one shared stylesheet into the document, once', async () => {
    mount('<ui-prose><h2>Title</h2><p>Body</p></ui-prose>');
    mount('<ui-prose><p>Second</p></ui-prose>');
    await flush();
    const adopted = (document as Document & { adoptedStyleSheets?: CSSStyleSheet[] }).adoptedStyleSheets;
    const fallback = document.querySelectorAll('style[data-editora-prose]');
    // jsdom may lack constructable stylesheets: then exactly one <style> is used instead.
    if (adopted && adopted.length) expect(adopted.length).toBe(1);
    else expect(fallback.length).toBe(1);
  });

  it('installs into the shadow root it lives in', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const prose = document.createElement('ui-prose');
    shadow.appendChild(prose);
    installProseStyles(prose);
    const adopted = (shadow as ShadowRoot & { adoptedStyleSheets?: CSSStyleSheet[] }).adoptedStyleSheets;
    const ok = (adopted && adopted.length === 1) || shadow.querySelectorAll('style[data-editora-prose]').length === 1;
    expect(ok).toBe(true);
  });

  it('scopes every rule to ui-prose with element-level specificity', () => {
    const selectors = PROSE_CSS.replace(/@media[^{]+\{/g, '').match(/[^{}]+(?=\{)/g) || [];
    for (const selector of selectors.map((s) => s.trim()).filter(Boolean)) {
      for (const part of selector.split(/,(?![^(]*\))/)) {
        expect(part.trim()).toMatch(/^ui-prose(\[[^\]]+\])?(\s|$|>)/);
      }
    }
  });
});

describe('ui-accessible-icon', () => {
  it('hides the icon and names it with visually hidden text', async () => {
    const el = mount('<ui-accessible-icon label="Close"><svg viewBox="0 0 1 1"></svg></ui-accessible-icon>');
    await flush();
    const svg = el.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(el.shadowRoot?.querySelector('.label')?.textContent).toBe('Close');
    expect(el.shadowRoot?.querySelector('.icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('hides icons added later', async () => {
    const el = mount('<ui-accessible-icon label="Menu"></ui-accessible-icon>');
    await flush();
    const span = document.createElement('span');
    el.appendChild(span);
    el.shadowRoot?.querySelector('slot')?.dispatchEvent(new Event('slotchange', { bubbles: true }));
    expect(span.getAttribute('aria-hidden')).toBe('true');
  });

  it('warns when the label is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount('<ui-accessible-icon><svg></svg></ui-accessible-icon>');
    await flush();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('announce()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('writes to a polite live region in the light DOM after a short delay', () => {
    announce('3 results');
    const region = document.body.querySelector('[data-editora-announcer="polite"]') as HTMLElement;
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('role')).toBe('status');
    expect(region.textContent).toBe('');
    vi.advanceTimersByTime(200);
    expect(region.textContent).toBe('3 results');
  });

  it('uses a separate assertive region', () => {
    announce('Lost connection', { politeness: 'assertive' });
    vi.advanceTimersByTime(200);
    const region = document.body.querySelector('[data-editora-announcer="assertive"]') as HTMLElement;
    expect(region.getAttribute('role')).toBe('alert');
    expect(region.textContent).toBe('Lost connection');
  });

  it('re-announces the same message by clearing first, and clears itself later', () => {
    announce('Saved');
    vi.advanceTimersByTime(200);
    const region = document.body.querySelector('[data-editora-announcer="polite"]') as HTMLElement;
    announce('Saved');
    expect(region.textContent).toBe('');
    vi.advanceTimersByTime(60);
    expect(region.textContent).toBe('Saved');
    vi.advanceTimersByTime(7000);
    expect(region.textContent).toBe('');
  });

  it('announces inside a given container (an open modal)', () => {
    const dialog = document.createElement('dialog');
    document.body.appendChild(dialog);
    announce('Inside', { within: dialog });
    vi.advanceTimersByTime(200);
    expect(dialog.querySelector('[data-editora-announcer]')?.textContent).toBe('Inside');
    clearAnnouncements(dialog);
    expect(dialog.querySelector('[data-editora-announcer]')?.textContent).toBe('');
  });

  it('ignores empty messages', () => {
    announce('   ');
    expect(document.body.querySelector('[data-editora-announcer]')).toBeNull();
  });
});

describe('ui-announcer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('announces its text on connect and on every change', async () => {
    const el = mount('<ui-announcer>2 results</ui-announcer>');
    vi.advanceTimersByTime(200);
    const region = () => document.body.querySelector('[data-editora-announcer="polite"]') as HTMLElement;
    expect(region().textContent).toBe('2 results');
    el.textContent = '5 results';
    await Promise.resolve();
    await Promise.resolve();
    vi.advanceTimersByTime(100);
    expect(region().textContent).toBe('5 results');
  });

  it('stays silent on connect when quiet, and when politeness is off', async () => {
    const el = mount('<ui-announcer quiet>Initial</ui-announcer>');
    vi.advanceTimersByTime(200);
    expect(document.body.querySelector('[data-editora-announcer]')).toBeNull();
    el.setAttribute('politeness', 'off');
    el.textContent = 'Changed';
    await Promise.resolve();
    vi.advanceTimersByTime(200);
    expect(document.body.querySelector('[data-editora-announcer]')).toBeNull();
  });
});
