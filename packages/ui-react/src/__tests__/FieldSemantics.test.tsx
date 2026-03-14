import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/FieldSemantics';
import '../../../ui-core/src/components/ui-description';
import '../../../ui-core/src/components/ui-field-error';
import '../../../ui-core/src/components/ui-control-group';
import '../../../ui-core/src/components/ui-fieldset';

import { ControlGroup, Description, FieldError, Fieldset } from '../components/FieldSemantics';

describe('field semantics wrappers', () => {
  it('wires description and error associations through React props', async () => {
    const { container } = render(
      <div>
        <input id="billing-email" />
        <Description htmlFor="billing-email">Used for invoice delivery.</Description>
        <FieldError htmlFor="billing-email" active>
          Billing email is required.
        </FieldError>
      </div>
    );

    const input = container.querySelector('#billing-email') as HTMLInputElement | null;
    await waitFor(() => {
      expect(input?.getAttribute('aria-describedby')).toContain('ui-description');
      expect(input?.getAttribute('aria-errormessage')).toContain('ui-field-error');
    });
  });

  it('applies fieldset and control-group attributes from React props', async () => {
    const { container } = render(
      <Fieldset legend="Publishing options" description="Configure output defaults." variant="surface" invalid>
        <ControlGroup label="Outputs" orientation="horizontal">
          <button type="button">Web</button>
          <button type="button">PDF</button>
        </ControlGroup>
      </Fieldset>
    );

    const fieldset = container.querySelector('ui-fieldset') as HTMLElement | null;
    const group = container.querySelector('ui-control-group') as HTMLElement | null;

    await waitFor(() => {
      expect(fieldset?.getAttribute('legend')).toBe('Publishing options');
      expect(fieldset?.hasAttribute('invalid')).toBe(true);
      expect(group?.getAttribute('orientation')).toBe('horizontal');
    });
  });
});
