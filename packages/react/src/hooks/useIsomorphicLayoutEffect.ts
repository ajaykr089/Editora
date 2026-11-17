import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` where there is a DOM, `useEffect` on the server. React 18 logs a warning every time
 * a component that calls `useLayoutEffect` is rendered to a string; the effect never runs there anyway.
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
