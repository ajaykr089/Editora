import React, { useState, useMemo } from 'react';
import { ThemeProvider, Button } from '@editora/ui-react';

// Default light and dark theme tokens
const light = {
  colors: {
    primary: '#2563eb',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    text: '#111827',
    muted: '#64748b',
    border: 'rgba(15, 23, 42, 0.16)',
    focusRing: '#2563eb'
  },
  radius: '8px',
  typography: { size: { md: '16px' } }
};
const dark = {
  colors: {
    primary: '#7c3aed',
    background: '#111827',
    surface: '#0f172a',
    surfaceAlt: '#1e293b',
    text: '#f8fafc',
    muted: '#94a3b8',
    border: 'rgba(148, 163, 184, 0.34)',
    focusRing: '#93c5fd'
  },
  radius: '8px',
  typography: { size: { md: '16px' } }
};
const highContrast = {
  colors: {
    primary: '#0033ff',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceAlt: '#ffffff',
    text: '#000000',
    muted: '#1a1a1a',
    border: '#000000',
    focusRing: '#ff0080'
  },
  shadows: { sm: 'none', md: 'none' },
  radius: '8px',
  typography: { size: { md: '16px' } }
};

export const withThemeSwitcher = (Story, context) => {
  if (context?.parameters?.themeSwitcher?.disable) {
    return <Story {...context} />;
  }

  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('light');
  const tokens = useMemo(() => {
    if (theme === 'dark') return dark;
    if (theme === 'high-contrast') return highContrast;
    return light;
  }, [theme]);

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'high-contrast' : 'light';
  const nextThemeLabel = nextTheme === 'high-contrast' ? 'High Contrast' : nextTheme[0].toUpperCase() + nextTheme.slice(1);

  return (
    <ThemeProvider tokens={tokens}>
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
        <Button size="sm" variant="secondary" onClick={() => setTheme(nextTheme)}>
          Switch to {nextThemeLabel}
        </Button>
      </div>
      <div style={{ background: 'var(--ui-color-background)', color: 'var(--ui-color-text)', minHeight: '100vh', transition: 'background 0.2s, color 0.2s' }}>
        <Story {...context} />
      </div>
    </ThemeProvider>
  );
};
