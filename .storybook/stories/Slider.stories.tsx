import React from 'react';
import { Slider , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Slider',
  component: Slider,
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    min: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1, max: 200, step: 1 } },
    step: { control: { type: 'number', min: 1, max: 25, step: 1 } },
    disabled: { control: 'boolean' }
  }
};

export const Controlled = (args: any) => {
  const [value, setValue] = React.useState(Number(args.value) || 30);
  const min = Number(args.min ?? 0);
  const max = Number(args.max ?? 100);

  React.useEffect(() => {
    setValue((current) => Math.max(min, Math.min(max, current)));
  }, [min, max]);

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <Slider
        {...args}
        value={value}
        min={min}
        max={max}
        onInput={setValue}
      />
      <Box style={{ fontSize: 13, color: '#475569' }}>
        Value: {value} ({min}-{max})
      </Box>
    </Grid>
  );
};

Controlled.args = {
  value: 30,
  min: 0,
  max: 100,
  step: 1,
  disabled: false
};

export const Disabled = () => <Slider value={40} min={0} max={100} disabled />;
