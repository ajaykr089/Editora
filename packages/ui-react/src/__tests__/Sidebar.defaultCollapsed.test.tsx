import React from 'react';
import { act, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import '../../../ui-core/src/components/ui-sidebar';
import { Sidebar } from '../components/Sidebar';

const items = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'orders', label: 'Orders', icon: 'cart' },
];

const host = (container: HTMLElement) => container.querySelector('ui-sidebar') as HTMLElement & { expand(): void; collapse(): void };

describe('Sidebar defaultCollapsed', () => {
  it('starts collapsed, then keeps what the user does across re-renders', async () => {
    const onCollapseChange = vi.fn();
    const { container, rerender } = render(
      <Sidebar items={items} collapsible collapseButton defaultCollapsed onCollapseChange={onCollapseChange} />
    );
    const el = host(container);
    expect(el.hasAttribute('collapsed')).toBe(true);

    await act(async () => {
      (el.shadowRoot!.querySelector('.collapse-btn') as HTMLElement).click();
    });
    expect(el.hasAttribute('collapsed')).toBe(false);
    expect(onCollapseChange).toHaveBeenLastCalledWith(false);

    // an unrelated prop change must not collapse it again
    rerender(<Sidebar items={items} collapsible collapseButton defaultCollapsed variant="solid" onCollapseChange={onCollapseChange} />);
    expect(el.hasAttribute('collapsed')).toBe(false);

    await act(async () => {
      el.collapse();
    });
    rerender(<Sidebar items={items} collapsible collapseButton defaultCollapsed variant="pill" onCollapseChange={onCollapseChange} />);
    expect(el.hasAttribute('collapsed')).toBe(true);
  });

  it('collapsed (controlled) wins over defaultCollapsed', () => {
    const { container } = render(<Sidebar items={items} collapsible collapsed={false} defaultCollapsed />);
    expect(host(container).hasAttribute('collapsed')).toBe(false);
  });

  it('without either prop the sidebar starts expanded', () => {
    const { container } = render(<Sidebar items={items} collapsible />);
    expect(host(container).hasAttribute('collapsed')).toBe(false);
  });

  it('is in the server HTML, so the first paint is already collapsed', () => {
    const html = renderToString(<Sidebar items={items} collapsible defaultCollapsed />);
    expect(html).toMatch(/<ui-sidebar[^>]*\scollapsed=""/);
  });
});
