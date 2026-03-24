import React from 'react';
import { Checkbox, Box, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Checkbox',
  component: Checkbox,
};

const shellStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  padding: 14,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
};

export const Default = () => (
  <Box style={shellStyle}>
    <Checkbox>Enable smart formatting</Checkbox>
  </Box>
);

export const Checked = () => (
  <Box style={shellStyle}>
    <Checkbox checked>Checked</Checkbox>
  </Box>
);

export const Disabled = () => (
  <Box style={shellStyle}>
    <Checkbox disabled>Disabled</Checkbox>
  </Box>
);

export const Indeterminate = () => (
  <Box style={shellStyle}>
    <Checkbox indeterminate>Indeterminate</Checkbox>
  </Box>
);

export const WithLabel = () => (
  <Box style={shellStyle}>
    <Checkbox>Accept terms and conditions</Checkbox>
  </Box>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <Box style={shellStyle}>
      <Flex style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Checkbox checked={checked} onCheckedChange={(next) => setChecked(next)}>
          Controlled ({checked ? 'On' : 'Off'})
        </Checkbox>
        <Box style={{ fontSize: 12, color: '#64748b' }}>Value: {String(checked)}</Box>
      </Flex>
    </Box>
  );
};

export const CustomSize = () => (
  <Box style={shellStyle}>
    <Checkbox style={{ '--ui-checkbox-size': '32px' } as React.CSSProperties}>Large Checkbox</Checkbox>
  </Box>
);

export const CustomColor = () => (
  <Box style={shellStyle}>
    <Checkbox style={{ '--ui-checkbox-checked-background': '#22c55e', '--ui-checkbox-border': '2px solid #22c55e' } as React.CSSProperties} checked>
      Success
    </Checkbox>
  </Box>
);

export const ErrorState = () => (
  <Box style={shellStyle}>
    <Checkbox style={{ '--ui-checkbox-checked-background': '#ef4444', '--ui-checkbox-border': '2px solid #ef4444' } as React.CSSProperties} checked>
      Error
    </Checkbox>
  </Box>
);

export const Invalid = () => (
  <Box style={shellStyle}>
    <Checkbox invalid>Validation error state</Checkbox>
  </Box>
);

export const AdminCompactPreset = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Checkbox preset="admin" density="compact" checked>
        Compact active
      </Checkbox>
      <Checkbox preset="admin" density="compact">
        Compact default
      </Checkbox>
      <Checkbox preset="admin" density="compact" indeterminate>
        Compact mixed
      </Checkbox>
      <Checkbox preset="admin" density="compact" disabled>
        Compact disabled
      </Checkbox>
    </Flex>
  </Box>
);

export const Headless = () => (
  <Box style={shellStyle}>
    <Checkbox headless style={{ padding: '6px 10px', border: '1px dashed #94a3b8', borderRadius: 10 }}>
      Headless (unstyled)
    </Checkbox>
  </Box>
);

export const CheckboxGroup = () => {
  const [values, setValues] = React.useState([false, true, false]);
  return (
    <Box style={shellStyle}>
      <Flex style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {['One', 'Two', 'Three'].map((label, i) => (
          <Checkbox
            key={label}
            checked={values[i]}
            onCheckedChange={(next) => setValues((prev) => prev.map((val, idx) => (idx === i ? next : val)))}
          >
            {label}
          </Checkbox>
        ))}
      </Flex>
    </Box>
  );
};

export const DensityScale = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Checkbox density="compact">Compact density</Checkbox>
      <Checkbox>Default density</Checkbox>
      <Checkbox density="comfortable">Comfortable density</Checkbox>
    </Flex>
  </Box>
);

export const Loading = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Checkbox loading>Loading</Checkbox>
      <Checkbox loading checked>
        Loading checked
      </Checkbox>
      <Checkbox loading indeterminate>
        Loading mixed
      </Checkbox>
    </Flex>
  </Box>
);
