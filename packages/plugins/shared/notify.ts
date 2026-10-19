/**
 * A short message for the person using the editor, in place of the browser's `alert()`.
 *
 * `alert()` freezes the whole page until it is dismissed, cannot be styled or translated by the host, and is
 * announced inconsistently. This shows the message in a live region at the bottom of the screen, announces it to
 * screen readers, and goes away by itself (or when clicked); the page keeps working in the meantime.
 */

export type NoticeKind = 'info' | 'error';

const REGION_ATTRIBUTE = 'data-rte-notices';
const STYLE_ID = 'rte-notice-styles';
const DURATION: Record<NoticeKind, number> = { info: 5000, error: 8000 };

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    [${REGION_ATTRIBUTE}] {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      z-index: 100001;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      max-width: min(92vw, 480px);
      pointer-events: none;
    }
    [${REGION_ATTRIBUTE}] .rte-notice {
      pointer-events: auto;
      cursor: pointer;
      padding: 10px 16px;
      border-radius: 8px;
      font: 14px/1.4 var(--rte-font-family-base, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      color: #fff;
      background: #1f2937;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }
    [${REGION_ATTRIBUTE}] .rte-notice[data-kind="error"] {
      background: #b91c1c;
    }
    @media (prefers-reduced-motion: no-preference) {
      [${REGION_ATTRIBUTE}] .rte-notice { animation: rte-notice-in 160ms ease-out; }
      @keyframes rte-notice-in { from { opacity: 0; transform: translateY(8px); } }
    }
  `;
  document.head.appendChild(style);
}

/** The live region has to exist before its message is added, or screen readers do not announce it. */
function regionFor(kind: NoticeKind): HTMLElement {
  const politeness = kind === 'error' ? 'assertive' : 'polite';
  let region = document.querySelector<HTMLElement>(`[${REGION_ATTRIBUTE}="${politeness}"]`);
  if (!region) {
    region = document.createElement('div');
    region.setAttribute(REGION_ATTRIBUTE, politeness);
    region.setAttribute('aria-live', politeness);
    region.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    region.setAttribute('aria-atomic', 'false');
    document.body.appendChild(region);
  }
  return region;
}

export function notify(message: string, kind: NoticeKind = 'info'): void {
  if (typeof document === 'undefined' || !document.body) return;
  injectStyles();

  const region = regionFor(kind);
  // The same message twice in a row is one message.
  Array.from(region.children).forEach((child) => {
    if (child.textContent === message) child.remove();
  });

  const notice = document.createElement('div');
  notice.className = 'rte-notice';
  notice.setAttribute('data-kind', kind);
  notice.textContent = message;
  notice.title = 'Dismiss';

  const remove = () => {
    window.clearTimeout(timer);
    notice.remove();
    if (!region.children.length) region.remove();
  };
  const timer = window.setTimeout(remove, DURATION[kind]);
  notice.addEventListener('click', remove);
  region.appendChild(notice);
}
