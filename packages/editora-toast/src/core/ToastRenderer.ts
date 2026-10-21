// ToastRenderer - Handles DOM creation, rendering, and animations
import { ToastInstance, ToastPosition, ToastConfig, AnimationConfig } from './types';
import { setSafeHtml } from './safeHtml';
import { animationManager } from './AnimationUtils';
import { createCloseIcon, createLevelIcon } from './icons';
import { invalidateHeight, layoutStack } from './ToastStack';

type Timing = { remaining: number; startedAt: number };

export class ToastRenderer {
  private containers = new Map<ToastPosition, HTMLElement>();
  private config: ToastConfig;
  private cssInjected = false;
  private toastOf = new WeakMap<HTMLElement, ToastInstance>();
  // A toast's timer only runs while nothing holds it: hover, keyboard focus and a hidden window are separate
  // reasons, so leaving one of them does not restart a toast that another is still holding.
  private holds = new Map<string, Set<string>>();
  private timing = new Map<string, Timing>();
  private resizeTimer?: number;
  private returnFocusTo: HTMLElement | null = null;
  private globalListeners: Array<[EventTarget, string, EventListener]> = [];

  constructor(config: ToastConfig) {
    this.config = config;
  }

  updateConfig(config: ToastConfig): void {
    this.config = config;
    this.containers.forEach((container, position) => {
      this.applyContainerStyles(container, position);
      this.layout(container, true);
    });
  }

  // Ensure container exists for position
  ensureContainer(position: ToastPosition): HTMLElement {
    if (this.containers.has(position)) {
      return this.containers.get(position)!;
    }

    const container = document.createElement('div');
    container.className = `editora-toast-container editora-toast-${position.replace('-', '-')}`;
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Toast notifications');
    container.setAttribute('aria-live', 'polite');
    container.dataset.expand = String(this.config.expand);
    container.dataset.stack = String(this.config.stack);
    this.applyContainerStyles(container, position);
    this.attachContainerListeners(container);
    document.body.appendChild(container);
    this.containers.set(position, container);
    this.attachGlobalListeners();

    // Inject CSS if not already done
    this.injectCSS();

    return container;
  }

  // Hovering or focusing the stack opens it and holds the timers; leaving closes it and lets them run on.
  private attachContainerListeners(container: HTMLElement): void {
    container.addEventListener('mouseenter', () => {
      container.dataset.hover = 'true';
      this.holdAll(container, 'pointer');
      this.syncOpen(container);
    });
    container.addEventListener('mouseleave', () => {
      delete container.dataset.hover;
      this.releaseAll(container, 'pointer');
      this.syncOpen(container);
    });
    container.addEventListener('focusin', (event) => {
      // A mouse click focuses the toast too; only keyboard focus should hold it open.
      if (!this.isKeyboardFocus(event.target)) return;
      container.dataset.focus = 'true';
      this.holdAll(container, 'focus');
      this.syncOpen(container);
    });
    container.addEventListener('focusout', (event) => {
      const next = (event as FocusEvent).relatedTarget as Node | null;
      if (next && container.contains(next)) return;
      delete container.dataset.focus;
      this.releaseAll(container, 'focus');
      this.syncOpen(container);
    });
    container.addEventListener('keydown', (event) => this.onContainerKey(container, event));
  }

  private syncOpen(container: HTMLElement): void {
    const open = container.dataset.hover === 'true' || container.dataset.focus === 'true';
    container.dataset.open = String(open);
    this.layout(container);
  }

  private isKeyboardFocus(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;
    try {
      return target.matches(':focus-visible');
    } catch {
      return true; // an engine without :focus-visible: treat focus as keyboard focus
    }
  }

  private onContainerKey(container: HTMLElement, event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.editora-toast') : null;
    const toast = target ? this.toastOf.get(target) : undefined;
    if (!target || !toast) return;
    event.preventDefault();
    const siblings = Array.from(container.querySelectorAll<HTMLElement>('.editora-toast:not(.hiding)'));
    const next = siblings[siblings.indexOf(target) + 1] || siblings[siblings.indexOf(target) - 1];
    toast.dismiss();
    if (next && next !== target) next.focus();
    else this.restoreFocus();
  }

