---
title: Badge
description: Badge component for displaying status indicators, labels, and notifications with customizable appearance and positioning.
sidebar_label: Badge
---

# Badge

The `Badge` component provides status indicators and labels with support for custom styling, positioning, and various visual styles for enhanced user experience and information display.

## Basic Usage

```tsx
import { Badge } from '@editora/ui-react';

function BasicBadge() {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge text="New" />
      <Badge text="Active" tone="success" />
      <Badge text="Pending" tone="warning" />
      <Badge text="Error" tone="danger" />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | - | Badge text content |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'purple'` | - | Badge tone |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'ghost'` | - | Badge variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '1' \| '2' \| '3'` | `'md'` | Badge size |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'large' \| 'full' \| string` | - | Badge border radius |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | Badge state |
| `pill` | `boolean` | `false` | Pill-shaped badge |
| `dot` | `boolean` | `false` | Dot indicator badge |
| `interactive` | `boolean` | `false` | Interactive badge |
| `truncate` | `boolean` | `false` | Truncate long text |
| `maxWidth` | `string` | - | Maximum width |
| `removable` | `boolean` | `false` | Show remove button |
| `autoRemove` | `boolean` | `false` | Auto-remove on click |
| `iconOnly` | `boolean` | `false` | Icon-only badge |
| `disabled` | `boolean` | `false` | Disabled state |
| `onRemove` | `(detail: BadgeRemoveDetail) => void` | - | Remove handler |
| `children` | `React.ReactNode` | - | Badge content |

## Basic Configuration

### Simple Badge
Basic badge with default styling.

```tsx
<Badge text="New Feature" />
```

### Badge with Tone
Badge with specific tone.

```tsx
<Badge text="Active" tone="success" />
```

### Badge with Variant
Badge with specific variant.

```tsx
<Badge text="Important" variant="outline" />
```

### Badge with Size
Badge with specific size.

```tsx
<Badge text="Small" size="sm" />
```

### Dot Badge
Simple dot indicator.

```tsx
<Badge dot tone="success" />
```

### Pill Badge
Pill-shaped badge.

```tsx
<Badge text="Pill" pill />
```

## Badge Tones

### Neutral Tone
Default neutral tone.

```tsx
<Badge text="Neutral" tone="neutral" />
```

### Info Tone
Blue information tone.

```tsx
<Badge text="Info" tone="info" />
```

### Success Tone
Green success tone.

```tsx
<Badge text="Success" tone="success" />
```

### Warning Tone
Orange warning tone.

```tsx
<Badge text="Warning" tone="warning" />
```

### Danger Tone
Red danger tone.

```tsx
<Badge text="Danger" tone="danger" />
```

### Purple Tone
Purple accent tone.

```tsx
<Badge text="Purple" tone="purple" />
```

## Badge Variants

### Solid Variant
Solid colored badge.

```tsx
<Badge text="Solid" variant="solid" />
```

### Soft Variant
Soft colored badge.

```tsx
<Badge text="Soft" variant="soft" />
```

### Outline Variant
Outlined badge.

```tsx
<Badge text="Outline" variant="outline" />
```

### Ghost Variant
Ghost styled badge.

```tsx
<Badge text="Ghost" variant="ghost" />
```

## Badge Sizes

### Extra Small
Compact badge size.

```tsx
<Badge text="XS" size="xs" />
```

### Small Size
Small badge size.

```tsx
<Badge text="Small" size="sm" />
```

### Medium Size
Default badge size.

```tsx
<Badge text="Medium" size="md" />
```

### Large Size
Large badge size.

```tsx
<Badge text="Large" size="lg" />
```

### Extra Large
Extra large badge size.

```tsx
<Badge text="XL" size="xl" />
```

## Advanced Features

### Status Indicators
Badge for status display.

```tsx
function StatusBadges() {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge text="Online" tone="success" size="sm" />
      <Badge text="Away" tone="warning" size="sm" />
      <Badge text="Offline" tone="danger" size="sm" />
      <Badge text="Busy" tone="info" size="sm" />
    </div>
  );
}
```

### Interactive Badges
Interactive badge with click handling.

```tsx
function InteractiveBadges() {
  const handleClick = (text: string) => {
    console.log(`Badge clicked: ${text}`);
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge 
        text="Click me" 
        interactive 
        onClick={() => handleClick('Click me')}
      />
      <Badge 
        text="Interactive" 
        tone="info" 
        interactive 
        onClick={() => handleClick('Interactive')}
      />
    </div>
  );
}
```

### Removable Badges
Badge with remove functionality.

```tsx
function RemovableBadges() {
  const [badges, setBadges] = useState(['Tag 1', 'Tag 2', 'Tag 3']);

  const handleRemove = (detail: BadgeRemoveDetail) => {
    setBadges(prev => prev.filter(badge => badge !== detail.text));
  };

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {badges.map((badge, index) => (
        <Badge
          key={index}
          text={badge}
          removable
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}
```

### Auto-removable Badges
Badge that auto-removes on click.

```tsx
function AutoRemovableBadges() {
  const [badges, setBadges] = useState(['Auto 1', 'Auto 2', 'Auto 3']);

  const handleRemove = (detail: BadgeRemoveDetail) => {
    setBadges(prev => prev.filter(badge => badge !== detail.text));
  };

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {badges.map((badge, index) => (
        <Badge
          key={index}
          text={badge}
          autoRemove
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}
```

### Truncated Badges
Badge with text truncation.

```tsx
function TruncatedBadges() {
  return (
    <div style={{ display: 'grid', gap: '8px', width: '200px' }}>
      <Badge 
        text="This is a very long text that will be truncated" 
        truncate 
        maxWidth="150px"
      />
      <Badge 
        text="Another long text example for truncation" 
        truncate 
        maxWidth="120px"
      />
    </div>
  );
}
```

## Advanced Examples

### Dashboard Status Panel
Complete dashboard status panel with multiple badge types.

```tsx
function DashboardStatusPanel() {
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Dashboard Status Panel
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Complete dashboard status panel with multiple badge types for system monitoring and status display.
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {/* System Status */}
        <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: '0', fontSize: '14px', color: '#374151' }}>System Status</h3>
            <Badge text="All Systems Operational" tone="success" size="sm" />
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Database</span>
              <Badge text="Online" tone="success" size="sm" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>API Server</span>
              <Badge text="Online" tone="success" size="sm" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Cache</span>
              <Badge text="Degraded" tone="warning" size="sm" />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: '0', fontSize: '14px', color: '#374151' }}>Active Users</h3>
            <Badge text="1,247" tone="info" size="sm" />
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Web Users</span>
              <Badge text="856" tone="success" size="sm" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Mobile Users</span>
              <Badge text="391" tone="info" size="sm" />
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: '0', fontSize: '14px', color: '#374151' }}>System Alerts</h3>
            <Badge text="3" tone="warning" size="sm" />
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: '#fffbeb', borderRadius: '4px' }}>
              <Badge dot tone="warning" />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>High memory usage</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: '#fffbeb', borderRadius: '4px' }}>
              <Badge dot tone="warning" />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Disk space low</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: '#fffbeb', borderRadius: '4px' }}>
              <Badge dot tone="error" />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>API timeout</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: '0', fontSize: '14px', color: '#374151' }}>Performance</h3>
            <Badge text="Optimal" tone="success" size="sm" />
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Response Time</span>
              <Badge text="120ms" tone="success" size="sm" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Uptime</span>
              <Badge text="99.9%" tone="success" size="sm" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Error Rate</span>
              <Badge text="0.1%" tone="success" size="sm" />
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
          Dashboard Status Panel Summary
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Badge Types: Status indicators, counts, dots, overlays
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Tones: Success, Warning, Error, Info, Neutral, Purple
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Variants: Solid, Soft, Outline, Ghost
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Sizes: XS, SM, MD, LG, XL, 1, 2, 3
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Tag Management System
Tag management interface with removable and interactive badges.

