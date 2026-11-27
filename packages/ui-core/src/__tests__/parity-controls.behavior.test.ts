import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-button-group';
import '../components/ui-input-group';
import '../components/ui-native-select';
import '../components/ui-item';
import '../components/ui-item-group';
import '../components/ui-code-block';
import { parseLineRanges } from '../components/ui-code-block';

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function mount<T extends HTMLElement>(html: string): T {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  return host.firstElementChild as T;
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('ui-button-group', () => {
  it('is a group and hands its size to buttons that set none', async () => {
    const el = mount(`<ui-button-group size="sm">
      <button>A</button><ui-button>B</ui-button><ui-button size="lg">C</ui-button>
    </ui-button-group>`);
    await flush();
    expect(el.getAttribute('role')).toBe('group');
    const [, b, c] = Array.from(el.children);
    expect(b.getAttribute('size')).toBe('sm');
    expect(c.getAttribute('size')).toBe('lg');
  });

  it('takes the size back when the group drops it, and sizes buttons added later', async () => {
    const el = mount('<ui-button-group size="sm"><ui-button>B</ui-button></ui-button-group>');
    await flush();
    const added = document.createElement('ui-button');
    el.appendChild(added);
    await flush();
    expect(added.getAttribute('size')).toBe('sm');
    el.removeAttribute('size');
    await flush();
    expect(el.firstElementChild?.hasAttribute('size')).toBe(false);
    expect(added.hasAttribute('size')).toBe(false);
  });

  it('keeps an app-chosen toolbar role and sets its orientation', async () => {
    const el = mount('<ui-button-group role="toolbar" orientation="vertical"><button>A</button></ui-button-group>');
    await flush();
    expect(el.getAttribute('role')).toBe('toolbar');
    expect(el.getAttribute('aria-orientation')).toBe('vertical');
  });
});

describe('ui-input-group', () => {
  it('hides empty addon rows and flags filled ones', async () => {
    const el = mount('<ui-input-group><span slot="start">$</span><input aria-label="Amount" /></ui-input-group>');
    await flush();
    const start = el.shadowRoot!.querySelector('.start')!;
    const end = el.shadowRoot!.querySelector('.end')!;
    // jsdom does not assign slots before slotchange; force the check the element does on it.
    el.shadowRoot!.querySelector('slot[name="start"]')!.dispatchEvent(new Event('slotchange', { bubbles: true }));
    expect(end.hasAttribute('data-empty')).toBe(true);
    expect(start.hasAttribute('data-empty')).toBe(!(el.shadowRoot!.querySelector('slot[name="start"]') as HTMLSlotElement).assignedNodes().length);
  });

  it('finds the control and passes disabled and invalid to it', async () => {
    const el = mount('<ui-input-group><input aria-label="Name" /></ui-input-group>');
    await flush();
    const input = el.querySelector('input')!;
    expect((el as any).control()).toBe(input);
    el.setAttribute('disabled', '');
    el.setAttribute('invalid', '');
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    el.removeAttribute('disabled');
    el.removeAttribute('invalid');
    expect(input.disabled).toBe(false);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('never re-enables a control the app disabled itself', async () => {
    const el = mount('<ui-input-group><input aria-label="Name" disabled /></ui-input-group>');
    await flush();
    el.setAttribute('disabled', '');
    el.removeAttribute('disabled');
    expect(el.querySelector('input')!.disabled).toBe(true);
  });

  it('focuses the control when a non-interactive addon is pressed', async () => {
    const el = mount('<ui-input-group><span slot="start" id="addon">@</span><input aria-label="User" /><button slot="end">Go</button></ui-input-group>');
    await flush();
    const input = el.querySelector('input')!;
    el.querySelector('#addon')!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, button: 0 }));
    expect(document.activeElement).toBe(input);
    input.blur();
    el.querySelector('button')!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, button: 0 }));
    expect(document.activeElement).not.toBe(input);
  });
});

describe('ui-native-select', () => {
  it('flags list boxes and disabled selects', async () => {
    const el = mount('<ui-native-select><select aria-label="Pick" multiple><option>A</option></select></ui-native-select>');
    await flush();
    expect(el.hasAttribute('data-listbox')).toBe(true);
    const select = el.querySelector('select')!;
    select.multiple = false;
    select.disabled = true;
    await flush();
    expect(el.hasAttribute('data-listbox')).toBe(false);
    expect(el.hasAttribute('data-disabled')).toBe(true);
  });

  it('marks the select invalid and only removes what it set', async () => {
    const el = mount('<ui-native-select><select aria-label="Pick"><option>A</option></select></ui-native-select>');
    await flush();
    el.setAttribute('invalid', '');
    const select = el.querySelector('select')!;
    expect(select.getAttribute('aria-invalid')).toBe('true');
    el.removeAttribute('invalid');
    expect(select.hasAttribute('aria-invalid')).toBe(false);
  });

  it('keeps the select in the light DOM so forms submit it', async () => {
    const form = mount<HTMLFormElement>('<form><ui-native-select><select name="c"><option value="in">India</option></select></ui-native-select></form>');
    await flush();
    expect(new FormData(form).get('c')).toBe('in');
  });
});

