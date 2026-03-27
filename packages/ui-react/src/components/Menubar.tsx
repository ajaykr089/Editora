import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

export type MenubarChangeDetail = {
  selected: number;
  previous: number;
  open: boolean;
  reason: 'click' | 'keyboard' | 'programmatic';
};

export type MenubarProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onSelect' | 'onOpen' | 'onClose'> & {
  children?: React.ReactNode;
  selected?: number;
  open?: boolean;
  loop?: boolean;
  headless?: boolean;
  orientation?: 'horizontal' | 'vertical';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'surface' | 'soft' | 'solid' | 'outline' | 'flat' | 'line' | 'glass' | 'contrast';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  density?: 'default' | 'compact' | 'comfortable';
  radius?: number | string;
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'default' | 'brand' | 'neutral' | 'info' | 'danger' | 'success' | 'warning';
  closeOnSelect?: boolean;
  typeahead?: boolean;
  onChange?: (detail: MenubarChangeDetail) => void;
  onOpen?: (selected: number) => void;
  onClose?: () => void;
  onSelect?: (detail: { selected?: number; index?: number; value?: string; label?: string; checked?: boolean; item?: HTMLElement }) => void;
};

type MenubarContentProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

const MenubarRoot = React.forwardRef<HTMLElement, MenubarProps>(function Menubar(
  {
    selected,
    open,
    loop,
    headless,
    orientation,
    placement,
    variant,
    size,
    density,
    radius,
    shape,
    elevation,
    tone,
    closeOnSelect,
    typeahead,
    onChange,
    onOpen,
    onClose,
    onSelect,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const onChangeHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<MenubarChangeDetail>(event);
    if (detail) onChange?.(detail);
  }, [onChange]);

  const onOpenHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ selected?: number }>(event);
    if (typeof detail?.selected === 'number') onOpen?.(detail.selected);
    else onOpen?.(-1);
  }, [onOpen]);

  const onCloseHandler = React.useCallback(() => {
    onClose?.();
  }, [onClose]);

  const onSelectHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{
      selected?: number;
      index?: number;
      value?: string;
      label?: string;
      checked?: boolean;
      item?: HTMLElement;
    }>(event);
    if (detail) onSelect?.(detail);
  }, [onSelect]);

  useElementEventListeners(
    ref,
    [
      { type: 'change', listener: onChangeHandler },
      { type: 'open', listener: onOpenHandler },
      { type: 'close', listener: onCloseHandler as EventListener },
      { type: 'select', listener: onSelectHandler },
    ],
    [onChangeHandler, onOpenHandler, onCloseHandler, onSelectHandler]
  );

  useElementAttributes(ref, (el) => {
    syncNumberAttribute(el, 'selected', typeof selected === 'number' ? selected : undefined);
    if (typeof open === 'boolean') syncBooleanAttribute(el, 'open', open);
    else syncStringAttribute(el, 'open', null);
    syncStringAttribute(el, 'loop', typeof loop === 'boolean' ? String(loop) : null);
    syncBooleanAttribute(el, 'headless', headless);
    syncStringAttribute(el, 'orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncStringAttribute(el, 'placement', placement ?? null);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' && variant !== 'surface' ? variant : null);
    syncStringAttribute(el, 'size', size && size !== 'md' && size !== '2' ? size : null);
    syncStringAttribute(el, 'density', density && density !== 'default' ? density : null);
    syncStringAttribute(el, 'radius', radius == null || radius === '' || radius === 'default' ? null : String(radius));
    syncStringAttribute(el, 'shape', shape && shape !== 'default' ? shape : null);
    syncStringAttribute(el, 'elevation', elevation && elevation !== 'default' ? elevation : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'default' && tone !== 'brand' ? tone : null);
    syncStringAttribute(el, 'close-on-select', closeOnSelect == null ? null : closeOnSelect ? 'true' : 'false');
    syncStringAttribute(el, 'typeahead', typeahead == null ? null : typeahead ? 'true' : 'false');
  }, [
    selected,
    open,
    loop,
    headless,
    orientation,
    placement,
    variant,
    size,
    density,
    radius,
    shape,
    elevation,
    tone,
    closeOnSelect,
    typeahead
  ]);

  return React.createElement('ui-menubar', { ref, ...rest }, children);
});

MenubarRoot.displayName = 'Menubar';

const MenubarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(function MenubarContent(
  { children, ...rest },
  ref
) {
  return (
    <div {...rest} ref={ref} slot="content">
      {children}
    </div>
  );
});

MenubarContent.displayName = 'Menubar.Content';

type MenubarComponent = React.ForwardRefExoticComponent<
  MenubarProps & React.RefAttributes<HTMLElement>
> & {
  Content: typeof MenubarContent;
};

export type { MenubarContentProps };

export const Menubar = Object.assign(MenubarRoot, {
  Content: MenubarContent
}) as MenubarComponent;

export default Menubar;
