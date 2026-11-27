import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type ButtonGroupProps = React.HTMLAttributes<HTMLElement> & {
  orientation?: 'horizontal' | 'vertical';
  /** Passed to child buttons that set no size. */
  size?: 'sm' | 'md' | 'lg';
  /** Spaced buttons that keep their own corners. */
  detached?: boolean;
};

const ATTRS: AttrSpec = { orientation: ['orientation', 'string'], size: ['size', 'string'], detached: ['detached', 'bool'] };

/** Renders the `ui-button-group` element (see @editora/ui-core). */
export const ButtonGroup = React.forwardRef<HTMLElement, ButtonGroupProps>(({ children, ...props }, ref) =>
  createUIElement('ui-button-group', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
ButtonGroup.displayName = 'ButtonGroup';
