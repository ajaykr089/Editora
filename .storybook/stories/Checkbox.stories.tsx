import React from 'react';
import { Checkbox , Box, Flex} from '@editora/ui-react';

export default {
  title: 'UI/Checkbox',
  component: Checkbox,
};


export const Default = () => <Checkbox />;

export const Checked = () => <Checkbox checked>Checked</Checkbox>;

export const Disabled = () => <Checkbox disabled>Disabled</Checkbox>;

export const Indeterminate = () => <Checkbox indeterminate>Indeterminate</Checkbox>;

export const WithLabel = () => <Checkbox>Accept terms and conditions</Checkbox>;

export const Controlled = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <Checkbox checked={checked} onClick={() => setChecked(v => !v)}>
      Controlled ({checked ? 'On' : 'Off'})
    </Checkbox>
  );
};

export const CustomSize = () => (
  <Checkbox style={{ '--ui-checkbox-size': '32px' }}>Large Checkbox</Checkbox>
);

export const CustomColor = () => (
  <Checkbox style={{ '--ui-checkbox-checked-background': '#22c55e', '--ui-checkbox-border': '2px solid #22c55e' }} checked>
    Success
  </Checkbox>
);

export const ErrorState = () => (
  <Checkbox style={{ '--ui-checkbox-checked-background': '#ef4444', '--ui-checkbox-border': '2px solid #ef4444' }} checked>
    Error
  </Checkbox>
);

export const Headless = () => (
  <Checkbox headless>Headless (unstyled)</Checkbox>
);

export const CheckboxGroup = () => {
  const [values, setValues] = React.useState([false, true, false]);
  return (
    <Flex style={{ display: 'flex', gap: 16 }}>
      {['One', 'Two', 'Three'].map((label, i) => (
        <Checkbox
          key={label}
          checked={values[i]}
          onClick={() => setValues(v => v.map((val, idx) => idx === i ? !val : val))}
        >
          {label}
        </Checkbox>
      ))}
    </Flex>
  );
};
