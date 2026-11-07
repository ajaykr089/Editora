import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '../components/Tabs';
import { Drawer } from '../components/Drawer';

const flush = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); });

function tabButtons(host: HTMLElement): HTMLButtonElement[] {
  return Array.from(host.shadowRoot?.querySelectorAll<HTMLButtonElement>('.tab') || []);
}

describe('Tabs wrapper', () => {
  it('ignores change events bubbling from controls inside a panel', async () => {
    const onChange = vi.fn();
    const onTabChange = vi.fn();
    const { container } = render(
      <Tabs selected={1} onChange={onChange} onTabChange={onTabChange}>
        <Tabs.Tab>One</Tabs.Tab>
        <Tabs.Tab>Two</Tabs.Tab>
        <Tabs.Panel>First</Tabs.Panel>
        <Tabs.Panel>
          <input type="checkbox" data-testid="box" />
        </Tabs.Panel>
      </Tabs>
    );
    await flush();

    const box = container.querySelector('input') as HTMLInputElement;
    fireEvent.click(box);
    box.dispatchEvent(new Event('change', { bubbles: true }));
    box.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { checked: true } }));
    expect(onChange).not.toHaveBeenCalled();
    expect(onTabChange).not.toHaveBeenCalled();

    const host = container.querySelector('ui-tabs') as HTMLElement;
    tabButtons(host)[0].click();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('keeps focus on the active tab when panel content re-renders', async () => {
    function Harness() {
      const [count, setCount] = React.useState(0);
      return (
        <>
          <button data-testid="bump" onClick={() => setCount((value) => value + 1)}>bump</button>
          <Tabs>
            <Tabs.Tab>One</Tabs.Tab>
            <Tabs.Tab>Two</Tabs.Tab>
            <Tabs.Panel>First</Tabs.Panel>
            <Tabs.Panel>
              {Array.from({ length: count % 3 }, (_, index) => <p key={index}>row {index}</p>)}
              <span>{count}</span>
            </Tabs.Panel>
          </Tabs>
        </>
      );
    }
    const { container, getByTestId } = render(<Harness />);
    await flush();
    const host = container.querySelector('ui-tabs') as HTMLElement;
    const before = tabButtons(host);
    // The reported flow: click a tab (the cached markup now disagrees with the live buttons),
    // then the panel re-renders.
    before[1].focus();
    before[1].click();
    await flush();
    expect(host.getAttribute('selected')).toBe('1');

    for (let i = 0; i < 4; i += 1) {
      act(() => { getByTestId('bump').click(); });
      await flush();
      expect(host.shadowRoot?.activeElement).toBe(tabButtons(host)[1]);
    }
    // Same button nodes: panel content changes no longer rebuild the tab strip.
    expect(tabButtons(host)[1]).toBe(before[1]);

    fireEvent.keyDown(before[1], { key: 'ArrowLeft' });
    await flush();
    expect(host.getAttribute('selected')).toBe('0');
    expect(host.shadowRoot?.activeElement).toBe(tabButtons(host)[0]);
  });

  it('restores focus when the tab strip itself has to rebuild', async () => {
    function Harness({ label }: { label: string }) {
      return (
        <Tabs>
          <Tabs.Tab>{label}</Tabs.Tab>
          <Tabs.Tab>Two</Tabs.Tab>
          <Tabs.Panel>A</Tabs.Panel>
          <Tabs.Panel>B</Tabs.Panel>
        </Tabs>
      );
    }
    const { container, rerender } = render(<Harness label="One" />);
    await flush();
    const host = container.querySelector('ui-tabs') as HTMLElement;
    tabButtons(host)[0].focus();
    rerender(<Harness label="Uno" />);
    await flush();
    const buttons = tabButtons(host);
    expect(buttons[0].textContent).toContain('Uno');
    expect(host.shadowRoot?.activeElement).toBe(buttons[0]);
  });

  it('only counts its own tabs, not those of a nested ui-tabs', async () => {
    const { container } = render(
      <Tabs>
        <Tabs.Tab>Outer A</Tabs.Tab>
        <Tabs.Tab>Outer B</Tabs.Tab>
        <Tabs.Panel>
          <Tabs>
            <Tabs.Tab>Inner A</Tabs.Tab>
            <Tabs.Panel>inner</Tabs.Panel>
          </Tabs>
        </Tabs.Panel>
        <Tabs.Panel>B</Tabs.Panel>
      </Tabs>
    );
    await flush();
    const outer = container.querySelector('ui-tabs') as HTMLElement;
    expect(tabButtons(outer).map((button) => button.textContent?.trim())).toEqual(['Outer A', 'Outer B']);
  });
});

describe('container wrappers ignore bubbled child events', () => {
  it('Drawer onClose/onChange do not fire for a nested element closing', async () => {
    const onClose = vi.fn();
    const onChange = vi.fn();
    const { container } = render(
      <Drawer open onClose={onClose} onChange={onChange}>
        <div data-testid="child">child</div>
      </Drawer>
    );
    await flush();
    // Opening from the prop reports itself once; only events after that matter here.
    onClose.mockClear();
    onChange.mockClear();
    const child = container.querySelector('[data-testid="child"]') as HTMLElement;
    child.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    child.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { open: false } }));
    expect(onClose).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();

    const host = container.querySelector('ui-drawer') as HTMLElement;
    host.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { open: false } }));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
