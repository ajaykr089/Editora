---
title: Alert
description: Alert component for displaying important messages with customizable appearance, animations, and accessibility support.
sidebar_label: Alert
---

# Alert

The `Alert` component provides important messages with support for custom styling, comprehensive accessibility features, and smooth animations for enhanced user experience.

Import `Alert`, `AlertTitle`, `AlertDescription`, `AlertActions`, and `AlertIcon` together when you want a structured message layout.

## Basic Usage

```tsx
import { Alert } from '@editora/ui-react';

function BasicAlert() {
  return (
    <Alert tone="info" variant="surface" radius={12} title="Welcome to Editora">
      This is an informational alert message.
    </Alert>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Alert title |
| `description` | `string` | - | Alert description |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | - | Alert tone |
| `variant` | `'surface' \| 'soft' \| 'outline' \| 'solid'` | - | Alert variant |
| `layout` | `'inline' \| 'banner'` | - | Alert layout |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Density and typography scale |
| `radius` | `number \| string` | theme radius | Corner radius; numbers are treated as pixels and `full` creates a pill shell |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Shadow depth |
| `indicator` | `'line' \| 'none'` | `'line'` | Show or hide the left accent rail |
| `dismissible` | `boolean` | `false` | Show dismiss button |
| `open` | `boolean` | - | Alert open state |
| `headless` | `boolean` | `false` | Remove default styling |
| `onClose` | `() => void` | - | Close handler |
| `children` | `React.ReactNode` | - | Alert content |

## Structured Composition

```tsx
import { Alert, AlertActions, AlertDescription, AlertTitle } from '@editora/ui-react';

function StructuredAlert() {
  return (
    <Alert tone="info" variant="surface" radius={12}>
      <AlertTitle>Deployment notice</AlertTitle>
      <AlertDescription>
        Production rollout windows have shifted by 20 minutes for the eu-west cluster.
      </AlertDescription>
      <AlertActions>
        <button type="button">Review plan</button>
        <button type="button">Acknowledge</button>
      </AlertActions>
    </Alert>
  );
}
```

## Basic Configuration

### Info Alert
Basic informational alert.

```tsx
<Alert tone="info" variant="surface" radius={12} title="Information" description="This is an informational message." />
```

### Success Alert
Success message alert.

```tsx
<Alert tone="success" variant="soft" radius={12} title="Success" description="Your changes have been saved successfully." />
```

### Warning Alert
Warning message alert.

```tsx
<Alert tone="warning" variant="outline" radius={12} title="Warning" description="Please review your settings before proceeding." />
```

### Error Alert
Error message alert.

```tsx
<Alert tone="danger" variant="solid" radius={12} title="Error" description="An error occurred while processing your request." />
```

### Dismissible Alert
Alert with close functionality.

```tsx
function DismissibleAlert() {
  const [visible, setVisible] = useState(true);

  return visible ? (
    <Alert 
      tone="info"
      title="Notice"
      description="This alert can be dismissed."
      dismissible
      onClose={() => setVisible(false)}
    />
  ) : null;
}
```

## Alert Variants

### Soft Variant
Soft styled alert.

```tsx
<Alert variant="soft" tone="info" radius={12} title="Information" description="This is a soft styled alert." />
```

### Outline Variant
Outline styled alert.

```tsx
<Alert variant="outline" tone="success" radius={12} elevation="none" title="Success" description="This is an outline styled alert." />
```

### Solid Variant
Solid styled alert.

```tsx
<Alert variant="solid" tone="warning" radius={12} elevation="low" title="Warning" description="This is a solid styled alert." />
```

## Alert Layouts

### Inline Layout
Standard inline alert.

```tsx
<Alert layout="inline" tone="info" variant="surface" title="Inline Alert" description="This is an inline layout alert." />
```

### Banner Layout
Banner style alert.

```tsx
<Alert layout="banner" tone="success" variant="soft" title="Banner Alert" description="This is a banner layout alert." />
```

## Advanced Features

### Custom Content
Add custom content to alerts.

```tsx
<Alert 
  tone="info"
  title="Custom Alert"
>
  <div style={{ display: 'grid', gap: '8px' }}>
    <p>This alert contains custom content.</p>
    <div style={{ display: 'flex', gap: '8px' }}>
      <button style={{ padding: '4px 8px', borderRadius: '4px' }}>
        Action 1
      </button>
      <button style={{ padding: '4px 8px', borderRadius: '4px' }}>
        Action 2
      </button>
    </div>
  </div>
</Alert>
```

### Multiple Alerts
Display multiple alerts together.

```tsx
<div style={{ display: 'grid', gap: '12px' }}>
  <Alert 
    tone="success"
    variant="soft"
    title="Success"
    description="First operation completed."
  />
  <Alert 
    tone="warning"
    variant="outline"
    title="Warning"
    description="Second operation needs attention."
  />
  <Alert 
    tone="info"
    variant="solid"
    title="Info"
    description="Additional information available."
  />
