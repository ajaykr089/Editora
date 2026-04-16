import React from 'react';
import { createPortal } from 'react-dom';

const STYLE_ID = 'editora-split-button-styles';

const splitButtonStyles = `
  .ed-split-button {
    --ed-split-radius: 12px;
    --ed-split-bg: var(--ui-color-primary, #2563eb);
    --ed-split-bg-hover: color-mix(in srgb, var(--ed-split-bg) 84%, #0f172a 16%);
    --ed-split-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ed-split-text: #ffffff;
    --ed-split-shadow: 0 1px 2px rgba(2, 6, 23, 0.12), 0 8px 18px color-mix(in srgb, var(--ed-split-bg) 20%, transparent);
    --ed-split-menu-bg: var(--ui-color-surface, #ffffff);
    --ed-split-menu-text: var(--ui-color-text, #0f172a);
    --ed-split-menu-muted: color-mix(in srgb, var(--ed-split-menu-text) 58%, transparent);
    --ed-split-menu-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 64%, transparent);
    --ed-split-menu-shadow: 0 22px 44px rgba(2, 6, 23, 0.16), 0 2px 8px rgba(2, 6, 23, 0.08);
    --ed-split-menu-radius: 14px;
    --ed-split-menu-gap: 2px;
    --ed-split-menu-item-radius: 10px;
    --ed-split-menu-item-min-height: 44px;
    --ed-split-menu-item-padding: 10px 10px;
    --ed-split-menu-accent: color-mix(in srgb, var(--ed-split-bg) 12%, transparent);
    --ed-split-menu-accent-strong: color-mix(in srgb, var(--ed-split-bg) 18%, transparent);
    --ed-split-menu-accent-border: color-mix(in srgb, var(--ed-split-bg) 24%, transparent);
    --ed-split-menu-danger: var(--ui-color-danger, #dc2626);
    display: inline-flex;
    position: relative;
    min-width: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .ed-split-button--neutral {
    --ed-split-bg: #ffffff;
    --ed-split-bg-hover: #f8fafc;
    --ed-split-border: 1px solid color-mix(in srgb, #0f172a 12%, transparent);
    --ed-split-text: #0f172a;
    --ed-split-shadow: 0 1px 2px rgba(15, 23, 42, 0.06), 0 10px 24px rgba(15, 23, 42, 0.08);
  }

  .ed-split-button--flat {
    --ed-split-radius: 10px;
    --ed-split-bg: #ffffff;
    --ed-split-bg-hover: #f1f5f9;
    --ed-split-border: 1px solid #dbe4f0;
    --ed-split-text: #0f172a;
    --ed-split-shadow: none;
    --ed-split-menu-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  }

  .ed-split-button--contrast {
    --ed-split-bg: #111827;
    --ed-split-bg-hover: #0b1220;
    --ed-split-text: #f8fafc;
    --ed-split-shadow: 0 1px 2px rgba(15, 23, 42, 0.2), 0 16px 36px rgba(15, 23, 42, 0.18);
  }

  .ed-split-button--compact {
    --ed-split-radius: 10px;
  }

  .ed-split-button--square {
    --ed-split-radius: 0px;
  }

  .ed-split-button__group {
    display: inline-grid;
    grid-template-columns: minmax(0, 1fr) auto;
    min-width: 0;
    border: var(--ed-split-border);
    border-radius: var(--ed-split-radius);
    overflow: hidden;
    background: var(--ed-split-bg);
    color: var(--ed-split-text);
    box-shadow: var(--ed-split-shadow);
  }

  .ed-split-button__primary,
  .ed-split-button__toggle {
    appearance: none;
    border: 0;
    margin: 0;
    background: transparent;
    color: inherit;
    font: 600 14px/1.2 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
    transition: background-color 130ms ease, color 130ms ease;
  }

  .ed-split-button__primary {
    min-height: 40px;
    padding: 0 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .ed-split-button__toggle {
    min-height: 40px;
    inline-size: 42px;
    display: inline-grid;
    place-items: center;
    border-inline-start: 1px solid color-mix(in srgb, currentColor 16%, transparent);
  }

  .ed-split-button__primary:hover,
  .ed-split-button__primary:focus-visible,
  .ed-split-button__toggle:hover,
  .ed-split-button__toggle:focus-visible,
  .ed-split-button[data-open="true"] .ed-split-button__toggle {
    background: var(--ed-split-bg-hover);
    outline: none;
  }

  .ed-split-button--compact .ed-split-button__primary,
  .ed-split-button--compact .ed-split-button__toggle {
    min-height: 36px;
    font-size: 13px;
  }

  .ed-split-button--compact .ed-split-button__primary {
    padding-inline: 12px;
  }

  .ed-split-button--compact .ed-split-button__toggle {
    inline-size: 38px;
  }

  .ed-split-button--comfortable .ed-split-button__primary,
  .ed-split-button--comfortable .ed-split-button__toggle {
    min-height: 44px;
  }

  .ed-split-button--comfortable .ed-split-button__primary {
    padding-inline: 16px;
  }

  .ed-split-button--comfortable .ed-split-button__toggle {
    inline-size: 46px;
  }

  .ed-split-button__toggleIcon {
    inline-size: 14px;
    block-size: 14px;
    display: block;
  }

  .ed-split-button[aria-disabled="true"] {
    opacity: 0.72;
    pointer-events: none;
  }

  .ed-split-button__menu {
    --ed-split-bg: var(--ui-color-primary, #2563eb);
    --ed-split-menu-bg: var(--ui-color-surface, #ffffff);
    --ed-split-menu-text: var(--ui-color-text, #0f172a);
    --ed-split-menu-muted: color-mix(in srgb, var(--ed-split-menu-text) 58%, transparent);
    --ed-split-menu-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 64%, transparent);
    --ed-split-menu-shadow: 0 22px 44px rgba(2, 6, 23, 0.16), 0 2px 8px rgba(2, 6, 23, 0.08);
    --ed-split-menu-radius: 14px;
    --ed-split-menu-gap: 2px;
    --ed-split-menu-item-radius: 10px;
    --ed-split-menu-item-min-height: 44px;
    --ed-split-menu-item-padding: 10px 10px;
    --ed-split-menu-accent: color-mix(in srgb, var(--ed-split-bg) 12%, transparent);
    --ed-split-menu-accent-strong: color-mix(in srgb, var(--ed-split-bg) 18%, transparent);
    --ed-split-menu-accent-border: color-mix(in srgb, var(--ed-split-bg) 24%, transparent);
    --ed-split-menu-danger: var(--ui-color-danger, #dc2626);
    position: fixed;
    z-index: 1600;
    display: grid;
    gap: 8px;
    min-width: 240px;
    max-width: min(360px, calc(100vw - 16px));
    max-height: min(420px, calc(100vh - 16px));
    overflow: hidden auto;
    padding: 8px;
    box-sizing: border-box;
    border: var(--ed-split-menu-border);
    border-radius: calc(var(--ed-split-menu-radius) + 2px);
    background: var(--ed-split-menu-bg);
    color: var(--ed-split-menu-text);
    box-shadow: var(--ed-split-menu-shadow);
    outline: none;
    opacity: 0;
    transform: translateY(-4px) scale(0.985);
    animation: ed-split-button-menu-in 150ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  .ed-split-button__menu--neutral {
    --ed-split-bg: #2563eb;
    --ed-split-menu-bg: #ffffff;
    --ed-split-menu-text: #0f172a;
    --ed-split-menu-muted: color-mix(in srgb, var(--ed-split-menu-text) 58%, transparent);
    --ed-split-menu-border: 1px solid color-mix(in srgb, #0f172a 12%, transparent);
    --ed-split-menu-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  }

  .ed-split-button__menu--flat {
    --ed-split-bg: #2563eb;
    --ed-split-menu-bg: #ffffff;
    --ed-split-menu-text: #0f172a;
    --ed-split-menu-muted: color-mix(in srgb, var(--ed-split-menu-text) 58%, transparent);
    --ed-split-menu-border: 1px solid #dbe4f0;
    --ed-split-menu-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
    --ed-split-menu-accent: #eef4ff;
    --ed-split-menu-accent-strong: #e0ecff;
    --ed-split-menu-accent-border: color-mix(in srgb, #2563eb 20%, transparent);
  }

  .ed-split-button__menu--contrast {
    --ed-split-bg: #2563eb;
    --ed-split-menu-bg: #111827;
    --ed-split-menu-text: #f8fafc;
    --ed-split-menu-muted: color-mix(in srgb, var(--ed-split-menu-text) 58%, transparent);
    --ed-split-menu-border: 1px solid #334155;
    --ed-split-menu-shadow: 0 18px 36px rgba(15, 23, 42, 0.3), 0 2px 8px rgba(15, 23, 42, 0.2);
  }

  .ed-split-button__menu[data-placement="top"] {
    transform-origin: bottom left;
  }

  .ed-split-button__menu[data-placement="bottom"] {
    transform-origin: top left;
  }

  .ed-split-button__menuHeader {
    display: grid;
    gap: 4px;
    padding: 4px 6px 2px;
  }

  .ed-split-button__menuHeading {
    margin: 0;
    font: 700 13px/1.25 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.015em;
    color: var(--ed-split-menu-text);
  }

  .ed-split-button__menuDescription {
    margin: 0;
    font: 500 12px/1.5 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ed-split-menu-muted);
  }

  .ed-split-button__list {
    display: grid;
    gap: var(--ed-split-menu-gap);
  }

  .ed-split-button__menu--compact {
    --ed-split-menu-gap: 1px;
    --ed-split-menu-item-radius: 8px;
    --ed-split-menu-item-min-height: 38px;
    --ed-split-menu-item-padding: 8px 10px;
  }

  .ed-split-button__menu--airy {
    --ed-split-menu-gap: 4px;
    --ed-split-menu-item-radius: 14px;
    --ed-split-menu-item-min-height: 50px;
    --ed-split-menu-item-padding: 12px;
  }

  .ed-split-button__menu--flat {
    --ed-split-menu-radius: 10px;
    --ed-split-menu-item-radius: 8px;
  }

  .ed-split-button__menu--soft {
    --ed-split-menu-radius: 18px;
    --ed-split-menu-item-radius: 14px;
  }

  .ed-split-button__menu--square {
    --ed-split-menu-radius: 0px;
    --ed-split-menu-item-radius: 0px;
  }

  .ed-split-button__item {
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: var(--ed-split-menu-item-min-height);
    box-sizing: border-box;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    padding: var(--ed-split-menu-item-padding);
    border: 1px solid transparent;
    border-radius: var(--ed-split-menu-item-radius);
    background: transparent;
    color: inherit;
    text-align: left;
    font: 500 13px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
    transition:
      background-color 130ms ease,
      border-color 130ms ease,
      color 130ms ease,
      box-shadow 130ms ease;
  }

  .ed-split-button__item:hover,
  .ed-split-button__item[data-active="true"] {
    background: var(--ed-split-menu-accent);
    border-color: var(--ed-split-menu-accent-border);
  }

  .ed-split-button__item[data-active="true"] {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ed-split-bg) 12%, transparent);
  }

  .ed-split-button__item:active {
    background: var(--ed-split-menu-accent-strong);
  }

  .ed-split-button__item:focus-visible {
    outline: none;
    background: var(--ed-split-menu-accent);
    border-color: var(--ed-split-menu-accent-border);
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--ed-split-bg) 12%, transparent),
      0 0 0 3px color-mix(in srgb, var(--ed-split-bg) 14%, transparent);
  }

  .ed-split-button__item[aria-disabled="true"] {
    opacity: 0.52;
    cursor: not-allowed;
  }

  .ed-split-button__item--danger {
    color: color-mix(in srgb, var(--ed-split-menu-danger) 88%, var(--ed-split-menu-text));
  }

  .ed-split-button__item--danger .ed-split-button__itemDescription {
    color: color-mix(in srgb, var(--ed-split-menu-danger) 68%, transparent);
  }

  .ed-split-button__item--danger:hover,
  .ed-split-button__item--danger[data-active="true"],
  .ed-split-button__item--danger:focus-visible {
    border-color: color-mix(in srgb, var(--ed-split-menu-danger) 28%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ed-split-menu-danger) 14%, transparent);
  }

  .ed-split-button__itemText {
    min-inline-size: 0;
    display: grid;
    gap: 2px;
  }

  .ed-split-button__itemLabel {
    display: block;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ed-split-button__itemDescription {
    display: -webkit-box;
    min-inline-size: 0;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
    color: var(--ed-split-menu-muted);
    font-size: 12px;
    line-height: 1.4;
  }

  .ed-split-button__itemShortcut {
    white-space: nowrap;
    color: var(--ed-split-menu-muted);
    font: 600 12px/1 "IBM Plex Mono", "SFMono-Regular", "SF Mono", Consolas, monospace;
    letter-spacing: 0.03em;
  }

  @keyframes ed-split-button-menu-in {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ed-split-button__menu {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
`;

function ensureSplitButtonStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = splitButtonStyles;
  document.head.appendChild(style);
}

type SplitButtonItem = {
  value: string;
  label: string;
  description?: string;
  shortcut?: string;
  tone?: 'default' | 'danger';
  disabled?: boolean;
};

export type SplitButtonProps = Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> & {
  children?: React.ReactNode;
  label?: string;
  menuLabel?: string;
  menuHeading?: string;
  menuDescription?: string;
  variant?: 'primary' | 'neutral' | 'flat' | 'contrast';
  density?: 'compact' | 'default' | 'comfortable';
  shape?: 'default' | 'square';
  menuDensity?: 'compact' | 'default' | 'airy';
  menuShape?: 'default' | 'flat' | 'soft' | 'square';
  disabled?: boolean;
  items?: SplitButtonItem[];
  onPrimaryAction?: () => void;
  onSelect?: (detail: { index: number; value?: string; label?: string }) => void;
};

type MenuPosition = {
  top: number;
  left: number;
  minWidth: number;
  placement: 'top' | 'bottom';
};

function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function firstEnabledIndex(items: SplitButtonItem[]): number {
  return items.findIndex((item) => !item.disabled);
}

function resolveNextEnabledIndex(items: SplitButtonItem[], start: number, step: 1 | -1): number {
  if (!items.length) return -1;
  let index = start;
  for (let attempt = 0; attempt < items.length; attempt += 1) {
    index = (index + step + items.length) % items.length;
    if (!items[index]?.disabled) return index;
  }
  return -1;
}

