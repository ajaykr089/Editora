import * as React from 'react';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

// React before 18 has no useSyncExternalStore. Which of the two hooks below is used is decided once, when
// the module loads, so a component always calls the same one.
const useStore = (React as { useSyncExternalStore?: typeof React.useSyncExternalStore }).useSyncExternalStore;

function useIsPastHydrationFromStore(): boolean {
  return (useStore as typeof React.useSyncExternalStore)(subscribe, clientSnapshot, serverSnapshot);
}

function useIsPastHydrationFromDocument(): boolean {
  return typeof document !== 'undefined';
}

/**
 * False on the server and while React hydrates server-rendered HTML, true on a client-only render and
 * once hydration is over. React renders the server snapshot while it hydrates and then re-renders with
 * the client one, so no mismatch is reported. Without `useSyncExternalStore` (React before 18) the answer
 * is only "is there a document".
 */
export const useIsPastHydration: () => boolean = useStore ? useIsPastHydrationFromStore : useIsPastHydrationFromDocument;
