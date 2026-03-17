import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { warnIfElementNotRegistered } from './_internals';

type BreadcrumbSelectDetail = {
  index: number;
  label: string;
  href?: string;
  source?: 'click' | 'keyboard';
};

type BaseProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export type BreadcrumbProps = BaseProps & {
  separator?: string;
  maxItems?: number;
  currentIndex?: number;
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  variant?: 'default' | 'surface' | 'soft' | 'solid' | 'outline' | 'ghost' | 'minimal';
  radius?: number | string | 'none' | 'sm' | 'md' | 'lg' | 'full';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  state?: 'idle' | 'loading' | 'error' | 'success';
  disabled?: boolean;
  ariaLabel?: string;
  onSelect?: (detail: BreadcrumbSelectDetail) => void;
};

export type BreadcrumbItemProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  href?: string;
  label?: string;
  index?: number;
};

type BreadcrumbComponent = React.ForwardRefExoticComponent<BreadcrumbProps & React.RefAttributes<HTMLElement>> & {
  Item: typeof BreadcrumbItem;
};

const BreadcrumbRoot = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    children,
    separator,
    maxItems,
    currentIndex,
    size,
    variant,
    radius,
    elevation,
    tone,
    state,
    disabled,
    ariaLabel,
    onSelect,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    warnIfElementNotRegistered('ui-breadcrumb', 'Breadcrumb');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onSelect) return;

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<BreadcrumbSelectDetail>).detail;
      if (detail) onSelect(detail);
    };

    el.addEventListener('ui-select', handleSelect as EventListener);
    return () => el.removeEventListener('ui-select', handleSelect as EventListener);
  }, [onSelect]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (attr: string, next: string | null) => {
      const current = el.getAttribute(attr);
      if (next == null) {
        if (current != null) el.removeAttribute(attr);
        return;
      }
      if (current !== next) el.setAttribute(attr, next);
    };

    const syncBooleanish = (attr: string, next: boolean | undefined, mode: 'presence' | 'value' = 'presence') => {
      if (mode === 'presence') {
        if (next) {
          if (!el.hasAttribute(attr)) el.setAttribute(attr, '');
        } else if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
        return;
      }

      if (next == null) {
        if (el.hasAttribute(attr)) el.removeAttribute(attr);
        return;
      }

      const serialized = next ? 'true' : 'false';
      if (el.getAttribute(attr) !== serialized) el.setAttribute(attr, serialized);
    };

    syncAttr('separator', separator || null);
    syncAttr('max-items', maxItems != null && Number.isFinite(maxItems) ? String(maxItems) : null);
    syncAttr('current-index', currentIndex != null && Number.isFinite(currentIndex) ? String(currentIndex) : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('variant', variant && variant !== 'default' && variant !== 'surface' ? variant : null);
    syncAttr('radius', radius != null && radius !== '' && radius !== 'md' ? String(radius) : null);
    syncAttr('elevation', elevation && elevation !== 'default' && elevation !== 'none' ? elevation : null);
    syncAttr('tone', tone || null);
    syncAttr('state', state && state !== 'idle' ? state : null);
    syncBooleanish('disabled', disabled);
    syncAttr('aria-label', ariaLabel || null);
  }, [separator, maxItems, currentIndex, size, variant, radius, elevation, tone, state, disabled, ariaLabel]);

  return React.createElement('ui-breadcrumb', { ref, ...rest }, children);
});

BreadcrumbRoot.displayName = 'Breadcrumb';

export const BreadcrumbItem = React.forwardRef<HTMLDivElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { children, href, label, index, className, ...rest },
  ref
) {
  const classes = ['item', className].filter(Boolean).join(' ');

  return (
    <div
      {...rest}
      ref={ref}
      className={classes}
      data-label={label}
      data-index={index}
      data-href={href}
    >
      {children}
    </div>
  );
});

BreadcrumbItem.displayName = 'Breadcrumb.Item';

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem
}) as BreadcrumbComponent;

export default Breadcrumb;
