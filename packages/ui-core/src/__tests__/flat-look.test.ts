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
