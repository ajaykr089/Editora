import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type FileUploadRejectedFile = {
  file: File;
  reason: 'accept' | 'max-size' | 'max-files';
};

type BaseFileUploadProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
  name?: string;
  label?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  maxFiles?: number;
  maxSize?: number;
  buttonText?: string;
  dropLabel?: string;
  showPreviews?: boolean;
  progress?: Record<string, number>;
  onChange?: (files: File[]) => void;
  onReject?: (rejected: FileUploadRejectedFile[]) => void;
};

function useFileUploadBridge(
  ref: React.MutableRefObject<HTMLElement | null>,
  { onChange, onReject }: Pick<BaseFileUploadProps, 'onChange' | 'onReject'>
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ files?: File[] }>).detail;
      if (Array.isArray(detail?.files)) onChange?.(detail.files);
    };

    const handleReject = (event: Event) => {
      const detail = (event as CustomEvent<{ rejected?: FileUploadRejectedFile[] }>).detail;
      if (Array.isArray(detail?.rejected)) onReject?.(detail.rejected);
    };

    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('reject', handleReject as EventListener);
    return () => {
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('reject', handleReject as EventListener);
    };
  }, [onChange, onReject, ref]);
}

function useFileUploadAttrs(
  ref: React.MutableRefObject<HTMLElement | null>,
  {
    name,
    label,
    description,
    accept,
    multiple,
    disabled,
    required,
    maxFiles,
    maxSize,
    buttonText,
    dropLabel,
    showPreviews,
    progress
  }: Omit<BaseFileUploadProps, 'onChange' | 'onReject'>
) {
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (attr: string, next: string | null) => {
      const current = el.getAttribute(attr);
      if (next == null) {
        if (current != null) el.removeAttribute(attr);
        return;
      }
      if (current !== next) el.setAttribute(attr, next);
    };

    const syncBoolean = (attr: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(attr)) el.setAttribute(attr, '');
      } else if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    };

    syncAttr('name', name ?? null);
    syncAttr('label', label ?? null);
    syncAttr('description', description ?? null);
    syncAttr('accept', accept ?? null);
    syncBoolean('multiple', multiple);
    syncBoolean('disabled', disabled);
    syncBoolean('required', required);
    syncAttr('max-files', typeof maxFiles === 'number' ? String(maxFiles) : null);
    syncAttr('max-size', typeof maxSize === 'number' ? String(maxSize) : null);
    syncAttr('button-text', buttonText ?? null);
    syncAttr('drop-label', dropLabel ?? null);
    syncBoolean('show-previews', showPreviews);
    syncAttr('progress', progress ? JSON.stringify(progress) : null);
  }, [accept, buttonText, description, disabled, dropLabel, label, maxFiles, maxSize, multiple, name, ref, required, showPreviews, progress]);
}

export const FileUpload = React.forwardRef<HTMLElement, BaseFileUploadProps>(function FileUpload(
  { onChange, onReject, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);
  useFileUploadBridge(ref, { onChange, onReject });
  useFileUploadAttrs(ref, rest);
  return React.createElement('ui-file-upload', { ref, ...rest }, children);
});

export const Dropzone = React.forwardRef<HTMLElement, BaseFileUploadProps>(function Dropzone(
  { onChange, onReject, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);
  useFileUploadBridge(ref, { onChange, onReject });
  useFileUploadAttrs(ref, rest);
  return React.createElement('ui-dropzone', { ref, ...rest }, children);
});

FileUpload.displayName = 'FileUpload';
Dropzone.displayName = 'Dropzone';

export default FileUpload;
