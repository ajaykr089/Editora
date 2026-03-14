import * as React from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export type PaginationChangeDetail = {
  page: number;
  previousPage: number;
  count: number;
  reason: 'first' | 'prev' | 'next' | 'last' | 'change';
};

export type PaginationElement = HTMLElement & {
  page: number;
  count: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  focusCurrent: () => void;
};

export type PaginationProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
  page?: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'classic' | 'flat' | 'outline' | 'solid' | 'minimal' | 'contrast';
  headless?: boolean;
  ariaLabel?: string;
  onPageChange?: (detail: PaginationChangeDetail) => void;
  onChange?: (detail: PaginationChangeDetail) => void;
  onFirst?: (detail: PaginationChangeDetail) => void;
  onPrev?: (detail: PaginationChangeDetail) => void;
  onNext?: (detail: PaginationChangeDetail) => void;
  onLast?: (detail: PaginationChangeDetail) => void;
};

export const Pagination = React.forwardRef<PaginationElement, PaginationProps>(function Pagination(
  {
    page,
    count,
    size,
    variant,
    headless,
    ariaLabel,
    onPageChange,
    onChange,
    onFirst,
    onPrev,
    onNext,
    onLast,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<PaginationElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as PaginationElement);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<PaginationChangeDetail>).detail;
      if (!detail) return;
      onPageChange?.(detail);
      onChange?.(detail);
    };

    const handleFirst = (event: Event) => {
      const detail = (event as CustomEvent<PaginationChangeDetail>).detail;
      if (detail) onFirst?.(detail);
    };

    const handlePrev = (event: Event) => {
      const detail = (event as CustomEvent<PaginationChangeDetail>).detail;
      if (detail) onPrev?.(detail);
    };

    const handleNext = (event: Event) => {
      const detail = (event as CustomEvent<PaginationChangeDetail>).detail;
      if (detail) onNext?.(detail);
    };

    const handleLast = (event: Event) => {
      const detail = (event as CustomEvent<PaginationChangeDetail>).detail;
      if (detail) onLast?.(detail);
    };

    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('first', handleFirst as EventListener);
    el.addEventListener('prev', handlePrev as EventListener);
    el.addEventListener('next', handleNext as EventListener);
    el.addEventListener('last', handleLast as EventListener);

    return () => {
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('first', handleFirst as EventListener);
      el.removeEventListener('prev', handlePrev as EventListener);
      el.removeEventListener('next', handleNext as EventListener);
      el.removeEventListener('last', handleLast as EventListener);
    };
  }, [onPageChange, onChange, onFirst, onPrev, onNext, onLast]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(name)) el.setAttribute(name, '');
      } else if (el.hasAttribute(name)) {
        el.removeAttribute(name);
      }
    };

    syncAttr('page', typeof page === 'number' && Number.isFinite(page) ? String(page) : null);
    syncAttr('count', typeof count === 'number' && Number.isFinite(count) ? String(count) : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('aria-label', ariaLabel ?? null);
    syncBool('headless', headless);
  }, [page, count, size, variant, ariaLabel, headless]);

  return React.createElement('ui-pagination', { ref, ...rest }, children);
});

Pagination.displayName = 'Pagination';

export default Pagination;
