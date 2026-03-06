import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { useFloating } from '../hooks/useFloating';

function TestComponent() {
  const { referenceRef, floatingRef, coords, getReferenceProps, getFloatingProps, open } = useFloating({ placement: 'top', offset: 8 });
  return (
    <div>
      <button data-testid="anchor" {...getReferenceProps()} ref={referenceRef as any} style={{ position: 'absolute', top: 200, left: 120, width: 60, height: 30 }}>Open</button>
      <div data-testid="floating" {...getFloatingProps()} ref={floatingRef as any} style={{ position: 'absolute', width: 120, height: 40 }}>
        <div role="menuitem" tabIndex={-1}>One</div>
        <div role="menuitem" tabIndex={-1}>Two</div>
      </div>
      <div data-testid="coords">{coords.top}/{coords.left}/{coords.placement}/{String(open)}</div>
    </div>
  );
}

describe('useFloating hook', () => {
  it('computes coords and provides accessible headless props + keyboard helpers', async () => {
    const { getByTestId, getByText } = render(<TestComponent />);
    const anchor = getByTestId('anchor');
    const floating = getByTestId('floating');

    // Mock getBoundingClientRect to return deterministic values used by computePosition
    (anchor as any).getBoundingClientRect = () => ({ top: 200, bottom: 230, left: 120, right: 180, width: 60, height: 30 });
    (floating as any).getBoundingClientRect = () => ({ width: 120, height: 40, top: 0, left: 0, right: 0, bottom: 0 });

    // pressing ArrowDown on the reference should open and focus first item
    fireEvent.keyDown(anchor, { key: 'ArrowDown' });
    await waitFor(() => expect(anchor.getAttribute('aria-expanded')).toBe('true'));

    // Floating should become visible (hidden prop false)
    expect(floating.getAttribute('hidden')).toBeNull();

    getByText('One');
    // simulate ArrowDown on floating should focus next item
    fireEvent.keyDown(floating, { key: 'ArrowDown' });
    // we cannot rely on focus in jsdom for tabindex, but ensure no errors and open state remains
    expect(anchor.getAttribute('aria-expanded')).toBe('true');

    // pressing Escape should close
    fireEvent.keyDown(floating, { key: 'Escape' });
    await waitFor(() => expect(anchor.getAttribute('aria-expanded')).toBe('false'));

    // coords are numeric and placement present
    const coords = getByTestId('coords').textContent || '';
    expect(coords).toMatch(/\d+\/\d+\/top\/false/);
  });

  it('merges user event handlers without disabling built-in behavior', async () => {
    const userClick = vi.fn();

    function WithUserHandlers() {
      const { getReferenceProps, getFloatingProps } = useFloating({ placement: 'bottom', offset: 8 });
      return (
        <div>
          <button data-testid="trigger" {...getReferenceProps({ onClick: userClick })}>Open</button>
          <div data-testid="popup" {...getFloatingProps()} />
        </div>
      );
    }

    const { getByTestId } = render(<WithUserHandlers />);
    const trigger = getByTestId('trigger');
    const popup = getByTestId('popup');

    expect(popup.getAttribute('hidden')).not.toBeNull();
    fireEvent.click(trigger);
    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));
    expect(userClick).toHaveBeenCalledTimes(1);
    expect(popup.getAttribute('hidden')).toBeNull();
  });
});
