import React from 'react';

export function BlockControls(props: any) {
  const { children, ...rest } = props;
  return React.createElement('ui-block-controls', { ...rest }, children);
}

export default BlockControls;
