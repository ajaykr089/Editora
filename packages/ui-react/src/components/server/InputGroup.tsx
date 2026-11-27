import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type InputGroupProps = React.HTMLAttributes<HTMLElement> & {
  size?: 'sm' | 'md' | 'lg';
  /** Marks the group and its control invalid. */
  invalid?: boolean;
  /** Disables the control inside. */
  disabled?: boolean;
  /** No rule between the control and top/bottom rows. */
  borderlessRows?: boolean;
};

const ATTRS: AttrSpec = { size: ['size', 'string'], invalid: ['invalid', 'bool'], disabled: ['disabled', 'bool'], borderlessRows: ['borderless-rows', 'bool'] };

/** Renders the `ui-input-group` element (see @editora/ui-core). */
export const InputGroup = React.forwardRef<HTMLElement, InputGroupProps>(({ children, ...props }, ref) =>
  createUIElement('ui-input-group', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
InputGroup.displayName = 'InputGroup';
