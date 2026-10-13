import { beforeEach, describe, expect, it } from 'vitest';
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

    // The handle is a presentational pointer affordance (a focusable button inside an option is
    // invalid nesting), so "disabled" is an attribute, not a button property.
    const handle = el.shadowRoot?.querySelector('.handle[data-id="epic"]') as HTMLElement | null;
    expect(handle?.hasAttribute('disabled')).toBe(true);
    expect(handle?.getAttribute('aria-hidden')).toBe('true');
  });

  it('keeps a selection that was set before the items', async () => {
    const el = document.createElement('ui-sortable') as HTMLElement & { selection: string[] };

    el.setAttribute('selection', JSON.stringify(['epic', 'missing']));
    document.body.appendChild(el);
    await flushMicrotask();
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    await flushMicrotask();

    expect(el.selection).toEqual(['epic']);
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

  it('does not display the selection badge for unselected items', async () => {
    const el = document.createElement('ui-sortable') as any;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    el.setAttribute('selection', JSON.stringify(['epic']));
    document.body.appendChild(el);
    await flushMicrotask();

    const taskA = el.shadowRoot?.querySelector('.item[data-id="task-a"]') as HTMLElement | null;
    const badge = taskA?.querySelector('[data-selection-badge="true"]') as HTMLElement | null;

    expect(badge?.hidden).toBe(true);
    expect(badge?.textContent).toBe('');
    expect(window.getComputedStyle(badge as HTMLElement).display).toBe('none');
  });

  it('supports container-style dropzones for item-sized insertion targets', async () => {
    const el = document.createElement('ui-sortable') as any;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    el.setAttribute('dropzone-style', 'container');
    document.body.appendChild(el);
    await flushMicrotask();

    el._dragState = {
      snapshot: el._items.map((item: any) => ({ ...item })),
      movedRootIds: ['task-a'],
      originId: 'task-a',
      clone: false,
      keyboard: false,
      dropTarget: {
        listId: 'todo',
        parentId: null,
        beforeId: 'task-b',
        mode: 'before',
      },
      committed: false,
    };

    el.requestRender();
    await flushMicrotask();
    await flushMicrotask();

    const root = el.shadowRoot?.querySelector('.root') as HTMLElement | null;
    const zone = el.shadowRoot?.querySelector('.dropzone[data-list-id="todo"][data-before-id="task-b"][data-mode="before"]') as HTMLElement | null;
    const reference = el.shadowRoot?.querySelector('.item[data-id="task-b"]') as HTMLElement | null;

    reference!.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 1459,
      bottom: 51,
      width: 1459,
      height: 51,
      toJSON() {
        return {};
      }
    });

    el._syncDropzoneContainerSize(zone, el._dragState.dropTarget);

    expect(root?.getAttribute('data-dropzone-style')).toBe('container');
    expect(zone?.getAttribute('data-active')).toBe('true');
    expect(zone?.style.getPropertyValue('--ui-sortable-dropzone-match-block-size')).toBe('76px');
    expect(zone?.style.getPropertyValue('--ui-sortable-dropzone-match-inline-size')).toBe('1459px');
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
    // The middle of a card nests only in the "area" trigger (the old behaviour); see "nesting" below for the default.
    el.setAttribute('nest-trigger', 'area');
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

  describe('keyboard handling around controls inside an item', () => {
    // Earlier tests leave elements with a pointer drag in flight attached to the document, and their
    // document-level Escape handler would also fire for the events dispatched here.
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    const press = (target: Element, key: string) => {
      const event = new KeyboardEvent('keydown', {
        key,
        code: key === ' ' ? 'Space' : key,
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      target.dispatchEvent(event);
      return event;
    };

    it('leaves Space, Enter and arrows to an <input>, <textarea> or <button> placed inside an item', async () => {
      const el = document.createElement('ui-sortable') as any;
      el.setAttribute('lists', JSON.stringify(lists));
      el.setAttribute('items', JSON.stringify(items));
      document.body.appendChild(el);
      await flushMicrotask();

      const card = el.shadowRoot.querySelector('.item[data-id="task-a"]') as HTMLElement;
      const controls = ['input', 'textarea', 'select', 'button'].map((tag) => card.appendChild(document.createElement(tag)));
      const editable = card.appendChild(document.createElement('div'));
      editable.setAttribute('contenteditable', 'true');
      Object.defineProperty(editable, 'isContentEditable', { value: true });

      for (const control of [...controls, editable]) {
        for (const key of [' ', 'Enter', 'ArrowDown', 'ArrowUp', 'Escape']) {
          expect(press(control, key).defaultPrevented, `${control.localName} ${JSON.stringify(key)}`).toBe(false);
        }
      }
      expect(el._dragState).toBeNull();
    });

    it('still lifts an item with Space, from the item or from its drag handle', async () => {
      const el = document.createElement('ui-sortable') as any;
      el.setAttribute('lists', JSON.stringify(lists));
      el.setAttribute('items', JSON.stringify(items));
      document.body.appendChild(el);
      await flushMicrotask();

      const card = el.shadowRoot.querySelector('.item[data-id="task-a"]') as HTMLElement;
      expect(press(card, ' ').defaultPrevented).toBe(true);
      expect(el._dragState?.keyboard).toBe(true);
      el.cancelDrag();

      const handle = card.querySelector('.handle') as HTMLElement;
      expect(press(handle, ' ').defaultPrevented).toBe(true);
      expect(el._dragState?.keyboard).toBe(true);
    });
  });

  describe('cancelling a pointer drag', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('clears the dragging mark immediately, without waiting for a re-render that may not change the DOM', async () => {
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
        dropTarget: null,
        committed: false,
      };
      el._setDraggingVisualState(['task-a'], true);
      const card = el.shadowRoot.querySelector('.item[data-id="task-a"]') as HTMLElement;
      expect(card.getAttribute('data-dragging')).toBe('true');

      el.cancelDrag();

      // Checked synchronously: a card left faded as "being dragged" looks like it vanished.
      expect(card.getAttribute('data-dragging')).toBe('false');
      // (aria-grabbed is deprecated and no longer emitted.)
      expect(card.hasAttribute('aria-grabbed')).toBe(false);
    });
  });

  describe('right-to-left horizontal lanes', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    const mountLane = async (dir: 'ltr' | 'rtl') => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('dir', dir);
      const el = document.createElement('ui-sortable') as any;
      el.setAttribute('lists', JSON.stringify([{ id: 'lane', label: 'Lane', orientation: 'horizontal' }]));
      el.setAttribute('items', JSON.stringify([
        { id: 'a', label: 'A', listId: 'lane' },
        { id: 'b', label: 'B', listId: 'lane' },
        { id: 'c', label: 'C', listId: 'lane' },
      ]));
      wrapper.appendChild(el);
      document.body.appendChild(wrapper);
      await flushMicrotask();
      el.focusItem('a');
      await flushMicrotask();
      const press = (key: string) =>
        (el.shadowRoot.querySelector('.item[data-id="' + el._focusedId + '"]') as HTMLElement).dispatchEvent(
          new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true })
        );
      return { el, press };
    };

    it('resolves the before/after halves of a card from the leading edge', async () => {
      const rect = { left: 100, right: 300, top: 0, bottom: 60, width: 200, height: 60, x: 100, y: 0, toJSON: () => ({}) };
      for (const [dir, nearLeadingEdge, nearTrailingEdge] of [['ltr', 110, 290], ['rtl', 290, 110]] as const) {
        const { el } = await mountLane(dir);
        const card = el.shadowRoot.querySelector('.item[data-id="b"]') as HTMLElement;
        card.getBoundingClientRect = () => rect;

        const before = el._dropTargetFromPath([card], nearLeadingEdge, 30);
        const after = el._dropTargetFromPath([card], nearTrailingEdge, 30);
        expect(before, dir).toMatchObject({ beforeId: 'b', mode: 'before' });
        expect(after, dir).toMatchObject({ beforeId: 'c', mode: 'before' });
        document.body.innerHTML = '';
      }
    });

    it('moves to the next item with ArrowRight in a left-to-right lane', async () => {
      const { el, press } = await mountLane('ltr');
      press('ArrowRight');
      expect(el._focusedId).toBe('b');
      press('ArrowLeft');
      expect(el._focusedId).toBe('a');
    });

    it('moves to the next item with ArrowLeft in a right-to-left lane', async () => {
      const { el, press } = await mountLane('rtl');
      press('ArrowLeft');
      expect(el._focusedId).toBe('b');
      press('ArrowRight');
      expect(el._focusedId).toBe('a');
    });
  });

  describe('keyboard drop targets', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    const mountAndLift = async (attrs: Record<string, string> = {}) => {
      const el = document.createElement('ui-sortable') as any;
      el.setAttribute('lists', JSON.stringify(lists));
      el.setAttribute('items', JSON.stringify(items));
      Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
      document.body.appendChild(el);
      await flushMicrotask();
      // Keys act on the focused item (that is where a real key event comes from).
      el.focusItem('task-a');
      await flushMicrotask();
      // The card is re-rendered when it is lifted, so look it up again for every key press.
      const key = (key: string) =>
        (el.shadowRoot.querySelector('.item[data-id="task-a"]') as HTMLElement).dispatchEvent(
          new KeyboardEvent('keydown', { key, code: key === ' ' ? 'Space' : key, bubbles: true, composed: true, cancelable: true })
        );
      key(' ');
      return { el, key };
    };

    it('never offers "After children" for an item that has no children', async () => {
      const { el } = await mountAndLift();
      const labels = el._keyboardDropTargets().map((target: any) => target.label);
      expect(labels).not.toContain('After children');
      // One destination per slot: before each card, nest inside each card, end of each list.
      expect(labels.filter((label: string) => label.startsWith('End of'))).toHaveLength(3);
    });

    it('with nesting off, every target is a flat, top-level position', async () => {
      const { el } = await mountAndLift({ 'allow-nesting': 'false' });
      const targets = el._keyboardDropTargets();
      expect(targets.length).toBeGreaterThan(0);
      expect(targets.every((target: any) => target.parentId === null && target.mode === 'before')).toBe(true);
    });

    it('with nesting off, ArrowDown walks through the destinations and Enter moves the item', async () => {
      const { el, key } = await mountAndLift({ 'allow-nesting': 'false' });
      const seen: string[] = [];
      for (let i = 0; i < 8; i += 1) {
        key('ArrowDown');
        seen.push(el._liveMessage);
      }
      // Must actually advance instead of repeating the same announcement.
      expect(new Set(seen).size).toBeGreaterThan(3);
      expect(seen[seen.length - 1]).toMatch(/^End of /);

      key('Enter');
      const moved = el.items.find((item: any) => item.id === 'task-a');
      expect(moved.listId).not.toBe('todo');
    });
  });

  describe('blank space inside a list', () => {
    const dragState = (el: any, dropTarget: any) => {
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
        dropTarget,
        committed: false,
      };
    };
    const mount = async () => {
      const el = document.createElement('ui-sortable') as any;
      el.setAttribute('lists', JSON.stringify(lists));
      el.setAttribute('items', JSON.stringify(items));
      document.body.appendChild(el);
      await flushMicrotask();
      return el;
    };
    const rect = (left: number, top: number, width: number, height: number) => () => ({
      left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}),
    });

    it('treats the body of an empty list, or the space under its last card, as "append to this list"', async () => {
      const el = await mount();
      const done = el.shadowRoot.querySelector('.list[data-list-id="done"]') as HTMLElement;
      const body = done.querySelector('.items') as HTMLElement;
      const append = { listId: 'done', parentId: null, beforeId: null, mode: 'before' };

      // Pointer over the list body, the header, or the list shell itself - none of them an item or rail.
      expect(el._dropTargetFromPath([body, done], 10, 10)).toEqual(append);
      expect(el._dropTargetFromPath([done.querySelector('.list-header'), done], 10, 10)).toEqual(append);
      expect(el._dropTargetFromPath([done], 10, 10)).toEqual(append);
      // Outside every list there is still nothing to drop on.
      expect(el._dropTargetFromPath([el.shadowRoot.querySelector('.board, .root') as HTMLElement], 10, 10)).toBeNull();
    });

    it('still prefers an explicit rail or an item over the blanket list fallback', async () => {
      const el = await mount();
      const todo = el.shadowRoot.querySelector('.list[data-list-id="todo"]') as HTMLElement;
      const card = todo.querySelector('.item[data-id="epic"]') as HTMLElement;
      card.getBoundingClientRect = rect(0, 100, 200, 100);

      const target = el._dropTargetFromPath([card, todo], 100, 105);
      expect(target).toEqual({ listId: 'todo', parentId: null, beforeId: 'epic', mode: 'before' });
    });

    it('does not offer the fallback on a list the dragged items cannot be dropped on', async () => {
      const el = document.createElement('ui-sortable') as any;
      el.setAttribute('lists', JSON.stringify([...lists.slice(0, 2), { id: 'locked', label: 'Locked', disabled: true }]));
      el.setAttribute('items', JSON.stringify(items));
      document.body.appendChild(el);
      await flushMicrotask();
      dragState(el, null);

      const locked = el.shadowRoot.querySelector('.list[data-list-id="locked"]') as HTMLElement;
      const target = el._dropTargetFromPath([locked], 10, 10);
      expect(target && el._canDrop(target, ['task-a'])).toBeFalsy();
    });

    // jsdom has no hit-testing: report "nothing under the pointer" like a real gap would.
    const withNoHitTarget = (run: () => void) => {
      const doc = document as any;
      const original = doc.elementFromPoint;
      doc.elementFromPoint = () => null;
      try {
        run();
      } finally {
        doc.elementFromPoint = original;
      }
    };

    it('does not commit a stale target when the pointer is released away from its list', async () => {
      const el = await mount();
      dragState(el, { listId: 'todo', parentId: null, beforeId: 'epic', mode: 'before' });
      const todo = el.shadowRoot.querySelector('.list[data-list-id="todo"]') as HTMLElement;
      todo.getBoundingClientRect = rect(0, 0, 300, 400);

      // Released far to the right of the list the pointer last targeted: cancel instead of
      // dropping into a list the pointer has already left.
      withNoHitTarget(() => expect(el._releaseDropTarget(900, 200)).toBeNull());
    });

    it('still forgives a release in a gap while the pointer is over the targeted list', async () => {
      const el = await mount();
      const target = { listId: 'todo', parentId: null, beforeId: 'epic', mode: 'before' };
      dragState(el, target);
      const todo = el.shadowRoot.querySelector('.list[data-list-id="todo"]') as HTMLElement;
      todo.getBoundingClientRect = rect(0, 0, 300, 400);

      withNoHitTarget(() => expect(el._releaseDropTarget(150, 200)).toEqual(target));
    });
  });

  it('shows the keyboard placeholder when nesting into a card that has no children yet', async () => {
    const el = document.createElement('ui-sortable') as any;
    el.setAttribute('lists', JSON.stringify(lists));
    el.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(el);
    await flushMicrotask();

    el._dragState = {
      snapshot: el.items.map((item: any) => ({ ...item })),
      movedRootIds: ['task-a'],
      originId: 'task-a',
      clone: false,
      keyboard: true,
      dropTarget: { listId: 'todo', parentId: 'task-b', beforeId: null, mode: 'inside' },
      committed: false,
    };
    el.requestRender();
    await flushMicrotask();

    const placeholder = el.shadowRoot.querySelector('.item.item-placeholder[data-id="task-a"]');
    expect(placeholder).toBeTruthy();
    expect(placeholder.closest('.children')).toBeTruthy();
  });

  describe('drag visuals', () => {
    const mount = async (attrs: Record<string, string> = {}) => {
      const el = document.createElement('ui-sortable') as any;
      el.setAttribute('lists', JSON.stringify(lists));
      el.setAttribute('items', JSON.stringify(items));
      Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
      document.body.appendChild(el);
      await flushMicrotask();
      return el;
    };

    const startPointerDrag = (el: any, id: string, pointerId: number) => {
      const handle = el.shadowRoot.querySelector(`.handle[data-id="${id}"]`) as HTMLElement;
      el._onPointerDown({
        pointerId,
        pointerType: 'mouse',
        clientX: 10,
        clientY: 10,
        preventDefault() {},
        composedPath() {
          return [handle];
        },
      });
      el._onPointerMove({ pointerId, clientX: 40, clientY: 40, preventDefault() {} });
    };

    it('shows nothing about the selection until something is selected', async () => {
      const el = await mount();
      const summary = () => el.shadowRoot.querySelector('.selection-summary') as HTMLElement;
      expect(summary().getAttribute('data-count')).toBe('0');

      el.select(['task-a', 'task-b']);
      await flushMicrotask();
      expect(summary().getAttribute('data-count')).toBe('2');
      expect(el.shadowRoot.querySelector('.selection-pill').textContent).toBe('2');

      el.clearSelection();
      await flushMicrotask();
      expect(summary().getAttribute('data-count')).toBe('0');
    });

    it('drags a copy of the card, not a text label, and leaves nothing behind', async () => {
      const el = await mount();
      startPointerDrag(el, 'task-a', 31);

      const ghost = el.shadowRoot.querySelector('.item-ghost') as HTMLElement;
      expect(ghost).toBeTruthy();
      expect(ghost.textContent).toContain('Task A');
      expect(ghost.getAttribute('aria-hidden')).toBe('true');
      // No id anywhere in the copy: lookups by id still find the real card only.
      expect(ghost.querySelectorAll('[data-id], [id], [data-drag-trigger]').length).toBe(0);
      expect(ghost.hasAttribute('data-id')).toBe(false);
      expect(el.shadowRoot.querySelectorAll('.item[data-id="task-a"]').length).toBe(1);
      // The real card stays as the empty slot.
      expect(el.shadowRoot.querySelector('.item[data-id="task-a"]').getAttribute('data-dragging')).toBe('true');

      el._onPointerMove({ pointerId: 31, clientX: 120, clientY: 90, preventDefault() {} });
      expect(ghost.style.transform).toContain('translate(');

      el.cancelDrag();
      expect(el.shadowRoot.querySelector('.item-ghost')).toBeNull();
      expect(el.shadowRoot.querySelectorAll('[data-dragging="true"]').length).toBe(0);
    });

    it('badges the ghost with the number of items moved, and leaves a copied card in place', async () => {
      const el = await mount();
      el.select(['task-a', 'task-b']);
      startPointerDrag(el, 'task-a', 32);
      const stacked = el.shadowRoot.querySelector('.item-ghost') as HTMLElement;
      expect(stacked.getAttribute('data-count')).toBe('stack');
      expect(stacked.querySelector('.ghost-badge')?.textContent).toBe('2');
      el.cancelDrag();

      // A clone leaves the original where it is: no hollow slot, and the ghost says "+".
      startPointerDrag(el, 'template', 33);
      const copy = el.shadowRoot.querySelector('.item-ghost') as HTMLElement;
      expect(copy.querySelector('.ghost-badge')?.textContent).toBe('+');
      expect(el.shadowRoot.querySelector('.item[data-id="template"]').getAttribute('data-dragging')).not.toBe('true');
      el.cancelDrag();
    });

    it('narrows the ghost for drag-preview-size="compact"', async () => {
      const el = await mount({ 'drag-preview-size': 'compact' });
      const card = el.shadowRoot.querySelector('.item[data-id="task-a"]') as HTMLElement;
      card.getBoundingClientRect = () => ({ left: 0, top: 0, right: 600, bottom: 50, width: 600, height: 50 }) as DOMRect;
      startPointerDrag(el, 'task-a', 35);
      const ghost = el.shadowRoot.querySelector('.item-ghost') as HTMLElement;
      expect(ghost.getAttribute('data-compact')).toBe('true');
      expect(ghost.style.inlineSize).toBe('240px');
      el.cancelDrag();

      el.removeAttribute('drag-preview-size');
      await flushMicrotask();
      const card2 = el.shadowRoot.querySelector('.item[data-id="task-a"]') as HTMLElement;
      card2.getBoundingClientRect = () => ({ left: 0, top: 0, right: 600, bottom: 50, width: 600, height: 50 }) as DOMRect;
      startPointerDrag(el, 'task-a', 36);
      expect((el.shadowRoot.querySelector('.item-ghost') as HTMLElement).style.inlineSize).toBe('600px');
      el.cancelDrag();
    });

    it('puts the ghost back when a render replaces the shadow content mid-drag', async () => {
      const el = await mount();
      startPointerDrag(el, 'task-a', 34);
      expect(el.shadowRoot.querySelector('.item-ghost')).toBeTruthy();

      el.setAttribute('filter-query', 'Task');
      await flushMicrotask();
      el._onPointerMove({ pointerId: 34, clientX: 70, clientY: 70, preventDefault() {} });
      expect(el.shadowRoot.querySelectorAll('.item-ghost').length).toBe(1);
      el.cancelDrag();
    });
  });

  describe('board scrolling', () => {
    const mount = async () => {
      const el = document.createElement('ui-sortable') as any;
      el.setAttribute('lists', JSON.stringify(lists));
      el.setAttribute('items', JSON.stringify(items));
      document.body.appendChild(el);
      await flushMicrotask();
      return el;
    };

    it('keeps the board and list scroll positions across a render', async () => {
      const el = await mount();
      const board = el.shadowRoot.querySelector('.lists') as HTMLElement;
      const todoItems = el.shadowRoot.querySelector('.list[data-list-id="todo"] .items') as HTMLElement;
      board.scrollLeft = 140;
      todoItems.scrollTop = 35;

      // A real change, so the render replaces the shadow content.
      el.select(['task-a']);
      el.moveSelection({ targetListId: 'todo', beforeId: 'epic' });
      await flushMicrotask();
      await flushMicrotask();

      const nextBoard = el.shadowRoot.querySelector('.lists') as HTMLElement;
      expect(nextBoard).not.toBe(board);
      expect(nextBoard.scrollLeft).toBe(140);
      expect((el.shadowRoot.querySelector('.list[data-list-id="todo"] .items') as HTMLElement).scrollTop).toBe(35);
    });

    it('scrolls the board sideways while a card is held at its edge', async () => {
      const el = await mount();
      const board = el.shadowRoot.querySelector('.lists') as HTMLElement;
      Object.defineProperty(board, 'scrollWidth', { value: 1200, configurable: true });
      Object.defineProperty(board, 'clientWidth', { value: 600, configurable: true });
      board.getBoundingClientRect = () => ({ left: 0, right: 600, top: 0, bottom: 300, width: 600, height: 300 }) as DOMRect;
      Object.defineProperty(window, 'innerWidth', { value: 600, configurable: true });

      el._dragState = {
        snapshot: [],
        movedRootIds: ['task-a'],
        originId: 'task-a',
        clone: false,
        keyboard: false,
        dropTarget: null,
        committed: true,
      };

      el._autoScrollPoint = { x: 596, y: 150 };
      el._autoScrollTick();
      expect(board.scrollLeft).toBeGreaterThan(0);
      const afterRight = board.scrollLeft;

      el._autoScrollPoint = { x: 4, y: 150 };
      el._autoScrollTick();
      expect(board.scrollLeft).toBeLessThan(afterRight);

      el._autoScrollPoint = { x: 300, y: 150 };
      const before = board.scrollLeft;
      el._autoScrollTick();
      expect(board.scrollLeft).toBe(before);
      el._stopAutoScroll();
    });

    it('brings the dropped card into view when its list is scrolled out of sight', async () => {
      const el = await mount();
      const board = el.shadowRoot.querySelector('.lists') as HTMLElement;
      Object.defineProperty(board, 'scrollWidth', { value: 1200, configurable: true });
      Object.defineProperty(board, 'clientWidth', { value: 600, configurable: true });
      board.getBoundingClientRect = () => ({ left: 0, right: 600, top: 0, bottom: 300, width: 600, height: 300 }) as DOMRect;
      const done = el.shadowRoot.querySelector('.list[data-list-id="done"]') as HTMLElement;
      done.getBoundingClientRect = () => ({ left: 700, right: 960, top: 0, bottom: 300, width: 260, height: 300 }) as DOMRect;

      el._revealInBoard(done.querySelector('.dropzone') || done);
      expect(board.scrollLeft).toBe(364);
    });
  });

  describe('labels', () => {
    const mount = async (attrs: Record<string, string> = {}, data = { lists, items }) => {
      const el = document.createElement('ui-sortable') as any;
      el.setAttribute('lists', JSON.stringify(data.lists));
      el.setAttribute('items', JSON.stringify(data.items));
      Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
      document.body.appendChild(el);
      await flushMicrotask();
      return el;
    };
    const text = (el: any, selector: string) => el.shadowRoot.querySelector(selector)?.textContent?.trim();

    it('speaks English by default', async () => {
      const el = await mount();
      expect(text(el, '#ui-sortable-helper')).toBe(
        'Use the handle to drag, or press Space on a focused item to start keyboard reordering. '
        + 'To nest an item, hold Alt or drop it on the far side of another.'
      );
      expect(text(el, '.selection-text')).toBe('items selected');
      expect(el.labels.badgeSelected).toBe('Selected');
    });

    it('translates the hint, the selection summary and the badges', async () => {
      const el = await mount({
        labels: JSON.stringify({
          hintHandle: 'Utilisez la poignée pour déplacer.',
          selectedOne: 'élément sélectionné',
          selectedMany: 'éléments sélectionnés',
          badgeSelected: 'Sélectionné',
          badgeClone: 'Cloner',
          badgePinned: 'Épinglé',
        }),
      }, {
        lists,
        items: [{ id: 'a', label: 'A', listId: 'todo', cloneOnDrag: true, dragDisabled: true }],
      });
      expect(text(el, '#ui-sortable-helper')).toMatch(/^Utilisez la poignée pour déplacer\./);
      expect(text(el, '.selection-text')).toBe('éléments sélectionnés');

      el.select(['a']);
      await flushMicrotask();
      expect(text(el, '.selection-text')).toBe('élément sélectionné');
      const badges = [...el.shadowRoot.querySelectorAll('.item[data-id="a"] .item-badge')].map((b: any) => b.textContent.trim());
      expect(badges).toContain('Sélectionné');
      expect(badges).toContain('Cloner');
      expect(badges).toContain('Épinglé');
    });

    it('takes labels as a property, merges them over the defaults, and ignores what is not text', async () => {
      const el = await mount();
      el.labels = { hintHandle: 'Drag me.', selectedMany: 42 as any, nope: 'x' } as any;
      await flushMicrotask();
      expect(text(el, '#ui-sortable-helper')).toMatch(/^Drag me\. /);
      expect(el.labels.selectedMany).toBe('items selected');
      expect(el.labels.hintItem).toContain('Drag from anywhere');
      expect('nope' in el.labels).toBe(false);

      el.labels = null;
      await flushMicrotask();
      expect(el.hasAttribute('labels')).toBe(false);
      expect(text(el, '#ui-sortable-helper')).toContain('Use the handle to drag');

      el.setAttribute('labels', '{not json');
      await flushMicrotask();
      expect(text(el, '#ui-sortable-helper')).toContain('Use the handle to drag');
    });

    it('uses a list\'s own emptyLabel first, then the translated default', async () => {
      const el = await mount(
        { labels: JSON.stringify({ emptyList: 'Rien ici.' }) },
        { lists: [{ id: 'a', label: 'A', emptyLabel: 'Custom empty' }, { id: 'b', label: 'B' }], items: [] }
      );
      const empties = [...el.shadowRoot.querySelectorAll('.empty')].map((node: any) => node.textContent.trim());
      expect(empties).toEqual(['Custom empty', 'Rien ici.']);
    });

    it('announces moves and drag steps with the translated text', async () => {
      const el = await mount({
        labels: JSON.stringify({
          announceReorderedOne: '{list} : élément déplacé.',
          announceMovedOne: 'Déplacé vers {list}.',
          targetBefore: 'Avant {label}',
          announceLifted: 'Soulevé : {label}.',
          announceLiftedHelp: 'Flèches pour choisir.',
        }),
      });
      const live = () => el.shadowRoot.querySelector('.sr-only[aria-live]').textContent;

      el.select(['task-a']);
      el.moveSelection({ targetListId: 'todo', beforeId: 'epic' });
      expect(live()).toBe('To do : élément déplacé.');

      el.select(['task-a']);
      el.moveSelection({ targetListId: 'done' });
      expect(live()).toBe('Déplacé vers Done.');

      const item = el.shadowRoot.querySelector('.item[data-id="task-b"]') as HTMLElement;
      el.focusItem('task-b');
      el._onKeyDown({ key: ' ', code: 'Space', preventDefault() {}, target: item, composedPath: () => [item] });
      expect(live()).toBe('Soulevé : Task B. Flèches pour choisir.');
      expect(el._keyboardDropTargets()[0].label).toMatch(/^Avant /);
      el.cancelDrag();
    });

    it('labels the drop rails of the container style', async () => {
      const el = await mount({ 'dropzone-style': 'container', labels: JSON.stringify({ dropHere: 'Déposer ici', nestHere: 'Imbriquer ici' }) });
      const labels = new Set([...el.shadowRoot.querySelectorAll('.dropzone-label')].map((node: any) => node.textContent.trim()));
      expect(labels.has('Déposer ici')).toBe(true);
      expect(labels.has('Imbriquer ici')).toBe(true);
      expect(labels.has('Drop here')).toBe(false);
    });
  });

  describe('hide-toolbar', () => {
    it('hides the hint and the selection count from sight but keeps the hint that describes the lists', async () => {
      const el = document.createElement('ui-sortable') as any;
      el.setAttribute('lists', JSON.stringify(lists));
      el.setAttribute('items', JSON.stringify(items));
      el.setAttribute('hide-toolbar', '');
      document.body.appendChild(el);
      await flushMicrotask();

      const toolbar = el.shadowRoot.querySelector('.toolbar') as HTMLElement;
      expect(toolbar.getAttribute('data-hidden')).toBe('true');
      const helper = el.shadowRoot.querySelector('#ui-sortable-helper');
      expect(helper?.textContent).toContain('Use the handle');
      expect(el.shadowRoot.querySelector('.items')?.getAttribute('aria-describedby')).toBe('ui-sortable-helper');

      el.removeAttribute('hide-toolbar');
      await flushMicrotask();
      expect(el.shadowRoot.querySelector('.toolbar')?.hasAttribute('data-hidden')).toBe(false);
    });
  });

  describe('nesting', () => {
    const rect = (left: number, top: number, right: number, bottom: number) => () =>
      ({ left, top, right, bottom, x: left, y: top, width: right - left, height: bottom - top, toJSON: () => ({}) }) as DOMRect;

    const mount = async (attrs: Record<string, string> = {}, data = { lists, items }) => {
      const el = document.createElement('ui-sortable') as any;
      el.setAttribute('lists', JSON.stringify(data.lists));
      el.setAttribute('items', JSON.stringify(data.items));
      Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
      document.body.appendChild(el);
      await flushMicrotask();
      // A 200 x 100 card at the origin.
      (el.shadowRoot.querySelector('.item[data-id="epic"]') as HTMLElement).getBoundingClientRect = rect(0, 0, 200, 100);
      return el;
    };
    const over = (el: any, x: number, y: number) =>
      el._dropTargetFromEvent({ composedPath: () => [el.shadowRoot.querySelector('.item[data-id="epic"]')], clientX: x, clientY: y });
    const before = { listId: 'todo', parentId: null, beforeId: 'epic', mode: 'before' };
    const after = { listId: 'todo', parentId: null, beforeId: 'task-a', mode: 'before' };
    const inside = { listId: 'todo', parentId: 'epic', beforeId: null, mode: 'inside' };

    it('reorders on a plain drag, however the pointer crosses the card: top half before, bottom half after', async () => {
      const el = await mount();
      expect(over(el, 20, 5)).toEqual(before);
      expect(over(el, 20, 40)).toEqual(before);
      // The middle of the card used to nest. Without Alt, and away from the far side, it does not.
      expect(over(el, 100, 50)).toEqual(after);
      expect(over(el, 20, 60)).toEqual(after);
      expect(over(el, 20, 95)).toEqual(after);
    });

    it('nests with Alt held, in the middle band of the card', async () => {
      const el = await mount();
      el._nestModifier = true;
      expect(over(el, 100, 50)).toEqual(inside);
      expect(over(el, 20, 30)).toEqual(inside);
      // The outer quarters still reorder: Alt does not make the whole card a nest target.
      expect(over(el, 20, 10)).toEqual(before);
      expect(over(el, 20, 90)).toEqual(after);
    });

    it('nests on the far side of a card without a keyboard (touch), and only in its middle band', async () => {
      const el = await mount();
      expect(over(el, 190, 50)).toEqual(inside);
      expect(over(el, 190, 10)).toEqual(before);
      expect(over(el, 190, 90)).toEqual(after);
      // Not the near side.
      expect(over(el, 10, 50)).toEqual(after);
    });

    it('puts the far side on the left in a right-to-left page', async () => {
      const el = await mount();
      el.setAttribute('dir', 'rtl');
      expect(over(el, 10, 50)).toEqual(inside);
      expect(over(el, 190, 50)).toEqual(after);
    });

    it('uses the bottom of a card in a horizontal lane as its far side', async () => {
      const horizontal = { lists: [{ id: 'todo', label: 'To do', orientation: 'horizontal' }], items };
      const el = await mount({}, horizontal as any);
      // Along the lane the pointer is in the middle of the card; the far side is its bottom edge.
      expect(over(el, 100, 95)).toEqual(inside);
      expect(over(el, 100, 20)).toEqual(after);
      expect(over(el, 20, 20)).toEqual(before);
    });

    it('nest-trigger="modifier" ignores the far side', async () => {
      const el = await mount({ 'nest-trigger': 'modifier' });
      expect(over(el, 190, 50)).toEqual(after);
      el._nestModifier = true;
      expect(over(el, 190, 50)).toEqual(inside);
    });

    it('nest-trigger="area" keeps the old rule: the middle of a card nests, with no key held', async () => {
      const el = await mount({ 'nest-trigger': 'area' });
      expect(over(el, 100, 50)).toEqual(inside);
      expect(over(el, 20, 20)).toEqual(before);
      expect(over(el, 20, 90)).toEqual(after);
    });

    it('never nests when allow-nesting is false, whatever the trigger or the key', async () => {
      for (const trigger of ['gutter', 'modifier', 'area']) {
        const el = await mount({ 'allow-nesting': 'false', 'nest-trigger': trigger });
        el._nestModifier = true;
        expect(over(el, 190, 50).mode).toBe('before');
      }
    });

    it('treats an unknown nest-trigger as the default', async () => {
      const el = await mount({ 'nest-trigger': 'sideways' });
      expect(over(el, 100, 50)).toEqual(after);
      expect(over(el, 190, 50)).toEqual(inside);
    });

    it('moves the drop target when Alt is pressed or released, without the pointer moving', async () => {
      const el = await mount();
      el._dragState = {
        snapshot: el.items.map((item: any) => ({ ...item })),
        movedRootIds: ['task-b'],
        originId: 'task-b',
        clone: false,
        keyboard: false,
        dropTarget: null,
        committed: false,
      };
      el._lastPointer = { x: 100, y: 50 };
      // The test has no hit testing: report the card under the pointer.
      el._pathFromPoint = () => [el.shadowRoot.querySelector('.item[data-id="epic"]')];

      el._setDropTarget(el._dropTargetFromPoint(100, 50));
      expect(el._dragState.dropTarget).toEqual(after);

      el._onDocumentKeyDown(new KeyboardEvent('keydown', { key: 'Alt' }));
      expect(el._dragState.dropTarget).toEqual(inside);
      expect(el.shadowRoot.querySelector('.item[data-id="epic"]').getAttribute('data-drop-inside-active')).toBe('true');

      el._onDocumentKeyUp(new KeyboardEvent('keyup', { key: 'Alt' }));
      expect(el._dragState.dropTarget).toEqual(after);
      expect(el.shadowRoot.querySelector('.item[data-id="epic"]').getAttribute('data-drop-inside-active')).toBe('false');
      el.cancelDrag();
    });

    it('releases onto the nest target when Alt is held at the drop', async () => {
      const el = await mount();
      el._pathFromPoint = () => [el.shadowRoot.querySelector('.item[data-id="epic"]')];
      const handle = el.shadowRoot.querySelector('.handle[data-id="task-a"]') as HTMLElement;
      el._onPointerDown({ pointerId: 41, pointerType: 'mouse', clientX: 300, clientY: 300, preventDefault() {}, composedPath: () => [handle] });
      el._onPointerMove({ pointerId: 41, clientX: 100, clientY: 50, altKey: true, preventDefault() {} });
      el._onPointerUp({ pointerId: 41, clientX: 100, clientY: 50, altKey: true, preventDefault() {} });
      await flushMicrotask();
      expect(el.items.find((item: any) => item.id === 'task-a').parentId).toBe('epic');
    });

    it('tells the user how to nest, in the hint, and says nothing when nesting is off', async () => {
      const hint = (el: any) => el.shadowRoot.querySelector('#ui-sortable-helper').textContent;
      expect(hint(await mount())).toContain('hold Alt or drop it on the far side');
      expect(hint(await mount({ 'nest-trigger': 'modifier' }))).toContain('hold Alt while you drop it');
      expect(hint(await mount({ 'nest-trigger': 'area' }))).toContain('drop it on the middle of another');
      expect(hint(await mount({ 'allow-nesting': 'false' }))).not.toContain('nest');
      const custom = await mount({ labels: JSON.stringify({ hintNestGutter: 'Alt pour imbriquer.' }) });
      expect(hint(custom)).toContain('Alt pour imbriquer.');
    });
  });
});
