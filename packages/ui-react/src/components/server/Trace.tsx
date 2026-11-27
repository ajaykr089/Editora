import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type TraceProps = React.HTMLAttributes<HTMLElement> & {
  /** Names the list ("Agent activity"). */
  label?: string;
};

const ATTRS: AttrSpec = { label: ['label', 'string'] };

/** Renders the `ui-trace` element (see @editora/ui-core). */
export const Trace = React.forwardRef<HTMLElement, TraceProps>(({ children, ...props }, ref) =>
  createUIElement('ui-trace', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
Trace.displayName = 'Trace';
