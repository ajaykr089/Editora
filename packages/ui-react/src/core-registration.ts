type RegistrationHost = typeof globalThis & {
  __editoraUICoreRegistrationPromise__?: Promise<void>;
};

function canRegisterUICore(): boolean {
  return (
    typeof window !== 'undefined'
    && typeof document !== 'undefined'
    && typeof customElements !== 'undefined'
    && typeof HTMLElement !== 'undefined'
  );
}

function getRegistrationHost(): RegistrationHost | null {
  if (typeof globalThis === 'undefined') return null;
  return globalThis as RegistrationHost;
}

export function ensureUICoreRegistration(): Promise<void> | undefined {
  if (!canRegisterUICore()) return undefined;

  const host = getRegistrationHost();
  if (!host) return undefined;

  if (!host.__editoraUICoreRegistrationPromise__) {
    host.__editoraUICoreRegistrationPromise__ = import('@editora/ui-core').then(() => undefined);
  }

  return host.__editoraUICoreRegistrationPromise__;
}

export function primeUICoreRegistration(): void {
  void ensureUICoreRegistration();
}
