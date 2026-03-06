import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme, Button } from '../components';

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
    expect(getByTestId('text').textContent).toBe('#111827');

    rerender(
      <ThemeProvider tokens={{ colors: { primary: '#654321' } }}>
        <Consumer />
      </ThemeProvider>
    );

    expect(getByTestId('primary').textContent).toBe('#654321');
    expect(getByTestId('text').textContent).toBe('#111827');
  });
});
