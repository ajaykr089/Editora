---
title: Stepper
description: Stepper component for displaying progress through a sequence of steps with customizable orientation, variants, and interactive features.
sidebar_label: Stepper
---

# Stepper

The `Stepper` component displays progress through a sequence of logical and numbered steps. It provides visual feedback about which steps have been completed, are currently active, or are pending. Steppers support both horizontal and vertical orientations with various styling options.

## Basic Usage

```tsx
import { Stepper } from '@editora/ui-react';

function BasicStepper() {
  const steps = [
    { label: 'Select campaign settings', description: 'Choose your campaign parameters' },
    { label: 'Create an ad group', description: 'Define your target audience' },
    { label: 'Create an ad', description: 'Design your advertisement' }
  ];

  return (
    <Stepper steps={steps} value="step-1" />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepperStep[]` | `[]` | Array of step objects with label, description, and state |
| `value` | `string` | - | Currently active step value |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout orientation |
| `variant` | `'default' \| 'contrast' \| 'minimal'` | `'default'` | Visual variant style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `clickable` | `boolean` | `false` | Enable step clicking for navigation |
| `linear` | `boolean` | `false` | Require sequential step completion |
| `headless` | `boolean` | `false` | Render without default styling |
| `onChange` | `(detail: StepperChangeDetail) => void` | - | Step change event handler |
| `onSelect` | `(detail: StepperChangeDetail) => void` | - | Step select event handler |
| `className` | `string` | - | Custom CSS class |
| `style` | `React.CSSProperties` | - | Inline styles |
| `children` | `React.ReactNode` | - | Custom content for steps |

## Step Configuration

### Step Object Structure
Each step in the `steps` array can have the following properties:

```tsx
interface StepperStep {
  value?: string;           // Unique identifier for the step
  label?: string;           // Step title/label
  description?: string;     // Optional step description
  optional?: boolean;       // Mark step as optional
  disabled?: boolean;       // Disable step interaction
  state?: 'default' | 'complete' | 'error' | 'warning'; // Step state
}
```

### Basic Step Configuration
Simple step configuration with labels and descriptions.

```tsx
const steps = [
  {
    value: 'step-1',
    label: 'Account Setup',
    description: 'Create your account and verify email'
  },
  {
    value: 'step-2',
    label: 'Profile Setup',
    description: 'Add personal information and preferences'
  },
  {
    value: 'step-3',
    label: 'Payment Setup',
    description: 'Configure payment methods and billing'
  }
];

function SimpleStepper() {
  return <Stepper steps={steps} value="step-2" />;
}
```

### Step States
Control step completion and error states.

```tsx
const steps = [
  {
    value: 'step-1',
    label: 'Completed',
    state: 'complete'
  },
  {
    value: 'step-2',
    label: 'In Progress',
    state: 'default'
  },
  {
    value: 'step-3',
    label: 'Pending',
    state: 'default'
  },
  {
    value: 'step-4',
    label: 'Error',
    state: 'error'
  }
];

function StepperWithStates() {
  return <Stepper steps={steps} value="step-2" />;
}
```

### Optional Steps
Mark steps as optional with visual indicators.

```tsx
const steps = [
  {
    value: 'step-1',
    label: 'Required Step',
    description: 'This step must be completed'
  },
  {
    value: 'step-2',
    label: 'Optional Step',
    description: 'This step is optional',
    optional: true
  },
  {
    value: 'step-3',
    label: 'Another Required Step',
    description: 'This step must be completed'
  }
];

function StepperWithOptional() {
  return <Stepper steps={steps} value="step-1" />;
}
```

## Orientation

### Horizontal Stepper
Default horizontal layout for most use cases.

```tsx
function HorizontalStepper() {
  const steps = [
    { label: 'Step 1', description: 'First step' },
    { label: 'Step 2', description: 'Second step' },
    { label: 'Step 3', description: 'Third step' }
  ];

  return (
    <Stepper
      steps={steps}
      value="step-2"
      orientation="horizontal"
    />
  );
}
```

### Vertical Stepper
Vertical layout for longer descriptions or mobile layouts.

