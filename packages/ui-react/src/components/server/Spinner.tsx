import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type SpinnerProps = React.HTMLAttributes<HTMLElement> & {
  /** A named size or a CSS length (a number is px). */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
  tone?: 'current' | 'brand' | 'neutral' | 'success' | 'warning' | 'danger';
  variant?: 'ring' | 'dots' | 'bars';
  speed?: 'slow' | 'normal' | 'fast';
  /** What is loading, read by screen readers (default "Loading"). */
  label?: string;
  /** Hide it from assistive technology when the surrounding control already says it is busy. */
  decorative?: boolean;
};

const ATTRS: AttrSpec = { size: ['size', 'string'], tone: ['tone', 'string'], variant: ['variant', 'string'], speed: ['speed', 'string'], label: ['label', 'string'], decorative: ['decorative', 'bool'] };

/** Renders the `ui-spinner` element (see @editora/ui-core). */
export const Spinner = React.forwardRef<HTMLElement, SpinnerProps>(({ children, ...props }, ref) =>
  createUIElement('ui-spinner', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
Spinner.displayName = 'Spinner';
