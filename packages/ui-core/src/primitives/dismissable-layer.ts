export type DismissableLayerReason =
  | 'outside-pointer'
  | 'outside-focus'
  | 'escape-key'
  | 'programmatic'
  | 'ancestor-closed';

export interface DismissableLayerOptions {
  node: HTMLElement;
  trigger?: HTMLElement | null;
  modal?: boolean;
  closeOnEscape?: boolean;
  closeOnPointerOutside?: boolean;
  closeOnFocusOutside?: boolean;
  disableOutsidePointerEvents?: boolean;
  parentLayer?: HTMLElement | null;
  onBeforeDismiss?: (reason: DismissableLayerReason, event?: Event) => boolean | void;
  onDismiss?: (reason: DismissableLayerReason, event?: Event) => void;
}

export interface DismissableLayerHandle {
  destroy(): void;
  pause(): void;
  resume(): void;
  contains(target: Node | null): boolean;
  dismiss(reason?: DismissableLayerReason): void;
}

type LayerRecord = {
  id: symbol;
  options: DismissableLayerOptions;
  paused: boolean;
  prevNodePointerEvents?: string;
  prevTriggerPointerEvents?: string;
};

const layers: LayerRecord[] = [];
let listenersAttached = false;
let bodyPointerEventsBeforeLock: string | null = null;

function isNode(value: unknown): value is Node {
  return !!value && typeof (value as Node).nodeType === 'number';
}

function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

function activeLayers(): LayerRecord[] {
  return layers.filter((layer) => !layer.paused);
}

function topLayer(): LayerRecord | null {
  const active = activeLayers();
  return active.length ? active[active.length - 1] : null;
}

function pathIncludes(path: EventTarget[], element: HTMLElement | null | undefined): boolean {
  if (!element) return false;
  return path.includes(element);
}

function elementContains(element: HTMLElement | null | undefined, target: Node | null): boolean {
  if (!element || !target) return false;
  return element === target || element.contains(target);
}

function layerContains(layer: LayerRecord, target: Node | null, path: EventTarget[] = []): boolean {
  if (elementContains(layer.options.node, target)) return true;
  if (elementContains(layer.options.trigger ?? null, target)) return true;
  if (pathIncludes(path, layer.options.node)) return true;
  if (pathIncludes(path, layer.options.trigger ?? null)) return true;
  return false;
}

function restorePointerEvents(layer: LayerRecord): void {
  if (typeof layer.prevNodePointerEvents === 'string') {
    layer.options.node.style.pointerEvents = layer.prevNodePointerEvents;
    layer.prevNodePointerEvents = undefined;
  }
  const trigger = layer.options.trigger;
  if (trigger && typeof layer.prevTriggerPointerEvents === 'string') {
    trigger.style.pointerEvents = layer.prevTriggerPointerEvents;
    layer.prevTriggerPointerEvents = undefined;
  }
}

function syncBodyPointerLock(): void {
  if (typeof document === 'undefined' || !document.body) return;
  const lockedLayers = activeLayers().filter((layer) => layer.options.disableOutsidePointerEvents);

  if (!lockedLayers.length) {
    document.body.removeAttribute('data-ui-dismissable-lock');
    if (bodyPointerEventsBeforeLock !== null) {
      document.body.style.pointerEvents = bodyPointerEventsBeforeLock;
      bodyPointerEventsBeforeLock = null;
    }
    layers.forEach(restorePointerEvents);
    return;
  }

  if (bodyPointerEventsBeforeLock === null) {
    bodyPointerEventsBeforeLock = document.body.style.pointerEvents || '';
  }
  document.body.setAttribute('data-ui-dismissable-lock', '');
  document.body.style.pointerEvents = 'none';

  layers.forEach((layer) => {
    const shouldUnlock = !layer.paused && !!layer.options.disableOutsidePointerEvents;
    if (!shouldUnlock) {
      restorePointerEvents(layer);
      return;
    }
    if (typeof layer.prevNodePointerEvents !== 'string') {
      layer.prevNodePointerEvents = layer.options.node.style.pointerEvents || '';
    }
    layer.options.node.style.pointerEvents = 'auto';

    const trigger = layer.options.trigger;
    if (trigger) {
      if (typeof layer.prevTriggerPointerEvents !== 'string') {
        layer.prevTriggerPointerEvents = trigger.style.pointerEvents || '';
      }
      trigger.style.pointerEvents = 'auto';
    }
  });
}

function attachListeners(): void {
  if (listenersAttached || typeof document === 'undefined') return;
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
  document.addEventListener('focusin', onDocumentFocusIn, true);
  document.addEventListener('keydown', onDocumentKeyDown, true);
  listenersAttached = true;
}

function detachListeners(): void {
  if (!listenersAttached || typeof document === 'undefined') return;
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
  document.removeEventListener('focusin', onDocumentFocusIn, true);
  document.removeEventListener('keydown', onDocumentKeyDown, true);
  listenersAttached = false;
}

function ensureListeners(): void {
  if (layers.length) attachListeners();
  else detachListeners();
}

function dismissLayer(layer: LayerRecord, reason: DismissableLayerReason, event?: Event): void {
  if (layer.paused) return;
  const allow = layer.options.onBeforeDismiss?.(reason, event);
  if (allow === false) return;
  layer.options.onDismiss?.(reason, event);
}

function onDocumentPointerDown(event: PointerEvent): void {
  const layer = topLayer();
  if (!layer) return;
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
  const target = isNode(event.target) ? event.target : null;
  if (layerContains(layer, target, path)) return;
  if (layer.options.closeOnPointerOutside === false) return;
  dismissLayer(layer, 'outside-pointer', event);
}

function onDocumentFocusIn(event: FocusEvent): void {
  const layer = topLayer();
  if (!layer) return;
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
  const target = isNode(event.target) ? event.target : null;
  if (layerContains(layer, target, path)) return;
  if (layer.options.closeOnFocusOutside === false) return;
  dismissLayer(layer, 'outside-focus', event);
}

function onDocumentKeyDown(event: KeyboardEvent): void {
  const layer = topLayer();
  if (!layer) return;
  if (event.key !== 'Escape') return;
  if (layer.options.closeOnEscape === false) return;
  dismissLayer(layer, 'escape-key', event);
}

export function createDismissableLayer(options: DismissableLayerOptions): DismissableLayerHandle {
  if (!isHTMLElement(options.node)) {
    throw new Error('createDismissableLayer requires a valid HTMLElement node');
  }

  const record: LayerRecord = {
    id: Symbol('dismissable-layer'),
    options: {
      closeOnEscape: true,
      closeOnPointerOutside: true,
      closeOnFocusOutside: false,
      ...options
    },
    paused: false
  };

  layers.push(record);
  ensureListeners();
  syncBodyPointerLock();

  return {
    destroy() {
      const index = layers.findIndex((layer) => layer.id === record.id);
      if (index >= 0) layers.splice(index, 1);
      restorePointerEvents(record);
      ensureListeners();
      syncBodyPointerLock();
    },
    pause() {
      record.paused = true;
      syncBodyPointerLock();
    },
    resume() {
      record.paused = false;
      syncBodyPointerLock();
    },
    contains(target: Node | null) {
      return layerContains(record, target);
    },
    dismiss(reason = 'programmatic') {
      dismissLayer(record, reason);
    }
  };
}
