import { beforeEach, describe, expect, it } from 'vitest';
import { baselineDarkTokens, baselineLightTokens } from '../theme';
import '../components/ui-button';
import '../components/ui-input';
import '../components/ui-password-field';
import '../components/ui-number-field';
import '../components/ui-select';
import '../components/ui-combobox';
import '../components/ui-multi-select';
import '../components/ui-tags-input';
import '../components/ui-toggle';
import '../components/ui-textarea';
import '../components/ui-date-picker';
import '../components/ui-time-picker';
import '../components/ui-date-time-picker';
import '../components/ui-date-range-picker';
import '../components/ui-date-range-time-picker';

function styleText(tag: string): string {
  const el = document.createElement(tag);
  document.body.append(el);
  return (el.shadowRoot?.querySelector('style') as HTMLStyleElement | null)?.textContent || '';
}

// Controls that come in three sizes (24 / 32 / 40px).
const SIZED = [
  'ui-button',
  'ui-input',
  'ui-password-field',
  'ui-number-field',
  'ui-select',
  'ui-combobox',
  'ui-multi-select',
  'ui-tags-input',
  'ui-toggle',
  'ui-textarea'
];
// Controls whose field height follows the scale but that have no size attribute of their own.
const MEDIUM_ONLY = ['ui-time-picker', 'ui-date-range-picker'];
const PICKERS = ['ui-date-picker', 'ui-date-time-picker', 'ui-date-range-time-picker'];

describe('control scale', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it.each(SIZED)('%s reads its size, font and radius from the control scale', (tag) => {
    const css = styleText(tag);
    expect(css, tag).toContain('--ui-control-font-size-1');
    expect(css, tag).toContain('--ui-control-font-size-2');
    expect(css, tag).toContain('--ui-control-font-size-3');
    expect(css, tag).toContain('--ui-control-radius-2');
    if (tag !== 'ui-textarea') {
      // A textarea is as tall as its rows, not as one control.
      expect(css, tag).toContain('--ui-control-height-1');
      expect(css, tag).toContain('--ui-control-height-2');
      expect(css, tag).toContain('--ui-control-height-3');
    }
  });

  it.each([...PICKERS, ...MEDIUM_ONLY])('%s field height follows the scale', (tag) => {
    expect(styleText(tag)).toContain('--ui-control-height-2');
  });

  it.each([...SIZED, ...PICKERS, ...MEDIUM_ONLY])('%s has no legacy 34-48px control height left', (tag) => {
    const css = styleText(tag);
    // (Menu item heights belong to the overlay panels, not to the control itself.)
    expect(css, tag).not.toMatch(/--ui-(?![a-z-]*item)[a-z-]*(min-height|height|hit):\s*(3[4-9]|4[0-8])px/);
    expect(css, tag).not.toMatch(/--base-(button|input|select|multi-select)-height-(sm|md|lg),\s*\d+px/);
  });

  it('the baseline themes no longer pin their own control heights', () => {
    for (const tokens of [baselineLightTokens, baselineDarkTokens]) {
      for (const name of ['button', 'input', 'select', 'multiSelect'] as const) {
        const group = tokens.components?.[name] || {};
        expect(Object.keys(group).filter((k) => /^height-(sm|md|lg)$/.test(k)), name).toEqual([]);
      }
    }
  });
});
