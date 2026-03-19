import React, { useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type Props = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onSelect' | 'onOpen' | 'onClose'> & {
  children?: React.ReactNode;
};

export type MenuSelectDetail = {
  index?: number;
  value?: string;
  label?: string;
  checked?: boolean;
  item?: HTMLElement;
};

type MenuItemRole = 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';

type MenuProps = Props & {
  open?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'surface' | 'soft' | 'solid' | 'outline' | 'flat' | 'contrast' | 'default' | 'line' | 'glass';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  density?: 'default' | 'compact' | 'comfortable';
  radius?: number | string;
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'default' | 'brand' | 'neutral' | 'info' | 'danger' | 'success' | 'warning';
  closeOnSelect?: boolean;
  typeahead?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (open: boolean) => void;
  onSelect?: (idx: number) => void;
  onSelectDetail?: (detail: MenuSelectDetail) => void;
};

type MenuItemProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  caption?: React.ReactNode;
  tone?: 'danger' | 'success' | 'warning';
  role?: MenuItemRole;
  checked?: boolean;
};

type MenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

type MenuSectionLabelProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

type MenuTriggerProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

type MenuContentProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

const MenuTrigger = React.forwardRef<HTMLDivElement, MenuTriggerProps>(function MenuTrigger(
  { children, ...rest },
  ref
) {
  return (
    <div {...rest} ref={ref} slot="trigger">
      {children}
    </div>
  );
});

MenuTrigger.displayName = 'Menu.Trigger';

const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(function MenuContent(
  { children, ...rest },
  ref
) {
  return (
    <div {...rest} ref={ref} slot="content">
      {children}
    </div>
  );
});

MenuContent.displayName = 'Menu.Content';

const MenuRoot = React.forwardRef<HTMLElement, MenuProps>(function Menu(
  {
    children,
    open,
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
    onOpen,
    onClose,
    onChange,
    onSelect,
    onSelectDetail,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onOpenHandler = () => onOpen?.();
    const onCloseHandler = () => onClose?.();
    const onChangeHandler = (event: Event) => {
      const next = (event as CustomEvent<{ open?: boolean }>).detail?.open;
      if (typeof next === 'boolean') onChange?.(next);
    };
    const onSelectHandler = (event: Event) => {
      const detail = ((event as CustomEvent<MenuSelectDetail>).detail || {}) as MenuSelectDetail;
      onSelectDetail?.(detail);
      if (typeof detail.index === 'number') onSelect?.(detail.index);
    };
    el.addEventListener('open', onOpenHandler as EventListener);
    el.addEventListener('close', onCloseHandler as EventListener);
    el.addEventListener('change', onChangeHandler as EventListener);
    el.addEventListener('select', onSelectHandler as EventListener);
    return () => {
      el.removeEventListener('open', onOpenHandler as EventListener);
      el.removeEventListener('close', onCloseHandler as EventListener);
      el.removeEventListener('change', onChangeHandler as EventListener);
      el.removeEventListener('select', onSelectHandler as EventListener);
    };
  }, [onOpen, onClose, onChange, onSelect, onSelectDetail]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || open == null) return;
    if (open) el.setAttribute('open', '');
    else el.removeAttribute('open');
  }, [open]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (placement) el.setAttribute('placement', placement);
    else el.removeAttribute('placement');
  }, [placement]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (variant && variant !== 'default' && variant !== 'surface') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');
  }, [variant]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');
  }, [size]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');
  }, [density]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (radius == null || radius === '' || radius === 'default') {
      el.removeAttribute('radius');
      return;
    }
    el.setAttribute('radius', String(radius));
  }, [radius]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');
  }, [shape]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (elevation && elevation !== 'default') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');
  }, [elevation]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (tone && tone !== 'default' && tone !== 'brand') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');
  }, [tone]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (closeOnSelect == null) {
      el.removeAttribute('close-on-select');
      return;
    }
    el.setAttribute('close-on-select', closeOnSelect ? 'true' : 'false');
  }, [closeOnSelect]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeahead == null) {
      el.removeAttribute('typeahead');
      return;
    }
    el.setAttribute('typeahead', typeahead ? 'true' : 'false');
  }, [typeahead]);

  return React.createElement('ui-menu', { ref, ...rest }, children);
});

MenuRoot.displayName = 'Menu';

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(
  { children, icon, shortcut, caption, tone, role = 'menuitem', checked, className, ...rest },
  ref
) {
  const classes = ['item', className].filter(Boolean).join(' ');
  const selectionIcon =
    role === 'menuitemcheckbox' || role === 'menuitemradio' ? (
      <span className="selection-icon" aria-hidden="true" />
    ) : null;

  return (
    <div
      {...rest}
      ref={ref}
      role={role}
      tabIndex={rest.tabIndex ?? -1}
      className={classes}
      data-tone={tone}
      aria-checked={
        role === 'menuitemcheckbox' || role === 'menuitemradio'
          ? checked
            ? 'true'
            : 'false'
          : undefined
      }
    >
      {selectionIcon}
      {icon ? <span className="icon" aria-hidden="true">{icon}</span> : null}
      <span className="label">
        <span className="text">{children}</span>
        {caption ? <span className="caption">{caption}</span> : null}
      </span>
      {shortcut ? <span className="shortcut">{shortcut}</span> : null}
    </div>
  );
});

MenuItem.displayName = 'Menu.Item';

export const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(function MenuSeparator(
  { className, ...rest },
  ref
) {
  const classes = ['separator', className].filter(Boolean).join(' ');
  return <div {...rest} ref={ref} role="separator" className={classes} />;
});

MenuSeparator.displayName = 'Menu.Separator';

export const MenuSectionLabel = React.forwardRef<HTMLDivElement, MenuSectionLabelProps>(function MenuSectionLabel(
  { children, className, ...rest },
  ref
) {
  const classes = ['section-label', className].filter(Boolean).join(' ');
  return (
    <div {...rest} ref={ref} className={classes}>
      {children}
    </div>
  );
});

MenuSectionLabel.displayName = 'Menu.SectionLabel';

type MenuComponent = React.ForwardRefExoticComponent<
  MenuProps & React.RefAttributes<HTMLElement>
> & {
  Item: typeof MenuItem;
  Separator: typeof MenuSeparator;
  SectionLabel: typeof MenuSectionLabel;
  Trigger: typeof MenuTrigger;
  Content: typeof MenuContent;
};

export type { MenuProps, MenuItemProps, MenuSeparatorProps, MenuSectionLabelProps, MenuTriggerProps, MenuContentProps };

export const Menu = Object.assign(MenuRoot, {
  Item: MenuItem,
  Separator: MenuSeparator,
  SectionLabel: MenuSectionLabel,
  Trigger: MenuTrigger,
  Content: MenuContent
}) as MenuComponent;

export default Menu;
