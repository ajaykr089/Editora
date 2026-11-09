import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';

describe('Input and Textarea error prop', () => {
  it('shows the message and marks the field invalid, like Select', () => {
    const { container, rerender } = render(<><Input label="Title" error="Titles need 4 characters." /><Textarea label="Body" error="Write something." /></>);
    const input = container.querySelector('ui-input')!;
    const textarea = container.querySelector('ui-textarea')!;
    expect(input.getAttribute('data-error')).toBe('Titles need 4 characters.');
    expect(input.getAttribute('validation')).toBe('error');
    expect(textarea.getAttribute('data-error')).toBe('Write something.');
    rerender(<><Input label="Title" error="" /><Textarea label="Body" error="" /></>);
    expect(input.hasAttribute('data-error')).toBe(false);
    expect(input.hasAttribute('validation')).toBe(false);
    expect(textarea.hasAttribute('data-error')).toBe(false);
  });

  it('leaves errors alone without the prop (a Form manages them)', () => {
    const { container } = render(<Input label="Title" />);
    const input = container.querySelector('ui-input')!;
    input.setAttribute('data-error', 'From the form');
    expect(input.getAttribute('data-error')).toBe('From the form');
  });
});
