import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { warnIfElementNotRegistered } from './_internals';

type BreadcrumbSelectDetail = {
  index: number;
  label: string;
  href?: string;
  source?: 'click' | 'keyboard';
};

type BreadcrumbProps = React.HTMLAttributes<HTMLElement> & {
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

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
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

  useImperativeHandle(forwardedRef, () => ref.current as any);

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

    if (separator != null && separator !== '') el.setAttribute('separator', separator);
    else el.removeAttribute('separator');
  }, [separator]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof maxItems === 'number' && Number.isFinite(maxItems)) {
      el.setAttribute('max-items', String(maxItems));
    } else {
      el.removeAttribute('max-items');
    }
  }, [maxItems]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof currentIndex === 'number' && Number.isFinite(currentIndex)) {
      el.setAttribute('current-index', String(currentIndex));
    } else {
      el.removeAttribute('current-index');
    }
  }, [currentIndex]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (size && size !== 'md' && size !== '2') el.setAttribute('size', String(size));
    else el.removeAttribute('size');

    if (variant && variant !== 'default' && variant !== 'surface') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (radius != null && radius !== '' && radius !== 'md') el.setAttribute('radius', String(radius));
    else el.removeAttribute('radius');

    if (elevation && elevation !== 'default' && elevation !== 'none') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');

    if (tone) el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (state && state !== 'idle') el.setAttribute('state', state);
    else el.removeAttribute('state');

    if (disabled == null) el.removeAttribute('disabled');
    else if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');

    if (ariaLabel) el.setAttribute('aria-label', ariaLabel);
    else el.removeAttribute('aria-label');
  }, [size, variant, radius, elevation, tone, state, disabled, ariaLabel]);

  return React.createElement('ui-breadcrumb', { ref, ...rest }, children);
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
