// @editora/toast/react: the same toast API, with React content anywhere text goes (title, message, description,
// icon), toast.custom() for a toast made of your own JSX, and <Toaster />, which renders that JSX and takes the
// settings as props.
//
// Text needs nothing mounted. JSX is rendered by <Toaster /> through portals into the toast, so it sees the context of
// wherever <Toaster /> is (theme, router, i18n, a query client): mount it once, inside your providers.
import * as React from "react";
import { createPortal } from "react-dom";
import { toast as coreToast, toastAdvanced } from "./index";
import type { ToastConfig, ToastInstance, ToastLevel, ToastOptions } from "./core/types";

export type ToastNode = React.ReactNode;

type Field = "title" | "message" | "description" | "icon";
const FIELDS: Field[] = ["title", "message", "description", "icon"];

export interface ReactToastOptions extends Omit<ToastOptions, Field | "render"> {
  title?: ToastNode;
  message?: ToastNode;
  description?: ToastNode;
  icon?: ToastNode | false;
}

export interface ReactToastPromiseOptions<T> {
  loading: ToastNode | ReactToastOptions;
  success: ToastNode | ReactToastOptions | ((data: T) => ToastNode | ReactToastOptions);
  error: ToastNode | ReactToastOptions | ((error: any) => ToastNode | ReactToastOptions);
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

// What a toast.custom() render function is given.
export interface CustomToast {
  id: string;
  dismiss: () => void;
}

export interface ToasterProps extends Partial<Omit<ToastConfig, "container">> {}

// ---------------------------------------------------------------------------------------------------------------------
// The JSX of each toast, and the <Toaster /> elements that render it.

type Slot = { host: HTMLElement; node: ToastNode };
const slots = new Map<string, Map<string, Slot>>(); // toast id -> field -> where its JSX goes
const listeners = new Set<() => void>();
let mounted = 0;
let warned = false;
let counter = 0;

const hasDocument = () => typeof document !== "undefined";
const emit = () => listeners.forEach((listener) => listener());

function release(id: string): void {
  if (slots.delete(id)) emit();
}

function warnIfNotMounted(): void {
  setTimeout(() => {
    if (mounted > 0 || warned || slots.size === 0) return;
    warned = true;
    console.warn(
      "[@editora/toast] A toast has React content, which <Toaster /> renders: mount <Toaster /> once in your app " +
        "(import { Toaster } from '@editora/toast/react'). Text works without it."
    );
  }, 0);
}

// Text stays text; anything else React can render gets an element of its own in the toast, and <Toaster /> renders it
// there. A field that already has an element keeps it, so an update re-renders the JSX in place.
function toCore(id: string, options: ReactToastOptions): ToastOptions {
  const result: Record<string, unknown> = { ...options, id };
  if (!hasDocument()) return result as ToastOptions;
  let usesSlots = false;
  for (const field of FIELDS) {
    if (!(field in options)) continue;
    const value = options[field];
    const fields = slots.get(id);
    if (value === undefined || value === null || typeof value === "boolean") {
      if (field === "icon" && value === false) result.icon = false;
      else result[field] = undefined;
      if (fields?.delete(field)) emit();
      continue;
    }
    if (typeof value === "string" || typeof value === "number") {
      result[field] = String(value);
      if (fields?.delete(field)) emit();
      continue;
    }
    usesSlots = true;
    let slot = fields?.get(field);
    if (!slot) {
      const host = document.createElement(field === "icon" ? "span" : "div");
      host.style.display = "contents";
      slot = { host, node: value };
      if (!slots.has(id)) slots.set(id, new Map());
      slots.get(id)!.set(field, slot);
    } else {
      slot.node = value;
    }
    result[field] = slot.host;
  }
  // The JSX goes when the toast does.
  const onHide = options.onHide;
  result.onHide = () => {
    release(id);
    onHide?.();
  };
  if (usesSlots) {
    emit();
    warnIfNotMounted();
  }
  return result as ToastOptions;
}

function show(options: ReactToastOptions): ToastInstance {
  const id = options.id || `toast-react-${++counter}`;
  return coreToast.show(toCore(id, options));
}

function update(id: string, options: Partial<ReactToastOptions>): boolean {
  return coreToast.update(id, toCore(id, options));
}

type Second = Partial<ReactToastOptions> | number | undefined;
const withSecond = (second: Second): Partial<ReactToastOptions> =>
  typeof second === "number" ? { duration: second } : second || {};

const level =
  (name: ToastLevel) =>
  (message: ToastNode, options?: Second): ToastInstance =>
    show({ ...withSecond(options), message, level: name });

// A promise result given as options, not as content: { title, description, ... }.
function isOptions(value: unknown): value is ReactToastOptions {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !React.isValidElement(value) &&
    !(typeof Node !== "undefined" && value instanceof Node)
  );
}

