import React from 'react';
import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { NumberField } from '../components/NumberField';
import { Combobox } from '../components/Combobox';

const settle = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 10)); });

function inner(host: Element): HTMLInputElement | HTMLTextAreaElement {
  return host.shadowRoot!.querySelector('input, textarea') as HTMLInputElement;
}

/** What a keystroke does: the native control changes, then fires input. */
function type(host: Element, text: string) {
  const field = inner(host);
  field.value = text;
  field.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
}

function commit(host: Element) {
  inner(host).dispatchEvent(new Event('change', { bubbles: true }));
}

describe.each([
  ['Input', Input, 'ui-input'],
  ['Textarea', Textarea, 'ui-textarea'],
] as const)('%s value handling', (_name, Field, tag) => {
  it('fires onChange on every keystroke and onCommit when the edit is committed', async () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    const { container } = render(<Field onChange={onChange} onCommit={onCommit} />);
    await settle();
    const host = container.querySelector(tag)!;
    act(() => { type(host, 'a'); type(host, 'ab'); });
    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['a', 'ab']);
    expect(onCommit).not.toHaveBeenCalled();
    act(() => { commit(host); });
    expect(onCommit).toHaveBeenCalledWith('ab');
  });

  it('controlled: typing works when the parent stores each value', async () => {
    function Harness() {
      const [value, setValue] = React.useState('');
      return <Field value={value} onChange={setValue} />;
    }
    const { container } = render(<Harness />);
    await settle();
    const host = container.querySelector(tag)!;
    for (const text of ['h', 'he', 'hey']) {
      act(() => { type(host, text); });
      await settle();
    }
    expect(host.getAttribute('value')).toBe('hey');
    expect(inner(host).value).toBe('hey');
  });

  it('controlled: a value the parent rejects or transforms is what the field shows', async () => {
    function Harness() {
      const [value, setValue] = React.useState('AB');
      return <Field value={value} onChange={(next) => setValue(next.toUpperCase().slice(0, 3))} />;
    }
    const { container } = render(<Harness />);
    await settle();
    const host = container.querySelector(tag)!;
    act(() => { type(host, 'ABc'); });
    await settle();
    expect(inner(host).value).toBe('ABC');
    act(() => { type(host, 'ABCD'); });
    await settle();
    expect(inner(host).value).toBe('ABC');
  });

  it('defaultValue sets the starting value and leaves the field uncontrolled', async () => {
    const { container } = render(<Field defaultValue="start" onChange={() => {}} />);
    await settle();
    const host = container.querySelector(tag)!;
    expect(inner(host).value).toBe('start');
    act(() => { type(host, 'edited'); });
    await settle();
    expect(inner(host).value).toBe('edited');
  });

  it('value without a handler is still an initial value, as before', async () => {
    const { container } = render(<Field value="initial" />);
    await settle();
    const host = container.querySelector(tag)!;
    act(() => { type(host, 'edited'); });
    await settle();
    expect(inner(host).value).toBe('edited');
  });
});

describe('NumberField and Combobox', () => {
  it('NumberField: onInput per keystroke, defaultValue, and a rejected commit is undone', async () => {
    const onInput = vi.fn();
    const { container, rerender } = render(<NumberField defaultValue={4} onInput={onInput} />);
    await settle();
    const host = container.querySelector('ui-number-field')!;
    expect(host.getAttribute('value')).toBe('4');
    act(() => { type(host, '12'); });
    expect(onInput).toHaveBeenLastCalledWith({ rawValue: '12', value: 12 });

    rerender(<NumberField value={2} onValueChange={() => {}} />);
    await settle();
    act(() => {
      host.setAttribute('value', '9');
      host.dispatchEvent(new CustomEvent('value-change', { detail: { value: 9 }, bubbles: true, composed: true }));
    });
    await settle();
    expect(host.getAttribute('value')).toBe('2');
  });

  it('Combobox: defaultValue, and a rejected selection is undone', async () => {
    const { container, rerender } = render(<Combobox defaultValue="b" />);
    await settle();
    const host = container.querySelector('ui-combobox')!;
    expect(host.getAttribute('value')).toBe('b');

    rerender(<Combobox value="a" onChange={() => {}} />);
    await settle();
    act(() => {
      host.setAttribute('value', 'c');
      host.dispatchEvent(new CustomEvent('change', { detail: { value: 'c' }, bubbles: true, composed: true }));
    });
    await settle();
    expect(host.getAttribute('value')).toBe('a');
  });
});