```tsx
function TagManagementSystem() {
  const [tags, setTags] = useState(['JavaScript', 'React', 'TypeScript', 'Node.js']);
  const [inputValue, setInputValue] = useState('');

  const handleRemove = (detail: BadgeRemoveDetail) => {
    setTags(prev => prev.filter(tag => tag !== detail.text));
  };

  const handleAddTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags(prev => [...prev, newTag]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
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
          Tag Management System
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Tag management interface with removable and interactive badges for categorization and filtering.
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {/* Tag Input */}
        <div style={{
          padding: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>Add New Tag</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter tag name"
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}
            />
            <button
              onClick={handleAddTag}
              disabled={!inputValue.trim()}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: inputValue.trim() ? '#3b82f6' : '#9ca3af',
                color: 'white',
                fontWeight: 'bold',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* Tag Display */}
        <div style={{
          padding: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>Current Tags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map((tag, index) => (
              <Badge
                key={index}
                text={tag}
                tone={index % 2 === 0 ? 'info' : 'success'}
                removable
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

        {/* Tag Categories */}
        <div style={{
          padding: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>Tag Categories</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Frontend</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <Badge text="React" tone="info" size="sm" />
                <Badge text="Vue" tone="info" size="sm" />
                <Badge text="Angular" tone="info" size="sm" />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Backend</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <Badge text="Node.js" tone="success" size="sm" />
                <Badge text="Python" tone="success" size="sm" />
                <Badge text="Java" tone="success" size="sm" />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Database</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <Badge text="PostgreSQL" tone="warning" size="sm" />
                <Badge text="MongoDB" tone="warning" size="sm" />
                <Badge text="Redis" tone="warning" size="sm" />
              </div>
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
          Tag Management Summary
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Total Tags: {tags.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Categories: Frontend, Backend, Database
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Features: Add, Remove, Interactive, Categorized
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Tones: Info, Success, Warning
          </div>
        </div>
      </div>
    </div>
  );
}
```

