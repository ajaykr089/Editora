import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Kbd } from '../components/Kbd';
import { Shortcut } from '../components/Shortcut';

describe('Keyboard hint surfaces', () => {
  it('renders keycaps with separators', () => {
    const { container } = render(<Kbd keys={['Shift', 'K']} />);

    expect(container.querySelectorAll('kbd')).toHaveLength(2);
    expect(screen.getByText('Shift')).toBeTruthy();
    expect(screen.getByText('K')).toBeTruthy();
    expect(screen.getByText('+')).toBeTruthy();
  });

  it('supports the Shortcut alias with child-derived keys', () => {
    const { container } = render(
      <Shortcut>
        <span>Cmd</span>
        <span>P</span>
      </Shortcut>
    );

    expect(container.querySelectorAll('kbd')).toHaveLength(2);
    expect(screen.getByText('Cmd')).toBeTruthy();
    expect(screen.getByText('P')).toBeTruthy();
  });

  it('centers keycap and separator content with explicit flex alignment styles', () => {
    const { container } = render(<Kbd keys={['Cmd', 'K']} />);

    const wrapper = container.firstElementChild as HTMLElement | null;
    const separator = screen.getByText('+');
    const keycap = screen.getByText('Cmd').closest('kbd') as HTMLElement | null;

    expect(wrapper?.style.alignItems).toBe('center');
    expect(wrapper?.style.verticalAlign).toBe('middle');
    expect((separator as HTMLElement).style.display).toBe('inline-flex');
    expect((separator as HTMLElement).style.alignItems).toBe('center');
    expect(keycap?.style.display).toBe('inline-flex');
    expect(keycap?.style.alignItems).toBe('center');
    expect(keycap?.style.justifyContent).toBe('center');
    expect(keycap?.style.verticalAlign).toBe('middle');
  });
});
