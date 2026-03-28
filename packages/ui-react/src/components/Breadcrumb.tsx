import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
  warnIfElementNotRegistered,
} from './_internals';

type BreadcrumbSelectDetail = {
  index: number;
  label: string;
  href?: string;
  source?: 'click' | 'keyboard';
};

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> & {
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
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-breadcrumb', 'Breadcrumb');
  }, []);

  const handleSelect = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<BreadcrumbSelectDetail>(event);
    if (detail) onSelect?.(detail);
  }, [onSelect]);

  useElementEventListeners(ref, [{ type: 'ui-select', listener: handleSelect }], [handleSelect]);

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'separator', separator || null);
    syncNumberAttribute(el, 'max-items', maxItems != null && Number.isFinite(maxItems) ? maxItems : undefined);
    syncNumberAttribute(
      el,
      'current-index',
      currentIndex != null && Number.isFinite(currentIndex) ? currentIndex : undefined
    );
    syncStringAttribute(el, 'size', size && size !== 'md' && size !== '2' ? size : null);
    syncStringAttribute(
      el,
      'variant',
      variant && variant !== 'default' && variant !== 'surface' ? variant : null
    );
    syncStringAttribute(el, 'radius', radius != null && radius !== '' && radius !== 'md' ? String(radius) : null);
    syncStringAttribute(
      el,
      'elevation',
      elevation && elevation !== 'default' && elevation !== 'none' ? elevation : null
    );
    syncStringAttribute(el, 'tone', tone || null);
    syncStringAttribute(el, 'state', state && state !== 'idle' ? state : null);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncStringAttribute(el, 'aria-label', ariaLabel || null);
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
