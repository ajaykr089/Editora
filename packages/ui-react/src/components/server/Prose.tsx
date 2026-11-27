import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type ProseProps = React.HTMLAttributes<HTMLElement> & {
  size?: 'sm' | 'md' | 'lg';
  /** Keep lines to a readable width (about 68 characters). */
  measure?: boolean;
};

const ATTRS: AttrSpec = { size: ['size', 'string'], measure: ['measure', 'bool'] };

/** Renders the `ui-prose` element (see @editora/ui-core). */
export const Prose = React.forwardRef<HTMLElement, ProseProps>(({ children, ...props }, ref) =>
  createUIElement('ui-prose', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
Prose.displayName = 'Prose';
