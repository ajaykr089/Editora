import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useHeadlessDialog, useHeadlessListbox, useHeadlessMenu, useHeadlessTabs } from '../index';

function DialogDemo(props: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const dialog = useHeadlessDialog(props);
  return (
    <>
      <button ref={dialog.triggerRef}>Open</button>
      <div ref={dialog.contentRef} hidden data-testid="panel">
        <h2>Title</h2>
        <button data-dialog-close>Close</button>
      </div>
      <span data-testid="state">{String(dialog.open)}</span>
    </>
  );
}

describe('headless hooks', () => {
  it('useHeadlessDialog opens from the trigger and reports its state', () => {
    const { getByText, getByTestId } = render(<DialogDemo />);
    const panel = getByTestId('panel');
    expect(panel.getAttribute('role')).toBe('dialog');
    act(() => { getByText('Open').click(); });
    expect(panel.hidden).toBe(false);
    expect(getByTestId('state').textContent).toBe('true');
    act(() => { getByText('Close').click(); });
    expect(panel.hidden).toBe(true);
    expect(getByTestId('state').textContent).toBe('false');
  });

  it('useHeadlessDialog stays closed when controlled and the parent says no', async () => {
    const onOpenChange = vi.fn();
    const { getByText, getByTestId } = render(<DialogDemo open={false} onOpenChange={onOpenChange} />);
    act(() => { getByText('Open').click(); });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    await act(async () => { await Promise.resolve(); });
    expect(getByTestId('panel').hidden).toBe(true);
  });

  it('useHeadlessDialog follows a controlled open prop', () => {
    const { getByTestId, rerender } = render(<DialogDemo open={false} />);
    rerender(<DialogDemo open />);
    expect(getByTestId('panel').hidden).toBe(false);
  });

  it('useHeadlessMenu reports the chosen item', () => {
    const onSelect = vi.fn();
    function Demo() {
      const menu = useHeadlessMenu({ onSelect: (item) => onSelect(item.textContent) });
      return (
        <>
          <button ref={menu.triggerRef}>Actions</button>
          <div ref={menu.menuRef} hidden>
            <button data-menu-item>Edit</button>
            <button data-menu-item>Delete</button>
          </div>
        </>
      );
    }
    const { getByText } = render(<Demo />);
    act(() => { fireEvent.keyDown(getByText('Actions'), { key: 'ArrowDown' }); });
    expect(document.activeElement).toBe(getByText('Edit'));
    act(() => { getByText('Delete').click(); });
    expect(onSelect).toHaveBeenCalledWith('Delete');
  });

  it('useHeadlessTabs exposes the selected value', () => {
    function Demo() {
      const tabs = useHeadlessTabs({ defaultValue: 'billing' });
      return (
        <div>
          <div ref={tabs.tablistRef}>
            <button data-tab data-value="account">Account</button>
            <button data-tab data-value="billing">Billing</button>
          </div>
          <div data-panel data-value="account">A</div>
          <div data-panel data-value="billing">B</div>
          <span data-testid="value">{tabs.value}</span>
        </div>
      );
    }
    const { getByText, getByTestId } = render(<Demo />);
    expect(getByText('Billing').getAttribute('aria-selected')).toBe('true');
    act(() => { getByText('Account').click(); });
    expect(getByTestId('value').textContent).toBe('account');
    expect(getByText('B').hidden).toBe(true);
  });

  it('useHeadlessListbox selects several values', () => {
    function Demo() {
      const list = useHeadlessListbox({ multiple: true });
      return (
        <>
          <div ref={list.listboxRef} aria-label="Fruit">
            <div data-option data-value="a">Apple</div>
            <div data-option data-value="b">Banana</div>
          </div>
          <span data-testid="value">{list.value.join(',')}</span>
        </>
      );
    }
    const { getByText, getByTestId } = render(<Demo />);
    act(() => { getByText('Apple').click(); });
    act(() => { getByText('Banana').click(); });
    expect(getByTestId('value').textContent).toBe('a,b');
  });
});
