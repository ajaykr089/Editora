import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-data-list';
import { parseDataListItems } from '../components/ui-data-list';

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function mount(html: string): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  return host.firstElementChild as HTMLElement;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-data-list', () => {
  it('keeps a native description list in the light DOM and installs its styles once', async () => {
    const el = mount('<ui-data-list><dl><div><dt>Status</dt><dd>Active</dd></div></dl></ui-data-list>');
    mount('<ui-data-list><dl><div><dt>B</dt><dd>2</dd></div></dl></ui-data-list>');
    await flush();
    expect(el.querySelector('dl > div > dt')?.textContent).toBe('Status');
    expect(el.shadowRoot!.querySelector('slot')).not.toBeNull();
    const adopted = (document as Document & { adoptedStyleSheets?: CSSStyleSheet[] }).adoptedStyleSheets || [];
    const fallback = document.querySelectorAll('style[data-editora-data-list]').length;
    expect(adopted.length + fallback).toBe(1);
  });

  it('renders items as a description list in the shadow root, escaped', async () => {
    const el = mount('<ui-data-list></ui-data-list>');
    el.setAttribute('items', JSON.stringify([{ label: 'Plan', value: 'Pro' }, { label: '<b>x</b>', value: '<img src=x>' }]));
    await flush();
    const rows = el.shadowRoot!.querySelectorAll('dl > div');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('dt')!.textContent).toBe('Plan');
    expect(el.shadowRoot!.querySelector('b, img')).toBeNull();
  });

  it('turns label-width into the label column token', async () => {
    const el = mount('<ui-data-list label-width="120"></ui-data-list>');
    await flush();
    expect(el.style.getPropertyValue('--ui-data-list-label-width')).toBe('120px');
    el.setAttribute('label-width', '12ch');
    expect(el.style.getPropertyValue('--ui-data-list-label-width')).toBe('12ch');
  });

  it('parses items leniently', () => {
    expect(parseDataListItems('not json')).toEqual([]);
    expect(parseDataListItems('{"a":1}')).toEqual([]);
    expect(parseDataListItems('[{"label":"A","value":1},null]')).toEqual([{ label: 'A', value: '1' }]);
  });
});
