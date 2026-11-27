import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type BubbleGroupProps = React.HTMLAttributes<HTMLElement>;

const ATTRS: AttrSpec = {};

/** Renders the `ui-bubble-group` element (see @editora/ui-core). */
export const BubbleGroup = React.forwardRef<HTMLElement, BubbleGroupProps>(({ children, ...props }, ref) =>
  createUIElement('ui-bubble-group', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
BubbleGroup.displayName = 'BubbleGroup';
