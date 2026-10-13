// Internal: not exported from index.ts.
// A server has no DOM, but the element classes still have to be declarable so that their modules
// can be imported there (server rendering of client components). They are only defined, and only
// ever instantiated, in a browser.
export const DOMElement: typeof HTMLElement =
  typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as unknown as typeof HTMLElement);
