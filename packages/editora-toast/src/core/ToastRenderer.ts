// ToastRenderer - Handles DOM creation, rendering, and animations
import { ToastInstance, ToastPosition, ToastConfig, AnimationConfig } from './types';
import { animationManager } from './AnimationUtils';

export class ToastRenderer {
  private containers = new Map<ToastPosition, HTMLElement>();
  private config: ToastConfig;
  private cssInjected = false;

  constructor(config: ToastConfig) {
    this.config = config;
  }

  updateConfig(config: ToastConfig): void {
    this.config = config;
    this.containers.forEach((container, position) => {
      this.applyContainerStyles(container, position);
      this.applyStackState(container);
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
    document.body.appendChild(container);
    this.containers.set(position, container);

    // Inject CSS if not already done
    this.injectCSS();

    return container;
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
      const close = document.createElement('button');
      close.className = 'editora-toast-close';
      close.setAttribute('aria-label', 'Close notification');
      close.textContent = '×';
      close.onclick = () => toast.dismiss();
      element.appendChild(close);
    }

    // Interactive features
    if (options.pauseOnHover) {
      element.addEventListener('mouseenter', () => this.pauseToast(toast));
      element.addEventListener('mouseleave', () => this.resumeToast(toast));
    }

    if (options.pauseOnFocus) {
      element.addEventListener('focusin', () => this.pauseToast(toast));
      element.addEventListener('focusout', () => this.resumeToast(toast));
    }

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
    this.applyStackState(container);

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
    if (!toast.options.persistent && toast.options.duration !== 0) {
      const duration = toast.options.duration || this.config.duration;
      toast.timeoutId = window.setTimeout(() => {
        toast.dismiss();
      }, duration);
    }
  }

  // Hide toast with animation
  async hideToast(toast: ToastInstance): Promise<void> {
    if (!toast.element) return;

    // Clear timeout
    if (toast.timeoutId) {
      clearTimeout(toast.timeoutId);
      toast.timeoutId = undefined;
    }

    // Get animation config
    const animation = toast.options.animation || this.config.animation || { type: 'css' };

    // Use animation manager for hiding
    await animationManager.hideToast(toast.element, toast, animation);

    // Remove element after animation
    if (toast.element && toast.element.parentNode) {
      const parent = toast.element.parentElement;
      toast.element.parentNode.removeChild(toast.element);
      toast.element = undefined;
      if (parent) this.applyStackState(parent);
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

    if (updates.title !== undefined || updates.description !== undefined || updates.message !== undefined || updates.icon !== undefined || updates.render) {
      const contentElement = toast.element.querySelector('.editora-toast-content');
      const nextContent = this.createContent(toast);
      contentElement?.replaceWith(nextContent);
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
      if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
        toast.timeoutId = undefined;
      }
      if (!toast.options.persistent && toast.options.duration !== 0) {
        const duration = toast.options.duration || this.config.duration;
        toast.timeoutId = window.setTimeout(() => {
          toast.dismiss();
        }, duration);
      }
    }

    // Call onUpdate callback
    toast.options.onUpdate?.(updates);
  }

  private createContent(toast: ToastInstance): HTMLElement {
    const options = toast.options;
    const content = document.createElement('div');
    content.className = 'editora-toast-content';

    if (options.icon) {
      const icon = document.createElement('span');
      icon.className = 'editora-toast-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = options.icon;
      content.appendChild(icon);
    }

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
          message.innerHTML = this.sanitizeHTML(options.message);
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
    container.dataset.expand = String(this.config.expand);
    container.dataset.stack = String(this.config.stack);
    container.style.setProperty('--editora-toast-offset', offset);
    container.style.setProperty('--editora-toast-mobile-offset', mobileOffset);
    container.style.setProperty('--editora-toast-gap', gap);

    const styles: Partial<CSSStyleDeclaration> = {
      position: 'fixed',
      zIndex: (this.config.zIndex || 2147483647).toString(),
      display: 'flex',
      flexDirection: position.startsWith('top') ? 'column' : 'column-reverse',
      gap,
      pointerEvents: 'none',
      maxWidth: '100%',
      boxSizing: 'border-box',
      top: '',
      right: '',
      bottom: '',
      left: '',
      transform: '',
      alignItems: position.includes('center') ? 'center' : 'stretch'
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
        styles.alignItems = 'center';
        break;
    }

    Object.assign(container.style, styles);
    container.style.setProperty('--editora-toast-mobile-left', mobileOffset);
  }

  private applyStackState(container: HTMLElement): void {
    const toasts = Array.from(container.querySelectorAll<HTMLElement>('.editora-toast'));
    toasts.forEach((element, index) => {
      const visualIndex = toasts.length - index - 1;
      element.dataset.index = String(index);
      element.dataset.front = String(visualIndex === 0);
      element.style.setProperty('--editora-toast-index', String(index));
      element.style.setProperty('--editora-toast-before', String(visualIndex));
    });
  }

  private toCssLength(value: number | string | undefined): string {
    if (typeof value === 'number') return `${value}px`;
    return value || '16px';
  }

  // Pause/resume auto-dismiss
  private pauseToast(toast: ToastInstance): void {
    if (toast.timeoutId) {
      clearTimeout(toast.timeoutId);
      toast.timeoutId = undefined;
    }
  }

  private resumeToast(toast: ToastInstance): void {
    if (!toast.options.persistent && toast.options.duration !== 0) {
      const duration = toast.options.duration || this.config.duration;
      toast.timeoutId = window.setTimeout(() => {
        toast.dismiss();
      }, duration);
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

    const handleStart = (e: TouchEvent | MouseEvent) => {
      isDragging = true;
      hasMoved = false;
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      originalTransform = element.style.transform || '';
      element.style.transition = 'none'; // Disable transitions during drag
      element.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const handleMove = (e: TouchEvent | MouseEvent) => {
      if (!isDragging) return;

      const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      // Only apply visual feedback if we've moved more than a small threshold
      const moveThreshold = 5;
      if (Math.abs(deltaX) > moveThreshold || Math.abs(deltaY) > moveThreshold) {
        hasMoved = true;
      }

      if (hasMoved) {
        // Add visual feedback by slightly moving the element
        // Allow more movement for vertical swipes to make them feel more responsive
        const maxMove = Math.abs(deltaY) > Math.abs(deltaX) ? 25 : 20; // More movement for vertical
        const moveX = Math.min(Math.max(deltaX * 0.2, -maxMove), maxMove);
        const moveY = Math.min(Math.max(deltaY * 0.2, -maxMove), maxMove);
        element.style.transform = `${originalTransform} translate(${moveX}px, ${moveY}px)`;
      }

      // More aggressive prevention of default behavior for vertical swipes
      if (Math.abs(deltaY) > Math.abs(deltaX) || swipeDirection === 'vertical' || swipeDirection === 'up' || swipeDirection === 'down') {
        e.preventDefault();
      }
    };

    const handleEnd = (e: TouchEvent | MouseEvent) => {
      if (!isDragging) return;

      // Reset styles
      element.style.transform = originalTransform;
      element.style.transition = '';
      element.style.cursor = '';

      if (!hasMoved) {
        isDragging = false;
        return;
      }

      const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
      const endY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

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

      isDragging = false;
    };

    // Prevent default drag behavior
    element.addEventListener('dragstart', (e) => e.preventDefault());

    // Touch events
    element.addEventListener('touchstart', handleStart, { passive: false });
    element.addEventListener('touchmove', handleMove, { passive: false });
    element.addEventListener('touchend', handleEnd, { passive: false });

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
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Security: Basic HTML sanitization
  private sanitizeHTML(html: string): string {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
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
      style.textContent = '.editora-toast{box-sizing:border-box;pointer-events:auto}.editora-toast-container{box-sizing:border-box;pointer-events:none}.editora-toast.show{opacity:1;transform:translateY(0) scale(1)}.editora-toast.hiding{opacity:0}';
      document.head.appendChild(style);
    }

    this.cssInjected = true;
  }

  // Cleanup
  destroy(): void {
    this.containers.forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
    this.containers.clear();
  }
}
