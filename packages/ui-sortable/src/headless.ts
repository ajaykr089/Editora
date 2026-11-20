// @editora/ui-sortable/headless: drag-and-drop reordering for markup you already have.
//
//   const list = createSortable(document.querySelector('ul'), { onSort: (event) => save(list.toArray()) });
//
// The items are the children of the element (or the ones matching `itemSelector`). They are moved by pointer (mouse, pen,
// touch with a short press) and by keyboard (Space to pick up, arrows to move, Space to drop, Escape to cancel), with
// screen-reader announcements, auto-scroll near the edges, and lists that share a `group` exchanging items. It brings no
// CSS: the item being dragged is marked [data-sortable-dragging] and a copy of it follows the pointer.
//
// For a framework that owns the DOM (React, Vue...), pass `revert: true`: the elements are put back where they were after
// a drop, and onSort says what moved, so you reorder your data and let the framework render it.

export type SortableDirection = 'vertical' | 'horizontal' | 'grid';
export type SortableSource = 'pointer' | 'keyboard';

export interface SortableMove {
  item: HTMLElement;
  from: HTMLElement;
  to: HTMLElement;
  /** The index the item would have in `to`. */
  newIndex: number;
}

export interface SortableEvent extends SortableMove {
  /** `update`: moved within its list. `remove` (on the list it left) and `add` (on the list it joined): moved between lists. */
  type: 'update' | 'add' | 'remove';
  itemId: string | null;
  fromId: string | null;
  toId: string | null;
  oldIndex: number;
  source: SortableSource;
}

export interface SortableEndEvent extends SortableMove {
  itemId: string | null;
  oldIndex: number;
  /** The item ended somewhere else than it started. */
  changed: boolean;
  /** Escape, a cancelled pointer, or a drop that canMove refused. */
  cancelled: boolean;
  source: SortableSource;
}

export interface SortableAnnouncementContext {
  item: HTMLElement;
  itemLabel: string;
  listLabel: string;
  position: number;
  total: number;
}

export interface SortableAnnouncements {
  instructions: string;
  lifted: (context: SortableAnnouncementContext) => string;
  moved: (context: SortableAnnouncementContext) => string;
  movedToList: (context: SortableAnnouncementContext) => string;
  dropped: (context: SortableAnnouncementContext) => string;
  cancelled: (context: SortableAnnouncementContext) => string;
}

export interface SortableOptions {
  /** Which children are items (a selector). Left out: every child element. */
  itemSelector?: string;
  /** Start a pointer drag only from this part of an item (a selector), such as a grip icon. The whole item otherwise. */
  handle?: string;
  /** Lists with the same group exchange items. */
  group?: string;
  /** This list's id in events. Left out: the element's data-sortable-id or id. */
  id?: string;
  /** How the items are laid out, for the arrow keys. Left out: worked out from where the items are. */
  direction?: SortableDirection;
  disabled?: boolean;
  /** How long the other items take to slide aside, in ms (0: no animation; none with prefers-reduced-motion). */
  animation?: number;
  /** For touch: how long to press before an item lifts, in ms, so that a swipe still scrolls the page. */
  touchDelay?: number;
  /** How far a mouse or pen must move, in px, before a press becomes a drag (a shorter move is a click). */
  threshold?: number;
  /** Space, arrows and Escape move the items, which become focusable. */
  keyboard?: boolean;
  /** Put the elements back after a drop and leave the reordering to you (for frameworks that own the DOM). */
  revert?: boolean;
  /** Each item's id, for events and toArray(). Left out: its data-id, or its id. */
  getId?: (item: HTMLElement) => string | null;
  /** Return false to refuse a move (a full list, a locked item...). */
  canMove?: (move: SortableMove) => boolean;
  onStart?: (event: { item: HTMLElement; from: HTMLElement; oldIndex: number; source: SortableSource }) => void;
  /** The order changed. Called on the list that changed, or on both lists for a move between them (remove, then add). */
  onSort?: (event: SortableEvent) => void;
  /** Every drag or keyboard move ends here, also when nothing moved or it was cancelled. Called on the list it started in. */
  onEnd?: (event: SortableEndEvent) => void;
  /** Where the copy that follows the pointer goes. Left out: into the list, so the list's CSS styles it as it styles
   *  the items. Pass document.body for a list that clips what overflows it. */
  ghostParent?: HTMLElement;
  /** A class for the copy that follows the pointer. Given, it replaces the built-in look (shadow, slight lift). */
  ghostClass?: string;
  /** A class for the item while it is dragged. Given, it replaces the built-in look (faded). */
  placeholderClass?: string;
  /** What screen readers are told; any of them can be replaced, for another language. */
  announcements?: Partial<SortableAnnouncements>;
}

