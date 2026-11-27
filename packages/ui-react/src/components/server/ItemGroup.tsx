import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type ItemGroupProps = React.HTMLAttributes<HTMLElement> & {
  /** A rule between items instead of a gap. */
  divided?: boolean;
};

const ATTRS: AttrSpec = { divided: ['divided', 'bool'] };

/** Renders the `ui-item-group` element (see @editora/ui-core). */
export const ItemGroup = React.forwardRef<HTMLElement, ItemGroupProps>(({ children, ...props }, ref) =>
  createUIElement('ui-item-group', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
ItemGroup.displayName = 'ItemGroup';
