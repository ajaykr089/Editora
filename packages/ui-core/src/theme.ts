export interface ThemeTokens {
  colors: {
    primary: string;
    primaryHover?: string;
    foregroundOnPrimary?: string;
    background?: string;
    surface?: string;
    surfaceAlt?: string;
    text?: string;
    muted?: string;
    border?: string;
    focusRing?: string;
    success?: string;
    danger?: string;
    warning?: string;
  };
  radius?: string;
  shadows?: { sm?: string; md?: string };
  spacing?: { xs?: string; sm?: string; md?: string; lg?: string };
  typography?: { family?: string; size?: { sm?: string; md?: string; lg?: string } };
  motion?: { durationShort?: string; durationBase?: string; durationLong?: string; easing?: string };
  zIndex?: { modal?: number; overlay?: number; toast?: number };
  breakpoints?: { sm?: string; md?: string; lg?: string };
}

export const defaultTokens: ThemeTokens = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1e4ed8',
    foregroundOnPrimary: '#ffffff',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    text: '#111827',
    muted: '#6b7280',
    border: 'rgba(15, 23, 42, 0.16)',
    focusRing: '#2563eb',
    success: '#16a34a',
    danger: '#dc2626',
    warning: '#f59e0b'
  },
  radius: '6px',
  shadows: {
    sm: '0 2px 6px rgba(16,24,40,0.08)',
    md: '0 8px 30px rgba(2,6,23,0.12)'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '20px'
  },
  typography: {
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    size: { sm: '12px', md: '14px', lg: '16px' }
  },
  motion: { durationShort: '120ms', durationBase: '200ms', durationLong: '320ms', easing: 'cubic-bezier(.2,.9,.2,1)' },
  zIndex: { modal: 1000, overlay: 900, toast: 1100 },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px' }
};

const registeredHosts = new Set<HTMLElement>();

export function registerThemeHost(el: HTMLElement) {
  if (!el) return;
  registeredHosts.add(el);
}

