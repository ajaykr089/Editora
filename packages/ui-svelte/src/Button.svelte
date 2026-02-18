<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  export let className = '';
  export let disabled = false;
  export let $$restProps: Record<string, any> = {};
  let el: HTMLElement | null = null;
  const dispatch = createEventDispatcher();
  function forward(e: Event) { dispatch((e as any).type, (e as CustomEvent).detail ?? e); }
  onMount(() => { if (!el) return; el.addEventListener('click', forward as EventListener); });
  onDestroy(() => { if (!el) return; el.removeEventListener('click', forward as EventListener); });
</script>

<svelte:element this="ui-button" bind:this={el} class={className} disabled={disabled} {...$$restProps}>
  <slot />
</svelte:element>
