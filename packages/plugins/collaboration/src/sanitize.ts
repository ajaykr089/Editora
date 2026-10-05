/**
 * Guards for content that arrives from other clients.
 *
 * Every client in a room can write arbitrary Y.XmlElement nodes (any tag, any attribute) into the
 * shared fragment, and remote clients render them straight into their contentEditable. Without a
 * filter a peer can plant a <script>, an <img onerror=...>, a javascript: link or an <iframe> in
 * every other participant's page. This is the same trust boundary @editora/core enforces with
 * DOMPurify for paste/input, applied to the one path that bypasses it.
 *
 * The filter is a deny-list of the executable/embedding primitives rather than a tag allow-list,
 * because the editor's own content (checklists, figures, custom blocks) must keep syncing.
 */

/** Marks the inert stand-in rendered where a blocked remote element would be. */
export const BLOCKED_PLACEHOLDER_ATTRIBUTE = 'data-collab-blocked';

const VALID_TAG = /^[a-z][a-z0-9-]*$/;
const VALID_ATTRIBUTE = /^[a-z_:][-a-z0-9_:.]*$/i;

const BLOCKED_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'frame',
  'frameset',
  'object',
  'embed',
  'applet',
  'link',
  'meta',
  'base',
  'noscript',
  'template',
  'portal',
]);

/** Attributes whose value is a URL the browser will load or navigate to. */
const URL_ATTRIBUTES = new Set([
  'href',
  'src',
  'xlink:href',
  'action',
  'formaction',
  'data',
  'poster',
  'background',
  'cite',
  'codebase',
  'manifest',
  'ping',
  'longdesc',
  'usemap',
  'lowsrc',
  'dynsrc',
]);

const SAFE_DATA_IMAGE = /^data:image\/(?:png|gif|jpe?g|webp|avif|bmp|x-icon);/;

// Browsers ignore leading C0 controls/spaces and strip tab/CR/LF anywhere in a URL before reading
// its scheme, so `jav\tascript:` and `\u0001javascript:` are live. Dropping every control,
// whitespace and invisible character first makes the scheme test see what the browser sees.
const IGNORED_URL_CHARS = new RegExp('[\\u0000-\\u0020\\u007f-\\u009f\\u00ad\\u200b-\\u200f\\u2028\\u2029\\ufeff]', 'g');

export function isSafeUrl(value: string): boolean {
  const normalized = value.replace(IGNORED_URL_CHARS, '').toLowerCase();
  if (/^(?:javascript|vbscript|livescript|mocha):/.test(normalized)) return false;
  if (normalized.startsWith('data:')) return SAFE_DATA_IMAGE.test(normalized);
  return true;
}

function isTrustedEmbed(attributes: Record<string, string>): boolean {
  if (!('data-editora-embed' in attributes)) return false;
  const src = attributes.src?.trim();
  if (!src || /\s/.test(src)) return false;
  try {
    const url = new URL(src);
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.hostname.length > 0;
  } catch {
    return false;
  }
}

/**
 * True when a remote element must not be rendered as-is: the name cannot be an element name at
 * all (createElement would throw), or it is an executable/embedding tag. The embed-iframe
 * plugin's own iframes (marker attribute + http(s) src) are kept, matching core's input
 * sanitizer.
 */
export function isBlockedElement(nodeName: string, attributes: Record<string, string>): boolean {
  const tag = nodeName.toLowerCase();
  if (!VALID_TAG.test(tag)) return true;
  if (tag === 'iframe') return !isTrustedEmbed(attributes);
  return BLOCKED_TAGS.has(tag);
}

/** True when a remote attribute may be applied to a rendered element. */
export function isAllowedAttribute(name: string, value: string): boolean {
  if (!VALID_ATTRIBUTE.test(name)) return false;
  const lower = name.toLowerCase();
  if (lower.startsWith('on') || lower === 'srcdoc') return false;
  if (URL_ATTRIBUTES.has(lower)) return isSafeUrl(String(value));
  return true;
}

export function createBlockedPlaceholder(document: Document, nodeName: string): HTMLElement {
  const placeholder = document.createElement('span');
  placeholder.setAttribute(BLOCKED_PLACEHOLDER_ATTRIBUTE, VALID_TAG.test(nodeName.toLowerCase()) ? nodeName.toLowerCase().slice(0, 32) : 'invalid');
  placeholder.hidden = true;
  return placeholder;
}

export function isBlockedPlaceholder(node: Node): boolean {
  return node.nodeType === Node.ELEMENT_NODE && (node as Element).hasAttribute(BLOCKED_PLACEHOLDER_ATTRIBUTE);
}
