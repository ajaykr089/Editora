import type { Report } from './report';

/** An inline style as ordered property -> value pairs. */
export type Style = Map<string, string>;

/** Parse `a: b; c: d`, keeping semicolons inside quotes and parentheses (urls, font names). */
export function parseStyle(source = ''): Style {
  const style: Style = new Map();
  let depth = 0;
  let quote = '';
  let start = 0;
  const flush = (end: number) => {
    const part = source.slice(start, end);
    const colon = part.indexOf(':');
    if (colon > 0) {
      const name = part.slice(0, colon).trim().toLowerCase();
      const value = part.slice(colon + 1).trim();
      if (name && value) style.set(name, value);
    }
    start = end + 1;
  };
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (char === quote) quote = '';
    } else if (char === '"' || char === "'") quote = char;
    else if (char === '(') depth += 1;
    else if (char === ')') depth = Math.max(0, depth - 1);
    else if (char === ';' && depth === 0) flush(index);
  }
  flush(source.length);
  return style;
}

export function serializeStyle(style: Style): string {
  return Array.from(style, ([name, value]) => `${name}:${value}`).join(';');
}

/** Later styles win, like the cascade with the most specific last. */
export function mergeStyles(...styles: Array<Style | string | undefined>): Style {
  const out: Style = new Map();
  for (const style of styles) {
    if (!style) continue;
    for (const [name, value] of typeof style === 'string' ? parseStyle(style) : style) {
      out.delete(name); // Re-insert so the order follows the winning declaration.
      out.set(name, value);
    }
  }
  return out;
}

// Properties email clients ignore or mangle, and what to tell the author.
const DROP: Record<string, string> = {
  position: 'Positioning is not supported by Gmail or Outlook',
  'z-index': 'Positioning is not supported by Gmail or Outlook',
  top: 'Positioning is not supported by Gmail or Outlook',
  left: 'Positioning is not supported by Gmail or Outlook',
  right: 'Positioning is not supported by Gmail or Outlook',
  bottom: 'Positioning is not supported by Gmail or Outlook',
  transform: 'CSS transforms are not supported by Gmail or Outlook',
  transition: 'CSS transitions do nothing in email',
  animation: 'CSS animations are not supported by Gmail or Outlook',
  'box-shadow': 'Box shadows are not supported by Outlook or Gmail on Android',
  filter: 'CSS filters are not supported by Gmail or Outlook',
  'backdrop-filter': 'CSS filters are not supported by Gmail or Outlook',
  'clip-path': 'clip-path is not supported by Gmail or Outlook',
  cursor: 'cursor does nothing in email',
  'pointer-events': 'pointer-events does nothing in email',
  'user-select': 'user-select does nothing in email',
  'grid-template-columns': 'CSS grid is not supported by Gmail or Outlook; use tables for columns',
  'grid-template-rows': 'CSS grid is not supported by Gmail or Outlook; use tables for columns',
  gap: 'flex and grid gaps are not supported by Gmail or Outlook',
  'flex-direction': 'Flexbox is not supported by Outlook or Gmail; use tables for columns',
  'justify-content': 'Flexbox is not supported by Outlook or Gmail; use tables for columns',
  'align-items': 'Flexbox is not supported by Outlook or Gmail; use tables for columns',
  'flex-wrap': 'Flexbox is not supported by Outlook or Gmail; use tables for columns',
  flex: 'Flexbox is not supported by Outlook or Gmail; use tables for columns',
};

const ROOT_PX = 16;

/** Make a style email-safe: drop what clients ignore, resolve rem and CSS variables, report the rest. */
export function cleanStyle(style: Style, report: Report): Style {
  const out: Style = new Map();
  for (const [name, raw] of style) {
    let value = raw;
    if (name.startsWith('--')) continue;
    if (DROP[name]) {
      report.warn(`${DROP[name]}; "${name}" was removed`);
      continue;
    }
    if (name === 'display' && /\b(flex|grid|inline-flex|inline-grid)\b/.test(value)) {
      report.warn('Flexbox and grid layouts are not supported by Outlook or Gmail; use tables for columns ("display" was removed)');
      continue;
    }
    if (/var\(/.test(value)) {
      // var(--x, fallback): keep the fallback; without one the declaration cannot work.
      const fallback = value.replace(/var\(\s*--[\w-]+\s*,\s*([^()]*(?:\([^()]*\))?[^()]*)\)/g, '$1');
      if (/var\(/.test(fallback)) {
        report.warn(`CSS variables are not supported by Gmail or Outlook; "${name}" was removed`);
        continue;
      }
      value = fallback.trim();
    }
    if (/calc\(/.test(value)) report.warn(`calc() is not supported by Outlook ("${name}: ${value}")`);
    if (name === 'background-image' || (name === 'background' && /url\(/.test(value))) {
      report.warn('Background images do not show in Outlook for Windows; set a background colour as well');
    }
    if (name === 'float') report.warn('Outlook for Windows ignores float; use align or a table for side-by-side content');
    // Outlook does not understand rem.
    value = value.replace(/(-?\d*\.?\d+)rem\b/g, (_, number: string) => `${round(Number(number) * ROOT_PX)}px`);
    out.set(name, value);
  }
  return out;
}

const round = (value: number) => Math.round(value * 100) / 100;

/** A CSS length in px, when it is one. */
export function px(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.trim().match(/^(\d*\.?\d+)(px)?$/);
  return match ? Number(match[1]) : undefined;
}
