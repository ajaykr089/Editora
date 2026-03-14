import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-navigation-menu';
import { NavigationMenu } from '../components/NavigationMenu';

describe('NavigationMenu wrapper', () => {
  it('forwards the public visual props to the host element', () => {
    const { container } = render(
      <NavigationMenu
        selected={1}
        orientation="vertical"
        activation="manual"
        variant="soft"
        size="lg"
        radius={16}
        elevation="high"
        tone="warning"
        loop={false}
        collapsible
      >
        <button slot="item">Overview</button>
        <button slot="item">Reports</button>
        <section slot="panel">Overview panel</section>
        <section slot="panel">Reports panel</section>
      </NavigationMenu>
    );

    const el = container.querySelector('ui-navigation-menu') as HTMLElement | null;
    expect(el?.getAttribute('selected')).toBe('1');
    expect(el?.getAttribute('orientation')).toBe('vertical');
    expect(el?.getAttribute('activation')).toBe('manual');
    expect(el?.getAttribute('variant')).toBe('soft');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('16');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('tone')).toBe('warning');
    expect(el?.getAttribute('loop')).toBe('false');
    expect(el?.hasAttribute('collapsible')).toBe(true);
  });

  it('keeps surface, md, low, and default tone as implicit defaults', () => {
    const { container } = render(
      <NavigationMenu variant="surface" size="md" elevation="low" tone="default">
        <button slot="item">Overview</button>
        <section slot="panel">Overview panel</section>
      </NavigationMenu>
    );

    const el = container.querySelector('ui-navigation-menu') as HTMLElement | null;
    expect(el?.hasAttribute('variant')).toBe(false);
    expect(el?.hasAttribute('size')).toBe(false);
    expect(el?.hasAttribute('elevation')).toBe(false);
    expect(el?.hasAttribute('tone')).toBe(false);
  });

  it('supports the compound helper API', () => {
    const { container } = render(
      <NavigationMenu.Root selected={1} variant="soft">
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Learn</NavigationMenu.Trigger>
            <NavigationMenu.Content>Learn content</NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Overview</NavigationMenu.Trigger>
            <NavigationMenu.Content>Overview content</NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="https://example.com">Github</NavigationMenu.Link>
            <NavigationMenu.Content>Github content</NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Indicator />
        <NavigationMenu.Viewport />
      </NavigationMenu.Root>
    );

    const el = container.querySelector('ui-navigation-menu') as HTMLElement | null;
    const items = el?.querySelectorAll('[slot="item"]');
    const panels = el?.querySelectorAll('[slot="panel"]');
    expect(items?.length).toBe(3);
    expect(panels?.length).toBe(3);
    expect(items?.[0]?.textContent).toContain('Learn');
    expect(items?.[2]?.getAttribute('href')).toBe('https://example.com');
  });

  it('allows link items without a matching content panel', () => {
    const { container } = render(
      <NavigationMenu.Root selected={0}>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Learn</NavigationMenu.Trigger>
            <NavigationMenu.Content>Learn content</NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Overview</NavigationMenu.Trigger>
            <NavigationMenu.Content>Overview content</NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="https://example.com">Github</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Indicator />
        <NavigationMenu.Viewport />
      </NavigationMenu.Root>
    );

    const el = container.querySelector('ui-navigation-menu');
    const items = el?.querySelectorAll('[slot="item"]');
    const panels = el?.querySelectorAll('[slot="panel"]');
    expect(items?.length).toBe(3);
    expect(panels?.length).toBe(2);
    expect(items?.[2]?.hasAttribute('aria-controls')).toBe(false);
  });

  it('shows a caret only for triggers that own content and updates it from aria-expanded', async () => {
    const { container } = render(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Learn</NavigationMenu.Trigger>
            <NavigationMenu.Content>Learn content</NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="https://example.com">Github</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Indicator />
        <NavigationMenu.Viewport />
      </NavigationMenu.Root>
    );

    const items = container.querySelectorAll('[slot="item"]');
    const trigger = items[0] as HTMLButtonElement;
    const link = items[1] as HTMLAnchorElement;

    await waitFor(() => {
      expect(trigger.querySelector('svg')).toBeTruthy();
    });
    expect(link.querySelector('svg')).toBeFalsy();

    trigger.setAttribute('aria-expanded', 'true');

    await waitFor(() => {
      expect((trigger.querySelector('svg') as SVGElement | null)?.style.transform).toContain('180deg');
    });
  });
});
