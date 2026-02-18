export const defaultTokens = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1e4ed8',
    foregroundOnPrimary: '#ffffff',
    background: '#ffffff'
  },
  radius: '6px',
  shadows: {
    sm: '0 2px 6px rgba(16,24,40,0.08)',
    md: '0 8px 30px rgba(2,6,23,0.12)'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px'
  }
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
  setOn(styleRoot, '--ui-primary', tokens.colors.primary);
  setOn(styleRoot, '--ui-primary-hover', tokens.colors.primaryHover || tokens.colors.primary);
  setOn(styleRoot, '--ui-foreground', tokens.colors.foregroundOnPrimary);
  setOn(styleRoot, '--ui-radius', tokens.radius);
  setOn(styleRoot, '--ui-shadow-sm', tokens.shadows?.sm || '0 2px 6px rgba(16,24,40,0.08)');
  setOn(styleRoot, '--ui-shadow-md', tokens.shadows?.md || '0 8px 30px rgba(2,6,23,0.12)');
  // propagate to registered hosts (for Shadow DOM hosts)
  for (const host of registeredHosts) {
    try {
      host.style.setProperty('--ui-primary', tokens.colors.primary);
      host.style.setProperty('--ui-foreground', tokens.colors.foregroundOnPrimary);
      host.style.setProperty('--ui-radius', tokens.radius);
    } catch (e) {}
  }
}
