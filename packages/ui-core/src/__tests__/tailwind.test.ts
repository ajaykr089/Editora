import { describe, expect, it } from 'vitest';
import { editoraPreset, editoraTailwindPlugin, TAILWIND_COLOR_TOKENS, TAILWIND_STATE_VARIANTS, TAILWIND_V4_CSS } from '../tailwind';

describe('Tailwind support', () => {
  it('maps every colour to an Editora token with a fallback', () => {
    for (const [name, value] of Object.entries(TAILWIND_COLOR_TOKENS)) {
      expect(value, name).toMatch(/^var\(--ui-(color|chart)-[a-z0-9-]+, .+\)$/);
    }
    expect(editoraPreset.theme.extend.colors.ui.primary).toBe(TAILWIND_COLOR_TOKENS.primary);
  });

  it('registers the state variants and a part variant', () => {
    const added: Record<string, string | string[]> = {};
    const matched: Record<string, (value: string) => string> = {};
    editoraTailwindPlugin({
      addVariant: (name, definition) => { added[name] = definition; },
      matchVariant: (name, fn) => { matched[name] = fn; },
    });
    expect(added).toEqual(TAILWIND_STATE_VARIANTS);
    expect(matched.part('button')).toBe('&::part(button)');
    // A part name cannot break out of the selector.
    expect(matched.part('a){}*{color:red')).toBe('&::part(acolorred)');
  });

  it('works on Tailwind versions without matchVariant', () => {
    const names: string[] = [];
    editoraTailwindPlugin({ addVariant: (name) => names.push(name) });
    expect(names.length).toBe(Object.keys(TAILWIND_STATE_VARIANTS).length);
  });

  it('emits the same mapping for Tailwind v4', () => {
    expect(TAILWIND_V4_CSS).toContain('@theme inline {');
    for (const name of Object.keys(TAILWIND_COLOR_TOKENS)) expect(TAILWIND_V4_CSS).toContain(`--color-ui-${name}: `);
    for (const name of Object.keys(TAILWIND_STATE_VARIANTS)) expect(TAILWIND_V4_CSS).toContain(`@custom-variant ${name} (`);
    expect(TAILWIND_V4_CSS).toContain('--radius-ui: ');
  });
});
