import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type BubbleProps = React.HTMLAttributes<HTMLElement> & {
  variant?: 'default' | 'secondary' | 'muted' | 'tinted' | 'outline' | 'ghost' | 'destructive';
  /** Defaults to the enclosing Message side. */
  align?: 'start' | 'end';
  /** Makes the bubble a link (a suggestion). */
  href?: string;
  target?: string;
  reactionsSide?: 'top' | 'bottom';
  reactionsAlign?: 'start' | 'end';
};

const ATTRS: AttrSpec = { variant: ['variant', 'string'], align: ['align', 'string'], href: ['href', 'string'], target: ['target', 'string'], reactionsSide: ['reactions-side', 'string'], reactionsAlign: ['reactions-align', 'string'] };

/** Renders the `ui-bubble` element (see @editora/ui-core). */
export const Bubble = React.forwardRef<HTMLElement, BubbleProps>(({ children, ...props }, ref) =>
  createUIElement('ui-bubble', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
Bubble.displayName = 'Bubble';
