type UIPlugin = {
  name: string;
  install?: (ctx: any) => void;
};

const registry: Record<string, UIPlugin> = {};

export function registerUIPlugin(p: UIPlugin) {
  if (!p || !p.name) throw new Error('Plugin must have a name');
  registry[p.name] = p;
  if (p.install) p.install({ registerUIPlugin });
}

export function getRegisteredPlugins() {
  return Object.values(registry);
}
