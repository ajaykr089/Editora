import{j as n,B as o,a as e,G as f}from"./index-ce0e40fa.js";import{R as X}from"./index-93f6b7ae.js";import{R as r}from"./RichTextEditor-c94fbf83.js";import{H as $}from"./HeadingPlugin.native-b74ae03d.js";import{B as J,I as Q,U as Z,L as ee,a as ne,T as oe,H as ie,M as re}from"./A11yCheckerPlugin.native-b89c1fcd.js";import{S as ae,C as te,B as de,a as le,F as se,b as pe,T as ge}from"./TextAlignmentPlugin.native-8d0de10f.js";/* empty css                */import"./index-c197feae.js";import"./index-76e7d200.js";import"./SearchExtension-5db95884.js";import"./ReadOnlyExtension-88fcf3b5.js";const we={title:"Editor/MediaManager - Offline-First Upload",component:r,parameters:{layout:"padded",docs:{source:{type:"code"},description:{component:`Media Manager Stories - Demonstrating Offline-First Upload

This showcases the new offline-first media manager that:
- Uses base64 by default for true offline capability
- Supports optional custom server upload
- Uses toast notifications for user feedback
- Works without any backend API required`}}}},a=[$(),J(),Q(),Z(),ae(),te(),ee(),de(),ne(),le(),oe(),ie(),re(),se(),pe(),ge()],t={args:{plugins:a,mediaConfig:{maxFileSize:52428800,allowedTypes:["image/jpeg","image/png","image/webp","image/gif"],offline:{enabled:!0,useBase64Permanently:!0,fallbackToBase64:!0}}},render:i=>n(o,{style:{position:"relative",height:"600px",border:"1px solid #ddd"},children:[n(o,{style:{padding:"10px",background:"#f0f8ff",marginBottom:"10px"},children:[e("strong",{children:"📱 Pure Offline Mode:"})," All images stored as base64. No server required!"]}),e(r,{...i})]})},d={args:{plugins:a,mediaConfig:{maxFileSize:52428800,allowedTypes:["image/jpeg","image/png","image/webp","image/gif"],offline:{enabled:!0,fallbackToBase64:!0,customUploadUrl:"http://localhost:3001/api/upload",customUploadHeaders:{Authorization:"Bearer your-token-here"}}}},render:i=>n(o,{style:{position:"relative",height:"600px",border:"1px solid #ddd"},children:[n(o,{style:{padding:"10px",background:"#fff8f0",marginBottom:"10px"},children:[e("strong",{children:"🌐 Offline-First with Custom Server:"})," Tries server first, falls back to base64 if unavailable"]}),e(r,{...i})]})},l={args:{plugins:a,mediaConfig:{maxFileSize:52428800,allowedTypes:["image/jpeg","image/png","image/webp","image/gif","video/mp4"],offline:{enabled:!0,fallbackToBase64:!0},uploadUrl:"/api/media/upload",libraryUrl:"/api/media/library"}},render:i=>n(o,{style:{position:"relative",height:"600px",border:"1px solid #ddd"},children:[n(o,{style:{padding:"10px",background:"#f0fff0",marginBottom:"10px"},children:[e("strong",{children:"⚡ Hybrid Mode:"})," Base64 default + optional API upload in background"]}),e(r,{...i})]})},s={args:{plugins:a,mediaConfig:{maxFileSize:52428800,allowedTypes:["image/jpeg","image/png","image/webp","image/gif","video/mp4","video/webm","audio/mpeg","audio/wav"],offline:{enabled:!0,fallbackToBase64:!0,customUploadUrl:"http://localhost:3001/api/upload",customUploadHeaders:{Authorization:"Bearer demo-token"}},uploadUrl:"/api/media/upload",libraryUrl:"/api/media/library"}},render:i=>n(o,{style:{position:"relative",height:"600px",border:"1px solid #ddd"},children:[n(o,{style:{padding:"10px",background:"#f5f5f5",marginBottom:"10px"},children:[e("strong",{children:"🚀 Production Setup:"})," Full-featured configuration with authentication and fallback"]}),e(r,{...i})]})},p={args:{plugins:a,mediaConfig:{maxFileSize:52428800,allowedTypes:["image/jpeg","image/png","image/webp","image/gif"],offline:{enabled:!0,fallbackToBase64:!0},uploadUrl:"/api/media/upload",libraryUrl:"/api/media/library"}},render:i=>n(o,{style:{position:"relative",minHeight:"600px",border:"1px solid #ddd"},children:[n(o,{style:{padding:"20px",maxHeight:"400px",overflow:"auto"},children:[e("h3",{children:"📚 Migration Guide: API-First → Offline-First"}),n(o,{style:{marginBottom:"20px",padding:"15px",backgroundColor:"#fff3cd",borderRadius:"4px"},children:[e("strong",{children:"❌ Old (Phase 16 - API-First):"}),e("pre",{style:{marginTop:"10px",overflow:"auto",fontSize:"11px"},children:`offline: {
  customUploadUrl: '...',
  fallbackToBase64: true
}
// API tried first, base64 was fallback`})]}),n(o,{style:{marginBottom:"20px",padding:"15px",backgroundColor:"#d4edda",borderRadius:"4px"},children:[e("strong",{children:"✅ New (Phase 17 - Offline-First):"}),e("pre",{style:{marginTop:"10px",overflow:"auto",fontSize:"11px"},children:`offline: {
  enabled: true,
  fallbackToBase64: true,
  customUploadUrl: '...'
}
// Base64 first, servers optional`})]}),n(o,{style:{marginBottom:"20px",padding:"15px",backgroundColor:"#f0fff0",borderRadius:"4px"},children:[e("strong",{children:"🎯 Key Improvements:"}),n("ul",{style:{marginTop:"10px",marginBottom:"0",fontSize:"13px"},children:[e("li",{children:"✅ Instant uploads (base64 immediate)"}),e("li",{children:"✅ Works offline (no network required)"}),e("li",{children:"✅ Servers optional (API/custom server as bonus)"}),e("li",{children:"✅ Toast notifications (better UX)"}),e("li",{children:"✅ Backward compatible (old config still works)"})]})]})]}),n(o,{style:{borderTop:"1px solid #ddd",paddingTop:"10px",marginTop:"10px"},children:[e("strong",{children:"Try it below:"}),e(r,{...i})]})]})},g={args:{plugins:a,mediaConfig:{maxFileSize:52428800,allowedTypes:["image/jpeg","image/png","image/webp","image/gif"],offline:{enabled:!0,fallbackToBase64:!0}}},render:i=>(X.useState(""),n(o,{style:{position:"relative",minHeight:"600px",border:"1px solid #ddd"},children:[n(o,{style:{padding:"20px",background:"#f9f9f9",borderBottom:"1px solid #ddd"},children:[e("h3",{children:"🔔 Toast Notifications in Action"}),e("p",{style:{color:"#666",fontSize:"13px",margin:"10px 0 0 0"},children:"When you upload images, you'll see professional toast notifications showing the upload status."}),n(f,{style:{marginTop:"20px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"},children:[n(o,{style:{padding:"15px",backgroundColor:"#f1f8f4",borderLeft:"4px solid #4CAF50",borderRadius:"4px"},children:[e("strong",{style:{color:"#4CAF50",fontSize:"12px"},children:"✅ Success"}),e("p",{style:{fontSize:"11px",marginTop:"5px",color:"#666"},children:"Shows when image uploaded to server"})]}),n(o,{style:{padding:"15px",backgroundColor:"#f1f5f8",borderLeft:"4px solid #2196F3",borderRadius:"4px"},children:[e("strong",{style:{color:"#2196F3",fontSize:"12px"},children:"📌 Info (Offline)"}),e("p",{style:{fontSize:"11px",marginTop:"5px",color:"#666"},children:"Shows when image stored as base64"})]}),n(o,{style:{padding:"15px",backgroundColor:"#fdf1f1",borderLeft:"4px solid #f44336",borderRadius:"4px"},children:[e("strong",{style:{color:"#f44336",fontSize:"12px"},children:"⚠️ Error"}),e("p",{style:{fontSize:"11px",marginTop:"5px",color:"#666"},children:"Shows when upload fails"})]})]})]}),e(o,{style:{position:"relative",height:"500px",borderTop:"1px solid #ddd"},children:e(r,{...i,defaultValue:"<p>Try uploading an image above to see the toast notifications! 📸</p>"})})]}))},u={args:{plugins:a,mediaConfig:{maxFileSize:52428800,allowedTypes:["image/jpeg","image/png","image/webp","image/gif"],offline:{enabled:!0,fallbackToBase64:!0}}},render:i=>n(o,{style:{minHeight:"900px",border:"1px solid #ddd"},children:[n(o,{style:{padding:"30px",background:"#f5f5f5",borderBottom:"2px solid #ddd"},children:[e("h2",{children:"💻 Setup Code Examples"}),e("p",{style:{color:"#666",marginTop:"10px"},children:"Complete code snippets showing how to initialize and configure the media manager with various options"})]}),n(f,{style:{padding:"30px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"30px"},children:[n("div",{children:[e("h3",{style:{marginTop:"0",fontSize:"16px",borderBottom:"2px solid #4CAF50",paddingBottom:"10px"},children:"✅ Example 1: Minimal Setup (Offline Only)"}),e("pre",{style:{background:"#f4f4f4",padding:"15px",borderRadius:"4px",overflow:"auto",fontSize:"12px",lineHeight:"1.4",border:"1px solid #ddd"},children:`import { EditoraEditor } from '@editora/react';
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
}`}),n(o,{style:{marginTop:"10px",padding:"10px",backgroundColor:"#e8f5e9",borderRadius:"4px"},children:[e("strong",{style:{fontSize:"12px"},children:"💡 Use this when:"}),e("p",{style:{fontSize:"11px",margin:"5px 0 0 0",color:"#555"},children:"No server available, images stored in document"})]})]}),n("div",{children:[e("h3",{style:{marginTop:"0",fontSize:"16px",borderBottom:"2px solid #2196F3",paddingBottom:"10px"},children:"🌐 Example 2: With Custom Server Fallback"}),e("pre",{style:{background:"#f4f4f4",padding:"15px",borderRadius:"4px",overflow:"auto",fontSize:"12px",lineHeight:"1.4",border:"1px solid #ddd"},children:`import { EditoraEditor } from '@editora/react';
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
}`}),n(o,{style:{marginTop:"10px",padding:"10px",backgroundColor:"#e3f2fd",borderRadius:"4px"},children:[e("strong",{style:{fontSize:"12px"},children:"💡 Use this when:"}),e("p",{style:{fontSize:"11px",margin:"5px 0 0 0",color:"#555"},children:"You have a custom server endpoint"})]})]}),n("div",{children:[e("h3",{style:{marginTop:"0",fontSize:"16px",borderBottom:"2px solid #FF9800",paddingBottom:"10px"},children:"⚡ Example 3: Hybrid with API Optional"}),e("pre",{style:{background:"#f4f4f4",padding:"15px",borderRadius:"4px",overflow:"auto",fontSize:"12px",lineHeight:"1.4",border:"1px solid #ddd"},children:`import { EditoraEditor } from '@editora/react';
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
}`}),n(o,{style:{marginTop:"10px",padding:"10px",backgroundColor:"#fff3e0",borderRadius:"4px"},children:[e("strong",{style:{fontSize:"12px"},children:"💡 Use this when:"}),e("p",{style:{fontSize:"11px",margin:"5px 0 0 0",color:"#555"},children:"You want instant response + server upload as bonus"})]})]}),n("div",{children:[e("h3",{style:{marginTop:"0",fontSize:"16px",borderBottom:"2px solid #9C27B0",paddingBottom:"10px"},children:"🚀 Example 4: Production Setup"}),e("pre",{style:{background:"#f4f4f4",padding:"15px",borderRadius:"4px",overflow:"auto",fontSize:"12px",lineHeight:"1.4",border:"1px solid #ddd"},children:`// config/mediaConfig.ts
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
      ({}).CUSTOM_UPLOAD_URL,
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
}`}),n(o,{style:{marginTop:"10px",padding:"10px",backgroundColor:"#f3e5f5",borderRadius:"4px"},children:[e("strong",{style:{fontSize:"12px"},children:"💡 Use this when:"}),e("p",{style:{fontSize:"11px",margin:"5px 0 0 0",color:"#555"},children:"Multiple editors, environment variables, authentication"})]})]})]}),n(o,{style:{padding:"30px",background:"#fafafa",borderTop:"2px solid #ddd"},children:[e("h3",{style:{marginTop:"0",fontSize:"16px",borderBottom:"2px solid #666",paddingBottom:"10px"},children:"⚙️ Configuration Options Reference"}),n(f,{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginTop:"20px"},children:[n(o,{style:{padding:"15px",backgroundColor:"#fff",borderRadius:"4px",border:"1px solid #e0e0e0"},children:[e("h4",{style:{marginTop:"0",color:"#2196F3"},children:"📱 offline Options"}),e("pre",{style:{background:"#f5f5f5",padding:"10px",borderRadius:"3px",fontSize:"11px",overflow:"auto"},children:`offline: {
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
}`})]}),n(o,{style:{padding:"15px",backgroundColor:"#fff",borderRadius:"4px",border:"1px solid #e0e0e0"},children:[e("h4",{style:{marginTop:"0",color:"#4CAF50"},children:"📄 File Options"}),e("pre",{style:{background:"#f5f5f5",padding:"10px",borderRadius:"3px",fontSize:"11px",overflow:"auto"},children:`mediaConfig: {
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
}`})]})]}),n(o,{style:{marginTop:"30px",padding:"20px",backgroundColor:"#e8f5e9",borderRadius:"4px",border:"1px solid #4CAF50"},children:[e("h4",{style:{marginTop:"0",color:"#2e7d32"},children:"🎯 Common Patterns"}),n("ul",{style:{fontSize:"12px",lineHeight:"1.8",color:"#555"},children:[n("li",{children:[e("strong",{children:"Development:"})," Use base64 only (no server needed)"]}),n("li",{children:[e("strong",{children:"Staging:"})," Use hybrid mode (base64 + optional API)"]}),n("li",{children:[e("strong",{children:"Production:"})," Use custom server + fallback to base64"]}),n("li",{children:[e("strong",{children:"Self-Hosted:"})," Use custom server with auth headers"]}),n("li",{children:[e("strong",{children:"SaaS:"})," Use API endpoints + optional custom server"]})]})]})]}),n(o,{style:{padding:"30px",borderTop:"2px solid #ddd"},children:[e("h3",{style:{marginTop:"0"},children:"👇 Try it below (Live Editor)"}),e(o,{style:{position:"relative",height:"400px",marginTop:"20px"},children:e(r,{...i,defaultValue:"<p>This editor uses the hybrid mode configuration from Example 3 above. Try uploading an image! 📸</p>"})})]})]})};var m,c,x,h,b;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      // 50MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        useBase64Permanently: true,
        // Force base64 only
        fallbackToBase64: true
      }
    }
  },
  render: args => <Box style={{
    position: 'relative',
    height: '600px',
    border: '1px solid #ddd'
  }}>
      <Box style={{
      padding: '10px',
      background: '#f0f8ff',
      marginBottom: '10px'
    }}>
        <strong>📱 Pure Offline Mode:</strong> All images stored as base64. No server required!
      </Box>
      <EditoraEditor {...args} />
    </Box>
}`,...(x=(c=t.parameters)==null?void 0:c.docs)==null?void 0:x.source},description:{story:`Story 1: Pure Offline Mode (Base64 Only)

The simplest configuration - images are stored as base64 directly in the content.
Perfect for standalone applications without any server.`,...(b=(h=t.parameters)==null?void 0:h.docs)==null?void 0:b.description}}};var y,B,S,T,w;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
          'Authorization': 'Bearer your-token-here'
        }
      }
    }
  },
  render: args => <Box style={{
    position: 'relative',
    height: '600px',
    border: '1px solid #ddd'
  }}>
      <Box style={{
      padding: '10px',
      background: '#fff8f0',
      marginBottom: '10px'
    }}>
        <strong>🌐 Offline-First with Custom Server:</strong> Tries server first, falls back to base64 if unavailable
      </Box>
      <EditoraEditor {...args} />
    </Box>
}`,...(S=(B=d.parameters)==null?void 0:B.docs)==null?void 0:S.source},description:{story:`Story 2: Offline-First with Custom Server Fallback

