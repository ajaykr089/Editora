'use client';
import { useRef, useCallback } from 'react';

export function useForm() {
  const ref = useRef<HTMLElement | null>(null);

  const submit = useCallback(async () => {
    const el: any = ref.current;
    if (!el) return false;
    return await el.submit();
  }, []);

  const validate = useCallback(async () => {
    const el: any = ref.current;
    if (!el) return { valid: true, errors: {} };
    return await el.validate();
  }, []);

  const getValues = useCallback(() => {
    const el: any = ref.current;
    return el ? el.getValues?.() : {};
  }, []);

  const reset = useCallback((values?: Record<string, any>) => {
    const el: any = ref.current;
    return el?.reset?.(values);
  }, []);

  const isDirty = useCallback(() => {
    const el: any = ref.current;
    if (!el) return false;
    if (typeof el.isDirty === 'function') return !!el.isDirty();
    return el.hasAttribute?.('dirty') || false;
  }, []);

  const markClean = useCallback((values?: Record<string, any>) => {
    const el: any = ref.current;
    return el?.markClean?.(values);
  }, []);

  return { ref, submit, validate, getValues, reset, isDirty, markClean } as const;
}

export default useForm;