describe('ui-item', () => {
  it('renders a link around the media and text, with actions outside it', async () => {
    const el = mount(`<ui-item href="/a" label="Ada" description="ada@example.com">
      <button slot="actions">Remove</button>
    </ui-item>`);
    await flush();
    const link = el.shadowRoot!.querySelector('a.main') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/a');
    expect(link.querySelector('slot[name="actions"]')).toBeNull();
    expect(link.querySelector('.title')?.textContent).toContain('Ada');
  });

  it('adds rel for new-tab links and disables the link', async () => {
    const el = mount('<ui-item href="https://example.com" target="_blank" label="Docs" disabled></ui-item>');
    await flush();
    const link = el.shadowRoot!.querySelector('a.main')!;
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');
  });

  it('is a plain row without href and escapes attribute text', async () => {
    const el = mount('<ui-item></ui-item>');
    el.setAttribute('label', '<b>x</b>');
    await flush();
    expect(el.shadowRoot!.querySelector('a')).toBeNull();
    expect(el.shadowRoot!.querySelector('b')).toBeNull();
  });

  it('becomes a listitem inside a group, including items added later', async () => {
    const group = mount('<ui-item-group><ui-item label="One"></ui-item></ui-item-group>');
    await flush();
    expect(group.getAttribute('role')).toBe('list');
    expect(group.firstElementChild?.getAttribute('role')).toBe('listitem');
    const item = document.createElement('ui-item');
    group.appendChild(item);
    await flush();
    expect(item.getAttribute('role')).toBe('listitem');
  });
});

describe('ui-code-block', () => {
  it('parses line ranges', () => {
    expect([...parseLineRanges('2,4-6')]).toEqual([2, 4, 5, 6]);
    expect([...parseLineRanges('6-4')]).toEqual([4, 5, 6]);
    expect([...parseLineRanges('x, 3')]).toEqual([3]);
    expect(parseLineRanges('1-99999999').size).toBeLessThanOrEqual(10000);
  });

  it('renders one escaped line per line of code and marks highlighted lines', async () => {
    const el = mount('<ui-code-block highlight="2"></ui-code-block>') as HTMLElement & { code: string };
    el.code = 'const a = 1;\nconst b = "<b>";\n';
    await flush();
    const lines = el.shadowRoot!.querySelectorAll('.line');
    expect(lines.length).toBe(3);
    expect(lines[1].hasAttribute('data-highlighted')).toBe(true);
    expect(el.shadowRoot!.querySelector('b')).toBeNull();
    expect(lines[1].textContent).toBe('const b = "<b>";');
  });

  it('takes the code from a child pre and names the focusable region', async () => {
    const el = mount('<ui-code-block filename="app.ts" language="ts"><pre>\nlet x = 1;\n</pre></ui-code-block>');
    await flush();
    const pre = el.shadowRoot!.querySelector('pre')!;
    expect(pre.getAttribute('tabindex')).toBe('0');
    expect(pre.getAttribute('aria-label')).toBe('app.ts');
    expect(el.shadowRoot!.querySelectorAll('.line').length).toBe(1);
    expect(el.shadowRoot!.querySelector('.copy')?.getAttribute('aria-label')).toBe('Copy app.ts');
  });

  it('shows an already highlighted child pre as given', async () => {
    const el = mount('<ui-code-block><pre class="shiki"><code><span style="color:red">let</span> x</code></pre></ui-code-block>');
    await flush();
    expect(el.shadowRoot!.querySelector('.slotted slot')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('pre')).toBeNull();
  });

  it('copies the code, fires code-copy and shows "Copied"', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    const el = mount('<ui-code-block filename="x.sh" code="npm i"></ui-code-block>') as HTMLElement & { copy(): Promise<boolean> };
    await flush();
    const onCopy = vi.fn();
    el.addEventListener('code-copy', onCopy);
    expect(await el.copy()).toBe(true);
    expect(writeText).toHaveBeenCalledWith('npm i');
    expect(onCopy.mock.calls[0][0].detail.text).toBe('npm i');
    expect(el.shadowRoot!.querySelector('.copy')?.hasAttribute('data-copied')).toBe(true);
    expect(el.shadowRoot!.querySelector('.copy-text')?.textContent).toBe('Copied');
  });

  it('hides the copy button with no-copy and floats it without a header', async () => {
    const el = mount('<ui-code-block code="a"></ui-code-block>');
    await flush();
    expect(el.shadowRoot!.querySelector('.body > .copy')).not.toBeNull();
    el.setAttribute('no-copy', '');
    await flush();
    expect(el.shadowRoot!.querySelector('.copy')).toBeNull();
  });

  it('sets max-height as a length', async () => {
    const el = mount('<ui-code-block code="a" max-height="200"></ui-code-block>');
    await flush();
    expect(el.style.getPropertyValue('--ui-code-block-max-height')).toBe('200px');
  });
});