export interface Sortable {
  readonly element: HTMLElement;
  /** The ids of the items, in order. */
  toArray(): string[];
  /** Reorder the items to these ids (items without an id keep their place at the end). */
  sort(ids: string[]): void;
  /** Change options; the others are kept. */
  update(options: Partial<SortableOptions>): void;
  destroy(): void;
}

const defaultAnnouncements: SortableAnnouncements = {
  instructions: 'Press Space to pick up. While it is picked up, use the arrow keys to move it, Space to drop it, Escape to cancel.',
  lifted: ({ itemLabel, position, total }) => `Picked up ${itemLabel}. Position ${position} of ${total}.`,
  moved: ({ itemLabel, position, total }) => `${itemLabel}: position ${position} of ${total}.`,
  movedToList: ({ itemLabel, listLabel, position, total }) => `${itemLabel}: ${listLabel}, position ${position} of ${total}.`,
  dropped: ({ itemLabel, listLabel, position, total }) => `Dropped ${itemLabel}${listLabel ? ` in ${listLabel}` : ''}, position ${position} of ${total}.`,
  cancelled: ({ itemLabel }) => `Cancelled. ${itemLabel} is back where it was.`,
};

// ---------------------------------------------------------------------------------------------------------------------
// Shared between the lists of a page

const instances = new Map<HTMLElement, SortableInstance>();
let liveRegion: HTMLElement | null = null;
const describedBy = new Map<string, HTMLElement>(); // instructions text -> its hidden element

function announce(message: string): void {
  if (typeof document === 'undefined' || !message) return;
  if (!liveRegion || !liveRegion.isConnected) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'assertive');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('data-sortable-announcer', '');
    hide(liveRegion);
    document.body.appendChild(liveRegion);
  }
  // Clearing first makes a repeated message ("position 2 of 5" twice) be read again.
  liveRegion.textContent = '';
  const region = liveRegion;
  setTimeout(() => {
    region.textContent = message;
  }, 20);
}

function instructionsId(text: string): string {
  let element = describedBy.get(text);
  if (!element || !element.isConnected) {
    element = document.createElement('div');
    element.id = `sortable-instructions-${describedBy.size + 1}`;
    element.textContent = text;
    hide(element);
    document.body.appendChild(element);
    describedBy.set(text, element);
  }
  return element.id;
}

function hide(element: HTMLElement): void {
  Object.assign(element.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: '0',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: '0',
  });
}

const reducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// Things a press must not turn into a drag: typing, picking, editing.
const INTERACTIVE = 'input, textarea, select, option, [contenteditable=""], [contenteditable="true"], [data-sortable-ignore]';
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex], [contenteditable=""], [contenteditable="true"]';

/** Moves an item of an array from one index to another, in a new array. */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const next = list.slice();
  if (from < 0 || from >= next.length) return next;
  const [item] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(to, next.length)), 0, item);
  return next;
}

/** Moves an item from one array to another, in new arrays: [from without it, to with it]. */
export function moveBetween<T>(from: readonly T[], to: readonly T[], fromIndex: number, toIndex: number): [T[], T[]] {
  const source = from.slice();
  const target = to.slice();
  const [item] = source.splice(fromIndex, 1);
  if (item !== undefined) target.splice(Math.max(0, Math.min(toIndex, target.length)), 0, item);
  return [source, target];
}

/** Applies an onSort event to lists kept in one object, keyed by list id: returns a new object. */
export function applySortEvent<T>(lists: Record<string, readonly T[]>, event: SortableEvent): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const key of Object.keys(lists)) result[key] = lists[key].slice();
  if (event.type === 'remove') return result; // the `add` on the other list does the move
  const from = event.fromId ?? '';
  const to = event.toId ?? '';
  if (event.type === 'update') {
    result[from] = moveItem(lists[from] || [], event.oldIndex, event.newIndex);
  } else {
    [result[from], result[to]] = moveBetween(lists[from] || [], lists[to] || [], event.oldIndex, event.newIndex);
  }
  return result;
}

// ---------------------------------------------------------------------------------------------------------------------

type Active = {
  item: HTMLElement;
  source: SortableSource;
  from: SortableInstance;
  oldIndex: number;
  // Where the item started, to put it back: its container and the element after it.
  home: { container: HTMLElement; next: Node | null };
  ghost?: HTMLElement;
  offset?: { x: number; y: number };
  lastTarget?: HTMLElement | null;
  focusTarget?: HTMLElement | null;
  pointer?: { x: number; y: number };
  scrollFrame?: number;
  placeholderStyle?: { opacity: string };
  placeholderClass?: string[];
};

