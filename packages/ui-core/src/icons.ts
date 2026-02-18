const registry: Record<string, string> = {};

export function registerIcon(name: string, svg: string) {
  registry[name] = svg;
}

export function getIcon(name: string) {
  return registry[name] || '';
}

// register a couple default icons
registerIcon('check', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
registerIcon('x', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
