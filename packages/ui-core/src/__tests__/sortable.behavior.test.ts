import { describe, expect, it } from 'vitest';
import '../components/ui-sortable';

function flushMicrotask() {
  return Promise.resolve();
}

const lists = [
  { id: 'ideas', label: 'Ideas', cloneOnDrag: true },
  { id: 'todo', label: 'To do' },
  { id: 'done', label: 'Done' },
];

const items = [
  { id: 'template', label: 'Template', listId: 'ideas' },
  { id: 'epic', label: 'Epic', listId: 'todo' },
  { id: 'task-a', label: 'Task A', listId: 'todo' },
  { id: 'task-b', label: 'Task B', listId: 'todo' },
];

describe('ui-sortable', () => {
  it('reorders and transfers multi-selected items while emitting persistence details', async () => {
    const el = document.createElement('ui-sortable') as HTMLElement & {
      select(ids: string[]): void;
      moveSelection(options: { targetListId: string; beforeId?: string | null }): void;
      items: Array<{ id: string; listId: string; parentId?: string | null }>;
      getPersistenceSnapshot(): { records: Array<{ id: string; listId: string; parentId: string | null; index: number }> };
    };
    let persisted: any = null;

    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    el.addEventListener('persist-request', ((event: CustomEvent) => {
      persisted = event.detail;
    }) as EventListener);
    document.body.appendChild(el);
    await flushMicrotask();

    el.select(['task-a', 'task-b']);
    el.moveSelection({ targetListId: 'todo', beforeId: 'epic' });

    expect(el.items.find((item) => item.id === 'task-a')?.listId).toBe('todo');
    expect(el.items.slice(0, 3).map((item) => item.id)).toEqual(['template', 'task-a', 'task-b']);

    el.select(['task-a', 'task-b']);
    el.moveSelection({ targetListId: 'done' });

    expect(el.items.filter((item) => item.listId === 'done').map((item) => item.id)).toEqual(['task-a', 'task-b']);
    expect(persisted?.operation).toBe('transfer');
    expect(persisted?.persistence.records.filter((record: any) => record.listId === 'done').map((record: any) => record.id)).toEqual(['task-a', 'task-b']);
    expect(el.getPersistenceSnapshot().records.some((record) => record.id === 'task-a' && record.listId === 'done')).toBe(true);
  });

  it('supports nesting, cloning, keyboard cancel, and persisted restore', async () => {
    const persistKey = 'ui-sortable-test';
    window.localStorage.removeItem(persistKey);

    const el = document.createElement('ui-sortable') as HTMLElement & {
      select(ids: string[]): void;
      moveSelection(options: { targetListId: string; parentId?: string | null; mode?: 'inside' | 'before'; clone?: boolean }): void;
      focusItem(id: string): void;
      items: Array<{ id: string; label: string; listId: string; parentId?: string | null }>;
    };

    el.setAttribute('persist-key', persistKey);
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(el);
    await flushMicrotask();

    el.select(['task-a']);
    el.moveSelection({ targetListId: 'todo', parentId: 'epic', mode: 'inside' });
    expect(el.items.find((item) => item.id === 'task-a')?.parentId).toBe('epic');

    el.select(['template']);
    el.moveSelection({ targetListId: 'todo', clone: true });
    expect(el.items.some((item) => item.id === 'template')).toBe(true);
    expect(el.items.some((item) => item.id !== 'template' && item.label.includes('Template'))).toBe(true);

    const beforeCancel = JSON.stringify(el.items);
    el.focusItem('task-b');
    await flushMicrotask();
    const taskB = el.shadowRoot?.querySelector('.item[data-id="task-b"]') as HTMLElement | null;
    taskB?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, composed: true }));
    taskB?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await flushMicrotask();
    expect(JSON.stringify(el.items)).toBe(beforeCancel);

    const restored = document.createElement('ui-sortable') as HTMLElement & {
      items: Array<{ id: string; parentId?: string | null }>;
    };
    restored.setAttribute('persist-key', persistKey);
    restored.setAttribute('lists', JSON.stringify(lists));
    restored.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(restored);
    await flushMicrotask();

    expect(restored.items.find((item) => item.id === 'task-a')?.parentId).toBe('epic');
  });

  it('disables drag handles when non-manual sorting is active', async () => {
    const el = document.createElement('ui-sortable') as HTMLElement;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    el.setAttribute('sort', 'label');
    document.body.appendChild(el);
    await flushMicrotask();

    const handle = el.shadowRoot?.querySelector('.handle[data-id="epic"]') as HTMLButtonElement | null;
    expect(handle?.disabled).toBe(true);
  });

  it('can hide the default selected badge without changing selection state', async () => {
    const el = document.createElement('ui-sortable') as any;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    el.setAttribute('selection', JSON.stringify(['epic']));
    el.setAttribute('show-selection-badge', 'false');
    document.body.appendChild(el);
    await flushMicrotask();

    const epic = el.shadowRoot?.querySelector('.item[data-id="epic"]') as HTMLElement | null;
    expect(epic?.getAttribute('data-selected')).toBe('true');
    expect(epic?.textContent).not.toContain('Selected');
  });

  it('uses clean active-only drop indicators by default and allows always-visible rails', async () => {
    const el = document.createElement('ui-sortable') as any;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.shadowRoot?.querySelector('.root')?.getAttribute('data-drop-indicator-visibility')).toBe('active');

    el.setAttribute('drop-indicator-visibility', 'always');
    await flushMicrotask();

    expect(el.shadowRoot?.querySelector('.root')?.getAttribute('data-drop-indicator-visibility')).toBe('always');
  });

  it('infers body drops for nesting and supports escape cancelling pointer drags', async () => {
    const el = document.createElement('ui-sortable') as any;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(el);
    await flushMicrotask();

    const epic = el.shadowRoot?.querySelector('.item[data-id="epic"]') as HTMLElement | null;
    expect(epic).toBeTruthy();

    epic!.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 200,
      bottom: 100,
      width: 200,
      height: 100,
      toJSON() {
        return {};
      }
    });

    const insideTarget = el._dropTargetFromEvent({
      composedPath: () => [epic],
      clientX: 100,
      clientY: 52,
    });
    expect(insideTarget).toEqual({
      listId: 'todo',
      parentId: 'epic',
      beforeId: null,
      mode: 'inside',
    });

    const beforeSnapshot = JSON.stringify(el.items);
    el._dragState = {
      snapshot: el.items.map((item: any) => ({ ...item, parentId: item.parentId ?? null, description: item.description ?? '', order: item.order ?? 0, disabled: !!item.disabled, dragDisabled: !!item.dragDisabled, cloneOnDrag: !!item.cloneOnDrag, hidden: !!item.hidden })),
      movedRootIds: ['task-a'],
      originId: 'task-a',
      clone: false,
      keyboard: false,
      dropTarget: insideTarget,
      committed: false,
    };
    el._onDocumentKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
    await flushMicrotask();

    expect(JSON.stringify(el.items)).toBe(beforeSnapshot);
    expect(el._dragState).toBeNull();
  });

  it('supports touch-style pointer dragging for clone workflows', async () => {
    const el = document.createElement('ui-sortable') as any;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(el);
    await flushMicrotask();

    const handle = el.shadowRoot?.querySelector('.handle[data-id="template"]') as HTMLElement | null;
    expect(handle).toBeTruthy();

    el._dropTargetFromPoint = () => ({
      listId: 'done',
      parentId: null,
      beforeId: null,
      mode: 'before',
    });

    el._onPointerDown({
      pointerType: 'touch',
      pointerId: 11,
      clientX: 10,
      clientY: 10,
      preventDefault() {},
      composedPath() {
        return [handle];
      }
    });
    el._onPointerMove({
      pointerId: 11,
      clientX: 48,
      clientY: 56,
      preventDefault() {},
    });
    el._onPointerUp({
      pointerId: 11,
      preventDefault() {},
    });
    await flushMicrotask();

    expect(el.items.some((item: any) => item.id === 'template' && item.listId === 'ideas')).toBe(true);
    expect(el.items.some((item: any) => item.id !== 'template' && item.label.includes('Template') && item.listId === 'done')).toBe(true);
  });

  it('renders a placeholder card at the projected insertion point during drag', async () => {
    const el = document.createElement('ui-sortable') as any;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(el);
    await flushMicrotask();

    el._dragState = {
      snapshot: el.items.map((item: any) => ({
        ...item,
        parentId: item.parentId ?? null,
        description: item.description ?? '',
        order: item.order ?? 0,
        disabled: !!item.disabled,
        dragDisabled: !!item.dragDisabled,
        cloneOnDrag: !!item.cloneOnDrag,
        hidden: !!item.hidden,
      })),
      movedRootIds: ['task-a'],
      originId: 'task-a',
      clone: false,
      keyboard: true,
      dropTarget: {
        listId: 'done',
        parentId: null,
        beforeId: null,
        mode: 'before',
      },
      committed: false,
    };
    el.requestRender();
    await flushMicrotask();

    const placeholder = el.shadowRoot?.querySelector('.item.item-placeholder[data-id="task-a"]') as HTMLElement | null;
    expect(placeholder).toBeTruthy();
    expect(placeholder?.textContent).toContain('Drop preview');
    expect(placeholder?.textContent).toContain('Task A');
    expect(placeholder?.querySelector('.handle')).toBeNull();
    expect(el.shadowRoot?.querySelectorAll('.item[data-id="task-a"]').length).toBe(1);
    expect(el.shadowRoot?.querySelector('.root')?.getAttribute('data-drag-preview')).toBe('true');
    expect(el.shadowRoot?.textContent?.includes('Insert here')).toBe(false);
  });

  it('keeps the pointer drag preview visible across brief target gaps', async () => {
    const el = document.createElement('ui-sortable') as any;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(el);
    await flushMicrotask();

    el._dragState = {
      snapshot: el.items.map((item: any) => ({
        ...item,
        parentId: item.parentId ?? null,
        description: item.description ?? '',
        order: item.order ?? 0,
        disabled: !!item.disabled,
        dragDisabled: !!item.dragDisabled,
        cloneOnDrag: !!item.cloneOnDrag,
        hidden: !!item.hidden,
      })),
      movedRootIds: ['task-a'],
      originId: 'task-a',
      clone: false,
      keyboard: false,
      dropTarget: {
        listId: 'done',
        parentId: null,
        beforeId: null,
        mode: 'before',
      },
      committed: false,
    };

    el._updatePointerDragPreview();
    const overlay = el.shadowRoot?.querySelector('.drag-preview-overlay') as HTMLElement | null;
    expect(overlay?.getAttribute('data-visible')).toBe('true');
    const previousLeft = overlay?.style.left;
    const previousTop = overlay?.style.top;

    el._dragState.dropTarget = null;
    el._updatePointerDragPreview();

    expect(overlay?.getAttribute('data-visible')).toBe('true');
    expect(overlay?.style.left).toBe(previousLeft);
    expect(overlay?.style.top).toBe(previousTop);
  });

  it('stabilizes pointer target updates before switching the active drop target', async () => {
    const el = document.createElement('ui-sortable') as any;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(el);
    await flushMicrotask();

    el._dragState = {
      snapshot: el.items.map((item: any) => ({
        ...item,
        parentId: item.parentId ?? null,
        description: item.description ?? '',
        order: item.order ?? 0,
        disabled: !!item.disabled,
        dragDisabled: !!item.dragDisabled,
        cloneOnDrag: !!item.cloneOnDrag,
        hidden: !!item.hidden,
      })),
      movedRootIds: ['task-a'],
      originId: 'task-a',
      clone: false,
      keyboard: false,
      dropTarget: {
        listId: 'todo',
        parentId: null,
        beforeId: 'epic',
        mode: 'before',
      },
      committed: false,
    };

    const target = {
      listId: 'done',
      parentId: null,
      beforeId: null,
      mode: 'before',
    } as const;

    el._queueDropTarget(target, 100);
    expect(el._dragState.dropTarget).toEqual({
      listId: 'todo',
      parentId: null,
      beforeId: 'epic',
      mode: 'before',
    });

    el._queueDropTarget(target, 160);
    expect(el._dragState.dropTarget).toEqual(target);
  });

  it('does not select an item when the drag handle is clicked without dragging', async () => {
    const el = document.createElement('ui-sortable') as any;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(el);
    await flushMicrotask();

    const handle = el.shadowRoot?.querySelector('.handle[data-id="epic"]') as HTMLElement | null;
    expect(handle).toBeTruthy();

    handle?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await flushMicrotask();

    expect(el.selection).toEqual([]);
  });
});
