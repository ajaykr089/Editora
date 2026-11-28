import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, Dropdown, HoverCard, Menu, NavigationMenu, Popover } from '../index';
import { SlotClone, mergeSlotProps } from '../components/_slot';

// Stands in for a router link: a component that forwards its ref to an <a>.
const RouterLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>(
  function RouterLink({ to, ...props }, ref) {
    return <a ref={ref} href={to} data-router="" {...props} />;
  },
);

describe('asChild slot', () => {
  it('merges class names and styles, the child winning on conflicts', () => {
    const merged = mergeSlotProps({ className: 'part', style: { color: 'red', margin: 1 }, title: 'part' }, { className: 'mine', style: { color: 'blue' }, title: 'mine' });
    expect(merged.className).toBe('part mine');
    expect(merged.style).toEqual({ color: 'blue', margin: 1 });
    expect(merged.title).toBe('mine');
  });

  it('runs both handlers, child first, and skips the part handler after preventDefault', () => {
    const calls: string[] = [];
    const { getByText, rerender } = render(
      <SlotClone onClick={() => calls.push('part')}>
        <button onClick={() => calls.push('child')}>Go</button>
      </SlotClone>,
    );
    fireEvent.click(getByText('Go'));
    expect(calls).toEqual(['child', 'part']);
    rerender(
      <SlotClone onClick={() => calls.push('part2')}>
        <button onClick={(e) => { calls.push('child2'); e.preventDefault(); }}>Go</button>
      </SlotClone>,
    );
    fireEvent.click(getByText('Go'));
    expect(calls).toEqual(['child', 'part', 'child2']);
  });

  it('gives the element to both refs', () => {
    const outer = React.createRef<HTMLElement>();
    const inner = React.createRef<HTMLButtonElement>();
    render(
      <SlotClone ref={outer}>
        <button ref={inner}>Go</button>
      </SlotClone>,
    );
    expect(outer.current).toBe(inner.current);
    expect(outer.current?.tagName).toBe('BUTTON');
  });

  it('throws on more than one child', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<SlotClone><span>a</span><span>b</span></SlotClone>)).toThrow();
    spy.mockRestore();
  });
});

describe('asChild on trigger parts', () => {
  it('Popover.Trigger puts the trigger slot on your button, no wrapper span', () => {
    const { getByText } = render(
      <Popover>
        <Popover.Trigger asChild><button className="mine">Open</button></Popover.Trigger>
        <Popover.Content>Body</Popover.Content>
      </Popover>,
    );
    const button = getByText('Open');
    expect(button.getAttribute('slot')).toBe('trigger');
    expect(button.parentElement?.tagName.toLowerCase()).toBe('ui-popover');
    expect(button.hasAttribute('asChild')).toBe(false);
    expect(button.hasAttribute('aschild')).toBe(false);
  });

  it('Dropdown.Trigger and Menu.Trigger render the child in the trigger slot', () => {
    const { getByText } = render(
      <>
        <Dropdown>
          <Dropdown.Trigger asChild><a href="#x">Dropdown</a></Dropdown.Trigger>
        </Dropdown>
        <Menu>
          <Menu.Trigger asChild><button>Menu</button></Menu.Trigger>
        </Menu>
      </>,
    );
    expect(getByText('Dropdown').tagName).toBe('A');
    expect(getByText('Dropdown').getAttribute('slot')).toBe('trigger');
    expect(getByText('Menu').getAttribute('slot')).toBe('trigger');
    expect(getByText('Menu').parentElement?.tagName.toLowerCase()).toBe('ui-menu');
  });

  it('HoverCard.Trigger renders the child itself', () => {
    const { getByText } = render(
      <HoverCard>
        <HoverCard.Trigger asChild><a href="#ada">@ada</a></HoverCard.Trigger>
        <HoverCard.Content>Ada</HoverCard.Content>
      </HoverCard>,
    );
    expect(getByText('@ada').parentElement?.tagName.toLowerCase()).toBe('ui-hover-card');
  });

  it('Accordion.Trigger marks your element as the trigger', () => {
    const { getByText } = render(
      <Accordion>
        <Accordion.Item>
          <Accordion.Trigger asChild><h3 tabIndex={0}>Shipping</h3></Accordion.Trigger>
          <Accordion.Panel>Body</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    );
    expect(getByText('Shipping').tagName).toBe('H3');
    expect(getByText('Shipping').hasAttribute('data-ui-accordion-trigger')).toBe(true);
  });

  it('NavigationMenu.Link renders a router link with the item slot and forwards the ref', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const { getByText } = render(
      <NavigationMenu>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild ref={ref}><RouterLink to="/blog">Blog</RouterLink></NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger asChild><button>Products</button></NavigationMenu.Trigger>
          <NavigationMenu.Content>Panel</NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu>,
    );
    const link = getByText('Blog');
    expect(link.getAttribute('href')).toBe('/blog');
    expect(link.hasAttribute('data-router')).toBe(true);
    expect(link.getAttribute('slot')).toBe('item');
    expect(link.getAttribute('data-nav-key')).toBeTruthy();
    expect(ref.current).toBe(link);
    const trigger = getByText('Products');
    expect(trigger.getAttribute('slot')).toBe('item');
    expect(trigger.querySelector('svg')).toBe(null);
  });
});