  private restoreFocus(): void {
    const target = this.returnFocusTo;
    this.returnFocusTo = null;
    if (target && target.isConnected) target.focus();
  }

  // Document level behaviour: the hotkey that jumps to the toasts, a tap outside that closes an open stack, and
  // a resize that can change how much the text of a toast wraps.
  private attachGlobalListeners(): void {
    if (this.globalListeners.length > 0 || typeof window === 'undefined') return;
    const add = (target: EventTarget, type: string, handler: EventListener) => {
      target.addEventListener(type, handler);
      this.globalListeners.push([target, type, handler]);
    };

    add(document, 'keydown', ((event: KeyboardEvent) => {
      if (!this.matchesHotkey(event)) return;
      const container = Array.from(this.containers.values()).find((c) => c.querySelector('.editora-toast:not(.hiding)'));
      if (!container) return;
      const front = container.querySelector<HTMLElement>('.editora-toast[data-front="true"]');
      if (!front) return;
      event.preventDefault();
      const active = document.activeElement;
      if (active instanceof HTMLElement && !container.contains(active)) this.returnFocusTo = active;
      front.focus();
    }) as EventListener);

    add(document, 'pointerdown', ((event: PointerEvent) => {
      this.containers.forEach((container) => {
        if (container.dataset.hover === 'true' && !container.contains(event.target as Node)) {
          delete container.dataset.hover;
          this.releaseAll(container, 'pointer');
          this.syncOpen(container);
        }
      });
    }) as EventListener);

    add(window, 'resize', (() => {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => this.containers.forEach((container) => this.layout(container, true)), 120);
    }) as EventListener);
  }

  private matchesHotkey(event: KeyboardEvent): boolean {
    const hotkey = this.config.hotkey;
    if (!hotkey) return false;
    const parts = hotkey.toLowerCase().split('+').map((part) => part.trim()).filter(Boolean);
    const key = parts.pop();
    if (!key) return false;
    const want = (name: string) => parts.includes(name);
    if (event.altKey !== want('alt') || event.shiftKey !== want('shift')) return false;
    if (event.ctrlKey !== want('ctrl') || event.metaKey !== (want('meta') || want('cmd'))) return false;
    // `code` first: on a Mac, Alt+T types a symbol, so `key` is no use.
    return event.code.toLowerCase() === `key${key}` || event.code.toLowerCase() === key || event.key.toLowerCase() === key;
  }

  private layout(container: HTMLElement, remeasure = false): void {
    layoutStack(container, { stack: this.config.stack, expand: this.config.expand, gap: this.toPx(this.config.gap) }, remeasure);
  }

  private toPx(value: number | string | undefined): number {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value || '');
    return Number.isFinite(parsed) ? parsed : 8;
  }

  // Timer holds
  holdAll(container: HTMLElement, reason: string): void {
    container.querySelectorAll<HTMLElement>('.editora-toast').forEach((element) => {
      const toast = this.toastOf.get(element);
      if (!toast) return;
      const wants = reason === 'focus' ? toast.options.pauseOnFocus : toast.options.pauseOnHover;
      if (wants !== false) this.pauseToast(toast, reason);
    });
  }

  releaseAll(container: HTMLElement, reason: string): void {
    container.querySelectorAll<HTMLElement>('.editora-toast').forEach((element) => {
      const toast = this.toastOf.get(element);
      if (toast) this.resumeToast(toast, reason);
    });
  }

  // Create toast element
  createToastElement(toast: ToastInstance): HTMLElement {
    const options = toast.options;
    const element = document.createElement('div');

    element.className = `editora-toast editora-toast-${options.level || 'info'}`;
    element.dataset.level = options.level || 'info';
    if (options.customClass) {
      options.customClass.split(/\s+/).filter(Boolean).forEach(className => element.classList.add(className));
    }

    element.setAttribute('role', options.role || (options.level === 'error' ? 'alert' : 'status'));
    element.setAttribute('aria-atomic', 'true');
    // Focusable so the keyboard can reach a toast (and its buttons) before it goes away.
    element.tabIndex = 0;
    if (options.closable || options.closeButton) element.dataset.closable = 'true';
    this.toastOf.set(element, toast);
    if (options.ariaLive && options.ariaLive !== 'off') {
      element.setAttribute('aria-live', options.ariaLive);
    }

    // Apply theme to individual toast
    const theme = options.theme || this.config.theme;
    if (theme && theme !== 'system') {
      element.setAttribute('data-theme', theme);
    }

    if (this.config.richColors || theme === 'colored') {
      element.setAttribute('data-rich-colors', 'true');
    }

    // Apply RTL support
    const rtl = options.rtl !== undefined ? options.rtl : this.config.rtl;
    if (rtl) {
      element.setAttribute('data-rtl', 'true');
      element.setAttribute('dir', 'rtl');
    }

    const content = this.createContent(toast);

    // Progress bar
    if (options.progress) {
      const progress = document.createElement('div');
      progress.className = 'editora-toast-progress-track';
      progress.setAttribute('role', 'progressbar');
      progress.setAttribute('aria-valuemin', '0');
      progress.setAttribute('aria-valuemax', '100');
      progress.setAttribute('aria-valuenow', String(Math.min(100, Math.max(0, options.progress.value))));

      const bar = document.createElement('div');
      bar.className = 'editora-toast-progress-bar';
      bar.style.width = `${Math.min(100, Math.max(0, options.progress.value))}%`;

      if (options.progress.showPercentage) {
        const percentage = document.createElement('span');
        percentage.className = 'editora-toast-progress-text';
        percentage.textContent = `${Math.round(options.progress.value)}%`;
        progress.appendChild(percentage);
      }

      progress.appendChild(bar);
      content.appendChild(progress);
    }

    element.appendChild(content);

    // Actions
    if (options.actions && options.actions.length > 0) {
      const actions = document.createElement('div');
      actions.className = 'editora-toast-actions';

      options.actions.forEach(action => actions.appendChild(this.createActionButton(action, toast)));

      element.appendChild(actions);
    }

    // Close button
    if (options.closable || options.closeButton) {
      element.appendChild(this.createCloseButton(toast));
    }

    // Hover and focus are handled by the container (the whole stack holds together); see attachContainerListeners.

    if (options.swipeDismiss) {
      this.addSwipeDismiss(element, toast);
    }

    if (options.dragDismiss) {
      this.addDragDismiss(element, toast);
    }

    return element;
  }

  // Show toast with animation
  async showToast(toast: ToastInstance): Promise<void> {
    const container = this.ensureContainer(toast.options.position || this.config.position);
    const element = this.createToastElement(toast);

    toast.element = element;
    container.appendChild(element);
    // A toast that arrives while the stack is held open is held with it.
    if (container.dataset.hover === 'true' && toast.options.pauseOnHover !== false) this.pauseToast(toast, 'pointer');
    if (container.dataset.focus === 'true' && toast.options.pauseOnFocus !== false) this.pauseToast(toast, 'focus');
    this.layout(container);

    // Get animation config (toast-specific or global default)
    const animation = toast.options.animation || this.config.animation || { type: 'css' };

    // Use animation manager for showing
    await animationManager.showToast(element, toast, animation);

    // Accessibility announcement
    if (this.config.enableAccessibility) {
      this.announceToast(toast);
    }

    // Call onShow callback
    toast.options.onShow?.();

    // Auto-dismiss if not persistent
    this.startTimer(toast);
  }

  // Hide toast with animation
  async hideToast(toast: ToastInstance): Promise<void> {
    if (!toast.element) return;

    this.stopTimer(toast);
    this.holds.delete(toast.id);

    // Leave the layout now so the other toasts close the gap while this one animates out.
    const leaving = toast.element;
    leaving.dataset.leaving = 'true';
    if (leaving.parentElement) this.layout(leaving.parentElement);

    // Get animation config
    const animation = toast.options.animation || this.config.animation || { type: 'css' };

    // Use animation manager for hiding
    await animationManager.hideToast(leaving, toast, animation);

    // Remove element after animation
    if (toast.element && toast.element.parentNode) {
      const parent = toast.element.parentElement;
      toast.element.parentNode.removeChild(toast.element);
      toast.element = undefined;
      if (parent) {
        if (!parent.querySelector('.editora-toast')) {
          delete parent.dataset.hover;
          delete parent.dataset.focus;
          parent.dataset.open = 'false';
        }
        this.layout(parent);
      }
    }

    // Call onHide callback
    toast.options.onHide?.();
  }

  // Update toast content
  async updateToast(toast: ToastInstance, updates: Partial<ToastInstance['options']>): Promise<void> {
    if (!toast.element) return;

    // Get animation config
    const animation = toast.options.animation || this.config.animation || { type: 'css' };

    // Handle custom animation updates
    if (animation.type === 'custom' && (animation as any).update) {
      await animationManager.updateToast(toast.element, toast, updates, animation);
      return;
    }

    // Update the toast options
    Object.assign(toast.options, updates);

    // Update classes for level changes
    if (updates.level) {
      // Remove old level classes
      toast.element.className = toast.element.className.replace(/editora-toast-(info|success|error|warning|loading|progress|promise|custom)/g, '');
      // Add new level class
      toast.element.classList.add(`editora-toast-${updates.level}`);
      toast.element.dataset.level = updates.level;
    }

    if (updates.title !== undefined || updates.description !== undefined || updates.message !== undefined || updates.icon !== undefined || updates.level !== undefined || updates.render) {
      const contentElement = toast.element.querySelector('.editora-toast-content');
      const nextContent = this.createContent(toast);
      contentElement?.replaceWith(nextContent);
    }

    // Add or remove the close button when it is toggled. `closeButton` is the alias and wins, as in show().
    const nextClosable = updates.closeButton ?? updates.closable;
    if (nextClosable !== undefined) {
      toast.options.closable = nextClosable;
      toast.options.closeButton = nextClosable;
      if (nextClosable) toast.element.dataset.closable = 'true';
      else delete toast.element.dataset.closable;
      const existing = toast.element.querySelector('.editora-toast-close');
      if (nextClosable && !existing) toast.element.appendChild(this.createCloseButton(toast));
      else if (!nextClosable && existing) existing.remove();
    }

    // Update progress bar
    if (updates.progress !== undefined) {
      let progressElement = toast.element.querySelector('.editora-toast-progress-track');
      if (updates.progress) {
        if (!progressElement) {
          // Create progress element if it doesn't exist
          progressElement = document.createElement('div');
          progressElement.className = 'editora-toast-progress-track';
          progressElement.setAttribute('role', 'progressbar');
          progressElement.setAttribute('aria-valuemin', '0');
          progressElement.setAttribute('aria-valuemax', '100');
          const contentElement = toast.element.querySelector('.editora-toast-content');
          if (contentElement) {
            contentElement.appendChild(progressElement);
          }
        }

        progressElement.setAttribute('aria-valuenow', String(Math.min(100, Math.max(0, updates.progress.value))));

        const bar = progressElement.querySelector('.editora-toast-progress-bar') as HTMLElement;
        if (bar) {
          bar.style.width = `${Math.min(100, Math.max(0, updates.progress.value))}%`;
        }

        if (updates.progress.showPercentage) {
          let percentage = progressElement.querySelector('.editora-toast-progress-text');
          if (!percentage) {
            percentage = document.createElement('span');
            percentage.className = 'editora-toast-progress-text';
            progressElement.insertBefore(percentage, progressElement.firstChild);
          }
          percentage.textContent = `${Math.round(updates.progress.value)}%`;
        } else {
          const percentage = progressElement.querySelector('.editora-toast-progress-text');
          if (percentage) {
            percentage.remove();
          }
        }
      } else if (progressElement) {
        // Remove progress element if progress is disabled
        progressElement.remove();
      }
    }

    // Update actions
    if (updates.actions !== undefined || updates.action !== undefined || updates.cancel !== undefined) {
      let actionsElement = toast.element.querySelector('.editora-toast-actions');
      const nextActions = toast.options.actions || [];
      if (nextActions.length > 0) {
        if (!actionsElement) {
          actionsElement = document.createElement('div');
          actionsElement.className = 'editora-toast-actions';
          toast.element.appendChild(actionsElement);
        } else {
          actionsElement.innerHTML = '';
        }

        if (actionsElement) {
          nextActions.forEach(action => actionsElement!.appendChild(this.createActionButton(action, toast)));
        }
      } else if (actionsElement) {
        actionsElement.remove();
      }
    }

    if (updates.duration !== undefined || updates.persistent !== undefined || updates.level !== undefined) {
      this.startTimer(toast);
    }

    // The content may be taller or shorter now.
    toast.element.style.height = '';
    invalidateHeight(toast.element);
    if (toast.element.parentElement) this.layout(toast.element.parentElement);

    // Call onUpdate callback
    toast.options.onUpdate?.(updates);
  }

  private createContent(toast: ToastInstance): HTMLElement {
    const options = toast.options;
    const content = document.createElement('div');
    content.className = 'editora-toast-content';

    const icon = this.createIcon(toast);
    if (icon) content.appendChild(icon);

    const body = document.createElement('div');
    body.className = 'editora-toast-body';

    if (options.render) {
      body.appendChild(options.render(toast));
    } else {
      if (options.title) {
        const title = document.createElement('div');
        title.className = 'editora-toast-title';
        title.textContent = options.title;
        body.appendChild(title);
      }

      if (options.message) {
        const message = document.createElement('div');
        message.className = 'editora-toast-message';
        if (options.html) {
          setSafeHtml(message, options.message);
        } else {
          message.textContent = options.message;
        }
        body.appendChild(message);
      }

      if (options.description) {
        const description = document.createElement('div');
        description.className = 'editora-toast-description';
        description.textContent = options.description;
        body.appendChild(description);
      }
    }

    content.appendChild(body);
    return content;
  }

  private createCloseButton(toast: ToastInstance): HTMLButtonElement {
    const close = document.createElement('button');
    close.className = 'editora-toast-close';
    close.setAttribute('type', 'button');
    close.setAttribute('aria-label', 'Close notification');
    close.appendChild(createCloseIcon());
    close.onclick = () => toast.dismiss();
    return close;
  }

  // The icon is the caller's own (text, emoji or a node), false for none, or else the built-in one of the level.
  private createIcon(toast: ToastInstance): HTMLElement | null {
    const options = toast.options;
    if (options.icon === false) return null;

    const wrapper = document.createElement('span');
    wrapper.className = 'editora-toast-icon';
    wrapper.setAttribute('aria-hidden', 'true');

    if (typeof options.icon === 'string' && options.icon) {
      wrapper.textContent = options.icon;
      return wrapper;
    }
    if (options.icon && typeof options.icon === 'object') {
      wrapper.appendChild(options.icon);
      return wrapper;
    }

    if (this.config.icons === false) return null;
    const level = options.level || 'info';
    const svg = createLevelIcon(level);
    if (!svg) return null;
    if (level === 'loading' || level === 'promise') wrapper.dataset.spin = 'true';
    wrapper.appendChild(svg);
    return wrapper;
  }

  private createActionButton(action: NonNullable<ToastInstance['options']['actions']>[number], toast: ToastInstance): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = `editora-toast-action ${action.primary ? 'primary' : ''}`;
    button.textContent = action.label;
    if (action.altText) {
      button.setAttribute('aria-label', action.altText);
    }
    button.onclick = (e) => {
      e.stopPropagation();
      action.onClick();
      if (action.dismissOnClick !== false) {
        toast.dismiss();
      }
    };
    return button;
  }

  private applyContainerStyles(container: HTMLElement, position: ToastPosition): void {
    const offset = this.toCssLength(this.config.offset);
    const mobileOffset = this.toCssLength(this.config.mobileOffset);
    const gap = this.toCssLength(this.config.gap);

    container.dataset.position = position;
    container.dataset.edge = position.startsWith('bottom') ? 'bottom' : 'top';
    container.dataset.expand = String(this.config.expand);
    container.dataset.stack = String(this.config.stack);
    container.style.setProperty('--editora-toast-offset', offset);
    container.style.setProperty('--editora-toast-mobile-offset', mobileOffset);
    container.style.setProperty('--editora-toast-gap', gap);
    container.style.setProperty('--et-edge', position.startsWith('bottom') ? '1' : '-1');

    // The toasts are placed inside the container (see ToastStack), which only needs its corner and width.
    const styles: Partial<CSSStyleDeclaration> = {
      position: 'fixed',
      zIndex: (this.config.zIndex || 2147483647).toString(),
      display: 'block',
      width: 'var(--et-width, 360px)',
      maxWidth: `calc(100vw - 2 * ${offset})`,
      boxSizing: 'border-box',
      top: '',
      right: '',
      bottom: '',
      left: '',
      transform: ''
    };

    switch (position) {
      case 'top-left':
        styles.top = `max(${offset}, env(safe-area-inset-top))`;
        styles.left = `max(${offset}, env(safe-area-inset-left))`;
        break;
      case 'top-center':
        styles.top = `max(${offset}, env(safe-area-inset-top))`;
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        break;
      case 'top-right':
        styles.top = `max(${offset}, env(safe-area-inset-top))`;
        styles.right = `max(${offset}, env(safe-area-inset-right))`;
        break;
      case 'bottom-left':
        styles.bottom = `max(${offset}, env(safe-area-inset-bottom))`;
        styles.left = `max(${offset}, env(safe-area-inset-left))`;
        break;
      case 'bottom-center':
        styles.bottom = `max(${offset}, env(safe-area-inset-bottom))`;
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        break;
      case 'bottom-right':
        styles.bottom = `max(${offset}, env(safe-area-inset-bottom))`;
        styles.right = `max(${offset}, env(safe-area-inset-right))`;
        break;
      case 'center':
        styles.top = '50%';
        styles.left = '50%';
        styles.transform = 'translate(-50%, -50%)';
        break;
    }

    Object.assign(container.style, styles);
    container.style.setProperty('--editora-toast-mobile-left', mobileOffset);
  }

  private toCssLength(value: number | string | undefined): string {
    if (typeof value === 'number') return `${value}px`;
    return value || '16px';
  }

  // Auto-dismiss timer. It keeps the time that is left, so pausing a toast and letting go does not give it a
  // fresh full duration.
  private startTimer(toast: ToastInstance): void {
    this.stopTimer(toast);
    if (toast.options.persistent || toast.options.duration === 0) {
      this.timing.delete(toast.id);
      return;
    }
    this.arm(toast, toast.options.duration || this.config.duration);
  }

  private arm(toast: ToastInstance, ms: number): void {
    this.timing.set(toast.id, { remaining: ms, startedAt: Date.now() });
    if ((this.holds.get(toast.id)?.size || 0) > 0) return; // held: it starts when the last hold is released
    toast.timeoutId = window.setTimeout(() => {
      toast.timeoutId = undefined;
      toast.dismiss();
    }, ms);
  }

  private stopTimer(toast: ToastInstance): void {
    if (toast.timeoutId) {
      clearTimeout(toast.timeoutId);
      toast.timeoutId = undefined;
    }
  }

  pauseToast(toast: ToastInstance, reason = 'hover'): void {
    const reasons = this.holds.get(toast.id) || new Set<string>();
    this.holds.set(toast.id, reasons);
    if (reasons.size === 0 && toast.timeoutId) {
      const timing = this.timing.get(toast.id);
      this.stopTimer(toast);
      if (timing) timing.remaining = Math.max(0, timing.remaining - (Date.now() - timing.startedAt));
    }
    reasons.add(reason);
  }

  resumeToast(toast: ToastInstance, reason = 'hover'): void {
    const reasons = this.holds.get(toast.id);
    if (!reasons || !reasons.delete(reason) || reasons.size > 0) return;
    this.holds.delete(toast.id);
    const timing = this.timing.get(toast.id);
    if (timing && !toast.timeoutId && !toast.options.persistent && toast.options.duration !== 0) {
      this.arm(toast, timing.remaining);
    }
  }

  // Swipe dismiss with directional control
  private addSwipeDismiss(element: HTMLElement, toast: ToastInstance): void {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    const swipeDirection = toast.options.swipeDirection || this.config.swipeDirection || 'any';
    const minSwipeDistance = 40; // Reduced from 50 to make vertical swipes easier
    let originalTransform = '';
    let hasMoved = false;

    // Controls inside the toast own their own presses.
    const interactiveSelector = 'button, a[href], input, select, textarea, label, summary, [role="button"], [contenteditable="true"]';

    const resetDragStyles = () => {
      element.style.transform = originalTransform;
      element.style.transition = '';
      element.style.cursor = '';
      element.style.userSelect = '';
    };

    const pointOf = (e: TouchEvent | MouseEvent, ended: boolean): { x: number; y: number } | null => {
      if ('changedTouches' in e || 'touches' in e) {
        const list = ended ? (e as TouchEvent).changedTouches : (e as TouchEvent).touches;
        const point = list && list[0];
        return point ? { x: point.clientX, y: point.clientY } : null;
      }
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    };

    const handleStart = (e: TouchEvent | MouseEvent) => {
      // Cancelling a press (or starting a drag from a button) is what made the action and close
      // buttons dead on touch screens: the browser derives the click from the touch sequence, so
      // preventDefault() on touchstart swallowed it. It also kept buttons from taking focus on a
      // mouse press and made the toast text unselectable. Presses are left alone; a drag only
      // takes over once the pointer has actually moved.
      const target = e.target;
      if (target instanceof Element && element.contains(target) && target.closest(interactiveSelector)) return;
      if ('button' in e && e.button !== 0) return;

      const point = pointOf(e, false);
      if (!point) return;
      isDragging = true;
      hasMoved = false;
      startX = point.x;
      startY = point.y;
      originalTransform = element.style.transform || '';
    };

    const handleMove = (e: TouchEvent | MouseEvent) => {
      if (!isDragging) return;

      const point = pointOf(e, false);
      if (!point) return;
      const deltaX = point.x - startX;
      const deltaY = point.y - startY;

      // Only take over once we've moved more than a small threshold
      const moveThreshold = 5;
      if (!hasMoved && (Math.abs(deltaX) > moveThreshold || Math.abs(deltaY) > moveThreshold)) {
        hasMoved = true;
        element.style.transition = 'none'; // Disable transitions during drag
        element.style.cursor = 'grabbing';
        element.style.userSelect = 'none';
        window.getSelection?.()?.removeAllRanges();
      }

      if (hasMoved) {
        // Add visual feedback by slightly moving the element
        // Allow more movement for vertical swipes to make them feel more responsive
        const maxMove = Math.abs(deltaY) > Math.abs(deltaX) ? 25 : 20; // More movement for vertical
        const moveX = Math.min(Math.max(deltaX * 0.2, -maxMove), maxMove);
        const moveY = Math.min(Math.max(deltaY * 0.2, -maxMove), maxMove);
        element.style.transform = `${originalTransform} translate(${moveX}px, ${moveY}px)`;
        // The gesture is ours now: keep it from also scrolling or selecting.
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleEnd = (e: TouchEvent | MouseEvent) => {
      if (!isDragging) return;
      isDragging = false;

      const dragged = hasMoved;
      resetDragStyles();
      if (!dragged) return;

      const point = pointOf(e, true);
      if (!point) return;
      const deltaX = point.x - startX;
      const deltaY = point.y - startY;

      // Check if swipe meets direction and distance requirements
      let shouldDismiss = false;
      const isVerticalSwipe = swipeDirection === 'vertical' || swipeDirection === 'up' || swipeDirection === 'down';
      const effectiveMinDistance = isVerticalSwipe ? 35 : minSwipeDistance; // Easier vertical swipes

      switch (swipeDirection) {
        case 'any':
          shouldDismiss = Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance;
          break;
        case 'horizontal':
          shouldDismiss = Math.abs(deltaX) > minSwipeDistance;
          break;
        case 'vertical':
          shouldDismiss = Math.abs(deltaY) > effectiveMinDistance;
          break;
        case 'left':
          shouldDismiss = deltaX < -minSwipeDistance;
          break;
        case 'right':
          shouldDismiss = deltaX > minSwipeDistance;
          break;
        case 'up':
          shouldDismiss = deltaY < -effectiveMinDistance;
          break;
        case 'down':
          shouldDismiss = deltaY > effectiveMinDistance;
          break;
      }

      if (shouldDismiss) {
        toast.dismiss();
      }
    };

    // The browser took the gesture over (scroll, system gesture, incoming call): forget it
    // instead of leaving the toast stuck mid-drag and answering the next stray touchmove.
    const handleCancel = () => {
      if (!isDragging) return;
      isDragging = false;
      hasMoved = false;
      resetDragStyles();
    };

    // Prevent default drag behavior
    element.addEventListener('dragstart', (e) => e.preventDefault());

    // Touch events (touchstart no longer cancels, so it can be passive)
    element.addEventListener('touchstart', handleStart, { passive: true });
    element.addEventListener('touchmove', handleMove, { passive: false });
    element.addEventListener('touchend', handleEnd);
    element.addEventListener('touchcancel', handleCancel);

    // Mouse events
    element.addEventListener('mousedown', handleStart);
    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseup', handleEnd);
    element.addEventListener('mouseleave', handleEnd); // Handle mouse leaving element
  }

  // Drag dismiss (simplified)
  private addDragDismiss(element: HTMLElement, toast: ToastInstance): void {
    // Similar to swipe but with mouse only
    this.addSwipeDismiss(element, toast);
  }

  // Accessibility
  private announceToast(toast: ToastInstance): void {
    if (toast.options.ariaLive === 'off') return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', toast.options.ariaLive || (toast.options.level === 'error' ? 'assertive' : 'polite'));
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    const text = [toast.options.title, toast.options.message, toast.options.description].filter(Boolean).join('. ');
    announcement.textContent = `${toast.options.level || 'info'}: ${text}`;

    document.body.appendChild(announcement);

    setTimeout(() => {
      // remove() instead of body.removeChild(): an app that already replaced the body (SPA teardown, tests)
      // made removeChild throw "node to be removed is not a child" from this timer.
      announcement.remove();
    }, 1000);
  }

  // Inject CSS
  private injectCSS(): void {
    if (this.cssInjected || typeof document === 'undefined') return;

    // Try to find existing CSS
    const existing = Array.from(document.styleSheets).find(s =>
      (s.ownerNode as any)?.href?.includes('toast.css') ||
      (s.ownerNode as any)?.textContent?.includes('editora-toast')
    );

    if (!existing) {
      const style = document.createElement('style');
      style.setAttribute('data-editora-toast-fallback', 'true');
      // Enough to lay the toasts out and show them when toast.css was not loaded; the real look is in toast.css.
      style.textContent = '.editora-toast-container{position:fixed;width:360px;max-width:100vw;box-sizing:border-box}.editora-toast{position:absolute;left:0;width:100%;box-sizing:border-box;padding:12px 14px;background:#fff;color:#111;border:1px solid #ddd;border-radius:12px;font:13px/1.45 system-ui,sans-serif;overflow:hidden;pointer-events:auto;opacity:0;translate:0 var(--et-y,0px);scale:var(--et-s,1);transition:opacity .2s,translate .3s,scale .3s,height .3s}.editora-toast-container[data-edge=bottom] .editora-toast{bottom:0}.editora-toast-container[data-edge=top] .editora-toast{top:0}.editora-toast.show{opacity:1}.editora-toast.hiding,.editora-toast[data-hidden=true]{opacity:0}';
      document.head.appendChild(style);
    }

    this.cssInjected = true;
  }

  // Cleanup
  destroy(): void {
    this.globalListeners.forEach(([target, type, handler]) => target.removeEventListener(type, handler));
    this.globalListeners = [];
    window.clearTimeout(this.resizeTimer);
    this.containers.forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
    this.containers.clear();
  }
}
