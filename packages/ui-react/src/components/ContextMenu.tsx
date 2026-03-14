import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type UIContextMenuElement = HTMLElement & {
  open: boolean;
  close?: () => void;
  openAt?: (point: { x: number; y: number }) => void;
  openForAnchorId?: (anchorId: string) => void;
  openForAnchor?: (anchor: HTMLElement) => void;
  openFor?: (anchor: string | HTMLElement) => void;
  showForAnchorId?: (anchorId: string) => void;
  getPortalContentHost?: () => HTMLElement | null;
  refreshLayout?: () => void;
};


export type MenuItem = {
  label?: string;
  description?: string;
  shortcut?: string;
  icon?: string | React.ReactNode;
  tone?: 'default' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
  separator?: boolean;
  submenu?: MenuItem[];
  onClick?: () => void;
  value?: string;
};


export type ContextMenuProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onSelect'> & {
  anchorId?: string;
  anchorEl?: HTMLElement | null;
  anchorPoint?: { x: number; y: number };
  open?: boolean;
  disabled?: boolean;
  state?: 'idle' | 'loading' | 'error' | 'success';
  stateText?: string;
  items?: MenuItem[];
  variant?: 'default' | 'surface' | 'soft' | 'solid' | 'outline' | 'contrast' | 'flat';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  radius?: number | string | 'none' | 'sm' | 'md' | 'lg' | 'full';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'default' | 'brand' | 'neutral' | 'info' | 'danger' | 'success' | 'warning';
  closeOnSelect?: boolean;
  closeOnEscape?: boolean;
  typeahead?: boolean;
  onOpenDetail?: (detail: { open: boolean; previousOpen: boolean; source: string }) => void;
  onCloseDetail?: (detail: { open: boolean; previousOpen: boolean; source: string }) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (open: boolean) => void;
  onSelect?: (detail: { index: number; value?: string; label?: string; checked?: boolean; item?: HTMLElement }) => void;
};

