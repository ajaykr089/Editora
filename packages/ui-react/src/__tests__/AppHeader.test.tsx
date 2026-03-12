import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../../../ui-core/src/components/ui-app-header';
import { AppHeader, AppHeaderCenter, AppHeaderEnd, AppHeaderStart, AppHeaderSubtitle, AppHeaderTitle } from '../components/AppHeader';

describe('AppHeader wrapper', () => {
  it('forwards the public visual props to the host element', () => {
    const { container } = render(
      <AppHeader
        sticky
        bordered
        showMenuButton
        variant="soft"
        tone="warning"
        size="lg"
        radius={16}
        elevation="high"
      >
        Header
      </AppHeader>
    );

    const el = container.querySelector('ui-app-header') as HTMLElement | null;
    expect(el?.hasAttribute('sticky')).toBe(true);
    expect(el?.hasAttribute('bordered')).toBe(true);
    expect(el?.hasAttribute('show-menu-button')).toBe(true);
    expect(el?.getAttribute('variant')).toBe('soft');
    expect(el?.getAttribute('tone')).toBe('warning');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('16');
    expect(el?.getAttribute('elevation')).toBe('high');
  });

  it('maps structured helpers to the slot contract', () => {
    const { container } = render(
      <AppHeader>
        <AppHeaderStart>Brand</AppHeaderStart>
        <AppHeaderCenter>Status</AppHeaderCenter>
        <AppHeaderTitle>Workspace</AppHeaderTitle>
        <AppHeaderSubtitle>Shift A</AppHeaderSubtitle>
        <AppHeaderEnd>Actions</AppHeaderEnd>
      </AppHeader>
    );

    expect(container.querySelector('[slot="start"]')?.textContent).toBe('Brand');
    expect(container.querySelector('[slot="center"]')?.textContent).toBe('Status');
    expect(container.querySelector('[slot="title"]')?.textContent).toBe('Workspace');
    expect(container.querySelector('[slot="subtitle"]')?.textContent).toBe('Shift A');
    expect(container.querySelector('[slot="end"]')?.textContent).toBe('Actions');
  });

  it('adds runtime layout hooks for structured helper sections', () => {
    const { container } = render(
      <AppHeader>
        <AppHeaderStart>Brand</AppHeaderStart>
        <AppHeaderEnd>
          <button type="button">Search</button>
          <button type="button">Alerts</button>
        </AppHeaderEnd>
      </AppHeader>
    );

    const end = container.querySelector('[data-ui-app-header-end]') as HTMLElement | null;
    expect(end).toBeTruthy();
    expect(document.getElementById('editora-ui-react-app-header-runtime-styles')?.textContent).toContain(
      '[data-ui-app-header-end]'
    );
    expect(end?.textContent).toContain('Search');
    expect(end?.textContent).toContain('Alerts');
  });

  it('bridges the menu trigger event to onMenuTrigger', () => {
    const onMenuTrigger = vi.fn();
    const { container } = render(
      <AppHeader showMenuButton onMenuTrigger={onMenuTrigger}>
        Header
      </AppHeader>
    );

    const el = container.querySelector('ui-app-header') as HTMLElement | null;
    el?.dispatchEvent(new CustomEvent('menu-trigger', { bubbles: true }));

    expect(onMenuTrigger).toHaveBeenCalledTimes(1);
  });
});
