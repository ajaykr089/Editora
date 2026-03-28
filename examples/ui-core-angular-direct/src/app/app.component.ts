import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { applyTheme, defaultTokens } from '@editora/ui-core/runtime';
import '@editora/ui-core/alert';
import '@editora/ui-core/button';
import '@editora/ui-core/date-picker';
import '@editora/ui-core/field';
import '@editora/ui-core/input';
import '@editora/ui-core/sortable';
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
  { id: 'legal', label: 'Confirm legal copy', listId: 'backlog', description: 'Review customer-facing language.' },
  { id: 'ops', label: 'Check rollback plan', listId: 'active', description: 'Align with support and operations.' },
  { id: 'sales', label: 'Email enablement deck', listId: 'done', description: 'Send final asset pack to sales leads.' },
];

@Component({
  selector: 'app-root',
  template: `
    <div class="app-shell">
      <section class="panel">
        <p class="eyebrow">Angular directly using ui-core</p>
        <h1>Launch Operations Board</h1>
        <ui-alert tone="info">{{ summary }}</ui-alert>

        <ui-field label="Launch name" hint="Stored in Angular component state.">
          <ui-input [attr.value]="launchName" (input)="onLaunchNameInput($event)"></ui-input>
        </ui-field>

        <ui-field label="Launch date" hint="Updated from a custom change event.">
          <ui-date-picker [attr.value]="launchDate" clearable (change)="onLaunchDateChange($event)"></ui-date-picker>
        </ui-field>

        <div class="button-row">
          <ui-button variant="primary" (click)="addTask()">Add task</ui-button>
          <ui-button variant="secondary" (click)="resetBoard()">Reset</ui-button>
        </div>
      </section>

      <section class="panel board-panel">
        <ui-sortable
          #sortable
          dropzone-style="container"
          show-selection-badge
          persist-key="ui-core-angular-direct-board"
          (change)="onBoardChange($event)"
          (selection-change)="onSelectionChange($event)"
        ></ui-sortable>
      </section>
    </div>
  `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('sortable', { static: true }) sortableRef!: ElementRef<SortableElement>;

  launchName = 'Operations Review';
  launchDate = '2026-10-06';
  selectionCount = 0;
  nextSeed = INITIAL_ITEMS.length + 1;
  boardItems: UISortableItem[] = INITIAL_ITEMS.map((item) => ({ ...item }));

  get summary(): string {
    return `${this.launchName} targets ${this.launchDate || 'an unscheduled launch date'} with ${this.selectionCount} selected task${this.selectionCount === 1 ? '' : 's'}.`;
  }

  ngAfterViewInit(): void {
    applyTheme({
      ...defaultTokens,
      colors: {
        ...defaultTokens.colors,
        primary: '#155e75',
        background: '#f5f7fb',
      },
    });
    this.syncSortable();
  }

  onLaunchNameInput(event: Event): void {
    this.launchName = ((event as CustomEvent<{ value?: string }>).detail?.value ?? '').trimStart();
  }

  onLaunchDateChange(event: Event): void {
    this.launchDate = (event as CustomEvent<{ value?: string | null }>).detail?.value ?? '';
  }

  onBoardChange(event: Event): void {
    this.boardItems = (event as CustomEvent<UISortableChangeDetail>).detail.items.map((item) => ({ ...item }));
    this.syncSortable();
  }

  onSelectionChange(event: Event): void {
    this.selectionCount = (event as CustomEvent<UISortableSelectionChangeDetail>).detail.selection.length;
  }

  addTask(): void {
    this.boardItems = [
      ...this.boardItems,
      {
        id: `task-${this.nextSeed}`,
        label: `Review dependency ${this.nextSeed}`,
        listId: 'backlog',
        description: 'Track approval owner and fallback plan.',
      },
    ];
    this.nextSeed += 1;
    this.syncSortable();
  }

  resetBoard(): void {
    this.boardItems = INITIAL_ITEMS.map((item) => ({ ...item }));
    this.selectionCount = 0;
    this.nextSeed = INITIAL_ITEMS.length + 1;
    this.syncSortable();
  }

  private syncSortable(): void {
    const sortable = this.sortableRef?.nativeElement;
    if (!sortable) return;
    sortable.lists = INITIAL_LISTS.map((list) => ({ ...list }));
    sortable.items = this.boardItems.map((item) => ({ ...item }));
  }
}
