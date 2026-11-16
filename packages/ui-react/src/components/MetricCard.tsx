// The server implementation draws the icon element for icon names. Define it here, in the client
// entry, as its own chunk (as Dropdown and Menu do) so the wrapper's first load stays small.
// `as string`: tsc would resolve the subpath, whose types only exist after the full ui-core build.
if (typeof window !== 'undefined' && typeof customElements !== 'undefined' && !customElements.get('ui-icon')) {
  void import('@editora/ui-core/icon' as string);
}
export * from './server/MetricCard';
export { default } from './server/MetricCard';
