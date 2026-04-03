import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SplitButton } from '../components/SplitButton';

describe('SplitButton wrapper', () => {
  it('fires primary and menu selection callbacks', async () => {
    let primary = 0;
    let selected = '';

    render(
      <SplitButton
        label="Run"
        items={[
          { value: 'rerun', label: 'Rerun step' },
          { value: 'skip', label: 'Skip step' }
        ]}
        onPrimaryAction={() => {
          primary += 1;
        }}
        onSelect={(detail) => {
          selected = detail.value || '';
        }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Run' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open action menu' }));

    const menuItem = await screen.findByRole('menuitem', { name: 'Skip step' });
    fireEvent.click(menuItem);

    expect(primary).toBe(1);
    expect(selected).toBe('skip');
  });

  it('renders heading, description, and disabled items', async () => {
    render(
      <SplitButton
        label="Publish"
        menuHeading="Publish workflow"
        menuDescription="Choose the next release action."
        items={[
          { value: 'schedule', label: 'Schedule publish', description: 'Queue the release.' },
          { value: 'archive', label: 'Archive draft', disabled: true }
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open action menu' }));

    await screen.findByRole('menu');
    expect(screen.getByText('Publish workflow')).toBeTruthy();
    expect(screen.getByText('Choose the next release action.')).toBeTruthy();

    const disabledItem = screen.getByRole('menuitem', { name: 'Archive draft' });
    expect(disabledItem.getAttribute('aria-disabled')).toBe('true');
  });

  it('supports keyboard navigation and selection', async () => {
    let selected = '';

    render(
      <SplitButton
        label="Export"
        items={[
          { value: 'pdf', label: 'Export PDF' },
          { value: 'csv', label: 'Export CSV' },
          { value: 'json', label: 'Export JSON', disabled: true }
        ]}
        onSelect={(detail) => {
          selected = detail.value || '';
        }}
      />
    );

    const toggle = screen.getByRole('button', { name: 'Open action menu' });
    fireEvent.keyDown(toggle, { key: 'ArrowDown' });

    const menu = await screen.findByRole('menu');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    fireEvent.keyDown(menu, { key: 'Enter' });

    await waitFor(() => expect(selected).toBe('csv'));
  });

  it('applies square classes for hard-edge layouts', async () => {
    const { container } = render(
      <SplitButton
        label="Apply"
        variant="flat"
        shape="square"
        menuShape="square"
        items={[{ value: 'apply', label: 'Apply now' }]}
      />
    );

    const root = container.firstElementChild as HTMLElement | null;
    expect(root?.className.includes('ed-split-button--square')).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Open action menu' }));
    const menu = await screen.findByRole('menu');
    expect(menu.className.includes('ed-split-button__menu--square')).toBe(true);
  });
});
