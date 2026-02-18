import React from 'react';

export function Icon(props: { name: string; className?: string }) {
  const { name, className } = props;
  return React.createElement('ui-icon', { name, class: className });
}

export default Icon;
