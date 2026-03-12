---
title: Toast
description: Toast component for managing toast notifications with customizable configuration, positioning, and event handling.
sidebar_label: Toast
---

# Toast

The `Toast` component provides toast notification management with support for custom configuration, positioning, theming, and event handling for enhanced user experience.

## Basic Usage

```tsx
import { Toast } from '@editora/ui-react';

function BasicToast() {
  const toastRef = useRef(null);

  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.show('This is a basic toast notification.');
    }
  };

  return (
    <>
      <button onClick={showToast}>Show Toast</button>
      
      <Toast ref={toastRef} />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `ToastPosition` | - | Default toast position |
| `maxVisible` | `number` | - | Maximum visible toasts |
| `theme` | `ToastTheme` | - | Default toast theme |
| `config` | `Partial<ToastConfig>` | - | Toast configuration options |
| `headless` | `boolean` | `false` | Remove default styling |
| `onShow` | `(detail: ToastShowDetail) => void` | - | Toast show event handler |
| `onHide` | `(detail: ToastHideDetail) => void` | - | Toast hide event handler |
| `children` | `React.ReactNode` | - | Toast content (optional) |

## Basic Configuration

### Simple Toast Management
Basic toast management with default settings.

```tsx
const toastRef = useRef(null);

<button onClick={() => {
  if (toastRef.current) {
    toastRef.current.show('Simple toast message');
  }
}}>Show Toast</button>

<Toast ref={toastRef} />
```

### Controlled Toast with Options
Toast with custom options and event handling.

```tsx
function ControlledToast() {
  const toastRef = useRef(null);

  const showToastWithOptions = () => {
    if (toastRef.current) {
      toastRef.current.show('Toast with options', {
        type: 'success',
        duration: 3000,
        onShow: () => console.log('Toast shown'),
        onHide: () => console.log('Toast hidden')
      });
    }
  };

  return (
    <>
      <button onClick={showToastWithOptions}>Show Toast with Options</button>
      
      <Toast 
        ref={toastRef}
        onShow={(detail) => console.log('Toast shown:', detail)}
        onHide={(detail) => console.log('Toast hidden:', detail)}
      />
    </>
  );
}
```

### Toast Configuration
Configure global toast settings.

```tsx
<Toast 
  position="top-right"
  maxVisible={5}
  theme="light"
  config={{
    position: 'top-right',
    maxVisible: 5,
    theme: 'light',
    duration: 4000
  }}
/>
```

### Headless Toast
Toast without default styling for custom implementations.

```tsx
<Toast 
  headless={true}
  onShow={(detail) => {
    // Custom toast implementation
    console.log('Custom toast:', detail);
  }}
/>
```

## Toast Management Methods

### Show Toast
Display a toast notification.

```tsx
const toastRef = useRef(null);

const showInfoToast = () => {
  if (toastRef.current) {
    const toastId = toastRef.current.show('Information message');
    console.log('Toast ID:', toastId);
  }
};

const showSuccessToast = () => {
  if (toastRef.current) {
    toastRef.current.show('Success message', {
      type: 'success',
      duration: 5000
    });
  }
};

const showErrorToast = () => {
  if (toastRef.current) {
    toastRef.current.show('Error message', {
      type: 'error',
      duration: 0 // Don't auto-hide
    });
  }
};
```

### Hide Toast
Hide a specific toast by ID.

```tsx
const toastRef = useRef(null);
const [toastId, setToastId] = useState(null);

const showToast = () => {
  if (toastRef.current) {
    const id = toastRef.current.show('Persistent toast');
    setToastId(id);
  }
};

const hideToast = () => {
  if (toastRef.current && toastId) {
    toastRef.current.hide(toastId);
    setToastId(null);
  }
};
```

### Clear All Toasts
Remove all visible toasts.

```tsx
const toastRef = useRef(null);

const clearAllToasts = () => {
  if (toastRef.current) {
    toastRef.current.clear();
  }
};
```

### Configure Toast Settings
Update toast configuration.

```tsx
const toastRef = useRef(null);

