import { describe, expect, it } from 'vitest';
import { getIcon, iconToDataUri, listIcons, normalizeIconSize, renderIconSvg, resolveIcon } from '../src/index';

const parse = (svg: string) => new DOMParser().parseFromString(svg, 'image/svg+xml');
const isWellFormed = (svg: string) => !parse(svg).querySelector('parsererror');
const attr = (svg: string, name: string) => parse(svg).documentElement.getAttribute(name);

describe('registry', () => {
  it('renders every icon, in every variant, as well-formed SVG with content', () => {
    for (const name of listIcons()) {
      for (const variant of ['outline', 'solid', 'duotone'] as const) {
        const svg = renderIconSvg(name, { variant });
        expect(svg, `${name}:${variant}`).not.toBe('');
        expect(isWellFormed(svg), `${name}:${variant} is well-formed`).toBe(true);
        expect(svg).not.toMatch(/NaN|undefined|\[object/);
        expect(parse(svg).querySelector('path,circle,ellipse,line,polyline,polygon,rect'), name).not.toBeNull();
      }
    }
  });

  it('resolves aliases and normalises names', () => {
    expect(getIcon('Check_Circle')).toBe(getIcon('check-circle'));
    expect(renderIconSvg('  CHECK  ')).toContain('<svg');
  });

  it('falls back to the outline glyph when a variant is not defined (documented behaviour)', () => {
    const resolved = resolveIcon('check', 'duotone');
    expect(resolved?.variant).toBe(getIcon('check')?.variants.duotone ? 'duotone' : 'outline');
  });

  it('returns an empty string for an unknown icon', () => {
    expect(renderIconSvg('definitely-not-an-icon')).toBe('');
    expect(iconToDataUri('definitely-not-an-icon')).toBe('');
  });
});

describe('heading icons', () => {
  const geometry = (name: string) => (getIcon(name)!.variants.outline.nodes[0].children || []).map((n) => ({ tag: n.tag, ...n.attrs }) as Record<string, unknown>);

  for (const name of ['heading-1', 'heading-2', 'heading-3']) {
    it(`${name} starts with an "H" (two verticals joined by a crossbar), not a stray "1"`, () => {
      const nodes = geometry(name);
      const lines = nodes.filter((n) => n.tag === 'line');
      const verticals = lines.filter((l) => l.x1 === l.x2);
      const crossbars = lines.filter((l) => l.y1 === l.y2);
      const leftX = Math.min(...verticals.map((v) => v.x1 as number));
      expect(verticals.filter((v) => (v.x1 as number) < 8).length).toBeGreaterThanOrEqual(2);
      expect(crossbars.some((c) => (c.x1 as number) === leftX && (c.x2 as number) < 8)).toBe(true);
    });
  }

  it('keeps each digit to the right of the H', () => {
    const maxHX = 6.5;
    const digitPaths = geometry('heading-2').filter((n) => n.tag === 'path');
    expect(digitPaths.length).toBe(1);
    const firstX = Number(String(digitPaths[0].d).match(/^M\s*([\d.]+)/)?.[1]);
    expect(firstX).toBeGreaterThan(maxHX);
  });
});

describe('size handling', () => {
  it('accepts positive numbers and CSS lengths', () => {
    expect(normalizeIconSize(24)).toBe('24');
    expect(normalizeIconSize('24px')).toBe('24px');
    expect(normalizeIconSize(' 1.5rem ')).toBe('1.5rem');
    expect(normalizeIconSize('100%')).toBe('100%');
    expect(normalizeIconSize('.5em')).toBe('.5em');
  });

  it('falls back to the default for values that would leave the <svg> at 300x150', () => {
    for (const bad of [0, -5, NaN, Infinity, '', '  ', 'abc', '-3px', '12 px', '1e3', '24px;color:red', 'abc" x="', null, undefined, {}]) {
      expect(normalizeIconSize(bad), JSON.stringify(bad)).toBe('15');
    }
  });

  it('applies the normalised size to width and height', () => {
    const svg = renderIconSvg('check', { size: -5 });
    expect(attr(svg, 'width')).toBe('15');
    expect(attr(svg, 'height')).toBe('15');
    expect(attr(renderIconSvg('check', { size: '2rem' }), 'width')).toBe('2rem');
  });
});

describe('stroke width', () => {
  const strokeOf = (opts: Parameters<typeof renderIconSvg>[1]) => parse(renderIconSvg('check', opts)).querySelector('[stroke-width]')?.getAttribute('stroke-width');

  it('uses the weight, an explicit width, and ignores invalid widths', () => {
    expect(strokeOf({})).toBe('1.5');
    expect(strokeOf({ iconWeight: 'bold' })).toBe('1.75');
    expect(strokeOf({ strokeWidth: 2 })).toBe('2');
    expect(strokeOf({ strokeWidth: 0 })).toBe('0');
    expect(strokeOf({ strokeWidth: -1 })).toBe('1.5');
    expect(strokeOf({ strokeWidth: NaN })).toBe('1.5');
    expect(strokeOf({ strokeWidth: Infinity, iconWeight: 'thin' })).toBe('1.25');
  });

  it('absoluteStrokeWidth keeps the on-screen width constant for numeric and px sizes only', () => {
    expect(strokeOf({ absoluteStrokeWidth: true, size: 12, strokeWidth: 1.5 })).toBe('3');
    expect(strokeOf({ absoluteStrokeWidth: true, size: '12px', strokeWidth: 1.5 })).toBe('3');
    expect(strokeOf({ absoluteStrokeWidth: true, size: '2rem', strokeWidth: 1.5 })).toBe('1.5');
  });
});

describe('markup safety', () => {
  it('drops attribute names that could inject markup or handlers', () => {
    const svg = renderIconSvg('check', {
      attrs: {
        'x" onload="window.__p=1" y': '1',
        onclick: 'alert(1)',
        OnMouseOver: 'alert(1)',
        '1bad': 'x',
        'data-ok': 'fine',
        'aria-label': 'ok',
      },
    });
    expect(isWellFormed(svg)).toBe(true);
    const root = parse(svg).documentElement;
    expect(root.getAttribute('data-ok')).toBe('fine');
    expect(root.getAttribute('aria-label')).toBe('ok');
    expect([...root.attributes].some((a) => /^on/i.test(a.name))).toBe(false);
    expect(svg).not.toMatch(/onload|onclick|onmouseover/i);
  });

  it('escapes title, class, style and aria-label values', () => {
    const svg = renderIconSvg('check', { title: '</title><script>1</script>', className: 'a" onmouseover="1', ariaLabel: '"><b>' });
    expect(isWellFormed(svg)).toBe(true);
    expect(svg).not.toMatch(/<script|<b>/);
  });
});

describe('accessibility and transforms', () => {
  it('is decorative by default and labelled when given a title or aria-label', () => {
    expect(attr(renderIconSvg('check'), 'aria-hidden')).toBe('true');
    const labelled = renderIconSvg('check', { title: 'Done' });
    expect(attr(labelled, 'role')).toBe('img');
    expect(attr(labelled, 'aria-label')).toBe('Done');
    const forced = renderIconSvg('check', { ariaLabel: 'Saved', decorative: true });
    expect(attr(forced, 'aria-hidden')).toBe('true');
    expect(attr(forced, 'aria-label')).toBeNull();
  });

  it('mirrors only rtl-aware icons and applies rotate and flip', () => {
    // Some icons are wrapped in a scale(1.6) group by their definition, so look for the specific transform.
    const transforms = (opts: Parameters<typeof renderIconSvg>[1], name = 'arrow-right') =>
      [...parse(renderIconSvg(name, opts)).querySelectorAll('g[transform]')].map((g) => g.getAttribute('transform') as string);
    expect(transforms({ rtl: true })).toContain('translate(24 0) scale(-1 1)');
    expect(transforms({ rtl: true }, 'check').some((t) => t.includes('scale(-1'))).toBe(false);
    expect(transforms({ rotate: 90 })).toContain('rotate(90 12 12)');
    expect(transforms({ flip: 'vertical' })).toContain('translate(0 24) scale(1 -1)');
    expect(transforms({ flip: 'horizontal' })).toContain('translate(24 0) scale(-1 1)');
  });

  it('data URIs carry the requested colour', () => {
    expect(decodeURIComponent(iconToDataUri('check', { color: '#e00' }))).toContain('#e00');
  });
});
