import React, { useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
  const ref = useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onChangeHandler = (event: Event) => {
      const detail = (event as CustomEvent<MenubarChangeDetail>).detail;
      if (detail) onChange?.(detail);
    };
    const onOpenHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ selected?: number }>).detail;
      if (typeof detail?.selected === 'number') onOpen?.(detail.selected);
      else onOpen?.(-1);
    };
    const onCloseHandler = () => onClose?.();
    const onSelectHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ selected?: number; index?: number; value?: string; label?: string; checked?: boolean; item?: HTMLElement }>).detail;
      if (detail) onSelect?.(detail);
    };

    el.addEventListener('change', onChangeHandler as EventListener);
    el.addEventListener('open', onOpenHandler as EventListener);
    el.addEventListener('close', onCloseHandler as EventListener);
    el.addEventListener('select', onSelectHandler as EventListener);
    return () => {
      el.removeEventListener('change', onChangeHandler as EventListener);
      el.removeEventListener('open', onOpenHandler as EventListener);
      el.removeEventListener('close', onCloseHandler as EventListener);
      el.removeEventListener('select', onSelectHandler as EventListener);
    };
  }, [onChange, onOpen, onClose, onSelect]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof selected === 'number') el.setAttribute('selected', String(selected));
    else el.removeAttribute('selected');

    if (typeof open === 'boolean') {
      if (open) el.setAttribute('open', '');
      else el.removeAttribute('open');
    } else el.removeAttribute('open');

    if (typeof loop === 'boolean') el.setAttribute('loop', String(loop));
    else el.removeAttribute('loop');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (orientation && orientation !== 'horizontal') el.setAttribute('orientation', orientation);
    else el.removeAttribute('orientation');

    if (placement) el.setAttribute('placement', placement);
    else el.removeAttribute('placement');

    if (variant && variant !== 'default' && variant !== 'surface') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');

    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');

    if (radius == null || radius === '' || radius === 'default') el.removeAttribute('radius');
    else el.setAttribute('radius', String(radius));

    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');

    if (elevation && elevation !== 'default') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');

    if (tone && tone !== 'default' && tone !== 'brand') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (closeOnSelect == null) el.removeAttribute('close-on-select');
    else el.setAttribute('close-on-select', closeOnSelect ? 'true' : 'false');

    if (typeahead == null) el.removeAttribute('typeahead');
    else el.setAttribute('typeahead', typeahead ? 'true' : 'false');
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
