import React from 'react';
import { Icon } from '@editora/ui-react';

export default {
  title: 'UI/Icon',
  component: Icon
};

export const All = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Icon name="check" />
    <Icon name="x" />
    <span style={{ fontSize: 16 }}>Icons render as inline SVGs and inherit color.</span>
  </div>
);
