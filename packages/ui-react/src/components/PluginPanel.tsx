import * as React from 'react';
import { warnIfElementNotRegistered } from './_internals';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export type PluginPanelOpenChangeDetail = {
  open: boolean;
};

export type PluginPanelElement = HTMLElement & {
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
};

export type PluginPanelProps = React.HTMLAttributes<HTMLElement> & {
  open?: boolean;
  position?: 'right' | 'left' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  description?: string;
  headless?: boolean;
  dismissible?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: (detail: PluginPanelOpenChangeDetail) => void;
};

export const PluginPanel = React.forwardRef<PluginPanelElement, PluginPanelProps>(function PluginPanel(
  { children, open, position, size, title, description, headless, dismissible, onOpen, onClose, onOpenChange, ...rest },
  forwardedRef
) {
  const ref = React.useRef<PluginPanelElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as PluginPanelElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-plugin-panel', 'PluginPanel');
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleOpen = () => onOpen?.();
    const handleClose = () => onClose?.();
    const handleOpenChange = (event: Event) => {
      const detail = (event as CustomEvent<PluginPanelOpenChangeDetail>).detail;
      if (detail) onOpenChange?.(detail);
    };

    el.addEventListener('open', handleOpen as EventListener);
    el.addEventListener('close', handleClose as EventListener);
    el.addEventListener('open-change', handleOpenChange as EventListener);
    return () => {
      el.removeEventListener('open', handleOpen as EventListener);
      el.removeEventListener('close', handleClose as EventListener);
      el.removeEventListener('open-change', handleOpenChange as EventListener);
    };
  }, [onClose, onOpen, onOpenChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null, enabled = true) => {
      if (!enabled) return;
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    if (typeof open === 'boolean') syncAttr('open', open ? '' : null);
    syncAttr('position', position ?? null, position !== undefined);
    syncAttr('size', size && size !== 'md' ? size : null, size !== undefined);
    syncAttr('title', title ?? null, title !== undefined);
    syncAttr('description', description ?? null, description !== undefined);
    if (typeof headless === 'boolean') syncAttr('headless', headless ? '' : null);
    if (typeof dismissible === 'boolean') syncAttr('dismissible', dismissible ? '' : null);
  }, [open, position, size, title, description, headless, dismissible]);

  return React.createElement('ui-plugin-panel', { ref, ...rest }, children);
});

PluginPanel.displayName = 'PluginPanel';

export default PluginPanel;
