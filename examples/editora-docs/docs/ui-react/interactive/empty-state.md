---
title: EmptyState
description: EmptyState component for displaying empty or empty states with customizable content, actions, and styling options.
sidebar_label: EmptyState
---

# EmptyState

The `EmptyState` component provides a visually appealing way to display empty states when there's no content to show. It supports customizable titles, descriptions, actions, and styling options to guide users on what to do next.

## Basic Usage

```tsx
import { EmptyState } from '@editora/ui-react';

function BasicEmptyState() {
  return (
    <EmptyState
      title="No items found"
      description="Try adjusting your search or filter to find what you're looking for."
      actionLabel="Clear filters"
      onAction={() => console.log('Action clicked')}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Main title text |
| `description` | `string` | - | Supporting description text |
| `actionLabel` | `string` | - | Label for the primary action button |
| `tone` | `'neutral' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Visual tone for the empty state |
| `compact` | `boolean` | `false` | Use compact layout |
| `headless` | `boolean` | `false` | Render without default styling |
| `onAction` | `() => void` | - | Action button click handler |
| `className` | `string` | - | Custom CSS class |
| `style` | `React.CSSProperties` | - | Inline styles |
| `children` | `React.ReactNode` | - | Custom content to render |

## Basic Configuration

### Simple Empty State
Basic empty state with title and description.

```tsx
function SimpleEmptyState() {
  return (
    <EmptyState
      title="No data available"
      description="There is no data to display at this time."
    />
  );
}
```

### Empty State with Action
Empty state with a primary action button.

```tsx
function EmptyStateWithAction() {
  return (
    <EmptyState
      title="No items found"
      description="Start by creating your first item."
      actionLabel="Create Item"
      onAction={() => console.log('Create new item')}
    />
  );
}
```

### Compact Empty State
Compact layout for space-constrained scenarios.

```tsx
function CompactEmptyState() {
  return (
    <EmptyState
      title="No results"
      description="Try a different search term."
      actionLabel="Try again"
      compact={true}
      onAction={() => console.log('Try again')}
    />
  );
}
```

### Headless Empty State
Empty state without default styling for custom implementations.

```tsx
function HeadlessEmptyState() {
  return (
    <EmptyState
      title="Custom Empty State"
      description="Fully customizable empty state"
      headless={true}
      style={{
        padding: '24px',
        backgroundColor: '#f3f4f6',
        borderRadius: '12px',
        border: '2px dashed #d1d5db',
        textAlign: 'center'
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ color: '#6b7280' }}>
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <button
        style={{
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
        onClick={() => console.log('Custom action')}
      >
        Custom Action
      </button>
    </EmptyState>
  );
}
```

## Empty State Tones

### Neutral Tone
Standard neutral styling for general empty states.

```tsx
<EmptyState
  title="No items"
  description="There are no items to display."
  tone="neutral"
/>
```

### Success Tone
Green-themed empty state for positive scenarios.

```tsx
<EmptyState
  title="All done!"
  description="You've completed all your tasks."
  actionLabel="View completed"
  tone="success"
  onAction={() => console.log('View completed tasks')}
/>
```

### Warning Tone
Yellow-themed empty state for warnings or alerts.

```tsx
<EmptyState
  title="Almost there"
  description="You need to complete a few more steps."
  actionLabel="Continue setup"
  tone="warning"
  onAction={() => console.log('Continue setup')}
/>
```

### Danger Tone
Red-themed empty state for errors or critical situations.

```tsx
<EmptyState
  title="Connection lost"
  description="Unable to connect to the server."
  actionLabel="Retry connection"
  tone="danger"
  onAction={() => console.log('Retry connection')}
/>
```

## Advanced Features

### Custom Content
Replace default content with custom elements.

```tsx
function CustomContentEmptyState() {
  return (
    <EmptyState
      title="Welcome to your dashboard"
      description="Get started by exploring the features below."
      actionLabel="Explore features"
      onAction={() => console.log('Explore features')}
    >
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button style={{
          padding: '6px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          Help
        </button>
        <button style={{
          padding: '6px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          Tutorial
        </button>
      </div>
    </EmptyState>
  );
}
```

### Icon Integration
Add custom icons or illustrations.

```tsx
function IconEmptyState() {
  return (
    <EmptyState
      title="No notifications"
      description="You're all caught up!"
      actionLabel="Check settings"
      onAction={() => console.log('Check settings')}
    >
      <div style={{ marginBottom: '16px' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ color: '#9ca3af' }}>
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </EmptyState>
  );
}
```

### Multiple Actions
Provide multiple action options.

```tsx
function MultipleActionsEmptyState() {
  return (
    <EmptyState
      title="No projects yet"
      description="Create your first project to get started."
      actionLabel="Create project"
      onAction={() => console.log('Create project')}
    >
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button style={{
          padding: '8px 16px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          cursor: 'pointer'
        }}>
          Import project
        </button>
        <button style={{
          padding: '8px 16px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          cursor: 'pointer'
        }}>
          View templates
        </button>
      </div>
    </EmptyState>
  );
}
```

## Advanced Examples

### Search Empty State
Empty state for search results with filters.

