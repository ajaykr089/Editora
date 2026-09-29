/**
 * Bidirectional reconciliation between a contentEditable DOM subtree and a
 * Yjs Y.XmlFragment mirroring its structure element-for-element.
 *
 * There is no structured document model in @editora/core to bind a CRDT to
 * (the live edit path is raw contentEditable HTML - see the collaboration
 * plugin's README for the full rationale), so this mirrors the DOM tree
 * itself: every DOM Element becomes a Y.XmlElement with matching tag and
 * attributes, every DOM Text node becomes a Y.XmlText. Reconciliation is a
 * full child-list comparison (not a minimal edit-distance diff) - simple
 * text edits within one node are still cheap (prefix/suffix-trimmed), but a
 * structural change (e.g. a new paragraph) rebuilds everything from the
 * first differing index onward. That's a deliberate simplicity-over-op-count
 * trade-off; see the "Limitations" section of the plugin README.
 *
 * Only Element and Text DOM nodes are mirrored - comments and other node
 * types are ignored on the DOM->Y direction and never produced by Y->DOM.
 */
import * as Y from 'yjs';

type YChild = Y.XmlText | Y.XmlElement;
type YParent = Y.XmlFragment | Y.XmlElement;

// Y.XmlFragment/Y.XmlElement.toArray() is typed to also allow Y.XmlHook (an
// escape hatch for embedding arbitrary non-XML values) - our converters
// never produce one, so narrow it away rather than threading it through
// every signature below.
function isYChild(node: Y.XmlText | Y.XmlElement | Y.XmlHook): node is YChild {
  return node instanceof Y.XmlText || node instanceof Y.XmlElement;
}

function yChildrenOf(parent: YParent): YChild[] {
  return parent.toArray().filter(isYChild);
}

export function diffText(oldStr: string, newStr: string): { start: number; deleteCount: number; insertText: string } | null {
  if (oldStr === newStr) return null;

  let prefix = 0;
  const maxPrefix = Math.min(oldStr.length, newStr.length);
  while (prefix < maxPrefix && oldStr[prefix] === newStr[prefix]) prefix++;

  let suffix = 0;
  const maxSuffix = Math.min(oldStr.length - prefix, newStr.length - prefix);
  while (suffix < maxSuffix && oldStr[oldStr.length - 1 - suffix] === newStr[newStr.length - 1 - suffix]) suffix++;

  return {
    start: prefix,
    deleteCount: oldStr.length - prefix - suffix,
    insertText: newStr.slice(prefix, newStr.length - suffix)
  };
}

function domElementToY(el: Element): Y.XmlElement {
  const yEl = new Y.XmlElement(el.tagName.toLowerCase());
  for (const attr of Array.from(el.attributes)) {
    yEl.setAttribute(attr.name, attr.value);
  }
  const children = domChildrenToY(el.childNodes);
  if (children.length) yEl.insert(0, children);
  return yEl;
}

function domChildrenToY(nodes: NodeListOf<ChildNode> | ChildNode[]): YChild[] {
  const result: YChild[] = [];
  for (const node of Array.from(nodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      result.push(new Y.XmlText(node.textContent ?? ''));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      result.push(domElementToY(node as Element));
    }
  }
  return result;
}

function yElementToDom(yEl: Y.XmlElement, document: Document): HTMLElement {
  const el = document.createElement(yEl.nodeName);
  for (const [name, value] of Object.entries(yEl.getAttributes())) {
    el.setAttribute(name, value as string);
  }
  for (const child of yChildrenOf(yEl)) {
    el.appendChild(yChildToDom(child, document));
  }
  return el;
}

function yChildToDom(child: YChild, document: Document): ChildNode {
  if (child instanceof Y.XmlText) {
    return document.createTextNode(child.toString());
  }
  return yElementToDom(child, document);
}

function isSameTag(domEl: Element, yEl: Y.XmlElement): boolean {
  return domEl.tagName.toLowerCase() === yEl.nodeName.toLowerCase();
}