let active: Active | null = null;

class SortableInstance {
  readonly element: HTMLElement;
  options: SortableOptions;
  private observer: MutationObserver | null = null;
  private added = new WeakMap<HTMLElement, string[]>(); // the attributes this list added to an element
  private pending: {
    pointerId: number;
    item: HTMLElement;
    target: HTMLElement;
    x: number;
    y: number;
    type: string;
    timer?: number;
  } | null = null;
  private listeners: Array<[EventTarget, string, EventListener, AddEventListenerOptions | boolean | undefined]> = [];

  constructor(element: HTMLElement, options: SortableOptions) {
    this.element = element;
    this.options = options;
    this.listen(element, 'pointerdown', this.onPointerDown as EventListener);
    this.listen(element, 'keydown', this.onKeyDown as EventListener);
    // Registered from the start, not when a press begins: a browser decides at the first touch whether a gesture may
    // scroll, and only a touchmove listener it already knew about can stop the page scrolling under a touch drag.
    this.listen(element, 'touchmove', this.onTouchMove as EventListener, { passive: false });
    this.listen(element, 'dragstart', ((event: DragEvent) => {
      // Images and links are draggable by default; their native drag would fight this one.
      if (this.itemOf(event.target as Node)) event.preventDefault();
    }) as EventListener);
    this.listen(element, 'focusout', ((event: FocusEvent) => {
      // Leaving a picked-up item drops it where it is.
      if (!active || active.source !== 'keyboard' || active.from !== this) return;
      const next = event.relatedTarget as Node | null;
      if (next && active.item.contains(next)) return;
      setTimeout(() => {
        if (active && active.source === 'keyboard' && !active.item.contains(document.activeElement)) finish(false);
      }, 0);
    }) as EventListener);
    this.prepareItems();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.prepareItems());
      this.observer.observe(element, { childList: true });
    }
  }

  // -- items --------------------------------------------------------------------------------------------------------

  items(): HTMLElement[] {
    const selector = this.options.itemSelector;
    return Array.from(this.element.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && !child.hasAttribute('data-sortable-ghost') && (!selector || child.matches(selector))
    );
  }

  itemOf(node: Node | null): HTMLElement | null {
    let current: Node | null = node;
    while (current && current !== this.element) {
      if (current.parentNode === this.element && current instanceof HTMLElement) {
        return this.items().includes(current) ? current : null;
      }
      current = current.parentNode;
    }
    return null;
  }

  idOf(item: HTMLElement): string | null {
    if (this.options.getId) return this.options.getId(item);
    return item.getAttribute('data-id') || item.id || null;
  }

  listId(): string | null {
    return this.options.id ?? (this.element.getAttribute('data-sortable-id') || this.element.id || null);
  }

  listLabel(): string {
    const labelledBy = this.element.getAttribute('aria-labelledby');
    const labelled = labelledBy ? document.getElementById(labelledBy.split(' ')[0]) : null;
    return this.element.getAttribute('aria-label') || labelled?.textContent?.trim() || this.listId() || '';
  }

  announcements(): SortableAnnouncements {
    return { ...defaultAnnouncements, ...this.options.announcements };
  }

  // Keyboard users need something to focus: the handle if there is one, else the item.
  private prepareItems(): void {
    if (this.options.keyboard === false) return;
    const instructions = instructionsId(this.announcements().instructions);
    for (const item of this.items()) {
      const target = this.focusTargetOf(item);
      const added: string[] = this.added.get(target) || [];
      if (!target.matches(FOCUSABLE)) {
        target.setAttribute('tabindex', '0');
        if (!added.includes('tabindex')) added.push('tabindex');
      }
      if (!target.hasAttribute('aria-describedby')) {
        target.setAttribute('aria-describedby', instructions);
        added.push('aria-describedby');
      }
      if (added.length) this.added.set(target, added);
    }
  }

  private focusTargetOf(item: HTMLElement): HTMLElement {
    const handle = this.options.handle ? item.querySelector<HTMLElement>(this.options.handle) : null;
    return handle || item;
  }

  context(item: HTMLElement): SortableAnnouncementContext {
    const items = this.items();
    const label = item.getAttribute('aria-label') || (item.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    return { item, itemLabel: label || 'Item', listLabel: this.listLabel(), position: items.indexOf(item) + 1, total: items.length };
  }

  /** The lists an item of this one can go to: itself, and those of the same group. */
  peers(): SortableInstance[] {
    const group = this.options.group;
    if (!group) return [this];
    return Array.from(instances.values()).filter((instance) => instance === this || (instance.options.group === group && !instance.options.disabled));
  }

  // -- pointer ------------------------------------------------------------------------------------------------------

  private onPointerDown = (event: PointerEvent): void => {
    if (this.options.disabled || active || this.pending) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    // A sortable inside an item of another one: the inner list takes the press.
    if ((event as PointerEvent & { __sortable?: boolean }).__sortable) return;
    const target = event.target as HTMLElement;
    const item = this.itemOf(target);
    if (!item) return;
    (event as PointerEvent & { __sortable?: boolean }).__sortable = true;
    if (this.options.handle) {
      const handle = target.closest(this.options.handle);
      if (!handle || !item.contains(handle)) return;
    } else if (target.closest(INTERACTIVE)) {
      return;
    }

    this.pending = { pointerId: event.pointerId, item, target, x: event.clientX, y: event.clientY, type: event.pointerType };
    if (event.pointerType === 'touch') {
      // A press: the item lifts after a moment, unless the finger moves first (a scroll).
      this.pending.timer = window.setTimeout(() => {
        if (this.pending) this.begin(this.pending.item, 'pointer', this.pending.x, this.pending.y);
      }, this.options.touchDelay ?? 200);
    }
    this.listen(window, 'pointermove', this.onPointerMove as EventListener, { passive: false });
    this.listen(window, 'pointerup', this.onPointerUp as EventListener);
    this.listen(window, 'pointercancel', this.onPointerCancel as EventListener);
    // Escape cancels a pointer drag too.
    this.listen(window, 'keydown', this.onDragKeyDown as EventListener);
  };

  private onDragKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !active || active.source !== 'pointer' || active.from !== this) return;
    event.preventDefault();
    this.cancelPending();
    finish(true);
  };

  // Once a touch drag runs, the page must not scroll under it.
  private onTouchMove = (event: TouchEvent): void => {
    if (active && active.source === 'pointer' && event.cancelable) event.preventDefault();
  };

  private onPointerMove = (event: PointerEvent): void => {
    const pending = this.pending;
    if (pending && event.pointerId !== pending.pointerId) return;
    if (!active && pending) {
      const distance = Math.hypot(event.clientX - pending.x, event.clientY - pending.y);
      if (pending.type === 'touch') {
        if (distance > 8) this.cancelPending(); // the finger moved before the press lifted the item: a scroll
        return;
      }
      if (distance < (this.options.threshold ?? 4)) return;
      this.begin(pending.item, 'pointer', pending.x, pending.y);
    }
    if (active && active.source === 'pointer' && active.from === this) {
      event.preventDefault();
      dragTo(event.clientX, event.clientY);
    }
  };

  private onPointerUp = (): void => {
    const wasDragging = Boolean(active && active.source === 'pointer' && active.from === this);
    this.cancelPending();
    if (wasDragging) {
      finish(false);
      suppressNextClick();
    }
  };

  private onPointerCancel = (): void => {
    const wasDragging = Boolean(active && active.source === 'pointer' && active.from === this);
    this.cancelPending();
    if (wasDragging) finish(true);
  };

  private cancelPending(): void {
    if (this.pending?.timer) clearTimeout(this.pending.timer);
    this.pending = null;
    if (!active || active.from !== this) this.unlistenWindow();
  }

  unlistenWindow(): void {
    this.listeners = this.listeners.filter(([target, type, listener, options]) => {
      if (target !== window) return true;
      target.removeEventListener(type, listener, options);
      return false;
    });
  }

  private listen(target: EventTarget, type: string, listener: EventListener, options?: AddEventListenerOptions | boolean): void {
    target.addEventListener(type, listener, options);
    this.listeners.push([target, type, listener, options]);
  }

  destroy(): void {
    if (active && active.from === this) finish(true);
    this.observer?.disconnect();
    this.listeners.forEach(([target, type, listener, options]) => target.removeEventListener(type, listener, options));
    this.listeners = [];
    for (const item of this.items()) {
      for (const node of [item, ...Array.from(item.querySelectorAll<HTMLElement>('[tabindex], [aria-describedby]'))]) {
        this.added.get(node)?.forEach((name) => node.removeAttribute(name));
        this.added.delete(node);
      }
    }
    if (instances.get(this.element) === this) instances.delete(this.element);
  }

  // -- keyboard -----------------------------------------------------------------------------------------------------

  private onKeyDown = (event: KeyboardEvent): void => {
    if (this.options.keyboard === false || this.options.disabled) return;
    const target = event.target as HTMLElement;
    const item = this.itemOf(target);
    if (!item) return;
    // Keys in a field inside the item are the field's.
    if (target !== this.focusTargetOf(item) && target.closest(INTERACTIVE)) return;
    const lifted = active && active.source === 'keyboard' && active.item === item;

    if (!lifted) {
      if ((event.key === ' ' || event.key === 'Enter') && target === this.focusTargetOf(item) && !active) {
        event.preventDefault();
        this.begin(item, 'keyboard');
      }
      return;
    }

    const key = event.key;
    if (key === ' ' || key === 'Enter') {
      event.preventDefault();
      finish(false);
    } else if (key === 'Escape') {
      event.preventDefault();
      finish(true);
    } else if (key === 'Tab') {
      finish(false);
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) {
      event.preventDefault();
      keyboardMove(key);
    }
  };

  // -- dragging -----------------------------------------------------------------------------------------------------

  begin(item: HTMLElement, source: SortableSource, x = 0, y = 0): void {
    if (active) return;
    const oldIndex = this.items().indexOf(item);
    active = {
      item,
      source,
      from: this,
      oldIndex,
      home: { container: this.element, next: item.nextSibling },
      focusTarget: source === 'keyboard' ? (document.activeElement as HTMLElement) : null,
    };
    item.setAttribute('data-sortable-dragging', source);
    document.documentElement.setAttribute('data-sortable-active', '');

    if (source === 'pointer') {
      const rect = item.getBoundingClientRect();
      const ghost = item.cloneNode(true) as HTMLElement;
      ghost.removeAttribute('id');
      ghost.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
      ghost.setAttribute('data-sortable-ghost', '');
      ghost.removeAttribute('data-sortable-dragging');
      ghost.setAttribute('aria-hidden', 'true');
      Object.assign(ghost.style, {
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: '0',
        boxSizing: 'border-box',
        pointerEvents: 'none',
        zIndex: '2147483647',
        transition: 'none',
        cursor: 'grabbing',
        willChange: 'transform',
      });
      (this.options.ghostParent || this.element).appendChild(ghost);
      // An ancestor with a transform (or filter, or contain) places fixed elements against itself, not the window:
      // measure where the copy landed and make up the difference.
      const landed = ghost.getBoundingClientRect();
      const shift = { x: rect.left - landed.left, y: rect.top - landed.top };
      if (shift.x || shift.y) {
        ghost.style.left = `${rect.left + shift.x}px`;
        ghost.style.top = `${rect.top + shift.y}px`;
      }
      if (this.options.ghostClass) ghost.classList.add(...this.options.ghostClass.split(/\s+/).filter(Boolean));
      else {
        Object.assign(ghost.style, {
          opacity: '0.95',
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.22), 0 2px 6px rgba(15, 23, 42, 0.12)',
          transform: 'scale(1.02)',
        });
      }
      active.ghost = ghost;
      active.offset = { x: x - rect.left - shift.x, y: y - rect.top - shift.y };
      active.pointer = { x, y };
      if (this.options.placeholderClass) {
        active.placeholderClass = this.options.placeholderClass.split(/\s+/).filter(Boolean);
        item.classList.add(...active.placeholderClass);
      } else {
        active.placeholderStyle = { opacity: item.style.opacity };
        item.style.opacity = '0.35';
      }
      document.documentElement.style.setProperty('user-select', 'none');
      document.documentElement.style.setProperty('-webkit-user-select', 'none');
      window.getSelection?.()?.removeAllRanges();
      if (this.pending?.timer) clearTimeout(this.pending.timer);
      this.pending = null;
    } else {
      item.setAttribute('data-sortable-lifted', '');
    }

    this.options.onStart?.({ item, from: this.element, oldIndex, source });
    if (source === 'keyboard') announce(this.announcements().lifted(this.context(item)));
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// The move itself (shared by all lists, since an item can change list)

