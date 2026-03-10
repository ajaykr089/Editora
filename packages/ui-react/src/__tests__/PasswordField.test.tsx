import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/PasswordField';
import '../../../ui-core/src/components/ui-password-field';

import { PasswordField } from '../components/PasswordField';

describe('PasswordField wrapper', () => {
  it('syncs attrs and forwards visibility change', async () => {
    const seen: boolean[] = [];
    const { container } = render(
      <PasswordField
        label="Admin password"
        description="Used for elevated actions."
        placeholder="Enter password"
        showStrength
        revealable
        onVisibilityChange={(revealed) => seen.push(revealed)}
      />
    );

    const el = container.querySelector('ui-password-field') as HTMLElement | null;
    expect(el?.getAttribute('label')).toBe('Admin password');
    expect(el?.hasAttribute('show-strength')).toBe(true);

    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('.toggle-btn')).toBeTruthy();
    });

    const toggle = el?.shadowRoot?.querySelector('.toggle-btn') as HTMLButtonElement | null;
    toggle?.click();

    await waitFor(() => {
      expect(seen).toEqual([true]);
    });
  });

  it('forwards input change events', async () => {
    let value = '';
    const { container } = render(<PasswordField onInput={(next) => { value = next; }} />);
    const el = container.querySelector('ui-password-field') as HTMLElement | null;

    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('input')).toBeTruthy();
    });

    const input = el?.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    input!.value = 'Secret#42';
    await act(async () => {
      input!.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await waitFor(() => {
      expect(value).toBe('Secret#42');
    });
  });

  it('syncs disabled reveal state to the core toggle control', async () => {
    const { container } = render(<PasswordField disabled />);
    const el = container.querySelector('ui-password-field') as HTMLElement | null;

    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('.toggle-btn')).toBeTruthy();
    });

    const toggle = el?.shadowRoot?.querySelector('.toggle-btn') as HTMLButtonElement | null;
    expect(toggle?.disabled).toBe(true);
  });

  it('bridges custom strength evaluators and strength-change events', async () => {
    let label = '';
    const { container } = render(
      <PasswordField
        showStrength
        strengthEvaluator={() => ({
          score: 4,
          label: 'Enterprise strong',
          caption: 'Custom policy matched.'
        })}
        onStrengthChange={(detail) => { label = detail.label; }}
      />
    );

    const el = container.querySelector('ui-password-field') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('input')).toBeTruthy();
    });

    const input = el?.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    input!.value = 'Secret#42';
    input!.dispatchEvent(new Event('input', { bubbles: true }));

    await waitFor(() => {
      expect(label).toBe('Enterprise strong');
    });
  });

  it('preserves typed value when used uncontrolled across parent rerenders', async () => {
    function Harness() {
      const [length, setLength] = React.useState(0);
      return (
        <div>
          <PasswordField onInput={(next) => setLength(next.length)} />
          <span data-length>{length}</span>
        </div>
      );
    }

    const { container } = render(<Harness />);
    const el = container.querySelector('ui-password-field') as HTMLElement | null;

    await waitFor(() => {
      expect(el?.shadowRoot?.querySelector('input')).toBeTruthy();
    });

    const input = el?.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    await act(async () => {
      input!.value = 'S';
      input!.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(() => {
      expect(container.querySelector('[data-length]')?.textContent).toBe('1');
    });

    await act(async () => {
      input!.value = 'Secret';
      input!.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(() => {
      expect(container.querySelector('[data-length]')?.textContent).toBe('6');
    });

    await act(async () => {
      input!.value = 'Secret#42';
      input!.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(() => {
      expect(container.querySelector('[data-length]')?.textContent).toBe('9');
    });

    expect(input?.value).toBe('Secret#42');
  });
});
