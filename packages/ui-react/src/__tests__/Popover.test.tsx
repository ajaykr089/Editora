import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/Popover';
import '../../../ui-core/src/components/ui-popover';

import { Popover, type PopoverElement } from '../components/Popover';

describe('Popover wrapper', () => {
  it('syncs placement and close-behavior props to the host element', async () => {
    const { container } = render(
      <Popover placement="right-start" offset={14} flip={false} shift={false} closeOnEscape={false} closeOnOutside={false}>
        <button slot="trigger">Trigger</button>
        <div slot="content">Body</div>
      </Popover>
    );

    const el = container.querySelector('ui-popover') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.getAttribute('placement')).toBe('right-start');
      expect(el?.getAttribute('offset')).toBe('14');
      expect(el?.getAttribute('flip')).toBe('false');
      expect(el?.getAttribute('shift')).toBe('false');
      expect(el?.getAttribute('close-on-escape')).toBe('false');
      expect(el?.getAttribute('close-on-outside')).toBe('false');
    });
  });

  it('forwards open and close lifecycle callbacks', async () => {
    const ref = React.createRef<PopoverElement>();
    const events: string[] = [];

    render(
      <Popover
        ref={ref}
        onOpen={() => events.push('open')}
        onClose={() => events.push('close')}
        onOpenChange={(detail) => events.push(detail.open ? 'open-change:true' : 'open-change:false')}
      >
        <button slot="trigger">Trigger</button>
        <div slot="content">Body</div>
      </Popover>
    );

    ref.current?.open();
    await waitFor(() => expect(events).toContain('open'));

    ref.current?.close();
    await waitFor(() => expect(events).toContain('close'));
    expect(events).toContain('open-change:true');
    expect(events).toContain('open-change:false');
  });
});
