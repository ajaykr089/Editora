---
title: AppHeader
description: AppHeader component for creating responsive application headers with navigation, branding, and user controls.
sidebar_label: AppHeader
---

# AppHeader

The `AppHeader` component provides a responsive application header with support for navigation, branding, user controls, and various layout configurations. It includes built-in accessibility features and responsive design patterns.

## Basic Usage

```tsx
import { AppHeader } from '@editora/ui-react';

function BasicAppHeader() {
  return (
    <AppHeader>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '18px' }}>My App</h1>
        <nav style={{ display: 'flex', gap: '16px' }}>
          <a href="/dashboard" style={{ color: '#374151', textDecoration: 'none' }}>Dashboard</a>
          <a href="/settings" style={{ color: '#374151', textDecoration: 'none' }}>Settings</a>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
          Profile
        </button>
      </div>
    </AppHeader>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sticky` | `boolean` | `false` | Make header sticky to top |
| `bordered` | `boolean` | `false` | Add bottom border |
| `dense` | `boolean` | `false` | Compact header variant |
| `showMenuButton` | `boolean` | `false` | Show mobile menu button |
| `onMenuTrigger` | `() => void` | - | Menu button click handler |
| `children` | `React.ReactNode` | - | Header content |
| `className` | `string` | - | Custom CSS class |
| `style` | `React.CSSProperties` | - | Inline styles |

## Basic Configuration

### Simple Header
Basic application header with minimal configuration.

```tsx
function SimpleHeader() {
  return (
    <AppHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>My Application</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="/help" style={{ color: '#6b7280', textDecoration: 'none' }}>Help</a>
          <a href="/support" style={{ color: '#6b7280', textDecoration: 'none' }}>Support</a>
        </div>
      </div>
    </AppHeader>
  );
}
```

### Sticky Header
Header that stays fixed at the top of the viewport.

```tsx
function StickyHeader() {
  return (
    <AppHeader sticky bordered>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>My App</h1>
          <nav style={{ display: 'flex', gap: '16px' }}>
            <a href="/dashboard" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>Dashboard</a>
            <a href="/projects" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>Projects</a>
            <a href="/analytics" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>Analytics</a>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
            Notifications
          </button>
          <button style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none' }}>
            New Project
          </button>
        </div>
      </div>
    </AppHeader>
  );
}
```

### Dense Header
Compact header variant for space-constrained layouts.

```tsx
function DenseHeader() {
  return (
    <AppHeader dense bordered>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>App</h2>
          <nav style={{ display: 'flex', gap: '12px' }}>
            <a href="/home" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Home</a>
            <a href="/docs" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Docs</a>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '12px' }}>
            Login
          </button>
        </div>
      </div>
    </AppHeader>
  );
}
```

### Header with Menu Button
Header with mobile menu button for responsive navigation.

```tsx
function HeaderWithMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    console.log('Menu button clicked');
  };

  return (
    <>
      <AppHeader showMenuButton onMenuTrigger={handleMenuToggle} bordered>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>My App</h1>
            <nav style={{ display: 'flex', gap: '16px' }}>
              <a href="/dashboard" style={{ color: '#374151', textDecoration: 'none' }}>Dashboard</a>
              <a href="/settings" style={{ color: '#374151', textDecoration: 'none' }}>Settings</a>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              Profile
            </button>
          </div>
        </div>
      </AppHeader>
      
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: '0',
          right: '0',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          padding: '16px',
          zIndex: 1000
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="/dashboard" style={{ color: '#374151', textDecoration: 'none', padding: '8px' }}>Dashboard</a>
            <a href="/settings" style={{ color: '#374151', textDecoration: 'none', padding: '8px' }}>Settings</a>
            <a href="/help" style={{ color: '#374151', textDecoration: 'none', padding: '8px' }}>Help</a>
          </nav>
        </div>
      )}
    </>
  );
}
```

## Advanced Features

### Responsive Header
Header that adapts to different screen sizes.