```tsx
function VerticalStepper() {
  const steps = [
    {
      label: 'Account Setup',
      description: 'Create your account and verify your email address to get started.'
    },
    {
      label: 'Profile Configuration',
      description: 'Set up your profile with personal information and preferences.'
    },
    {
      label: 'Security Setup',
      description: 'Configure two-factor authentication and security settings.'
    }
  ];

  return (
    <Stepper
      steps={steps}
      value="step-1"
      orientation="vertical"
    />
  );
}
```

## Variants

### Default Variant
Standard stepper with full visual indicators.

```tsx
<Stepper
  steps={steps}
  value="step-2"
  variant="default"
/>
```

### Contrast Variant
High contrast styling for better visibility.

```tsx
<Stepper
  steps={steps}
  value="step-2"
  variant="contrast"
/>
```

### Minimal Variant
Subtle styling with minimal visual elements.

```tsx
<Stepper
  steps={steps}
  value="step-2"
  variant="minimal"
/>
```

## Sizes

### Small Stepper
Compact size for space-constrained layouts.

```tsx
<Stepper
  steps={steps}
  value="step-2"
  size="sm"
/>
```

### Medium Stepper
Default medium size for most applications.

```tsx
<Stepper
  steps={steps}
  value="step-2"
  size="md"
/>
```

### Large Stepper
Large size for emphasis and better touch targets.

```tsx
<Stepper
  steps={steps}
  value="step-2"
  size="lg"
/>
```

## Interactive Features

### Clickable Steps
Enable step clicking for navigation.

```tsx
function ClickableStepper() {
  const [currentStep, setCurrentStep] = useState('step-1');

  const handleStepChange = (detail: StepperChangeDetail) => {
    setCurrentStep(detail.value);
  };

  return (
    <Stepper
      steps={steps}
      value={currentStep}
      clickable={true}
      onChange={handleStepChange}
    />
  );
}
```

### Linear Stepper
Require sequential step completion.

```tsx
function LinearStepper() {
  const [currentStep, setCurrentStep] = useState('step-1');

  const handleStepChange = (detail: StepperChangeDetail) => {
    // Only allow moving to next step if current step is complete
    if (detail.index > 0) {
      setCurrentStep(detail.value);
    }
  };

  return (
    <Stepper
      steps={steps}
      value={currentStep}
      clickable={true}
      linear={true}
      onChange={handleStepChange}
    />
  );
}
```

### Headless Stepper
Custom styling without default appearance.

```tsx
function HeadlessStepper() {
  return (
    <Stepper
      steps={steps}
      value="step-2"
      headless={true}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '24px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}
    >
      {steps.map((step, index) => (
        <div
          key={step.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {index + 1}
          </div>
          <div>
            <div style={{ fontWeight: '600' }}>{step.label}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{step.description}</div>
          </div>
        </div>
      ))}
    </Stepper>
  );
}
```

## Advanced Examples

### Wizard Stepper
Multi-step form wizard with validation.

