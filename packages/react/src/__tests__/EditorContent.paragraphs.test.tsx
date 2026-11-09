import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
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

describe('editor accessible name', () => {
  it('uses ariaLabel, or a visible label by id', async () => {
    const { container, rerender } = render(<EditoraEditor value="" placeholder="Write…" ariaLabel="Message" plugins={[]} />);
    const content = container.querySelector('.rte-content') as HTMLElement;
    expect(content.getAttribute('aria-label')).toBe('Message');
    rerender(<EditoraEditor value="" placeholder="Write…" ariaLabelledBy="body-label" plugins={[]} />);
    expect(content.getAttribute('aria-labelledby')).toBe('body-label');
    expect(content.hasAttribute('aria-label')).toBe(false);
  });
});

describe('controlled editor and its debounced onChange', () => {
  it('does not write its own (older) report back over newer typing', async () => {
    vi.useFakeTimers();
    function Controlled() {
      const [html, setHtml] = React.useState('');
      return <EditoraEditor value={html} onChange={setHtml} plugins={[]} />;
    }
    const { container } = render(<Controlled />);
    const content = container.querySelector('.rte-content') as HTMLElement;
    content.innerHTML = '<p>Hello t</p>';
    content.dispatchEvent(new Event('input', { bubbles: true }));
    // The user keeps typing before the 100ms report fires...
    content.innerHTML = '<p>Hello there</p>';
    // ...then the report of "Hello t" arrives and comes back as value.
    await act(async () => { vi.advanceTimersByTime(150); });
    expect(content.innerHTML).toBe('<p>Hello there</p>');
    vi.useRealTimers();
  });
});