```tsx
function SearchEmptyState() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', date: '' });

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ category: '', date: '' });
  };

  return (
    <EmptyState
      title="No results found"
      description={`No items match your search for "${searchTerm}". Try adjusting your search or filters.`}
      actionLabel="Clear filters"
      onAction={handleClearFilters}
      tone="neutral"
    >
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={{
          padding: '6px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          Try different keywords
        </button>
        <button style={{
          padding: '6px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          Reset filters
        </button>
        <button style={{
          padding: '6px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          View all items
        </button>
      </div>
    </EmptyState>
  );
}
```

### Onboarding Empty State
Empty state for new user onboarding.

```tsx
function OnboardingEmptyState() {
  const [step, setStep] = useState(1);

  const steps = [
    { title: 'Set up your profile', description: 'Add your photo and personal information' },
    { title: 'Connect accounts', description: 'Link your email and social accounts' },
    { title: 'Explore features', description: 'Discover what you can do with our platform' }
  ];

  const handleNextStep = () => {
    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  const handleCompleteSetup = () => {
    console.log('Setup completed');
  };

  return (
    <EmptyState
      title={`Step ${step} of ${steps.length}: ${steps[step - 1].title}`}
      description={steps[step - 1].description}
      actionLabel={step < steps.length ? "Next step" : "Complete setup"}
      onAction={step < steps.length ? handleNextStep : handleCompleteSetup}
      tone="success"
    >
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index < step ? '#10b981' : '#e5e7eb'
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          {step} of {steps.length} steps completed
        </div>
      </div>
    </EmptyState>
  );
}
```

### Error Empty State
Empty state for error conditions with recovery options.

```tsx
function ErrorEmptyState() {
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount(retryCount + 1);
    console.log('Retrying...');
  };

  const handleReportIssue = () => {
    console.log('Reporting issue...');
  };

  return (
    <EmptyState
      title="Something went wrong"
      description="We're having trouble loading your data. This might be a temporary issue."
      actionLabel="Try again"
      onAction={handleRetry}
      tone="danger"
    >
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button style={{
          padding: '8px 16px',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          color: '#ef4444',
          cursor: 'pointer'
        }}>
          Report issue
        </button>
        <button style={{
          padding: '8px 16px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          cursor: 'pointer'
        }}>
          Check status
        </button>
      </div>
      {retryCount > 0 && (
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          Retry attempt: {retryCount}
        </div>
      )}
    </EmptyState>
  );
}
```

### Empty State with Progress
Empty state showing progress or loading state.

```tsx
function ProgressEmptyState() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <EmptyState
      title="Setting up your account"
      description="This may take a moment while we prepare everything for you."
      compact={true}
      tone="success"
    >
      <div style={{ marginTop: '16px', width: '100%', backgroundColor: '#e5e7eb', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#10b981',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
        {progress}% complete
      </div>
    </EmptyState>
  );
}
```

## Styling and Theming

### CSS Custom Properties
Customize empty state appearance using CSS custom properties:

```css
:root {
  --ui-empty-state-padding: 24px;
  --ui-empty-state-border-radius: 12px;
  --ui-empty-state-gap: 16px;
  --ui-empty-state-transition: all 0.2s ease;
  
  /* Neutral tone */
  --ui-empty-state-neutral-bg: #ffffff;
  --ui-empty-state-neutral-border: #e5e7eb;
  --ui-empty-state-neutral-text: #374151;
  --ui-empty-state-neutral-muted: #6b7280;
  
  /* Success tone */
  --ui-empty-state-success-bg: #ecfdf5;
  --ui-empty-state-success-border: #bbf7d0;
  --ui-empty-state-success-text: #065f46;
  --ui-empty-state-success-muted: #064e3b;
  
  /* Warning tone */
  --ui-empty-state-warning-bg: #fffbeb;
  --ui-empty-state-warning-border: #fed7aa;
  --ui-empty-state-warning-text: #92400e;
  --ui-empty-state-warning-muted: #78350f;
  
  /* Danger tone */
  --ui-empty-state-danger-bg: #fef2f2;
  --ui-empty-state-danger-border: #fecaca;
  --ui-empty-state-danger-text: #991b1b;
  --ui-empty-state-danger-muted: #7f1d1d;
}

ui-empty-state {
  padding: var(--ui-empty-state-padding);
  border-radius: var(--ui-empty-state-border-radius);
  border: 1px solid var(--ui-empty-state-neutral-border);
  background-color: var(--ui-empty-state-neutral-bg);
  color: var(--ui-empty-state-neutral-text);
  transition: var(--ui-empty-state-transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ui-empty-state-gap);
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

ui-empty-state[tone="success"] {
  background-color: var(--ui-empty-state-success-bg);
  border-color: var(--ui-empty-state-success-border);
  color: var(--ui-empty-state-success-text);
}

ui-empty-state[tone="warning"] {
  background-color: var(--ui-empty-state-warning-bg);
  border-color: var(--ui-empty-state-warning-border);
  color: var(--ui-empty-state-warning-text);
}

ui-empty-state[tone="danger"] {
  background-color: var(--ui-empty-state-danger-bg);
  border-color: var(--ui-empty-state-danger-border);
  color: var(--ui-empty-state-danger-text);
}

/* Compact variant */
ui-empty-state[compact] {
  padding: 16px;
  gap: 12px;
  max-width: 400px;
}

/* Headless variant */
ui-empty-state[headless] {
  background-color: transparent;
  border: none;
  padding: 0;
  gap: 0;
}

/* Title styling */
ui-empty-state-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: inherit;
}

/* Description styling */
ui-empty-state-description {
  font-size: 14px;
  color: var(--ui-empty-state-neutral-muted);
  line-height: 1.5;
  margin: 0;
}

ui-empty-state[tone="success"] ui-empty-state-description {
  color: var(--ui-empty-state-success-muted);
}

ui-empty-state[tone="warning"] ui-empty-state-description {
  color: var(--ui-empty-state-warning-muted);
}

ui-empty-state[tone="danger"] ui-empty-state-description {
  color: var(--ui-empty-state-danger-muted);
}

/* Action button styling */
ui-empty-state-action {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

ui-empty-state-action:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

ui-empty-state-action:active {
  transform: translateY(0);
}
```

