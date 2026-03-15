import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type FormElement = HTMLElement & {
  submit: () => Promise<boolean>;
  requestSubmit?: () => Promise<boolean>;
  validate: () => Promise<{ valid: boolean; errors: Record<string, string | undefined> }>;
  getValues: () => Record<string, any>;
  setValue?: (name: string, value: any) => void;
  setValues?: (values: Record<string, any>) => void;
  reset?: (values?: Record<string, any>) => void;
};

export type FormProps = Omit<React.HTMLAttributes<HTMLElement>, 'onSubmit'> & {
  children?: React.ReactNode;
  onSubmit?: (values: Record<string, any>) => void;
  onInvalid?: (errors: Record<string, string | undefined>, values: Record<string, any>) => void;
  onValidate?: (result: { valid: boolean; errors: Record<string, string | undefined> }) => void;
  onAutosave?: (values: Record<string, any>) => void;
  onDirtyChange?: (dirty: boolean, values: Record<string, any>) => void;
  novalidate?: boolean;
  autosave?: boolean;
  autosaveDelay?: number;
  guardUnsaved?: boolean;
  heading?: string;
  description?: string;
  state?: 'default' | 'success' | 'warning' | 'error';
  stateText?: string;
  loadingText?: string;
  variant?: 'default' | 'surface' | 'outline' | 'soft' | 'contrast' | 'minimal' | 'elevated';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  gap?: string;
  headless?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

export type FormActionsProps = React.HTMLAttributes<HTMLDivElement>;

export type FormStatusProps = React.HTMLAttributes<HTMLDivElement>;

export type FormTitleProps = React.HTMLAttributes<HTMLDivElement>;

type FormComponent = React.ForwardRefExoticComponent<FormProps & React.RefAttributes<HTMLElement>> & {
  Actions: typeof FormActions;
  Status: typeof FormStatus;
  Title: typeof FormTitle;
};

const FormRoot = React.forwardRef<HTMLElement, FormProps>(function Form(
  {
    children,
    onSubmit,
    onInvalid,
    onValidate,
    onAutosave,
    onDirtyChange,
    novalidate,
    autosave,
    autosaveDelay,
    guardUnsaved,
    heading,
    description,
    state,
    stateText,
    loadingText,
    variant,
    tone,
    density,
    shape,
    elevation,
    gap,
    headless,
    loading,
    disabled,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<FormElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleSubmit = (event: Event) => {
      const detail = (event as CustomEvent<{ values?: Record<string, any> }>).detail || {};
      onSubmit?.(detail.values || {});
    };

    const handleInvalid = (event: Event) => {
      const detail = (event as CustomEvent<{ errors?: Record<string, string | undefined>; values?: Record<string, any> }>).detail || {};
      onInvalid?.(detail.errors || {}, detail.values || {});
    };

    const handleValidate = (event: Event) => {
      const detail = (event as CustomEvent<{ valid?: boolean; errors?: Record<string, string | undefined> }>).detail || {};
      onValidate?.({ valid: !!detail.valid, errors: detail.errors || {} });
    };

    const handleAutosave = (event: Event) => {
      const detail = (event as CustomEvent<{ values?: Record<string, any> }>).detail || {};
      onAutosave?.(detail.values || {});
    };

    const handleDirty = (event: Event) => {
      const detail = (event as CustomEvent<{ dirty?: boolean; values?: Record<string, any> }>).detail || {};
      onDirtyChange?.(!!detail.dirty, detail.values || {});
    };

    el.addEventListener('submit', handleSubmit as EventListener);
    el.addEventListener('invalid', handleInvalid as EventListener);
    el.addEventListener('validate', handleValidate as EventListener);
    el.addEventListener('autosave', handleAutosave as EventListener);
    el.addEventListener('dirty-change', handleDirty as EventListener);

    return () => {
      el.removeEventListener('submit', handleSubmit as EventListener);
      el.removeEventListener('invalid', handleInvalid as EventListener);
      el.removeEventListener('validate', handleValidate as EventListener);
      el.removeEventListener('autosave', handleAutosave as EventListener);
      el.removeEventListener('dirty-change', handleDirty as EventListener);
    };
  }, [onSubmit, onInvalid, onValidate, onAutosave, onDirtyChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (novalidate) el.setAttribute('novalidate', '');
    else el.removeAttribute('novalidate');

    if (autosave) el.setAttribute('autosave', '');
    else el.removeAttribute('autosave');

    if (typeof autosaveDelay === 'number' && Number.isFinite(autosaveDelay)) {
      el.setAttribute('autosave-delay', String(autosaveDelay));
    } else {
      el.removeAttribute('autosave-delay');
    }

    if (guardUnsaved) el.setAttribute('guard-unsaved', '');
    else el.removeAttribute('guard-unsaved');

    if (heading != null && heading !== '') el.setAttribute('heading', heading);
    else el.removeAttribute('heading');

    if (description != null && description !== '') el.setAttribute('description', description);
    else el.removeAttribute('description');

    if (state && state !== 'default') el.setAttribute('state', state);
    else el.removeAttribute('state');

    if (stateText != null && stateText !== '') el.setAttribute('state-text', stateText);
    else el.removeAttribute('state-text');

    if (loadingText != null && loadingText !== '') el.setAttribute('loading-text', loadingText);
    else el.removeAttribute('loading-text');

    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (tone && tone !== 'default') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');

    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');

    if (elevation && elevation !== 'default') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');

    if (gap) el.setAttribute('gap', gap);
    else el.removeAttribute('gap');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (loading) el.setAttribute('loading', '');
    else el.removeAttribute('loading');

    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
  }, [
    novalidate,
    autosave,
    autosaveDelay,
    guardUnsaved,
    heading,
    description,
    state,
    stateText,
    loadingText,
    variant,
    tone,
    density,
    shape,
    elevation,
    gap,
    headless,
    loading,
    disabled
  ]);

  return React.createElement('ui-form', { ref, ...rest }, children);
});

FormRoot.displayName = 'Form';

export const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(function FormActions(props, ref) {
  return <div {...props} ref={ref} slot="actions" />;
});

FormActions.displayName = 'Form.Actions';

export const FormStatus = React.forwardRef<HTMLDivElement, FormStatusProps>(function FormStatus(props, ref) {
  return <div {...props} ref={ref} slot="status" />;
});

FormStatus.displayName = 'Form.Status';

export const FormTitle = React.forwardRef<HTMLDivElement, FormTitleProps>(function FormTitle(props, ref) {
  return <div {...props} ref={ref} slot="title" />;
});

FormTitle.displayName = 'Form.Title';

export const Form = Object.assign(FormRoot, {
  Actions: FormActions,
  Status: FormStatus,
  Title: FormTitle
}) as FormComponent;

export default Form;
