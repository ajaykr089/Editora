import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-block-controls';

function flushMicrotask() {
  return Promise.resolve();
}

function makeVisible(element: Element | null) {
  if (!element) return;
  Object.defineProperty(element, 'getClientRects', {
    configurable: true,
    value: () => [{ width: 20, height: 20 }],
  });
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-block-controls', () => {
  it('normalizes numeric and full radius values', async () => {
    const el = document.createElement('ui-block-controls');
    el.setAttribute('radius', '12');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.style.getPropertyValue('--ui-block-controls-radius')).toBe('12px');

    el.setAttribute('radius', 'full');
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-block-controls-radius')).toBe('9999px');
  });

  it('applies roving focus to slotted controls', async () => {
    const el = document.createElement('ui-block-controls');
    el.innerHTML = '<button>Bold</button><button>Italic</button><button>Link</button>';
    document.body.appendChild(el);
    el.querySelectorAll('button').forEach((button) => makeVisible(button));
    await flushMicrotask();

    const buttons = Array.from(el.querySelectorAll('button'));
    expect(buttons[0]?.getAttribute('tabindex')).toBe('0');
    expect(buttons[1]?.getAttribute('tabindex')).toBe('-1');
    expect(buttons[2]?.getAttribute('tabindex')).toBe('-1');
  });

  it('emits navigate detail on arrow navigation', async () => {
    const el = document.createElement('ui-block-controls');
    el.innerHTML = '<button>Bold</button><button>Italic</button><button>Link</button>';
    document.body.appendChild(el);
    el.querySelectorAll('button').forEach((button) => makeVisible(button));
    await flushMicrotask();

    const onNavigate = vi.fn();
    el.addEventListener('ui-navigate', onNavigate);

    const first = el.querySelector('button') as HTMLButtonElement | null;
    first?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        composed: true,
      })
    );

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect((onNavigate.mock.calls[0]?.[0] as CustomEvent).detail).toMatchObject({
      fromIndex: 0,
      toIndex: 1,
      total: 3,
      orientation: 'horizontal',
    });
  });
});