function resultOptions(value: unknown, levelName: ToastLevel): ReactToastOptions {
  if (!isOptions(value)) return { message: value as ToastNode, level: levelName };
  // update() merges, so options without a message would keep showing the loading one.
  return { message: undefined, ...value, level: value.level || levelName };
}

async function promise<T>(work: Promise<T> | (() => Promise<T>), options: ReactToastPromiseOptions<T>): Promise<T> {
  const running = typeof work === "function" ? work() : work;
  const loading = resultOptions(options.loading, "loading");
  // The loading toast stays until the promise settles, however long that takes.
  const shown = show({ duration: 0, ...loading });
  const finish = (value: ReactToastOptions) =>
    hasDocument() && update(shown.id, { duration: toastAdvanced.getConfig().duration, persistent: false, ...value });
  try {
    const data = await running;
    const success = typeof options.success === "function" ? (options.success as (d: T) => unknown)(data) : options.success;
    finish(resultOptions(success, "success"));
    options.onSuccess?.(data);
    return data;
  } catch (error) {
    const failure = typeof options.error === "function" ? (options.error as (e: any) => unknown)(error) : options.error;
    finish(resultOptions(failure, "error"));
    options.onError?.(error);
    throw error;
  }
}

// A toast made of your JSX: the render function is given the toast's id and a dismiss function. It sits in the toast
// card (with its timer, swipe, stacking and keyboard handling), with no icon unless you pass one.
function custom(render: ToastNode | ((toast: CustomToast) => ToastNode), options: Partial<ReactToastOptions> = {}): ToastInstance {
  const id = options.id || `toast-react-${++counter}`;
  const node = typeof render === "function" ? (render as (toast: CustomToast) => ToastNode)({ id, dismiss: () => coreToast.dismiss(id) }) : render;
  if (!hasDocument()) return coreToast.show({ ...(options as ToastOptions), id });
  const host = document.createElement("div");
  host.style.display = "contents";
  slots.set(id, new Map([["custom", { host, node }]]));
  emit();
  warnIfNotMounted();
  const core = toCore(id, { level: "custom", icon: false, ...options });
  return coreToast.show({ ...core, render: () => host });
}

function toastBase(message: ToastNode, options?: Second): ToastInstance {
  const given = withSecond(options);
  return show({ ...given, message, level: given.level || "custom" });
}

export const toast = Object.assign(toastBase, {
  info: level("info"),
  success: level("success"),
  warning: level("warning"),
  error: level("error"),
  loading: level("loading"),
  show,
  custom,
  promise,
  update,
  dismiss: coreToast.dismiss,
  clear: coreToast.clear,
  configure: coreToast.configure,
});

// ---------------------------------------------------------------------------------------------------------------------

function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => Object.is(a[key], b[key]));
}

/* Renders the JSX of the toasts, and applies its props as the toast settings (position, theme, duration...). Mount it
 * once, inside your providers. It renders nothing of its own: the toasts are placed by the package as always. */
export function Toaster(props: ToasterProps): React.ReactElement {
  const [, rerender] = React.useState(0);
  const lastConfig = React.useRef<Record<string, unknown> | null>(null);

  React.useEffect(() => {
    mounted++;
    const listener = () => rerender((n) => n + 1);
    listeners.add(listener);
    listener(); // toasts shown before it mounted
    return () => {
      mounted--;
      listeners.delete(listener);
    };
  }, []);

  React.useEffect(() => {
    const config = props as Record<string, unknown>;
    if (lastConfig.current && shallowEqual(lastConfig.current, config)) return;
    lastConfig.current = config;
    if (Object.keys(config).length > 0) coreToast.configure(config as Partial<ToastConfig>);
  });

  const portals: React.ReactNode[] = [];
  slots.forEach((fields, id) => {
    fields.forEach((slot, field) => {
      portals.push(createPortal(slot.node, slot.host, `${id}:${field}`));
    });
  });
  // createElement rather than JSX: the automatic JSX runtime (react/jsx-runtime) only exists from React 16.14 on.
  return React.createElement(React.Fragment, null, ...portals);
}

export type { ToastConfig, ToastInstance, ToastLevel, ToastPosition, ToastTheme } from "./core/types";
export default toast;
