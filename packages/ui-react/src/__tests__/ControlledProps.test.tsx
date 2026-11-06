import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../components/Tabs';
import { Pagination } from '../components/Pagination';
import { Select } from '../components/Select';
import { Slider } from '../components/Slider';
import { RadioGroup } from '../components/RadioGroup';
import { ToggleGroup } from '../components/ToggleGroup';
import { MultiSelect } from '../components/MultiSelect';
import { Checkbox } from '../components/Checkbox';
import { Switch } from '../components/Switch';
import { Toggle } from '../components/Toggle';
import { Dialog } from '../components/Dialog';
import { Drawer } from '../components/Drawer';
import { Dropdown } from '../components/Dropdown';
import { Popover } from '../components/Popover';

const settle = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 10)); });
const noop = () => {};

type Case = {
  name: string;
  element: React.ReactElement;
  tag: string;
  attribute: string;
  /** What the element would write when the user changes it, and the event it then dispatches. */
  userValue: string | null;
  event: string;
  detail?: unknown;
};

// Text-entry fields (Input, Textarea, NumberField, Combobox) are not in this list on purpose: their
// onChange fires on commit, not per keystroke, and `value` is widely used as an initial value, so
// holding them to the prop needs a defaultValue prop first.
//
// A parent that passes the prop but ignores every change: the prop must win, as with a controlled
// <input value>. Each case lets the element change itself the way user input does, then checks that
// the attribute goes back.
const cases: Case[] = [
  { name: 'Tabs selected', element: <Tabs selected={0} onChange={noop}><Tabs.Tab>A</Tabs.Tab><Tabs.Tab>B</Tabs.Tab><Tabs.Panel>a</Tabs.Panel><Tabs.Panel>b</Tabs.Panel></Tabs>, tag: 'ui-tabs', attribute: 'selected', userValue: '1', event: 'change', detail: { index: 1 } },
  { name: 'Pagination page', element: <Pagination page={1} count={5} onChange={noop} />, tag: 'ui-pagination', attribute: 'page', userValue: '3', event: 'change', detail: { page: 3 } },
  { name: 'Select value', element: <Select value="a" onChange={noop}><option value="a">A</option><option value="b">B</option></Select>, tag: 'ui-select', attribute: 'value', userValue: 'b', event: 'change', detail: { value: 'b' } },
  { name: 'Slider value', element: <Slider value={30} onChange={noop} />, tag: 'ui-slider', attribute: 'value', userValue: '70', event: 'change', detail: { value: 70 } },
  { name: 'RadioGroup value', element: <RadioGroup value="a" onChange={noop} />, tag: 'ui-radio-group', attribute: 'value', userValue: 'b', event: 'change', detail: { value: 'b' } },
  { name: 'ToggleGroup value', element: <ToggleGroup value="a" onChange={noop} />, tag: 'ui-toggle-group', attribute: 'value', userValue: 'b', event: 'change', detail: { value: 'b' } },
  { name: 'MultiSelect value', element: <MultiSelect value={['a']} onChange={noop} />, tag: 'ui-multi-select', attribute: 'value', userValue: '["a","b"]', event: 'change', detail: { value: ['a', 'b'] } },
  { name: 'Checkbox checked', element: <Checkbox checked={false} onChange={noop} />, tag: 'ui-checkbox', attribute: 'checked', userValue: '', event: 'change', detail: { checked: true } },
  { name: 'Switch checked', element: <Switch checked onChange={noop} />, tag: 'ui-switch', attribute: 'checked', userValue: null, event: 'change', detail: { checked: false } },
  { name: 'Toggle pressed', element: <Toggle pressed={false} onChange={noop} />, tag: 'ui-toggle', attribute: 'pressed', userValue: '', event: 'change', detail: { pressed: true } },
  { name: 'Dialog open', element: <Dialog open title="T" onClose={noop}>x</Dialog>, tag: 'ui-dialog', attribute: 'open', userValue: null, event: 'close' },
  { name: 'Drawer open', element: <Drawer open onClose={noop}>x</Drawer>, tag: 'ui-drawer', attribute: 'open', userValue: null, event: 'close' },
  { name: 'Dropdown open', element: <Dropdown open={false} onOpen={noop}><button slot="trigger">t</button><div slot="content"><button role="menuitem">i</button></div></Dropdown>, tag: 'ui-dropdown', attribute: 'open', userValue: '', event: 'open' },
  { name: 'Popover open', element: <Popover open={false} onOpenChange={noop}><button slot="trigger">t</button><div slot="content">c</div></Popover>, tag: 'ui-popover', attribute: 'open', userValue: '', event: 'open' },
];

