// @vitest-environment node
import { describe, expect, it } from 'vitest';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { toast, toastAdvanced } from '../src/index';
import { toast as liteToast } from '../src/lite';
import { Toaster, toast as reactToast } from '../src/react';

// Shared code (a component rendered on the server, a service) can call toast without a guard.
describe('on the server (no document)', () => {
  it('imports, and every simple-API call does nothing and does not throw', async () => {
    expect(typeof document).toBe('undefined');
    const shown = toast('plain');
    expect(typeof shown.dismiss).toBe('function');
    expect(() => {
      shown.update({ message: 'x' });
      shown.dismiss();
      toast.info('a');
      toast.success('b', { duration: 0 });
      toast.show({ message: 'c', title: 'd' });
      toast.configure({ position: 'top-left' });
      toast.dismiss();
      toast.dismiss('some-id');
      toast.clear();
    }).not.toThrow();
    expect(toast.update('some-id', { message: 'x' })).toBe(false);
  });

  it('toast.promise hands the promise through untouched', async () => {
    await expect(toast.promise(Promise.resolve(7), { loading: 'l', success: 's', error: 'e' })).resolves.toBe(7);
    await expect(toast.promise(Promise.reject(new Error('boom')), { loading: 'l', success: 's', error: 'e' })).rejects.toThrow('boom');
  });

  it('destroy() on the advanced API is safe before anything was shown', () => {
    expect(() => toastAdvanced.destroy()).not.toThrow();
  });

  it('the lite and React entries import too, and <Toaster /> renders nothing on the server', async () => {
    expect(() => liteToast.success('x')).not.toThrow();
    expect(() => reactToast(React.createElement('b', null, 'jsx'))).not.toThrow();
    expect(() => reactToast.custom(() => React.createElement('div'))).not.toThrow();
    await expect(reactToast.promise(Promise.resolve(3), { loading: 'l', success: 's', error: 'e' })).resolves.toBe(3);
    expect(renderToString(React.createElement(Toaster, { position: 'bottom-right' }))).toBe('');
  });
});