### User Role Management
User role management with different badge styles.

```tsx
function UserRoleManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', role: 'admin', status: 'active' },
    { id: 2, name: 'Jane Smith', role: 'editor', status: 'active' },
    { id: 3, name: 'Bob Johnson', role: 'viewer', status: 'inactive' },
    { id: 4, name: 'Alice Brown', role: 'moderator', status: 'pending' }
  ]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge text="Admin" tone="danger" variant="solid" />;
      case 'editor':
        return <Badge text="Editor" tone="info" variant="soft" />;
      case 'moderator':
        return <Badge text="Moderator" tone="warning" variant="outline" />;
      case 'viewer':
        return <Badge text="Viewer" tone="neutral" variant="ghost" />;
      default:
        return <Badge text="Unknown" tone="neutral" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge text="Active" tone="success" dot />;
      case 'inactive':
        return <Badge text="Inactive" tone="danger" dot />;
      case 'pending':
        return <Badge text="Pending" tone="warning" dot />;
      default:
        return <Badge text="Unknown" tone="neutral" dot />;
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
          User Role Management
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          User role management with different badge styles for role classification and status indicators.
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{
          padding: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>User List</div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {users.map((user) => (
              <div key={user.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#374151' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>User ID: {user.id}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Legend */}
        <div style={{
          padding: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>Role Legend</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge text="Admin" tone="danger" variant="solid" />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Full system access</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge text="Editor" tone="info" variant="soft" />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Content editing rights</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge text="Moderator" tone="warning" variant="outline" />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Content moderation</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge text="Viewer" tone="neutral" variant="ghost" />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Read-only access</span>
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div style={{
          padding: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>Status Legend</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge text="Active" tone="success" dot />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Active user</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge text="Inactive" tone="danger" dot />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Inactive user</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge text="Pending" tone="warning" dot />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Pending approval</span>
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
          User Role Management Summary
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Total Users: {users.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Roles: Admin, Editor, Moderator, Viewer
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Statuses: Active, Inactive, Pending
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Variants: Solid, Soft, Outline, Ghost
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Notification System
Notification system with different badge states and interactions.

```tsx
function NotificationSystem() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'Welcome', message: 'Welcome to your dashboard', read: false },
    { id: 2, type: 'success', title: 'Update Complete', message: 'System update completed successfully', read: true },
    { id: 3, type: 'warning', title: 'Low Storage', message: 'Your storage is running low', read: false },
    { id: 4, type: 'error', title: 'Connection Lost', message: 'Unable to connect to server', read: false }
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
          Notification System
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Notification system with different badge states and interactions for user feedback and alerts.
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {unreadCount > 0 && (
          <div style={{
            padding: '12px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Unread Notifications</div>
            <Badge text={`You have ${unreadCount} unread notification(s)`} tone="info" />
          </div>
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
              <div key={notification.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: notification.read ? '#f9fafb' : '#fffbeb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#374151' }}>{notification.title}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{notification.message}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Badge text={notification.type.toUpperCase()} tone={notification.type as any} size="sm" />
                  {!notification.read && (
                    <Badge text="NEW" tone="danger" size="sm" />
                  )}
                  <Badge 
                    text="Mark Read" 
                    interactive 
                    onClick={() => markAsRead(notification.id)}
                    tone="success"
                    size="sm"
                  />
                  <Badge 
                    text="Delete" 
                    interactive 
                    onClick={() => deleteNotification(notification.id)}
                    tone="danger"
                    size="sm"
                  />
                </div>
              </div>
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
          Notification System Summary
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
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Types: Info, Success, Warning, Error
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Styling and Theming

### CSS Custom Properties
Customize badge appearance:

```css
:root {
  --ui-badge-bg: #ffffff;
  --ui-badge-text: #374151;
  --ui-badge-border: 1px solid #e5e7eb;
  --ui-badge-radius: 9999px;
  --ui-badge-padding: 4px 8px;
  --ui-badge-font-size: 12px;
  --ui-badge-dot-size: 8px;
}
```

### Variant Customization
Override specific variant styles:

```css
ui-badge[variant="success"] {
  --ui-badge-bg: #dcfce7;
  --ui-badge-text: #166534;
  --ui-badge-border: 1px solid #bbf7d0;
}

ui-badge[variant="warning"] {
  --ui-badge-bg: #fffbeb;
  --ui-badge-text: #92400e;
  --ui-badge-border: 1px solid #fed7aa;
}

ui-badge[variant="error"] {
  --ui-badge-bg: #fee2e2;
  --ui-badge-text: #991b1b;
  --ui-badge-border: 1px solid #fecaca;
}

ui-badge[variant="info"] {
  --ui-badge-bg: #e0f2fe;
  --ui-badge-text: #0c4a6e;
  --ui-badge-border: 1px solid #b3e5fc;
}
```

### Size Customization
Customize badge sizes:

```css
ui-badge[size="sm"] {
  --ui-badge-padding: 2px 6px;
  --ui-badge-font-size: 10px;
  --ui-badge-dot-size: 6px;
}

ui-badge[size="md"] {
  --ui-badge-padding: 4px 8px;
  --ui-badge-font-size: 12px;
  --ui-badge-dot-size: 8px;
}

ui-badge[size="lg"] {
  --ui-badge-padding: 6px 12px;
  --ui-badge-font-size: 14px;
  --ui-badge-dot-size: 10px;
}
```

### Theme Customization
Switch between light and dark themes:

```css
ui-badge[theme="dark"] {
  --ui-badge-bg: #1f2937;
  --ui-badge-text: #f9fafb;
  --ui-badge-border: 1px solid #374151;
}

ui-badge[theme="light"] {
  --ui-badge-bg: #ffffff;
  --ui-badge-text: #374151;
  --ui-badge-border: 1px solid #e5e7eb;
}
```

### Animation Customization
Customize badge animations:

```css
ui-badge {
  --ui-badge-transition: all 0.2s ease-in-out;
}

ui-badge:hover {
  animation: badge-hover 0.2s ease-out;
  transform: scale(1.05);
}

ui-badge[dot]:hover {
  animation: dot-pulse 1s ease-in-out infinite;
}

@keyframes badge-hover {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}

@keyframes dot-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

## Accessibility

### ARIA Attributes
Badge components include proper ARIA attributes:

- `role="status"` for status indicators
- `aria-label` for descriptive labels
- `aria-live="polite"` for dynamic content updates
- `aria-hidden="true"` for decorative elements

### Screen Reader Support
- Status announcements
- Count descriptions
- Variant descriptions
- Position information

### Keyboard Navigation
- Focus management for interactive badges
- Proper tab order
- Screen reader compatibility

## Best Practices

1. **Use appropriate variants**: Choose variants that match the context
2. **Limit badge count**: Avoid overcrowding with too many badges
3. **Provide context**: Ensure badges have clear meaning
4. **Consider accessibility**: Ensure screen reader compatibility
5. **Use consistent styling**: Maintain design consistency
6. **Test responsive behavior**: Ensure badges work on all devices

## Related Components

- [Tag](./tag) - Tag component for categorization
- [Chip](./chip) - Chip component for selections
- [Label](./label) - Label component for form fields
- [Status](./status) - Status indicator component