import { defineComponent, h, onMounted, onBeforeUnmount, ref as vueRef } from 'vue';

function makeWrapper(tag: string, events: string[] = []) {
  return defineComponent({
    name: `Editora${tag.replace(/[^a-zA-Z]/g,'')}`,
    props: ['class', 'style', 'disabled', 'value', 'open', 'name', 'text', 'variant'],
    emits: events,
    setup(props, { slots, emit }) {
      const el = vueRef<HTMLElement | null>(null as any);
      const handlers: Array<() => void> = [];
      onMounted(() => {
        events.forEach((ev) => {
          const handler = (e: Event) => emit(ev, (e as CustomEvent).detail ?? e);
          handlers.push(() => el.value && el.value.removeEventListener(ev, handler as EventListener));
          if (el.value) el.value.addEventListener(ev, handler as EventListener);
        });
      });
      onBeforeUnmount(() => handlers.forEach((fn) => fn()));
      return () => h(tag, { ref: el, ...props as any }, slots.default && slots.default());
    }
  });
}

export const Button = makeWrapper('ui-button', ['click']);
export const Tooltip = makeWrapper('ui-tooltip', ['open','close']);
export const Modal = makeWrapper('ui-modal', ['open','close']);
export const Dropdown = makeWrapper('ui-dropdown', ['open','close']);
export const Input = makeWrapper('ui-input', ['input','change']);
export const Popover = makeWrapper('ui-popover', ['open','close']);
export const Tabs = makeWrapper('ui-tabs', ['change']);
export const Menu = makeWrapper('ui-menu', ['select']);
export const Icon = makeWrapper('ui-icon');

export default {
  Button,
  Tooltip,
  Modal,
  Dropdown,
  Input,
  Popover,
  Tabs,
  Menu,
  Icon,
};