function containerAt(x: number, y: number): SortableInstance | null {
  if (!active) return null;
  const peers = active.from.peers();
  const hit = document.elementFromPoint(x, y);
  let node: Element | null = hit;
  while (node) {
    const instance = instances.get(node as HTMLElement);
    if (instance && peers.includes(instance)) return instance;
    node = node.parentElement;
  }
  // Just outside a list (its column's padding, the gap under a short list): the nearest one, if it is close.
  let nearest: SortableInstance | null = null;
  let best = NEAR;
  for (const peer of peers) {
    const rect = peer.element.getBoundingClientRect();
    const dx = Math.max(rect.left - x, 0, x - rect.right);
    const dy = Math.max(rect.top - y, 0, y - rect.bottom);
    const distance = Math.hypot(dx, dy);
    if (distance <= best) {
      best = distance;
      nearest = peer;
    }
  }
  return nearest;
}

const NEAR = 24; // px

function allowed(item: HTMLElement, from: HTMLElement, to: SortableInstance, newIndex: number): boolean {
  const check = to.options.canMove || active?.from.options.canMove;
  return !check || check({ item, from, to: to.element, newIndex }) !== false;
}

// Moves the item to `index` in `to`, sliding the others aside.
function place(to: SortableInstance, index: number): boolean {
  if (!active) return false;
  const item = active.item;
  const currentContainer = item.parentElement as HTMLElement;
  const siblings = to.items().filter((element) => element !== item);
  const clamped = Math.max(0, Math.min(index, siblings.length));
  const currentIndex = to.element === currentContainer ? to.items().indexOf(item) : -1;
  if (currentIndex === clamped) return false;
  if (!allowed(item, active.home.container, to, clamped)) return false;

  const affected = new Set<HTMLElement>([...to.items(), ...(instances.get(currentContainer)?.items() || [])]);
  const before = new Map<HTMLElement, DOMRect>();
  const duration = reducedMotion() ? 0 : to.options.animation ?? 150;
  if (duration > 0) affected.forEach((element) => before.set(element, element.getBoundingClientRect()));

  const reference = siblings[clamped] || null;
  if (reference) to.element.insertBefore(item, reference);
  else {
    // After the last item, not after other children (a footer, say) that are not items.
    const last = siblings[siblings.length - 1];
    to.element.insertBefore(item, last ? last.nextSibling : null);
  }

  if (duration > 0) {
    before.forEach((rect, element) => {
      if (element === item && active?.source === 'pointer') return; // the ghost shows where it is
      const now = element.getBoundingClientRect();
      const dx = rect.left - now.left;
      const dy = rect.top - now.top;
      if ((dx || dy) && typeof element.animate === 'function') {
        element.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration, easing: 'cubic-bezier(0.2, 0, 0, 1)' });
      }
    });
  }
  return true;
}

