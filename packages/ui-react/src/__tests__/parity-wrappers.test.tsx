import React from 'react';
import { renderToString } from 'react-dom/server';
import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  Attachment,
  Bubble,
  ButtonGroup,
  Heading,
  Item,
  Message,
  MessageScroller,
  Question,
  Questionnaire,
  Spinner,
  TraceItem,
  announce,
} from '../index';
import { Heading as ServerHeading, Item as ServerItem, Spinner as ServerSpinner } from '../server';

const flush = () => act(async () => {
  await Promise.resolve();
  await Promise.resolve();
});

describe('parity wrappers: attributes', () => {
  it('maps camelCase props to kebab attributes and drops false booleans', () => {
    const { container } = render(<Item label="Ada" mediaVariant="icon" disabled={false} href="/a" className="mine" />);
    const host = container.querySelector('ui-item')!;
    expect(host.getAttribute('media-variant')).toBe('icon');
    expect(host.hasAttribute('mediavariant')).toBe(false);
    expect(host.hasAttribute('disabled')).toBe(false);
    expect(host.getAttribute('href')).toBe('/a');
    expect(host.classList.contains('mine')).toBe(true);
  });

  it('writes true booleans as present attributes', () => {
    const { container } = render(<Spinner decorative size="lg" label="Saving" />);
    const host = container.querySelector('ui-spinner')!;
    expect(host.getAttribute('decorative')).toBe('');
    expect(host.getAttribute('size')).toBe('lg');
  });

  it('passes numbers as strings and forwards refs', () => {
    const ref = React.createRef<HTMLElement>();
    const { container } = render(<Heading ref={ref} level={1}>Hi</Heading>);
    expect(container.querySelector('ui-heading')!.getAttribute('level')).toBe('1');
    expect(ref.current?.localName).toBe('ui-heading');
  });

  it('renders on the server without a DOM element registry', () => {
    const html = renderToString(
      <>
        <ServerHeading level={3}>Title</ServerHeading>
        <ServerSpinner decorative={false} label="Loading" />
        <ServerItem mediaVariant="image" label="Row" />
      </>
    );
    expect(html).toContain('<ui-heading level="3">Title</ui-heading>');
    expect(html).toContain('label="Loading"');
    expect(html).not.toContain('decorative');
    expect(html).toContain('media-variant="image"');
  });

  it('composes chat parts', () => {
    const { container } = render(
      <Message name="Ada" align="end">
        <Bubble variant="tinted" reactionsSide="top">Hi</Bubble>
      </Message>
    );
    expect(container.querySelector('ui-bubble')!.getAttribute('reactions-side')).toBe('top');
    expect(container.querySelector('ui-message')!.getAttribute('align')).toBe('end');
  });

  it('groups buttons', () => {
    const { container } = render(<ButtonGroup orientation="vertical" detached><button>A</button></ButtonGroup>);
    const host = container.querySelector('ui-button-group')!;
    expect(host.getAttribute('orientation')).toBe('vertical');
    expect(host.getAttribute('detached')).toBe('');
  });

  it('re-exports announce()', () => {
    expect(typeof announce).toBe('function');
  });
});

describe('parity wrappers: events and state', () => {
  it('Attachment calls onRemove with the file name', async () => {
    const onRemove = vi.fn();
    const { container } = render(<Attachment name="a.txt" removable onRemove={onRemove} />);
    await flush();
    const host = container.querySelector('ui-attachment')!;
    (host.shadowRoot!.querySelector('.remove') as HTMLButtonElement).click();
    expect(onRemove).toHaveBeenCalledWith({ name: 'a.txt' });
  });

  it('TraceItem is controlled by open and reports toggles', async () => {
    const onOpenChange = vi.fn();
    const { container, rerender } = render(<TraceItem label="Searched" open={false} onOpenChange={onOpenChange}><p>details</p></TraceItem>);
    await flush();
    const host = container.querySelector('ui-trace-item')!;
    const button = () => host.shadowRoot!.querySelector('button.line') as HTMLButtonElement;
    button().click();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Still closed until the parent says otherwise.
    expect(host.hasAttribute('open')).toBe(false);
    rerender(<TraceItem label="Searched" open onOpenChange={onOpenChange}><p>details</p></TraceItem>);
    await flush();
    expect(host.hasAttribute('open')).toBe(true);
  });

  it('TraceItem opens itself when uncontrolled', async () => {
    const { container } = render(<TraceItem label="Searched" defaultOpen><p>details</p></TraceItem>);
    await flush();
    const host = container.querySelector('ui-trace-item')!;
    expect(host.hasAttribute('open')).toBe(true);
    (host.shadowRoot!.querySelector('button.line') as HTMLButtonElement).click();
    expect(host.hasAttribute('open')).toBe(false);
  });

  it('MessageScroller maps its options and exposes the element API', async () => {
    const ref = React.createRef<any>();
    const { container } = render(<MessageScroller ref={ref} autoScroll={false} hideJumpButton initialScroll="start" label="Chat"><div>m</div></MessageScroller>);
    await flush();
    const host = container.querySelector('ui-message-scroller')!;
    expect(host.hasAttribute('no-auto-scroll')).toBe(true);
    expect(host.hasAttribute('no-jump-button')).toBe(true);
    expect(host.getAttribute('initial-scroll')).toBe('start');
    expect(typeof ref.current.scrollToEnd).toBe('function');
  });

  it('Questionnaire takes items and defaultValues and reports submit', async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <Questionnaire
        items={[{ name: 'a', label: 'A?', type: 'text' }]}
        defaultValues={{ a: 'hello' }}
        onSubmit={onSubmit}
      />
    );
    await flush();
    const host = container.querySelector('ui-questionnaire')!;
    expect((host.shadowRoot!.querySelector('textarea') as HTMLTextAreaElement).value).toBe('hello');
    (host.shadowRoot!.querySelector('[data-action="next"]') as HTMLButtonElement).click();
    expect(onSubmit.mock.calls[0][0]).toEqual({ a: 'hello' });
  });

  it('Questionnaire reads Question children', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Questionnaire onChange={onChange}>
        <Question name="scope" label="Build what?" required>
          <option value="web">Web</option>
          <option value="api">API</option>
        </Question>
      </Questionnaire>
    );
    await flush();
    const host = container.querySelector('ui-questionnaire')!;
    const radio = host.shadowRoot!.querySelector('input[value="api"]') as HTMLInputElement;
    radio.checked = true;
    radio.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(onChange.mock.calls[0][0]).toMatchObject({ name: 'scope', value: 'api' });
  });
});
