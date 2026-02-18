<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  export let text = '';
  export let $$restProps: Record<string, any> = {};
  let el: HTMLElement | null = null;
  const dispatch = createEventDispatcher();
  function forward(e: Event) { dispatch((e as any).type, (e as CustomEvent).detail ?? e); }
  onMount(() => { if (!el) return; el.addEventListener('open', forward as EventListener); el.addEventListener('close', forward as EventListener); });
  onDestroy(() => { if (!el) return; el.removeEventListener('open', forward as EventListener); el.removeEventListener('close', forward as EventListener); });
</script>

<svelte:element this="ui-tooltip" bind:this={el} text={text} {...$$restProps}>
  <slot />
</svelte:element>
