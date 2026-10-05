import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-alert';
import '../../../ui-core/src/components/ui-badge';
import '../../../ui-core/src/components/ui-container';
import '../../../ui-core/src/components/ui-context-menu';
import '../../../ui-core/src/components/ui-data-table';
import '../../../ui-core/src/components/ui-empty-state';
import '../../../ui-core/src/components/ui-field';
import '../../../ui-core/src/components/ui-flex';
import '../../../ui-core/src/components/ui-grid';
import '../../../ui-core/src/components/ui-navigation-menu';
import '../../../ui-core/src/components/ui-skeleton';
import '../../../ui-core/src/components/ui-table';

import { Alert } from '../components/Alert';
import { Badge } from '../components/Badge';
import { Container } from '../components/Container';
import { ContextMenu } from '../components/ContextMenu';
import { DataTable } from '../components/DataTable';
import { EmptyState } from '../components/EmptyState';
import { Field } from '../components/Field';
import { FloatingOverlay } from '../hooks/useFloatingInteractions';
import { Flex } from '../components/Flex';
import { Grid } from '../components/Grid';
import { NavigationMenu } from '../components/NavigationMenu';
import { Skeleton } from '../components/Skeleton';
import { Table } from '../components/Table';

// Each of these was a plain function component, so `ref` never reached the host element and
// consumers had no way to call its imperative API or measure it.
const cases: Array<[string, (ref: React.Ref<any>) => React.ReactElement, string]> = [
  ['Alert', (ref) => <Alert ref={ref} />, 'ui-alert'],
  ['Badge', (ref) => <Badge ref={ref} text="new" />, 'ui-badge'],
  ['Container', (ref) => <Container ref={ref} />, 'ui-container'],
  ['ContextMenu', (ref) => <ContextMenu ref={ref} />, 'ui-context-menu'],
  ['DataTable', (ref) => <DataTable ref={ref} />, 'ui-data-table'],
  ['EmptyState', (ref) => <EmptyState ref={ref} />, 'ui-empty-state'],
  ['Field', (ref) => <Field ref={ref} />, 'ui-field'],
  ['Flex', (ref) => <Flex ref={ref} />, 'ui-flex'],
  ['Grid', (ref) => <Grid ref={ref} />, 'ui-grid'],
  ['NavigationMenu', (ref) => <NavigationMenu ref={ref} />, 'ui-navigation-menu'],
  ['Skeleton', (ref) => <Skeleton ref={ref} />, 'ui-skeleton'],
  ['Table', (ref) => <Table ref={ref} />, 'ui-table'],
];

describe('ref forwarding', () => {
  it.each(cases)('%s forwards ref to its host element', (_name, element, tag) => {
    const ref = React.createRef<HTMLElement>();
    const { container } = render(element(ref));

    expect(ref.current).toBe(container.querySelector(tag));
  });

  it.each(cases)('%s supports callback refs and clears them on unmount', (_name, element, tag) => {
    const seen: Array<HTMLElement | null> = [];
    const { container, unmount } = render(element((node: HTMLElement | null) => seen.push(node)));

    expect(seen[0]).toBe(container.querySelector(tag));
    unmount();
    expect(seen[seen.length - 1]).toBeNull();
  });

  it('FloatingOverlay forwards ref to its div', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<FloatingOverlay ref={ref} />);

    expect(ref.current).toBe(container.firstElementChild);
  });

  it('NavigationMenu sub-parts forward refs too', () => {
    const trigger = React.createRef<HTMLButtonElement>();
    const link = React.createRef<HTMLAnchorElement>();
    const content = React.createRef<HTMLElement>();

    render(
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger ref={trigger}>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content ref={content}>Panel</NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link ref={link} href="#docs">Docs</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    );

    expect(trigger.current?.tagName).toBe('BUTTON');
    expect(link.current?.tagName).toBe('A');
    expect(content.current?.tagName).toBe('SECTION');
  });
});