### Theme Variations
Create different theme variations:

```css
/* Dark theme */
ui-empty-state.theme-dark {
  --ui-empty-state-neutral-bg: #1f2937;
  --ui-empty-state-neutral-border: #374151;
  --ui-empty-state-neutral-text: #f9fafb;
  --ui-empty-state-neutral-muted: #9ca3af;
  --ui-empty-state-success-bg: #064e3b;
  --ui-empty-state-success-border: #10b981;
  --ui-empty-state-success-text: #d1fae5;
  --ui-empty-state-warning-bg: #78350f;
  --ui-empty-state-warning-border: #f59e0b;
  --ui-empty-state-warning-text: #fde68a;
  --ui-empty-state-danger-bg: #7f1d1d;
  --ui-empty-state-danger-border: #ef4444;
  --ui-empty-state-danger-text: #fecaca;
}

/* Light theme */
ui-empty-state.theme-light {
  --ui-empty-state-neutral-bg: #ffffff;
  --ui-empty-state-neutral-border: #e5e7eb;
  --ui-empty-state-neutral-text: #111827;
  --ui-empty-state-neutral-muted: #6b7280;
  --ui-empty-state-success-bg: #ecfdf5;
  --ui-empty-state-success-border: #bbf7d0;
  --ui-empty-state-success-text: #065f46;
  --ui-empty-state-warning-bg: #fffbeb;
  --ui-empty-state-warning-border: #fed7aa;
  --ui-empty-state-warning-text: #92400e;
  --ui-empty-state-danger-bg: #fef2f2;
  --ui-empty-state-danger-border: #fecaca;
  --ui-empty-state-danger-text: #991b1b;
}

/* Corporate theme */
ui-empty-state.theme-corporate {
  --ui-empty-state-padding: 32px;
  --ui-empty-state-border-radius: 16px;
  --ui-empty-state-gap: 20px;
  --ui-empty-state-neutral-bg: #ffffff;
  --ui-empty-state-neutral-border: #e5e7eb;
  --ui-empty-state-neutral-text: #1f2937;
  --ui-empty-state-neutral-muted: #6b7280;
  --ui-empty-state-success-bg: #f0f9ff;
  --ui-empty-state-success-border: #bae6fd;
  --ui-empty-state-success-text: #0369a1;
  --ui-empty-state-warning-bg: #fff7ed;
  --ui-empty-state-warning-border: #fed7aa;
  --ui-empty-state-warning-text: #c2410c;
  --ui-empty-state-danger-bg: #fef2f2;
  --ui-empty-state-danger-border: #fecaca;
  --ui-empty-state-danger-text: #dc2626;
}
```

### Animation Customization
Add custom animations:

```css
ui-empty-state {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.4s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse animation for action button */
ui-empty-state-action {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}
```

## Accessibility

### ARIA Attributes
Empty state components include proper ARIA attributes:

- `role="status"` for status indication
- `aria-live="polite"` for dynamic content updates
- `aria-label` for descriptive labels
- Proper heading structure for screen readers

### Screen Reader Support
- Clear, descriptive content for context
- Logical reading order
- Action button announcements
- State changes for dynamic content

### Keyboard Navigation
- Focus management for action buttons
- Logical tab order
- Escape key support for dismissible states

## Best Practices

1. **Use appropriate tone**: Choose tone based on context (success, warning, danger)
2. **Provide clear actions**: Always offer meaningful next steps
3. **Keep content concise**: Use clear, actionable language
4. **Test accessibility**: Ensure screen reader compatibility
5. **Consider context**: Match empty state to user scenario
6. **Use visuals appropriately**: Icons and illustrations enhance understanding
7. **Handle loading states**: Show progress for async operations
8. **Provide recovery options**: Help users resolve issues

## Related Components

- [Alert](./alert) - Alert messages for important information
- [Toast](./toast) - Temporary notification component
- [Dialog](./dialog) - Modal dialog component
- [Card](./card) - Structured container for empty and loading states