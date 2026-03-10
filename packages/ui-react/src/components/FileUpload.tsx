import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type FileUploadRejectedFile = {
  file: File;
  reason: 'accept' | 'max-size' | 'max-files';
};

export type FileUploadUploadContext = {
  file: File;
  files: File[];
  signal: AbortSignal;
  setProgress: (progress: number) => void;
};

export type FileUploadUploadRequest = (context: FileUploadUploadContext) => Promise<unknown> | unknown;

type UploadLifecycleDetail = {
  file?: File;
  fileKey?: string;
  files?: File[];
  progress?: number;
  requestId?: number;
  result?: unknown;
  error?: string;
  statuses?: Record<string, unknown>;
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
  uploadOnSelect?: boolean;
  uploadButtonText?: string;
  onUploadRequest?: FileUploadUploadRequest;
  onChange?: (files: File[]) => void;
  onReject?: (rejected: FileUploadRejectedFile[]) => void;
  onUploadStart?: (detail: UploadLifecycleDetail) => void;
  onUploadProgress?: (detail: UploadLifecycleDetail) => void;
  onUploadSuccess?: (detail: UploadLifecycleDetail) => void;
  onUploadError?: (detail: UploadLifecycleDetail) => void;
  onUploadCancel?: (detail: UploadLifecycleDetail) => void;
  onUploadComplete?: (detail: UploadLifecycleDetail) => void;
};

function useFileUploadBridge(
  ref: React.MutableRefObject<HTMLElement | null>,
  {
    onChange,
    onReject,
    onUploadStart,
    onUploadProgress,
    onUploadSuccess,
    onUploadError,
    onUploadCancel,
    onUploadComplete
  }: Pick<BaseFileUploadProps, 'onChange' | 'onReject' | 'onUploadStart' | 'onUploadProgress' | 'onUploadSuccess' | 'onUploadError' | 'onUploadCancel' | 'onUploadComplete'>
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

    const forward = (handler?: (detail: UploadLifecycleDetail) => void) => (event: Event) => {
      handler?.((event as CustomEvent<UploadLifecycleDetail>).detail || {});
    };

    const handleUploadStart = forward(onUploadStart);
    const handleUploadProgress = forward(onUploadProgress);
    const handleUploadSuccess = forward(onUploadSuccess);
    const handleUploadError = forward(onUploadError);
    const handleUploadCancel = forward(onUploadCancel);
    const handleUploadComplete = forward(onUploadComplete);

    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('reject', handleReject as EventListener);
    el.addEventListener('upload-start', handleUploadStart as EventListener);
    el.addEventListener('upload-progress', handleUploadProgress as EventListener);
    el.addEventListener('upload-success', handleUploadSuccess as EventListener);
    el.addEventListener('upload-error', handleUploadError as EventListener);
    el.addEventListener('upload-cancel', handleUploadCancel as EventListener);
    el.addEventListener('upload-complete', handleUploadComplete as EventListener);
    return () => {
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('reject', handleReject as EventListener);
      el.removeEventListener('upload-start', handleUploadStart as EventListener);
      el.removeEventListener('upload-progress', handleUploadProgress as EventListener);
      el.removeEventListener('upload-success', handleUploadSuccess as EventListener);
      el.removeEventListener('upload-error', handleUploadError as EventListener);
      el.removeEventListener('upload-cancel', handleUploadCancel as EventListener);
      el.removeEventListener('upload-complete', handleUploadComplete as EventListener);
    };
  }, [onChange, onReject, onUploadCancel, onUploadComplete, onUploadError, onUploadProgress, onUploadStart, onUploadSuccess, ref]);
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
    progress,
    uploadOnSelect,
    uploadButtonText,
    onUploadRequest
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
    syncBoolean('upload-on-select', uploadOnSelect);
    syncAttr('upload-button-text', uploadButtonText ?? null);
    syncAttr('progress', progress ? JSON.stringify(progress) : null);
    (el as HTMLElement & { uploadRequest?: FileUploadUploadRequest | null }).uploadRequest = onUploadRequest ?? null;
  }, [accept, buttonText, description, disabled, dropLabel, label, maxFiles, maxSize, multiple, name, ref, required, showPreviews, progress, uploadOnSelect, uploadButtonText, onUploadRequest]);
}

export const FileUpload = React.forwardRef<HTMLElement, BaseFileUploadProps>(function FileUpload(
  { onChange, onReject, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);
  useFileUploadBridge(ref, { onChange, onReject, ...rest });
  useFileUploadAttrs(ref, rest);
  return React.createElement('ui-file-upload', { ref, ...rest }, children);
});

export const Dropzone = React.forwardRef<HTMLElement, BaseFileUploadProps>(function Dropzone(
  { onChange, onReject, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);
  useFileUploadBridge(ref, { onChange, onReject, ...rest });
  useFileUploadAttrs(ref, rest);
  return React.createElement('ui-dropzone', { ref, ...rest }, children);
});

FileUpload.displayName = 'FileUpload';
Dropzone.displayName = 'Dropzone';

export default FileUpload;
