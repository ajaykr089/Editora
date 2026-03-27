import { describe, expect, it, vi } from 'vitest';
import { warnIfElementNotRegistered } from '../components/_internals';

function createDeferredPromise() {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });

  return { promise, resolve };
}

describe('wrapper registration warnings', () => {
  it('waits for any in-flight ui-core registration before warning', async () => {
    const deferred = createDeferredPromise();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    (window as typeof window & { __editoraUICoreRegistrationPromise__?: Promise<void> })
      .__editoraUICoreRegistrationPromise__ = deferred.promise;

    try {
      warnIfElementNotRegistered('ui-test-missing', 'TestComponent');
      expect(warnSpy).not.toHaveBeenCalled();

      deferred.resolve();
      await deferred.promise;
      await Promise.resolve();

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0]?.[0]).toContain('[ui-react/TestComponent] ui-test-missing is not registered.');
    } finally {
      delete (window as typeof window & { __editoraUICoreRegistrationPromise__?: Promise<void> })
        .__editoraUICoreRegistrationPromise__;
      warnSpy.mockRestore();
    }
  });
});