Tries to upload to a custom server, falls back to base64 if unavailable.
This is the recommended setup for most applications.`,...(w=(T=d.parameters)==null?void 0:T.docs)==null?void 0:w.description}}};var C,v,k,P,E;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
      offline: {
        enabled: true,
        fallbackToBase64: true
      },
      uploadUrl: '/api/media/upload',
      libraryUrl: '/api/media/library'
    }
  },
  render: args => <Box style={{
    position: 'relative',
    height: '600px',
    border: '1px solid #ddd'
  }}>
      <Box style={{
      padding: '10px',
      background: '#f0fff0',
      marginBottom: '10px'
    }}>
        <strong>⚡ Hybrid Mode:</strong> Base64 default + optional API upload in background
      </Box>
      <EditoraEditor {...args} />
    </Box>
}`,...(k=(v=l.parameters)==null?void 0:v.docs)==null?void 0:k.source},description:{story:`Story 3: Hybrid Mode - API Optional

Uses base64 by default but tries API upload if available.
Best user experience: always works offline, faster with API.`,...(E=(P=l.parameters)==null?void 0:P.docs)==null?void 0:E.description}}};var z,F,U,M,A;s.parameters={...s.parameters,docs:{...(z=s.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav'],
      offline: {
        enabled: true,
        fallbackToBase64: true,
        customUploadUrl: 'http://localhost:3001/api/upload',
        customUploadHeaders: {
          'Authorization': \`Bearer \${'demo-token'}\`
        }
      },
      uploadUrl: '/api/media/upload',
      libraryUrl: '/api/media/library'
    }
  },
  render: args => <Box style={{
    position: 'relative',
    height: '600px',
    border: '1px solid #ddd'
  }}>
      <Box style={{
      padding: '10px',
      background: '#f5f5f5',
      marginBottom: '10px'
    }}>
        <strong>🚀 Production Setup:</strong> Full-featured configuration with authentication and fallback
      </Box>
      <EditoraEditor {...args} />
    </Box>
}`,...(U=(F=s.parameters)==null?void 0:F.docs)==null?void 0:U.source},description:{story:`Story 4: Complete Example with Server Setup

Shows a complete, production-ready setup with:
- Custom server endpoint
- Authentication headers
- Full feature set enabled`,...(A=(M=s.parameters)==null?void 0:M.docs)==null?void 0:A.description}}};var D,O,R,H,I;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        fallbackToBase64: true
      },
      uploadUrl: '/api/media/upload',
      libraryUrl: '/api/media/library'
    }
  },
  render: args => <Box style={{
    position: 'relative',
    minHeight: '600px',
    border: '1px solid #ddd'
  }}>
      <Box style={{
      padding: '20px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
        <h3>📚 Migration Guide: API-First → Offline-First</h3>
        
        <Box style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '4px'
      }}>
          <strong>❌ Old (Phase 16 - API-First):</strong>
          <pre style={{
          marginTop: '10px',
          overflow: 'auto',
          fontSize: '11px'
        }}>
          {\`offline: {
  customUploadUrl: '...',
  fallbackToBase64: true
}
// API tried first, base64 was fallback\`}
          </pre>
        </Box>

        <Box style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#d4edda',
        borderRadius: '4px'
      }}>
          <strong>✅ New (Phase 17 - Offline-First):</strong>
          <pre style={{
          marginTop: '10px',
          overflow: 'auto',
          fontSize: '11px'
        }}>
          {\`offline: {
  enabled: true,
  fallbackToBase64: true,
  customUploadUrl: '...'
}
// Base64 first, servers optional\`}
          </pre>
        </Box>

        <Box style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f0fff0',
        borderRadius: '4px'
      }}>
          <strong>🎯 Key Improvements:</strong>
          <ul style={{
          marginTop: '10px',
          marginBottom: '0',
          fontSize: '13px'
        }}>
            <li>✅ Instant uploads (base64 immediate)</li>
            <li>✅ Works offline (no network required)</li>
            <li>✅ Servers optional (API/custom server as bonus)</li>
            <li>✅ Toast notifications (better UX)</li>
            <li>✅ Backward compatible (old config still works)</li>
          </ul>
        </Box>
      </Box>
      
      <Box style={{
      borderTop: '1px solid #ddd',
      paddingTop: '10px',
      marginTop: '10px'
    }}>
        <strong>Try it below:</strong>
        <EditoraEditor {...args} />
      </Box>
    </Box>
}`,...(R=(O=p.parameters)==null?void 0:O.docs)==null?void 0:R.source},description:{story:`Story 5: Migration Guide - From API-First to Offline-First

Shows how to migrate from the old API-first approach to the new offline-first approach.`,...(I=(H=p.parameters)==null?void 0:H.docs)==null?void 0:I.description}}};var j,L,N,G,W;g.parameters={...g.parameters,docs:{...(j=g.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        fallbackToBase64: true
      }
    }
  },
  render: args => {
    const [notificationInfo, setNotificationInfo] = React.useState('');
    return <Box style={{
      position: 'relative',
      minHeight: '600px',
      border: '1px solid #ddd'
    }}>
        <Box style={{
        padding: '20px',
        background: '#f9f9f9',
        borderBottom: '1px solid #ddd'
      }}>
          <h3>🔔 Toast Notifications in Action</h3>
          <p style={{
          color: '#666',
          fontSize: '13px',
          margin: '10px 0 0 0'
        }}>
            When you upload images, you'll see professional toast notifications showing the upload status.
          </p>
          
          <Grid style={{
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '10px'
        }}>
            <Box style={{
            padding: '15px',
            backgroundColor: '#f1f8f4',
            borderLeft: '4px solid #4CAF50',
            borderRadius: '4px'
          }}>
              <strong style={{
              color: '#4CAF50',
              fontSize: '12px'
            }}>✅ Success</strong>
              <p style={{
              fontSize: '11px',
              marginTop: '5px',
              color: '#666'
            }}>
                Shows when image uploaded to server
              </p>
            </Box>

            <Box style={{
            padding: '15px',
            backgroundColor: '#f1f5f8',
            borderLeft: '4px solid #2196F3',
            borderRadius: '4px'
          }}>
              <strong style={{
              color: '#2196F3',
              fontSize: '12px'
            }}>📌 Info (Offline)</strong>
              <p style={{
              fontSize: '11px',
              marginTop: '5px',
              color: '#666'
            }}>
                Shows when image stored as base64
              </p>
            </Box>

            <Box style={{
            padding: '15px',
            backgroundColor: '#fdf1f1',
            borderLeft: '4px solid #f44336',
            borderRadius: '4px'
          }}>
              <strong style={{
              color: '#f44336',
              fontSize: '12px'
            }}>⚠️ Error</strong>
              <p style={{
              fontSize: '11px',
              marginTop: '5px',
              color: '#666'
            }}>
                Shows when upload fails
              </p>
            </Box>
          </Grid>
        </Box>

        <Box style={{
        position: 'relative',
        height: '500px',
        borderTop: '1px solid #ddd'
      }}>
          <EditoraEditor {...args} defaultValue="<p>Try uploading an image above to see the toast notifications! 📸</p>" />
        </Box>
      </Box>;
  }
}`,...(N=(L=g.parameters)==null?void 0:L.docs)==null?void 0:N.source},description:{story:`Story 6: Toast Notifications Example

