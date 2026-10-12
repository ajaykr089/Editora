import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Pagination } from '../components/Pagination';

describe('Pagination attributes', () => {
  it('keeps the count that a linked <ui-data-table> wrote on the element', () => {
    const { container, rerender } = render(<Pagination id="pager" page={1} />);
    const pager = container.querySelector('ui-pagination') as HTMLElement;

    // What <ui-data-table pagination-id="pager"> does once it has counted its pages.
    pager.setAttribute('count', '5');
    rerender(<Pagination id="pager" page={2} />);

    expect(pager.getAttribute('page')).toBe('2');
    expect(pager.getAttribute('count')).toBe('5');
  });

  it('still removes an attribute that its own prop set and that is then unset', () => {
    const { container, rerender } = render(<Pagination count={3} />);
    const pager = container.querySelector('ui-pagination') as HTMLElement;
    expect(pager.getAttribute('count')).toBe('3');

    rerender(<Pagination />);
    expect(pager.hasAttribute('count')).toBe(false);
  });
});
