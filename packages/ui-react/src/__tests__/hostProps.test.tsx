import React from 'react';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-button';
import '../../../ui-core/src/components/ui-input';
import '../../../ui-core/src/components/ui-tooltip';
import '../../../ui-core/src/components/ui-alert';
import '../../../ui-core/src/components/ui-flex';
import '../../../ui-core/src/components/ui-separator';

import { createUIElement } from '../components/_internals';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Flex } from '../components/Flex';
import { Input } from '../components/Input';
import { Separator } from '../components/Separator';
import { Tooltip } from '../components/Tooltip';

// React 16-18 only map `className` to `class` on built-in elements; on a custom element they emit
// a literal `classname` attribute, so a consumer's `className` is silently dropped. React 19 maps
// it. These tests pin the host to a real `class` attribute whichever React is installed.
describe('className on custom-element hosts', () => {
  it.each([
    ['Button', () => <Button className="mine">go</Button>, 'ui-button'],
    ['Input', () => <Input className="mine" />, 'ui-input'],
    ['Tooltip', () => <Tooltip className="mine" text="hi">x</Tooltip>, 'ui-tooltip'],
    ['Alert', () => <Alert className="mine" />, 'ui-alert'],
    ['Flex', () => <Flex className="mine" />, 'ui-flex'],
    ['Separator', () => <Separator className="mine" />, 'ui-separator'],
  ])('%s forwards className as the class attribute', (_name, element, tag) => {
    const { container } = render(element());
    const host = container.querySelector(tag) as HTMLElement;

    expect(host.classList.contains('mine')).toBe(true);
    expect(host.hasAttribute('classname')).toBe(false);
  });

  it('keeps the class in sync when className changes between renders', () => {
    const { container, rerender } = render(<Button className="a">x</Button>);
    const host = container.querySelector('ui-button') as HTMLElement;
    expect(host.className).toContain('a');

    rerender(<Button className="b">x</Button>);
    expect(host.classList.contains('b')).toBe(true);
    expect(host.classList.contains('a')).toBe(false);

    rerender(<Button>x</Button>);
    expect(host.classList.contains('b')).toBe(false);
  });
});

describe('createUIElement', () => {
  const renderHost = (props: Record<string, unknown>) => {
    const { container } = render(createUIElement('ui-test-host', props, 'child'));
    return container.firstElementChild as HTMLElement;
  };

  it('maps className to class', () => {
    const host = renderHost({ className: 'one two' });
    expect(host.getAttribute('class')).toBe('one two');
    expect(host.hasAttribute('classname')).toBe(false);
  });

  it('merges className with an explicit class', () => {
    expect(renderHost({ className: 'b', class: 'a' }).getAttribute('class')).toBe('a b');
  });

  it('omits an empty or nullish className', () => {
    expect(renderHost({ className: '' }).hasAttribute('class')).toBe(false);
    expect(renderHost({ className: undefined }).hasAttribute('class')).toBe(false);
    expect(renderHost({ className: null }).hasAttribute('class')).toBe(false);
  });

  it('passes every other prop and the children through unchanged', () => {
    const host = renderHost({ id: 'x', 'data-k': 'v', slot: 's' });
    expect(host.id).toBe('x');
    expect(host.getAttribute('data-k')).toBe('v');
    expect(host.getAttribute('slot')).toBe('s');
    expect(host.textContent).toBe('child');
  });

  it('does not mutate the props it is given', () => {
    const props = { className: 'c' };
    renderHost(props);
    expect(props).toEqual({ className: 'c' });
  });

  it('leaves built-in elements alone (React already maps className there)', () => {
    const { container } = render(createUIElement('span', { className: 'plain' }));
    expect((container.firstElementChild as HTMLElement).getAttribute('class')).toBe('plain');
  });
});

// A wrapper that builds its host with React.createElement('ui-…') directly bypasses the
// className mapping, which is how ~100 wrappers shipped without working className support.
describe('wrapper sources', () => {
  const dir = join(__dirname, '../components');
  // _internals.ts is where the helper itself (and its explanatory comment) lives.
  const files = readdirSync(dir).filter((file) => /\.tsx?$/.test(file) && file !== '_internals.ts');

  it('create ui-* hosts only through createUIElement', () => {
    const offenders = files.filter((file) => {
      const source = readFileSync(join(dir, file), 'utf8');
      return /React\.createElement\(\s*['"]ui-/.test(source) || /<ui-[a-z]/.test(source);
    });

    expect(offenders).toEqual([]);
  });
});
