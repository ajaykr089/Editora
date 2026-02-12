import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { EditoraEditor } from "@editora/react";
import {
  HeadingPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  ListPlugin,
  BlockquotePlugin,
  CodePlugin,
  LinkPlugin,
  ClearFormattingPlugin,
  HistoryPlugin,
  TablePlugin,
  MediaManagerPlugin,
  FontSizePlugin,
  FontFamilyPlugin,
  TextAlignmentPlugin,
} from "@editora/plugins";
import "@editora/themes/themes/default.css";

/**
 * Media Manager Stories - Demonstrating Offline-First Upload
 * 
 * This showcases the new offline-first media manager that:
 * - Uses base64 by default for true offline capability
 * - Supports optional custom server upload
 * - Uses toast notifications for user feedback
 * - Works without any backend API required
 */

const meta: Meta<typeof EditoraEditor> = {
  title: "Editor/MediaManager - Offline-First Upload",
  component: EditoraEditor,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof EditoraEditor>;

// Common plugins for all media manager stories
const commonPlugins = [
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  StrikethroughPlugin(),
  CodePlugin(),
  ListPlugin(),
  BlockquotePlugin(),
  LinkPlugin(),
  ClearFormattingPlugin(),
  TablePlugin(),
  HistoryPlugin(),
  MediaManagerPlugin(),
  FontSizePlugin(),
  FontFamilyPlugin(),
  TextAlignmentPlugin(),
];

/**
 * Story 1: Pure Offline Mode (Base64 Only)
 * 
 * The simplest configuration - images are stored as base64 directly in the content.
 * Perfect for standalone applications without any server.
 */
export const PureOfflineMode: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800, // 50MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        useBase64Permanently: true, // Force base64 only
        fallbackToBase64: true,
      },
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f0f8ff', marginBottom: '10px' }}>
        <strong>📱 Pure Offline Mode:</strong> All images stored as base64. No server required!
      </div>
      <EditoraEditor {...args} />
    </div>
  ),
};

/**
 * Story 2: Offline-First with Custom Server Fallback
 * 
 * Tries to upload to a custom server, falls back to base64 if unavailable.
 * This is the recommended setup for most applications.
 */
export const OfflineFirstWithCustomServer: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        fallbackToBase64: true,
        customUploadUrl: 'http://localhost:3001/api/upload',
        customUploadHeaders: {
          'Authorization': 'Bearer your-token-here',
        },
      },
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#fff8f0', marginBottom: '10px' }}>
        <strong>🌐 Offline-First with Custom Server:</strong> Tries server first, falls back to base64 if unavailable
      </div>
      <EditoraEditor {...args} />
    </div>
  ),
};

/**
 * Story 3: Hybrid Mode - API Optional
 * 
 * Uses base64 by default but tries API upload if available.
 * Best user experience: always works offline, faster with API.
 */
export const HybridModeApiOptional: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
      offline: {
        enabled: true,
        fallbackToBase64: true,
      },
      uploadUrl: '/api/media/upload',
      libraryUrl: '/api/media/library',
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f0fff0', marginBottom: '10px' }}>
        <strong>⚡ Hybrid Mode:</strong> Base64 default + optional API upload in background
      </div>
      <EditoraEditor {...args} />
    </div>
  ),
};

/**
 * Story 4: Complete Example with Server Setup
 * 
 * Shows a complete, production-ready setup with:
 * - Custom server endpoint
 * - Authentication headers
 * - Full feature set enabled
 */
export const ProductionSetup: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm',
        'audio/mpeg',
        'audio/wav',
      ],
      offline: {
        enabled: true,
        fallbackToBase64: true,
        customUploadUrl: 'http://localhost:3001/api/upload',
        customUploadHeaders: {
          'Authorization': `Bearer ${'demo-token'}`,
        },
      },
      uploadUrl: '/api/media/upload',
      libraryUrl: '/api/media/library',
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>🚀 Production Setup:</strong> Full-featured configuration with authentication and fallback
      </div>
      <EditoraEditor {...args} />
    </div>
  ),
};

