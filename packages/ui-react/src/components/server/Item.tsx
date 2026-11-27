import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type ItemProps = React.HTMLAttributes<HTMLElement> & {
  /** The title (or use a slot="title" child). */
  label?: string;
  description?: string;
  variant?: 'default' | 'outline' | 'muted';
  size?: 'sm' | 'md';
  mediaVariant?: 'icon' | 'image';
  /** Makes the media and text one link; actions stay separate. */
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
};

const ATTRS: AttrSpec = { label: ['label', 'string'], description: ['description', 'string'], variant: ['variant', 'string'], size: ['size', 'string'], mediaVariant: ['media-variant', 'string'], href: ['href', 'string'], target: ['target', 'string'], rel: ['rel', 'string'], disabled: ['disabled', 'bool'] };

/** Renders the `ui-item` element (see @editora/ui-core). */
export const Item = React.forwardRef<HTMLElement, ItemProps>(({ children, ...props }, ref) =>
  createUIElement('ui-item', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
Item.displayName = 'Item';
