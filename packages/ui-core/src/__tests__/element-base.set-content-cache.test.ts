import { describe, expect, it } from 'vitest';
import { ElementBase } from '../ElementBase';

class ElementBaseSetContentCacheSpec extends ElementBase {
  static get observedAttributes() {
    return ['data-value'];
  }

  triggerRerender(): void {
    this.requestRender();
  }

  forceRebuild(): void {
    this.setContent('<div class="node">cached</div>', { force: true });
  }

  clearCache(): void {
    this.invalidateContentCache();
  }

  protected render(): void {
    this.setContent('<div class="node">cached</div>');
  }
}

const tagName = 'ui-element-base-cache-spec';
if (typeof customElements !== 'undefined' && !customElements.get(tagName)) {
  customElements.define(tagName, ElementBaseSetContentCacheSpec);
}

function flushMicrotask() {
  return Promise.resolve();
}

describe('ElementBase setContent cache', () => {
  it('keeps shadow node identity when rendering identical template', async () => {
    const el = document.createElement(tagName) as ElementBaseSetContentCacheSpec;
    document.body.appendChild(el);
    await flushMicrotask();

    const firstNode = el.shadowRoot?.querySelector('.node');
    expect(firstNode).toBeTruthy();

    el.triggerRerender();
    await flushMicrotask();

    const secondNode = el.shadowRoot?.querySelector('.node');
    expect(secondNode).toBe(firstNode);
    el.remove();
  });

  it('supports forced rebuild when explicitly requested', async () => {
    const el = document.createElement(tagName) as ElementBaseSetContentCacheSpec;
    document.body.appendChild(el);
    await flushMicrotask();

    const firstNode = el.shadowRoot?.querySelector('.node');
    expect(firstNode).toBeTruthy();

    el.forceRebuild();

    const secondNode = el.shadowRoot?.querySelector('.node');
    expect(secondNode).not.toBe(firstNode);
    el.remove();
  });

  it('supports cache invalidation for next render', async () => {
    const el = document.createElement(tagName) as ElementBaseSetContentCacheSpec;
    document.body.appendChild(el);
    await flushMicrotask();

    const firstNode = el.shadowRoot?.querySelector('.node');
    expect(firstNode).toBeTruthy();

    el.clearCache();
    el.triggerRerender();
    await flushMicrotask();

    const secondNode = el.shadowRoot?.querySelector('.node');
    expect(secondNode).not.toBe(firstNode);
    el.remove();
  });
});