function dragTo(x: number, y: number): void {
  if (!active || !active.ghost || !active.offset) return;
  active.pointer = { x, y };
  active.ghost.style.left = `${x - active.offset.x}px`;
  active.ghost.style.top = `${y - active.offset.y}px`;
  autoScroll();

  const to = containerAt(x, y);
  if (!to) return;
  const items = to.items();
  const hit = document.elementFromPoint(x, y);
  const target = hit ? to.itemOf(hit) : null;

  if (target && target !== active.item) {
    // A list that just moved under the pointer is not a new target until the pointer leaves it.
    if (active.lastTarget === target) return;
    const targetIndex = items.indexOf(target);
    let index: number;
    if (to.element === active.item.parentElement) {
      // Within its list, the item takes the target's place (the target moves aside, up or down).
      index = targetIndex;
    } else {
      // From another list: before or after the target, by which half the pointer is over.
      const rect = target.getBoundingClientRect();
      const horizontal = directionOf(to) === 'horizontal';
      const after = horizontal ? x > rect.left + rect.width / 2 : y > rect.top + rect.height / 2;
      index = targetIndex + (after ? 1 : 0);
    }
    if (place(to, index)) active.lastTarget = target;
    return;
  }
  if (target === active.item) return;
  active.lastTarget = null;

  // Over the list but not over an item: an empty list, or the space after the last item.
  const others = items.filter((element) => element !== active!.item);
  if (to.element !== active.item.parentElement) {
    if (others.length === 0 || pastLast(to, others, x, y)) place(to, others.length);
  } else if (others.length && pastLast(to, others, x, y)) {
    place(to, others.length);
  }
}