```tsx
function WizardStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const steps = [
    { label: 'Personal Info', description: 'Enter your personal details' },
    { label: 'Account Setup', description: 'Create your account credentials' },
    { label: 'Preferences', description: 'Set your preferences' },
    { label: 'Review', description: 'Review and submit' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepSelect = (detail: StepperChangeDetail) => {
    // Only allow selection if step is complete or previous
    if (detail.index <= currentStep) {
      setCurrentStep(detail.index);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Stepper
        steps={steps}
        value={`step-${currentStep}`}
        clickable={true}
        linear={true}
        onChange={handleStepSelect}
      />
      
      <div style={{ marginTop: '24px', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        {/* Step content would go here */}
        <div style={{ marginBottom: '16px' }}>
          <h3>{steps[currentStep].label}</h3>
          <p>{steps[currentStep].description}</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{
              padding: '8px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.5 : 1
            }}
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            style={{
              padding: '8px 16px',
              backgroundColor: currentStep === steps.length - 1 ? '#94a3b8' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: currentStep === steps.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Progress Tracking Stepper
Stepper with dynamic progress updates.

```tsx
function ProgressStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStates, setStepStates] = useState(['complete', 'default', 'default', 'default']);

  const steps = [
    { label: 'Upload Files', description: 'Upload your documents' },
    { label: 'Processing', description: 'Processing uploaded files' },
    { label: 'Analysis', description: 'Analyzing your data' },
    { label: 'Complete', description: 'Task completed successfully' }
  ];

  const handleStepChange = (detail: StepperChangeDetail) => {
    setCurrentStep(detail.index);
    
    // Update step states based on completion
    const newStates = [...stepStates];
    for (let i = 0; i <= detail.index; i++) {
      newStates[i] = 'complete';
    }
    setStepStates(newStates);
  };

  return (
    <Stepper
      steps={steps.map((step, index) => ({
        ...step,
        state: stepStates[index] as 'default' | 'complete' | 'error' | 'warning'
      }))}
      value={`step-${currentStep}`}
      onChange={handleStepChange}
    />
  );
}
```

### Error Handling Stepper
Stepper with error states and recovery options.

```tsx
function ErrorHandlingStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState([false, false, false]);

  const steps = [
    { label: 'Validation', description: 'Validating input data' },
    { label: 'Processing', description: 'Processing your request' },
    { label: 'Completion', description: 'Finalizing the process' }
  ];

  const handleRetry = (stepIndex: number) => {
    // Simulate retry logic
    const newErrors = [...stepErrors];
    newErrors[stepIndex] = false;
    setStepErrors(newErrors);
    
    if (stepIndex === currentStep) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const getStepState = (index: number) => {
    if (stepErrors[index]) return 'error';
    if (index < currentStep) return 'complete';
    if (index === currentStep) return 'default';
    return 'default';
  };

  return (
    <Stepper
      steps={steps.map((step, index) => ({
        ...step,
        state: getStepState(index) as 'default' | 'complete' | 'error' | 'warning',
        description: stepErrors[index] 
          ? 'An error occurred. Please try again.' 
          : step.description
      }))}
      value={`step-${currentStep}`}
      onChange={(detail) => setCurrentStep(detail.index)}
    >
      {stepErrors.some(error => error) && (
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
          <div style={{ fontWeight: '600', color: '#dc2626', marginBottom: '8px' }}>
            Some steps encountered errors
          </div>
          <div style={{ fontSize: '12px', color: '#7f1d1d' }}>
            Click retry buttons below to resolve issues
          </div>
        </div>
      )}
    </Stepper>
  );
}
```

### Custom Step Content
Stepper with custom step content and styling.

```tsx
function CustomContentStepper() {
  const steps = [
    {
      label: 'Design',
      description: 'Create your design concept',
      icon: '🎨'
    },
    {
      label: 'Development',
      description: 'Build your application',
      icon: '💻'
    },
    {
      label: 'Testing',
      description: 'Test and validate',
      icon: '🧪'
    },
    {
      label: 'Deployment',
      description: 'Deploy to production',
      icon: '🚀'
    }
  ];

  return (
    <Stepper
      steps={steps}
      value="step-2"
      headless={true}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px'
      }}
    >
      {steps.map((step, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            backgroundColor: index === 1 ? '#eff6ff' : '#ffffff',
            border: `1px solid ${index === 1 ? '#bfdbfe' : '#e2e8f0'}`,
            borderRadius: '12px',
            transition: 'all 0.2s ease'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: index === 1 ? '#3b82f6' : '#e2e8f0',
              color: index === 1 ? 'white' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}
          >
            {step.icon}
          </div>
          
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px' }}>
              {step.label}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              {step.description}
            </div>
          </div>
          
          <div style={{ marginLeft: 'auto' }}>
            {index === 1 && (
              <div style={{
                padding: '4px 8px',
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                In Progress
              </div>
            )}
            {index < 1 && (
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#10b981'
              }} />
            )}
          </div>
        </div>
      ))}
    </Stepper>
  );
}
```

## Styling and Theming

### CSS Custom Properties
Customize stepper appearance using CSS custom properties:

```css
:root {
  --ui-stepper-gap: 24px;
  --ui-stepper-step-gap: 12px;
  --ui-stepper-step-size: 24px;
  --ui-stepper-step-border-width: 2px;
  --ui-stepper-step-transition: all 0.2s ease;
  
  /* Default variant */
  --ui-stepper-default-bg: #ffffff;
  --ui-stepper-default-border: #e5e7eb;
  --ui-stepper-default-text: #374151;
  --ui-stepper-default-muted: #9ca3af;
  --ui-stepper-default-active: #3b82f6;
  --ui-stepper-default-complete: #10b981;
  --ui-stepper-default-error: #ef4444;
  --ui-stepper-default-warning: #f59e0b;
  
  /* Contrast variant */
  --ui-stepper-contrast-bg: #111827;
  --ui-stepper-contrast-border: #374151;
  --ui-stepper-contrast-text: #f9fafb;
  --ui-stepper-contrast-muted: #9ca3af;
  --ui-stepper-contrast-active: #60a5fa;
  --ui-stepper-contrast-complete: #34d399;
  --ui-stepper-contrast-error: #f87171;
  --ui-stepper-contrast-warning: #fbbf24;
  
  /* Minimal variant */
  --ui-stepper-minimal-bg: transparent;
  --ui-stepper-minimal-border: #e5e7eb;
  --ui-stepper-minimal-text: #374151;
  --ui-stepper-minimal-muted: #9ca3af;
  --ui-stepper-minimal-active: #3b82f6;
  --ui-stepper-minimal-complete: #10b981;
  --ui-stepper-minimal-error: #ef4444;
  --ui-stepper-minimal-warning: #f59e0b;
}

