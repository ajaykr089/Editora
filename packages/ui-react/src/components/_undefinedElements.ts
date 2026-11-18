// Raw `<ui-*>` tags written straight into JSX or HTML used to work after any import from the package root, because the
// root registered every ui-core element. Now each component registers only the elements it renders, so a raw tag stays
// an empty unknown element unless something registers it. Say so once, after the page has settled (elements such as
// ui-icon register on demand), naming the tags and the import that fixes them.
//
// Only this scheduler is in every component's first load: the scan and the message are in their own chunk, fetched when
// the check runs. Hook-free and DOM-guarded: createUIElement calls this during render, on the server too.

const CHECK_DELAY_MS = 3000;
let scheduled = false;

export function scheduleUndefinedElementCheck(): void {
  if (scheduled || typeof window === 'undefined' || typeof customElements === 'undefined') return;
  scheduled = true;
  window.setTimeout(() => {
    void import('./_undefinedElementsReport').then((report) => report.reportUndefinedElements());
  }, CHECK_DELAY_MS);
}

/** @internal Lets tests run the check again. */
export function resetUndefinedElementCheck(): void {
  scheduled = false;
}
