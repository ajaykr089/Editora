<script>
  import { onMount, tick } from 'svelte';
  import { applyTheme, defaultTokens } from '@editora/ui-core/runtime';
  import '@editora/ui-core';
  import { routeDefinitions, catalogGroups, registryMarkup } from './showcase-data';

  const DEFAULT_ROUTE = 'overview';
  const sortableLists = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'review', label: 'Ready for Review' },
    { id: 'live', label: 'Live' },
  ];
  const initialBoardItems = [
    { id: 'copy', label: 'Approve homepage copy', listId: 'backlog', description: 'Finalize brand and legal review.' },
    { id: 'tracking', label: 'Validate conversion tracking', listId: 'review', description: 'Verify event payloads in staging.' },
    { id: 'briefing', label: 'Brief customer success team', listId: 'live', description: 'Share launch talking points and FAQs.' },
    { id: 'fallback', label: 'Draft rollback checklist', listId: 'backlog', description: 'Keep ops fallback path visible.' },
  ];

  let activeRoute = DEFAULT_ROUTE;
  let sortableEl = null;
  let selectionCount = 0;
  let nextSeed = initialBoardItems.length + 1;
  let boardItems = initialBoardItems.map((item) => ({ ...item }));
  let lastScheduledRoute = '';

  const catalogDefinition = {
    id: 'catalog',
    label: 'Catalog',
    eyebrow: 'Complete directory',
    title: 'Full component directory',
    description: 'A broad registry page that mounts the available ui-core components inside a single routed reference surface.',
    cards: [],
  };
  const allRoutes = [...routeDefinitions, catalogDefinition];
  const routeIds = allRoutes.map((route) => route.id);
  const coveredComponents = catalogGroups.reduce((count, group) => count + group.tags.length, 0);

  function normalizeRoute(hashValue) {
    const cleaned = (hashValue || '').replace(/^#\/?/, '');
    return routeIds.includes(cleaned) ? cleaned : DEFAULT_ROUTE;
  }

  function syncHashRoute() {
    activeRoute = normalizeRoute(window.location.hash);
  }

  function navigate(routeId) {
    window.location.hash = `/${routeId}`;
  }

  function getDemoTarget(targetId) {
    if (!targetId) return null;
    return document.getElementById(targetId);
  }

  function openDemoTarget(target, anchorId, trigger) {
    if (!target) return;
    if (trigger?.dataset.demoSelected != null) {
      target.setAttribute('selected', trigger.dataset.demoSelected);
    }
    if (trigger?.dataset.demoValue != null) {
      target.setAttribute('value', trigger.dataset.demoValue);
    }
    if (target.tagName === 'UI-MENUBAR') {
      requestAnimationFrame(() => {
        target.setAttribute('open', '');
      });
      return;
    }
    if (anchorId && typeof target.openFor === 'function') {
      target.openFor(anchorId);
      return;
    }
    if (anchorId && typeof target.openForAnchorId === 'function') {
      target.openForAnchorId(anchorId);
      return;
    }
    if (anchorId && typeof target.showForAnchorId === 'function') {
      target.showForAnchorId(anchorId);
      return;
    }
    if (typeof target.openPalette === 'function') {
      target.openPalette();
      return;
    }
    if (typeof target.openPanel === 'function') {
      target.openPanel();
      return;
    }
    if (typeof target.openToolbar === 'function') {
      target.openToolbar();
      return;
    }
    target.setAttribute('open', '');
  }

  function closeDemoTarget(target) {
    if (!target) return;
    if (typeof target.closePalette === 'function') {
      target.closePalette();
      return;
    }
    if (typeof target.closePanel === 'function') {
      target.closePanel();
      return;
    }
    if (typeof target.closeToolbar === 'function') {
      target.closeToolbar('programmatic');
      return;
    }
    if (typeof target.close === 'function') {
      target.close();
      return;
    }
    target.removeAttribute('open');
  }

  function handleDemoClick(event) {
    const rawTarget = event.target;
    if (!(rawTarget instanceof Element)) return;

    const openTrigger = rawTarget.closest('[data-demo-open]');
    if (openTrigger instanceof HTMLElement) {
      event.preventDefault();
      openDemoTarget(getDemoTarget(openTrigger.dataset.demoOpen), openTrigger.dataset.demoAnchor, openTrigger);
      return;
    }

    const closeTrigger = rawTarget.closest('[data-demo-close]');
    if (closeTrigger instanceof HTMLElement) {
      event.preventDefault();
      closeDemoTarget(getDemoTarget(closeTrigger.dataset.demoClose));
    }
  }

  function handleDemoContextMenu(event) {
    const rawTarget = event.target;
    if (!(rawTarget instanceof Element)) return;

    const area = rawTarget.closest('[data-demo-context-target]');
    if (!(area instanceof HTMLElement)) return;

    event.preventDefault();
    const menu = getDemoTarget(area.dataset.demoContextTarget);
    if (!menu) return;

    if (typeof menu.openAt === 'function') {
      menu.openAt(event.clientX, event.clientY);
      return;
    }

    menu.setAttribute('open', '');
  }

  function syncSortableBoard() {
    if (!sortableEl) return;
    sortableEl.lists = sortableLists.map((list) => ({ ...list }));
    sortableEl.items = boardItems.map((item) => ({ ...item }));
  }

  function syncRegistrySortables() {
    const hosts = Array.from(document.querySelectorAll('ui-sortable.registry-sortable'));
    hosts.forEach((host, index) => {
      host.lists = sortableLists.map((list) => ({ ...list }));
      host.items = [
        { id: `registry-${index}-1`, label: 'Registry task', listId: 'backlog', description: 'Mounted from the catalog route.' },
        { id: `registry-${index}-2`, label: 'Review entry', listId: 'review', description: 'Shows complex property bridging.' },
      ];
    });
  }

  async function scheduleSurfaceSync() {
    await tick();
    syncSortableBoard();
    syncRegistrySortables();
  }

  async function addReviewTask() {
    boardItems = [
      ...boardItems,
      {
        id: `task-${nextSeed}`,
        label: `Cross-check stakeholder signoff ${nextSeed}`,
        listId: 'review',
        description: 'Capture final approval before release handoff.',
      },
    ];
    nextSeed += 1;
    await scheduleSurfaceSync();
  }

  async function resetBoard() {
    boardItems = initialBoardItems.map((item) => ({ ...item }));
    selectionCount = 0;
    nextSeed = initialBoardItems.length + 1;
    await scheduleSurfaceSync();
  }

  function handleBoardChange(event) {
    boardItems = event.detail.items.map((item) => ({ ...item }));
    scheduleSurfaceSync();
  }

  function handleSelectionChange(event) {
    selectionCount = event.detail.selection.length;
  }

  $: activeDefinition = allRoutes.find((route) => route.id === activeRoute) || routeDefinitions[0];
  $: activeCards = activeDefinition.cards;
  $: backlogCount = boardItems.filter((item) => item.listId === 'backlog').length;
  $: boardSummary = `${backlogCount} tasks remain in backlog and ${selectionCount} ${selectionCount === 1 ? 'card is' : 'cards are'} selected.`;

  $: if (activeRoute !== lastScheduledRoute) {
    lastScheduledRoute = activeRoute;
    scheduleSurfaceSync();
  }

  $: if (activeRoute === 'data' && boardItems) {
    scheduleSurfaceSync();
  }

  onMount(() => {
    applyTheme({
      ...defaultTokens,
      colors: {
        ...defaultTokens.colors,
        primary: '#c2410c',
        text: '#2b160f',
        background: '#f4ecdf',
        surface: '#fffaf5',
      },
      radius: '18px',
    });

    if (!window.location.hash) {
      window.location.hash = `/${DEFAULT_ROUTE}`;
    }

    syncHashRoute();
    scheduleSurfaceSync();

    const onHashChange = () => {
      syncHashRoute();
    };

    document.addEventListener('click', handleDemoClick);
    document.addEventListener('contextmenu', handleDemoContextMenu);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      document.removeEventListener('click', handleDemoClick);
      document.removeEventListener('contextmenu', handleDemoContextMenu);
      window.removeEventListener('hashchange', onHashChange);
    };
  });
