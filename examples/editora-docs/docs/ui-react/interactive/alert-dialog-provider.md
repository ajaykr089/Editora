---
title: AlertDialogProvider
description: AlertDialogProvider component for managing global alert dialogs with context-based API access.
sidebar_label: AlertDialogProvider
---

# AlertDialogProvider

The `AlertDialogProvider` component provides a context-based API for managing global alert dialogs throughout your application. It creates a centralized dialog management system that can be accessed from anywhere in your component tree.

## Basic Usage

```tsx
import { AlertDialogProvider, useAlertDialog } from '@editora/ui-react';

function App() {
  return (
    <AlertDialogProvider>
      <YourApplication />
    </AlertDialogProvider>
  );
}

function YourComponent() {
  const { alert, confirm, prompt } = useAlertDialog();

  const handleDelete = async () => {
    const result = await confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?'
    });
    
    if (result.action === 'confirm') {
      // Proceed with deletion
    }
  };

  return (
    <button onClick={handleDelete}>
      Delete
    </button>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Application components that need access to dialog API |
| `hostId` | `string` | `'ui-alert-dialog-react-host'` | ID for the dialog container element |

## API Methods

### alert(options)
Displays a simple alert dialog.

```tsx
const { alert } = useAlertDialog();

await alert({
  title: 'Information',
  message: 'This is an important message.',
  confirmText: 'OK'
});
```

### confirm(options)
Displays a confirmation dialog with cancel and confirm options.

```tsx
const { confirm } = useAlertDialog();

const result = await confirm({
  title: 'Confirmation Required',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Yes',
  cancelText: 'No'
});

if (result.action === 'confirm') {
  // User confirmed
} else {
  // User cancelled
}
```

### prompt(options)
Displays a prompt dialog for user input.

```tsx
const { prompt } = useAlertDialog();

const result = await prompt({
  title: 'Enter your name',
  message: 'Please enter your full name:',
  placeholder: 'John Doe',
  defaultValue: ''
});

if (result.action === 'confirm') {
  console.log('User entered:', result.value);
}
```

## Configuration Options

### AlertDialogAlertOptions
Options for alert dialogs.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | - | Dialog title |
| `message` | `string` | - | Dialog message |
| `confirmText` | `string` | `'OK'` | Confirm button text |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | - | Dialog tone |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dialog size |
| `dismissible` | `boolean` | `true` | Allow dismissal |
| `closeOnEsc` | `boolean` | `true` | Close on ESC key |
| `closeOnBackdrop` | `boolean` | `false` | Close on backdrop click |

### AlertDialogConfirmOptions
Options for confirmation dialogs.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | - | Dialog title |
| `message` | `string` | - | Dialog message |
| `confirmText` | `string` | `'OK'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | - | Dialog tone |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dialog size |
| `dismissible` | `boolean` | `true` | Allow dismissal |
| `closeOnEsc` | `boolean` | `true` | Close on ESC key |
| `closeOnBackdrop` | `boolean` | `false` | Close on backdrop click |

