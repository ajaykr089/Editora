import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/Collection';
import '../components/Listbox';
import '../components/RovingFocusGroup';
import '../components/DismissableLayer';
import '../components/FocusScope';
import '../components/Positioner';
import '../components/Anchor';
import '../../../ui-core/src/components/ui-collection';
import '../../../ui-core/src/components/ui-listbox';
import '../../../ui-core/src/components/ui-roving-focus-group';
import '../../../ui-core/src/components/ui-dismissable-layer';
import '../../../ui-core/src/components/ui-focus-scope';
import '../../../ui-core/src/components/ui-positioner';
import '../../../ui-core/src/components/ui-anchor';

import { Anchor } from '../components/Anchor';
import { Collection } from '../components/Collection';
import { DismissableLayer } from '../components/DismissableLayer';
import { FocusScope } from '../components/FocusScope';
import { Listbox } from '../components/Listbox';
import { Positioner } from '../components/Positioner';
import { RovingFocusGroup } from '../components/RovingFocusGroup';

describe('primitive wrappers', () => {
  it('forwards collection and listbox attributes', async () => {
    const { container } = render(
      <>
        <Collection itemSelector=".item" itemRole="option" />
        <Listbox itemSelector=".option" activeAttribute="data-current" />
      </>
    );

    const collection = container.querySelector('ui-collection');
    const listbox = container.querySelector('ui-listbox');
    await waitFor(() => {
      expect(collection?.getAttribute('item-selector')).toBe('.item');
      expect(collection?.getAttribute('item-role')).toBe('option');
      expect(listbox?.getAttribute('item-selector')).toBe('.option');
      expect(listbox?.getAttribute('active-attribute')).toBe('data-current');
    });
  });

  it('forwards roving focus and primitive event bridges', async () => {
    let activeChanged = false;
    let beforeCloseReason = '';
    let closeReason = '';
    let escapeFired = false;
    let mountFired = false;
    let placement = '';

    const { container } = render(
      <>
        <RovingFocusGroup itemSelector=".item" loop={false} onActiveItemChange={() => { activeChanged = true; }} />
        <DismissableLayer
          open
          closeOnEscape={false}
          onBeforeClose={(detail) => {
            beforeCloseReason = detail.reason;
          }}
          onClose={(detail) => {
            closeReason = detail.reason;
          }}
        />
        <FocusScope active autoFocus="container" onEscape={() => { escapeFired = true; }} onFocusScopeMount={() => { mountFired = true; }} />
        <Positioner open placement="bottom-start" onPositionChange={(detail) => { placement = detail.placement; }} />
        <Anchor id="anchor-node">Anchor</Anchor>
      </>
    );

    const roving = container.querySelector('ui-roving-focus-group') as HTMLElement | null;
    const layer = container.querySelector('ui-dismissable-layer') as HTMLElement | null;
    const scope = container.querySelector('ui-focus-scope') as HTMLElement | null;
    const positioner = container.querySelector('ui-positioner') as HTMLElement | null;
    const anchor = container.querySelector('ui-anchor') as HTMLElement | null;

    expect(anchor?.id).toBe('anchor-node');

    roving?.dispatchEvent(new CustomEvent('active-item-change', { detail: { item: null }, bubbles: true, composed: true }));
    layer?.dispatchEvent(new CustomEvent('before-close', { detail: { reason: 'escape-key' }, bubbles: true, composed: true }));
    layer?.dispatchEvent(new CustomEvent('close', { detail: { reason: 'outside-pointer' }, bubbles: true, composed: true }));
    scope?.dispatchEvent(new CustomEvent('escape', { detail: { originalEvent: undefined }, bubbles: true, composed: true }));
    scope?.dispatchEvent(new CustomEvent('focus-scope-mount', { bubbles: true, composed: true }));
    positioner?.dispatchEvent(
      new CustomEvent('position-change', {
        detail: { placement: 'bottom-start', strategy: 'fixed', x: 0, y: 0 },
        bubbles: true,
        composed: true
      })
    );

    await waitFor(() => {
      expect(roving?.getAttribute('item-selector')).toBe('.item');
      expect(roving?.getAttribute('loop')).toBe('false');
      expect(layer?.getAttribute('open')).toBe('');
      expect(layer?.getAttribute('close-on-escape')).toBe('false');
      expect(scope?.getAttribute('active')).toBe('');
      expect(scope?.getAttribute('auto-focus')).toBe('container');
      expect(positioner?.getAttribute('open')).toBe('');
      expect(positioner?.getAttribute('placement')).toBe('bottom-start');
      expect(activeChanged).toBe(true);
      expect(beforeCloseReason).toBe('escape-key');
      expect(closeReason).toBe('outside-pointer');
      expect(escapeFired).toBe(true);
      expect(mountFired).toBe(true);
      expect(placement).toBe('bottom-start');
    });
  });
});
