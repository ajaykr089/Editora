'use client';

import React from 'react';
import {
  AnimatedNumber,
  Box,
  Button,
  Checkbox,
  ColorPicker,
  DirectionProvider,
  Flex,
  Grid,
  Meter,
  Progress,
  RadioGroup,
  Select,
  Slider,
  Stepper,
  Switch,
  Toggle,
} from '@editora/ui-react/client';
import { ShowcaseCard, ShowcaseShell, eyebrowStyle, hintStyle, stageStyle } from '../showcase/shared';

export default function SelectionPage() {
  const [metric, setMetric] = React.useState(1284);
  const [progressValue, setProgressValue] = React.useState(68);
  const [qualityScore, setQualityScore] = React.useState(74);
  const [checkboxValue, setCheckboxValue] = React.useState(true);
  const [switchValue, setSwitchValue] = React.useState(false);
  const [toggleValue, setToggleValue] = React.useState(true);
  const [accentColor, setAccentColor] = React.useState('#2563eb');
  const [plan, setPlan] = React.useState('pro');
  const [role, setRole] = React.useState('design');
  const [stepValue, setStepValue] = React.useState('qa');

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/selection"
        eyebrow="Selection"
        title="Choices, indicators, and workflow widgets"
        description="The control-heavy wrappers live here so they can be tested in a focused environment with enough space for state changes to feel obvious."
      >
        <Grid
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 18,
            justifyItems: 'stretch',
            alignItems: 'start',
          }}
        >
          <ShowcaseCard
            eyebrow="Indicators"
            title="Animated numbers and status meters"
            description="These components react to the same local state so it is easy to confirm they all stay in sync."
          >
            <Grid
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                justifyItems: 'stretch',
                alignItems: 'start',
              }}
            >
              <Box style={stageStyle}>
                <Box style={eyebrowStyle}>AnimatedNumber</Box>
                <AnimatedNumber value={metric} variant="inline" animate animateOnMount />
              </Box>
              <Box style={stageStyle}>
                <Box style={eyebrowStyle}>Progress</Box>
                <Progress value={progressValue} max={100} showLabel animated striped label="Completion" />
              </Box>
              <Box style={stageStyle}>
                <Box style={eyebrowStyle}>Meter</Box>
                <Meter value={qualityScore} min={0} max={100} low={30} high={70} optimum={90} showLabel label="Quality" />
              </Box>
            </Grid>

            <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button onClick={() => setMetric((current) => current + 125)}>Increase metric</Button>
              <Button recipe="outline" onClick={() => setProgressValue((current) => Math.min(100, current + 5))}>
                Boost progress
              </Button>
            </Flex>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Choices"
            title="Checkbox, switch, toggle, radio, and select"
            description="The most common selection wrappers grouped into one route with shared state."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Flex style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <Checkbox checked={checkboxValue} onCheckedChange={setCheckboxValue}>
                  Email digest
                </Checkbox>
                <Switch
                  checked={switchValue}
                  label="Automation"
                  description="Enable nightly sync"
                  onChange={(detail) => setSwitchValue(detail.checked)}
                />
                <Toggle
                  pressed={toggleValue}
                  onChange={(detail) => setToggleValue(detail.pressed)}
                  iconOn="check"
                  iconOff="x"
                >
                  Pin widget
                </Toggle>
              </Flex>

              <RadioGroup
                value={role}
                onValueChange={(detail) => setRole(detail.value)}
                options={[
                  { value: 'design', label: 'Design lead' },
                  { value: 'engineering', label: 'Engineering' },
                  { value: 'ops', label: 'Operations' },
                ]}
              />

              <Select value={plan} onValueChange={setPlan} label="Plan" description="Native options through the wrapper.">
                <Select.Option value="starter">Starter</Select.Option>
                <Select.Option value="pro">Pro</Select.Option>
                <Select.Option value="enterprise">Enterprise</Select.Option>
              </Select>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Controls"
            title="Slider, color picker, and stepper"
            description="The larger control wrappers get a dedicated stage so their boundaries and overlays are easy to inspect."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Slider
                value={progressValue}
                min={0}
                max={100}
                showValue
                label="Progress slider"
                onValueChange={(detail) => {
                  const rounded = Math.round(detail.value);
                  setProgressValue(rounded);
                  setQualityScore(Math.max(0, Math.min(100, rounded + 6)));
                }}
              />

              <ColorPicker
                value={accentColor}
                presets={['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed']}
                recent
                onValueChange={setAccentColor}
              />

              <Box style={stageStyle}>
                <Box style={eyebrowStyle}>Stepper</Box>
                <Stepper
                  value={stepValue}
                  clickable
                  orientation="vertical"
                  onChange={(detail) => setStepValue(detail.value)}
                  steps={[
                    { value: 'brief', label: 'Brief', description: 'Scope aligned', state: 'complete' },
                    { value: 'design', label: 'Design', description: 'Visual review', state: 'complete' },
                    { value: 'qa', label: 'QA', description: 'Responsive checks', state: 'warning' },
                    { value: 'launch', label: 'Launch', description: 'Stakeholder handoff' },
                  ]}
                />
              </Box>

              <Box style={{ ...hintStyle, color: accentColor }}>
                Current accent color: <strong>{accentColor}</strong>
              </Box>
            </Grid>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