/**
 * Story 5: Migration Guide - From API-First to Offline-First
 * 
 * Shows how to migrate from the old API-first approach to the new offline-first approach.
 */
export const MigrationGuide: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        fallbackToBase64: true,
      },
      uploadUrl: '/api/media/upload',
      libraryUrl: '/api/media/library',
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', minHeight: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '20px', maxHeight: '400px', overflow: 'auto' }}>
        <h3>📚 Migration Guide: API-First → Offline-First</h3>
        
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <strong>❌ Old (Phase 16 - API-First):</strong>
          <pre style={{ marginTop: '10px', overflow: 'auto', fontSize: '11px' }}>
{`offline: {
  customUploadUrl: '...',
  fallbackToBase64: true
}
// API tried first, base64 was fallback`}
          </pre>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
          <strong>✅ New (Phase 17 - Offline-First):</strong>
          <pre style={{ marginTop: '10px', overflow: 'auto', fontSize: '11px' }}>
{`offline: {
  enabled: true,
  fallbackToBase64: true,
  customUploadUrl: '...'
}
// Base64 first, servers optional`}
          </pre>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0fff0', borderRadius: '4px' }}>
          <strong>🎯 Key Improvements:</strong>
          <ul style={{ marginTop: '10px', marginBottom: '0', fontSize: '13px' }}>
            <li>✅ Instant uploads (base64 immediate)</li>
            <li>✅ Works offline (no network required)</li>
            <li>✅ Servers optional (API/custom server as bonus)</li>
            <li>✅ Toast notifications (better UX)</li>
            <li>✅ Backward compatible (old config still works)</li>
          </ul>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '10px' }}>
        <strong>Try it below:</strong>
        <EditoraEditor {...args} />
      </div>
    </div>
  ),
};

/**
 * Story 6: Toast Notifications Example
 * 
 * Demonstrates the different toast notifications the media manager shows
 */
export const ToastNotificationsDemo: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        fallbackToBase64: true,
      },
    },
  },
  render: (args) => {
    const [notificationInfo, setNotificationInfo] = React.useState('');
    
    return (
      <div style={{ position: 'relative', minHeight: '600px', border: '1px solid #ddd' }}>
        <div style={{ padding: '20px', background: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
          <h3>🔔 Toast Notifications in Action</h3>
          <p style={{ color: '#666', fontSize: '13px', margin: '10px 0 0 0' }}>
            When you upload images, you'll see professional toast notifications showing the upload status.
          </p>
          
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#f1f8f4',
              borderLeft: '4px solid #4CAF50',
              borderRadius: '4px'
            }}>
              <strong style={{ color: '#4CAF50', fontSize: '12px' }}>✅ Success</strong>
              <p style={{ fontSize: '11px', marginTop: '5px', color: '#666' }}>
                Shows when image uploaded to server
              </p>
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: '#f1f5f8',
              borderLeft: '4px solid #2196F3',
              borderRadius: '4px'
            }}>
              <strong style={{ color: '#2196F3', fontSize: '12px' }}>📌 Info (Offline)</strong>
              <p style={{ fontSize: '11px', marginTop: '5px', color: '#666' }}>
                Shows when image stored as base64
              </p>
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: '#fdf1f1',
              borderLeft: '4px solid #f44336',
              borderRadius: '4px'
            }}>
              <strong style={{ color: '#f44336', fontSize: '12px' }}>⚠️ Error</strong>
              <p style={{ fontSize: '11px', marginTop: '5px', color: '#666' }}>
                Shows when upload fails
              </p>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', height: '500px', borderTop: '1px solid #ddd' }}>
          <EditoraEditor 
            {...args}
            defaultValue="<p>Try uploading an image above to see the toast notifications! 📸</p>"
          />
        </div>
      </div>
    );
  },
};

/**
 * Story 7: Setup Code Examples
 * 
 * Shows the actual code needed to implement the media manager with different configurations
 */
