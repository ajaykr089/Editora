// Raw `<ui-*>` tags written straight into JSX or HTML used to work after any import from the package root, because the
// root registered every ui-core element. Now each component registers only the elements it renders, so a raw tag stays
// an empty unknown element unless something registers it. Say so once, after the page has settled (elements such as
// ui-icon register on demand), naming the tags and the import that fixes them.
//
// Hook-free and DOM-guarded: createUIElement calls this during render, on the server too.

const CHECK_DELAY_MS = 3000;
let scheduled = false;

export function scheduleUndefinedElementCheck(): void {
  if (scheduled || typeof window === 'undefined' || typeof document === 'undefined' || typeof customElements === 'undefined') {
    return;
  }
  scheduled = true;
  window.setTimeout(reportUndefinedElements, CHECK_DELAY_MS);
}

/** The `ui-*` tags in the document that no custom element definition covers. Exported for tests. */
export function findUndefinedElements(root: ParentNode = document): string[] {
  const tags = new Set<string>();
  root.querySelectorAll(':not(:defined)').forEach((element) => {
    const tag = element.localName;
    if (tag.startsWith('ui-') && !customElements.get(tag)) tags.add(tag);
  });
  return [...tags].sort();
}

function reportUndefinedElements(): void {
  const tags = findUndefinedElements();
  if (!tags.length) return;
  // Package names unquoted: the dist guard tests read `import "…"` and `from "…"` in built files as imports.
  const entries = tags.map((tag) => `@editora/ui-core/${tag.replace(/^ui-/, '')}`).join(', ');
  // eslint-disable-next-line no-console
  console.warn(
    `[ui-react] ${tags.join(', ')} ${tags.length === 1 ? 'is' : 'are'} on the page but not registered, so ` +
      `${tags.length === 1 ? 'it renders as an empty unknown element' : 'they render as empty unknown elements'}. The ` +
      '@editora/ui-react root no ' +
      `longer registers every element: add an import of ${entries}, or one import of @editora/ui-core to register ` +
      'them all.'
  );
}

/** @internal Lets tests run the check again. */
export function resetUndefinedElementCheck(): void {
  scheduled = false;
}
