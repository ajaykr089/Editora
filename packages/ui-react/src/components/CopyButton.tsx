import React from 'react';
import { Button, type ButtonProps } from './Button';

const ICON_BUTTON_SIZES = {
  sm: 28,
  md: 32,
  lg: 36,
} as const;

function iconSvg(path: React.ReactNode) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      width="14"
    >
      {path}
    </svg>
  );
}

function defaultIconForState(state: 'idle' | 'copied' | 'failed') {
  if (state === 'copied') {
    return iconSvg(<path d="M5 13l4 4L19 7" />);
  }

  if (state === 'failed') {
    return iconSvg(
      <>
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      </>
    );
  }

  return iconSvg(
    <>
      <rect height="13" rx="2" ry="2" width="10" x="9" y="9" />
      <path d="M15 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
    </>
  );
}

async function copyText(value: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  if (typeof document === 'undefined') return false;

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  textarea.style.inset = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

export type CopyButtonProps = Omit<ButtonProps, 'children' | 'onClick' | 'onCopy' | 'startIcon' | 'endIcon' | 'variant'> & {
  value: string;
  variant?: ButtonProps['variant'] | 'icon';
  label?: React.ReactNode;
  copiedLabel?: React.ReactNode;
  failedLabel?: React.ReactNode;
  icon?: React.ReactNode;
  copiedIcon?: React.ReactNode;
  failedIcon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  iconOnly?: boolean;
  resetAfter?: number;
  onCopy?: (detail: { value: string; success: boolean }) => void;
};

export const CopyButton = React.forwardRef<HTMLElement, CopyButtonProps>(function CopyButton(
  {
    value,
    label = 'Copy',
    copiedLabel = 'Copied',
    failedLabel = 'Copy failed',
    icon,
    copiedIcon,
    failedIcon,
    iconPosition = 'start',
    iconOnly = false,
    resetAfter = 1800,
    variant = 'secondary',
    size = 'sm',
    recipe,
    radius,
    onCopy,
    disabled,
    style,
    ...rest
  },
  forwardedRef
) {
  const [state, setState] = React.useState<'idle' | 'copied' | 'failed'>('idle');
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = React.useCallback(async () => {
    if (disabled) return;

    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    let success = false;
    try {
      success = await copyText(value);
    } catch {
      success = false;
    }

    setState(success ? 'copied' : 'failed');
    onCopy?.({ value, success });

    if (typeof window !== 'undefined' && resetAfter >= 0) {
      timeoutRef.current = window.setTimeout(() => {
        setState('idle');
        timeoutRef.current = null;
      }, resetAfter);
    }
  }, [disabled, onCopy, resetAfter, value]);

  const content = state === 'copied' ? copiedLabel : state === 'failed' ? failedLabel : label;
  const ariaLive = state === 'idle' ? 'off' : 'polite';
  const isIconVariant = variant === 'icon';
  const resolvedIconOnly = iconOnly || isIconVariant;
  const shouldUseDefaultIcons = resolvedIconOnly && !icon && !copiedIcon && !failedIcon;
  const currentIcon = (
    state === 'copied'
      ? copiedIcon ?? icon
      : state === 'failed'
        ? failedIcon ?? icon
        : icon
  ) ?? (shouldUseDefaultIcons ? defaultIconForState(state) : undefined);
  const resolvedVariant = isIconVariant ? 'secondary' : variant;
  const resolvedRecipe = isIconVariant ? (recipe ?? 'ghost') : recipe;
  const resolvedRadius = isIconVariant ? (radius ?? 999) : radius;
  const ariaLabel =
    rest.ariaLabel
    ?? (typeof content === 'string' && content.trim() ? content : typeof label === 'string' && label.trim() ? label : 'Copy to clipboard');
  const startIcon = iconPosition === 'start' ? currentIcon : undefined;
  const endIcon = iconPosition === 'end' ? currentIcon : undefined;
  const iconButtonSize = ICON_BUTTON_SIZES[size];
  const hideLabel = resolvedIconOnly && currentIcon != null;

  return (
    <Button
      {...rest}
      ref={forwardedRef}
      ariaLabel={ariaLabel}
      aria-live={ariaLive}
      disabled={disabled}
      endIcon={endIcon}
      onClick={handleClick}
      radius={resolvedRadius}
      recipe={resolvedRecipe}
      size={size}
      startIcon={startIcon}
      style={{
        ...(isIconVariant
          ? {
              alignItems: 'center',
              blockSize: iconButtonSize,
              inlineSize: iconButtonSize,
              justifyContent: 'center',
              minInlineSize: iconButtonSize,
              padding: 0,
            }
          : null),
        ...style,
      }}
      variant={resolvedVariant}
    >
      {hideLabel ? null : content}
    </Button>
  );
});

CopyButton.displayName = 'CopyButton';

export default CopyButton;
