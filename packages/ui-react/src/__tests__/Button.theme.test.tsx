import React from 'react';
import { render } from '@testing-library/react';
import { Button } from '../components';

describe('React Button theme prop', () => {
  it('sets theme attribute for non-default values', () => {
    const { container } = render(<Button theme="dark">Hi</Button>);
    const host = container.querySelector('ui-button') as HTMLElement | null;
    expect(host).toBeTruthy();
    expect(host?.getAttribute('theme')).toBe('dark');
  });

  it('does not set theme attribute for "default"', () => {
    const { container } = render(<Button theme="default">Hi</Button>);
    const host = container.querySelector('ui-button') as HTMLElement | null;
    expect(host).toBeTruthy();
    expect(host?.hasAttribute('theme')).toBe(false);
  });

  it('sets theme attribute for brand', () => {
    const { container } = render(<Button theme="brand">Hi</Button>);
    const host = container.querySelector('ui-button') as HTMLElement | null;
    expect(host?.getAttribute('theme')).toBe('brand');
  });

  it('reflects radius prop as a host attribute', () => {
    const { container } = render(<Button radius={12}>Hi</Button>);
    const host = container.querySelector('ui-button') as HTMLElement | null;
    expect(host?.getAttribute('radius')).toBe('12');
  });

  it('preserves full radius value on the host', async () => {
    const { container } = render(<Button radius="full">Hi</Button>);
    const host = container.querySelector('ui-button') as HTMLElement | null;
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(host?.getAttribute('radius')).toBe('full');
    expect(host?.style.getPropertyValue('--ui-btn-radius')).toBe('999px');
  });
}); 
