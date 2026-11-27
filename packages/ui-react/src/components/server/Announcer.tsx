import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type AnnouncerProps = React.HTMLAttributes<HTMLElement> & {
  politeness?: 'polite' | 'assertive' | 'off';
  /** Do not announce the text present when it mounts. */
  quiet?: boolean;
};

const ATTRS: AttrSpec = { politeness: ['politeness', 'string'], quiet: ['quiet', 'bool'] };

/** Renders the `ui-announcer` element (see @editora/ui-core). */
export const Announcer = React.forwardRef<HTMLElement, AnnouncerProps>(({ children, ...props }, ref) =>
  createUIElement('ui-announcer', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
Announcer.displayName = 'Announcer';
