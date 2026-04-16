import type * as React from 'react';

type UIIntrinsicElementMap = {
  [tagName: `ui-${string}`]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends UIIntrinsicElementMap {}
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements extends UIIntrinsicElementMap {}
    }
  }
}

export {};