function resolveBoundaryEnabledIndex(items: SplitButtonItem[], edge: 'first' | 'last'): number {
  const ordered = edge === 'first' ? items : [...items].reverse();
  const found = ordered.findIndex((item) => !item.disabled);
  if (found < 0) return -1;
  return edge === 'first' ? found : items.length - 1 - found;
}

export const SplitButton = React.forwardRef<HTMLElement, SplitButtonProps>(function SplitButton(
  {
    children,
    className,
    label = 'Run action',
    menuLabel = 'Open action menu',
    menuHeading,
    menuDescription,
    variant = 'primary',
    density = 'default',
    shape = 'default',
    menuDensity = 'default',
    menuShape = 'default',
    disabled = false,
    items = [],
    onPrimaryAction,
    onSelect,
    style,
    ...rest
  },
  forwardedRef
) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const groupRef = React.useRef<HTMLDivElement | null>(null);
  const toggleRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [menuPosition, setMenuPosition] = React.useState<MenuPosition | null>(null);
  const headingId = React.useId();
  const descriptionId = React.useId();

  React.useImperativeHandle(forwardedRef, () => rootRef.current as HTMLElement);

  React.useLayoutEffect(() => {
    ensureSplitButtonStyles();
  }, []);

  const updateMenuPosition = React.useCallback(() => {
    const group = groupRef.current;
    const menu = menuRef.current;
    if (!group || !menu) return;

    const groupRect = group.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const desiredMinWidth = Math.max(260, Math.round(groupRect.width));

    menu.style.minWidth = `${desiredMinWidth}px`;
    const menuRect = menu.getBoundingClientRect();
    const belowSpace = Math.max(0, viewportHeight - groupRect.bottom - 8);
    const aboveSpace = Math.max(0, groupRect.top - 8);
    const placeTop = belowSpace < menuRect.height && aboveSpace > belowSpace;

    let top = placeTop ? groupRect.top - menuRect.height - 6 : groupRect.bottom + 6;
    let left = groupRect.left;
    if (left + menuRect.width > viewportWidth - 8) left = viewportWidth - menuRect.width - 8;
    if (left < 8) left = 8;
    if (top < 8) top = 8;
    if (top + menuRect.height > viewportHeight - 8) top = Math.max(8, viewportHeight - menuRect.height - 8);

    setMenuPosition({
      top: Math.round(top),
      left: Math.round(left),
      minWidth: desiredMinWidth,
      placement: placeTop ? 'top' : 'bottom'
    });
  }, []);

  React.useEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return;
    }

    const nextActive = activeIndex >= 0 && !items[activeIndex]?.disabled ? activeIndex : firstEnabledIndex(items);
    setActiveIndex(nextActive);
  }, [open, items, activeIndex]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();

    const raf = requestAnimationFrame(() => {
      updateMenuPosition();
      try {
        menuRef.current?.focus({ preventScroll: true });
      } catch {
        menuRef.current?.focus();
      }
    });

    const onResize = () => updateMenuPosition();
    const onScroll = () => updateMenuPosition();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, updateMenuPosition]);

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && rootRef.current?.contains(target)) return;
      if (target && menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open]);

  React.useEffect(() => {
    if (open) return;
    queueMicrotask(() => {
      try {
        toggleRef.current?.focus({ preventScroll: true });
      } catch {
        toggleRef.current?.focus();
      }
    });
  }, [open]);

  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    const node = itemRefs.current[activeIndex];
    if (!node || typeof node.scrollIntoView !== 'function') return;
    node.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const selectItem = React.useCallback((index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    onSelect?.({
      index,
      value: item.value,
      label: item.label
    });
    setOpen(false);
  }, [items, onSelect]);

  const openMenu = React.useCallback(() => {
    if (disabled || items.length === 0) return;
    setOpen(true);
  }, [disabled, items.length]);

  const closeMenu = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onToggleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMenu();
    }
  }, [openMenu]);

  const onMenuKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        closeMenu();
        return;
      case 'Tab':
        closeMenu();
        return;
      case 'ArrowDown': {
        event.preventDefault();
        const start = activeIndex >= 0 ? activeIndex : firstEnabledIndex(items) - 1;
        const next = resolveNextEnabledIndex(items, start, 1);
        if (next >= 0) setActiveIndex(next);
        return;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const start = activeIndex >= 0 ? activeIndex : firstEnabledIndex(items) + 1;
        const next = resolveNextEnabledIndex(items, start, -1);
        if (next >= 0) setActiveIndex(next);
        return;
      }
      case 'Home': {
        event.preventDefault();
        const next = resolveBoundaryEnabledIndex(items, 'first');
        if (next >= 0) setActiveIndex(next);
        return;
      }
      case 'End': {
        event.preventDefault();
        const next = resolveBoundaryEnabledIndex(items, 'last');
        if (next >= 0) setActiveIndex(next);
        return;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (activeIndex >= 0) selectItem(activeIndex);
        return;
      }
      default:
        return;
    }
  }, [activeIndex, closeMenu, items, selectItem]);

  const rootClassName = classNames(
    'ed-split-button',
    variant !== 'primary' && `ed-split-button--${variant}`,
    density !== 'default' && `ed-split-button--${density}`,
    shape !== 'default' && `ed-split-button--${shape}`,
    className
  );

  const menuClassName = classNames(
    'ed-split-button__menu',
    variant !== 'primary' && `ed-split-button__menu--${variant}`,
    menuDensity !== 'default' && `ed-split-button__menu--${menuDensity}`,
    menuShape !== 'default' && `ed-split-button__menu--${menuShape}`
  );

  const menu =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            className={menuClassName}
            role="menu"
            tabIndex={-1}
            aria-labelledby={menuHeading ? headingId : undefined}
            aria-describedby={menuDescription ? descriptionId : undefined}
            data-placement={menuPosition?.placement || 'bottom'}
            onKeyDown={onMenuKeyDown}
            style={{
              top: menuPosition?.top ?? -9999,
              left: menuPosition?.left ?? -9999,
              minWidth: menuPosition?.minWidth,
              visibility: menuPosition ? 'visible' : 'hidden'
            }}
          >
            {menuHeading || menuDescription ? (
              <div className="ed-split-button__menuHeader">
                {menuHeading ? (
                  <p id={headingId} className="ed-split-button__menuHeading">
                    {menuHeading}
                  </p>
                ) : null}
                {menuDescription ? (
                  <p id={descriptionId} className="ed-split-button__menuDescription">
                    {menuDescription}
                  </p>
                ) : null}
              </div>
            ) : null}
            <div className="ed-split-button__list">
              {items.map((item, index) => (
                <button
                  key={item.value}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  type="button"
                  role="menuitem"
                  className={classNames(
                    'ed-split-button__item',
                    item.tone === 'danger' && 'ed-split-button__item--danger'
                  )}
                  data-active={index === activeIndex ? 'true' : undefined}
                  aria-disabled={item.disabled ? 'true' : undefined}
                  disabled={item.disabled}
                  onPointerMove={() => {
                    if (!item.disabled) setActiveIndex(index);
                  }}
                  onFocus={() => {
                    if (!item.disabled) setActiveIndex(index);
                  }}
                  onClick={() => selectItem(index)}
                >
                  <span className="ed-split-button__itemText">
                    <span className="ed-split-button__itemLabel">{item.label}</span>
                    {item.description ? (
                      <span className="ed-split-button__itemDescription">{item.description}</span>
                    ) : null}
                  </span>
                  {item.shortcut ? (
                    <span className="ed-split-button__itemShortcut">{item.shortcut}</span>
                  ) : null}
                </button>
              ))}
              {children}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        {...rest}
        ref={rootRef}
        className={rootClassName}
        style={style as React.CSSProperties | undefined}
        aria-disabled={disabled ? 'true' : undefined}
        data-open={open ? 'true' : undefined}
      >
        <div ref={groupRef} className="ed-split-button__group">
          <button
            type="button"
            className="ed-split-button__primary"
            disabled={disabled}
            onClick={() => onPrimaryAction?.()}
          >
            {label}
          </button>
          <button
            ref={toggleRef}
            type="button"
            className="ed-split-button__toggle"
            aria-label={menuLabel}
            aria-haspopup="menu"
            aria-expanded={open ? 'true' : 'false'}
            disabled={disabled || items.length === 0}
            onClick={() => {
              if (open) closeMenu();
              else openMenu();
            }}
            onKeyDown={onToggleKeyDown}
          >
            <svg className="ed-split-button__toggleIcon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      {menu}
    </>
  );
});

SplitButton.displayName = 'SplitButton';

export default SplitButton;
