import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  useHeadlessCombobox,
  useHeadlessContextMenu,
  useHeadlessNavigationMenu,
  useHeadlessScrollArea,
  useHeadlessSelect,
  useHeadlessToaster,
} from '../index';

function Select(props: Parameters<typeof useHeadlessSelect>[0]) {
  const select = useHeadlessSelect({ placeholder: 'Fruit…', ...props });
  return (
    <>
      <button ref={select.triggerRef}><span data-select-value /></button>
      <div ref={select.listboxRef} hidden aria-label="Fruit">
        <div data-option data-value="apple">Apple</div>
        <div data-option data-value="cherry">Cherry</div>
      </div>
      <output data-testid="value">{select.value}</output>
    </>
  );
}

function Combobox() {
  const combo = useHeadlessCombobox();
  return (
    <>
      <label htmlFor="c">Country</label>
      <input id="c" ref={combo.inputRef} />
      <div ref={combo.listboxRef} hidden>
        <div data-option data-value="fr">France</div>
        <div data-option data-value="gr">Greece</div>
      </div>
      <output data-testid="value">{combo.value}</output>
    </>
  );
}

function ContextMenu(props: { onSelect: (item: HTMLElement) => void }) {
  const ctx = useHeadlessContextMenu(props);
  return (
    <>
      <div ref={ctx.targetRef} tabIndex={0} data-testid="area">Area</div>
      <div ref={ctx.menuRef} hidden>
        <button data-menu-item>Copy</button>
      </div>
      <output data-testid="open">{String(ctx.open)}</output>
    </>
  );
}

function Nav() {
  const nav = useHeadlessNavigationMenu({ openDelay: -1 });
  return (
    <nav ref={nav.rootRef} aria-label="Main">
      <div data-nav-item data-value="products">
        <button data-nav-trigger>Products</button>
        <div data-nav-content><a href="#e">Editor</a></div>
      </div>
      <output data-testid="value">{nav.value}</output>
    </nav>
  );
}

function Scroll() {
  const area = useHeadlessScrollArea({ type: 'always' });
  return (
    <div ref={area.rootRef}>
      <div data-scroll-viewport data-testid="viewport"><p>Text</p></div>
      <div data-scrollbar="vertical" data-testid="track"><div data-scroll-thumb /></div>
    </div>
  );
}

function Toaster() {
  const toaster = useHeadlessToaster<{ title: string }>({ duration: Infinity });
  return (
    <>
      <button onClick={() => toaster.toast({ title: 'Saved' })}>Save</button>
      <ol ref={toaster.regionRef}>
        {toaster.toasts.map((t) => (
          <li key={t.id} ref={toaster.toastRef(t.id)}>
            {t.title}
            <button data-toast-close>Close</button>
          </li>
        ))}
      </ol>
    </>
  );
}

describe('headless overlay hooks', () => {
  it('useHeadlessSelect shows the placeholder, chooses with the keyboard', () => {
    const { getByRole, getByTestId } = render(<Select name="fruit" />);
    const trigger = getByRole('combobox');
    expect(trigger.textContent).toBe('Fruit…');
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(getByTestId('value').textContent).toBe('cherry');
    expect(trigger.textContent).toBe('Cherry');
  });

  it('useHeadlessSelect controlled: the parent can refuse a change', async () => {
    const onValueChange = vi.fn();
    const { getByRole } = render(<Select value="apple" onValueChange={onValueChange} />);
    const trigger = getByRole('combobox');
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'c' });
    await act(async () => { await Promise.resolve(); });
    expect(onValueChange).toHaveBeenCalledWith('cherry');
    expect(trigger.textContent).toBe('Apple');
  });

  it('useHeadlessCombobox filters and chooses', () => {
    const { getByRole, getByTestId, getByText } = render(<Combobox />);
    const input = getByRole('combobox', { name: 'Country' }) as HTMLInputElement;
    input.focus();
    fireEvent.input(input, { target: { value: 'gre' } });
    expect(getByText('France').hidden).toBe(true);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(getByTestId('value').textContent).toBe('gr');
    expect(input.value).toBe('Greece');
  });

  it('useHeadlessContextMenu opens on right click', () => {
    const onSelect = vi.fn();
    const { getByTestId, getByText } = render(<ContextMenu onSelect={onSelect} />);
    act(() => { fireEvent.contextMenu(getByTestId('area'), { clientX: 5, clientY: 5 }); });
    expect(getByTestId('open').textContent).toBe('true');
    act(() => { getByText('Copy').click(); });
    expect(onSelect).toHaveBeenCalled();
    expect(getByTestId('open').textContent).toBe('false');
  });

  it('useHeadlessNavigationMenu opens on click', () => {
    const { getByText, getByTestId } = render(<Nav />);
    act(() => { getByText('Products').click(); });
    expect(getByTestId('value').textContent).toBe('products');
    expect(getByText('Products').getAttribute('aria-expanded')).toBe('true');
  });

  it('useHeadlessScrollArea makes the viewport focusable and hides the track from AT', () => {
    const { getByTestId } = render(<Scroll />);
    expect(getByTestId('viewport').tabIndex).toBe(0);
    expect(getByTestId('track').getAttribute('aria-hidden')).toBe('true');
  });

  it('useHeadlessToaster adds and dismisses toasts', () => {
    const { getByText, queryByText, getByRole } = render(<Toaster />);
    act(() => { getByText('Save').click(); });
    expect(getByText('Saved')).toBeTruthy();
    expect(getByRole('region').getAttribute('aria-label')).toBe('Notifications (F8)');
    act(() => { getByText('Close').click(); });
    expect(queryByText('Saved')).toBe(null);
  });
});
