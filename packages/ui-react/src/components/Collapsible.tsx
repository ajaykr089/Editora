import * as React from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
import { warnIfElementNotRegistered } from './_internals';

export type CollapsibleState = 'idle' | 'loading' | 'error' | 'success';
export type CollapsibleSize = 'sm' | 'md' | 'lg';
export type CollapsibleVariant = 'default' | 'subtle' | 'outline' | 'ghost';
export type CollapsibleTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type CollapsibleIconPosition = 'left' | 'right';
export type CollapsibleToggleDetail = {
  open: boolean;
  previousOpen: boolean;
  source?: 'pointer' | 'keyboard' | 'api';
};

type BaseProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export interface CollapsibleProps extends Omit<BaseProps, 'onToggle' | 'onChange'> {
  open?: boolean;
  headless?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  state?: CollapsibleState;
  size?: CollapsibleSize;
  variant?: CollapsibleVariant;
  tone?: CollapsibleTone;
  radius?: number | string | 'none' | 'sm' | 'md' | 'lg' | 'full';
  iconPosition?: CollapsibleIconPosition;
  closeOnEscape?: boolean;
  onToggle?: (open: boolean) => void;
  onChangeOpen?: (open: boolean) => void;
  onToggleDetail?: (detail: CollapsibleToggleDetail) => void;
  onChangeDetail?: (detail: CollapsibleToggleDetail) => void;
}

export interface CollapsibleHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface CollapsibleCaptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface CollapsibleMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function setBooleanAttribute(element: HTMLElement, name: string, value: boolean | undefined) {
  if (value == null) {
    element.removeAttribute(name);
    return;
  }
  if (value) element.setAttribute(name, '');
  else element.removeAttribute(name);
}

function readDetail(event: Event): CollapsibleToggleDetail | undefined {
  return (event as CustomEvent<CollapsibleToggleDetail>).detail;
}

type CollapsibleComponent = React.ForwardRefExoticComponent<CollapsibleProps & React.RefAttributes<HTMLElement>> & {
  Header: typeof CollapsibleHeader;
  Caption: typeof CollapsibleCaption;
  Meta: typeof CollapsibleMeta;
  Content: typeof CollapsibleContent;
};

const CollapsibleRoot = React.forwardRef<HTMLElement, CollapsibleProps>(function Collapsible(
  {
    open,
    headless,
    disabled,
    readOnly,
    state,
    size,
    variant,
    tone,
    radius,
    iconPosition,
    closeOnEscape,
    onToggle,
    onChangeOpen,
    onToggleDetail,
    onChangeDetail,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-collapsible', 'Collapsible');
  }, []);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Handle radius CSS variable
    if (radius != null && radius !== '' && radius !== 'md') {
      let radiusValue = String(radius);
      // Convert named radius to pixels if needed
      if (typeof radius === 'string' && !radius.includes('px') && !radius.includes('em') && !radius.includes('rem')) {
        const radiusMap: Record<string, string> = {
          'none': '0px',
          'sm': '6px',
          'md': '14px',
          'lg': '20px',
          'full': '9999px',
        };
        radiusValue = radiusMap[radius] || String(radius);
      } else if (typeof radius === 'number') {
        radiusValue = `${radius}px`;
      }
      element.style.setProperty('--ui-collapsible-radius', radiusValue);
    } else {
      element.style.removeProperty('--ui-collapsible-radius');
    }
  }, [radius]);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setBooleanAttribute(element, 'open', open);
    setBooleanAttribute(element, 'headless', headless);
    setBooleanAttribute(element, 'disabled', disabled);
    setBooleanAttribute(element, 'readonly', readOnly);

    const syncAttr = (name: string, next: string | null) => {
      const current = element.getAttribute(name);
      if (next == null) {
        if (current != null) element.removeAttribute(name);
        return;
      }
      if (current !== next) element.setAttribute(name, next);
    };

    syncAttr('state', state && state !== 'idle' ? state : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'neutral' ? tone : null);
    syncAttr('icon-position', iconPosition && iconPosition !== 'right' ? iconPosition : null);
    syncAttr(
      'close-on-escape',
      typeof closeOnEscape === 'boolean' ? (closeOnEscape ? 'true' : 'false') : null
    );
  }, [open, headless, disabled, readOnly, state, size, variant, tone, radius, iconPosition, closeOnEscape]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || (!onToggle && !onChangeOpen && !onToggleDetail && !onChangeDetail)) return;

    const handleToggle = (event: Event) => {
      const detail = readDetail(event);
      if (!detail) return;
      onToggle?.(detail.open);
      onToggleDetail?.(detail);
    };

    const handleChange = (event: Event) => {
      const detail = readDetail(event);
      if (!detail) return;
      onChangeOpen?.(detail.open);
      onChangeDetail?.(detail);
    };

    element.addEventListener('toggle', handleToggle as EventListener);
    element.addEventListener('change', handleChange as EventListener);
    return () => {
      element.removeEventListener('toggle', handleToggle as EventListener);
      element.removeEventListener('change', handleChange as EventListener);
    };
  }, [onToggle, onChangeOpen, onToggleDetail, onChangeDetail]);

  return (
    <ui-collapsible ref={ref as any} {...rest}>
      {children}
    </ui-collapsible>
  );
});

CollapsibleRoot.displayName = 'Collapsible';

export const CollapsibleHeader = React.forwardRef<HTMLDivElement, CollapsibleHeaderProps>(function CollapsibleHeader(
  { children, ...rest },
  ref
) {
  return (
    <div {...rest} ref={ref} slot="header">
      {children}
    </div>
  );
});

CollapsibleHeader.displayName = 'Collapsible.Header';

export const CollapsibleCaption = React.forwardRef<HTMLDivElement, CollapsibleCaptionProps>(
  function CollapsibleCaption({ children, ...rest }, ref) {
    return (
      <div {...rest} ref={ref} slot="caption">
        {children}
      </div>
    );
  }
);

CollapsibleCaption.displayName = 'Collapsible.Caption';

export const CollapsibleMeta = React.forwardRef<HTMLDivElement, CollapsibleMetaProps>(function CollapsibleMeta(
  { children, ...rest },
  ref
) {
  return (
    <div {...rest} ref={ref} slot="meta">
      {children}
    </div>
  );
});

CollapsibleMeta.displayName = 'Collapsible.Meta';

export const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  function CollapsibleContent({ children, ...rest }, ref) {
    return (
      <div {...rest} ref={ref}>
        {children}
      </div>
    );
  }
);

CollapsibleContent.displayName = 'Collapsible.Content';

export const Collapsible = Object.assign(CollapsibleRoot, {
  Header: CollapsibleHeader,
  Caption: CollapsibleCaption,
  Meta: CollapsibleMeta,
  Content: CollapsibleContent,
}) as CollapsibleComponent;

export default Collapsible;
