import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../components/Button';
import { NavigationProvider } from '../components/NavigationProvider';

describe('Button href', () => {
  it('becomes a link that goes through the app router', async () => {
    const navigate = vi.fn();
    const { container } = render(
      <NavigationProvider navigate={navigate}>
        <Button href="/orders">All orders</Button>
      </NavigationProvider>
    );
    const host = container.querySelector('ui-button')!;
    expect(host.getAttribute('href')).toBe('/orders');
    await new Promise((resolve) => setTimeout(resolve, 0));
    const link = host.shadowRoot!.querySelector('a')!;
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledWith('/orders', expect.objectContaining({ href: '/orders' }));
  });
});
