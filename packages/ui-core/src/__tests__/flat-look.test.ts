import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-alert';
import '../components/ui-slider';
import '../components/ui-progress';
import '../components/ui-avatar';
import '../components/ui-breadcrumb';
import '../components/ui-pagination';
import '../components/ui-calendar';
import '../components/ui-toggle';
import '../components/ui-toggle-group';
import '../components/ui-stepper';
import '../components/ui-pin-input';
import '../components/ui-empty-state';
import '../components/ui-collapsible';
import '../components/ui-file-upload';
import '../components/ui-meter';
import '../components/ui-skeleton';
import '../components/ui-toolbar';
import '../components/ui-hover-card';
import '../components/ui-drawer';

function css(tag: string): string {
  const el = document.createElement(tag);
  document.body.append(el);
  return (el.shadowRoot?.querySelector('style') as HTMLStyleElement | null)?.textContent || '';
}

const FLAT = [
  'ui-alert',
  'ui-slider',
  'ui-progress',
  'ui-avatar',
  'ui-breadcrumb',
  'ui-pagination',
  'ui-calendar',
  'ui-toggle',
  'ui-toggle-group',
  'ui-stepper',
  'ui-pin-input',
  'ui-empty-state',
  'ui-collapsible',
  'ui-file-upload',
  'ui-meter',
  'ui-skeleton',
  'ui-toolbar',
  'ui-hover-card',
  'ui-drawer'
];

