// Renders a small, safe subset of HTML for `html: true` toasts.
//
// The markup is parsed in an inert <template> and then *rebuilt* node by node from an allowlist, rather than
// serialised and re-parsed, so nothing from the input (attributes, namespaces, mutation tricks) is carried
// across. The previous implementation assigned the string to textContent and read innerHTML back, which
// escapes everything: `html: true` showed the literal tags instead of rendering them.

const ALLOWED_TAGS = new Set([
  'a', 'b', 'strong', 'i', 'em', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup', 'code', 'kbd', 'br', 'span', 'p', 'ul', 'ol', 'li',
]);

// Removed together with their contents (an unknown element, by contrast, is unwrapped and its text kept).
const DROP_WITH_CONTENT = new Set([
  'script', 'style', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'noscript', 'template', 'svg', 'math', 'form',
  'input', 'button', 'textarea', 'select', 'option', 'head', 'title', 'link', 'meta', 'base', 'audio', 'video', 'canvas',
]);

const SAFE_PROTOCOL = /^(?:https?:|mailto:|tel:)/i;

/** Only http(s), mailto, tel, and relative / fragment links. Whitespace and control characters are ignored first, as browsers do. */
export function isSafeUrl(value: string): boolean {
  // eslint-disable-next-line no-control-regex
  const url = value.replace(/[\u0000- \u007f-\u009f]/g, '');
  if (!url) return false;
  if (SAFE_PROTOCOL.test(url)) return true;
  // No scheme at all: a relative path, "#fragment", "?query" or protocol-relative "//host" is fine.
  return !/^[a-z][a-z0-9+.-]*:/i.test(url);
}

function appendSafeChildren(source: Node, target: Node, doc: Document): void {
  for (const child of Array.from(source.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      target.appendChild(doc.createTextNode(child.textContent || ''));
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue; // comments, processing instructions, ...

    const element = child as Element;
    const tag = element.localName.toLowerCase();

    if (DROP_WITH_CONTENT.has(tag)) continue;

    if (!ALLOWED_TAGS.has(tag)) {
      appendSafeChildren(element, target, doc); // unwrap: keep the text, lose the element
      continue;
    }

    const clean = doc.createElement(tag);
    if (tag === 'a') {
      const href = element.getAttribute('href');
      if (href && isSafeUrl(href)) {
        clean.setAttribute('href', href.trim());
        if (/^(?:https?:)?\/\//i.test(href.trim())) {
          clean.setAttribute('target', '_blank');
          clean.setAttribute('rel', 'noopener noreferrer');
        }
      }
      const title = element.getAttribute('title');
      if (title) clean.setAttribute('title', title);
    }
    appendSafeChildren(element, clean, doc);
    target.appendChild(clean);
  }
}

/** Replace `target`'s content with a sanitised rendering of `html`. */
export function setSafeHtml(target: HTMLElement, html: string): void {
  const template = document.createElement('template');
  template.innerHTML = html;
  const fragment = document.createDocumentFragment();
  appendSafeChildren(template.content, fragment, document);
  target.textContent = '';
  target.appendChild(fragment);
}