ui-stepper {
  display: flex;
  gap: var(--ui-stepper-gap);
  align-items: center;
  padding: 16px;
  background-color: var(--ui-stepper-default-bg);
  border: 1px solid var(--ui-stepper-default-border);
  border-radius: 8px;
}

/* Horizontal orientation */
ui-stepper[orientation="horizontal"] {
  flex-direction: row;
}

/* Vertical orientation */
ui-stepper[orientation="vertical"] {
  flex-direction: column;
}

/* Step styling */
ui-stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ui-stepper-step-gap);
  position: relative;
}

/* Step indicator */
ui-stepper-step-indicator {
  width: var(--ui-stepper-step-size);
  height: var(--ui-stepper-step-size);
  border-radius: 50%;
  border: var(--ui-stepper-step-border-width) solid var(--ui-stepper-default-border);
  background-color: var(--ui-stepper-default-bg);
  color: var(--ui-stepper-default-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: var(--ui-stepper-step-transition);
}

/* Step label */
ui-stepper-step-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ui-stepper-default-text);
  text-align: center;
}

/* Step description */
ui-stepper-step-description {
  font-size: 12px;
  color: var(--ui-stepper-default-muted);
  text-align: center;
}

/* Step states */
ui-stepper-step[complete] ui-stepper-step-indicator {
  background-color: var(--ui-stepper-default-complete);
  border-color: var(--ui-stepper-default-complete);
  color: white;
}

ui-stepper-step[active] ui-stepper-step-indicator {
  background-color: var(--ui-stepper-default-active);
  border-color: var(--ui-stepper-default-active);
  color: white;
  transform: scale(1.1);
}

ui-stepper-step[error] ui-stepper-step-indicator {
  background-color: var(--ui-stepper-default-error);
  border-color: var(--ui-stepper-default-error);
  color: white;
}

ui-stepper-step[warning] ui-stepper-step-indicator {
  background-color: var(--ui-stepper-default-warning);
  border-color: var(--ui-stepper-default-warning);
  color: white;
}

/* Optional step indicator */
ui-stepper-step[optional] ui-stepper-step-indicator::after {
  content: 'Optional';
  position: absolute;
  top: -20px;
  font-size: 10px;
  color: var(--ui-stepper-default-muted);
}

/* Connector lines */
ui-stepper-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: var(--ui-stepper-default-border);
  transform: translate(-50%, -50%);
  z-index: -1;
}

/* Vertical connector adjustment */
ui-stepper[orientation="vertical"] ui-stepper-step:not(:last-child)::after {
  width: 2px;
  height: 100%;
  left: 50%;
  top: 100%;
}

/* Clickable step styling */
ui-stepper[clickable] ui-stepper-step {
  cursor: pointer;
}

ui-stepper[clickable] ui-stepper-step:hover {
  opacity: 0.8;
}

/* Variants */
ui-stepper[variant="contrast"] {
  background-color: var(--ui-stepper-contrast-bg);
  border-color: var(--ui-stepper-contrast-border);
}

ui-stepper[variant="contrast"] ui-stepper-step-label {
  color: var(--ui-stepper-contrast-text);
}

