/** Small DOM helpers shared by the rules. They only use the standard DOM, so they also work in jsdom and linkedom. */

export const tagOf = (element: Element) => element.tagName.toLowerCase();

export function textOf(element: Element): string {
  return (element.textContent ?? '').replace(/[\s\u00a0\u200b]+/g, ' ').trim();
}

/** Text a screen reader would announce for an element: its text plus the alt of images inside it. */
export function accessibleText(element: Element): string {
  const label = element.getAttribute('aria-label')?.trim();
  if (label) return label;
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const text = labelledBy
      .split(/\s+/)
      .map((id) => element.ownerDocument.getElementById(id)?.textContent ?? '')
      .join(' ')
      .trim();
    if (text) return text;
  }
  let text = '';
  const walk = (node: Node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) text += child.textContent ?? '';
      else if (child.nodeType === 1) {
        const element = child as Element;
        if (element.getAttribute('aria-hidden') === 'true') return;
        if (tagOf(element) === 'img') text += ` ${element.getAttribute('alt') ?? ''} `;
        else walk(element);
      }
    });
  };
  walk(element);
  const title = element.getAttribute('title')?.trim() ?? '';
  return text.replace(/[\s\u00a0\u200b]+/g, ' ').trim() || title;
}

export function snippet(element: Element, max = 120): string {
  const html = element.outerHTML.replace(/\s+/g, ' ');
  return html.length > max ? `${html.slice(0, max - 1)}…` : html;
}

export function unwrap(element: Element): void {
  const parent = element.parentNode;
  if (!parent) return;
  while (element.firstChild) parent.insertBefore(element.firstChild, element);
  element.remove();
}

export function rename(element: Element, tag: string): Element {
  const replacement = element.ownerDocument.createElement(tag);
  for (const attribute of Array.from(element.attributes)) replacement.setAttribute(attribute.name, attribute.value);
  while (element.firstChild) replacement.appendChild(element.firstChild);
  element.replaceWith(replacement);
  return replacement;
}

/** Elements in document order, `root` excluded. */
export function all(root: Element, selector: string): Element[] {
  return Array.from(root.querySelectorAll(selector));
}

export function inlineStyle(element: Element, property: string): string | null {
  const style = element.getAttribute('style');
  if (!style) return null;
  for (const declaration of style.split(';')) {
    const colon = declaration.indexOf(':');
    if (colon > 0 && declaration.slice(0, colon).trim().toLowerCase() === property) {
      return declaration.slice(colon + 1).replace(/!important/i, '').trim();
    }
  }
  return null;
}

export function setInlineStyle(element: Element, property: string, value: string): void {
  const kept = (element.getAttribute('style') ?? '')
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part && part.slice(0, part.indexOf(':')).trim().toLowerCase() !== property);
  kept.push(`${property}: ${value}`);
  element.setAttribute('style', kept.join('; '));
}

const BLOCKS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre', 'td', 'th', 'div', 'figcaption', 'dd', 'dt']);

export function isBlock(element: Element): boolean {
  return BLOCKS.has(tagOf(element));
}

/** True when every visible character of `block` sits inside <strong>/<b> (or an inline bold style). */
export function isAllBold(block: Element): boolean {
  const total = textOf(block);
  if (!total) return false;
  let bold = '';
  const walk = (node: Node, inBold: boolean) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) {
        if (inBold) bold += child.textContent ?? '';
      } else if (child.nodeType === 1) {
        const element = child as Element;
        const weight = inlineStyle(element, 'font-weight');
        const strong = ['strong', 'b'].includes(tagOf(element)) || (weight !== null && (/bold/.test(weight) || parseInt(weight, 10) >= 600));
        walk(element, inBold || strong);
      }
    });
  };
  walk(block, false);
  return bold.replace(/[\s\u00a0]+/g, ' ').trim() === total;
}
