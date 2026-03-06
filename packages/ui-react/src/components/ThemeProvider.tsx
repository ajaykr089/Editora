import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { applyTheme, defaultTokens, registerThemeHost, ThemeTokens } from '@editora/ui-core';

export type ThemeUpdater = ThemeTokens | Partial<ThemeTokens> | ((prev: ThemeTokens) => ThemeTokens | Partial<ThemeTokens>);

type ThemeContextValue = {
  tokens: ThemeTokens;
  setTokens: (next: ThemeUpdater) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = {
  tokens?: Partial<ThemeTokens>;
  children: React.ReactNode;
  /**
   * If provided (default: 'editora.theme.tokens'), theme tokens will be persisted to localStorage.
   * Set to `null` to disable persistence.
   */
  storageKey?: string | null;
};

function mergeThemeTokens(base: ThemeTokens, patch?: Partial<ThemeTokens> | null): ThemeTokens {
  if (!patch) return base;

  return {
    ...base,
    ...patch,
    colors: { ...base.colors, ...(patch.colors || {}) },
    shadows: { ...(base.shadows || {}), ...(patch.shadows || {}) },
    spacing: { ...(base.spacing || {}), ...(patch.spacing || {}) },
    typography: {
      ...(base.typography || {}),
      ...(patch.typography || {}),
      size: {
        ...(base.typography?.size || {}),
        ...(patch.typography?.size || {})
      }
    },
    motion: { ...(base.motion || {}), ...(patch.motion || {}) },
    zIndex: { ...(base.zIndex || {}), ...(patch.zIndex || {}) },
    breakpoints: { ...(base.breakpoints || {}), ...(patch.breakpoints || {}) }
  };
}

function readTokensFromDOM(): Partial<ThemeTokens> {
  try {
    const cs = getComputedStyle(document.documentElement);
    const primary = cs.getPropertyValue('--ui-color-primary').trim();
    if (!primary) return {};
    return {
      colors: {
        primary: primary || undefined,
        text: cs.getPropertyValue('--ui-color-text').trim() || undefined,
        background: cs.getPropertyValue('--ui-color-background').trim() || undefined
      }
    } as Partial<ThemeTokens>;
  } catch {
    return {};
  }
}

function resolveThemeUpdater(prev: ThemeTokens, next: ThemeUpdater): ThemeTokens {
  const value = typeof next === 'function' ? next(prev) : next;
  return mergeThemeTokens(prev, value);
}

export function ThemeProvider({ tokens, children, storageKey = 'editora.theme.tokens' }: Props) {
  const computeInitial = () => {
    if (typeof window !== 'undefined' && storageKey) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<ThemeTokens>;
          return mergeThemeTokens(defaultTokens, parsed);
        }
      } catch {
        // ignore malformed persisted payload
      }
    }

    if (tokens && Object.keys(tokens).length) {
      return mergeThemeTokens(defaultTokens, tokens);
    }

    if (typeof window !== 'undefined') {
      const domTokens = readTokensFromDOM();
      if (domTokens.colors && domTokens.colors.primary) {
        return mergeThemeTokens(defaultTokens, domTokens);
      }
    }

    return mergeThemeTokens(defaultTokens, tokens || {});
  };

  const [current, setCurrent] = useState<ThemeTokens>(() => computeInitial());

  useEffect(() => {
    if (!tokens || !Object.keys(tokens).length) return;
    setCurrent((prev) => mergeThemeTokens(prev, tokens));
  }, [tokens]);

  useEffect(() => {
    applyTheme(current);
    try {
      registerThemeHost(document.documentElement);
    } catch {
      // noop
    }

    if (typeof window === 'undefined' || !storageKey) return;

    const payload = JSON.stringify(current);
    let idleId: number | undefined;
    const save = () => {
      try {
        localStorage.setItem(storageKey, payload);
      } catch {
        // noop
      }
    };

    if ((window as any).requestIdleCallback) {
      idleId = (window as any).requestIdleCallback(save, { timeout: 1000 });
    } else {
      idleId = window.setTimeout(save, 250);
    }

    return () => {
      try {
        if ((window as any).cancelIdleCallback && idleId) (window as any).cancelIdleCallback(idleId);
        else if (idleId) clearTimeout(idleId);
      } catch {
        // noop
      }
    };
  }, [current, storageKey]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      tokens: current,
      setTokens: (next: ThemeUpdater) => {
        setCurrent((prev) => resolveThemeUpdater(prev, next));
      }
    }),
    [current]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeProvider;