```tsx
function ResponsiveHeader() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>
      <AppHeader showMenuButton={isMobile} onMenuTrigger={() => setMobileMenuOpen(!mobileMenuOpen)} bordered>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>My App</h1>
            {!isMobile && (
              <nav style={{ display: 'flex', gap: '16px' }}>
                <a href="/dashboard" style={{ color: '#374151', textDecoration: 'none' }}>Dashboard</a>
                <a href="/projects" style={{ color: '#374151', textDecoration: 'none' }}>Projects</a>
                <a href="/analytics" style={{ color: '#374151', textDecoration: 'none' }}>Analytics</a>
              </nav>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              Search
            </button>
            <button style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none' }}>
              New
            </button>
          </div>
        </div>
      </AppHeader>
      
      {isMobile && mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: '0',
          right: '0',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          padding: '16px',
          zIndex: 1000
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="/dashboard" style={{ color: '#374151', textDecoration: 'none', padding: '8px' }}>Dashboard</a>
            <a href="/projects" style={{ color: '#374151', textDecoration: 'none', padding: '8px' }}>Projects</a>
            <a href="/analytics" style={{ color: '#374151', textDecoration: 'none', padding: '8px' }}>Analytics</a>
          </nav>
        </div>
      )}
    </>
  );
}
```

### Header with Search
Header containing a search input field.

```tsx
function HeaderWithSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <AppHeader bordered>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>My App</h1>
          <nav style={{ display: 'flex', gap: '16px' }}>
            <a href="/dashboard" style={{ color: '#374151', textDecoration: 'none' }}>Dashboard</a>
            <a href="/settings" style={{ color: '#374151', textDecoration: 'none' }}>Settings</a>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                minWidth: '200px'
              }}
            />
            <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none' }}>
              Search
            </button>
          </form>
          <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            Profile
          </button>
        </div>
      </div>
    </AppHeader>
  );
}
```

### Header with Notifications
Header with notification system.

```tsx
function HeaderWithNotifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New message from John', read: false },
    { id: 2, message: 'Project update available', read: true },
    { id: 3, message: 'Meeting reminder', read: false }
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <AppHeader bordered>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>My App</h1>
            <nav style={{ display: 'flex', gap: '16px' }}>
              <a href="/dashboard" style={{ color: '#374151', textDecoration: 'none' }}>Dashboard</a>
              <a href="/projects" style={{ color: '#374151', textDecoration: 'none' }}>Projects</a>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              style={{
                position: 'relative',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                backgroundColor: notificationsOpen ? '#f3f4f6' : 'white'
              }}
            >
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
            <button style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none' }}>
              New Project
            </button>
          </div>
        </div>
      </AppHeader>
      
      {notificationsOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          right: '20px',
          width: '300px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          <div style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold' }}>
            Notifications ({unreadCount} unread)
          </div>
          <div style={{ padding: '8px' }}>
            {notifications.map(notification => (
              <div
                key={notification.id}
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: notification.read ? 'transparent' : '#f8fafc'
                }}
              >
                <div style={{ fontSize: '14px' }}>{notification.message}</div>
                {!notification.read && (
                  <button
                    onClick={() => {
                      setNotifications(prev => prev.map(n =>
                        n.id === notification.id ? { ...n, read: true } : n
                      ));
                    }}
                    style={{
                      marginTop: '4px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb',
                      fontSize: '12px'
                    }}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
```

## Advanced Examples

### Enterprise Dashboard Header
Complete enterprise application header with multiple features.

