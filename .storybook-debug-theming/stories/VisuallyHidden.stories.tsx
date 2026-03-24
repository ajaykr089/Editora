import React from 'react';
import { VisuallyHidden } from '@editora/ui-react';

export default {
  title: 'UI/VisuallyHidden',
  component: VisuallyHidden
};

export const AccessibilityLabel = () => (
  <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff' }}>
    <span aria-hidden>🔍</span>
    <VisuallyHidden>Search documents</VisuallyHidden>
  </button>
);
