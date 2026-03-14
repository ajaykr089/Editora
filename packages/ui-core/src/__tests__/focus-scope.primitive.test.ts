import { beforeEach, describe, expect, it } from 'vitest';
import { createFocusScope } from '../primitives/focus-scope';
import '../components/ui-focus-scope';

describe('focus scope primitive', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('traps tab navigation and restores focus on destroy', () => {
    const outside = document.createElement('button');
    const container = document.createElement('div');
    const first = document.createElement('button');
    const second = document.createElement('button');
    outside.textContent = 'outside';
    first.textContent = 'first';
    second.textContent = 'second';
    container.append(first, second);
    document.body.append(outside, container);
    outside.focus();

    const scope = createFocusScope({ node: container, trapped: true, restoreFocus: true });
    expect(document.activeElement).toBe(first);

    second.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(first);

    outside.focus();
    expect(container.contains(document.activeElement)).toBe(true);

    scope.destroy();
    expect(document.activeElement).toBe(outside);
  });

  it('inerts sibling trees while active', () => {
    const sibling = document.createElement('div');
    const scopeRoot = document.createElement('div');
    scopeRoot.appendChild(document.createElement('button'));
    document.body.append(sibling, scopeRoot);

    const scope = createFocusScope({ node: scopeRoot, inertOthers: true });
    expect(sibling.hasAttribute('inert')).toBe(true);

    scope.destroy();
    expect(sibling.hasAttribute('inert')).toBe(false);
  });

  it('activates and deactivates through ui-focus-scope', () => {
    const outside = document.createElement('button');
    const scope = document.createElement('ui-focus-scope');
    const button = document.createElement('button');
    button.textContent = 'inside';
    scope.appendChild(button);
    document.body.append(outside, scope);

    outside.focus();
    scope.setAttribute('active', '');
    expect(document.activeElement).toBe(button);

    scope.removeAttribute('active');
    expect(document.activeElement).toBe(outside);
  });
});