</script>

<div class="showcase-shell">
  <aside class="sidebar-shell">
    <div class="brand-panel">
      <p class="eyebrow">Svelte direct usage</p>
      <h1>ui-core showcase</h1>
      <p class="lede">
        A route-based demo app covering the public ui-core surface with direct custom-element usage.
      </p>
      <div class="summary-strip">
        <div>
          <strong>{allRoutes.length}</strong>
          <span>routes</span>
        </div>
        <div>
          <strong>{coveredComponents}</strong>
          <span>components listed</span>
        </div>
      </div>
    </div>

    <nav class="route-nav" aria-label="Component categories">
      {#each allRoutes as route}
        <button
          class:active={route.id === activeRoute}
          type="button"
          on:click={() => navigate(route.id)}
        >
          <span>{route.label}</span>
          <small>{route.id === 'catalog' ? 'full component directory' : `${route.cards.length} demo cards`}</small>
        </button>
      {/each}
    </nav>
  </aside>

  <main class="content-shell">
    <section class="hero-panel">
      <p class="eyebrow">{activeDefinition.eyebrow}</p>
      <div class="hero-copy">
        <div>
          <h2>{activeDefinition.title}</h2>
          <p>{activeDefinition.description}</p>
        </div>
        <ui-badge tone="info">{activeRoute === 'catalog' ? `${coveredComponents} listed` : `${activeCards.length} live demos`}</ui-badge>
      </div>
    </section>

    {#if activeRoute === 'catalog'}
      <section class="content-grid catalog-grid">
        {#each catalogGroups as group}
          <article class="surface-card catalog-group">
            <div class="card-heading">
              <div>
                <p class="eyebrow">Directory</p>
                <h3>{group.title}</h3>
              </div>
              <ui-badge tone="success">{group.tags.length} tags</ui-badge>
            </div>

            <div class="catalog-cards">
              {#each group.tags as tag}
                <section class="catalog-card">
                  <header>
                    <code>{tag}</code>
                  </header>
                  <div class="preview-frame catalog-preview">
                    {@html registryMarkup(tag)}
                  </div>
                </section>
              {/each}
            </div>
          </article>
        {/each}
      </section>
    {:else}
      <section class="content-grid">
        {#if activeRoute === 'data'}
          <article class="surface-card feature-card">
            <div class="card-heading">
              <div>
                <p class="eyebrow">Interactive workflow</p>
                <h3>Launch Control Desk</h3>
              </div>
              <ui-badge tone="warning">{selectionCount} selected</ui-badge>
            </div>

            <p class="card-copy">
              This is the richer direct-use example kept from the original demo. It proves real Svelte state updates from
              `ui-sortable` events and property-driven list data.
            </p>

            <ui-alert tone="warning" title="Board summary" description={boardSummary}></ui-alert>

            <div class="button-row">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <ui-button variant="primary" on:click={addReviewTask}>Add review task</ui-button>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <ui-button variant="secondary" on:click={resetBoard}>Reset board</ui-button>
            </div>

            <ui-sortable
              bind:this={sortableEl}
              dropzone-style="container"
              show-selection-badge
              persist-key="ui-core-svelte-direct-launch-board"
              on:change={handleBoardChange}
              on:selection-change={handleSelectionChange}
            ></ui-sortable>
          </article>
        {/if}

        {#each activeCards as card}
          <article class="surface-card">
            <div class="card-heading">
              <div>
                <p class="eyebrow">Live demo</p>
                <h3>{card.title}</h3>
              </div>
              <div class="chip-row">
                {#each card.components as component}
                  <code>{component}</code>
                {/each}
              </div>
            </div>

            <p class="card-copy">{card.description}</p>

            <div class="preview-frame">
              {@html card.markup}
            </div>
          </article>
        {/each}
      </section>
    {/if}
  </main>
</div>
