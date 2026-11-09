import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-select';
import '../components/ui-multi-select';
import '../components/ui-combobox';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => { document.body.innerHTML = ''; });

const deepCount = (root: ParentNode, selector: string): number => {
  let n = root.querySelectorAll(selector).length;
  for (const el of Array.from(root.querySelectorAll('*'))) if ((el as HTMLElement).shadowRoot) n += deepCount((el as HTMLElement).shadowRoot!, selector);
  return n;
};
const options = Array.from({ length: 50 }, (_, i) => ({ value: `v${i}`, label: `Option ${i}` }));

// A closed field used to build its whole option list in its shadow tree (about 180 to 220
// elements for 50 options); a page of filters doubled in size. The list is built on opening.
describe('closed option lists', () => {
  it('ui-select builds its options when it opens', async () => {
    const el = document.createElement('ui-select') as HTMLElement & { open?: boolean };
    el.innerHTML = options.map((o) => `<option value="${o.value}">${o.label}</option>`).join('');
    document.body.appendChild(el);
    await tick();
    expect(deepCount(el.shadowRoot!, '[role="option"]')).toBe(0);
    (el.shadowRoot!.querySelector('.trigger, [part~="trigger"], button') as HTMLElement).click();
    await tick();
    expect(deepCount(el.shadowRoot!, '[role="option"]')).toBe(50);
  });

  it('ui-multi-select builds its options when it opens', async () => {
    const el = document.createElement('ui-multi-select') as HTMLElement;
    el.setAttribute('options', JSON.stringify(options));
    document.body.appendChild(el);
    await tick();
    expect(deepCount(el.shadowRoot!, '[role="option"]')).toBe(0);
    el.setAttribute('open', '');
    await tick();
    expect(deepCount(el.shadowRoot!, '[role="option"]')).toBeGreaterThanOrEqual(40);
  });

  it('ui-combobox builds its options when it opens', async () => {
    const el = document.createElement('ui-combobox') as HTMLElement;
    el.innerHTML = options.map((o) => `<option value="${o.value}">${o.label}</option>`).join('');
    document.body.appendChild(el);
    await tick();
    expect(deepCount(el.shadowRoot!, '[role="option"]')).toBe(0);
    el.setAttribute('open', '');
    await tick();
    expect(deepCount(el.shadowRoot!, '[role="option"]')).toBe(50);
  });
});