```tsx
function EnterpriseDashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifications = [
    { id: 1, message: 'System update scheduled for tonight', type: 'info' },
    { id: 2, message: 'Security alert: Unusual login attempt', type: 'warning' },
    { id: 3, message: 'New team member joined', type: 'success' }
  ];

  return (
    <>
      <AppHeader sticky bordered>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {/* Left section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>Enterprise Dashboard</h1>
              <nav style={{ display: 'flex', gap: '8px' }}>
                <a href="/dashboard" style={{ color: '#374151', textDecoration: 'none', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#f3f4f6' }}>Dashboard</a>
                <a href="/analytics" style={{ color: '#6b7280', textDecoration: 'none', padding: '8px 12px' }}>Analytics</a>
                <a href="/reports" style={{ color: '#6b7280', textDecoration: 'none', padding: '8px 12px' }}>Reports</a>
                <a href="/settings" style={{ color: '#6b7280', textDecoration: 'none', padding: '8px 12px' }}>Settings</a>
              </nav>
            </div>
          </div>

          {/* Center section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              <span style={{ fontSize: '16px' }}>🔍</span>
              <input
                type="text"
                placeholder="Search across all projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  minWidth: '300px'
                }}
              />
            </div>
            <button style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none' }}>
              + New Project
            </button>
          </div>

          {/* Right section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              style={{
                position: 'relative',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white'
              }}
            >
              <span style={{ fontSize: '18px' }}>🔔</span>
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px'
              }}>
                {notifications.length}
              </span>
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>John Doe</span>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white'
                }}
              >
                <span style={{ fontSize: '16px' }}>👤</span>
              </button>
            </div>
          </div>
        </div>
      </AppHeader>

      {/* Notifications dropdown */}
      {notificationsOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          right: '20px',
          width: '350px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          <div style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold' }}>
            Notifications
          </div>
          <div>
            {notifications.map(notification => (
              <div key={notification.id} style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px' }}>
                    {notification.type === 'info' ? 'ℹ️' : notification.type === 'warning' ? '⚠️' : '✅'}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{notification.message}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>2 minutes ago</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '8px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <a href="/notifications" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '12px' }}>
              View all notifications
            </a>
          </div>
        </div>
      )}

      {/* User menu dropdown */}
      {userMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          right: '120px',
          width: '200px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <div style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontWeight: 'bold' }}>John Doe</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>john@example.com</div>
          </div>
          <div style={{ padding: '8px' }}>
            <div style={{ padding: '8px', cursor: 'pointer', borderRadius: '4px' }}>Profile Settings</div>
            <div style={{ padding: '8px', cursor: 'pointer', borderRadius: '4px' }}>Account Settings</div>
            <div style={{ padding: '8px', cursor: 'pointer', borderRadius: '4px' }}>Help & Support</div>
            <div style={{ padding: '8px', cursor: 'pointer', borderRadius: '4px', color: '#ef4444' }}>Sign Out</div>
          </div>
        </div>
      )}
    </>
  );
}
```

### E-commerce Store Header
Header designed for an e-commerce application.

```tsx
function EcommerceStoreHeader() {
  const [cartItems, setCartItems] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppHeader sticky bordered>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Logo and main navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>ShopEasy</h1>
          <nav style={{ display: 'flex', gap: '16px' }}>
            <a href="/shop" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>Shop</a>
            <a href="/categories" style={{ color: '#6b7280', textDecoration: 'none' }}>Categories</a>
            <a href="/deals" style={{ color: '#6b7280', textDecoration: 'none' }}>Deals</a>
            <a href="/about" style={{ color: '#6b7280', textDecoration: 'none' }}>About</a>
          </nav>
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', minWidth: '400px' }}>
          <span style={{ fontSize: '16px', color: '#9ca3af' }}>🔍</span>
          <input
            type="text"
            placeholder="Search products, brands, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontSize: '14px'
            }}
          />
          <button style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontSize: '12px' }}>
            Search
          </button>
        </div>

        {/* User actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>❤️</span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Wishlist</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            <span style={{ fontSize: '16px' }}>🛒</span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Cart</span>
            {cartItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-10px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {cartItems}
              </span>
            )}
          </div>
          <button style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#10b981', color: 'white', border: 'none', fontWeight: 'bold' }}>
            Sign In
          </button>
        </div>
      </div>
    </AppHeader>
  );
}
```

### Admin Panel Header
Header for administrative interfaces.

