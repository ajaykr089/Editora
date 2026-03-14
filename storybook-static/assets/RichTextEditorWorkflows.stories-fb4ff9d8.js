import{j as n,B as r,a as e,G as f}from"./index-ce0e40fa.js";import{R as a}from"./RichTextEditor-c94fbf83.js";import"./index-93f6b7ae.js";/* empty css                *//* empty css             */import{a as d}from"./richTextEditor.shared-ed45b9c5.js";import"./index-c197feae.js";import"./HeadingPlugin.native-b74ae03d.js";import"./A11yCheckerPlugin.native-b89c1fcd.js";import"./TextAlignmentPlugin.native-8d0de10f.js";import"./index-76e7d200.js";import"./SearchExtension-5db95884.js";import"./ReadOnlyExtension-88fcf3b5.js";import"./ApprovalWorkflowPlugin.native-eaed16b3.js";import"./ContentRulesPlugin.native-706a3efc.js";import"./PIIRedactionPlugin.native-6cafc2ca.js";import"./iframe-836ccd9e.js";import"../sb-preview/runtime.js";const P={title:"Editor/Rich Text Editor - Web Component/Collaboration & Workflows",component:a,parameters:{layout:"padded",docs:{source:{type:"code"},description:{component:"Workflow-heavy editor scenarios were split out so the base docs page no longer mounts every enterprise example at once."}}}},o={render:()=>n("div",{children:[n(r,{style:{marginBottom:"20px",padding:"15px",background:"#f3e5f5",borderRadius:"4px"},children:[e("h3",{style:{margin:"0 0 10px 0"},children:"Framework Independence"}),e("p",{style:{margin:0,fontSize:"14px"},children:"The same editor works in React, Vue, Angular, Svelte, or vanilla JavaScript."}),n(f,{style:{marginTop:"15px",display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"10px",fontSize:"13px"},children:[n(r,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[e("strong",{children:"React:"}),e("br",{}),e("code",{style:{fontSize:"11px"},children:"<EditoraEditor />"})]}),n(r,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[e("strong",{children:"Vanilla JS:"}),e("br",{}),e("code",{style:{fontSize:"11px"},children:"<editora-editor>"})]}),n(r,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[e("strong",{children:"Vue:"}),e("br",{}),e("code",{style:{fontSize:"11px"},children:"<editora-editor>"})]}),n(r,{style:{padding:"10px",background:"white",borderRadius:"4px"},children:[e("strong",{children:"Angular:"}),e("br",{}),e("code",{style:{fontSize:"11px"},children:"<editora-editor>"})]})]})]}),e(a,{plugins:d,statusbar:{enabled:!0},defaultValue:`
          <h2>Universal Editor</h2>
          <p><strong>Zero framework dependencies.</strong></p>
          <h3>Works With</h3>
          <ul>
            <li>React</li>
            <li>Vue.js</li>
            <li>Angular</li>
            <li>Svelte</li>
            <li>Vanilla JavaScript</li>
          </ul>
          <blockquote>Build once, use everywhere.</blockquote>
        `})]})},t={render:()=>n("div",{children:[n(r,{style:{marginBottom:"16px",padding:"14px",background:"#ecfdf5",borderRadius:"8px"},children:[e("h4",{style:{margin:"0 0 8px 0"},children:"Doc Schema Workflow"}),n("p",{style:{margin:0,fontSize:"13px"},children:["Use ",e("code",{children:"Ctrl/Cmd+Alt+Shift+G"})," to open schema validation, review missing sections, and normalize structure."]})]}),e(a,{plugins:d,statusbar:{enabled:!0,position:"bottom"},defaultValue:`
          <h2>Q2 Access Control Policy Draft</h2>
          <h3>Policy Statement</h3>
          <p>All production access must be approved and logged.</p>
          <h3>Controls</h3>
          <p>Access reviews run monthly. Emergency access expires in 24 hours.</p>
        `})]})},i={render:()=>n("div",{children:[n(r,{style:{marginBottom:"16px",padding:"14px",background:"#eff6ff",borderRadius:"8px"},children:[e("h4",{style:{margin:"0 0 8px 0"},children:"Translation Workflow"}),n("p",{style:{margin:0,fontSize:"13px"},children:["Use ",e("code",{children:"Ctrl/Cmd+Alt+Shift+L"})," to open translation QA, capture source, and lock approved segments."]})]}),e(a,{plugins:d,statusbar:{enabled:!0,position:"bottom"},defaultValue:`
          <h2>Release Notes v4.8</h2>
          <p>Welcome {{firstName}}! Your order ID is %ORDER_ID%.</p>
          <p>Click <strong>Upgrade Now</strong> to activate premium analytics.</p>
          <p>For support, contact support@acme.com within 24 hours.</p>
        `})]})};var s,l,p;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: '20px',
      padding: '15px',
      background: '#f3e5f5',
      borderRadius: '4px'
    }}>
        <h3 style={{
        margin: '0 0 10px 0'
      }}>Framework Independence</h3>
        <p style={{
        margin: 0,
        fontSize: '14px'
      }}>
          The same editor works in React, Vue, Angular, Svelte, or vanilla JavaScript.
        </p>

        <Grid style={{
        marginTop: '15px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
        fontSize: '13px'
      }}>
          <Box style={{
          padding: '10px',
          background: 'white',
          borderRadius: '4px'
        }}><strong>React:</strong><br /><code style={{
            fontSize: '11px'
          }}>&lt;EditoraEditor /&gt;</code></Box>
          <Box style={{
          padding: '10px',
          background: 'white',
          borderRadius: '4px'
        }}><strong>Vanilla JS:</strong><br /><code style={{
            fontSize: '11px'
          }}>&lt;editora-editor&gt;</code></Box>
          <Box style={{
          padding: '10px',
          background: 'white',
          borderRadius: '4px'
        }}><strong>Vue:</strong><br /><code style={{
            fontSize: '11px'
          }}>&lt;editora-editor&gt;</code></Box>
          <Box style={{
          padding: '10px',
          background: 'white',
          borderRadius: '4px'
        }}><strong>Angular:</strong><br /><code style={{
            fontSize: '11px'
          }}>&lt;editora-editor&gt;</code></Box>
        </Grid>
      </Box>

      <EditoraEditor plugins={allNativePlugins} statusbar={{
      enabled: true
    }} defaultValue={\`
          <h2>Universal Editor</h2>
          <p><strong>Zero framework dependencies.</strong></p>
          <h3>Works With</h3>
          <ul>
            <li>React</li>
            <li>Vue.js</li>
            <li>Angular</li>
            <li>Svelte</li>
            <li>Vanilla JavaScript</li>
          </ul>
          <blockquote>Build once, use everywhere.</blockquote>
        \`} />
    </div>
}`,...(p=(l=o.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var c,u,m;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: '16px',
      padding: '14px',
      background: '#ecfdf5',
      borderRadius: '8px'
    }}>
        <h4 style={{
        margin: '0 0 8px 0'
      }}>Doc Schema Workflow</h4>
        <p style={{
        margin: 0,
        fontSize: '13px'
      }}>
          Use <code>Ctrl/Cmd+Alt+Shift+G</code> to open schema validation, review missing sections, and normalize structure.
        </p>
      </Box>

      <EditoraEditor plugins={allNativePlugins} statusbar={{
      enabled: true,
      position: 'bottom'
    }} defaultValue={\`
          <h2>Q2 Access Control Policy Draft</h2>
          <h3>Policy Statement</h3>
          <p>All production access must be approved and logged.</p>
          <h3>Controls</h3>
          <p>Access reviews run monthly. Emergency access expires in 24 hours.</p>
        \`} />
    </div>
}`,...(m=(u=t.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var g,h,x;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: '16px',
      padding: '14px',
      background: '#eff6ff',
      borderRadius: '8px'
    }}>
        <h4 style={{
        margin: '0 0 8px 0'
      }}>Translation Workflow</h4>
        <p style={{
        margin: 0,
        fontSize: '13px'
      }}>
          Use <code>Ctrl/Cmd+Alt+Shift+L</code> to open translation QA, capture source, and lock approved segments.
        </p>
      </Box>

      <EditoraEditor plugins={allNativePlugins} statusbar={{
      enabled: true,
      position: 'bottom'
    }} defaultValue={\`
          <h2>Release Notes v4.8</h2>
          <p>Welcome {{firstName}}! Your order ID is %ORDER_ID%.</p>
          <p>Click <strong>Upgrade Now</strong> to activate premium analytics.</p>
          <p>For support, contact support@acme.com within 24 hours.</p>
        \`} />
    </div>
}`,...(x=(h=i.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};const U=["FrameworkIndependence","DocSchemaWorkflow","TranslationWorkflowScenario"];export{t as DocSchemaWorkflow,o as FrameworkIndependence,i as TranslationWorkflowScenario,U as __namedExportsOrder,P as default};