export function applyTheme(tokens: any, root: ShadowRoot | Document | null = typeof document !== 'undefined' ? document : null) {
  if (!root) return;
  const styleRoot = root === document ? document.documentElement : (root as ShadowRoot);
  const setOn = (target: any, name: string, value: string) => {
    try { target.style.setProperty(name, value); } catch (e) {}
  };
  // colors (new token names)
  setOn(styleRoot, '--ui-color-primary', tokens.colors.primary);
  setOn(styleRoot, '--ui-color-primary-hover', tokens.colors.primaryHover || tokens.colors.primary);
  setOn(styleRoot, '--ui-color-foreground-on-primary', tokens.colors.foregroundOnPrimary || '#fff');
  setOn(styleRoot, '--ui-color-background', tokens.colors.background || '#fff');
  setOn(styleRoot, '--ui-color-surface', tokens.colors.surface || tokens.colors.background || '#fff');
  setOn(styleRoot, '--ui-color-surface-alt', tokens.colors.surfaceAlt || '#f8fafc');
  setOn(styleRoot, '--ui-color-text', tokens.colors.text || '#111827');
  setOn(styleRoot, '--ui-color-muted', tokens.colors.muted || '#6b7280');
  setOn(styleRoot, '--ui-color-border', tokens.colors.border || 'rgba(15, 23, 42, 0.16)');
  setOn(styleRoot, '--ui-color-focus-ring', tokens.colors.focusRing || tokens.colors.primary || '#2563eb');
  setOn(styleRoot, '--ui-color-success', tokens.colors.success || '#16a34a');
  setOn(styleRoot, '--ui-color-danger', tokens.colors.danger || '#dc2626');
  setOn(styleRoot, '--ui-color-warning', tokens.colors.warning || '#f59e0b');

  // legacy names for backward compatibility with existing components
  setOn(styleRoot, '--ui-primary', tokens.colors.primary);
  setOn(styleRoot, '--ui-primary-hover', tokens.colors.primaryHover || tokens.colors.primary);
  setOn(styleRoot, '--ui-foreground', tokens.colors.foregroundOnPrimary || '#fff');
  setOn(styleRoot, '--ui-background', tokens.colors.background || '#fff');
  setOn(styleRoot, '--ui-surface', tokens.colors.surface || tokens.colors.background || '#fff');
  setOn(styleRoot, '--ui-surface-alt', tokens.colors.surfaceAlt || '#f8fafc');
  setOn(styleRoot, '--ui-text', tokens.colors.text || '#111827');
  setOn(styleRoot, '--ui-muted', tokens.colors.muted || '#6b7280');
  setOn(styleRoot, '--ui-border', tokens.colors.border || 'rgba(15, 23, 42, 0.16)');
  setOn(styleRoot, '--ui-focus-ring', tokens.colors.focusRing || tokens.colors.primary || '#2563eb');
  setOn(styleRoot, '--ui-success', tokens.colors.success || '#16a34a');
  setOn(styleRoot, '--ui-error', tokens.colors.danger || '#dc2626');
  setOn(styleRoot, '--ui-warning', tokens.colors.warning || '#f59e0b');

  // spacing & radius
  setOn(styleRoot, '--ui-radius', tokens.radius || '6px');
  setOn(styleRoot, '--ui-space-xs', tokens.spacing?.xs || '4px');
  setOn(styleRoot, '--ui-space-sm', tokens.spacing?.sm || '8px');
  setOn(styleRoot, '--ui-space-md', tokens.spacing?.md || '12px');
  setOn(styleRoot, '--ui-space-lg', tokens.spacing?.lg || '20px');

  // shadows
  setOn(styleRoot, '--ui-shadow-sm', tokens.shadows?.sm || '0 2px 6px rgba(16,24,40,0.08)');
  setOn(styleRoot, '--ui-shadow-md', tokens.shadows?.md || '0 8px 30px rgba(2,6,23,0.12)');

  // typography
  setOn(styleRoot, '--ui-font-family', tokens.typography?.family || 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial');
  setOn(styleRoot, '--ui-font-size-sm', tokens.typography?.size?.sm || '12px');
  setOn(styleRoot, '--ui-font-size-md', tokens.typography?.size?.md || '14px');
  setOn(styleRoot, '--ui-font-size-lg', tokens.typography?.size?.lg || '16px');

  // motion
  setOn(styleRoot, '--ui-motion-short', tokens.motion?.durationShort || '120ms');
  setOn(styleRoot, '--ui-motion-base', tokens.motion?.durationBase || '200ms');
  setOn(styleRoot, '--ui-motion-long', tokens.motion?.durationLong || '320ms');
  setOn(styleRoot, '--ui-motion-easing', tokens.motion?.easing || 'cubic-bezier(.2,.9,.2,1)');

  // z-index scale
  setOn(styleRoot, '--ui-z-modal', String(tokens.zIndex?.modal ?? 1000));
  setOn(styleRoot, '--ui-z-overlay', String(tokens.zIndex?.overlay ?? 900));
  setOn(styleRoot, '--ui-z-toast', String(tokens.zIndex?.toast ?? 1100));

  // breakpoints
  setOn(styleRoot, '--ui-breakpoint-sm', tokens.breakpoints?.sm || '640px');
  setOn(styleRoot, '--ui-breakpoint-md', tokens.breakpoints?.md || '768px');
  setOn(styleRoot, '--ui-breakpoint-lg', tokens.breakpoints?.lg || '1024px');

  // propagate to registered hosts (for Shadow DOM hosts)
  for (const host of registeredHosts) {
    try {
      // new token names
      host.style.setProperty('--ui-color-primary', tokens.colors.primary);
      host.style.setProperty('--ui-color-text', tokens.colors.text || '#111827');
      host.style.setProperty('--ui-radius', tokens.radius || '6px');
      host.style.setProperty('--ui-font-family', tokens.typography?.family || 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial');
      // legacy tokens for component compatibility
      host.style.setProperty('--ui-primary', tokens.colors.primary);
      host.style.setProperty('--ui-primary-hover', tokens.colors.primaryHover || tokens.colors.primary);
      host.style.setProperty('--ui-foreground', tokens.colors.foregroundOnPrimary || '#fff');
      host.style.setProperty('--ui-background', tokens.colors.background || '#fff');
      host.style.setProperty('--ui-text', tokens.colors.text || '#111827');
      host.style.setProperty('--ui-border', tokens.colors.border || 'rgba(15, 23, 42, 0.16)');
      host.style.setProperty('--ui-motion-easing', tokens.motion?.easing || 'cubic-bezier(.2,.9,.2,1)');
    } catch (e) {}
  }
}
