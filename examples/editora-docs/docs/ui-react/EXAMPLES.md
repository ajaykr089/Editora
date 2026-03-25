---
title: Examples
description: Comprehensive examples showing real-world usage patterns and integration scenarios.
sidebar_label: Examples
---

# UI React Examples

This document provides comprehensive examples demonstrating real-world usage patterns, integration scenarios, and best practices for the `@editora/ui-react` component library.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Form Examples](#form-examples)
3. [Layout Examples](#layout-examples)
4. [Data Management](#data-management)
5. [Theme Integration](#theme-integration)
6. [Advanced Patterns](#advanced-patterns)
7. [Integration Examples](#integration-examples)

## Basic Setup

### Minimal Application
```tsx
import React from 'react';
import { ThemeProvider, Button, Input } from '@editora/ui-react';

function App() {
  return (
    <ThemeProvider>
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
        <h1>Welcome to Editora UI</h1>
        <Input name="email" type="email" placeholder="Enter your email" />
        <Button variant="primary" style={{ marginTop: '1rem' }}>
          Get Started
        </Button>
      </div>
    </ThemeProvider>
  );
}
```

### Complete Application Structure
```tsx
import React from 'react';
import { 
  ThemeProvider, 
  Layout, 
  Sidebar, 
  AppHeader, 
  Button, 
  useTheme 
} from '@editora/ui-react';

function Application() {
  const { tokens, setTokens } = useTheme();
  
  return (
    <ThemeProvider tokens={{ colors: { primary: '#0f766e' } }}>
      <Layout>
        <AppHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>My App</h1>
            <Button 
              onClick={() => setTokens({ colors: { primary: '#ef4444' } })}
            >
              Switch Theme
            </Button>
          </div>
        </AppHeader>
        
        <Sidebar>
          <nav>
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/settings">Settings</a></li>
            </ul>
          </nav>
        </Sidebar>
        
        <main>
          {/* Application content */}
        </main>
      </Layout>
    </ThemeProvider>
  );
}
```

## Form Examples

### Contact Form
```tsx
import React, { useState } from 'react';
import { 
  Form, 
  Field, 
  Input, 
  Textarea, 
  Select, 
  Checkbox, 
  Button 
} from '@editora/ui-react';

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values) => {
    try {
      // Simulate API call
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Thank you!</h2>
        <p>Your message has been sent successfully.</p>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} autosave>
      <Field label="Name" required>
        <Input name="name" required placeholder="Your full name" />
      </Field>

      <Field label="Email" required>
        <Input name="email" type="email" required placeholder="your@email.com" />
      </Field>

      <Field label="Subject" required>
        <Select 
          name="subject" 
          required
          options={[
            { value: 'general', label: 'General Inquiry' },
            { value: 'support', label: 'Technical Support' },
            { value: 'sales', label: 'Sales' }
          ]}
        />
      </Field>

      <Field label="Message" required>
        <Textarea 
          name="message" 
          required 
          rows={6}
          placeholder="Please describe your inquiry..."
          maxLength={1000}
        />
      </Field>

      <Field>
        <Checkbox name="newsletter" label="Subscribe to newsletter" />
      </Field>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Button type="submit" variant="primary">
          Send Message
        </Button>
        <Button type="reset" variant="secondary">
          Clear Form
        </Button>
      </div>
    </Form>
  );
}
```

### User Registration Form
```tsx
import React, { useState } from 'react';
import { 
  Form, 
  Field, 
  Input, 
  PasswordField, 
  Button 
} from '@editora/ui-react';

function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const validateStep1 = (data) => {
    return data.email && data.password && data.confirmPassword;
  };

  const validateStep2 = (data) => {
    return data.firstName && data.lastName && data.dateOfBirth;
  };

  const handleNext = (values) => {
    if (step === 1 && validateStep1(values)) {
      setFormData(prev => ({ ...prev, ...values }));
      setStep(2);
    } else if (step === 2 && validateStep2(values)) {
      setFormData(prev => ({ ...prev, ...values }));
      setStep(3);
    }
  };

  const handleSubmit = async (values) => {
    const finalData = { ...formData, ...values };
    try {
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
      
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {step === 1 && (
        <div>
          <Field label="Email" required>
            <Input name="email" type="email" required />
          </Field>
          
          <Field label="Password" required>
            <PasswordField name="password" required showStrength />
          </Field>
          
          <Field label="Confirm Password" required>
            <PasswordField name="confirmPassword" required />
          </Field>
          
          <Button onClick={() => handleNext()} variant="primary">
            Next
          </Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <Field label="First Name" required>
            <Input name="firstName" required />
          </Field>
          
          <Field label="Last Name" required>
            <Input name="lastName" required />
          </Field>
          
          <Field label="Date of Birth" required>
            <Input name="dateOfBirth" type="date" required />
          </Field>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={() => setStep(1)} variant="secondary">
              Back
            </Button>
            <Button onClick={() => handleNext()} variant="primary">
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <Field label="Profile Picture">
            <Input name="avatar" type="file" accept="image/*" />
          </Field>
          
          <Field label="Bio">
            <Textarea name="bio" rows={4} maxLength={500} />
          </Field>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={() => setStep(2)} variant="secondary">
              Back
            </Button>
            <Button type="submit" variant="primary">
              Complete Registration
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
}
```

## Layout Examples

### MasonryGrid Patterns
```tsx
import { Card, MasonryGrid } from '@editora/ui-react';

function MasonryPatterns() {
  return (
    <MasonryGrid columns={{ initial: 1, md: 2, lg: 3 }} gap="lg">
      <Card style={{ padding: 20, minHeight: 140 }}>Uneven-height card</Card>
      <Card style={{ padding: 20, minHeight: 280 }}>Gallery or editorial card</Card>
      <Card style={{ padding: 20, minHeight: 180 }}>Dashboard module</Card>
      <Card style={{ padding: 20, minHeight: 320 }}>Tall narrative panel</Card>
    </MasonryGrid>
  );
}
```

Use `MasonryGrid` for:
- uneven-height cards
- gallery-style layouts
- dashboard and content walls
- visually packed columns

If row order must exactly match reading order, use `PlacementGrid` instead.

### Dashboard Layout
```tsx
import React from 'react';
import { 
  Layout, 
  Sidebar, 
  AppHeader, 
  Breadcrumb, 
  Box, 
  Grid, 
  Card, 
  Chart, 
  Table, 
  Button 
} from '@editora/ui-react';

function Dashboard() {
  return (
    <Layout>
      <AppHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Breadcrumb>
            <a href="/">Home</a>
            <span>Dashboard</span>
          </Breadcrumb>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary">Settings</Button>
            <Button variant="primary">New Report</Button>
          </div>
        </div>
      </AppHeader>

      <Sidebar>
        <nav>
          <ul>
            <li><a href="/dashboard">Overview</a></li>
            <li><a href="/analytics">Analytics</a></li>
            <li><a href="/reports">Reports</a></li>
            <li><a href="/users">Users</a></li>
          </ul>
        </nav>
      </Sidebar>

      <main>
        <Box padding="2rem">
          <Grid columns="repeat(3, 1fr)" gap="2rem">
            <Card>
              <h3>Total Users</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>12,345</p>
            </Card>
            
            <Card>
              <h3>Revenue</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$45,678</p>
            </Card>
            
            <Card>
              <h3>Active Sessions</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>1,234</p>
            </Card>
          </Grid>

          <Box marginTop="2rem">
            <Chart type="line" data={/* chart data */} height="400px" />
          </Box>

          <Box marginTop="2rem">
            <Table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* table rows */}
              </tbody>
            </Table>
          </Box>
        </Box>
      </main>
    </Layout>
  );
}
```

### E-commerce Product Page
```tsx
import React, { useState } from 'react';
import { 
  Layout, 
  Box, 
  Grid, 
  Image, 
  Button, 
  Select, 
  Input, 
  Rating, 
  Badge, 
  Tabs 
} from '@editora/ui-react';

function ProductPage({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  return (
    <Layout>
      <AppHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{product.name}</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary">Wishlist</Button>
            <Button variant="primary">Add to Cart</Button>
          </div>
        </div>
      </AppHeader>

      <main>
        <Box padding="2rem">
          <Grid columns="1fr 1fr" gap="2rem">
            <div>
              <Image 
                src={product.images[selectedImage]} 
                alt={product.name}
                style={{ width: '100%', borderRadius: '8px' }}
              />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {product.images.map((image, index) => (
                  <Button
                    key={index}
                    variant={selectedImage === index ? 'primary' : 'secondary'}
                    onClick={() => setSelectedImage(index)}
                    style={{ padding: '4px 8px' }}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1>{product.name}</h1>
                <Badge variant="success">{product.availability}</Badge>
              </div>
              
              <Rating value={product.rating} max={5} />
              
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f766e' }}>
                ${product.price}
              </p>
              
              <p>{product.description}</p>

              <div style={{ marginTop: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Size:</label>
                  <Select
                    value={selectedSize}
                    onChange={setSelectedSize}
                    options={product.sizes.map(size => ({
                      value: size,
                      label: size
                    }))}
                  />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label>Quantity:</label>
                  <Input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(value) => setQuantity(parseInt(value))}
                    style={{ width: '100px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Button variant="primary" size="lg" style={{ flex: 1 }}>
                    Add to Cart
                  </Button>
                  <Button variant="secondary" size="lg">
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </Grid>

          <Box marginTop="3rem">
            <Tabs>
              <div label="Description">
                <p>{product.fullDescription}</p>
              </div>
              <div label="Reviews">
                {/* Reviews component */}
              </div>
              <div label="Shipping">
                {/* Shipping information */}
              </div>
            </Tabs>
          </Box>
        </Box>
      </main>
    </Layout>
  );
}
```

## Data Management

### Data Table with CRUD Operations
```tsx
import React, { useState, useEffect } from 'react';
import { 
  DataTable, 
  Button, 
  Dialog, 
  Form, 
  Field, 
  Input, 
  useDialog 
} from '@editora/ui-react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const dialog = useDialog();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    const result = await dialog.confirm({
      title: 'Create New User',
      description: (
        <Form onSubmit={(values) => console.log('Create user:', values)}>
          <Field label="Name" required>
            <Input name="name" required />
          </Field>
          <Field label="Email" required>
            <Input name="email" type="email" required />
          </Field>
          <Field label="Role">
            <Input name="role" />
          </Field>
        </Form>
      ),
      submitText: 'Create User'
    });

    if (result) {
      // Handle user creation
      fetchUsers();
    }
  };

  const handleEditUser = async (user) => {
    const result = await dialog.confirm({
      title: `Edit ${user.name}`,
      description: (
        <Form onSubmit={(values) => console.log('Update user:', values)}>
          <Field label="Name">
            <Input name="name" defaultValue={user.name} />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" defaultValue={user.email} />
          </Field>
          <Field label="Role">
            <Input name="role" defaultValue={user.role} />
          </Field>
        </Form>
      ),
      submitText: 'Update User'
    });

    if (result) {
      // Handle user update
      fetchUsers();
    }
  };

  const handleDeleteUser = async (user) => {
    const result = await dialog.confirm({
      title: 'Delete User',
      description: `Are you sure you want to delete ${user.name}?`,
      submitText: 'Delete',
      variant: 'danger'
    });

    if (result) {
      try {
        await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>User Management</h2>
        <Button variant="primary" onClick={handleCreateUser}>
          Add User
        </Button>
      </div>

      <DataTable
        data={users}
        loading={loading}
        sortable
        selectable
        onRowSelect={(selection) => console.log('Selected:', selection)}
      >
        <table>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button size="sm" onClick={() => handleEditUser(user)}>
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger" 
                      onClick={() => handleDeleteUser(user)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
```

### Real-time Data Dashboard
```tsx
import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  Chart, 
  Progress, 
  Badge, 
  Timeline 
} from '@editora/ui-react';

function RealTimeDashboard() {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data updates
      setMetrics(prev => ({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: Math.random() * 100
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>System Dashboard</h2>
      
      <Grid columns="repeat(4, 1fr)" gap="1rem" style={{ marginBottom: '2rem' }}>
        <Card>
          <h3>CPU Usage</h3>
          <Progress value={metrics.cpu} max={100} />
          <Badge variant={metrics.cpu > 80 ? 'danger' : 'success'}>
            {metrics.cpu.toFixed(1)}%
          </Badge>
        </Card>

        <Card>
          <h3>Memory Usage</h3>
          <Progress value={metrics.memory} max={100} />
          <Badge variant={metrics.memory > 80 ? 'danger' : 'success'}>
            {metrics.memory.toFixed(1)}%
          </Badge>
        </Card>

        <Card>
          <h3>Disk Usage</h3>
          <Progress value={metrics.disk} max={100} />
          <Badge variant={metrics.disk > 80 ? 'danger' : 'success'}>
            {metrics.disk.toFixed(1)}%
          </Badge>
        </Card>

        <Card>
          <h3>Network Usage</h3>
          <Progress value={metrics.network} max={100} />
          <Badge variant={metrics.network > 80 ? 'danger' : 'success'}>
            {metrics.network.toFixed(1)}%
          </Badge>
        </Card>
      </Grid>

      <Grid columns="2fr 1fr" gap="2rem">
        <Card>
          <h3>System Performance</h3>
          <Chart 
            type="line" 
            data={{
              labels: ['12:00', '12:05', '12:10', '12:15', '12:20'],
              datasets: [
                {
                  label: 'CPU',
                  data: [65, 59, 80, 81, 56],
                  borderColor: '#ef4444'
                },
                {
                  label: 'Memory',
                  data: [28, 48, 40, 19, 86],
                  borderColor: '#3b82f6'
                }
              ]
            }}
            height="300px"
          />
        </Card>

        <Card>
          <h3>Recent Events</h3>
          <Timeline>
            {events.map((event, index) => (
              <div key={index}>
                <strong>{event.time}</strong>
                <p>{event.message}</p>
                <Badge variant={event.type}>{event.type}</Badge>
              </div>
            ))}
          </Timeline>
        </Card>
      </Grid>
    </div>
  );
}
```

## Theme Integration

### Custom Theme Implementation
```tsx
import React, { useState } from 'react';
import { ThemeProvider, useTheme, Button, Card, Box } from '@editora/ui-react';

const customTheme = {
  colors: {
    primary: '#0f766e',
    primaryForeground: '#ffffff',
    secondary: '#64748b',
    background: '#ffffff',
    text: '#0f172a',
    muted: '#94a3b8'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  typography: {
    size: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px'
    }
  },
  radius: '12px',
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }
};

function ThemedApplication() {
  const { tokens, setTokens } = useTheme();
  const [currentTheme, setCurrentTheme] = useState('custom');

  const themes = {
    light: {
      colors: {
        primary: '#3b82f6',
        background: '#ffffff',
        text: '#1f2937'
      }
    },
    dark: {
      colors: {
        primary: '#60a5fa',
        background: '#111827',
        text: '#f3f4f6'
      }
    },
    custom: customTheme
  };

  const switchTheme = (themeName) => {
    setCurrentTheme(themeName);
    setTokens(themes[themeName]);
  };

  return (
    <ThemeProvider tokens={themes[currentTheme]}>
      <div style={{ minHeight: '100vh', padding: tokens.spacing.lg }}>
        <Box marginBottom="2rem">
          <h1>Theme Demo Application</h1>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button 
              variant={currentTheme === 'light' ? 'primary' : 'secondary'}
              onClick={() => switchTheme('light')}
            >
              Light Theme
            </Button>
            <Button 
              variant={currentTheme === 'dark' ? 'primary' : 'secondary'}
              onClick={() => switchTheme('dark')}
            >
              Dark Theme
            </Button>
            <Button 
              variant={currentTheme === 'custom' ? 'primary' : 'secondary'}
              onClick={() => switchTheme('custom')}
            >
              Custom Theme
            </Button>
          </div>
        </Box>

        <Grid columns="repeat(3, 1fr)" gap="2rem">
          <Card>
            <h3>Primary Card</h3>
            <p>This card uses the primary theme color.</p>
            <Button variant="primary">Primary Action</Button>
          </Card>

          <Card>
            <h3>Secondary Card</h3>
            <p>This card uses the secondary theme color.</p>
            <Button variant="secondary">Secondary Action</Button>
          </Card>

          <Card>
            <h3>Custom Card</h3>
            <p>This card adapts to the current theme.</p>
            <Button variant="ghost">Ghost Action</Button>
          </Card>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
```

### Theme-aware Component
```tsx
import React from 'react';
import { useTheme } from '@editora/ui-react';

function ThemeAwareComponent() {
  const { tokens } = useTheme();

  const styles = {
    container: {
      backgroundColor: tokens.colors.background,
      color: tokens.colors.text,
      padding: tokens.spacing.md,
      borderRadius: tokens.radius || '8px',
      boxShadow: tokens.shadows.md,
      transition: 'all 0.3s ease'
    },
    heading: {
      fontSize: tokens.typography.size.xl,
      marginBottom: tokens.spacing.sm,
      color: tokens.colors.primary
    },
    text: {
      fontSize: tokens.typography.size.md,
      lineHeight: '1.6'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Theme-Aware Component</h2>
      <p style={styles.text}>
        This component automatically adapts to the current theme settings.
        The colors, spacing, typography, and other visual properties
        are all derived from the theme tokens.
      </p>
    </div>
  );
}
```

## Advanced Patterns

### Virtualized Long Lists
```tsx
import React, { useState, useMemo } from 'react';
import { VirtualizedList, Box, Button } from '@editora/ui-react';

function VirtualizedDataList() {
  const [data, setData] = useState(() => 
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `Description for item ${i}`
    }))
  );

  const renderItem = ({ item, style }) => (
    <Box style={{ ...style, padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
      <h4>{item.name}</h4>
      <p>{item.description}</p>
    </Box>
  );

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <Button onClick={() => setData(prev => [...prev, { id: prev.length, name: `Item ${prev.length}`, description: 'New item' }])}>
          Add Item
        </Button>
        <Button variant="danger" onClick={() => setData([])}>
          Clear List
        </Button>
      </div>
      
      <VirtualizedList
        data={data}
        itemHeight={80}
        height={600}
        renderItem={renderItem}
      />
    </div>
  );
}
```

### Drag and Drop Interface
```tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, Card, Button } from '@editora/ui-react';

function KanbanBoard() {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: '1', content: 'Task 1' },
        { id: '2', content: 'Task 2' }
      ]
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      items: [
        { id: '3', content: 'Task 3' }
      ]
    },
    done: {
      id: 'done',
      title: 'Done',
      items: [
        { id: '4', content: 'Task 4' }
      ]
    }
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const [removed] = sourceColumn.items.splice(source.index, 1);
    destColumn.items.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
        {Object.entries(columns).map(([columnId, column]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ minWidth: '300px' }}
              >
                <Card style={{ marginBottom: '1rem' }}>
                  <h3>{column.title}</h3>
                </Card>
                
                {column.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.5 : 1,
                          marginBottom: '1rem'
                        }}
                      >
                        <Card>
                          {item.content}
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
```

## Integration Examples

### With React Router
```tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  Layout, 
  Sidebar, 
  AppHeader, 
  Button, 
  Breadcrumb 
} from '@editora/ui-react';

function AppWithRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <AppHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>My App</h1>
            <nav>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/users">Users</Link>
              <Link to="/settings">Settings</Link>
            </nav>
          </div>
        </AppHeader>

        <Sidebar>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/analytics">Analytics</Link></li>
          </ul>
        </Sidebar>

        <main>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </Layout>
    </BrowserRouter>
  );
}

function Dashboard() {
  return (
    <div>
      <Breadcrumb>
        <Link to="/">Home</Link>
        <span>Dashboard</span>
      </Breadcrumb>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard!</p>
    </div>
  );
}
```

### With State Management (Zustand)
```tsx
import React from 'react';
import { create } from 'zustand';
import { 
  Form, 
  Field, 
  Input, 
  Button, 
  useTheme 
} from '@editora/ui-react';

const useUserStore = create((set, get) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  fetchUser: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch user:', error);
    }
  }
}));

function UserProfile() {
  const { user, isLoading, setUser } = useUserStore();
  const { tokens } = useTheme();

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>User Profile</h2>
      
      <Form onSubmit={handleSubmit}>
        <Field label="Name">
          <Input name="name" defaultValue={user?.name} />
        </Field>
        
        <Field label="Email">
          <Input name="email" type="email" defaultValue={user?.email} />
        </Field>
        
        <Field label="Bio">
          <Input name="bio" defaultValue={user?.bio} />
        </Field>
        
        <Button type="submit" variant="primary" style={{ marginTop: '1rem' }}>
          Save Changes
        </Button>
      </Form>
    </div>
  );
}
```

### With TypeScript Strict Mode
```tsx
import React from 'react';
import { 
  Form, 
  Field, 
  Input, 
  Button, 
  Select, 
  Checkbox 
} from '@editora/ui-react';

interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  newsletter: boolean;
  department: string;
}

function StrictTypeForm() {
  const handleSubmit = (values: UserFormData) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form<UserFormData> onSubmit={handleSubmit}>
      <Field<UserFormData> label="Name" required>
        <Input<UserFormData> name="name" required />
      </Field>

      <Field<UserFormData> label="Email" required>
        <Input<UserFormData> name="email" type="email" required />
      </Field>

      <Field<UserFormData> label="Role">
        <Select<UserFormData>
          name="role"
          options={[
            { value: 'admin', label: 'Administrator' },
            { value: 'editor', label: 'Editor' },
            { value: 'viewer', label: 'Viewer' }
          ]}
        />
      </Field>

      <Field<UserFormData> label="Department">
        <Input<UserFormData> name="department" />
      </Field>

      <Field<UserFormData>>
        <Checkbox<UserFormData> name="newsletter" label="Subscribe to newsletter" />
      </Field>

      <Button type="submit" variant="primary">
        Submit
      </Button>
    </Form>
  );
}
```

These examples demonstrate the versatility and power of the `@editora/ui-react` component library. They show how to build complete applications with forms, layouts, data management, theming, and integration with popular React libraries and patterns.