describe('controlled props win over the element', () => {
  it.each(cases)('$name goes back to the prop when the parent ignores a change', async ({ element, tag, attribute, userValue, event, detail }) => {
    const { container } = render(element);
    await settle();
    const el = container.querySelector(tag) as HTMLElement;
    const before = el.getAttribute(attribute);

    act(() => {
      if (userValue == null) el.removeAttribute(attribute);
      else el.setAttribute(attribute, userValue);
      el.dispatchEvent(new CustomEvent(event, { detail, bubbles: true, composed: true }));
    });
    await settle();

    expect(el.getAttribute(attribute)).toBe(before);
  });

  it('accepts the change when the parent updates its state', async () => {
    function Harness() {
      const [page, setPage] = React.useState(1);
      return <Pagination page={page} count={5} onPageChange={(detail) => setPage(detail.page)} />;
    }
    const { container } = render(<Harness />);
    await settle();
    const el = container.querySelector('ui-pagination') as HTMLElement;
    act(() => { (el.shadowRoot!.querySelector('button[aria-label="Next"]') as HTMLButtonElement).click(); });
    await settle();
    expect(el.getAttribute('page')).toBe('2');
  });

  it('real interactions: a rejected tab click, page click and option pick are undone', async () => {
    const { container } = render(
      <>
        <Tabs selected={0} onChange={noop}><Tabs.Tab>A</Tabs.Tab><Tabs.Tab>B</Tabs.Tab><Tabs.Panel>a</Tabs.Panel><Tabs.Panel>b</Tabs.Panel></Tabs>
        <Pagination page={1} count={5} onPageChange={noop} />
        <Select value="a" onChange={noop}><option value="a">Alpha</option><option value="b">Beta</option></Select>
      </>
    );
    await settle();
    const tabs = container.querySelector('ui-tabs') as HTMLElement;
    const pager = container.querySelector('ui-pagination') as HTMLElement;
    const select = container.querySelector('ui-select') as HTMLElement & { value: string };

    act(() => { (tabs.shadowRoot!.querySelectorAll('.tab')[1] as HTMLButtonElement).click(); });
    act(() => { (pager.shadowRoot!.querySelector('button[aria-label="Next"]') as HTMLButtonElement).click(); });
    act(() => { fireEvent.click(select.shadowRoot!.querySelector('[role="combobox"]')!); });
    act(() => { (Array.from(select.shadowRoot!.querySelectorAll('[role="option"]')).find((option) => option.textContent?.includes('Beta')) as HTMLElement).click(); });
    await settle();

    expect(tabs.getAttribute('selected')).toBe('0');
    expect(tabs.shadowRoot!.querySelectorAll('.tab')[0].getAttribute('aria-selected')).toBe('true');
    expect(pager.shadowRoot!.querySelector('[aria-current="page"]')?.textContent).toBe('1');
    expect(select.value).toBe('a');
    expect(select.shadowRoot!.querySelector('.value')?.textContent?.trim()).toBe('Alpha');
  });

  it('treats a prop without a change handler as the initial value', async () => {
    const { container } = render(
      <>
        <Tabs selected={0}><Tabs.Tab>A</Tabs.Tab><Tabs.Tab>B</Tabs.Tab><Tabs.Panel>a</Tabs.Panel><Tabs.Panel>b</Tabs.Panel></Tabs>
        <Switch checked />
      </>
    );
    await settle();
    const tabs = container.querySelector('ui-tabs') as HTMLElement;
    const toggle = container.querySelector('ui-switch') as HTMLElement;
    act(() => { (tabs.shadowRoot!.querySelectorAll('.tab')[1] as HTMLButtonElement).click(); });
    act(() => {
      toggle.removeAttribute('checked');
      toggle.dispatchEvent(new CustomEvent('change', { detail: { checked: false }, bubbles: true, composed: true }));
    });
    await settle();
    expect(tabs.getAttribute('selected')).toBe('1');
    expect(toggle.hasAttribute('checked')).toBe(false);
  });

  it('leaves uncontrolled components alone', async () => {
    const { container } = render(<Tabs><Tabs.Tab>A</Tabs.Tab><Tabs.Tab>B</Tabs.Tab><Tabs.Panel>a</Tabs.Panel><Tabs.Panel>b</Tabs.Panel></Tabs>);
    await settle();
    const tabs = container.querySelector('ui-tabs') as HTMLElement;
    act(() => { (tabs.shadowRoot!.querySelectorAll('.tab')[1] as HTMLButtonElement).click(); });
    await settle();
    expect(tabs.getAttribute('selected')).toBe('1');
  });
});