/** Makes `yParent`'s children match `domParent`'s children. Call inside a Y.Doc transaction. */
export function reconcileYFromDom(yParent: YParent, domParent: Node): void {
  const domChildren = Array.from(domParent.childNodes).filter(
    (n) => n.nodeType === Node.TEXT_NODE || n.nodeType === Node.ELEMENT_NODE
  );
  const yChildren = yChildrenOf(yParent);
  const minLen = Math.min(domChildren.length, yChildren.length);

  let i = 0;
  for (; i < minLen; i++) {
    const domNode = domChildren[i];
    const yNode = yChildren[i];

    if (domNode.nodeType === Node.TEXT_NODE) {
      if (yNode instanceof Y.XmlText) {
        const diff = diffText(yNode.toString(), domNode.textContent ?? '');
        if (diff) {
          if (diff.deleteCount > 0) yNode.delete(diff.start, diff.deleteCount);
          if (diff.insertText) yNode.insert(diff.start, diff.insertText);
        }
        continue;
      }
      break; // type mismatch - rebuild from here
    }

    // domNode is an Element
    if (yNode instanceof Y.XmlElement && isSameTag(domNode as Element, yNode)) {
      reconcileAttributes(yNode, domNode as Element);
      reconcileYFromDom(yNode, domNode);
      continue;
    }
    break; // tag mismatch - rebuild from here
  }

  // Everything from index i onward differs in shape - drop the stale Y tail
  // and rebuild it fresh from the current DOM children.
  if (i < yChildren.length) {
    yParent.delete(i, yChildren.length - i);
  }
  if (i < domChildren.length) {
    const fresh = domChildrenToY(domChildren.slice(i));
    if (fresh.length) yParent.insert(i, fresh);
  }
}

function reconcileAttributes(yEl: Y.XmlElement, domEl: Element): void {
  const yAttrs = yEl.getAttributes();
  const domAttrNames = new Set(Array.from(domEl.attributes).map((a) => a.name));

  for (const name of Object.keys(yAttrs)) {
    if (!domAttrNames.has(name)) yEl.removeAttribute(name);
  }
  for (const attr of Array.from(domEl.attributes)) {
    if (yAttrs[attr.name] !== attr.value) yEl.setAttribute(attr.name, attr.value);
  }
}

/** Makes `domParent`'s children match `yParent`'s children. */
export function reconcileDomFromY(domParent: Node, yParent: YParent, document: Document): void {
  const yChildren = yChildrenOf(yParent);
  const domChildren = Array.from(domParent.childNodes).filter(
    (n) => n.nodeType === Node.TEXT_NODE || n.nodeType === Node.ELEMENT_NODE
  );
  const minLen = Math.min(yChildren.length, domChildren.length);

  let i = 0;
  for (; i < minLen; i++) {
    const yNode = yChildren[i];
    const domNode = domChildren[i];

    if (yNode instanceof Y.XmlText) {
      if (domNode.nodeType === Node.TEXT_NODE) {
        const newText = yNode.toString();
        if (domNode.textContent !== newText) domNode.textContent = newText;
        continue;
      }
      break;
    }

    if (domNode.nodeType === Node.ELEMENT_NODE && isSameTag(domNode as Element, yNode)) {
      applyAttributesToDom(domNode as Element, yNode);
      reconcileDomFromY(domNode, yNode, document);
      continue;
    }
    break;
  }

  // Remove the stale DOM tail, then append fresh nodes built from Y.
  for (let j = domChildren.length - 1; j >= i; j--) {
    domParent.removeChild(domChildren[j]);
  }
  for (let j = i; j < yChildren.length; j++) {
    domParent.appendChild(yChildToDom(yChildren[j], document));
  }
}

function applyAttributesToDom(domEl: Element, yEl: Y.XmlElement): void {
  const yAttrs = yEl.getAttributes();
  const domAttrNames = new Set(Array.from(domEl.attributes).map((a) => a.name));

  for (const name of domAttrNames) {
    if (!(name in yAttrs)) domEl.removeAttribute(name);
  }
  for (const [name, value] of Object.entries(yAttrs)) {
    if (domEl.getAttribute(name) !== value) domEl.setAttribute(name, value as string);
  }
}
