import * as React from 'react';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/**
 * False on the server and while React hydrates server-rendered HTML, true on a client-only render and
 * once hydration is over. React renders the server snapshot while it hydrates and then re-renders with
 * the client one, so no mismatch is reported. React before 18 has no `useSyncExternalStore`; there the
 * answer is only "is there a document".
 */
export function useIsPastHydration(): boolean {
  const useStore = (React as { useSyncExternalStore?: typeof React.useSyncExternalStore }).useSyncExternalStore;
  return useStore ? useStore(subscribe, clientSnapshot, serverSnapshot) : typeof document !== 'undefined';
}
