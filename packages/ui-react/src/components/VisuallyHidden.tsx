import * as React from 'react';

import '@editora/ui-core/visually-hidden';
import { createUIElement } from './_internals';

export const VisuallyHidden = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) =>
  createUIElement('ui-visually-hidden', { ref, ...props })
);
VisuallyHidden.displayName = 'VisuallyHidden';
