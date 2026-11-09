/**
 * Lets a component's shadow root use the page's stylesheets, for components that render the
 * app's own markup inside their shadow root (Sortable's renderItem / renderListHeader). Without it
 * the app's CSS classes do not reach that markup.
 *
 * The page's CSS goes into one constructed stylesheet, adopted by the shadow root (so it survives
 * re-renders) and wrapped in a cascade layer, so it styles the app's markup but never beats the
 * component's own (unlayered) styles. It follows the page: added or removed <style>/<link> sheets
 * (for example a dev server injecting CSS) are picked up. Cross-origin sheets whose rules cannot
 * be read are skipped.
 */
export function adoptPageStyles(root: ShadowRoot): () => void {
  const doc = root.ownerDocument || (typeof document !== 'undefined' ? document : null);
  if (!doc || typeof CSSStyleSheet === 'undefined' || !('adoptedStyleSheets' in root)) return () => {};

  let sheet: CSSStyleSheet;
  try {
    sheet = new CSSStyleSheet();
  } catch {
    return () => {};
  }

  const collect = () => {
    const parts: string[] = [];
    for (const page of Array.from(doc.styleSheets)) {
      try {
        parts.push(Array.from(page.cssRules).map((rule) => rule.cssText).join('\n'));
      } catch {
        // Cross-origin stylesheet: its rules cannot be read.
      }
    }
    try {
      sheet.replaceSync(`@layer editora-page-styles {\n${parts.join('\n')}\n}`);
    } catch {
      // A rule the constructed sheet cannot take (an @import): leave the last good copy.
    }
  };

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      collect();
    });
  };

  collect();
  root.adoptedStyleSheets = [...root.adoptedStyleSheets.filter((s) => s !== sheet), sheet];

  const observer = new MutationObserver(schedule);
  observer.observe(doc.head || doc.documentElement, { childList: true, subtree: true, characterData: true });
  // A new <link> has no rules until it loads.
  const onLoad = (event: Event) => {
    if ((event.target as Element | null)?.tagName === 'LINK') schedule();
  };
  doc.addEventListener('load', onLoad, true);

  return () => {
    observer.disconnect();
    doc.removeEventListener('load', onLoad, true);
    root.adoptedStyleSheets = root.adoptedStyleSheets.filter((s) => s !== sheet);
  };
}
