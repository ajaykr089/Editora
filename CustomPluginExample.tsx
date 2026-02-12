/**
 * CUSTOM PLUGIN EXAMPLE
 * 
 * This demonstrates how to create a custom plugin for the Rich Text Editor
 * that works seamlessly with the new dynamic provider system.
 * 
 * Users can now create their own plugins without modifying the core editor!
 */

import React, { ReactNode } from 'react';
import { Plugin } from '@editora/core';
import { EditoraEditor } from '@editora/react';

// ============================================================================
// STEP 1: Create a React Provider Component
// ============================================================================

/**
 * MyCustomPluginProvider
 * 
 * This is a React Context Provider that manages the plugin's state and logic.
 * It registers commands with the global command registry when mounted.
 */
interface MyCustomPluginProviderProps {
  children: ReactNode;
}

export const MyCustomPluginProvider: React.FC<MyCustomPluginProviderProps> = ({ 
  children 
}) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    // Register your custom commands
    registerCommand('myCustomCommand', () => {
      alert('Custom plugin command executed!');
    });

    registerCommand('insertCustomContent', () => {
      // Implement your custom logic here
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'custom-plugin-content';
        span.textContent = '✨ Custom Content ✨';
        range.insertNode(span);
      }
    });

    // Optional: Return cleanup function
    return () => {
      // Cleanup if needed
    };
  }, []);

  return <>{children}</>;
};

// ============================================================================
// STEP 2: Define the Plugin
// ============================================================================

/**
 * MyCustomPlugin
 * 
 * This is the plugin definition that:
 * 1. Defines toolbar items (buttons that appear in the editor)
 * 2. Provides the React provider for state management
 * 3. Can optionally define custom nodes, marks, or commands
 */
export const MyCustomPlugin = (): Plugin => ({
  name: 'myCustomPlugin',
  
  // Define custom marks (inline formatting)
  // marks: { ... },
  
  // Define custom nodes (block elements)
  // nodes: { ... },
  
  // Define toolbar items (buttons, menus, inputs)
  toolbar: [
    {
      label: 'Custom Command',
      command: 'myCustomCommand',
      icon: '✨',
      type: 'button'
    },
    {
      label: 'Insert Custom Content',
      command: 'insertCustomContent',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24"><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12">C</text></svg>',
      type: 'button'
    }
  ],
  
  // IMPORTANT: Link the provider to the plugin
  context: {
    provider: MyCustomPluginProvider
  }
});

// ============================================================================
// STEP 3: Use the Custom Plugin in the Editor
// ============================================================================

/**
 * Example Usage
 * 
 * Simply add your custom plugin to the plugins array and it will be
 * automatically integrated with all its providers and commands!
 */
export const EditorWithCustomPlugin = () => {
  // Import all the plugins you want to use
  const {
    BoldPlugin,
    ItalicPlugin,
    UnderlinePlugin,
    ListPlugin,
    // ... other plugins
  } = require('@editora/plugins');

  return (
    <EditoraEditor
      plugins={[
        BoldPlugin(),
        ItalicPlugin(),
        UnderlinePlugin(),
        ListPlugin(),
        // Add your custom plugin here!
        MyCustomPlugin(),
        // Other plugins...
      ]}
      className="my-editor"
      floatingToolbar={{ enabled: true }}
    />
  );
};

// ============================================================================
// ADVANCED: Custom Plugin with State Management
// ============================================================================

/**
 * AdvancedCustomPlugin
 * 
 * This example shows a more complex plugin with state management
 */

interface AdvancedPluginContextType {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
}

const AdvancedPluginContext = React.createContext<AdvancedPluginContextType | undefined>(undefined);

export const AdvancedCustomPluginProvider: React.FC<{ children: ReactNode }> = ({ 
  children 
}) => {
  const [isEnabled, setIsEnabled] = React.useState(true);

  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('toggleAdvancedFeature', () => {
      setIsEnabled(!isEnabled);
    });

    registerCommand('advancedCommand', () => {
      if (isEnabled) {
        console.log('Advanced feature is enabled!');
        // Execute advanced functionality
      }
    });
  }, [isEnabled]);

  return (
    <AdvancedPluginContext.Provider value={{ isEnabled, setIsEnabled }}>
      {children}
    </AdvancedPluginContext.Provider>
  );
};

