import { createApp, defineComponent, computed, nextTick, onMounted, ref, watch } from 'vue';
import { applyTheme, defaultTokens } from '@editora/ui-core/runtime';
import '@editora/ui-core/alert';
import '@editora/ui-core/button';
import '@editora/ui-core/date-picker';
import '@editora/ui-core/field';
import '@editora/ui-core/input';
import '@editora/ui-core/sortable';
import './style.css';
import type {
  UISortable,
  UISortableChangeDetail,
  UISortableItem,
  UISortableList,
  UISortableSelectionChangeDetail,
} from '@editora/ui-core/sortable';

type SortableElement = UISortable & HTMLElement;

const INITIAL_LISTS: UISortableList[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'active', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

const INITIAL_ITEMS: UISortableItem[] = [
  { id: 'brief', label: 'Finalize launch brief', listId: 'backlog', description: 'Align scope with marketing and product.' },
  { id: 'qa', label: 'Run production QA sweep', listId: 'active', description: 'Validate forms, analytics, and CMS content.' },
  { id: 'assets', label: 'Approve campaign visuals', listId: 'backlog', description: 'Collect final design and legal approvals.' },
  { id: 'sales', label: 'Share launch notes with sales', listId: 'done', description: 'Prep frontline teams with rollout messaging.' },
];

function cloneItems(items: UISortableItem[]): UISortableItem[] {
  return items.map((item) => ({ ...item }));
}

function listLabelFor(items: UISortableItem[], id: string): string {
  return INITIAL_LISTS.find((list) => list.id === id)?.label ?? id;
}

const App = defineComponent({
  name: 'UICoreVueDirectExample',
  setup() {
    const sortableEl = ref<SortableElement | null>(null);
    const launchName = ref('Q3 Product Launch');
    const launchDate = ref('2026-09-12');
    const boardItems = ref<UISortableItem[]>(cloneItems(INITIAL_ITEMS));
    const selectionCount = ref(0);
    const nextSeed = ref(INITIAL_ITEMS.length + 1);

    const backlogCount = computed(() => boardItems.value.filter((item) => item.listId === 'backlog').length);
    const summary = computed(() => {
      const selectedText = selectionCount.value === 0 ? 'No tasks selected.' : `${selectionCount.value} task${selectionCount.value === 1 ? '' : 's'} selected.`;
      return `${launchName.value} targets ${launchDate.value || 'an unscheduled release date'}. ${backlogCount.value} task${backlogCount.value === 1 ? '' : 's'} still sit in backlog. ${selectedText}`;
    });

    const syncSortable = () => {
      if (!sortableEl.value) return;
      sortableEl.value.lists = INITIAL_LISTS.map((list) => ({ ...list }));
      sortableEl.value.items = cloneItems(boardItems.value);
    };

    const onLaunchNameInput = (event: Event) => {
      launchName.value = ((event as CustomEvent<{ value?: string }>).detail?.value ?? '').trimStart();
    };

    const onLaunchDateChange = (event: Event) => {
      launchDate.value = (event as CustomEvent<{ value?: string | null }>).detail?.value ?? '';
    };

    const onBoardChange = (event: Event) => {
      boardItems.value = cloneItems((event as CustomEvent<UISortableChangeDetail>).detail.items);
    };

    const onSelectionChange = (event: Event) => {
      selectionCount.value = (event as CustomEvent<UISortableSelectionChangeDetail>).detail.selection.length;
    };

    const addBacklogTask = async () => {
      boardItems.value = [
        ...boardItems.value,
        {
          id: `task-${nextSeed.value}`,
          label: `Review launch dependency ${nextSeed.value}`,
          listId: 'backlog',
          description: 'Capture approval owners and fallback plan.',
        },
      ];
      nextSeed.value += 1;
      await nextTick();
      syncSortable();
    };

    const resetBoard = async () => {
      boardItems.value = cloneItems(INITIAL_ITEMS);
      selectionCount.value = 0;
      nextSeed.value = INITIAL_ITEMS.length + 1;
      await nextTick();
      syncSortable();
    };

    watch(boardItems, syncSortable, { deep: true });

    onMounted(() => {
      applyTheme({
        ...defaultTokens,
        colors: {
          ...defaultTokens.colors,
          primary: '#0f766e',
          text: '#10221b',
          background: '#f6f4ed',
          surface: '#fffdf7',
        },
        radius: '16px',
      });
      syncSortable();
    });

    return {
      INITIAL_LISTS,
      addBacklogTask,
      launchDate,
      launchName,
      onBoardChange,
      onLaunchDateChange,
      onLaunchNameInput,
      onSelectionChange,
      resetBoard,
      selectionCount,
      sortableEl,
      summary,
      listLabelFor,
    };
  },
  template: `
    <div class="app-shell">
      <section class="control-panel">
        <p class="eyebrow">Vue 3 directly using ui-core</p>
        <h1>Release Readiness Board</h1>
        <p class="lede">
          This example uses standalone web component imports, native custom events, and direct property assignment on
          <code>&lt;ui-sortable&gt;</code> without any Vue wrapper package.
        </p>

        <ui-alert tone="info">{{ summary }}</ui-alert>

        <div class="field-stack">
          <ui-field label="Launch name" hint="Shown in internal planning notes.">
            <ui-input
              :value="launchName"
              placeholder="Q3 Product Launch"
              clearable
              @input="onLaunchNameInput"
            ></ui-input>
          </ui-field>

          <ui-field label="Launch date" hint="Choose the public launch milestone.">
            <ui-date-picker
              :value="launchDate"
              clearable
              @change="onLaunchDateChange"
            ></ui-date-picker>
          </ui-field>
        </div>

        <div class="button-row">
          <ui-button variant="primary" @click="addBacklogTask">Add backlog task</ui-button>
          <ui-button variant="secondary" @click="resetBoard">Reset board</ui-button>
        </div>

        <div class="legend">
          <h2>Board Notes</h2>
          <ul>
            <li>Drag cards between lists to update the plan.</li>
            <li>Click cards to multi-select and track grouped work.</li>
            <li>The board state is mirrored back into Vue via the <code>change</code> event.</li>
          </ul>
        </div>
      </section>

      <section class="board-panel">
        <header class="board-header">
          <div>
            <p class="eyebrow">Custom element board</p>
            <h2>Milestone Flow</h2>
          </div>
          <p class="board-caption">{{ selectionCount }} selected</p>
        </header>

        <ui-sortable
          ref="sortableEl"
          dropzone-style="container"
          drag-handle-mode="item"
          show-selection-badge
          persist-key="ui-core-vue-direct-release-board"
          @change="onBoardChange"
          @selection-change="onSelectionChange"
        ></ui-sortable>

        <div class="list-summary">
          <article v-for="list in INITIAL_LISTS" :key="list.id">
            <h3>{{ list.label }}</h3>
            <p>{{ listLabelFor([], list.id) }}</p>
          </article>
        </div>
      </section>
    </div>
  `,
});

const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ui-');
app.mount('#app');
