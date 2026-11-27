import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type AttachmentGroupProps = React.HTMLAttributes<HTMLElement> & {
  /** Wrapping rows instead of one scrolling row. */
  wrap?: boolean;
};

const ATTRS: AttrSpec = { wrap: ['wrap', 'bool'] };

/** Renders the `ui-attachment-group` element (see @editora/ui-core). */
export const AttachmentGroup = React.forwardRef<HTMLElement, AttachmentGroupProps>(({ children, ...props }, ref) =>
  createUIElement('ui-attachment-group', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
AttachmentGroup.displayName = 'AttachmentGroup';
