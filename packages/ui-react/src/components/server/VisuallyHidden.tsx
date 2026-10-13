import * as React from 'react';

import { createUIElement } from '../_createElement';

export const VisuallyHidden = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) =>
  createUIElement('ui-visually-hidden', { ref, ...props })
);
VisuallyHidden.displayName = 'VisuallyHidden';