ui-stepper[variant="contrast"] ui-stepper-step-description {
  color: var(--ui-stepper-contrast-muted);
}

ui-stepper[variant="minimal"] {
  background-color: var(--ui-stepper-minimal-bg);
  border: none;
  box-shadow: none;
}

/* Sizes */
ui-stepper[size="sm"] {
  --ui-stepper-step-size: 16px;
  --ui-stepper-step-gap: 8px;
  --ui-stepper-gap: 16px;
}

ui-stepper[size="lg"] {
  --ui-stepper-step-size: 32px;
  --ui-stepper-step-gap: 16px;
  --ui-stepper-gap: 32px;
}

/* Headless variant */
ui-stepper[headless] {
  background-color: transparent;
  border: none;
  padding: 0;
  gap: 0;
}
```

### Theme Variations
Create different theme variations:

```css
/* Corporate theme */
ui-stepper.theme-corporate {
  --ui-stepper-default-bg: #ffffff;
  --ui-stepper-default-border: #e5e7eb;
  --ui-stepper-default-text: #1f2937;
  --ui-stepper-default-muted: #6b7280;
  --ui-stepper-default-active: #2563eb;
  --ui-stepper-default-complete: #059669;
  --ui-stepper-default-error: #dc2626;
  --ui-stepper-default-warning: #d97706;
}

/* Modern theme */
ui-stepper.theme-modern {
  --ui-stepper-default-bg: #f8fafc;
  --ui-stepper-default-border: #e2e8f0;
  --ui-stepper-default-text: #1e293b;
  --ui-stepper-default-muted: #64748b;
  --ui-stepper-default-active: #7c3aed;
  --ui-stepper-default-complete: #06b6d4;
  --ui-stepper-default-error: #ef4444;
  --ui-stepper-default-warning: #f59e0b;
}

/* Dark theme */
ui-stepper.theme-dark {
  --ui-stepper-default-bg: #111827;
  --ui-stepper-default-border: #374151;
  --ui-stepper-default-text: #f9fafb;
  --ui-stepper-default-muted: #9ca3af;
  --ui-stepper-default-active: #60a5fa;
  --ui-stepper-default-complete: #34d399;
  --ui-stepper-default-error: #f87171;
  --ui-stepper-default-warning: #fbbf24;
}
```

### Animation Customization
Add custom animations:

```css
ui-stepper-step-indicator {
  animation: popIn 0.3s ease-out;
}

@keyframes popIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Progress animation */
ui-stepper-step[complete] ui-stepper-step-indicator {
  animation: checkmark 0.3s ease-out;
}

@keyframes checkmark {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Connector animation */
ui-stepper-step:not(:last-child)::after {
  animation: drawLine 0.5s ease-out forwards;
  transform-origin: left center;
  transform: scaleX(0);
}

@keyframes drawLine {
  to {
    transform: scaleX(1);
  }
}
```

## Accessibility

### ARIA Attributes
Stepper components include proper ARIA attributes:

- `role="navigation"` for navigation context
- `aria-label` for descriptive labels
- `aria-current="step"` for current step
- `aria-disabled` for disabled steps
- `aria-describedby` for step descriptions

### Screen Reader Support
- Clear step labels and descriptions
- Current step announcements
- Step count and position
- State changes for completion

### Keyboard Navigation
- Tab navigation through steps
- Arrow key navigation (left/right for horizontal, up/down for vertical)
- Enter/Space to activate steps
- Focus management for interactive steps

## Best Practices

1. **Use appropriate orientation**: Horizontal for simple flows, vertical for complex multi-line steps
2. **Limit step count**: Keep to 3-5 steps for optimal user experience
3. **Clear step labels**: Use descriptive, action-oriented labels
4. **Provide context**: Include descriptions for complex steps
5. **Handle errors gracefully**: Show error states and recovery options
6. **Consider accessibility**: Ensure keyboard navigation and screen reader support
7. **Use consistent styling**: Maintain visual consistency across your application
8. **Test responsive behavior**: Ensure steppers work well on all screen sizes

## Related Components

- [Progress](./progress) - Progress bar component
- [Tabs](./tabs) - Tab navigation component
- [Wizard](./wizard) - Multi-step form component
- [Breadcrumb](./breadcrumb) - Navigation breadcrumb component