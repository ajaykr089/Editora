import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../components/ContextMenu';
import '../../../ui-core/src/components/ui-context-menu';

import { ContextMenu } from '../components/ContextMenu';

describe('ContextMenu wrapper', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('deduplicates imperative point opens across equivalent rerenders', async () => {
    const point = { x: 120, y: 84 };
    const { container, rerender } = render(<ContextMenu open={false} anchorPoint={point} />);
    const el = container.querySelector('ui-context-menu') as HTMLElement & {
      openAt?: (point: { x: number; y: number }) => void;
      close?: () => void;
    };

    expect(el).toBeTruthy();

    const openAtSpy = vi.spyOn(el, 'openAt' as never);

    rerender(<ContextMenu open anchorPoint={point} />);
    await waitFor(() => expect(openAtSpy).toHaveBeenCalledTimes(1));

    rerender(<ContextMenu open anchorPoint={point} />);
    rerender(<ContextMenu open anchorPoint={{ x: 120, y: 84 }} />);

    await waitFor(() => expect(openAtSpy).toHaveBeenCalledTimes(1));
  });

  it('keeps item callbacks working after the menu content is portaled by ui-core', async () => {
    const onClick = vi.fn();
    const point = { x: 48, y: 32 };
    const { container } = render(<ContextMenu open anchorPoint={point} items={[{ label: 'Inspect', onClick }]} />);
    const el = container.querySelector('ui-context-menu') as HTMLElement & { openAt?: (point: { x: number; y: number }) => void };

    expect(el).toBeTruthy();

    await waitFor(() => expect(el.hasAttribute('open')).toBe(true));

    await waitFor(() => expect(document.getElementById('ui-portal-root')?.querySelector('.menuitem')).toBeTruthy());
    const menuItem = document.getElementById('ui-portal-root')?.querySelector('.menuitem') as HTMLElement | null;
    expect(menuItem).toBeTruthy();

    fireEvent.click(menuItem!);
    await waitFor(() => expect(onClick).toHaveBeenCalledTimes(1));
  });

  it('opens anchored menus when controlled with open and anchorId', async () => {
    const anchor = document.createElement('div');
    anchor.id = 'ctx-anchor-test';
    anchor.style.position = 'absolute';
    anchor.style.left = '24px';
    anchor.style.top = '24px';
    anchor.style.width = '20px';
    anchor.style.height = '20px';
    document.body.appendChild(anchor);

    render(<ContextMenu open anchorId="ctx-anchor-test" items={[{ label: 'Inspect' }]} />);

    await waitFor(() => expect(document.getElementById('ui-portal-root')?.querySelector('.ui-context-menu-portal')).toBeTruthy());
    const menuItem = document.getElementById('ui-portal-root')?.querySelector('.menuitem');
    expect(menuItem).toBeTruthy();
    expect(menuItem?.textContent || '').toContain('Inspect');
  });

  it('keeps custom React child handlers working after the menu content is portaled by ui-core', async () => {
    const onClick = vi.fn();
    render(
      <ContextMenu open anchorPoint={{ x: 64, y: 40 }}>
        <div className="menuitem" role="menuitem" tabIndex={0} onClick={onClick}>
          Inspect node
        </div>
      </ContextMenu>
    );

    await waitFor(() => expect(document.getElementById('ui-portal-root')?.querySelector('.menuitem')).toBeTruthy());
    const menuItem = document.getElementById('ui-portal-root')?.querySelector('.menuitem') as HTMLElement | null;
    expect(menuItem).toBeTruthy();

    fireEvent.click(menuItem!);
    await waitFor(() => expect(onClick).toHaveBeenCalledTimes(1));
  });
});
