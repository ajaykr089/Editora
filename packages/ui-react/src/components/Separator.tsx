import * as React from 'react';

import '@editora/ui-core/separator';
import { createUIElement } from './_internals';

export type SeparatorProps = React.HTMLAttributes<HTMLElement> & {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted' | 'gradient' | 'glow';
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
  size?: 'thin' | 'medium' | 'thick';
  inset?: 'none' | 'sm' | 'md' | 'lg';
  label?: string;
  decorative?: boolean;
  headless?: boolean;
};

export const Separator = React.forwardRef<HTMLElement, SeparatorProps>((props, ref) =>
  createUIElement('ui-separator', { ref, ...props })
);
Separator.displayName = 'Separator';