Demonstrates the different toast notifications the media manager shows`,...(W=(G=g.parameters)==null?void 0:G.docs)==null?void 0:W.description}}};var _,q,Y,K,V;u.parameters={...u.parameters,docs:{...(_=u.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        fallbackToBase64: true
      }
    }
  },
  render: args => <Box style={{
    minHeight: '900px',
    border: '1px solid #ddd'
  }}>
      <Box style={{
      padding: '30px',
      background: '#f5f5f5',
      borderBottom: '2px solid #ddd'
    }}>
        <h2>💻 Setup Code Examples</h2>
        <p style={{
        color: '#666',
        marginTop: '10px'
      }}>
          Complete code snippets showing how to initialize and configure the media manager with various options
        </p>
      </Box>

      <Grid style={{
      padding: '30px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px'
    }}>
        
        {/* Example 1: Minimal Setup */}
        <div>
          <h3 style={{
          marginTop: '0',
          fontSize: '16px',
          borderBottom: '2px solid #4CAF50',
          paddingBottom: '10px'
        }}>
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
          {\`import { EditoraEditor } from '@editora/react';
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
}\`}
          </pre>
          <Box style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#e8f5e9',
          borderRadius: '4px'
        }}>
            <strong style={{
            fontSize: '12px'
          }}>💡 Use this when:</strong>
            <p style={{
            fontSize: '11px',
            margin: '5px 0 0 0',
            color: '#555'
          }}>No server available, images stored in document</p>
          </Box>
        </div>

        {/* Example 2: With Custom Server */}
        <div>
          <h3 style={{
          marginTop: '0',
          fontSize: '16px',
          borderBottom: '2px solid #2196F3',
          paddingBottom: '10px'
        }}>
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
          {\`import { EditoraEditor } from '@editora/react';
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
}\`}
          </pre>
          <Box style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px'
        }}>
            <strong style={{
            fontSize: '12px'
          }}>💡 Use this when:</strong>
            <p style={{
            fontSize: '11px',
            margin: '5px 0 0 0',
            color: '#555'
          }}>You have a custom server endpoint</p>
          </Box>
        </div>

        {/* Example 3: Hybrid with API Optional */}
        <div>
          <h3 style={{
          marginTop: '0',
          fontSize: '16px',
          borderBottom: '2px solid #FF9800',
          paddingBottom: '10px'
        }}>
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
          {\`import { EditoraEditor } from '@editora/react';
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
}\`}
          </pre>
          <Box style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#fff3e0',
          borderRadius: '4px'
        }}>
            <strong style={{
            fontSize: '12px'
          }}>💡 Use this when:</strong>
            <p style={{
            fontSize: '11px',
            margin: '5px 0 0 0',
            color: '#555'
          }}>You want instant response + server upload as bonus</p>
          </Box>
        </div>

        {/* Example 4: Complete Production Setup */}
        <div>
          <h3 style={{
          marginTop: '0',
          fontSize: '16px',
          borderBottom: '2px solid #9C27B0',
          paddingBottom: '10px'
        }}>
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
          {\`// config/mediaConfig.ts
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
      ({}).CUSTOM_UPLOAD_URL,
    customUploadHeaders: {
      'Authorization':
        \\\`Bearer \\\${getAuthToken()}\\\`,
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
}\`}
          </pre>
          <Box style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#f3e5f5',
          borderRadius: '4px'
        }}>
            <strong style={{
            fontSize: '12px'
          }}>💡 Use this when:</strong>
            <p style={{
            fontSize: '11px',
            margin: '5px 0 0 0',
            color: '#555'
          }}>Multiple editors, environment variables, authentication</p>
          </Box>
        </div>
      </Grid>

      {/* Configuration Options Reference */}
      <Box style={{
      padding: '30px',
      background: '#fafafa',
      borderTop: '2px solid #ddd'
    }}>
        <h3 style={{
        marginTop: '0',
        fontSize: '16px',
        borderBottom: '2px solid #666',
        paddingBottom: '10px'
      }}>
          ⚙️ Configuration Options Reference
        </h3>
        
        <Grid style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginTop: '20px'
      }}>
          
          {/* Offline Options */}
          <Box style={{
          padding: '15px',
          backgroundColor: '#fff',
          borderRadius: '4px',
          border: '1px solid #e0e0e0'
        }}>
            <h4 style={{
            marginTop: '0',
            color: '#2196F3'
          }}>📱 offline Options</h4>
            <pre style={{
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '3px',
            fontSize: '11px',
            overflow: 'auto'
          }}>
            {\`offline: {
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
}\`}
            </pre>
          </Box>

          {/* File Options */}
          <Box style={{
          padding: '15px',
          backgroundColor: '#fff',
          borderRadius: '4px',
          border: '1px solid #e0e0e0'
        }}>
            <h4 style={{
            marginTop: '0',
            color: '#4CAF50'
          }}>📄 File Options</h4>
            <pre style={{
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '3px',
            fontSize: '11px',
            overflow: 'auto'
          }}>
            {\`mediaConfig: {
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
}\`}
            </pre>
          </Box>
        </Grid>

        {/* Common Patterns */}
        <Box style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e8f5e9',
        borderRadius: '4px',
        border: '1px solid #4CAF50'
      }}>
          <h4 style={{
          marginTop: '0',
          color: '#2e7d32'
        }}>🎯 Common Patterns</h4>
          <ul style={{
          fontSize: '12px',
          lineHeight: '1.8',
          color: '#555'
        }}>
            <li><strong>Development:</strong> Use base64 only (no server needed)</li>
            <li><strong>Staging:</strong> Use hybrid mode (base64 + optional API)</li>
            <li><strong>Production:</strong> Use custom server + fallback to base64</li>
            <li><strong>Self-Hosted:</strong> Use custom server with auth headers</li>
            <li><strong>SaaS:</strong> Use API endpoints + optional custom server</li>
          </ul>
        </Box>
      </Box>

      {/* Live Editor Example */}
      <Box style={{
      padding: '30px',
      borderTop: '2px solid #ddd'
    }}>
        <h3 style={{
        marginTop: '0'
      }}>👇 Try it below (Live Editor)</h3>
        <Box style={{
        position: 'relative',
        height: '400px',
        marginTop: '20px'
      }}>
          <EditoraEditor {...args} defaultValue="<p>This editor uses the hybrid mode configuration from Example 3 above. Try uploading an image! 📸</p>" />
        </Box>
      </Box>
    </Box>
}`,...(Y=(q=u.parameters)==null?void 0:q.docs)==null?void 0:Y.source},description:{story:`Story 7: Setup Code Examples

Shows the actual code needed to implement the media manager with different configurations`,...(V=(K=u.parameters)==null?void 0:K.docs)==null?void 0:V.description}}};const Ce=["PureOfflineMode","OfflineFirstWithCustomServer","HybridModeApiOptional","ProductionSetup","MigrationGuide","ToastNotificationsDemo","SetupCodeExamples"];export{l as HybridModeApiOptional,p as MigrationGuide,d as OfflineFirstWithCustomServer,s as ProductionSetup,t as PureOfflineMode,u as SetupCodeExamples,g as ToastNotificationsDemo,Ce as __namedExportsOrder,we as default};
