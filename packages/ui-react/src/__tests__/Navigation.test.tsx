import React from 'react';
import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NavigationProvider } from '../components/NavigationProvider';
import { Sidebar } from '../components/Sidebar';
import { Breadcrumb } from '../components/Breadcrumb';
import { Tabs } from '../components/Tabs';
import { Pagination } from '../components/Pagination';
import { ThemeProvider } from '../components/ThemeProvider';

const settle = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 10)); });

/** Clicks like a user; returns whether the click's default (following the link) was prevented. */
function click(target: Element, init: MouseEventInit = {}): boolean {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, button: 0, ...init });
  let prevented = false;
  // Read the outcome at the window, then cancel it there so jsdom never tries to navigate.
  const record = (e: Event) => { prevented = e.defaultPrevented; e.preventDefault(); };
  window.addEventListener('click', record);
  act(() => { target.dispatchEvent(event); });
  window.removeEventListener('click', record);
  return prevented;
}

const shadow = (host: Element | null, selector: string) => host!.shadowRoot!.querySelector(selector)!;

afterEach(() => { document.body.innerHTML = ''; });

describe('one link contract: NavigationProvider routes every component', () => {
  it('routes Sidebar, Breadcrumb, route Tabs and Pagination links through navigate()', async () => {
    const navigate = vi.fn();
    const { container } = render(
      <NavigationProvider navigate={navigate}>
        <Sidebar items={[{ value: 'reports', label: 'Reports', href: '/reports' }]} />
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/expenses">Expenses</Breadcrumb.Item>
          <Breadcrumb.Item>March</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs>
          <Tabs.Tab href="/overview">Overview</Tabs.Tab>
          <Tabs.Tab href="/history">History</Tabs.Tab>
          <Tabs.Panel>o</Tabs.Panel>
          <Tabs.Panel>h</Tabs.Panel>
        </Tabs>
        <Pagination page={1} count={4} hrefTemplate="/expenses?page={page}" />
      </NavigationProvider>
    );
    await settle();

    expect(click(shadow(container.querySelector('ui-sidebar'), 'a.item-button'))).toBe(true);
    expect(click(shadow(container.querySelector('ui-breadcrumb'), 'a.crumb-link'))).toBe(true);
    act(() => { (container.querySelector('ui-tabs')!.shadowRoot!.querySelectorAll('.tab')[1] as HTMLElement).click(); });
    const pageLink = container.querySelector('ui-pagination')!.shadowRoot!.querySelector('a[data-page="3"]')!;
    expect(pageLink.getAttribute('href')).toBe('/expenses?page=3');
    expect(click(pageLink)).toBe(true);

    expect(navigate.mock.calls.map(([href]) => href)).toEqual(['/reports', '/', '/history', '/expenses?page=3']);
    expect(container.querySelector('ui-pagination')!.getAttribute('page')).toBe('3');
  });

  it("a component's own onNavigate runs first and can handle the link", async () => {
    const navigate = vi.fn();
    const own = vi.fn((detail: { href: string; preventDefault: () => void }) => detail.preventDefault());
    const { container } = render(
      <NavigationProvider navigate={navigate}>
        <Breadcrumb onNavigate={own}>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item>Here</Breadcrumb.Item>
        </Breadcrumb>
      </NavigationProvider>
    );
    await settle();
    expect(click(shadow(container.querySelector('ui-breadcrumb'), 'a.crumb-link'))).toBe(true);
    expect(own).toHaveBeenCalledWith(expect.objectContaining({ href: '/' }));
    expect(navigate).not.toHaveBeenCalled();
  });

  it('leaves new-tab clicks and pages without a router to the browser', async () => {
    const navigate = vi.fn();
    const { container } = render(
      <>
        <NavigationProvider navigate={navigate}>
          <Pagination id="routed" page={1} count={3} hrefTemplate="?page={page}" />
        </NavigationProvider>
        <Pagination id="plain" page={1} count={3} hrefTemplate="?page={page}" />
      </>
    );
    await settle();
    const routed = container.querySelector('#routed')!.shadowRoot!.querySelector('a[data-page="2"]')!;
    expect(click(routed, { metaKey: true })).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    const plain = container.querySelector('#plain')!.shadowRoot!.querySelector('a[data-page="2"]')!;
    expect(click(plain)).toBe(false);
  });
});

describe('app-wide density', () => {
  it('ThemeProvider density rescales the shared control tokens', async () => {
    const { rerender } = render(<ThemeProvider density="compact" storageKey={null}><div /></ThemeProvider>);
    await settle();
    const style = document.documentElement.style;
    expect(style.getPropertyValue('--ui-control-height-2')).toBe('28px');
    expect(style.getPropertyValue('--ui-density')).toBe('compact');
    rerender(<ThemeProvider density="comfortable" storageKey={null}><div /></ThemeProvider>);
    await settle();
    expect(style.getPropertyValue('--ui-control-height-2')).toBe('36px');
    rerender(<ThemeProvider storageKey={null}><div /></ThemeProvider>);
    await settle();
  });
});
