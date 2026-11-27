import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type AccessibleIconProps = React.HTMLAttributes<HTMLElement> & {
  /** The name assistive technology reads for the icon. */
  label?: string;
};

const ATTRS: AttrSpec = { label: ['label', 'string'] };

/** Renders the `ui-accessible-icon` element (see @editora/ui-core). */
export const AccessibleIcon = React.forwardRef<HTMLElement, AccessibleIconProps>(({ children, ...props }, ref) =>
  createUIElement('ui-accessible-icon', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
AccessibleIcon.displayName = 'AccessibleIcon';
