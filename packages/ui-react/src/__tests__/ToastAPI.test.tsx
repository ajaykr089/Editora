import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const toastMocks = vi.hoisted(() => ({
  configure: vi.fn(),
  show: vi.fn(() => ({ id: 'toast-1' })),
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  loading: vi.fn(),
  dismiss: vi.fn(),
  clear: vi.fn()
}));

vi.mock('@editora/toast', () => ({
  __esModule: true,
  default: {},
  toastLegacy: {},
  toastPro: {},
  toastAdvanced: {
    show: toastMocks.show,
    success: toastMocks.success,
    error: toastMocks.error,
    warning: toastMocks.warning,
    info: toastMocks.info,
    loading: toastMocks.loading,
    dismiss: toastMocks.dismiss,
    clear: toastMocks.clear,
    configure: toastMocks.configure
  }
}));

import { ToastAPI, ToastProvider, toastApi, useToast } from '../components/ToastAPI';

describe('Toast API wrappers', () => {
  it('applies provider and component config through toastAdvanced.configure', () => {
    render(
      <>
        <ToastAPI config={{ position: 'bottom-right' }} />
        <ToastProvider config={{ theme: 'glass' }}>
          <div>content</div>
        </ToastProvider>
      </>
    );

    expect(toastMocks.configure).toHaveBeenCalledWith({ position: 'bottom-right' });
    expect(toastMocks.configure).toHaveBeenCalledWith({ theme: 'glass' });
  });

  it('returns the shared toast API from useToast', () => {
    let api: ReturnType<typeof useToast> | null = null;

    function Harness() {
      api = useToast();
      return null;
    }

    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>
    );

    api?.success('Saved');
    expect(toastMocks.success).toHaveBeenCalledWith('Saved', {});
    expect(api).toBe(toastApi);
  });
});
