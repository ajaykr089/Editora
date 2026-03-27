import * as React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
  warnIfElementNotRegistered,
} from './_internals';

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
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-collapsible', 'Collapsible');
  }, []);

  useElementAttributes(ref, (element) => {
    if (radius != null && radius !== '' && radius !== 'md') {
      let radiusValue = String(radius);
      if (typeof radius === 'string' && !radius.includes('px') && !radius.includes('em') && !radius.includes('rem')) {
        const radiusMap: Record<string, string> = {
          none: '0px',
          sm: '6px',
          md: '14px',
          lg: '20px',
          full: '9999px',
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

  useElementAttributes(ref, (element) => {
    syncBooleanAttribute(element, 'open', open);
    syncBooleanAttribute(element, 'headless', headless);
    syncBooleanAttribute(element, 'disabled', disabled);
    syncBooleanAttribute(element, 'readonly', readOnly);
    syncStringAttribute(element, 'state', state && state !== 'idle' ? state : null);
    syncStringAttribute(element, 'size', size && size !== 'md' ? size : null);
    syncStringAttribute(element, 'variant', variant && variant !== 'default' ? variant : null);
    syncStringAttribute(element, 'tone', tone && tone !== 'neutral' ? tone : null);
    syncStringAttribute(element, 'icon-position', iconPosition && iconPosition !== 'right' ? iconPosition : null);
    syncStringAttribute(
      element,
      'close-on-escape',
      typeof closeOnEscape === 'boolean' ? (closeOnEscape ? 'true' : 'false') : null
    );
  }, [open, headless, disabled, readOnly, state, size, variant, tone, iconPosition, closeOnEscape]);

  const handleToggle = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<CollapsibleToggleDetail>(event);
    if (!detail) return;
    onToggle?.(detail.open);
    onToggleDetail?.(detail);
  }, [onToggle, onToggleDetail]);

  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<CollapsibleToggleDetail>(event);
    if (!detail) return;
    onChangeOpen?.(detail.open);
    onChangeDetail?.(detail);
  }, [onChangeOpen, onChangeDetail]);

  useElementEventListeners(
    ref,
    [
      { type: 'toggle', listener: handleToggle },
      { type: 'change', listener: handleChange },
    ],
    [handleToggle, handleChange]
  );

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
