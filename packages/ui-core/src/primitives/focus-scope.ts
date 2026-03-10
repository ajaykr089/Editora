export interface FocusScopeOptions {
  node: HTMLElement;
  trapped?: boolean;
  loop?: boolean;
  restoreFocus?: boolean;
  autoFocus?: 'first' | 'selected' | 'container' | 'none';
  initialFocus?: HTMLElement | (() => HTMLElement | null) | null;
  finalFocus?: HTMLElement | (() => HTMLElement | null) | null;
  inertOthers?: boolean;
}

export interface FocusScopeHandle {
  destroy(): void;
  focusFirst(): void;
  focusLast(): void;
  focusInitial(): void;
  pause(): void;
  resume(): void;
}

type ScopeRecord = {
  id: symbol;
  options: Required<Pick<FocusScopeOptions, 'trapped' | 'loop' | 'restoreFocus' | 'autoFocus' | 'inertOthers'>> & FocusScopeOptions;
  paused: boolean;
  previouslyFocused: HTMLElement | null;
  inerted: Array<{ element: HTMLElement; hadInert: boolean }>;
  onKeyDown: (event: KeyboardEvent) => void;
  onFocusIn: (event: FocusEvent) => void;
};

const scopes: ScopeRecord[] = [];
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'button',
  'iframe',
  '[tabindex]',
  '[contenteditable="true"]'
].join(', ');

function topScope(): ScopeRecord | null {
  const active = scopes.filter((scope) => !scope.paused);
  return active.length ? active[active.length - 1] : null;
}

function isFocusable(node: HTMLElement): boolean {
  if (node.hasAttribute('disabled')) return false;
  if (node.getAttribute('aria-hidden') === 'true') return false;
  if (node.hasAttribute('hidden')) return false;
  if (node.getAttribute('tabindex') === '-1') return false;
  return true;
}

function getFocusable(node: HTMLElement): HTMLElement[] {
  return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusable);
}

function ensureContainerFocusable(node: HTMLElement): void {
  if (!node.hasAttribute('tabindex')) {
    node.setAttribute('tabindex', '-1');
  }
}

function resolveFocusTarget(target: HTMLElement | (() => HTMLElement | null) | null | undefined): HTMLElement | null {
  if (typeof target === 'function') return target();
  return target ?? null;
}

function focusElement(target: HTMLElement | null): boolean {
  if (!target || !target.isConnected) return false;
  try {
    target.focus();
    return true;
  } catch {
    return false;
  }
}

function findSelectedFocusable(node: HTMLElement): HTMLElement | null {
  return (
    node.querySelector<HTMLElement>(
      '[aria-selected="true"], [data-selected="true"], [selected], [checked], [aria-current="true"]'
    ) || null
  );
}

function applyInertOthers(scope: ScopeRecord): void {
  if (!scope.options.inertOthers || typeof document === 'undefined' || !document.body) return;
  const bodyChildren = Array.from(document.body.children) as HTMLElement[];
  scope.inerted = bodyChildren
    .filter((element) => element !== scope.options.node && !element.contains(scope.options.node))
    .map((element) => {
      const hadInert = element.hasAttribute('inert');
      if (!hadInert) element.setAttribute('inert', '');
      return { element, hadInert };
    });
}

function restoreInertOthers(scope: ScopeRecord): void {
  scope.inerted.forEach(({ element, hadInert }) => {
    if (!hadInert) element.removeAttribute('inert');
  });
  scope.inerted = [];
}

export function createFocusScope(options: FocusScopeOptions): FocusScopeHandle {
  if (!(options.node instanceof HTMLElement)) {
    throw new Error('createFocusScope requires a valid HTMLElement node');
  }

  const scope: ScopeRecord = {
    id: Symbol('focus-scope'),
    options: {
      trapped: true,
      loop: true,
      restoreFocus: true,
      autoFocus: 'first',
      inertOthers: false,
      ...options
    },
    paused: false,
    previouslyFocused: document.activeElement instanceof HTMLElement ? document.activeElement : null,
    inerted: [],
    onKeyDown: () => {},
    onFocusIn: () => {}
  };

  const focusFirst = () => {
    const first = getFocusable(scope.options.node)[0] || null;
    if (focusElement(first)) return;
    ensureContainerFocusable(scope.options.node);
    focusElement(scope.options.node);
  };

  const focusLast = () => {
    const focusable = getFocusable(scope.options.node);
    const last = focusable.length ? focusable[focusable.length - 1] : null;
    if (focusElement(last)) return;
    ensureContainerFocusable(scope.options.node);
    focusElement(scope.options.node);
  };

  const focusInitial = () => {
    const explicit = resolveFocusTarget(scope.options.initialFocus);
    if (focusElement(explicit)) return;

    const autoFocus = scope.options.autoFocus;
    if (autoFocus === 'none') return;
    if (autoFocus === 'container') {
      ensureContainerFocusable(scope.options.node);
      focusElement(scope.options.node);
      return;
    }
    if (autoFocus === 'selected') {
      const selected = findSelectedFocusable(scope.options.node);
      if (focusElement(selected)) return;
    }
    focusFirst();
  };

  scope.onKeyDown = (event: KeyboardEvent) => {
    if (scope.paused) return;
    if (topScope()?.id !== scope.id) return;
    if (!scope.options.trapped) return;
    if (event.key !== 'Tab') return;

    const focusable = getFocusable(scope.options.node);
    if (!focusable.length) {
      event.preventDefault();
      focusInitial();
      return;
    }

    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!active || !scope.options.node.contains(active)) {
      event.preventDefault();
      focusInitial();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey) {
      if (active === first || active === scope.options.node) {
        event.preventDefault();
        if (scope.options.loop) focusElement(last);
      }
      return;
    }
    if (active === last) {
      event.preventDefault();
      if (scope.options.loop) focusElement(first);
    }
  };

  scope.onFocusIn = (event: FocusEvent) => {
    if (scope.paused) return;
    if (topScope()?.id !== scope.id) return;
    if (!scope.options.trapped) return;
    const target = event.target;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    if (path.includes(scope.options.node)) return;
    if (!(target instanceof Node)) return;
    if (scope.options.node.contains(target)) return;
    focusInitial();
  };

  scopes.push(scope);
  applyInertOthers(scope);
  document.addEventListener('keydown', scope.onKeyDown, true);
  document.addEventListener('focusin', scope.onFocusIn, true);
  focusInitial();

  return {
    destroy() {
      const index = scopes.findIndex((entry) => entry.id === scope.id);
      if (index >= 0) scopes.splice(index, 1);
      document.removeEventListener('keydown', scope.onKeyDown, true);
      document.removeEventListener('focusin', scope.onFocusIn, true);
      restoreInertOthers(scope);

      if (!scope.options.restoreFocus) return;
      const finalFocus = resolveFocusTarget(scope.options.finalFocus) || scope.previouslyFocused;
      focusElement(finalFocus);
    },
    focusFirst,
    focusLast,
    focusInitial,
    pause() {
      scope.paused = true;
    },
    resume() {
      scope.paused = false;
    }
  };
}