export const SetupCodeExamples: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        fallbackToBase64: true,
      },
    },
  },
  render: (args) => (
    <div style={{ minHeight: '900px', border: '1px solid #ddd' }}>
      <div style={{ padding: '30px', background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
        <h2>💻 Setup Code Examples</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Complete code snippets showing how to initialize and configure the media manager with various options
        </p>
      </div>

      <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Example 1: Minimal Setup */}
        <div>
          <h3 style={{ marginTop: '0', fontSize: '16px', borderBottom: '2px solid #4CAF50', paddingBottom: '10px' }}>
            ✅ Example 1: Minimal Setup (Offline Only)
          </h3>
          <pre style={{
            background: '#f4f4f4',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '1px solid #ddd'
          }}>
{`import { EditoraEditor } from '@editora/react';
import {
  ParagraphPlugin,
  BoldPlugin,
  ItalicPlugin,
  MediaManagerPlugin,
} from '@editora/plugins';
import '@editora/themes/themes/default.css';

export function MyEditor() {
  const plugins = [
    BoldPlugin(),
    ItalicPlugin(),
    MediaManagerPlugin(),
  ];

  return (
    <EditoraEditor
      plugins={plugins}
      mediaConfig={{
        maxFileSize: 52428800,
        allowedTypes: ['image/jpeg', 'image/png'],
        offline: {
          enabled: true,
          useBase64Permanently: true,
        },
      }}
    />
  );
}`}
          </pre>
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
            <strong style={{ fontSize: '12px' }}>💡 Use this when:</strong>
            <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#555' }}>No server available, images stored in document</p>
          </div>
        </div>

        {/* Example 2: With Custom Server */}
        <div>
          <h3 style={{ marginTop: '0', fontSize: '16px', borderBottom: '2px solid #2196F3', paddingBottom: '10px' }}>
            🌐 Example 2: With Custom Server Fallback
          </h3>
          <pre style={{
            background: '#f4f4f4',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '1px solid #ddd'
          }}>
{`import { EditoraEditor } from '@editora/react';
import { MediaManagerPlugin } from '@editora/plugins';

export function MyEditor() {
  return (
    <EditoraEditor
      plugins={[
        // ... other plugins
        MediaManagerPlugin(),
      ]}
      mediaConfig={{
        maxFileSize: 52428800,
        allowedTypes: [
          'image/jpeg',
          'image/png',
          'image/webp',
        ],
        offline: {
          enabled: true,
          fallbackToBase64: true,
          customUploadUrl:
            'http://localhost:3001/api/upload',
          customUploadHeaders: {
            'Authorization':
              'Bearer YOUR_TOKEN_HERE',
          },
        },
      }}
    />
  );
}`}
          </pre>
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
            <strong style={{ fontSize: '12px' }}>💡 Use this when:</strong>
            <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#555' }}>You have a custom server endpoint</p>
          </div>
        </div>

        {/* Example 3: Hybrid with API Optional */}
        <div>
          <h3 style={{ marginTop: '0', fontSize: '16px', borderBottom: '2px solid #FF9800', paddingBottom: '10px' }}>
            ⚡ Example 3: Hybrid with API Optional
          </h3>
          <pre style={{
            background: '#f4f4f4',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '1px solid #ddd'
          }}>
{`import { EditoraEditor } from '@editora/react';
import { MediaManagerPlugin } from '@editora/plugins';

export function MyEditor() {
  return (
    <EditoraEditor
      plugins={[MediaManagerPlugin()]}
      mediaConfig={{
        maxFileSize: 52428800,
        allowedTypes: [
          'image/jpeg',
          'image/png',
          'video/mp4',
        ],
        // Base64 used immediately
        offline: {
          enabled: true,
          fallbackToBase64: true,
        },
        // API upload tried in background
        uploadUrl: '/api/media/upload',
        libraryUrl: '/api/media/library',
      }}
    />
  );
}`}
          </pre>
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
            <strong style={{ fontSize: '12px' }}>💡 Use this when:</strong>
            <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#555' }}>You want instant response + server upload as bonus</p>
          </div>
        </div>

        {/* Example 4: Complete Production Setup */}
        <div>
          <h3 style={{ marginTop: '0', fontSize: '16px', borderBottom: '2px solid #9C27B0', paddingBottom: '10px' }}>
            🚀 Example 4: Production Setup
          </h3>
          <pre style={{
            background: '#f4f4f4',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '1px solid #ddd'
          }}>
{`// config/mediaConfig.ts
export const mediaConfig = {
  maxFileSize: 52428800,
  allowedTypes: [
    'image/*',
    'video/mp4',
    'audio/mpeg',
  ],
  offline: {
    enabled: true,
    fallbackToBase64: true,
    customUploadUrl:
      process.env.CUSTOM_UPLOAD_URL,
    customUploadHeaders: {
      'Authorization':
        \`Bearer \${getAuthToken()}\`,
      'X-Custom-Header': 'value',
    },
  },
  uploadUrl: '/api/media/upload',
  libraryUrl: '/api/media/library',
};

// MyEditor.tsx
import { EditoraEditor } from '@editora/react';
import { mediaConfig } from './config/mediaConfig';

export function MyEditor() {
  return (
    <EditoraEditor
      plugins={[MediaManagerPlugin()]}
      mediaConfig={mediaConfig}
    />
  );
}`}
          </pre>
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
            <strong style={{ fontSize: '12px' }}>💡 Use this when:</strong>
            <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#555' }}>Multiple editors, environment variables, authentication</p>
          </div>
        </div>
      </div>

      {/* Configuration Options Reference */}
      <div style={{ padding: '30px', background: '#fafafa', borderTop: '2px solid #ddd' }}>
        <h3 style={{ marginTop: '0', fontSize: '16px', borderBottom: '2px solid #666', paddingBottom: '10px' }}>
          ⚙️ Configuration Options Reference
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          
          {/* Offline Options */}
          <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <h4 style={{ marginTop: '0', color: '#2196F3' }}>📱 offline Options</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '3px',
              fontSize: '11px',
              overflow: 'auto'
            }}>
{`offline: {
  // Enable offline mode
  enabled: true,

  // Force base64 only
  useBase64Permanently: false,

  // Fallback when server fails
  fallbackToBase64: true,

  // Custom server (optional)
  customUploadUrl: 'https://...',

  // Auth headers (optional)
  customUploadHeaders: {
    'Authorization': 'Bearer token'
  }
}`}
            </pre>
          </div>

          {/* File Options */}
          <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <h4 style={{ marginTop: '0', color: '#4CAF50' }}>📄 File Options</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '3px',
              fontSize: '11px',
              overflow: 'auto'
            }}>
{`mediaConfig: {
  // Max file size (bytes)
  maxFileSize: 52428800,

  // Allowed MIME types
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'video/mp4'
  ],

  // API endpoints (optional)
  uploadUrl: '/api/upload',
  libraryUrl: '/api/library',

  // Offline config
  offline: { ... }
}`}
            </pre>
          </div>
        </div>

        {/* Common Patterns */}
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '4px', border: '1px solid #4CAF50' }}>
          <h4 style={{ marginTop: '0', color: '#2e7d32' }}>🎯 Common Patterns</h4>
          <ul style={{ fontSize: '12px', lineHeight: '1.8', color: '#555' }}>
            <li><strong>Development:</strong> Use base64 only (no server needed)</li>
            <li><strong>Staging:</strong> Use hybrid mode (base64 + optional API)</li>
            <li><strong>Production:</strong> Use custom server + fallback to base64</li>
            <li><strong>Self-Hosted:</strong> Use custom server with auth headers</li>
            <li><strong>SaaS:</strong> Use API endpoints + optional custom server</li>
          </ul>
        </div>
      </div>

      {/* Live Editor Example */}
      <div style={{ padding: '30px', borderTop: '2px solid #ddd' }}>
        <h3 style={{ marginTop: '0' }}>👇 Try it below (Live Editor)</h3>
        <div style={{ position: 'relative', height: '400px', marginTop: '20px' }}>
          <EditoraEditor
            {...args}
            defaultValue="<p>This editor uses the hybrid mode configuration from Example 3 above. Try uploading an image! 📸</p>"
          />
        </div>
      </div>
    </div>
  ),
};
