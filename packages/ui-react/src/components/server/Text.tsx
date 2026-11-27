import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type TextProps = React.HTMLAttributes<HTMLElement> & {
  variant?: 'body' | 'lead' | 'large' | 'small' | 'muted' | 'caption' | 'code' | 'overline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  tone?: 'default' | 'muted' | 'brand' | 'success' | 'warning' | 'danger';
  align?: 'start' | 'center' | 'end';
  /** Flow inside a line instead of being a block. */
  inline?: boolean;
  truncate?: boolean;
  /** Clamp to this many lines. */
  lines?: number;
};

const ATTRS: AttrSpec = { variant: ['variant', 'string'], size: ['size', 'string'], weight: ['weight', 'string'], tone: ['tone', 'string'], align: ['align', 'string'], inline: ['inline', 'bool'], truncate: ['truncate', 'bool'], lines: ['lines', 'string'] };

/** Renders the `ui-text` element (see @editora/ui-core). */
export const Text = React.forwardRef<HTMLElement, TextProps>(({ children, ...props }, ref) =>
  createUIElement('ui-text', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
Text.displayName = 'Text';
