import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../components';

describe('ThemeProvider persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.cssText = '';
  });

  it('persists tokens to localStorage when storageKey is provided', () => {
    function Consumer() {
      const { tokens, setTokens } = useTheme() as any;
      return <button data-testid="btn" onClick={() => setTokens({ ...tokens, colors: { ...tokens.colors, primary: '#000000' } })}>Set</button>;
    }

    const { getByTestId } = render(
      <ThemeProvider storageKey="test.theme.tokens">
        <Consumer />
      </ThemeProvider>
    );

    fireEvent.click(getByTestId('btn'));
    const raw = localStorage.getItem('test.theme.tokens');
    expect(raw).toBeTruthy();
    const saved = JSON.parse(raw!);
    expect(saved.colors.primary).toBe('#000000');
  });

  it('does not persist when storageKey is null', () => {
    function Consumer() {
      const { tokens, setTokens } = useTheme() as any;
      return <button data-testid="btn" onClick={() => setTokens({ ...tokens, colors: { ...tokens.colors, primary: '#111111' } })}>Set</button>;
    }

    const { getByTestId } = render(
      <ThemeProvider storageKey={null}>
        <Consumer />
      </ThemeProvider>
    );

    fireEvent.click(getByTestId('btn'));
    expect(localStorage.getItem('editora.theme.tokens')).toBeNull();
  });

  it('uses the tokens prop over a saved theme from the first render', () => {
    localStorage.setItem('test.theme.tokens', JSON.stringify({ colors: { primary: '#ff0000' } }));
    let seen = '';
    function Child() {
      seen = document.documentElement.style.getPropertyValue('--ui-color-primary').trim();
      return null;
    }
    render(
      <ThemeProvider storageKey="test.theme.tokens" tokens={{ colors: { primary: '#5b21b6' } } as any}>
        <Child />
      </ThemeProvider>
    );
    expect(seen).toBe('#5b21b6');
  });

  it('restores the saved theme when the app passes no tokens', () => {
    localStorage.setItem('test.theme.tokens', JSON.stringify({ colors: { primary: '#ff0000' } }));
    render(<ThemeProvider storageKey="test.theme.tokens"><span /></ThemeProvider>);
    expect(document.documentElement.style.getPropertyValue('--ui-color-primary').trim()).toBe('#ff0000');
  });
});