describe('flat look (step 5)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it.each(FLAT)('%s has no glow shadow and no card-lifting hover in its defaults', (tag) => {
    const style = css(tag);
    // the old heavy shadows were "0 12px 24px" / "0 18px 36px" style multi-layer glows
    expect(style, tag).not.toMatch(/box-shadow:[^;]*0 (1[0-9]|2[0-9]|3[0-9]) ?px (2[0-9]|3[0-9]|4[0-9]|5[0-9]) ?px/);
    expect(style, tag).not.toMatch(/transform: translateY\(-[12]px\)/);
  });

  it('alert: a tone-coloured hairline and no leading bar unless indicator="line"', () => {
    const style = css('ui-alert');
    expect(style).toContain('color-mix(in srgb, var(--ui-alert-accent) 28%, transparent)');
    expect(style).toContain(':host(:not([indicator="line"])) .alert::before');
    expect(style).not.toContain('linear-gradient(180deg, var(--ui-alert-accent)');
  });

  it('slider: no box around the control and no pulsing end indicator', () => {
    const style = css('ui-slider');
    expect(style).toMatch(/\.shell \{[^}]*border: 0;/);
    expect(style).toMatch(/\.track-indicator \{\s*display: none;/);
  });

  it('calendar: a day is not a bordered tile, the selected day is a solid accent', () => {
    const style = css('ui-calendar');
    expect(style).toMatch(/\.day \{\s*border: 1px solid transparent;/);
    expect(style).toContain('--ui-calendar-selected-bg: var(--ui-calendar-accent);');
  });

  it('pagination: controls follow the control scale, with no bar around them', () => {
    const style = css('ui-pagination');
    expect(style).toContain('--ui-pagination-h: var(--ui-control-height-2, 32px);');
    expect(style).toMatch(/\.pagination \{[^}]*border: 0;/);
  });

  it('toggle: no default dot glyph, a soft accent when pressed', () => {
    document.body.innerHTML = '<ui-toggle>Bold</ui-toggle>';
    const toggle = document.querySelector('ui-toggle') as HTMLElement;
    const glyphs = Array.from(toggle.shadowRoot!.querySelectorAll('.icon')).map((el) => el.textContent);
    expect(glyphs).toEqual(['', '']);
    expect(css('ui-toggle')).toContain('--ui-toggle-pressed-bg');
  });

  it('toggle with icon attributes still draws them', () => {
    document.body.innerHTML = '<ui-toggle icon-on="B" icon-off="b">Bold</ui-toggle>';
    const toggle = document.querySelector('ui-toggle') as HTMLElement;
    const glyphs = Array.from(toggle.shadowRoot!.querySelectorAll('.icon')).map((el) => el.textContent);
    expect(glyphs).toEqual(['b', 'B']);
  });

  it('call-to-action buttons use the primary fill and its text colour, not a tint of the accent', () => {
    expect(css('ui-empty-state')).toContain('--ui-empty-action-color: var(--ui-color-foreground-on-primary, #ffffff);');
    expect(css('ui-file-upload')).toMatch(/\.cta \{[^}]*color: var\(--ui-color-foreground-on-primary, #ffffff\);/s);
  });

  it('pin input slots are one control tall, with a placeholder that reads', () => {
    const style = css('ui-pin-input');
    expect(style).toContain('--ui-pin-slot-height: var(--ui-control-height-3, 40px);');
    expect(style).toContain('var(--ui-color-placeholder');
  });
});

describe('flat look across every component', () => {
  const dir = resolve(__dirname, '../components');
  const files = readdirSync(dir).filter((f) => /^ui-.*\.ts$/.test(f) && !f.endsWith('.d.ts'));

  it('no component draws a blurred 3-4px focus or state glow (a 2px ring instead)', () => {
    // color-picker: the thumb keeps a two-layer contrast ring; timeline: the dot halo is a decoration
    const allowed = new Set(['ui-color-picker.ts', 'ui-timeline.ts']);
    const offenders = files.filter((f) => !allowed.has(f) && /0 0 0 [34]px color-mix\(/.test(readFileSync(resolve(dir, f), 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('only the button animation attribute, the gantt and the navigation chevron still move on hover', () => {
    const allowed = new Set(['ui-button.ts', 'ui-gantt.ts', 'ui-navigation-menu.ts']);
    const offenders = files.filter((f) => !allowed.has(f) && /transform: translateY\(-[12]px\)/.test(readFileSync(resolve(dir, f), 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('the built-in themes do not pin the look of the components that own it', () => {
    const theme = readFileSync(resolve(__dirname, '../theme.ts'), 'utf8');
    for (const name of ['sidebar', 'navigationMenu', 'appHeader', 'alert', 'avatar', 'badge', 'card']) {
      const block = theme.match(new RegExp(`\\n  ${name}: \\{[\\s\\S]*?\\n  \\}`))?.[0] || '';
      expect(block, name).not.toMatch(/\n {4}(border|shadow): (?!'none')/);
    }
  });

  it('the decorative and layout components default to no shadow and a theme-radius frame', () => {
    const prefixes: Record<string, string> = {
      'ui-marquee.ts': 'marquee',
      'ui-animated-list.ts': 'animated-list',
      'ui-spinning-text.ts': 'spinning-text',
      'ui-icon-cloud.ts': 'icon-cloud',
      'ui-orbiter.ts': 'orbiter',
      'ui-container.ts': 'container',
      'ui-section.ts': 'section',
      'ui-layout.ts': 'layout'
    };
    for (const [file, prefix] of Object.entries(prefixes)) {
      const source = readFileSync(resolve(dir, file), 'utf8');
      const first = source.match(new RegExp(`--ui-${prefix}-shadow:\\s*([^;]*);`))?.[1].trim();
      expect(first, file).toBe('none');
    }
    const aspect = readFileSync(resolve(dir, 'ui-aspect-ratio.ts'), 'utf8');
    expect(aspect).toMatch(/\.surface::before \{[^}]*background: none;/);
  });

  it('resize handles, radio options, beam nodes and the dock follow the flat look', () => {
    const read = (f: string) => readFileSync(resolve(dir, f), 'utf8');
    // splitter: a hairline across the gap plus a grip, both turn accent on hover/focus/drag
    const splitter = read('ui-splitter.ts');
    expect(splitter).toMatch(/\.splitter::before \{/);
    expect(splitter).toMatch(/:host\(:hover\) \.splitter::before/);
    // radio group: plain rows by default, the box only for the card and segmented variants
    const radio = read('ui-radio-group.ts');
    expect(radio).toMatch(/--ui-radio-border: transparent;/);
    expect(radio).toMatch(/:host\(\[variant="card"\]\) \.option \{\s*--ui-radio-bg:/);
    expect(radio).not.toMatch(/0 10px 24px/);
    // beam: nodes and hub carry no drop shadow by default
    const beam = read('ui-animated-beam.ts');
    expect(beam.match(/--ui-animated-beam-node-shadow:\s*([^;]*);/)?.[1].trim()).toBe('none');
    expect(beam.match(/--ui-animated-beam-hub-shadow:\s*([^;]*);/)?.[1].trim()).toBe('none');
    // controls that used to have no hover state
    expect(read('ui-pin-input.ts')).toMatch(/\.slot:hover/);
    expect(read('ui-file-upload.ts')).toMatch(/\.cta:hover/);
    expect(read('ui-color-picker.ts')).toMatch(/\.tab:hover/);
    expect(read('ui-color-picker.ts')).toMatch(/\.actions \.btn:hover/);
  });

  it('rating, inline edit, file upload, dock, command and colour picker follow the flat look', () => {
    const read = (f: string) => readFileSync(resolve(dir, f), 'utf8');
    // empty stars are a light neutral, never the dark muted text colour
    expect(read('ui-rating.ts')).toMatch(/--ui-rating-color-empty: var\(--ui-color-line-strong/);
    // inline edit: buttons and field use the control radius, no 10-12px pills
    const inline = read('ui-inline-edit.ts');
    expect(inline).not.toMatch(/border-radius: 1[02]px/);
    expect(inline).toMatch(/\.save-btn \{[^}]*--ui-color-primary/);
    // file upload: items use the shared radius, the remove button is a 24px control, drag is a 2px ring
    const upload = read('ui-file-upload.ts');
    expect(upload).not.toMatch(/border-radius: 1[24]px/);
    expect(upload).toMatch(/\.surface\[data-dragging="true"\] \{[^}]*outline: var\(--ui-ring-width, 2px\)/);
    // dock: tiles have no border until active, no blurred backdrop smear behind a magnified icon
    const dock = read('ui-dock.ts');
    expect(dock).toMatch(/--ui-dock-item-border: transparent;/);
    expect(dock).toMatch(/--ui-dock-item-backdrop: none;/);
    // command: slotted native buttons are reset, not drawn with the UA border
    expect(read('ui-command.ts')).toMatch(/::slotted\(\[slot="command"\]\) \{[^}]*border: 0;/);
    // colour picker: a solid primary action and no hover drop shadow on swatches
    const picker = read('ui-color-picker.ts');
    expect(picker).toMatch(/\.actions \.btn\[data-tone="primary"\] \{[^}]*--ui-color-primary/);
    expect(picker).not.toMatch(/\.swatch:hover \{[^}]*box-shadow/);
  });

  it('rating stars have no glow and an upload bar is accent while uploading, green only when done', () => {
    const rating = readFileSync(resolve(dir, 'ui-rating.ts'), 'utf8');
    expect(rating.match(/--ui-rating-shadow:\s*([^;]*);/)?.[1].trim()).toBe('none');
    expect(rating).not.toMatch(/\.star:hover::after/);
    const upload = readFileSync(resolve(dir, 'ui-file-upload.ts'), 'utf8');
    expect(upload).toMatch(/\.progress-bar \{[^}]*background: var\(--ui-color-primary/);
    expect(upload).toMatch(/\.progress-bar\[data-state="success"\]/);
    expect(upload).toMatch(/bar\.dataset\.state = uploadEntry\.state/);
  });

  it('QA regressions: solid alert, contrast toggle and wizard, chart tone text, selected-day events, scroll region', () => {
    const read = (f: string) => readFileSync(resolve(dir, f), 'utf8');
    // a solid alert is declared after the tone rules, otherwise the tinted tone fill wins
    const alert = read('ui-alert.ts');
    expect(alert.lastIndexOf(':host([variant="solid"]) .alert {')).toBeGreaterThan(alert.indexOf(':host([tone="danger"]) .alert {'));
    // toggle: tones tint the pressed state, the contrast variant uses a solid light fill under dark text
    const toggle = read('ui-toggle.ts');
    expect(toggle).toMatch(/:host\(\[variant="contrast"\]\) \{\s*--ui-toggle-pressed-bg: var\(--ui-toggle-active-bg\);/);
    expect(toggle).toMatch(/:host\(\[tone="danger"\]\) \{\s*--ui-toggle-pressed-bg: color-mix|:host\(\[tone="danger"\]\) \{\s*--ui-toggle-pressed-bg/);
    // wizard: dark text on the light contrast accent
    expect(read('ui-wizard.ts')).toMatch(/:host\(\[variant="contrast"\]\) \.btn\.primary \{\s*color: #0f172a;/);
    // chart: tone text mixes toward the chart's own text colour, never a global dark text token
    expect(read('ui-chart.ts')).not.toMatch(/ui-color-text-strong/);
    // calendar: events on a selected day follow the day's text colour
    expect(read('ui-calendar.ts')).toMatch(/\.day-cell\[data-selected="true"\] \.event-badge/);
    // data table: a scrolling frame with nothing focusable becomes a named, focusable region
    const table = read('ui-data-table.ts');
    expect(table).toMatch(/_syncScrollRegion\(\)/);
    expect(table).toMatch(/data-scroll-region/);
    // sortable helper text is not dimmed below 4.5:1
    expect(read('ui-sortable.ts')).not.toMatch(/\.list-helper \{[^}]*opacity/);
  });
});

