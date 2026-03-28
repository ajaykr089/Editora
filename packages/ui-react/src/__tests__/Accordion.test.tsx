import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../components/Accordion';
import '../../../ui-core/src/components/ui-accordion';

import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '../components/Accordion';

describe('Accordion wrapper', () => {
  it('forwards the baseline visual props to the host element', () => {
    const { container } = render(
      <Accordion variant="soft" size="lg" radius={12} tone="success" indicator="none" elevation="high">
        <AccordionItem>
          <AccordionTrigger>Section one</AccordionTrigger>
          <AccordionPanel>Panel one</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );

    const el = container.querySelector('ui-accordion') as HTMLElement | null;
    expect(el?.getAttribute('variant')).toBe('soft');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('12');
    expect(el?.getAttribute('tone')).toBe('success');
    expect(el?.getAttribute('indicator')).toBe('none');
    expect(el?.getAttribute('elevation')).toBe('high');
  });

  it('bridges toggle events back to React callbacks', () => {
    const onToggle = vi.fn();
    const { container } = render(
      <Accordion onToggle={onToggle}>
        <AccordionItem>
          <AccordionTrigger>Section one</AccordionTrigger>
          <AccordionPanel>Panel one</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );

    const el = container.querySelector('ui-accordion') as HTMLElement | null;
    el?.dispatchEvent(new CustomEvent('toggle', { detail: { open: 0 }, bubbles: true }));
    expect(onToggle).toHaveBeenCalledWith(0);
  });

  it('maps item, trigger, and panel helpers to the host contract', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem description="Overview" badge="Core" disabled>
          <AccordionTrigger>Section one</AccordionTrigger>
          <AccordionPanel>Panel one</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );

    const item = container.querySelector('[data-ui-accordion-item]') as HTMLElement | null;
    const trigger = container.querySelector('[data-ui-accordion-trigger]') as HTMLButtonElement | null;
    const panel = container.querySelector('[data-ui-accordion-panel]') as HTMLElement | null;

    expect(item?.hasAttribute('disabled')).toBe(true);
    expect(item?.getAttribute('data-description')).toBe('Overview');
    expect(item?.getAttribute('data-badge')).toBe('Core');
    expect(trigger?.textContent).toContain('Section one');
    expect(panel?.textContent).toBe('Panel one');
  });

  it('preserves live React children inside the panel instead of cloning HTML', () => {
    const onAction = vi.fn();
    const { getByText } = render(
      <Accordion collapsible>
        <AccordionItem>
          <AccordionTrigger>Section one</AccordionTrigger>
          <AccordionPanel>
            <button type="button" onClick={onAction}>
              Panel action
            </button>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );

    fireEvent.click(getByText('Section one'));
    fireEvent.click(getByText('Panel action'));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