</div>
```

### Dynamic Alerts
Create alerts dynamically based on state.

```tsx
function DynamicAlerts() {
  const [alerts, setAlerts] = useState([
    { id: 1, tone: 'success', title: 'Success', message: 'Item created' },
    { id: 2, tone: 'info', title: 'Info', message: 'Processing complete' }
  ]);

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          tone={alert.tone}
          title={alert.title}
          description={alert.message}
          dismissible
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
}
```

## Advanced Examples

### Form Validation Alerts
Form validation with alert messages.

```tsx
function FormValidationAlerts() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.email.includes('@')) {
      newErrors.push('Please enter a valid email address');
    }
    
    if (formData.password.length < 8) {
      newErrors.push('Password must be at least 8 characters long');
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }
    
    setErrors(newErrors);
    setSuccess(newErrors.length === 0);
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Form Validation Alerts
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Form with validation alerts for user feedback.
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {errors.length > 0 && (
          <Alert
            tone="danger"
            variant="outline"
            title="Validation Errors"
            description={`${errors.length} error(s) found`}
            dismissible
            onClose={() => setErrors([])}
          >
            <div style={{ display: 'grid', gap: '4px', marginTop: '8px' }}>
              {errors.map((error, index) => (
                <div key={index} style={{ fontSize: '12px', color: '#ef4444' }}>
                  • {error}
                </div>
              ))}
            </div>
          </Alert>
        )}
        
        {success && (
          <Alert
            tone="success"
            variant="soft"
            title="Form Validated"
            description="All fields are valid. You can submit the form."
            dismissible
            onClose={() => setSuccess(false)}
          />
        )}
        
        <div style={{
          padding: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>Form Fields</div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}
                placeholder="Confirm your password"
              />
            </div>
            <button
              onClick={validateForm}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Validate Form
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Form Status
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Errors: {errors.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Valid: {success ? 'Yes' : 'No'}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Email: {formData.email || 'Empty'}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### System Status Alerts
System status monitoring with alerts.

```tsx
function SystemStatusAlerts() {
  const [systemStatus, setSystemStatus] = useState({
    database: 'online',
    api: 'online',
    cache: 'degraded',
    storage: 'offline'
  });

  const getStatusAlert = (status: string) => {
    switch (status) {
      case 'online': return { tone: 'success', title: 'Online', message: 'Service is running normally' };
      case 'degraded': return { tone: 'warning', title: 'Degraded', message: 'Service performance is reduced' };
      case 'offline': return { tone: 'danger', title: 'Offline', message: 'Service is currently unavailable' };
      default: return { tone: 'info', title: 'Unknown', message: 'Service status is unknown' };
    }
  };

  const services = Object.entries(systemStatus).map(([name, status]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    status,
    ...getStatusAlert(status)
  }));

  const errorCount = services.filter(s => s.tone === 'danger').length;
  const warningCount = services.filter(s => s.tone === 'warning').length;

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          System Status Monitoring
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Real-time system status with alert notifications.
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {services.map((service) => (
          <Alert
            key={service.name}
            tone={service.tone}
            variant="outline"
            title={`${service.name}: ${service.title}`}
            description={service.message}
          />
        ))}
      </div>
      
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          System Summary
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Total Services: {services.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Errors: {errorCount}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Warnings: {warningCount}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Status: {errorCount > 0 ? 'Critical' : warningCount > 0 ? 'Warning' : 'Healthy'}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Notification Center
Notification center with categorized alerts.

```tsx
function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'Welcome', message: 'Welcome to your dashboard', read: false },
    { id: 2, type: 'success', title: 'Update Complete', message: 'System update completed successfully', read: true },
    { id: 3, type: 'warning', title: 'Low Storage', message: 'Your storage is running low', read: false },
    { id: 4, type: 'danger', title: 'Connection Lost', message: 'Unable to connect to server', read: false }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Notification Center
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Manage your application notifications and alerts.
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {unreadCount > 0 && (
          <Alert
            tone="info"
            variant="soft"
            title={`You have ${unreadCount} unread notification(s)`}
            description="Please review your notifications below"
          />
        )}
        
        <div style={{
          padding: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>Notifications</div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {notifications.map((notification) => (
              <Alert
                key={notification.id}
                tone={notification.type}
                variant="outline"
                title={notification.title}
                description={notification.message}
                dismissible
                onClose={() => deleteNotification(notification.id)}
              >
                {!notification.read && (
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      onClick={() => markAsRead(notification.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        color: '#6b7280',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      Mark as Read
                    </button>
                  </div>
                )}
              </Alert>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Notification Summary
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Total Notifications: {notifications.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Unread: {unreadCount}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Read: {notifications.length - unreadCount}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Progress Alerts
Progress tracking with alert notifications.

```tsx
function ProgressAlerts() {
  const [progress, setProgress] = useState(0);
  const [alerts, setAlerts] = useState<string[]>([]);

  const updateProgress = () => {
    const newProgress = Math.min(progress + 10, 100);
    setProgress(newProgress);
    
    if (newProgress === 25) {
      setAlerts(prev => [...prev, '25% Complete - Good progress!']);
    } else if (newProgress === 50) {
      setAlerts(prev => [...prev, '50% Complete - Halfway there!']);
    } else if (newProgress === 75) {
      setAlerts(prev => [...prev, '75% Complete - Almost done!']);
    } else if (newProgress === 100) {
      setAlerts(prev => [...prev, '100% Complete - Task finished successfully!']);
    }
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Progress Tracking Alerts
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Track progress with milestone alerts.
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            tone={progress === 100 ? 'success' : 'info'}
            variant="soft"
            title="Milestone Reached"
            description={alert}
            dismissible
            onClose={() => setAlerts(prev => prev.filter((_, i) => i !== index))}
          />
        ))}
        
        <div style={{
          padding: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>Progress</div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Progress</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{progress}%</span>
              </div>
              <div style={{ 
                height: '8px', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${progress}%`, 
                  backgroundColor: progress === 100 ? '#10b981' : '#3b82f6', 
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={updateProgress}
                disabled={progress === 100}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: progress === 100 ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: progress === 100 ? 'not-allowed' : 'pointer'
                }}
              >
                {progress === 100 ? 'Complete' : 'Increase Progress'}
              </button>
              <button
                onClick={clearAlerts}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Clear Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Progress Summary
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Current Progress: {progress}%
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Alerts Generated: {alerts.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Status: {progress === 100 ? 'Complete' : 'In Progress'}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Styling and Theming

### CSS Custom Properties
Customize alert appearance:

```css
:root {
  --ui-alert-bg: #ffffff;
  --ui-alert-border: 1px solid #e5e7eb;
  --ui-alert-text: #374151;
  --ui-alert-title: #1f2937;
  --ui-alert-description: #6b7280;
  --ui-alert-transition: all 0.2s ease-in-out;
}
```

### Variant Customization
Override specific variant styles:

```css
ui-alert[variant="info"] {
  --ui-alert-bg: #eff6ff;
  --ui-alert-border: 1px solid #bfdbfe;
  --ui-alert-text: #1e40af;
}

ui-alert[variant="success"] {
  --ui-alert-bg: #f0fdf4;
  --ui-alert-border: 1px solid #bbf7d0;
  --ui-alert-text: #166534;
}

ui-alert[variant="warning"] {
  --ui-alert-bg: #fffbeb;
  --ui-alert-border: 1px solid #fed7aa;
  --ui-alert-text: #92400e;
}

ui-alert[variant="error"] {
  --ui-alert-bg: #fef2f2;
  --ui-alert-border: 1px solid #fecaca;
  --ui-alert-text: #991b1b;
}
```

### Size Customization
Adjust alert sizes:

```css
ui-alert[size="sm"] {
  --ui-alert-font-size: 12px;
  --ui-alert-padding: 8px 12px;
}

ui-alert[size="lg"] {
  --ui-alert-font-size: 16px;
  --ui-alert-padding: 16px 24px;
}
```

### Animation Customization
Customize alert animations:

```css
ui-alert {
  --ui-alert-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

ui-alert[open] {
  animation: alert-fade-in 0.3s ease-out;
}

@keyframes alert-fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Accessibility

### ARIA Attributes
Alert components include proper ARIA attributes:

- `role="alert"` for important alerts
- `role="status"` for informational alerts
- `aria-live="polite"` for non-intrusive updates
- `aria-atomic="true"` for complete message reading

### Screen Reader Support
- Message announcements
- Priority handling
- Context provision
- Dismissal feedback

### Visual Accessibility
- High contrast support
- Color independence
- Text scaling compatibility
- Focus indicators

## Best Practices

1. **Use appropriate variants**: Match alert type to message importance
2. **Provide clear messages**: Use concise, actionable text
3. **Handle dismissals**: Always provide close functionality when appropriate
4. **Test accessibility**: Ensure screen reader compatibility
5. **Use consistent styling**: Maintain visual consistency
6. **Consider timing**: Don't overwhelm users with too many alerts
7. **Provide context**: Include relevant information and actions

## Related Components

- [Toast](./toast) - Temporary notification messages
- [Dialog](./dialog) - Modal dialogs for important interactions
- [Notification](./notification) - Persistent notification system
- [Banner](./banner) - Site-wide announcements
