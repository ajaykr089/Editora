// The runtime entry, not the package root: the root registers every component.
import { createThemeTokens, type ThemeMode } from '@editora/ui-core/runtime';

// Larkspur's brand is a deep violet (white text on it passes AA), with the system font stack so
// screenshots are the same everywhere.
export const FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

export type Density = 'compact' | 'default' | 'comfortable';

export function larkspurTheme(mode: ThemeMode, density: Density = 'default') {
  const dark = mode === 'dark';
  return createThemeTokens(
    {
      colors: {
        primary: dark ? '#a78bfa' : '#5b21b6',
        primaryHover: dark ? '#c4b5fd' : '#4c1d95',
        foregroundOnPrimary: dark ? '#1e1036' : '#ffffff',
      },
      typography: { family: FONT_STACK, headingFamily: FONT_STACK },
      radius: '10px',
      density,
    },
    { mode }
  );
}

/** ?theme=light|dark wins (screenshots, tests); then the saved choice; then the system setting. */
export function initialMode(): ThemeMode {
  const asked = new URLSearchParams(window.location.search).get('theme');
  if (asked === 'light' || asked === 'dark') return asked;
  try {
    const saved = localStorage.getItem('larkspur-mode');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* storage blocked */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
