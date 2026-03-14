import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/Pagination';
import '../../../ui-core/src/components/ui-pagination';

import { Pagination, type PaginationElement } from '../components/Pagination';

describe('Pagination wrapper', () => {
  it('forwards change detail from the core element', async () => {
    let latestPage = 0;
    let latestReason = '';

    const { container } = render(
      <Pagination
        page={2}
        count={5}
        onPageChange={(detail) => {
          latestPage = detail.page;
          latestReason = detail.reason;
        }}
      />
    );

    const el = container.querySelector('ui-pagination') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.querySelector('.pagination')).toBeTruthy());

    const nextButton = el?.shadowRoot?.querySelector('button[aria-label="Next"]') as HTMLButtonElement | null;
    nextButton?.click();

    await waitFor(() => {
      expect(latestPage).toBe(3);
      expect(latestReason).toBe('next');
    });
  });

  it('exposes imperative pagination methods through the React ref', async () => {
    const ref = React.createRef<PaginationElement>();
    const { container } = render(<Pagination ref={ref} page={1} count={4} />);

    const el = container.querySelector('ui-pagination') as HTMLElement | null;
    await waitFor(() => expect(el?.shadowRoot?.querySelector('.pagination')).toBeTruthy());

    ref.current?.lastPage();

    await waitFor(() => {
      expect((container.querySelector('ui-pagination') as HTMLElement).getAttribute('page')).toBe('4');
    });
  });

  it('forwards new visual variants to the host element', async () => {
    const { container } = render(<Pagination page={3} count={9} variant="flat" />);

    const el = container.querySelector('ui-pagination') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.getAttribute('variant')).toBe('flat');
    });
  });
});