function pastLast(list: SortableInstance, others: HTMLElement[], x: number, y: number): boolean {
  const last = others[others.length - 1].getBoundingClientRect();
  return directionOf(list) === 'horizontal' ? x > last.right : y > last.bottom;
}

function directionOf(list: SortableInstance): SortableDirection {
  if (list.options.direction) return list.options.direction;
  const items = list.items();
  if (items.length < 2) return 'vertical';
  const a = items[0].getBoundingClientRect();
  const b = items[1].getBoundingClientRect();
  if (!a.width && !a.height) return 'vertical'; // not laid out (hidden, or no layout at all)
  if (Math.abs(a.top - b.top) < Math.max(4, a.height / 2)) {
    // Side by side: a row, or a grid if a later item wraps to the next line.
    const wraps = items.some((item) => item.getBoundingClientRect().top > a.bottom - 1);
    return wraps ? 'grid' : 'horizontal';
  }
  return 'vertical';
}

// Near the edge of a scrolling list (or of the window), scroll it, faster the closer the pointer is.
function autoScroll(): void {
  if (!active || active.scrollFrame || !active.pointer) return;
  const step = () => {
    if (!active || !active.pointer) return;
    active.scrollFrame = 0;
    const { x, y } = active.pointer;
    const edge = 48;
    const speed = (distance: number) => Math.ceil(((edge - distance) / edge) * 18);
    const hit = document.elementFromPoint(x, y);
    let scrolled = false;
    for (let node = hit as HTMLElement | null; node; node = node.parentElement) {
      if (node === document.body || node === document.documentElement) break;
      const style = getComputedStyle(node);
      const canY = /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight;
      const canX = /(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth;
      if (!canX && !canY) continue;
      const rect = node.getBoundingClientRect();
      if (canY && y - rect.top < edge && node.scrollTop > 0) { node.scrollTop -= speed(y - rect.top); scrolled = true; }
      else if (canY && rect.bottom - y < edge && node.scrollTop < node.scrollHeight - node.clientHeight) { node.scrollTop += speed(rect.bottom - y); scrolled = true; }
      if (canX && x - rect.left < edge && node.scrollLeft > 0) { node.scrollLeft -= speed(x - rect.left); scrolled = true; }
      else if (canX && rect.right - x < edge && node.scrollLeft < node.scrollWidth - node.clientWidth) { node.scrollLeft += speed(rect.right - x); scrolled = true; }
      if (scrolled) break;
    }
    if (!scrolled) {
      const page = document.scrollingElement || document.documentElement;
      if (y < edge && page.scrollTop > 0) { window.scrollBy(0, -speed(y)); scrolled = true; }
      else if (innerHeight - y < edge && page.scrollTop < page.scrollHeight - innerHeight) { window.scrollBy(0, speed(innerHeight - y)); scrolled = true; }
    }
    if (scrolled) {
      active.lastTarget = null;
      dragTo(x, y);
      active.scrollFrame = requestAnimationFrame(step);
    }
  };
  active.scrollFrame = requestAnimationFrame(step);
}

function keyboardMove(key: string): void {
  if (!active) return;
  const item = active.item;
  const list = instances.get(item.parentElement as HTMLElement);
  if (!list) return;
  const items = list.items();
  const index = items.indexOf(item);
  const direction = directionOf(list);
  const previous = direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
  const next = direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
  const across = direction === 'horizontal' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];

  let target = list;
  let targetIndex = index;
  if (key === 'Home') targetIndex = 0;
  else if (key === 'End') targetIndex = items.length - 1;
  else if (direction === 'grid') {
    const columns = columnsOf(items);
    if (key === 'ArrowLeft') targetIndex = index - 1;
    else if (key === 'ArrowRight') targetIndex = index + 1;
    else if (key === 'ArrowUp') targetIndex = index - columns;
    else targetIndex = index + columns;
    if (targetIndex < 0 || targetIndex >= items.length) return;
  } else if (key === previous) {
    if (index === 0) return;
    targetIndex = index - 1;
  } else if (key === next) {
    if (index === items.length - 1) return;
    targetIndex = index + 1;
  } else if (across.includes(key)) {
    // To the list beside this one in the group, in reading order.
    const peers = active.from.peers().sort((a, b) => {
      const ra = a.element.getBoundingClientRect();
      const rb = b.element.getBoundingClientRect();
      return direction === 'horizontal' ? ra.top - rb.top || ra.left - rb.left : ra.left - rb.left || ra.top - rb.top;
    });
    const position = peers.indexOf(list);
    const forward = key === across[1];
    target = peers[position + (forward ? 1 : -1)];
    if (!target) return;
    targetIndex = Math.min(index, target.items().length);
  } else {
    return;
  }

  const focused = document.activeElement as HTMLElement | null;
  const moved = place(target, targetIndex);
  if (focused && focused !== document.activeElement) focused.focus({ preventScroll: true });
  item.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  if (!moved) return;
  const context = target.context(item);
  announce(target === list ? target.announcements().moved(context) : target.announcements().movedToList(context));
}