### AlertDialogPromptOptions
Options for prompt dialogs.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | - | Dialog title |
| `message` | `string` | - | Dialog message |
| `placeholder` | `string` | - | Input placeholder |
| `defaultValue` | `string` | - | Default input value |
| `inputType` | `'text' \| 'email' \| 'password' \| 'number'` | `'text'` | Input type |
| `confirmText` | `string` | `'OK'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | - | Dialog tone |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dialog size |
| `dismissible` | `boolean` | `true` | Allow dismissal |
| `closeOnEsc` | `boolean` | `true` | Close on ESC key |
| `closeOnBackdrop` | `boolean` | `false` | Close on backdrop click |

## Return Types

### AlertResult
Result from alert dialogs.

```typescript
interface AlertResult {
  id: string;
  action: 'dismiss';
}
```

### ConfirmResult
Result from confirmation dialogs.

```typescript
interface ConfirmResult {
  id: string;
  action: 'confirm' | 'dismiss';
}
```

### PromptResult
Result from prompt dialogs.

```typescript
interface PromptResult {
  id: string;
  action: 'confirm' | 'dismiss';
  value: string;
}
```

## Basic Examples

### Simple Alert
Basic alert dialog for notifications.

```tsx
function SimpleAlertExample() {
  const { alert } = useAlertDialog();

  const showNotification = () => {
    alert({
      title: 'Welcome',
      message: 'Welcome to our application!',
      confirmText: 'Got it'
    });
  };

  return (
    <button onClick={showNotification}>
      Show Welcome Message
    </button>
  );
}
```

### Confirmation Dialog
Confirmation dialog for critical actions.

```tsx
function ConfirmationExample() {
  const { confirm } = useAlertDialog();

  const handleDelete = async () => {
    const result = await confirm({
      title: 'Delete Confirmation',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      tone: 'danger'
    });

    if (result.action === 'confirm') {
      console.log('Item deleted');
    }
  };

  return (
    <button onClick={handleDelete} style={{ backgroundColor: '#ef4444', color: 'white' }}>
      Delete Item
    </button>
  );
}
```

### Input Prompt
Prompt dialog for collecting user input.

```tsx
function PromptExample() {
  const { prompt } = useAlertDialog();
  const [username, setUsername] = useState('');

  const collectUsername = async () => {
    const result = await prompt({
      title: 'Username Required',
      message: 'Please enter your username to continue:',
      placeholder: 'Enter your username',
      defaultValue: username
    });

    if (result.action === 'confirm') {
      setUsername(result.value);
    }
  };

  return (
    <div>
      <p>Current username: {username || 'Not set'}</p>
      <button onClick={collectUsername}>
        Set Username
      </button>
    </div>
  );
}
```

## Advanced Examples

### Form Validation with Prompt
Using prompt for form validation and data collection.

```tsx
function FormValidationExample() {
  const { alert, confirm, prompt } = useAlertDialog();
  const [userEmail, setUserEmail] = useState('');

  const validateAndCollectEmail = async () => {
    // First, check if user wants to update email
    const confirmResult = await confirm({
      title: 'Update Email',
      message: 'Do you want to update your email address?',
      confirmText: 'Yes',
      cancelText: 'No'
    });

    if (confirmResult.action !== 'confirm') return;

    // Collect new email
    const promptResult = await prompt({
      title: 'Enter New Email',
      message: 'Please enter your new email address:',
      placeholder: 'user@example.com',
      inputType: 'email',
      defaultValue: userEmail
    });

    if (promptResult.action !== 'confirm') return;

    const newEmail = promptResult.value.trim();
    
    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
      await alert({
        title: 'Invalid Email',
        message: 'Please enter a valid email address.',
        tone: 'danger'
      });
      return;
    }

    // Confirm the change
    const finalConfirm = await confirm({
      title: 'Confirm Change',
      message: `Are you sure you want to change your email to ${newEmail}?`,
      confirmText: 'Yes, Change',
      cancelText: 'Cancel'
    });

    if (finalConfirm.action === 'confirm') {
      setUserEmail(newEmail);
      await alert({
        title: 'Email Updated',
        message: 'Your email address has been successfully updated.',
        tone: 'success'
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Email Management</h3>
      <p>Current email: {userEmail || 'Not set'}</p>
      <button onClick={validateAndCollectEmail}>
        Update Email
      </button>
    </div>
  );
}
```

### Multi-Step Workflow
Complex workflow using multiple dialog types.

```tsx
function MultiStepWorkflowExample() {
  const { alert, confirm, prompt } = useAlertDialog();
  const [workflowData, setWorkflowData] = useState({
    name: '',
    email: '',
    plan: '',
    confirmed: false
  });

  const startWorkflow = async () => {
    // Step 1: Collect basic information
    const nameResult = await prompt({
      title: 'Step 1: Your Name',
      message: 'Please enter your full name:',
      placeholder: 'John Doe',
      defaultValue: workflowData.name
    });

    if (nameResult.action !== 'confirm') return;
    const name = nameResult.value.trim();

    const emailResult = await prompt({
      title: 'Step 2: Your Email',
      message: 'Please enter your email address:',
      placeholder: 'john@example.com',
      inputType: 'email',
      defaultValue: workflowData.email
    });

    if (emailResult.action !== 'confirm') return;
    const email = emailResult.value.trim();

    // Step 3: Choose plan
    const planResult = await confirm({
      title: 'Step 3: Choose Plan',
      message: 'Which plan would you like to select?',
      confirmText: 'Pro Plan ($29/month)',
      cancelText: 'Basic Plan (Free)'
    });

    const plan = planResult.action === 'confirm' ? 'Pro' : 'Basic';

    // Step 4: Final confirmation
    const finalResult = await confirm({
      title: 'Review Your Selection',
      message: `
        Name: ${name}
        Email: ${email}
        Plan: ${plan}
        
        Do you want to proceed with this information?
      `,
      confirmText: 'Yes, Proceed',
      cancelText: 'Edit Information'
    });

    if (finalResult.action === 'confirm') {
      setWorkflowData({ name, email, plan, confirmed: true });
      await alert({
        title: 'Setup Complete',
        message: 'Your account has been successfully configured!',
        tone: 'success'
      });
    } else {
      // Allow user to restart the process
      await alert({
        title: 'Process Cancelled',
        message: 'You can restart the setup process anytime.',
        tone: 'info'
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Account Setup Workflow</h3>
      {workflowData.confirmed ? (
        <div>
          <p>✅ Setup completed successfully!</p>
          <p>Name: {workflowData.name}</p>
          <p>Email: {workflowData.email}</p>
          <p>Plan: {workflowData.plan}</p>
        </div>
      ) : (
        <button onClick={startWorkflow}>
          Start Setup Process
        </button>
      )}
    </div>
  );
}
```

### Error Handling and Edge Cases
Comprehensive error handling with dialog management.

```tsx
function ErrorHandlingExample() {
  const { alert, confirm, prompt } = useAlertDialog();
  const [isLoading, setIsLoading] = useState(false);

  const handleAsyncOperation = async () => {
    setIsLoading(true);
    
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ask for confirmation before proceeding
      const confirmResult = await confirm({
        title: 'Operation Complete',
        message: 'The operation completed successfully. Do you want to proceed?',
        confirmText: 'Proceed',
        cancelText: 'Cancel'
      });

      if (confirmResult.action === 'confirm') {
        // Collect additional information
        const promptResult = await prompt({
          title: 'Additional Information',
          message: 'Please provide any additional notes:',
          placeholder: 'Optional notes...'
        });

        if (promptResult.action === 'confirm') {
          await alert({
            title: 'Success',
            message: `Operation completed with notes: "${promptResult.value}"`,
            tone: 'success'
          });
        }
      }
    } catch (error) {
      await alert({
        title: 'Error',
        message: 'An error occurred during the operation. Please try again.',
        tone: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Async Operation Example</h3>
      <button onClick={handleAsyncOperation} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Start Operation'}
      </button>
    </div>
  );
}
```

## Best Practices

### 1. Provider Placement
Place the AlertDialogProvider at the root of your application:

```tsx
function App() {
  return (
    <AlertDialogProvider>
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </AlertDialogProvider>
  );
}
```

### 2. Error Handling
Always handle potential errors when using async dialog methods:

```tsx
const handleAction = async () => {
  try {
    const result = await confirm({
      title: 'Confirmation',
      message: 'Are you sure?'
    });
    
    if (result.action === 'confirm') {
      // Handle confirmation
    }
  } catch (error) {
    console.error('Dialog error:', error);
  }
};
```

### 3. User Experience
- Use appropriate dialog types for different scenarios
- Provide clear and concise messages
- Use appropriate tones for different types of messages
- Always provide meaningful button text

### 4. Accessibility
- Ensure dialog content is accessible to screen readers
- Use appropriate ARIA attributes
- Provide keyboard navigation support

## Related Components

- [AlertDialog](./alert-dialog) - Individual alert dialog component
- [Dialog](./dialog) - Basic dialog component
- [Toast](./toast) - Temporary notification messages
- [Alert](./alert) - Persistent alert messages