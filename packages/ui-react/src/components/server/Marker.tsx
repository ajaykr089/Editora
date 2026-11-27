import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type MarkerProps = React.HTMLAttributes<HTMLElement> & {
  variant?: 'default' | 'border' | 'separator';
  /** A status whose text changes are announced. */
  live?: boolean;
  /** Animate the text while work is in progress. */
  shimmer?: boolean;
};

const ATTRS: AttrSpec = { variant: ['variant', 'string'], live: ['live', 'bool'], shimmer: ['shimmer', 'bool'] };

/** Renders the `ui-marker` element (see @editora/ui-core). */
export const Marker = React.forwardRef<HTMLElement, MarkerProps>(({ children, ...props }, ref) =>
  createUIElement('ui-marker', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
Marker.displayName = 'Marker';
