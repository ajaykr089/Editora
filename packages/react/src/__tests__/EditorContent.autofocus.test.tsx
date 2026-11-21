import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { EditoraEditor } from '../index';

afterEach(cleanup);

// jsdom has no ResizeObserver; the toolbar uses one.
if (!(globalThis as any).ResizeObserver) {
  (globalThis as any).ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('focus on mount', () => {
  it('leaves focus where it was by default', async () => {
    const field = document.createElement('input');
    document.body.appendChild(field);
    field.focus();
    const { container } = render(<EditoraEditor value="<p>Hi</p>" plugins={[]} />);
    await tick();
    expect(container.querySelector('.rte-content')).not.toBe(document.activeElement);
    expect(document.activeElement).toBe(field);
    field.remove();
  });

  it('focuses the editing area with autofocus', async () => {
    const { container } = render(<EditoraEditor value="<p>Hi</p>" autofocus plugins={[]} />);
    await tick();
    expect(document.activeElement).toBe(container.querySelector('.rte-content'));
  });

  it('with autofocus, focuses when a read-only editor becomes editable, not before', async () => {
    const { container, rerender } = render(<EditoraEditor value="<p>Hi</p>" autofocus readonly plugins={[]} />);
    await tick();
    const content = container.querySelector('.rte-content');
    expect(document.activeElement).not.toBe(content);
    rerender(<EditoraEditor value="<p>Hi</p>" autofocus readonly={false} plugins={[]} />);
    await tick();
    expect(document.activeElement).toBe(content);
  });

  it('without autofocus, does not take focus when it becomes editable', async () => {
    const { container, rerender } = render(<EditoraEditor value="<p>Hi</p>" readonly plugins={[]} />);
    await tick();
    rerender(<EditoraEditor value="<p>Hi</p>" readonly={false} plugins={[]} />);
    await tick();
    expect(document.activeElement).not.toBe(container.querySelector('.rte-content'));
  });
});
