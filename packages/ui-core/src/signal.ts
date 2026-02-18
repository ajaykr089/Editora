type Subscriber = () => void;

// Full minimal reactive system with per-effect dependency tracking and cleanup
const currentEffectStack: Array<EffectRunner> = [];

type EffectRunner = () => void;

const effectDeps = new WeakMap<EffectRunner, Set<Signal<any>>>();

class Signal<T> {
  private value: T;
  private subs = new Set<EffectRunner>();
  constructor(v: T) { this.value = v; }
  get(): T {
    const eff = currentEffectStack[currentEffectStack.length - 1];
    if (eff) {
      this.subs.add(eff);
      let deps = effectDeps.get(eff);
      if (!deps) { deps = new Set(); effectDeps.set(eff, deps); }
      deps.add(this);
    }
    return this.value;
  }
  set(v: T) {
    if (Object.is(this.value, v)) return;
    this.value = v;
    const subs = Array.from(this.subs);
    for (const s of subs) s();
  }
  removeSubscriber(eff: EffectRunner) { this.subs.delete(eff); }
}

export function createSignal<T>(initial: T) {
  const s = new Signal<T>(initial);
  return {
    get: () => s.get(),
    set: (v: T) => s.set(v),
    subscribe: (fn: () => void) => {
      // expose for compatibility
      const runner = () => fn();
      s['subs'].add(runner as EffectRunner);
      return () => s['subs'].delete(runner as EffectRunner);
    }
  };
}

function cleanupEffect(eff: EffectRunner) {
  const deps = effectDeps.get(eff);
  if (!deps) return;
  for (const sig of deps) {
    sig.removeSubscriber(eff);
  }
  effectDeps.delete(eff);
}

export function effect(fn: (() => void) | (() => (() => void))) {
  let cleanup: (() => void) | undefined;
  const runner: EffectRunner = () => {
    // cleanup previous subscriptions
    cleanupEffect(runner);
    if (cleanup) { try { cleanup(); } catch (e) {} }
    currentEffectStack.push(runner);
    try {
      const ret = (fn as any)();
      if (typeof ret === 'function') cleanup = ret as () => void;
      else cleanup = undefined;
    } finally {
      currentEffectStack.pop();
    }
  };
  runner();
  return () => {
    cleanupEffect(runner);
    if (cleanup) { try { cleanup(); } catch (e) {} }
  };
}

export function computed<T>(fn: () => T) {
  let cache: T;
  let dirty = true;
  const compute = () => {
    dirty = false;
    // run effect-like to track deps
    const runner = () => { cache = fn(); };
    // attach temporary effect to collect deps
    currentEffectStack.push(runner as EffectRunner);
    try { cache = fn(); } finally { currentEffectStack.pop(); }
  };
  return {
    get(): T {
      if (dirty) compute();
      return cache as T;
    }
  };
}
