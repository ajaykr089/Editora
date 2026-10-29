import { checkContent, type CheckResult } from './check';
import type { CheckOptions, Fix, Issue } from './types';

export interface ContentCheckerOptions extends CheckOptions {
  /** Re-check while the person types (default true). */
  live?: boolean;
  /** Milliseconds of quiet before a live re-check (default 600). */
  delay?: number;
  /** Show markers next to problems (default true). */
  markers?: boolean;
  /** Called after every check. */
  onChange?: (result: CheckResult) => void;
  /** Called after a fix changed the content, with the HTML from before it (for undo history). */
  onFix?: (details: { issue: Issue; fix: Fix; beforeHTML: string }) => void;
}

export interface ContentChecker {
  readonly result: CheckResult;
  check(): CheckResult;
  /** Show or hide the markers. */
  setMarkersVisible(visible: boolean): void;
  /** Open the next (or previous) problem's details. */
  focusNext(direction?: 1 | -1): void;
  destroy(): void;
}

const STYLE_ID = 'cax-styles';
const CSS = `
.cax-layer { position: absolute; top: 0; left: 0; width: 0; height: 0; z-index: 2147482000; }
.cax-layer [hidden] { display: none !important; }
.cax-marker {
  position: absolute; display: inline-flex; align-items: center; justify-content: center; gap: 2px;
  min-width: 22px; height: 22px; padding: 0 5px; border: 2px solid #fff; border-radius: 11px;
  font: 700 12px/1 system-ui, -apple-system, 'Segoe UI', sans-serif; color: #fff; cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35); transform: translate(-60%, -60%);
}
.cax-marker[data-severity="error"] { background: #b42318; }
.cax-marker[data-severity="warning"] { background: #8a4b00; }
.cax-marker[data-severity="info"] { background: #275eaa; }
.cax-marker:focus-visible { outline: 3px solid #5b4bdb; outline-offset: 2px; }
.cax-outline { position: absolute; pointer-events: none; border: 2px dashed #b42318; border-radius: 3px; }
.cax-pop {
  position: absolute; width: min(360px, calc(100vw - 16px)); padding: 12px; border: 1px solid #d0d0d8;
  border-radius: 10px; background: #fff; color: #1d1d24; box-shadow: 0 8px 24px rgba(15, 15, 30, 0.18);
  font: 13px/1.45 system-ui, -apple-system, 'Segoe UI', sans-serif;
}
.cax-pop h2 { margin: 0 0 4px; font-size: 14px; }
.cax-pop p { margin: 0 0 8px; color: #45454f; }
.cax-pop .cax-meta { font-size: 12px; color: #5d5d6b; margin-bottom: 8px; }
.cax-pop section + section { margin-top: 10px; padding-top: 10px; border-top: 1px solid #e4e4ea; }
.cax-fixes { display: flex; flex-wrap: wrap; gap: 6px; }
.cax-pop button, .cax-pop input {
  font: inherit; min-height: 30px; border-radius: 6px; border: 1px solid #c9c9d3; padding: 0 10px; background: #fff; color: inherit;
}
.cax-pop button { cursor: pointer; font-weight: 600; }
.cax-pop button:hover { background: #f2f2f6; }
.cax-pop button.cax-primary { background: #5b4bdb; border-color: #5b4bdb; color: #fff; }
.cax-pop button:focus-visible, .cax-pop input:focus-visible { outline: 2px solid #5b4bdb; outline-offset: 1px; }
.cax-pop form { display: flex; gap: 6px; width: 100%; }
.cax-pop input { flex: 1; min-width: 0; }
.cax-pop label { display: block; font-weight: 600; margin: 6px 0 4px; }
.cax-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;

function ensureStyles(doc: Document): void {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  doc.head.appendChild(style);
}

const WORST: Record<Issue['severity'], number> = { error: 3, warning: 2, info: 1 };
const NOUN: Record<Issue['severity'], string> = { error: 'error', warning: 'warning', info: 'suggestion' };

/** Check a contenteditable (or any element) and show problems next to the content, without changing its HTML. */
export function attachContentChecker(root: HTMLElement, options: ContentCheckerOptions = {}): ContentChecker {
  const doc = root.ownerDocument;
  const view = doc.defaultView ?? window;
  ensureStyles(doc);

  const layer = doc.createElement('div');
  layer.className = 'cax-layer';
  layer.setAttribute('data-cax-ui', '');
  doc.body.appendChild(layer);

  let result = checkContent(root, options);
  let visible = options.markers !== false;
  let markers: Array<{ element: Element; issues: Issue[]; button: HTMLButtonElement }> = [];
  let openFor: Element | null = null;
  let popover: HTMLElement | null = null;
  let outline: HTMLElement | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  /** True when the element's top-left corner is scrolled out of view inside a scrolling ancestor (an editor with a fixed height). */
  const isClipped = (element: Element, rect: DOMRect) => {
    for (let parent = element.parentElement; parent && parent !== doc.body; parent = parent.parentElement) {
      const style = view.getComputedStyle(parent);
      if (style.overflowX === 'visible' && style.overflowY === 'visible') continue;
      const box = parent.getBoundingClientRect();
      if (rect.top < box.top - 1 || rect.top > box.bottom || rect.left < box.left - 1 || rect.left > box.right) return true;
    }
    return false;
  };

  const place = (node: HTMLElement, element: Element, corner: 'start' | 'below') => {
    const rect = element.getBoundingClientRect();
    if (corner === 'start') {
      node.hidden = isClipped(element, rect);
      node.style.left = `${rect.left + view.scrollX}px`;
      node.style.top = `${rect.top + view.scrollY}px`;
    } else {
      const width = node.offsetWidth || 360;
      node.style.left = `${Math.max(8, Math.min(rect.left, view.innerWidth - width - 8)) + view.scrollX}px`;
      node.style.top = `${rect.bottom + view.scrollY + 8}px`;
    }
  };

  const closePopover = (returnFocus = false) => {
    const owner = markers.find((marker) => marker.element === openFor)?.button;
    popover?.remove();
    outline?.remove();
    popover = null;
    outline = null;
    openFor = null;
    if (returnFocus) owner?.focus();
  };

  const applyFix = (issue: Issue, fix: Fix, value?: string) => {
    const beforeHTML = root.innerHTML;
    fix.apply(value);
    closePopover();
    if (root.innerHTML !== beforeHTML) options.onFix?.({ issue, fix, beforeHTML });
    run();
    // Keep keyboard users in the flow: move to the next problem, if any.
    markers[0]?.button.focus();
  };

  const openPopover = (marker: (typeof markers)[number]) => {
    closePopover();
    openFor = marker.element;
    outline = doc.createElement('div');
    outline.className = 'cax-outline';
    const rect = marker.element.getBoundingClientRect();
    Object.assign(outline.style, {
      left: `${rect.left + view.scrollX - 3}px`,
      top: `${rect.top + view.scrollY - 3}px`,
      width: `${rect.width + 6}px`,
      height: `${rect.height + 6}px`,
    });
    layer.appendChild(outline);

    popover = doc.createElement('div');
    popover.className = 'cax-pop';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-label', 'Accessibility issue');
    marker.issues.forEach((issue) => {
      const section = doc.createElement('section');
      const title = doc.createElement('h2');
      title.textContent = issue.message;
      const meta = doc.createElement('div');
      meta.className = 'cax-meta';
      meta.textContent = `${NOUN[issue.severity].replace(/^./, (c) => c.toUpperCase())} \u00b7 ${issue.wcag ? `WCAG ${issue.wcag} (${issue.level})` : 'Best practice'}`;
      const help = doc.createElement('p');
      help.textContent = issue.help;
      section.append(title, meta, help);

      const fixes = doc.createElement('div');
      fixes.className = 'cax-fixes';
      issue.fixes.forEach((fix, index) => {
        if (fix.input) {
          const form = doc.createElement('form');
          const id = `cax-input-${Math.random().toString(36).slice(2)}`;
          const label = doc.createElement('label');
          label.htmlFor = id;
          label.textContent = fix.input.label;
          const input = doc.createElement('input');
          input.id = id;
          input.placeholder = fix.input.placeholder ?? '';
          input.value = fix.input.initial ?? '';
          const submit = doc.createElement('button');
          submit.type = 'submit';
          submit.className = 'cax-primary';
          submit.textContent = 'Apply';
          form.append(input, submit);
          form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (input.value.trim()) applyFix(issue, fix, input.value);
            else input.focus();
          });
          section.append(label);
          fixes.append(form);
        } else {
          const button = doc.createElement('button');
          button.type = 'button';
          button.textContent = fix.label;
          if (index === 0 && fix.kind === 'auto') button.className = 'cax-primary';
          button.addEventListener('click', () => applyFix(issue, fix));
          fixes.append(button);
        }
      });
      if (issue.fixes.length) section.append(fixes);
      popover!.append(section);
    });
    popover.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePopover(true);
      }
    });
    layer.appendChild(popover);
    place(popover, marker.element, 'below');
    popover.querySelector<HTMLElement>('input, button')?.focus();
  };

  const render = () => {
    markers.forEach((marker) => marker.button.remove());
    markers = [];
    if (!visible) return;

    const byElement = new Map<Element, Issue[]>();
    result.issues.forEach((issue) => {
      if (!issue.element.isConnected) return;
      const list = byElement.get(issue.element) ?? [];
      list.push(issue);
      byElement.set(issue.element, list);
    });

    byElement.forEach((issues, element) => {
      const worst = issues.reduce((a, b) => (WORST[b.severity] > WORST[a.severity] ? b : a)).severity;
      const button = doc.createElement('button');
      button.type = 'button';
      button.className = 'cax-marker';
      button.dataset.severity = worst;
      button.textContent = issues.length > 1 ? `${issues.length}` : worst === 'info' ? 'i' : '!';
      button.setAttribute('aria-label', `Accessibility ${NOUN[worst]}: ${issues.map((issue) => issue.message).join(' ')}`);
      button.addEventListener('mousedown', (event) => event.preventDefault());
      const marker = { element, issues, button };
      button.addEventListener('click', () => (openFor === element ? closePopover() : openPopover(marker)));
      button.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          event.preventDefault();
          focusNext(1);
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          event.preventDefault();
          focusNext(-1);
        }
      });
      layer.appendChild(button);
      place(button, element, 'start');
      markers.push(marker);
    });
  };

  const reposition = () => {
    markers.forEach((marker) => place(marker.button, marker.element, 'start'));
    const open = markers.find((marker) => marker.element === openFor);
    if (open && popover) place(popover, open.element, 'below');
  };

  function run(): CheckResult {
    result = checkContent(root, options);
    if (openFor && !result.issues.some((issue) => issue.element === openFor)) closePopover();
    render();
    options.onChange?.(result);
    return result;
  }

  function focusNext(direction: 1 | -1 = 1): void {
    if (markers.length === 0) return;
    const current = markers.findIndex((marker) => marker.button === doc.activeElement || marker.element === openFor);
    const next = markers[(current + direction + markers.length) % markers.length] ?? markers[0];
    next.button.focus();
    next.element.scrollIntoView?.({ block: 'nearest' });
  }

  const onInput = () => {
    if (options.live === false) return;
    clearTimeout(timer);
    timer = setTimeout(run, options.delay ?? 600);
  };
  const onOutside = (event: Event) => {
    if (popover && !popover.contains(event.target as Node) && !(event.target as Element)?.closest?.('.cax-marker')) closePopover();
  };

  root.addEventListener('input', onInput);
  view.addEventListener('scroll', reposition, true);
  view.addEventListener('resize', reposition);
  doc.addEventListener('mousedown', onOutside, true);
  render();
  options.onChange?.(result);

  return {
    get result() {
      return result;
    },
    check: run,
    setMarkersVisible(next: boolean) {
      visible = next;
      if (!next) closePopover();
      render();
    },
    focusNext,
    destroy() {
      clearTimeout(timer);
      closePopover();
      root.removeEventListener('input', onInput);
      view.removeEventListener('scroll', reposition, true);
      view.removeEventListener('resize', reposition);
      doc.removeEventListener('mousedown', onOutside, true);
      layer.remove();
    },
  };
}
