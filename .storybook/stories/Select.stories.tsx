import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createThemeTokens, type AccentPaletteName, type ThemeTokens } from '@editora/ui-core';
import { Badge, Box, Button, Card, Flex, Grid, Select, ThemeProvider } from '@editora/ui-react';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  args: {
    value: 'review',
    disabled: false,
    loading: false,
    required: false,
    invalid: false,
    placeholder: 'Choose a status',
    size: 'md',
    variant: 'soft',
    tone: 'default',
    density: 'default',
    shape: 'rounded',
    elevation: 'low',
    radius: "4px",
    optionBorder: false,
    validation: 'none',
  },
  argTypes: {
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    placeholder: { control: 'text' },
    variant: {
      control: 'select',
      options: ['classic', 'surface', 'soft', 'filled', 'outline', 'line', 'minimal', 'ghost', 'solid', 'glass', 'contrast'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['rounded', 'square', 'pill'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    validation: { control: 'select', options: ['none', 'success', 'warning', 'error'] },
    radius: { control: 'text' },
    optionBorder: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;
type StoryPaletteName = AccentPaletteName | 'purple';

const workflowOptions = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In review" },
  { value: "approved", label: "Approved" },
  { value: "published1", label: "Published1" },
  { value: "published2", label: "Published2" },
  { value: "published3", label: "Published3" },
  { value: "published4", label: "Published4" },
  { value: "published5", label: "Published5" },
  { value: "published6", label: "Published6" },
  { value: "published7", label: "Published7" },
  { value: "published8", label: "Published8" },
  { value: "published9", label: "Published9" },
  { value: "published10", label: "Published10" },
  { value: "published11", label: "Published11" },
  { value: "published12", label: "Published12" },
  { value: "published13", label: "Published13" },
  { value: "published14", label: "Published14" },
  { value: "published15", label: "Published15" },
  { value: "published16", label: "Published16" },
  { value: "published17", label: "Published17" },
  { value: "published18", label: "Published18" },
  { value: "published19", label: "Published19" },
  { value: "published20", label: "Published20" },
  { value: "published21", label: "Published21" },
  { value: "published22", label: "Published22" },
  { value: "published23", label: "Published23" },
  { value: "published24", label: "Published24" },
  { value: "published25", label: "Published25" },
] as const;

function TabButton(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      style={{
        appearance: 'none',
        border: 'none',
        borderBottom: props.active ? '3px solid var(--ui-color-primary, #2563eb)' : '3px solid transparent',
        background: 'transparent',
        color: props.active ? 'var(--ui-color-text, #0f172a)' : 'var(--ui-color-muted, #64748b)',
        padding: '14px 4px 12px',
        font: '600 15px/1.4 inherit',
        cursor: 'pointer',
      }}
    >
      {props.children}
    </button>
  );
}

function paletteTokens(name: StoryPaletteName) {
  if (name === 'purple') {
    return createThemeTokens(
      {
        colors: {
          primary: '#8b5cf6',
          primaryHover: '#7c3aed',
          focusRing: '#8b5cf6',
        },
        palette: {
          accent: {
            '1': '#fdfcff',
            '2': '#faf7ff',
            '3': '#f3ecff',
            '4': '#eadcff',
            '5': '#ddc7ff',
            '6': '#cdb0ff',
            '7': '#b693ff',
            '8': '#9b70ff',
            '9': '#8b5cf6',
            '10': '#7c3aed',
            '11': '#6d28d9',
            '12': '#2e1065',
          },
          accentAlpha: {
            '1': '#7c3aed03',
            '2': '#7c3aed08',
            '3': '#7c3aed14',
            '4': '#7c3aed24',
            '5': '#7c3aed38',
            '6': '#7c3aed4d',
            '7': '#7c3aed68',
            '8': '#7c3aed8f',
            '9': '#7c3aed',
            '10': '#6d28d9',
            '11': '#5b21b6',
            '12': '#2e1065',
          },
          accentContrast: '#ffffff',
          accentSurface: '#f5f0ffcc',
          accentIndicator: '#8b5cf6',
          accentTrack: '#8b5cf6',
        },
      } satisfies Partial<ThemeTokens>,
      { accentPalette: 'blue', mode: 'light' }
    );
  }

  return createThemeTokens({}, { accentPalette: name, mode: 'light' });
}

function SelectPreview(props: {
  variant: 'surface' | 'soft' | 'solid' | 'outline' | 'contrast';
  size: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  palette?: StoryPaletteName;
  elevation?: 'none' | 'low' | 'high';
  radius?: number | string;
  validation?: 'none' | 'success' | 'warning' | 'error';
  optionBorder?: boolean;
  label?: string;
  caption?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = React.useState(props.defaultValue ?? 'review');

  const content = (
    <Grid style={{ gap: 12 }}>
      <Box
        style={{
          minHeight: 148,
          borderRadius: 16,
          border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
          display: 'grid',
          placeItems: 'center',
          padding: 20,
        }}
      >
        <Box style={{ width: 'min(280px, 100%)' }}>
          <Select
            label={props.label || 'Workflow status'}
            description="Open the menu to inspect option rendering."
            placeholder={props.placeholder || 'Choose a status'}
            value={value}
            onChange={setValue}
            variant={props.variant}
            size={props.size}
            elevation={props.elevation}
            radius={props.radius}
            validation={props.validation && props.validation !== 'none' ? props.validation : undefined}
            optionBorder={props.optionBorder}
          >
            {props.placeholder ? <Select.Option value="">{props.placeholder}</Select.Option> : null}
            {workflowOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Box>
      </Box>
      {props.caption ? <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>{props.caption}</div> : null}
    </Grid>
  );

  if (!props.palette) return content;
  return <ThemeProvider tokens={paletteTokens(props.palette)}>{content}</ThemeProvider>;
}

function ThemeTokenMatrixStory() {
  const [tab, setTab] = React.useState<'theme' | 'colors' | 'sizes'>('theme');

  return (
    <Grid style={{ gap: 20, maxInlineSize: 1280 }}>
      <div>
        <div style={{ fontSize: 44, lineHeight: 1.05, fontWeight: 700, color: '#111827' }}>Select</div>
      </div>

      <Flex style={{ gap: 28, borderBottom: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)' }}>
        <TabButton active={tab === 'theme'} onClick={() => setTab('theme')}>
          Theme colors
        </TabButton>
        <TabButton active={tab === 'colors'} onClick={() => setTab('colors')}>
          All colors
        </TabButton>
        <TabButton active={tab === 'sizes'} onClick={() => setTab('sizes')}>
          All sizes
        </TabButton>
      </Flex>

      {tab === 'theme' ? (
        <Grid style={{ gap: 22 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(4, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div style={{ fontSize: 18, color: '#5b6574' }}>Surface</div>
            <SelectPreview variant="surface" size="md" elevation="low" palette="blue" />
            <SelectPreview variant="surface" size="md" elevation="low" palette="gray" />
            <SelectPreview variant="surface" size="md" elevation="low" palette="purple" />
            <SelectPreview variant="surface" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Soft</div>
            <SelectPreview variant="soft" size="md" elevation="low" palette="blue" />
            <SelectPreview variant="soft" size="md" elevation="low" palette="gray" />
            <SelectPreview variant="soft" size="md" elevation="low" palette="purple" />
            <SelectPreview variant="soft" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Solid</div>
            <SelectPreview variant="solid" size="md" elevation="low" palette="blue" />
            <SelectPreview variant="solid" size="md" elevation="low" palette="gray" />
            <SelectPreview variant="solid" size="md" elevation="low" palette="purple" />
            <SelectPreview variant="solid" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Contrast</div>
            <SelectPreview variant="contrast" size="md" elevation="low" palette="blue" />
            <SelectPreview variant="contrast" size="md" elevation="low" palette="gray" />
            <SelectPreview variant="contrast" size="md" elevation="low" palette="purple" />
            <SelectPreview variant="contrast" size="md" elevation="low" palette="green" />
          </Grid>
        </Grid>
      ) : null}

      {tab === 'colors' ? (
        <Grid style={{ gap: 16 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(3, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Surface</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            {(['gray', 'amber', 'red', 'purple', 'blue', 'green'] as const satisfies readonly StoryPaletteName[]).map((name) => (
              <React.Fragment key={name}>
                <div style={{ fontSize: 18, color: '#5b6574', textTransform: 'capitalize' }}>{name}</div>
                <SelectPreview variant="surface" size="md" elevation="low" palette={name} />
                <SelectPreview variant="soft" size="md" elevation="low" palette={name} />
                <SelectPreview variant="solid" size="md" elevation="low" palette={name} />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}

      {tab === 'sizes' ? (
        <Grid style={{ gap: 18 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(3, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Surface</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            {(['1', '2', '3'] as const).map((size) => (
              <React.Fragment key={size}>
                <div style={{ fontSize: 18, color: '#5b6574' }}>Size {size}</div>
                <SelectPreview variant="surface" size={size} elevation="low" palette="blue" />
                <SelectPreview variant="soft" size={size} elevation="low" palette="blue" />
                <SelectPreview variant="solid" size={size} elevation="low" palette="blue" />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}

export const ThemeTokenMatrix: Story = {
  render: () => <ThemeTokenMatrixStory />,
};

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = React.useState(args.value || 'review');

    React.useEffect(() => {
      setValue(args.value || '');
    }, [args.value]);

    return (
      <Grid style={{ gap: 16, maxInlineSize: 1040 }}>
        <Card radius={18}>
          <Card.Header>
            <Card.Title>Production select surface</Card.Title>
            <Card.Description>
              Controlled wrapper around `ui-select` with theme-backed variants, sizing, validation, and option-surface styling.
            </Card.Description>
          </Card.Header>
          <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 16 }}>
            <Box
              style={{
                minHeight: 220,
                borderRadius: 18,
                border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
                background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
                display: 'grid',
                placeItems: 'center',
                padding: 24,
              }}
            >
              <Box style={{ width: 'min(320px, 100%)' }}>
                <Select
                  {...args}
                  label="Workflow status"
                  description="Used by reviewers and publish automations."
                  value={value}
                  onChange={setValue}
                  validation={args.validation && args.validation !== 'none' ? args.validation : undefined}
                  radius={"4px"}
                >
                  {args.placeholder ? <Select.Option value="">{args.placeholder}</Select.Option> : null}
                  {workflowOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Box>
            </Box>

            <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
              <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Button variant="secondary" onClick={() => setValue('draft')}>
                  Reset to draft
                </Button>
                <Badge tone="info">value: {value || 'placeholder'}</Badge>
              </Flex>
              <Badge tone="neutral">variant: {String(args.variant || 'classic')}</Badge>
            </Flex>
          </Box>
        </Card>
      </Grid>
    );
  },
};

export const CompositionSlots: Story = {
  render: () => {
    const [value, setValue] = React.useState('review');

    return (
      <Grid style={{ gap: 20, maxInlineSize: 480 }}>
        {/* Option + OptGroup */}
        <Box style={{ display: 'grid', gap: 6 }}>
          <Box style={{ fontSize: 12, color: '#94a3b8' }}>Option + OptGroup</Box>
          <Select label="Workflow status" value={value} onChange={setValue} variant="surface">
            <Select.Option value="">Choose a status</Select.Option>
            <Select.OptGroup label="Active">
              <Select.Option value="draft">Draft</Select.Option>
              <Select.Option value="review">In review</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Final">
              <Select.Option value="approved">Approved</Select.Option>
              <Select.Option value="published">Published</Select.Option>
            </Select.OptGroup>
          </Select>
        </Box>

        {/* Label + Description slots */}
        <Box style={{ display: 'grid', gap: 6 }}>
          <Box style={{ fontSize: 12, color: '#94a3b8' }}>Label + Description slots</Box>
          <Select value={value} onChange={setValue} variant="soft">
            <Select.Label>
              Workflow status <span style={{ color: '#dc2626' }}>*</span>
            </Select.Label>
            <Select.Description>Controls publish automation triggers.</Select.Description>
            <Select.Option value="draft">Draft</Select.Option>
            <Select.Option value="review">In review</Select.Option>
            <Select.Option value="approved">Approved</Select.Option>
          </Select>
        </Box>

        {/* Leading + Trailing slots */}
        <Box style={{ display: 'grid', gap: 6 }}>
          <Box style={{ fontSize: 12, color: '#94a3b8' }}>Leading + Trailing slots</Box>
          <Select label="Assignee" value={value} onChange={setValue} variant="outline">
            <Select.Leading>👤</Select.Leading>
            <Select.Trailing>▾</Select.Trailing>
            <Select.Option value="draft">Alice</Select.Option>
            <Select.Option value="review">Bob</Select.Option>
            <Select.Option value="approved">Carol</Select.Option>
          </Select>
        </Box>

        {/* Error slot */}
        <Box style={{ display: 'grid', gap: 6 }}>
          <Box style={{ fontSize: 12, color: '#94a3b8' }}>Error slot</Box>
          <Select label="Status" value="" onChange={setValue} variant="surface" validation="error" required>
            <Select.Option value="">Choose a status</Select.Option>
            <Select.Option value="draft">Draft</Select.Option>
            <Select.Option value="review">In review</Select.Option>
            <Select.Error>Please select a status to continue.</Select.Error>
          </Select>
        </Box>
      </Grid>
    );
  },
};

export const WithLeadingIcon: Story = {
  render: () => {
    const [value, setValue] = React.useState('usd');

    return (
      <Box style={{ maxInlineSize: 320 }}>
        <Select label="Currency" value={value} onChange={setValue} variant="surface" showCheck>
          <Select.Leading>💱</Select.Leading>
          <Select.Option value="usd">USD — US Dollar</Select.Option>
          <Select.Option value="eur">EUR — Euro</Select.Option>
          <Select.Option value="gbp">GBP — British Pound</Select.Option>
          <Select.Option value="jpy">JPY — Japanese Yen</Select.Option>
        </Select>
      </Box>
    );
  },
};
