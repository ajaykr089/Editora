export function createPortalContainer(id = 'ui-portal-root') {
  if (typeof document === 'undefined') return null;
  let el = document.getElementById(id) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.width = '100%';
    el.style.height = '0';
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);
  }
  return el;
}

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export function computePosition(anchor: HTMLElement, content: HTMLElement, placement: Placement = 'top') {
  const a = anchor.getBoundingClientRect();
  const c = content.getBoundingClientRect();
  let top = 0, left = 0;
  if (placement === 'top') {
    top = a.top - c.height - 8 + (window.scrollY || 0);
    left = a.left + (a.width - c.width) / 2 + (window.scrollX || 0);
  } else if (placement === 'bottom') {
    top = a.bottom + 8 + (window.scrollY || 0);
    left = a.left + (a.width - c.width) / 2 + (window.scrollX || 0);
  } else if (placement === 'left') {
    top = a.top + (a.height - c.height) / 2 + (window.scrollY || 0);
    left = a.left - c.width - 8 + (window.scrollX || 0);
  } else {
    top = a.top + (a.height - c.height) / 2 + (window.scrollY || 0);
    left = a.right + 8 + (window.scrollX || 0);
  }
  return { top, left };
}

export function showPortalFor(anchor: HTMLElement, contentEl: HTMLElement, placement: Placement = 'top') {
  const root = createPortalContainer();
  if (!root) return;
  contentEl.style.position = 'absolute';
  contentEl.style.pointerEvents = 'auto';
  root.appendChild(contentEl);

  function reposition() {
    const pos = computePosition(anchor, contentEl, placement);
    // auto-flip if out of viewport vertically or horizontally
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    let final = pos;
    if ((pos.top < 0 && placement === 'top') || (pos.top + contentEl.offsetHeight > vh && placement === 'bottom')) {
      const altPlacement = placement === 'top' ? 'bottom' : 'top';
      final = computePosition(anchor, contentEl, altPlacement);
    }
    // clamp horizontally
    if (final.left < 4) final.left = 4;
    if (final.left + contentEl.offsetWidth > vw - 4) final.left = vw - contentEl.offsetWidth - 4;
    // clamp vertically
    if (final.top < 4) final.top = 4;
    if (final.top + contentEl.offsetHeight > vh - 4) final.top = vh - contentEl.offsetHeight - 4;
    contentEl.style.top = `${final.top}px`;
    contentEl.style.left = `${final.left}px`;
  }

  reposition();
  const onScroll = () => reposition();
  const onResize = () => reposition();
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onResize);

  return () => {
    try { if (contentEl.parentElement) contentEl.parentElement.removeChild(contentEl); } catch (e) {}
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', onResize);
  };
}
