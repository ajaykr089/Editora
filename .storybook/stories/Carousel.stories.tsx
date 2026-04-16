import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Button, Carousel, Grid } from '@editora/ui-react';

const meta: Meta<typeof Carousel> = {
  title: 'UI/Carousel',
  component: Carousel,
  argTypes: {
    loop: { control: 'boolean' },
    autoPlay: { control: 'boolean' },
    interval: { control: 'number' },
    pauseOnHover: { control: 'boolean' },
    showControls: { control: 'boolean' },
    showIndicators: { control: 'boolean' },
    controlsVariant: { control: 'radio', options: ['button', 'arrow'] },
    controlsPosition: { control: 'radio', options: ['top', 'center', 'bottom'] },
    controlsAlign: { control: 'radio', options: ['space-between', 'center'] },
    controlsVisibility: { control: 'radio', options: ['always', 'hover', 'hidden'] },
    indicatorsVariant: { control: 'radio', options: ['dot', 'pill', 'line'] },
    direction: { control: 'radio', options: ['horizontal', 'vertical'] },
    transition: { control: 'radio', options: ['slide', 'fade', 'none'] },
    previousLabel: { control: 'text' },
    nextLabel: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function createDemoSlides() {
  return [
    (
      <Carousel.Item key="overview" label="Overview">
        <Grid style={{ display: 'grid', gap: 12, alignItems: 'start' }}>
          <Badge tone="info">Overview</Badge>
          <Box style={{ fontSize: 24, fontWeight: 700 }}>Frame the story in one high-signal slide</Box>
          <Box style={{ color: '#64748b' }}>Use a carousel when each panel has a distinct narrative job.</Box>
        </Grid>
      </Carousel.Item>
    ),
    (
      <Carousel.Item key="momentum" label="Momentum">
        <Grid style={{ display: 'grid', gap: 12, alignItems: 'start' }}>
          <Badge tone="success">Momentum</Badge>
          <Box style={{ fontSize: 24, fontWeight: 700 }}>Support the pitch with one sharp proof point</Box>
          <Box style={{ color: '#64748b' }}>Metrics, testimonials, or visual proof all work nicely here.</Box>
        </Grid>
      </Carousel.Item>
    ),
    (
      <Carousel.Item key="action" label="Action">
        <Grid style={{ display: 'grid', gap: 12, alignItems: 'start' }}>
          <Badge tone="warning">Action</Badge>
          <Box style={{ fontSize: 24, fontWeight: 700 }}>End with a decision-ready next step</Box>
          <Button recipe="outline" size="sm">Review launch checklist</Button>
        </Grid>
      </Carousel.Item>
    ),
  ];
}

export const Playground: Story = {
  args: {
    loop: true,
    autoPlay: false,
    interval: 5000,
    pauseOnHover: true,
    showControls: true,
    showIndicators: true,
    controlsVariant: 'button',
    controlsPosition: 'top',
    controlsAlign: 'space-between',
    controlsVisibility: 'always',
    indicatorsVariant: 'dot',
    direction: 'horizontal',
    transition: 'slide',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    label: 'Launch carousel',
  },
  render: (args) => (
    <Carousel {...args}>
      {createDemoSlides()}
    </Carousel>
  ),
};

export const StorytellingPanel = () => (
  <Carousel label="Release storytelling carousel">
    {createDemoSlides()}
  </Carousel>
);

export const ArrowOverlay = () => (
  <Carousel controlsPosition="center" controlsVariant="arrow" label="Arrow overlay carousel">
    {createDemoSlides()}
  </Carousel>
);

export const CenteredFooterControls = () => (
  <Carousel
    controlsAlign="center"
    controlsPosition="bottom"
    label="Centered footer controls carousel"
    nextLabel="Forward"
    previousLabel="Back"
  >
    {createDemoSlides()}
  </Carousel>
);

export const HoverRevealControls = () => (
  <Carousel
    controlsPosition="center"
    controlsVariant="arrow"
    controlsVisibility="hover"
    label="Hover reveal controls carousel"
  >
    {createDemoSlides()}
  </Carousel>
);

export const AutoPlayWithHoverPause = () => (
  <Carousel
    autoPlay
    controlsPosition="center"
    controlsVariant="arrow"
    controlsVisibility="hover"
    interval={2400}
    label="Autoplay carousel"
    pauseOnHover
  >
    {createDemoSlides()}
  </Carousel>
);

export const VerticalSlide = () => (
  <Carousel
    controlsPosition="center"
    controlsVariant="arrow"
    direction="vertical"
    indicatorsVariant="line"
    label="Vertical slide carousel"
    transition="slide"
  >
    {createDemoSlides()}
  </Carousel>
);

export const VerticalFade = () => (
  <Carousel
    controlsPosition="center"
    controlsVariant="arrow"
    direction="vertical"
    indicatorsVariant="line"
    label="Vertical fade carousel"
    transition="fade"
  >
    {createDemoSlides()}
  </Carousel>
);

export const LineIndicators = () => (
  <Carousel indicatorsVariant="line" label="Line indicators carousel">
    {createDemoSlides()}
  </Carousel>
);

export const IndicatorsOnly = () => (
  <Carousel label="Indicators only carousel" showControls={false}>
    {createDemoSlides()}
  </Carousel>
);
