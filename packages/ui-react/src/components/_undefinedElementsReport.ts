// Loaded by _undefinedElements.ts when its check runs, so none of this is in a component's first load.

/** The `ui-*` tags in the document that no custom element definition covers. */
export function findUndefinedElements(root: ParentNode = document): string[] {
  const tags = new Set<string>();
  root.querySelectorAll(':not(:defined)').forEach((element) => {
    const tag = element.localName;
    if (tag.startsWith('ui-') && !customElements.get(tag)) tags.add(tag);
  });
  return [...tags].sort();
}

export function reportUndefinedElements(): void {
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
