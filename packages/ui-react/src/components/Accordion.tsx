import * as React from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
import { warnIfElementNotRegistered } from './_internals';

type OpenValue = number | number[];

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onToggle'> {
  multiple?: boolean;
  collapsible?: boolean;
  open?: OpenValue;
  variant?: 'surface' | 'outline' | 'soft' | 'solid' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  radius?: number | string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  indicator?: 'line' | 'none';
  shape?: 'default' | 'square' | 'pill';
  elevation?: 'default' | 'none' | 'low' | 'high';
  onToggle?: (open: OpenValue) => void;
  onChangeOpen?: (open: OpenValue) => void;
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  description?: string;
  badge?: string;
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface AccordionPanelProps extends React.HTMLAttributes<HTMLDivElement> {}

function setBooleanAttribute(element: HTMLElement, name: string, value: boolean | undefined) {
  if (value == null) {
    element.removeAttribute(name);
    return;
  }
  if (value) element.setAttribute(name, '');
  else element.removeAttribute(name);
}

function setAttributeValue(element: HTMLElement, name: string, value: string | null) {
  const current = element.getAttribute(name);
  if (value == null || value === '') {
    if (current != null) element.removeAttribute(name);
    return;
  }
  if (current !== value) element.setAttribute(name, value);
}

function readOpen(event: Event): OpenValue | undefined {
  return (event as CustomEvent<{ open?: OpenValue }>).detail?.open;
}

export const Accordion = React.forwardRef<HTMLElement, AccordionProps>(function Accordion(
  { multiple, collapsible, open, variant, size, radius, tone, indicator, shape, elevation, onToggle, onChangeOpen, children, ...rest },
  forwardedRef
) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-accordion', 'Accordion');
  }, []);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    setBooleanAttribute(element, 'multiple', multiple);
    if (collapsible == null) element.removeAttribute('collapsible');
    else element.setAttribute('collapsible', String(Boolean(collapsible)));

    if (open == null) element.removeAttribute('open');
    else element.setAttribute('open', Array.isArray(open) ? JSON.stringify(open) : String(open));
    setAttributeValue(element, 'variant', variant && variant !== 'surface' ? variant : null);
    setAttributeValue(element, 'size', size && size !== 'md' ? size : null);
    setAttributeValue(element, 'radius', radius != null ? String(radius) : null);
    setAttributeValue(element, 'tone', tone && tone !== 'neutral' ? tone : null);
    setAttributeValue(element, 'indicator', indicator && indicator !== 'line' ? indicator : null);
    setAttributeValue(element, 'shape', shape && shape !== 'default' ? shape : null);
    setAttributeValue(element, 'elevation', elevation && elevation !== 'default' ? elevation : null);
  }, [multiple, collapsible, open, variant, size, radius, tone, indicator, shape, elevation]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || (!onToggle && !onChangeOpen)) return;

    const handleToggle = (event: Event) => {
      const next = readOpen(event);
      if (next != null) onToggle?.(next);
    };

    const handleChange = (event: Event) => {
      const next = readOpen(event);
      if (next != null) onChangeOpen?.(next);
    };

    element.addEventListener('toggle', handleToggle as EventListener);
    element.addEventListener('change', handleChange as EventListener);
    return () => {
      element.removeEventListener('toggle', handleToggle as EventListener);
      element.removeEventListener('change', handleChange as EventListener);
    };
  }, [onToggle, onChangeOpen]);

  return React.createElement('ui-accordion', { ref, ...rest }, children);
});

Accordion.displayName = 'Accordion';

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { disabled, description, badge, children, ...rest },
  forwardedRef
) {
  const props: Record<string, unknown> = {
    ref: forwardedRef,
    'data-ui-accordion-item': '',
    ...rest,
  };
  if (disabled) props.disabled = true;
  if (description != null) props['data-description'] = String(description);
  if (badge != null) props['data-badge'] = String(badge);
  return React.createElement('div', props, children);
});

AccordionItem.displayName = 'AccordionItem';

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(function AccordionTrigger(
  { type, children, ...rest },
  forwardedRef
) {
  return React.createElement(
    'button',
    {
      ref: forwardedRef,
      type: type || 'button',
      'data-ui-accordion-trigger': '',
      ...rest,
    },
    children
  );
});

AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionPanel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(function AccordionPanel(
  { children, ...rest },
  forwardedRef
) {
  return React.createElement(
    'div',
    {
      ref: forwardedRef,
      'data-ui-accordion-panel': '',
      ...rest,
    },
    children
  );
});

AccordionPanel.displayName = 'AccordionPanel';
