import React, {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type RatingChangeEvent = {
  value: number;
  max: number;
  disabled: boolean;
  readonly: boolean;
};

export type RatingProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange"
> & {
  value?: number;
  max?: number;
  disabled?: boolean;
  readonly?: boolean;
  variant?: "default" | "soft" | "glass" | "contrast" | "minimal";
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark" | "brand";
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
  state?: "idle" | "hover" | "focus" | "disabled";
  animation?: "scale" | "pulse" | "none";
  shape?: "rounded" | "square" | "pill";
  radius?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  label?: string;
  showValue?: boolean;
  onChange?: (event: RatingChangeEvent) => void;
};

const RatingRoot = React.forwardRef<HTMLElement, RatingProps>(
  function RatingRoot(
    {
      value,
      max,
      disabled,
      readonly,
      variant,
      size,
      theme,
      tone,
      state,
      animation,
      shape,
      radius,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      label,
      showValue,
      onChange,
      children,
      ...rest
    },
    forwardedRef,
  ) {
    const ref = useRef<HTMLElement | null>(null);

    useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleChange = (event: Event) => {
        const detail = (event as CustomEvent<RatingChangeEvent>).detail;
        if (detail) {
          onChange?.(detail);
        }
      };

      el.addEventListener("change", handleChange as EventListener);

      return () => {
        el.removeEventListener("change", handleChange as EventListener);
      };
    }, [onChange]);

    useIsomorphicLayoutEffect(() => {
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

      const syncBool = (name: string, enabled: boolean | undefined) => {
        if (enabled === true) syncAttr(name, "");
        else syncAttr(name, null);
      };

      const syncProp = (name: string, next: unknown) => {
        (el as unknown as Record<string, unknown>)[name] = next;
      };

      const finalValue = value ?? 0;
      const finalMax = max ?? 5;

      syncProp("value", finalValue);
      syncProp("max", finalMax);
      syncProp("disabled", !!disabled);
      syncProp("readonly", !!readonly);

      syncAttr("value", String(finalValue));
      syncAttr("max", String(finalMax));
      syncBool("disabled", disabled);
      syncBool("readonly", readonly);

      syncAttr("variant", variant && variant !== "default" ? variant : null);
      syncAttr("size", size && size !== "md" ? size : null);
      syncAttr("theme", theme && theme !== "light" ? theme : null);
      syncAttr("tone", tone || null);
      syncAttr("state", state && state !== "idle" ? state : null);
      syncAttr("animation", animation || null);
      syncAttr("shape", shape && shape !== "rounded" ? shape : null);
      syncAttr("aria-label", ariaLabel || null);
      syncAttr("aria-labelledby", ariaLabelledBy || null);
      syncAttr("aria-describedby", ariaDescribedBy || null);
      syncAttr("label", label || null);
      syncBool("show-value", showValue);

      if (radius) {
        el.style.setProperty("--ui-rating-radius", radius);
        syncAttr("radius", radius);
      } else {
        el.style.removeProperty("--ui-rating-radius");
        syncAttr("radius", null);
      }
    }, [
      value,
      max,
      disabled,
      readonly,
      variant,
      size,
      theme,
      tone,
      state,
      animation,
      shape,
      radius,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      label,
      showValue,
    ]);

    return React.createElement(
      "ui-rating",
      {
        ref,
        ...rest,
      },
      children,
    );
  },
);

RatingRoot.displayName = "Rating";

export const Rating = RatingRoot;
export default Rating;
