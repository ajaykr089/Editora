/**
 * A small XML parser for the parts of a .docx. Element names are normalised to
 * the usual prefixes (w:, r:, a:, wp:...) by namespace URI, so files that use
 * other prefixes still read.
 */

export interface XElement {
  name: string;
  attrs: Record<string, string>;
  children: XNode[];
}

export type XNode = XElement | string;

const PREFIXES: Record<string, string> = {
  'http://schemas.openxmlformats.org/wordprocessingml/2006/main': 'w',
  'http://purl.oclc.org/ooxml/wordprocessingml/main': 'w',
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships': 'r',
  'http://purl.oclc.org/ooxml/officeDocument/relationships': 'r',
  'http://schemas.openxmlformats.org/drawingml/2006/main': 'a',
  'http://purl.oclc.org/ooxml/drawingml/main': 'a',
  'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing': 'wp',
  'http://purl.oclc.org/ooxml/drawingml/wordprocessingDrawing': 'wp',
  'http://schemas.openxmlformats.org/drawingml/2006/picture': 'pic',
  'http://purl.oclc.org/ooxml/drawingml/picture': 'pic',
  'http://schemas.openxmlformats.org/markup-compatibility/2006': 'mc',
  'http://schemas.openxmlformats.org/package/2006/relationships': 'rel',
  'urn:schemas-microsoft-com:vml': 'v',
  'urn:schemas-microsoft-com:office:office': 'o',
  'http://schemas.openxmlformats.org/officeDocument/2006/math': 'm',
  'http://schemas.microsoft.com/office/word/2010/wordml': 'w14',
  'http://schemas.microsoft.com/office/word/2010/wordprocessingShape': 'wps',
};

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

export function decodeXml(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity] ?? match;
  });
}

export function escapeXml(value: string): string {
  // XML 1.0 cannot hold most control characters at all.
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const ATTR = /([^\s=/>]+)\s*=\s*("([^"]*)"|'([^']*)')/g;

export function parseXml(xml: string): XElement {
  const root: XElement = { name: '#document', attrs: {}, children: [] };
  const stack: Array<{ element: XElement; ns: Record<string, string> }> = [{ element: root, ns: { xml: 'xml' } }];
  const pattern = /<!--[\s\S]*?-->|<!\[CDATA\[([\s\S]*?)\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<(\/?)([^\s/>]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/g;
  let position = 0;
  let match: RegExpExecArray | null;
  const resolve = (qualified: string, ns: Record<string, string>, attribute: boolean) => {
    const colon = qualified.indexOf(':');
    if (colon < 0) {
      if (attribute) return qualified;
      const uri = ns[''];
      return uri && PREFIXES[uri] ? `${PREFIXES[uri]}:${qualified}` : qualified;
    }
    const prefix = qualified.slice(0, colon);
    if (prefix === 'xmlns' || prefix === 'xml') return qualified;
    const uri = ns[prefix];
    return `${(uri && PREFIXES[uri]) ?? prefix}:${qualified.slice(colon + 1)}`;
  };
  while ((match = pattern.exec(xml))) {
    const top = stack[stack.length - 1];
    if (match.index > position) {
      const text = xml.slice(position, match.index);
      if (text) top.element.children.push(decodeXml(text));
    }
    position = pattern.lastIndex;
    if (match[1] !== undefined) {
      top.element.children.push(match[1]);
      continue;
    }
    const tag = match[3];
    if (!tag) continue; // Comment, declaration, doctype.
    if (match[2] === '/') {
      if (stack.length > 1) stack.pop();
      continue;
    }
    const rawAttrs: Record<string, string> = {};
    const ns = { ...top.ns };
    let attr: RegExpExecArray | null;
    ATTR.lastIndex = 0;
    while ((attr = ATTR.exec(match[4]))) {
      const value = decodeXml(attr[3] ?? attr[4] ?? '');
      if (attr[1] === 'xmlns') ns[''] = value;
      else if (attr[1].startsWith('xmlns:')) ns[attr[1].slice(6)] = value;
      rawAttrs[attr[1]] = value;
    }
    const attrs: Record<string, string> = {};
    for (const [name, value] of Object.entries(rawAttrs)) if (!name.startsWith('xmlns')) attrs[resolve(name, ns, true)] = value;
    const element: XElement = { name: resolve(tag, ns, false), attrs, children: [] };
    top.element.children.push(element);
    if (match[5] !== '/') stack.push({ element, ns });
  }
  return root;
}

// ---- helpers for walking --------------------------------------------------------------------

export const isElement = (node: XNode): node is XElement => typeof node !== 'string';

export function child(element: XElement | undefined, name: string): XElement | undefined {
  return element?.children.find((node): node is XElement => isElement(node) && node.name === name);
}

export function children(element: XElement | undefined, name?: string): XElement[] {
  return (element?.children ?? []).filter((node): node is XElement => isElement(node) && (!name || node.name === name));
}

/** The first descendant with this name. */
export function find(element: XElement | undefined, name: string): XElement | undefined {
  if (!element) return undefined;
  for (const node of element.children) {
    if (!isElement(node)) continue;
    if (node.name === name) return node;
    const found = find(node, name);
    if (found) return found;
  }
  return undefined;
}

export function findAll(element: XElement | undefined, name: string, out: XElement[] = []): XElement[] {
  for (const node of element?.children ?? []) {
    if (!isElement(node)) continue;
    if (node.name === name) out.push(node);
    findAll(node, name, out);
  }
  return out;
}

export const textContent = (element: XElement): string => element.children.map((node) => (isElement(node) ? textContent(node) : node)).join('');

/** Tag builder for writing: `el('w:p', { 'w:rsidR': 'x' }, inner)`. */
export function el(name: string, attrs: Record<string, string | number | undefined> | null = null, ...content: string[]): string {
  const attributes = Object.entries(attrs ?? {})
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ` ${key}="${escapeXml(String(value))}"`)
    .join('');
  const inner = content.join('');
  return inner ? `<${name}${attributes}>${inner}</${name}>` : `<${name}${attributes}/>`;
}
