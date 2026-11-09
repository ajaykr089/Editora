import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { EditoraEditor } from '../index';

afterEach(cleanup);

// jsdom has no ResizeObserver; the toolbar uses one.
if (!(globalThis as any).ResizeObserver) {
  (globalThis as any).ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
}

function typeStart(content: HTMLElement) {
  content.focus();
  const event = new InputEvent('beforeinput', { inputType: 'insertText', data: 'H', bubbles: true, cancelable: true });
  content.dispatchEvent(event);
}

describe('typing into an empty editor', () => {
  it('starts a paragraph first, so text does not land at the root', async () => {
    const { container } = render(<EditoraEditor value="" onChange={() => {}} placeholder="Write…" plugins={[]} />);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const content = container.querySelector('.rte-content') as HTMLElement;
    expect(content.innerHTML).toBe('');
    typeStart(content);
    expect(content.innerHTML).toBe('<p><br></p>');
    const selection = window.getSelection()!;
    expect(selection.anchorNode).toBe(content.firstChild);
  });

  it('leaves existing content alone', async () => {
    const { container } = render(<EditoraEditor value="<p>Already here</p>" onChange={() => {}} plugins={[]} />);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const content = container.querySelector('.rte-content') as HTMLElement;
    typeStart(content);
    expect(content.innerHTML).toBe('<p>Already here</p>');
  });
});
