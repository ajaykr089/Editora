import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/Wizard';
import '../../../ui-core/src/components/ui-wizard';

import { Wizard } from '../components/Wizard';

describe('Wizard Composed Component', () => {
  it('should render Wizard with Step sub-component', () => {
    const { container } = render(
      <Wizard value="step1">
        <Wizard.Step value="step1" title="Step 1" description="First step">
          <div>Step 1 content</div>
        </Wizard.Step>
        <Wizard.Step value="step2" title="Step 2" description="Second step">
          <div>Step 2 content</div>
        </Wizard.Step>
      </Wizard>
    );

    // Check that the wizard element exists
    const wizardElement = container.querySelector('ui-wizard');
    expect(wizardElement).toBeTruthy();
    expect(wizardElement?.getAttribute('value')).toBe('step1');

    // Check that step elements exist with correct attributes
    const stepElements = container.querySelectorAll('div[slot="step"]');
    expect(stepElements.length).toBe(2);
    
    expect(stepElements[0]?.getAttribute('data-value')).toBe('step1');
    expect(stepElements[0]?.getAttribute('data-title')).toBe('Step 1');
    expect(stepElements[0]?.getAttribute('data-description')).toBe('First step');
    
    expect(stepElements[1]?.getAttribute('data-value')).toBe('step2');
    expect(stepElements[1]?.getAttribute('data-title')).toBe('Step 2');
    expect(stepElements[1]?.getAttribute('data-description')).toBe('Second step');
  });

  it('should support optional step attribute', () => {
    const { container } = render(
      <Wizard>
        <Wizard.Step value="step1" title="Required Step">
          <div>Required content</div>
        </Wizard.Step>
        <Wizard.Step value="step2" title="Optional Step" optional>
          <div>Optional content</div>
        </Wizard.Step>
      </Wizard>
    );

    const stepElements = container.querySelectorAll('div[slot="step"]');
    expect(stepElements[0]?.hasAttribute('data-optional')).toBe(false);
    expect(stepElements[1]?.hasAttribute('data-optional')).toBe(true);
  });

  it('should support state attribute', () => {
    const { container } = render(
      <Wizard>
        <Wizard.Step value="step1" title="Success Step" state="success">
          <div>Success content</div>
        </Wizard.Step>
        <Wizard.Step value="step2" title="Error Step" state="error">
          <div>Error content</div>
        </Wizard.Step>
      </Wizard>
    );

    const stepElements = container.querySelectorAll('div[slot="step"]');
    expect(stepElements[0]?.getAttribute('data-state')).toBe('success');
    expect(stepElements[1]?.getAttribute('data-state')).toBe('error');
  });
});
