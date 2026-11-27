import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type NativeSelectProps = React.HTMLAttributes<HTMLElement> & {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'soft' | 'ghost';
  invalid?: boolean;
  /** As wide as its content instead of the full width. */
  inline?: boolean;
};

const ATTRS: AttrSpec = { size: ['size', 'string'], variant: ['variant', 'string'], invalid: ['invalid', 'bool'], inline: ['inline', 'bool'] };

/** Renders the `ui-native-select` element (see @editora/ui-core). */
export const NativeSelect = React.forwardRef<HTMLElement, NativeSelectProps>(({ children, ...props }, ref) =>
  createUIElement('ui-native-select', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
NativeSelect.displayName = 'NativeSelect';
