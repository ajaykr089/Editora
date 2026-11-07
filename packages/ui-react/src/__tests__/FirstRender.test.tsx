import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../components/Tabs';
import { Select } from '../components/Select';
import { Pagination } from '../components/Pagination';
import { Rating } from '../components/Rating';
import { Meter } from '../components/Meter';
import { Alert } from '../components/Alert';
import { EmptyState } from '../components/EmptyState';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { NumberField } from '../components/NumberField';
import { Slider } from '../components/Slider';
import { Switch } from '../components/Switch';
import { Combobox } from '../components/Combobox';

// Each assertion runs straight after render(), with no await: the wrappers render the element once
// all props are applied in the same commit, so nothing is "wrong for one tick".
describe('wrappers are correct on the first render', () => {
  it('Tabs shows the selected tab', () => {
    const { container } = render(
      <Tabs selected={1}>
        <Tabs.Tab>One</Tabs.Tab>
        <Tabs.Tab>Two</Tabs.Tab>
        <Tabs.Panel>1</Tabs.Panel>
        <Tabs.Panel>2</Tabs.Panel>
      </Tabs>
    );
    const tabs = container.querySelector('ui-tabs')!.shadowRoot!.querySelectorAll('.tab');
    expect(Array.from(tabs).map((tab) => tab.getAttribute('aria-selected'))).toEqual(['false', 'true']);
  });

  it('Select shows its value and label', () => {
    const { container } = render(
      <Select label="Kind" value="b">
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </Select>
    );
    const root = container.querySelector('ui-select')!.shadowRoot!;
    expect(root.querySelector('.value')?.textContent?.trim()).toBe('Beta');
    expect(root.querySelector('.label')?.hasAttribute('hidden')).toBe(false);
  });

  it('Pagination shows every page', () => {
    const { container } = render(<Pagination page={2} count={4} />);
    const root = container.querySelector('ui-pagination')!.shadowRoot!;
    expect(root.querySelector('[aria-current="page"]')?.textContent).toBe('2');
    expect(root.querySelectorAll('button[data-page]:not([aria-label])')).toHaveLength(4);
  });

  it('Rating keeps an author aria-label that arrives after mount', () => {
    const { container } = render(<Rating ariaLabel="Product rating" value={3} />);
    expect(container.querySelector('ui-rating')!.getAttribute('aria-label')).toBe('Product rating');
  });

  // All of these showed their defaults (no label, no title) straight after render() before.
  it.each([
    ['Meter', <Meter key="Meter" value={82} label="Reliability" showLabel />, 'ui-meter', 'Reliability'],
    ['Alert', <Alert key="Alert" title="Saved" />, 'ui-alert', 'Saved'],
    ['EmptyState', <EmptyState key="EmptyState" title="Nothing here" />, 'ui-empty-state', 'Nothing here'],
    ['Input', <Input key="Input" label="Email" />, 'ui-input', 'Email'],
    ['Textarea', <Textarea key="Textarea" label="Notes" />, 'ui-textarea', 'Notes'],
    ['NumberField', <NumberField key="NumberField" label="Qty" value={3} />, 'ui-number-field', 'Qty'],
    ['Slider', <Slider key="Slider" label="Volume" value={30} />, 'ui-slider', 'Volume'],
    ['Switch', <Switch key="Switch" label="Notify me" />, 'ui-switch', 'Notify me'],
    ['Combobox', <Combobox key="Combobox" label="City" />, 'ui-combobox', 'City'],
  ] as Array<[string, React.ReactElement, string, string]>)('%s renders its props', (_name, element, tag, text) => {
    const { container } = render(element);
    expect(container.querySelector(tag)!.shadowRoot!.innerHTML).toContain(text);
  });
});
