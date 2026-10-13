export class LazyLoader {
  // The promise is stored, not the module: a second caller that arrives while the first is still loading gets the same
  // promise, instead of running the loader again.
  private loadedModules = new Map<string, Promise<any>>();

  load<T>(moduleId: string, loader: () => Promise<T>): Promise<T> {
    const existing = this.loadedModules.get(moduleId);
    if (existing) return existing;

    const loading: Promise<T> = new Promise<T>((resolve) => resolve(loader())).catch((error) => {
      // A failed load is not remembered, so the next call tries again.
      if (this.loadedModules.get(moduleId) === loading) this.loadedModules.delete(moduleId);
      throw error;
    });
    this.loadedModules.set(moduleId, loading);
    return loading;
  }

  unload(moduleId: string): void {
    this.loadedModules.delete(moduleId);
  }

  clear(): void {
    this.loadedModules.clear();
  }
}

export const lazyLoader = new LazyLoader();
