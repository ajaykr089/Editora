import React, { useEffect, useLayoutEffect, useRef } from 'react';
// The tag only: the ui-icon element is defined on demand (below), so menus without icon names
// do not carry the icon renderer in their bundle.
import { Icon } from './server/Icon';

function useIconElement(icon: unknown) {
  React.useEffect(() => {
    if (typeof icon !== 'string' || typeof customElements === 'undefined' || customElements.get('ui-icon')) return;
    void import('@editora/ui-core/icon');
  }, [icon]);
}

import '@editora/ui-core/menu';
import { createUIElement, hostOnly, flushElementRender } from './_internals';

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
  /** An Editora icon name ("settings"), or your own element. */
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

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onOpenHandler = hostOnly(() => onOpen?.());
    const onCloseHandler = hostOnly(() => onClose?.());
    const onChangeHandler = hostOnly((event: Event) => {
      const next = (event as CustomEvent<{ open?: boolean }>).detail?.open;
      if (typeof next === 'boolean') onChange?.(next);
    });
    const onSelectHandler = hostOnly((event: Event) => {
      const detail = ((event as CustomEvent<MenuSelectDetail>).detail || {}) as MenuSelectDetail;
      onSelectDetail?.(detail);
      if (typeof detail.index === 'number') onSelect?.(detail.index);
    });
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
    flushElementRender(el);
  }, [open]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (placement) el.setAttribute('placement', placement);
    else el.removeAttribute('placement');
    flushElementRender(el);
  }, [placement]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (variant && variant !== 'default' && variant !== 'surface') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');
    flushElementRender(el);
  }, [variant]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');
    flushElementRender(el);
  }, [size]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');
    flushElementRender(el);
  }, [density]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (radius == null || radius === '' || radius === 'default') {
      el.removeAttribute('radius');
      return;
    }
    el.setAttribute('radius', String(radius));
    flushElementRender(el);
  }, [radius]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');
    flushElementRender(el);
  }, [shape]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (elevation && elevation !== 'default') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');
    flushElementRender(el);
  }, [elevation]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (tone && tone !== 'default' && tone !== 'brand') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');
    flushElementRender(el);
  }, [tone]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (closeOnSelect == null) {
      el.removeAttribute('close-on-select');
      return;
    }
    el.setAttribute('close-on-select', closeOnSelect ? 'true' : 'false');
    flushElementRender(el);
  }, [closeOnSelect]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeahead == null) {
      el.removeAttribute('typeahead');
      return;
    }
    el.setAttribute('typeahead', typeahead ? 'true' : 'false');
    flushElementRender(el);
  }, [typeahead]);

  return createUIElement('ui-menu', { ref, ...rest }, children);
});

MenuRoot.displayName = 'Menu';

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(
  { children, icon, shortcut, caption, tone, role = 'menuitem', checked, className, ...rest },
  ref
) {
  useIconElement(icon);
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
      {icon ? <span className="icon" aria-hidden="true">{typeof icon === 'string' ? <Icon name={icon} size={16} decorative /> : icon}</span> : null}
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
