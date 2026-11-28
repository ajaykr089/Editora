import React from 'react';

// The theme builder runs in the browser only: @editora/ui-core and ui-react define custom elements
// at import time, which throws in the server build, so they are loaded from an effect.

type Mode = 'light' | 'dark';
type Accent = 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'custom';
type Density = 'compact' | 'default' | 'comfortable';

type Settings = { mode: Mode; accent: Accent; custom: string; radius: number; density: Density; font: string };

type Core = {
  createThemeTokens: (overrides?: Record<string, unknown>, options?: { accentPalette?: string; mode?: Mode }) => any;
  themeToCss: (tokens: any, selector?: string) => string;
};

const FONTS: Record<string, string> = {
  System: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  Inter: 'Inter, system-ui, sans-serif',
  Serif: 'Georgia, "Times New Roman", serif',
  Mono: 'ui-monospace, "SF Mono", Menlo, monospace',
};

const DEFAULTS: Settings = { mode: 'light', accent: 'blue', custom: '#7c3aed', radius: 8, density: 'default', font: 'System' };

// --- colour maths ----------------------------------------------------------------------------------

function hexToRgb(value: string): [number, number, number] | null {
  const hex = String(value).trim().replace(/^#/, '');
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance([r, g, b]: [number, number, number]): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string): number | null {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  if (!x || !y) return null;
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
}

function mix(hex: string, toward: string, amount: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(toward);
  if (!a || !b) return hex;
  return `#${a.map((c, i) => Math.round(c + (b[i] - c) * amount).toString(16).padStart(2, '0')).join('')}`;
}

/** Tokens for the settings: a preset accent palette, or a custom brand colour layered on the base. */
function tokensFor(core: Core, s: Settings) {
  const overrides: Record<string, any> = {
    radius: `${s.radius}px`,
    density: s.density,
    typography: { family: FONTS[s.font] },
  };
  if (s.accent === 'custom' && hexToRgb(s.custom)) {
    const onPrimary = (contrast(s.custom, '#ffffff') ?? 0) >= (contrast(s.custom, '#111827') ?? 0) ? '#ffffff' : '#111827';
    overrides.colors = {
      primary: s.custom,
      primaryHover: mix(s.custom, s.mode === 'dark' ? '#ffffff' : '#000000', 0.14),
      foregroundOnPrimary: onPrimary,
      focusRing: s.custom,
    };
  }
  const base = core.createThemeTokens({}, { mode: s.mode, accentPalette: s.accent === 'custom' ? undefined : s.accent });
  return core.createThemeTokens({ ...base, ...overrides, colors: { ...base.colors, ...(overrides.colors || {}) }, typography: { ...(base.typography || {}), ...overrides.typography } }, { mode: s.mode });
}

// --- the page ----------------------------------------------------------------------------------------

function Ratio({ label, a, b, large }: { label: string; a?: string; b?: string; large?: boolean }) {
  const value = a && b ? contrast(a, b) : null;
  if (value == null) return null;
  const needed = large ? 3 : 4.5;
  const pass = value >= needed;
  return (
    <li>
      {label}: <strong>{value.toFixed(2)}:1</strong>{' '}
      <span style={{ color: pass ? 'var(--ifm-color-success-darker)' : 'var(--ifm-color-danger)' }}>
        {pass ? `passes AA (${needed}:1)` : `below AA (${needed}:1)`}
      </span>
    </li>
  );
}

export default function ThemeBuilder(): JSX.Element {
  const [core, setCore] = React.useState<Core | null>(null);
  const [ui, setUi] = React.useState<any>(null);
  const [s, setS] = React.useState<Settings>(DEFAULTS);
  const [copied, setCopied] = React.useState('');

  React.useEffect(() => {
    let live = true;
    Promise.all([import('@editora/ui-core'), import('@editora/ui-react')]).then(([c, r]) => {
      if (!live) return;
      setCore({ createThemeTokens: (c as any).createThemeTokens, themeToCss: (c as any).themeToCss });
      setUi(r);
    });
    return () => {
      live = false;
    };
  }, []);

  const tokens = React.useMemo(() => (core ? tokensFor(core, s) : null), [core, s]);
  const css = React.useMemo(() => (core && tokens ? core.themeToCss(tokens, '.tb-preview') : ''), [core, tokens]);
  const appCss = React.useMemo(() => (core && tokens ? core.themeToCss(tokens, ':root') : ''), [core, tokens]);
  const jsx = React.useMemo(() => {
    const parts: string[] = [];
    if (s.accent === 'custom' && tokens) {
      const c = tokens.colors;
      parts.push(`  colors: { primary: '${c.primary}', primaryHover: '${c.primaryHover}', foregroundOnPrimary: '${c.foregroundOnPrimary}', focusRing: '${c.focusRing}' },`);
    }
    parts.push(`  radius: '${s.radius}px',`);
    if (s.density !== 'default') parts.push(`  density: '${s.density}',`);
    if (s.font !== 'System') parts.push(`  typography: { family: '${FONTS[s.font].replace(/'/g, "\\'")}' },`);
    const palette = s.accent === 'custom' ? '' : `accentPalette: '${s.accent}', `;
    return `import { ThemeProvider } from '@editora/ui-react';\nimport { createThemeTokens } from '@editora/ui-core';\n\nconst tokens = createThemeTokens({\n${parts.join('\n')}\n}, { ${palette}mode: '${s.mode}' });\n\n<ThemeProvider tokens={tokens}>{/* your app */}</ThemeProvider>`;
  }, [s, tokens]);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setS((prev) => ({ ...prev, [key]: value }));
  const copy = async (what: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      setCopied('');
    }
  };

  const field: React.CSSProperties = { display: 'grid', gap: 4 };
  const colors = tokens?.colors || {};

  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'start' }}>
      <form aria-label="Theme settings" onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: 14 }}>
        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'flex', gap: 12 }}>
          <legend style={{ fontWeight: 600, marginBottom: 6 }}>Mode</legend>
          {(['light', 'dark'] as Mode[]).map((mode) => (
            <label key={mode} style={{ display: 'flex', gap: 6, alignItems: 'center', minHeight: 28 }}>
              <input type="radio" name="tb-mode" checked={s.mode === mode} onChange={() => set('mode', mode)} /> {mode === 'light' ? 'Light' : 'Dark'}
            </label>
          ))}
        </fieldset>
        <div style={field}>
          <label htmlFor="tb-accent" style={{ fontWeight: 600 }}>Accent</label>
          <select id="tb-accent" value={s.accent} onChange={(e) => set('accent', e.target.value as Accent)} style={{ minHeight: 32 }}>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="amber">Amber</option>
            <option value="red">Red</option>
            <option value="gray">Gray</option>
            <option value="custom">Your brand colour</option>
          </select>
        </div>
        {s.accent === 'custom' ? (
          <div style={field}>
            <label htmlFor="tb-custom" style={{ fontWeight: 600 }}>Brand colour</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input id="tb-custom" type="color" value={hexToRgb(s.custom) ? s.custom : '#7c3aed'} onChange={(e) => set('custom', e.target.value)} style={{ width: 44, height: 32 }} />
              <input aria-label="Brand colour as hex" value={s.custom} onChange={(e) => set('custom', e.target.value)} style={{ minHeight: 32, width: 110, fontFamily: 'monospace' }} />
            </div>
          </div>
        ) : null}
        <div style={field}>
          <label htmlFor="tb-radius" style={{ fontWeight: 600 }}>Corner radius: {s.radius}px</label>
          <input id="tb-radius" type="range" min={0} max={20} step={1} value={s.radius} onChange={(e) => set('radius', Number(e.target.value))} />
        </div>
        <div style={field}>
          <label htmlFor="tb-density" style={{ fontWeight: 600 }}>Density</label>
          <select id="tb-density" value={s.density} onChange={(e) => set('density', e.target.value as Density)} style={{ minHeight: 32 }}>
            <option value="compact">Compact</option>
            <option value="default">Default</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </div>
        <div style={field}>
          <label htmlFor="tb-font" style={{ fontWeight: 600 }}>Font</label>
          <select id="tb-font" value={s.font} onChange={(e) => set('font', e.target.value)} style={{ minHeight: 32 }}>
            {Object.keys(FONTS).map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <button type="button" onClick={() => setS(DEFAULTS)} style={{ minHeight: 32, justifySelf: 'start' }}>Reset</button>
        {tokens ? (
          <div>
            <strong>Contrast</strong>
            <ul style={{ margin: '6px 0 0', paddingInlineStart: 18 }}>
              <Ratio label="Text on background" a={colors.text} b={colors.background} />
              <Ratio label="Muted text on surface" a={colors.muted} b={colors.surface} />
              <Ratio label="Button text on primary" a={colors.foregroundOnPrimary} b={colors.primary} />
            </ul>
          </div>
        ) : null}
      </form>

      <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
        <style>{css}</style>
        <section
          className="tb-preview"
          aria-label="Preview"
          style={{ background: colors.background, color: colors.text, fontFamily: FONTS[s.font], padding: 20, borderRadius: 12, border: '1px solid var(--ifm-color-emphasis-300)', display: 'grid', gap: 14, colorScheme: s.mode }}
        >
          {ui ? (
            <>
              <ui.Card>
                <ui.Card.Header>
                  <ui.Heading level={3} size="lg">Invite your team</ui.Heading>
                  <ui.Text variant="muted">Members can edit documents and comment.</ui.Text>
                </ui.Card.Header>
                <div style={{ display: 'grid', gap: 12 }}>
                  <ui.Input label="Email" placeholder="name@example.com" />
                  <ui.Checkbox>Send a welcome email</ui.Checkbox>
                  <ui.Switch label="Admin access" />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <ui.Button>Send invite</ui.Button>
                    <ui.Button variant="secondary">Copy link</ui.Button>
                    <ui.Button variant="ghost">Cancel</ui.Button>
                  </div>
                </div>
              </ui.Card>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <ui.Badge tone="brand">New</ui.Badge>
                <ui.Badge tone="success">Paid</ui.Badge>
                <ui.Badge tone="warning">Pending</ui.Badge>
                <ui.Badge tone="danger">Failed</ui.Badge>
              </div>
              <ui.Tabs>
                <ui.Tabs.Tab value="overview">Overview</ui.Tabs.Tab>
                <ui.Tabs.Tab value="activity">Activity</ui.Tabs.Tab>
                <ui.Tabs.Panel value="overview"><ui.Text>Tabs, inputs and buttons all read the same tokens.</ui.Text></ui.Tabs.Panel>
                <ui.Tabs.Panel value="activity"><ui.Text>Nothing yet.</ui.Text></ui.Tabs.Panel>
              </ui.Tabs>
            </>
          ) : (
            <p>Loading the components…</p>
          )}
        </section>

        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>React</strong>
            <button type="button" onClick={() => copy('react', jsx)} style={{ minHeight: 28 }}>{copied === 'react' ? 'Copied' : 'Copy'}</button>
          </div>
          <pre style={{ margin: 0, maxHeight: 220, overflow: 'auto' }} tabIndex={0} aria-label="React theme code"><code>{jsx}</code></pre>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>CSS (no React)</strong>
            <button type="button" onClick={() => copy('css', appCss)} style={{ minHeight: 28 }}>{copied === 'css' ? 'Copied' : 'Copy'}</button>
          </div>
          <pre style={{ margin: 0, maxHeight: 220, overflow: 'auto' }} tabIndex={0} aria-label="Theme CSS"><code>{appCss || 'Loading…'}</code></pre>
        </div>
      </div>
    </div>
  );
}