const updateConfig = () => {
  if (toastRef.current) {
    toastRef.current.configure({
      position: 'bottom-center',
      maxVisible: 3,
      theme: 'dark',
      duration: 6000
    });
  }
};
```

## Advanced Features

### Toast with Custom Options
Toast with comprehensive configuration options.

```tsx
function CustomToastExample() {
  const toastRef = useRef(null);

  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.show('Custom toast message', {
        type: 'info',
        duration: 4000,
        onShow: () => console.log('Toast shown'),
        onHide: () => console.log('Toast hidden'),
        level: 'info'
      });
    }
  };

  return (
    <>
      <button onClick={showToast}>Show Custom Toast</button>
      
      <Toast 
        ref={toastRef}
        onShow={(detail) => console.log('Global show:', detail)}
        onHide={(detail) => console.log('Global hide:', detail)}
      />
    </>
  );
}
```

### Multiple Toast Positions
Manage toasts in different positions.

```tsx
function MultiPositionToasts() {
  const topToastRef = useRef(null);
  const bottomToastRef = useRef(null);

  const showTopToast = () => {
    if (topToastRef.current) {
      topToastRef.current.show('Top toast message', {
        type: 'success'
      });
    }
  };

  const showBottomToast = () => {
    if (bottomToastRef.current) {
      bottomToastRef.current.show('Bottom toast message', {
        type: 'warning'
      });
    }
  };

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div>
        <button onClick={showTopToast}>Show Top Toast</button>
        <Toast ref={topToastRef} position="top-center" />
      </div>
      
      <div>
        <button onClick={showBottomToast}>Show Bottom Toast</button>
        <Toast ref={bottomToastRef} position="bottom-center" />
      </div>
    </div>
  );
}
```

### Toast Event Handling
Comprehensive event handling for toast lifecycle.

```tsx
function ToastEventHandling() {
  const toastRef = useRef(null);
  const [events, setEvents] = useState([]);

  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.show('Event toast message', {
        type: 'info',
        duration: 3000
      });
    }
  };

  const addEvent = (event) => {
    setEvents(prev => [...prev, event]);
  };

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div>
        <button onClick={showToast}>Show Toast</button>
        <Toast 
          ref={toastRef}
          onShow={(detail) => addEvent(`Show: ${detail.message} (ID: ${detail.id})`)}
          onHide={(detail) => addEvent(`Hide: Toast ${detail.id}`)}
        />
      </div>
      
      <div style={{
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Toast Events</div>
        <div style={{ display: 'grid', gap: '4px', fontSize: '12px' }}>
          {events.map((event, index) => (
            <div key={index} style={{ color: '#6b7280' }}>{event}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Advanced Examples

### Toast Manager System
Complete toast management system with different types and positions.

```tsx
function ToastManagerSystem() {
  const [toasts, setToasts] = useState([]);
  const toastRefs = useRef({});

  const showToast = (message, options = {}) => {
    const position = options.position || 'top-right';
    const type = options.type || 'info';
    
    if (!toastRefs.current[position]) {
      toastRefs.current[position] = React.createRef();
    }

    const toastRef = toastRefs.current[position];
    if (toastRef.current) {
      const id = toastRef.current.show(message, {
        type,
        duration: options.duration || 4000,
        ...options
      });

      setToasts(prev => [...prev, {
        id,
        message,
        type,
        position,
        timestamp: new Date()
      }]);
    }
  };

  const clearPosition = (position) => {
    if (toastRefs.current[position]?.current) {
      toastRefs.current[position].current.clear();
      setToasts(prev => prev.filter(t => t.position !== position));
    }
  };

  const clearAll = () => {
    Object.values(toastRefs.current).forEach(ref => {
      if (ref.current) {
        ref.current.clear();
      }
    });
    setToasts([]);
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Toast Manager System
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Complete toast management system with multiple positions and types.
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {/* Toast Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          <button onClick={() => showToast('Success message', { type: 'success' })}>
            Success Toast
          </button>
          <button onClick={() => showToast('Error message', { type: 'error' })}>
            Error Toast
          </button>
          <button onClick={() => showToast('Warning message', { type: 'warning' })}>
            Warning Toast
          </button>
          <button onClick={() => showToast('Info message', { type: 'info' })}>
            Info Toast
          </button>
        </div>
        
        {/* Position Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <button onClick={() => showToast('Top position', { position: 'top-center' })}>
            Top Position
          </button>
          <button onClick={() => showToast('Bottom position', { position: 'bottom-center' })}>
            Bottom Position
          </button>
          <button onClick={() => showToast('Center position', { position: 'center' })}>
            Center Position
          </button>
        </div>
        
        {/* Clear Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <button onClick={() => clearPosition('top-center')}>
            Clear Top
          </button>
          <button onClick={() => clearPosition('bottom-center')}>
            Clear Bottom
          </button>
          <button onClick={clearAll}>
            Clear All
          </button>
        </div>
        
        {/* Toast References */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <Toast ref={(ref) => toastRefs.current['top-center'] = ref} position="top-center" />
          <Toast ref={(ref) => toastRefs.current['bottom-center'] = ref} position="bottom-center" />
          <Toast ref={(ref) => toastRefs.current['center'] = ref} position="center" />
        </div>
      </div>
      
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Toast Summary
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Total Toasts: {toasts.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Success: {toasts.filter(t => t.type === 'success').length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Errors: {toasts.filter(t => t.type === 'error').length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Warnings: {toasts.filter(t => t.type === 'warning').length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Info: {toasts.filter(t => t.type === 'info').length}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Toast Configuration Manager
System for managing toast configurations and themes.

```tsx
function ToastConfigurationManager() {
  const [config, setConfig] = useState({
    position: 'top-right',
    maxVisible: 3,
    theme: 'light',
    duration: 4000
  });

  const toastRef = useRef(null);

  const updateConfig = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    if (toastRef.current) {
      toastRef.current.configure(newConfig);
    }
  };

  const showToast = (message, options = {}) => {
    if (toastRef.current) {
      toastRef.current.show(message, {
        duration: config.duration,
        ...options
      });
    }
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Toast Configuration Manager
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          System for managing toast configurations and themes.
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {/* Configuration Controls */}
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#374151' }}>
            Configuration
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                Position
              </label>
              <select
                value={config.position}
                onChange={(e) => updateConfig({ position: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                Max Visible
              </label>
              <input
                type="number"
                value={config.maxVisible}
                onChange={(e) => updateConfig({ maxVisible: parseInt(e.target.value) })}
                min="1"
                max="10"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                Theme
              </label>
              <select
                value={config.theme}
                onChange={(e) => updateConfig({ theme: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                Duration (ms)
              </label>
              <input
                type="number"
                value={config.duration}
                onChange={(e) => updateConfig({ duration: parseInt(e.target.value) })}
                min="1000"
                max="10000"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Toast Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          <button onClick={() => showToast('Configuration test', { type: 'info' })}>
            Test Info
          </button>
          <button onClick={() => showToast('Configuration success', { type: 'success' })}>
            Test Success
          </button>
          <button onClick={() => showToast('Configuration warning', { type: 'warning' })}>
            Test Warning
          </button>
          <button onClick={() => showToast('Configuration error', { type: 'error' })}>
            Test Error
          </button>
        </div>
        
        <Toast ref={toastRef} />
      </div>
      
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Current Configuration
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Position: {config.position}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Max Visible: {config.maxVisible}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Theme: {config.theme}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Duration: {config.duration}ms
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Toast Analytics System
System for tracking and analyzing toast usage.

```tsx
function ToastAnalyticsSystem() {
  const [analytics, setAnalytics] = useState({
    totalShown: 0,
    totalHidden: 0,
    byType: {},
    byPosition: {},
    averageDuration: 0
  });

  const toastRef = useRef(null);
  const startTimeRef = useRef({});

  const showToast = (message, options = {}) => {
    if (toastRef.current) {
      const id = toastRef.current.show(message, options);
      startTimeRef.current[id] = Date.now();
      
      setAnalytics(prev => ({
        ...prev,
        totalShown: prev.totalShown + 1,
        byType: {
          ...prev.byType,
          [options.type || 'info']: (prev.byType[options.type || 'info'] || 0) + 1
        },
        byPosition: {
          ...prev.byPosition,
          [options.position || 'default']: (prev.byPosition[options.position || 'default'] || 0) + 1
        }
      }));
    }
  };

  const handleShow = (detail) => {
    console.log('Toast shown:', detail);
  };

  const handleHide = (detail) => {
    const startTime = startTimeRef.current[detail.id];
    if (startTime) {
      const duration = Date.now() - startTime;
      delete startTimeRef.current[detail.id];
      
      setAnalytics(prev => {
        const newTotalHidden = prev.totalHidden + 1;
        const newAverageDuration = (prev.averageDuration * prev.totalHidden + duration) / newTotalHidden;
        
        return {
          ...prev,
          totalHidden: newTotalHidden,
          averageDuration: newAverageDuration
        };
      });
    }
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Toast Analytics System
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          System for tracking and analyzing toast usage patterns.
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {/* Toast Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          <button onClick={() => showToast('Analytics info', { type: 'info' })}>
            Info Toast
          </button>
          <button onClick={() => showToast('Analytics success', { type: 'success' })}>
            Success Toast
          </button>
          <button onClick={() => showToast('Analytics warning', { type: 'warning' })}>
            Warning Toast
          </button>
          <button onClick={() => showToast('Analytics error', { type: 'error' })}>
            Error Toast
          </button>
        </div>
        
        <Toast 
          ref={toastRef}
          onShow={handleShow}
          onHide={handleHide}
        />
      </div>
      
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Toast Analytics
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Total Shown: {analytics.totalShown}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Total Hidden: {analytics.totalHidden}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Average Duration: {Math.round(analytics.averageDuration)}ms
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • By Type: {Object.entries(analytics.byType).map(([type, count]) => `${type}: ${count}`).join(', ')}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • By Position: {Object.entries(analytics.byPosition).map(([pos, count]) => `${pos}: ${count}`).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Styling and Theming

### CSS Custom Properties
Customize toast appearance:

```css
:root {
  --ui-toast-bg: #ffffff;
  --ui-toast-border: 1px solid #e5e7eb;
  --ui-toast-text: #374151;
  --ui-toast-title: #1f2937;
  --ui-toast-description: #6b7280;
  --ui-toast-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --ui-toast-radius: 8px;
  --ui-toast-transition: all 0.3s ease-in-out;
}
```

### Theme Customization
Override specific theme styles:

```css
ui-toast[theme="dark"] {
  --ui-toast-bg: #1f2937;
  --ui-toast-border: 1px solid #374151;
  --ui-toast-text: #f9fafb;
  --ui-toast-title: #ffffff;
  --ui-toast-description: #d1d5db;
}

ui-toast[theme="light"] {
  --ui-toast-bg: #ffffff;
  --ui-toast-border: 1px solid #e5e7eb;
  --ui-toast-text: #374151;
  --ui-toast-title: #1f2937;
  --ui-toast-description: #6b7280;
}
```

### Position Customization
Adjust toast positions:

```css
ui-toast[position="top-left"] {
  top: 16px;
  left: 16px;
}

ui-toast[position="top-center"] {
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
}

ui-toast[position="top-right"] {
  top: 16px;
  right: 16px;
}

ui-toast[position="bottom-left"] {
  bottom: 16px;
  left: 16px;
}

ui-toast[position="bottom-center"] {
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
}

ui-toast[position="bottom-right"] {
  bottom: 16px;
  right: 16px;
}
```

### Animation Customization
Customize toast animations:

```css
ui-toast {
  --ui-toast-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

ui-toast[open] {
  animation: toast-slide-in 0.3s ease-out;
}

ui-toast[closed] {
  animation: toast-slide-out 0.3s ease-in;
}

@keyframes toast-slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-slide-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
}
```

## Accessibility

### ARIA Attributes
Toast components include proper ARIA attributes:

- `role="status"` for informational toasts
- `role="alert"` for important toasts
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

1. **Use appropriate configuration**: Match toast settings to your application needs
2. **Handle events properly**: Implement proper event handling for toast lifecycle
3. **Manage toast limits**: Set appropriate maxVisible to prevent overflow
4. **Test accessibility**: Ensure screen reader compatibility
5. **Use consistent styling**: Maintain visual consistency
6. **Consider positioning**: Choose positions that don't obstruct content
7. **Monitor usage**: Track toast usage for optimization
8. **Provide escape routes**: Always provide ways to dismiss toasts

## Related Components

- [Alert](./alert) - Persistent alert messages
- [Notification](./notification) - Persistent notification system
- [Banner](./banner) - Site-wide announcements
- [Snackbar](./snackbar) - Material Design style notifications