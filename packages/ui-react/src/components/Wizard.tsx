import React, { useEffect, useImperativeHandle, useRef } from 'react';

export type WizardChangeDetail = {
  index: number;
  value: string;
  title: string;
  trigger: string;
};

export type WizardBeforeChangeDetail = {
  currentIndex: number;
  nextIndex: number;
  currentValue: string;
  nextValue: string;
  trigger: string;
};

export type WizardProps = React.HTMLAttributes<HTMLElement> & {
  value?: string;
  linear?: boolean;
  showStepper?: boolean;
  stepperPosition?: 'top' | 'bottom';
  hideControls?: boolean;
  keepMounted?: boolean;
  variant?: 'default' | 'contrast' | 'minimal';
  headless?: boolean;
  nextLabel?: string;
  prevLabel?: string;
  finishLabel?: string;
  onBeforeChange?: (detail: WizardBeforeChangeDetail) => boolean | void;
  onChange?: (detail: WizardChangeDetail) => void;
  onStepChange?: (detail: WizardChangeDetail) => void;
  onComplete?: (detail: { index: number; value: string; title: string }) => void;
};

export const Wizard = React.forwardRef<HTMLElement, WizardProps>(function Wizard(
  {
    value,
    linear,
    showStepper,
    stepperPosition,
    hideControls,
    keepMounted,
    variant,
    headless,
    nextLabel,
    prevLabel,
    finishLabel,
    onBeforeChange,
    onChange,
    onStepChange,
    onComplete,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleBefore = (event: Event) => {
      if (!onBeforeChange) return;
      const detail = (event as CustomEvent<WizardBeforeChangeDetail>).detail;
      const result = onBeforeChange(detail);
      if (result === false) event.preventDefault();
    };

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<WizardChangeDetail>).detail;
      if (!detail) return;
      onChange?.(detail);
    };

    const handleStepChange = (event: Event) => {
      const detail = (event as CustomEvent<WizardChangeDetail>).detail;
      if (!detail) return;
      onStepChange?.(detail);
    };

    const handleComplete = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number; value: string; title: string }>).detail;
      if (detail) onComplete?.(detail);
    };

    el.addEventListener('before-change', handleBefore as EventListener);
    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('step-change', handleStepChange as EventListener);
    el.addEventListener('complete', handleComplete as EventListener);

    return () => {
      el.removeEventListener('before-change', handleBefore as EventListener);
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('step-change', handleStepChange as EventListener);
      el.removeEventListener('complete', handleComplete as EventListener);
    };
  }, [onBeforeChange, onChange, onStepChange, onComplete]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBool = (name: string, enabled: boolean | undefined, defaultValue?: boolean) => {
      if (typeof enabled === 'boolean') {
        if (enabled) syncAttr(name, '');
        else syncAttr(name, null);
        return;
      }
      if (defaultValue !== undefined) {
        if (defaultValue) syncAttr(name, '');
        else syncAttr(name, null);
      }
    };

    syncAttr('value', value || null);
    syncBool('linear', linear);
    if (typeof showStepper === 'boolean') syncAttr('show-stepper', showStepper ? 'true' : 'false');
    else syncAttr('show-stepper', null);
    syncAttr('stepper-position', stepperPosition && stepperPosition !== 'top' ? stepperPosition : null);
    syncBool('hide-controls', hideControls);
    syncBool('keep-mounted', keepMounted);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncBool('headless', headless);
    syncAttr('next-label', nextLabel || null);
    syncAttr('prev-label', prevLabel || null);
    syncAttr('finish-label', finishLabel || null);
  }, [value, linear, showStepper, stepperPosition, hideControls, keepMounted, variant, headless, nextLabel, prevLabel, finishLabel]);

  return React.createElement('ui-wizard', { ref, ...rest }, children);
});

Wizard.displayName = 'Wizard';

export default Wizard;