export const AdvancedCustomPlugin = (): Plugin => ({
  name: 'advancedCustomPlugin',
  toolbar: [
    {
      label: 'Toggle Feature',
      command: 'toggleAdvancedFeature',
      icon: '🎛️'
    },
    {
      label: 'Advanced Command',
      command: 'advancedCommand',
      icon: '⚙️'
    }
  ],
  context: {
    provider: AdvancedCustomPluginProvider
  }
});

// ============================================================================
// KEY POINTS FOR CREATING CUSTOM PLUGINS
// ============================================================================

/*
1. PLUGIN STRUCTURE:
   - Each plugin must export a function that returns a Plugin object
   - The Plugin object defines: name, nodes, marks, toolbar, context

2. PROVIDER (Optional but recommended):
   - Create a React FC that wraps your children
   - Register commands using window.registerEditorCommand
   - Manage any state needed for your plugin

3. CONTEXT PROPERTY:
   - Link your provider to the plugin using the context property
   - The editor will automatically wrap the content with your provider
   - No hardcoding needed in the main editor component!

4. TOOLBAR ITEMS:
   - Each toolbar item is a button/menu/input that appears in the editor
   - Toolbar items have: label, command, icon, and optional type
   - Commands are registered in your provider

5. INTEGRATION:
   - Simply add your plugin to the plugins array
   - DynamicProviderWrapper handles everything else
   - Multiple providers are automatically nested

BEFORE (Hardcoded Providers - Not Scalable):
  <BoldProvider>
    <ItalicProvider>
      <UnderlineProvider>
        <YourCustomProvider> ← Not possible without modifying core!
          <Editor />
        </YourCustomProvider>
      </UnderlineProvider>
    </ItalicProvider>
  </BoldProvider>

AFTER (Dynamic Providers - Fully Extensible):
  <DynamicProviderWrapper plugins={[boldPlugin, italicPlugin, customPlugin]}>
    <Editor />
  </DynamicProviderWrapper>

6. ACCESSING PLUGIN CONTEXT:
   - Use React Context to share state between providers and components
   - Create a custom hook to access context (shown in AdvancedCustomPlugin)
   - No props drilling needed!

7. COMMAND REGISTRATION:
   - Register commands in useEffect to avoid duplicate registrations
   - Use the global window object to execute commands from toolbar
   - Commands can accept parameters for dynamic behavior

8. ADVANCED FEATURES:
   - Define custom nodes for block elements (tables, images, etc)
   - Define custom marks for inline formatting (colors, sizes, etc)
   - Use lifecycle hooks: initialize, destroy, onEditorReady
   - Implement complex UI dialogs for configuration
*/

// ============================================================================
// PLUGIN ARCHITECTURE OVERVIEW
// ============================================================================

/*
COMPONENT TREE:
├── EditoraEditor (Main wrapper)
│   ├── DynamicProviderWrapper (Renders all plugin providers)
│   │   ├── BoldPluginProvider
│   │   ├── ItalicPluginProvider
│   │   ├── CustomPluginProvider (YOUR CUSTOM PROVIDER)
│   │   ├── ... (other plugin providers)
│   │   └── FullscreenPluginProvider (Always last, wraps editor)
│   │       ├── Toolbar (Buttons from all plugins)
│   │       ├── EditorContent (Main editor)
│   │       └── FloatingToolbar (Quick access toolbar)

COMMAND FLOW:
1. User clicks toolbar button
2. Button executes command via window.executeEditorCommand()
3. Global registry looks up the command handler
4. Plugin provider's registered handler is called
5. Handler updates state, executes DOM manipulation, etc.

PLUGIN REGISTRATION:
1. Plugin is passed to EditoraEditor in plugins array
2. DynamicProviderWrapper filters plugins with context.provider
3. Each provider is rendered in order
4. Plugin can execute initialization code in useEffect
*/
