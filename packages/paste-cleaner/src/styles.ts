/**
 * Clipboard HTML from Word, Excel and Apple apps keeps much of its formatting
 * in a <style> block (`.xl65 {font-weight:700}`, `p.p1 {font: 24px Times}`)
 * and Word declares its list types there (`@list l0:level1
 * {mso-level-number-format:bullet}`). This reads just enough CSS to recover
 * that: tag, class and tag.class selectors, and Word's @list rules.
 */

export type Declarations = Map<string, string>;

export interface StyleSheetInfo {
  tagRules: Map<string, Declarations>;
  classRules: Map<string, Declarations>;
  tagClassRules: Map<string, Declarations>;
  /** `l0:level1` -> Word's mso-level-number-format (`bullet`, `decimal`, `alpha-lower`, ...). */
  wordListFormats: Map<string, string>;
}

export function parseDeclarations(text: string): Declarations {
  const declarations: Declarations = new Map();
  for (const part of text.split(';')) {
    const colon = part.indexOf(':');
    if (colon <= 0) continue;
    const property = part.slice(0, colon).trim().toLowerCase();
    const value = part.slice(colon + 1).trim().replace(/\s+/g, ' ');
    if (property && value) declarations.set(property, value);
  }
  expandFontShorthand(declarations);
  return declarations;
}

/** `font: italic bold 24px Times` -> font-style, font-weight, font-size, font-family. */
function expandFontShorthand(declarations: Declarations): void {
  const font = declarations.get('font');
  if (!font) return;
  const size = font.match(/(?:^|\s)(\d*\.?\d+(?:px|pt|em|rem|%))(?:\/\S+)?(?:\s|$)/);
  if (size && !declarations.has('font-size')) declarations.set('font-size', size[1]);
  if (/\b(bold|bolder|[6-9]00)\b/.test(font) && !declarations.has('font-weight')) declarations.set('font-weight', 'bold');
  if (/\b(italic|oblique)\b/.test(font) && !declarations.has('font-style')) declarations.set('font-style', 'italic');
  if (size) {
    const family = font.slice(font.indexOf(size[0]) + size[0].length).trim();
    if (family && !declarations.has('font-family')) declarations.set('font-family', family);
  }
}

export function parseStyleSheets(doc: Document): StyleSheetInfo {
  const info: StyleSheetInfo = {
    tagRules: new Map(),
    classRules: new Map(),
    tagClassRules: new Map(),
    wordListFormats: new Map(),
  };

  const css = Array.from(doc.querySelectorAll('style'))
    .map((style) => style.textContent ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--|-->/g, '');

  let index = 0;
  while (index < css.length) {
    const open = css.indexOf('{', index);
    if (open === -1) break;
    const selector = css.slice(index, open).trim();
    const close = matchingBrace(css, open);
    const body = css.slice(open + 1, close);
    index = close + 1;

    const listLevel = selector.match(/^@list\s+(l\d+):level(\d+)$/i);
    if (listLevel) {
      const format = parseDeclarations(body).get('mso-level-number-format') ?? 'decimal';
      info.wordListFormats.set(`${listLevel[1].toLowerCase()}:level${listLevel[2]}`, format.toLowerCase());
      continue;
    }
    if (selector.startsWith('@') || body.includes('{')) continue;

    const declarations = parseDeclarations(body);
    for (const raw of selector.split(',')) {
      const single = raw.trim().toLowerCase();
      let match: RegExpMatchArray | null;
      if ((match = single.match(/^([a-z][a-z0-9]*)\.([\w-]+)$/))) {
        merge(info.tagClassRules, `${match[1]}.${match[2]}`, declarations);
      } else if ((match = single.match(/^\.([\w-]+)$/))) {
        merge(info.classRules, match[1], declarations);
      } else if (/^[a-z][a-z0-9]*$/.test(single)) {
        merge(info.tagRules, single, declarations);
      }
    }
  }
  return info;
}

function matchingBrace(css: string, open: number): number {
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1;
    else if (css[index] === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return css.length;
}

function merge(target: Map<string, Declarations>, key: string, declarations: Declarations): void {
  const existing = target.get(key);
  if (!existing) target.set(key, new Map(declarations));
  else declarations.forEach((value, property) => existing.set(property, value));
}

/** The element's own declarations: tag rules, then class rules, then its style attribute. */
export function ownStyle(element: Element, sheet: StyleSheetInfo): Declarations {
  const tag = element.tagName.toLowerCase();
  const result: Declarations = new Map();
  const add = (declarations?: Declarations) => declarations?.forEach((value, property) => result.set(property, value));

  add(sheet.tagRules.get(tag));
  const classes = (element.getAttribute('class') ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  for (const cls of classes) {
    add(sheet.classRules.get(cls));
    add(sheet.tagClassRules.get(`${tag}.${cls}`));
  }
  const inline = element.getAttribute('style');
  if (inline) add(parseDeclarations(inline));
  return result;
}

/** Font size in points, or null. */
export function fontSizeInPoints(value: string | undefined): number | null {
  if (!value) return null;
  const match = value.match(/^(\d*\.?\d+)(px|pt)?$/i);
  if (!match) return null;
  const size = parseFloat(match[1]);
  return match[2]?.toLowerCase() === 'px' ? size * 0.75 : size;
}
