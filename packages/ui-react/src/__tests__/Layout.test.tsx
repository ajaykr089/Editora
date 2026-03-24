import React from 'react';
import { render } from '@testing-library/react';
import '@editora/ui-core';
import { Box, Flex, Grid, MasonryGrid, Section, Container } from '../components';

async function flushRender() {
  await Promise.resolve();
  await Promise.resolve();
}

const MD_MEDIA = '@media (min-width: var(--ui-breakpoint-md, 768px))';
const SM_MEDIA = '@media (min-width: var(--ui-breakpoint-sm, 640px))';

describe('React layout wrappers', () => {
  it('Box renders ui-box and forwards attributes', async () => {
    const { container } = render(<Box p="12px">Hello</Box>);
    await flushRender();
    const el = container.querySelector('ui-box');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('p')).toBe('12px');
  });

  it('Box supports shorthand props (bg, color, w, h) and forwards to ui-box', async () => {
    const { container } = render(<Box bg="tomato" color="white" w="100%" h="48px">x</Box>);
    await flushRender();
    const el = container.querySelector('ui-box');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('bg')).toBe('tomato');
    expect(el?.getAttribute('color')).toBe('white');
    // ui-box should apply inline styles for single-value shorthand props
    expect(el?.style.background).toBe('tomato');
    expect(el?.style.color).toBe('white');
    expect(el?.style.width).toBe('100%');
    expect(el?.style.height).toBe('48px');
    expect(el?.style.alignItems).toBe('');
  });

  it('Box accepts explicit align prop and responsive align', async () => {
    const { container } = render(<Box align="flex-start">x</Box>);
    await flushRender();
    const el = container.querySelector('ui-box');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('align')).toBe('flex-start');
    expect(el?.style.alignItems).toBe('flex-start');

    const { container: c2 } = render(<Box align={{ initial: 'flex-start', md: 'center' }} />);
    await flushRender();
    const el2 = c2.querySelector('ui-box');
    expect(el2?.getAttribute('align')).toContain('\"initial\"');
    const style = el2?.shadowRoot?.querySelector('style');
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('align-items: flex-start;');
    expect(style?.textContent).toContain(MD_MEDIA);
  });

  it('Box accepts responsive props and serializes them to host attributes', async () => {
    const { container } = render(<Box p={{ initial: '4px', sm: '8px', md: '12px' }} />);
    await flushRender();
    const el = container.querySelector('ui-box');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('p')).toContain('\"initial\"');
    const style = el?.shadowRoot?.querySelector('style');
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain(SM_MEDIA);
  });

  it('Box accepts responsive shorthand props and injects component-scoped CSS', async () => {
    const { container } = render(<Box bg={{ initial: 'red', md: 'blue' }} />);
    await flushRender();
    const el = container.querySelector('ui-box');
    expect(el?.getAttribute('bg')).toContain('\"md\"');
    const style = el?.shadowRoot?.querySelector('style');
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('background:');
    expect(style?.textContent).toContain(MD_MEDIA);
  });

  it('Flex, Grid, and MasonryGrid accept responsive props and inject scoped CSS in each component', async () => {
    const { container } = render(
      <div>
        <Flex gap={{ initial: '4px', md: '24px' }} direction={{ initial: 'row', md: 'column' }} />
        <Grid columns={{ initial: '1fr', md: 'repeat(3, 1fr)' }} gap={{ initial: '8px', md: '16px' }} />
        <MasonryGrid columns={{ initial: '2', md: '4' }} gap={{ initial: '8px', md: '16px' }} />
      </div>
    );
    await flushRender();

    const flex = container.querySelector('ui-flex');
    expect(flex).toBeTruthy();
    expect(flex?.getAttribute('gap')).toContain('\"initial\"');
    const grid = container.querySelector('ui-grid');
    expect(grid).toBeTruthy();
    expect(grid?.getAttribute('columns')).toContain('\"md\"');
    const masonry = container.querySelector('ui-masonry-grid');
    expect(masonry).toBeTruthy();
    expect(masonry?.getAttribute('columns')).toContain('\"initial\"');

    const styleForFlex = flex?.shadowRoot?.querySelector('style');
    const styleForGrid = grid?.shadowRoot?.querySelector('style');
    const styleForMasonry = masonry?.shadowRoot?.querySelector('style');
    expect(styleForFlex).toBeTruthy();
    expect(styleForFlex?.textContent).toContain(MD_MEDIA);
    expect(styleForGrid).toBeTruthy();
    expect(styleForGrid?.textContent).toContain(MD_MEDIA);
    expect(styleForMasonry).toBeTruthy();
    expect(styleForMasonry?.textContent).toContain(MD_MEDIA);
  });

  it('Flex renders ui-flex', async () => {
    const { container } = render(<Flex direction="column">x</Flex>);
    await flushRender();
    expect(container.querySelector('ui-flex')).toBeTruthy();
  });

  it('Grid renders ui-grid', async () => {
    const { container } = render(<Grid columns="1fr 1fr">x</Grid>);
    await flushRender();
    expect(container.querySelector('ui-grid')).toBeTruthy();
  });

  it('MasonryGrid renders ui-masonry-grid and forwards masonry attributes', async () => {
    const { container } = render(
      <MasonryGrid columnWidth="240px" gap="sm" fill="auto">
        <article>Card</article>
      </MasonryGrid>
    );
    await flushRender();

    const el = container.querySelector('ui-masonry-grid');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('columnwidth')).toBe('240px');
    expect(el?.getAttribute('gap')).toBe('sm');
    expect(el?.getAttribute('fill')).toBe('auto');
    expect(el?.style.getPropertyValue('--ui-masonry-column-gap')).toContain('var(--ui-space-sm');
  });

  it('Section and Container render their hosts', async () => {
    const { container } = render(<Section size="small"><Container size="sm">c</Container></Section>);
    await flushRender();
    expect(container.querySelector('ui-section')).toBeTruthy();
    expect(container.querySelector('ui-container')).toBeTruthy();
  });
});
