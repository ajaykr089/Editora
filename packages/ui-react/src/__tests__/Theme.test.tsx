import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme, Button } from '../components';
import { defaultTokens } from '@editora/ui-core';

function Consumer() {
  const { tokens, setTokens } = useTheme() as any;
  return (
    <div>
      <div data-testid="primary">{tokens.colors.primary}</div>
      <div data-testid="text">{tokens.colors.text}</div>
      <Button onClick={() => setTokens({ colors: { primary: '#000000' } })}>Set</Button>
    </div>
  );
}

describe('ThemeProvider (React)', () => {
  it('applies tokens and allows updates via useTheme', () => {
    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    expect(getByTestId('primary').textContent).toBeDefined();
    fireEvent.click(getByText('Set'));
    expect(getByTestId('primary').textContent).toBe('#000000');
    // CSS variable should be set on documentElement
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary').trim()).toBe('#000000');
  });

  it('deep-merges nested token groups when partial updates are applied', () => {
    const { getByTestId, rerender } = render(
      <ThemeProvider tokens={{ colors: { primary: '#123456' } }}>
        <Consumer />
      </ThemeProvider>
    );

    expect(getByTestId('primary').textContent).toBe('#123456');
    expect(getByTestId('text').textContent).toBe(defaultTokens.colors.text);

    rerender(
      <ThemeProvider tokens={{ colors: { primary: '#654321' } }}>
        <Consumer />
      </ThemeProvider>
    );

    expect(getByTestId('primary').textContent).toBe('#654321');
    expect(getByTestId('text').textContent).toBe(defaultTokens.colors.text);
  });
  it('sets the panel surfaces from a dark theme instead of leaving them light', () => {
    render(
      <ThemeProvider
        storageKey={null}
        tokens={{ colors: { ...defaultTokens.colors, background: '#020617', surface: '#0f172a', text: '#e2e8f0' } }}
      >
        <Consumer />
      </ThemeProvider>
    );

    const root = getComputedStyle(document.documentElement);
    expect(root.getPropertyValue('--color-panel-solid').trim()).toBe('#0f172a');
    expect(root.getPropertyValue('--color-background').trim()).toBe('#020617');
  });
});