export function ContextMenu(props: ContextMenuProps) {

  const {
    items,
    anchorId,
    anchorEl,
    anchorPoint,
    open,
    disabled,
    state,
    stateText,
    variant,
    size,
    radius,
    density,
    shape,
    elevation,
    tone,
    closeOnSelect,
    closeOnEscape,
    typeahead,
    children,
    onOpenDetail,
    onCloseDetail,
    onOpen,
    onClose,
    onChange,
    onSelect,
    ...rest
  } = props;
  const ref = useRef<UIContextMenuElement | null>(null);
  const lastImperativeOpenRef = useRef<string>('');
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);

  const syncPortalHostSoon = (el: UIContextMenuElement) => {
    queueMicrotask(() => {
      setPortalHost(el.getPortalContentHost?.() || null);
    });
    requestAnimationFrame(() => {
      setPortalHost(el.getPortalContentHost?.() || null);
    });
    window.setTimeout(() => {
      setPortalHost(el.getPortalContentHost?.() || null);
    }, 0);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const openHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ open: boolean; previousOpen: boolean; source: string }>).detail;
      setPortalHost(el.getPortalContentHost?.() || null);
      onOpen?.();
      if (detail) onOpenDetail?.(detail);
    };
    const closeHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ open: boolean; previousOpen: boolean; source: string }>).detail;
      setPortalHost(null);
      onClose?.();
      if (detail) onCloseDetail?.(detail);
    };
    const changeHandler = (event: Event) => {
      const next = (event as CustomEvent<{ open?: boolean }>).detail?.open;
      if (typeof next === 'boolean') onChange?.(next);
    };
    const selectHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number; value?: string; label?: string; checked?: boolean; item?: HTMLElement }>).detail;
      onSelect?.(detail);
    };

    el.addEventListener('open', openHandler as EventListener);
    el.addEventListener('close', closeHandler as EventListener);
    el.addEventListener('change', changeHandler as EventListener);
    el.addEventListener('select', selectHandler as EventListener);

    return () => {
      el.removeEventListener('open', openHandler as EventListener);
      el.removeEventListener('close', closeHandler as EventListener);
      el.removeEventListener('change', changeHandler as EventListener);
      el.removeEventListener('select', selectHandler as EventListener);
    };
  }, [onOpen, onClose, onOpenDetail, onCloseDetail, onChange, onSelect]);

  useEffect(() => {
    const el = ref.current;
    if (!el || open == null) return;

    if (!open) {
      lastImperativeOpenRef.current = 'closed';
      setPortalHost(null);
      if (el.close) el.close();
      else el.open = false;
      return;
    }

    if (anchorPoint && el.openAt) {
      const nextKey = `point:${anchorPoint.x}:${anchorPoint.y}`;
      if (lastImperativeOpenRef.current !== nextKey || !el.open) {
        el.openAt(anchorPoint);
        lastImperativeOpenRef.current = nextKey;
      }
      setPortalHost(el.getPortalContentHost?.() || null);
      syncPortalHostSoon(el);
      return;
    }

    if (anchorEl) {
      const nextKey = 'anchor:element';
      if (el.openForAnchor) {
        if (lastImperativeOpenRef.current !== nextKey || !el.open) {
          el.openForAnchor(anchorEl);
          lastImperativeOpenRef.current = nextKey;
        }
        setPortalHost(el.getPortalContentHost?.() || null);
        syncPortalHostSoon(el);
        return;
      }
      if (el.openFor) {
        if (lastImperativeOpenRef.current !== nextKey || !el.open) {
          el.openFor(anchorEl);
          lastImperativeOpenRef.current = nextKey;
        }
        setPortalHost(el.getPortalContentHost?.() || null);
        syncPortalHostSoon(el);
        return;
      }
    }

    if (anchorId) {
      const nextKey = `anchor:${anchorId}`;
      if (el.openForAnchorId) {
        if (lastImperativeOpenRef.current !== nextKey || !el.open) {
          el.openForAnchorId(anchorId);
          lastImperativeOpenRef.current = nextKey;
        }
        setPortalHost(el.getPortalContentHost?.() || null);
        syncPortalHostSoon(el);
        return;
      }
      if (el.showForAnchorId) {
        if (lastImperativeOpenRef.current !== nextKey || !el.open) {
          el.showForAnchorId(anchorId);
          lastImperativeOpenRef.current = nextKey;
        }
        setPortalHost(el.getPortalContentHost?.() || null);
        syncPortalHostSoon(el);
        return;
      }
    }

    if (!el.open) {
      el.open = true;
    }
    lastImperativeOpenRef.current = 'open';
    setPortalHost(el.getPortalContentHost?.() || null);
    syncPortalHostSoon(el);
  }, [open, anchorId, anchorEl, anchorPoint]);

  useEffect(() => {
    const el = ref.current;
    if (!portalHost || !el || !open) return;
    el.refreshLayout?.();
  }, [children, items, open, portalHost]);

  // Render menu items recursively
  const renderMenuItems = (menuItems?: MenuItem[]) => {
    if (!menuItems) return null;
    return menuItems.map((item, i) => {
      if (item.separator) {
        return <div key={i} className="separator" role="separator" />;
      }
      let iconNode = null;
      if (item.icon) {
        iconNode = <span className="icon">{item.icon}</span>;
      }
      let submenuNode = null;
      if (item.submenu) {
        submenuNode = (
          <div className="submenu">
            {renderMenuItems(item.submenu)}
          </div>
        );
      }
      return (
        <div
          key={i}
          className="menuitem"
          role="menuitem"
          tabIndex={item.disabled ? -1 : 0}
          aria-disabled={item.disabled ? 'true' : undefined}
          data-value={item.value}
          data-tone={item.tone && item.tone !== 'default' ? item.tone : undefined}
          onClick={item.disabled ? undefined : item.onClick}
        >
          {iconNode}
          <span className="label">
            <span className="text">{item.label}</span>
            {item.description ? <span className="caption">{item.description}</span> : null}
          </span>
          {item.shortcut ? <span className="shortcut">{item.shortcut}</span> : null}
          {item.submenu && <span className="submenu-arrow">▶</span>}
          {submenuNode}
        </div>
      );
    });
  };

  const hasChildren = React.Children.count(children) > 0;
  const shouldReflectOpenAttr = !!open && !anchorPoint && !anchorId;
  const menuContent = hasChildren ? children : renderMenuItems(items);

  return (
    <>
      <ui-context-menu
        ref={ref}
        {...rest}
        {...(shouldReflectOpenAttr ? { open: '' } : {})}
        {...(variant && variant !== 'default' && variant !== 'surface' ? { variant } : {})}
        {...(size && size !== 'md' && size !== '2' ? { size } : {})}
        {...(radius != null && radius !== '' && radius !== 'md' ? { radius: String(radius) } : {})}
        {...(!size && density && density !== 'default' ? { density } : {})}
        {...(!radius && shape && shape !== 'default' ? { shape } : {})}
        {...(elevation && elevation !== 'default' ? { elevation } : {})}
        {...(tone && tone !== 'default' && tone !== 'brand' ? { tone } : {})}
        {...(disabled ? { disabled: '' } : {})}
        {...(state && state !== 'idle' ? { state } : {})}
        {...(stateText ? { 'state-text': stateText } : {})}
        {...(closeOnSelect == null ? {} : { 'close-on-select': closeOnSelect ? 'true' : 'false' })}
        {...(closeOnEscape == null ? {} : { 'close-on-escape': closeOnEscape ? 'true' : 'false' })}
        {...(typeahead == null ? {} : { typeahead: typeahead ? 'true' : 'false' })}
      />
      {portalHost
        ? createPortal(<div slot="menu">{menuContent}</div>, portalHost)
        : null}
    </>
  );
}

export default ContextMenu;
