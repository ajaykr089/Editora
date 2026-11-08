// The runtime entry, not the package root: the root registers every component.
import { createThemeTokens, type ThemeMode } from '@editora/ui-core/runtime';

// Tallyhawk's brand: a deep teal (white text on it passes contrast), with a warm amber used only
// for small highlights in the page's own CSS. A system font stack keeps screenshots stable in CI.
export const FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

export function tallyhawkTheme(mode: ThemeMode) {
  const dark = mode === 'dark';
  return createThemeTokens(
    {
      colors: {
        primary: dark ? '#2dd4bf' : '#0f766e',
        primaryHover: dark ? '#5eead4' : '#115e59',
        foregroundOnPrimary: dark ? '#042f2e' : '#ffffff',
      },
      typography: { family: FONT_STACK, headingFamily: FONT_STACK },
      radius: '10px',
    },
    { mode }
  );
}

/** ?theme=light|dark wins (screenshots); otherwise the system setting. */
export function initialMode(): ThemeMode {
  const asked = new URLSearchParams(window.location.search).get('theme');
  if (asked === 'light' || asked === 'dark') return asked;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
