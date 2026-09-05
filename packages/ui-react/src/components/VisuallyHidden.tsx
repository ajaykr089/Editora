import * as React from 'react';

import '@editora/ui-core/visually-hidden';
export const VisuallyHidden = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-visually-hidden ref={ref as any} {...props} />
));
VisuallyHidden.displayName = 'VisuallyHidden';
