import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type HeadingProps = React.HTMLAttributes<HTMLElement> & {
  /** Outline level (default 2); also sets the default size. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size, independent of the level. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  tone?: 'default' | 'muted' | 'brand';
  align?: 'start' | 'center' | 'end';
  truncate?: boolean;
  /** Balanced line breaks. */
  balance?: boolean;
};

const ATTRS: AttrSpec = { level: ['level', 'string'], size: ['size', 'string'], weight: ['weight', 'string'], tone: ['tone', 'string'], align: ['align', 'string'], truncate: ['truncate', 'bool'], balance: ['balance', 'bool'] };

/** Renders the `ui-heading` element (see @editora/ui-core). */
export const Heading = React.forwardRef<HTMLElement, HeadingProps>(({ children, ...props }, ref) =>
  createUIElement('ui-heading', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
Heading.displayName = 'Heading';