function columnsOf(items: HTMLElement[]): number {
  if (!items.length) return 1;
  const top = items[0].getBoundingClientRect().top;
  const inFirstRow = items.filter((item) => Math.abs(item.getBoundingClientRect().top - top) < 2).length;
  return Math.max(1, inFirstRow);
}

function suppressNextClick(): void {
  // The click that ends a drag is not a click on the item.
  const swallow = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
  };
  window.addEventListener('click', swallow, { capture: true, once: true });
  setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 50);
}

function finish(cancelled: boolean): void {
  if (!active) return;
  const state = active;
  active = null;
  const { item, from, source, oldIndex, home } = state;
  if (state.scrollFrame) cancelAnimationFrame(state.scrollFrame);
  from.unlistenWindow();

  const toInstance = instances.get(item.parentElement as HTMLElement) || from;
  let newIndex = toInstance.items().indexOf(item);
  const moved = toInstance !== from || newIndex !== oldIndex;
  const putBack = () => home.container.insertBefore(item, home.next && home.next.parentNode === home.container ? home.next : null);

  if (cancelled && moved) putBack();
  const changed = !cancelled && moved;
  const to = cancelled ? from : toInstance;
  if (cancelled) newIndex = oldIndex;

  // Where the item ends up, for the ghost to fly to.
  const ghost = state.ghost;
  item.removeAttribute('data-sortable-dragging');
  item.removeAttribute('data-sortable-lifted');
  document.documentElement.removeAttribute('data-sortable-active');
  document.documentElement.style.removeProperty('user-select');
  document.documentElement.style.removeProperty('-webkit-user-select');
  if (state.placeholderStyle) item.style.opacity = state.placeholderStyle.opacity;
  if (state.placeholderClass) item.classList.remove(...state.placeholderClass);
  if (ghost) {
    const end = item.getBoundingClientRect();
    const duration = reducedMotion() ? 0 : Math.min(from.options.animation ?? 150, 200);
    if (duration && typeof ghost.animate === 'function') {
      const left = parseFloat(ghost.style.left);
      const top = parseFloat(ghost.style.top);
      ghost.animate(
        [{ transform: ghost.style.transform || 'none' }, { transform: `translate(${end.left - left}px, ${end.top - top}px)` }],
        { duration, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' }
      ).onfinish = () => ghost.remove();
      setTimeout(() => ghost.remove(), duration + 100);
    } else {
      ghost.remove();
    }
  }

  // A framework renders the new order itself: the DOM goes back to how it rendered it.
  if (changed && (from.options.revert || to.options.revert)) putBack();

  const itemId = from.idOf(item);
  if (changed) {
    const base = { item, itemId, from: from.element, to: to.element, fromId: from.listId(), toId: to.listId(), oldIndex, newIndex, source };
    if (to === from) from.options.onSort?.({ ...base, type: 'update' });
    else {
      from.options.onSort?.({ ...base, type: 'remove' });
      to.options.onSort?.({ ...base, type: 'add' });
    }
  }
  from.options.onEnd?.({ item, itemId, from: from.element, to: to.element, oldIndex, newIndex, changed, cancelled, source });

  if (source === 'keyboard') {
    const context = to.context(item);
    announce(cancelled ? from.announcements().cancelled(context) : to.announcements().dropped(context));
    // The framework moves the element when it renders the new order, and a moved element can lose focus: give it back.
    const focusTarget = state.focusTarget;
    if (focusTarget) {
      focusTarget.focus({ preventScroll: true });
      const refocus = () => {
        if (focusTarget.isConnected && document.activeElement !== focusTarget && (document.activeElement === document.body || !document.activeElement)) {
          focusTarget.focus({ preventScroll: true });
        }
      };
      setTimeout(refocus, 0);
      setTimeout(refocus, 50);
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------------

/** Makes the children of `element` sortable. Returns the list: toArray(), sort(ids), update(options), destroy(). */
export function createSortable(element: HTMLElement, options: SortableOptions = {}): Sortable {
  if (typeof document === 'undefined') {
    // On the server there is nothing to drag: a list that does nothing.
    return { element, toArray: () => [], sort: () => {}, update: () => {}, destroy: () => {} };
  }
  instances.get(element)?.destroy();
  const instance = new SortableInstance(element, options);
  instances.set(element, instance);

  const api: Sortable = {
    element,
    toArray: () => instance.items().map((item) => instance.idOf(item)).filter((id): id is string => Boolean(id)),
    sort(ids: string[]) {
      const items = instance.items();
      const byId = new Map(items.map((item) => [instance.idOf(item), item] as const));
      const ordered = ids.map((id) => byId.get(id)).filter((item): item is HTMLElement => Boolean(item));
      const rest = items.filter((item) => !ordered.includes(item));
      const anchor = items[items.length - 1]?.nextSibling || null;
      [...ordered, ...rest].forEach((item) => element.insertBefore(item, anchor));
    },
    update(next: Partial<SortableOptions>) {
      instance.options = { ...instance.options, ...next };
    },
    destroy() {
      instance.destroy();
    },
  };
  return api;
}
