/** Colour parsing and WCAG contrast. Handles hex, rgb(a), hsl(a) and the common named colours. */

export type RGBA = [number, number, number, number];

const NAMED: Record<string, string> = {
  black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff', yellow: '#ffff00',
  orange: '#ffa500', purple: '#800080', gray: '#808080', grey: '#808080', silver: '#c0c0c0', maroon: '#800000',
  navy: '#000080', teal: '#008080', olive: '#808000', lime: '#00ff00', aqua: '#00ffff', cyan: '#00ffff',
  fuchsia: '#ff00ff', magenta: '#ff00ff', pink: '#ffc0cb', brown: '#a52a2a', gold: '#ffd700', lightgray: '#d3d3d3',
  lightgrey: '#d3d3d3', darkgray: '#a9a9a9', darkgrey: '#a9a9a9', lightblue: '#add8e6', lightgreen: '#90ee90',
  lightyellow: '#ffffe0', whitesmoke: '#f5f5f5', gainsboro: '#dcdcdc', beige: '#f5f5dc', khaki: '#f0e68c',
  coral: '#ff7f50', salmon: '#fa8072', tomato: '#ff6347', crimson: '#dc143c', indigo: '#4b0082', violet: '#ee82ee',
};

export function parseColor(value: string | null | undefined): RGBA | null {
  if (!value) return null;
  const color = value.trim().toLowerCase();
  if (color === 'transparent') return [0, 0, 0, 0];
  const named = NAMED[color];
  if (named) return parseColor(named);

  let match = color.match(/^#([0-9a-f]{3,8})$/);
  if (match) {
    let hex = match[1];
    if (hex.length === 3 || hex.length === 4) hex = hex.split('').map((digit) => digit + digit).join('');
    if (hex.length !== 6 && hex.length !== 8) return null;
    const channel = (index: number) => parseInt(hex.slice(index, index + 2), 16);
    return [channel(0), channel(2), channel(4), hex.length === 8 ? channel(6) / 255 : 1];
  }

  match = color.match(/^rgba?\(([^)]+)\)$/);
  if (match) {
    const parts = match[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const channel = (part: string) => (part.endsWith('%') ? (parseFloat(part) * 255) / 100 : parseFloat(part));
    const alpha = parts[3] === undefined ? 1 : parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
    return [channel(parts[0]), channel(parts[1]), channel(parts[2]), alpha];
  }

  match = color.match(/^hsla?\(([^)]+)\)$/);
  if (match) {
    const parts = match[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const [r, g, b] = hslToRgb(parseFloat(parts[0]), parseFloat(parts[1]) / 100, parseFloat(parts[2]) / 100);
    const alpha = parts[3] === undefined ? 1 : parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
    return [r, g, b, alpha];
  }
  return null;
}

export function hslToRgb(hue: number, saturation: number, lightness: number): [number, number, number] {
  const h = (((hue % 360) + 360) % 360) / 360;
  if (saturation === 0) return [lightness * 255, lightness * 255, lightness * 255];
  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const channel = (t: number) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [channel(h + 1 / 3) * 255, channel(h) * 255, channel(h - 1 / 3) * 255];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const lightness = (max + min) / 2;
  if (max === min) return [0, 0, lightness];
  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = max === rr ? (gg - bb) / delta + (gg < bb ? 6 : 0) : max === gg ? (bb - rr) / delta + 2 : (rr - gg) / delta + 4;
  hue *= 60;
  return [hue, saturation, lightness];
}

/** `top` drawn over an opaque `bottom`. */
export function blend(top: RGBA, bottom: RGBA): RGBA {
  const alpha = top[3];
  return [0, 1, 2].map((index) => top[index] * alpha + bottom[index] * (1 - alpha)).concat(1) as RGBA;
}

export function luminance([r, g, b]: RGBA): number {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

export function contrastRatio(foreground: RGBA, background: RGBA): number {
  const opaqueBackground = background[3] < 1 ? blend(background, [255, 255, 255, 1]) : background;
  const opaqueForeground = foreground[3] < 1 ? blend(foreground, opaqueBackground) : foreground;
  const [light, dark] = [luminance(opaqueForeground), luminance(opaqueBackground)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

export function toHex([r, g, b]: RGBA): string {
  return `#${[r, g, b].map((channel) => Math.round(Math.max(0, Math.min(255, channel))).toString(16).padStart(2, '0')).join('')}`;
}

/** The closest colour to `foreground` (same hue, adjusted lightness) that reaches `target` against `background`. */
export function nearestPassingColor(foreground: RGBA, background: RGBA, target: number): string | null {
  const [hue, saturation, lightness] = rgbToHsl(foreground[0], foreground[1], foreground[2]);
  const towardsDark = luminance(background) > 0.18;
  for (let step = 1; step <= 100; step += 1) {
    const next = towardsDark ? lightness - step / 100 : lightness + step / 100;
    if (next < 0 || next > 1) break;
    const [r, g, b] = hslToRgb(hue, saturation, next);
    if (contrastRatio([r, g, b, 1], background) >= target) return toHex([r, g, b, 1]);
  }
  return null;
}