```tsx
function AdminPanelHeader() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AppHeader sticky bordered>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Brand and toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              backgroundColor: 'white'
            }}
          >
            <span style={{ fontSize: '18px' }}>☰</span>
          </button>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
            Admin Panel
          </h1>
          {!isCollapsed && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                Super Admin
              </span>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: 'white', fontSize: '12px' }}>
              📊 Analytics
            </button>
            <button style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: 'white', fontSize: '12px' }}>
              📈 Reports
            </button>
            <button style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontSize: '12px' }}>
              + Add User
            </button>
          </div>
        </div>

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>admin@company.com</span>
            <span style={{ fontSize: '16px' }}>👤</span>
          </div>
        </div>
      </div>
    </AppHeader>
  );
}
```

## Styling and Theming

### CSS Custom Properties
Customize header appearance using CSS custom properties:

```css
:root {
  --ui-header-bg: #ffffff;
  --ui-header-border: #e5e7eb;
  --ui-header-text: #374151;
  --ui-header-text-hover: #1f2937;
  --ui-header-sticky-bg: #ffffff;
  --ui-header-sticky-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --ui-header-height: 60px;
  --ui-header-padding: 16px 24px;
}

ui-app-header {
  background-color: var(--ui-header-bg);
  border-bottom: 1px solid var(--ui-header-border);
  color: var(--ui-header-text);
  height: var(--ui-header-height);
  padding: var(--ui-header-padding);
  transition: all 0.2s ease;
}

ui-app-header[sticky] {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--ui-header-sticky-bg);
  box-shadow: var(--ui-header-sticky-shadow);
}

ui-app-header[dense] {
  height: 48px;
  padding: 8px 16px;
}

ui-app-header[bordered] {
  border-bottom: 2px solid var(--ui-header-border);
}
```

### Theme Variations
Create different theme variations:

```css
/* Dark theme */
ui-app-header.theme-dark {
  background-color: #1f2937;
  border-bottom-color: #374151;
  color: #f9fafb;
}

ui-app-header.theme-dark a {
  color: #e5e7eb;
}

ui-app-header.theme-dark a:hover {
  color: #ffffff;
}

/* Light theme */
ui-app-header.theme-light {
  background-color: #f8fafc;
  border-bottom-color: #e2e8f0;
  color: #334155;
}

/* Minimal theme */
ui-app-header.theme-minimal {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

/* Corporate theme */
ui-app-header.theme-corporate {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}
```

### Animation Customization
Add custom animations:

```css
ui-app-header {
  transform: translateY(-100%);
  opacity: 0;
  animation: slideDown 0.3s ease forwards;
}

@keyframes slideDown {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Menu button animation */
ui-app-header button[aria-label="Menu"] {
  transition: transform 0.2s ease;
}

ui-app-header button[aria-label="Menu"]:hover {
  transform: scale(1.05);
}

/* Notification badge animation */
ui-app-header .notification-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
```

## Accessibility

### ARIA Attributes
Header components include proper ARIA attributes:

- `role="banner"` for header identification
- `aria-label` for descriptive labels
- `aria-expanded` for menu states
- `aria-haspopup` for dropdown menus

### Screen Reader Support
- Proper semantic structure
- Descriptive navigation labels
- Focus management
- Skip links support

### Keyboard Navigation
- Tab navigation through header elements
- Arrow key navigation in dropdowns
- ESC key to close menus
- Focus indicators for accessibility

## Best Practices

1. **Consistent branding**: Maintain consistent visual identity
2. **Responsive design**: Ensure header works on all screen sizes
3. **Performance**: Optimize for fast loading and smooth animations
4. **Accessibility**: Follow WCAG guidelines for accessibility
5. **User experience**: Provide clear navigation and feedback
6. **Mobile optimization**: Design for touch interactions
7. **Loading states**: Handle async operations gracefully
8. **Error handling**: Display appropriate error messages

## Related Components

- [Navigation](./navigation) - Navigation menu component
- [Sidebar](./sidebar) - Sidebar navigation component
- [Breadcrumb](./breadcrumb) - Breadcrumb navigation component
- [Toolbar](./toolbar) - Toolbar component for actions