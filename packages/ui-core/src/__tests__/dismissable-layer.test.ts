import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDismissableLayer } from '../primitives/dismissable-layer';
import '../components/ui-dismissable-layer';

describe('dismissable layer', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('dismisses only the top-most layer on outside interaction', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    const parent = document.createElement('div');
    const child = document.createElement('div');
    parent.appendChild(child);
    document.body.appendChild(parent);

    const parentDismiss = vi.fn();
    const childDismiss = vi.fn();

    const parentLayer = createDismissableLayer({ node: parent, onDismiss: parentDismiss });
    const childLayer = createDismissableLayer({ node: child, onDismiss: childDismiss });

    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(childDismiss).toHaveBeenCalledTimes(1);
    expect(parentDismiss).not.toHaveBeenCalled();

    childLayer.destroy();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(parentDismiss).toHaveBeenCalledTimes(1);

    parentLayer.destroy();
  });

  it('supports dismiss cancellation via onBeforeDismiss', () => {
    const outside = document.createElement('button');
    const content = document.createElement('div');
    document.body.append(outside, content);

    const dismiss = vi.fn();
    const layer = createDismissableLayer({
      node: content,
      onBeforeDismiss: () => false,
      onDismiss: dismiss
    });

    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(dismiss).not.toHaveBeenCalled();

    layer.destroy();
  });

  it('dispatches cancelable close events from ui-dismissable-layer', () => {
    const layer = document.createElement('ui-dismissable-layer');
    const trigger = document.createElement('button');
    trigger.slot = 'trigger';
    const content = document.createElement('div');
    layer.append(trigger, content);
    layer.setAttribute('open', '');

    const beforeClose = vi.fn((event: Event) => event.preventDefault());
    const close = vi.fn();

    layer.addEventListener('before-close', beforeClose);
    layer.addEventListener('close', close);
    document.body.appendChild(layer);

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(beforeClose).toHaveBeenCalledTimes(1);
    expect(close).not.toHaveBeenCalled();

    layer.removeEventListener('before-close', beforeClose);
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(close).toHaveBeenCalledTimes(1);
  });
});
