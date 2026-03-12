import React from 'react';
import { warnIfElementNotRegistered } from './_internals';

const CARD_RUNTIME_STYLE_ID = 'editora-ui-react-card-runtime-styles';

function ensureCardRuntimeStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(CARD_RUNTIME_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = CARD_RUNTIME_STYLE_ID;
  style.textContent = `
    ui-card [data-ui-card-header] {
      display: grid;
      gap: var(--ui-card-header-gap, 4px);
    }

    ui-card [data-ui-card-footer] {
      font-size: var(--ui-card-footer-size, 13px);
      line-height: var(--ui-card-footer-line-height, 18px);
      color: var(--ui-color-muted, #64748b);
    }

    ui-card [data-ui-card-media] {
      display: block;
      min-block-size: var(--ui-card-media-min-height, 148px);
    }

    ui-card [data-ui-card-title] {
      display: block;
      margin: 0;
      font-size: var(--ui-card-title-size, 18px);
      line-height: var(--ui-card-title-line-height, 24px);
      font-weight: 700;
      color: var(--ui-color-text, #202020);
    }

    ui-card [data-ui-card-description] {
      display: block;
      margin: 0;
      font-size: var(--ui-card-description-size, 14px);
      line-height: var(--ui-card-description-line-height, 20px);
      color: var(--ui-color-muted, #64748b);
    }
  `;
  document.head.appendChild(style);
}

export type CardProps = React.HTMLAttributes<HTMLElement> & {
  variant?: 'surface' | 'outline' | 'soft' | 'solid' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  radius?: number | string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  elevation?: 'none' | 'low' | 'high';
  interactive?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
};

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { variant, size, radius, tone, elevation, interactive, disabled, children, ...rest },
  ref
) {
  React.useEffect(() => {
    warnIfElementNotRegistered('ui-card', 'Card');
    ensureCardRuntimeStyles();
  }, []);

  const props: Record<string, unknown> = { ref, ...rest };
  if (variant) props.variant = variant;
  if (size) props.size = size;
  if (radius !== undefined) props.radius = String(radius);
  if (tone) props.tone = tone;
  if (elevation) props.elevation = elevation;
  if (interactive) props.interactive = true;
  if (disabled) props.disabled = true;
  return React.createElement('ui-card', props, children);
});

export interface CardSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

function createCardSection(
  defaultTag: keyof JSX.IntrinsicElements,
  displayName: string,
  slot?: string,
  dataAttr?: string
) {
  const Component = React.forwardRef<HTMLElement, CardSectionProps>(function CardSection(
    { as, children, style, ...rest },
    forwardedRef
  ) {
    const Tag = (as || defaultTag) as keyof JSX.IntrinsicElements;
    const props: Record<string, unknown> = { ref: forwardedRef, ...rest };
    if (slot) props.slot = slot;
    if (dataAttr) props[dataAttr] = '';
    if (style) props.style = style;
    return React.createElement(Tag, props, children);
  });
  Component.displayName = displayName;
  return Component;
}

export const CardHeader = createCardSection('div', 'CardHeader', 'header', 'data-ui-card-header');
export const CardFooter = createCardSection('div', 'CardFooter', 'footer', 'data-ui-card-footer');
export const CardInset = createCardSection('div', 'CardInset', 'inset');
export const CardMedia = createCardSection('div', 'CardMedia', 'media', 'data-ui-card-media');
export const CardTitle = createCardSection('h3', 'CardTitle', undefined, 'data-ui-card-title');
export const CardDescription = createCardSection('p', 'CardDescription', undefined, 'data-ui-card-description');

export default Card;
