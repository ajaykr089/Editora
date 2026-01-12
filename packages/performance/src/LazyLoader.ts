export class LazyLoader {
  private loadedModules = new Map<string, any>();

  async load<T>(moduleId: string, loader: () => Promise<T>): Promise<T> {
    if (this.loadedModules.has(moduleId)) {
      return this.loadedModules.get(moduleId);
    }

    const module = await loader();
    this.loadedModules.set(moduleId, module);
    return module;
  }

  unload(moduleId: string): void {
    this.loadedModules.delete(moduleId);
  }

  clear(): void {
    this.loadedModules.clear();
  }
}

export const lazyLoader = new LazyLoader();