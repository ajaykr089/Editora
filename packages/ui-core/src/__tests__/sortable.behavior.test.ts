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
});
