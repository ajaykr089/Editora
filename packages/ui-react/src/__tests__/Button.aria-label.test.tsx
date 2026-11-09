import React from 'react';
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Button } from '../components/Button';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => { document.body.innerHTML = ''; });

describe('Button accessible name', () => {
  it('names an icon-only button from the standard aria-label attribute', async () => {
    const { container } = render(<Button icon="bell" aria-label="Notifications" />);
    await tick();
    const host = container.querySelector('ui-button')!;
    expect(host.getAttribute('aria-label')).toBe('Notifications');
    expect(host.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe('Notifications');
  });

  it('still accepts ariaLabel, which wins over aria-label', async () => {
    const { container } = render(<Button ariaLabel="Close" aria-label="Ignored" />);
    await tick();
    expect(container.querySelector('ui-button')!.getAttribute('aria-label')).toBe('Close');
  });
});
