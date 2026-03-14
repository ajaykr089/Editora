import{a as e,j as t,B as p,F as I}from"./index-ce0e40fa.js";import{r as o}from"./index-93f6b7ae.js";import{R as i}from"./RichTextEditor-c94fbf83.js";import{B as V,I as W,U as M,a as L,H as U}from"./A11yCheckerPlugin.native-b89c1fcd.js";import{S as D}from"./TextAlignmentPlugin.native-8d0de10f.js";import"./SearchExtension-5db95884.js";/* empty css                *//* empty css             */import{a as u}from"./richTextEditor.shared-ed45b9c5.js";import"./index-c197feae.js";import"./index-76e7d200.js";import"./ReadOnlyExtension-88fcf3b5.js";import"./HeadingPlugin.native-b74ae03d.js";import"./ApprovalWorkflowPlugin.native-eaed16b3.js";import"./ContentRulesPlugin.native-706a3efc.js";import"./PIIRedactionPlugin.native-6cafc2ca.js";import"./iframe-836ccd9e.js";import"../sb-preview/runtime.js";const ie={title:"Editor/Rich Text Editor - Web Component",component:i,parameters:{layout:"padded",docs:{source:{type:"code"},description:{component:`
# Editora Web Component - Core Docs

This page now only contains the core introduction stories so docs stay responsive.

Additional examples were split into dedicated pages:
- \`Formatting & Content\`
- \`Patterns & State\`
- \`Collaboration & Workflows\`
- \`Performance\`

Use those sub-stories when you want the heavier scenarios without loading every example on one docs page.
        `}}}},a={render:()=>e(i,{plugins:u,statusbar:{enabled:!0,position:"bottom"},floatingToolbar:!0,defaultValue:`
        <h2>Welcome to Editora</h2>
        <p>This is a <strong>framework-agnostic</strong> rich text editor with a broad native plugin surface.</p>
        <p>✨ <strong>Core capabilities:</strong></p>
        <ul>
          <li>Zero framework dependencies in the editor runtime</li>
          <li>Works with React, Vue, Angular, Svelte, and vanilla web apps</li>
          <li>Large native plugin catalog for enterprise workflows</li>
          <li>Declarative TinyMCE-style API</li>
        </ul>
        <p>Use this page for the lightweight overview. Heavier scenario docs live in dedicated subpages.</p>
      `})},s={render:()=>{const n=o.useRef(null),[r,T]=o.useState(""),[R,S]=o.useState(0),[B,A]=o.useState("");return o.useEffect(()=>{var g;if(typeof window<"u"&&window.Editora){const c=window.Editora;A(c.version||"N/A"),S(((g=c.plugins)==null?void 0:g.length)||0)}},[]),t("div",{children:[t(p,{style:{marginBottom:"20px",padding:"15px",background:"#f5f5f5",borderRadius:"4px"},children:[e("h4",{style:{margin:"0 0 10px 0"},children:"Global Editora API"}),t("p",{style:{margin:"5px 0"},children:["Version: ",e("strong",{children:B})]}),t("p",{style:{margin:"5px 0"},children:["Plugins Available: ",e("strong",{children:R})]}),t(I,{style:{marginTop:"10px",display:"flex",gap:"10px"},children:[e("button",{onClick:()=>{n.current&&T(n.current.innerHTML)},style:{padding:"8px 16px"},children:"Get Content"}),e("button",{onClick:()=>{n.current&&(n.current.innerHTML=`
        <h3>Content Set via API</h3>
        <p>Updated at: ${new Date().toLocaleTimeString()}</p>
        <p>This was set using the Web Component API.</p>
      `)},style:{padding:"8px 16px"},children:"Set Content"})]})]}),e("div",{ref:n,children:e(i,{plugins:u,statusbar:{enabled:!0},defaultValue:`
              <h3>Web Component API Demo</h3>
              <p>This editor can be controlled via the global <code>window.Editora</code> object.</p>
              <p>Try the buttons above to interact with the editor programmatically.</p>
            `})}),r?t(p,{style:{marginTop:"20px",padding:"15px",background:"#e8f5e9",borderRadius:"4px"},children:[e("h4",{style:{margin:"0 0 10px 0"},children:"Output"}),e("pre",{style:{overflow:"auto",fontSize:"12px"},children:r})]}):null]})}},l={render:()=>t("div",{children:[t(p,{style:{marginBottom:"20px",padding:"15px",background:"#fff3e0",borderRadius:"4px"},children:[e("h4",{style:{margin:"0 0 10px 0"},children:"Custom Toolbar"}),e("p",{style:{margin:0,fontSize:"14px"},children:"Only essential formatting tools are shown in the toolbar."})]}),e(i,{plugins:[V(),W(),M(),D(),L(),U()],statusbar:{enabled:!0},toolbar:{items:"undo redo | bold italic underline strikethrough | link",sticky:!0},defaultValue:`
          <h2>Minimal Editor</h2>
          <p>This editor has a <strong>simplified toolbar</strong> with only essential formatting options.</p>
          <p>Perfect for comments, lightweight review flows, or simple text input.</p>
        `})]})},d={render:()=>{const[n,r]=o.useState(!0);return t("div",{children:[t(p,{style:{marginBottom:"20px",padding:"15px",background:"#f3e5f5",borderRadius:"4px"},children:[e("h4",{style:{margin:"0 0 10px 0"},children:"Readonly Mode"}),e("button",{onClick:()=>r(!n),style:{padding:"8px 16px"},children:n?"Enable Editing":"Disable Editing"})]}),e(i,{plugins:u,statusbar:{enabled:!0},readonly:n,defaultValue:`
            <h2>Readonly Content</h2>
            <p>This content is <strong>${n?"readonly":"editable"}</strong>.</p>
            <p>Click the button above to toggle editing mode.</p>
            <ul>
              <li>Useful for previews and audit views</li>
              <li>Good for formatted document display</li>
              <li>Supports review-mode workflows</li>
            </ul>
          `})]})}};var m,h,f;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <EditoraEditor plugins={allNativePlugins} statusbar={{
    enabled: true,
    position: 'bottom'
  }} floatingToolbar={true} defaultValue={\`
        <h2>Welcome to Editora</h2>
        <p>This is a <strong>framework-agnostic</strong> rich text editor with a broad native plugin surface.</p>
        <p>✨ <strong>Core capabilities:</strong></p>
        <ul>
          <li>Zero framework dependencies in the editor runtime</li>
          <li>Works with React, Vue, Angular, Svelte, and vanilla web apps</li>
          <li>Large native plugin catalog for enterprise workflows</li>
          <li>Declarative TinyMCE-style API</li>
        </ul>
        <p>Use this page for the lightweight overview. Heavier scenario docs live in dedicated subpages.</p>
      \`} />
}`,...(f=(h=a.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var b,x,y;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => {
    const editorRef = useRef<any>(null);
    const [output, setOutput] = useState('');
    const [pluginCount, setPluginCount] = useState(0);
    const [version, setVersion] = useState('');
    useEffect(() => {
      if (typeof window !== 'undefined' && (window as any).Editora) {
        const Editora = (window as any).Editora;
        setVersion(Editora.version || 'N/A');
        setPluginCount(Editora.plugins?.length || 0);
      }
    }, []);
    const getContent = () => {
      if (editorRef.current) setOutput(editorRef.current.innerHTML);
    };
    const setContent = () => {
      if (!editorRef.current) return;
      editorRef.current.innerHTML = \`
        <h3>Content Set via API</h3>
        <p>Updated at: \${new Date().toLocaleTimeString()}</p>
        <p>This was set using the Web Component API.</p>
      \`;
    };
    return <div>
        <Box style={{
        marginBottom: '20px',
        padding: '15px',
        background: '#f5f5f5',
        borderRadius: '4px'
      }}>
          <h4 style={{
          margin: '0 0 10px 0'
        }}>Global Editora API</h4>
          <p style={{
          margin: '5px 0'
        }}>Version: <strong>{version}</strong></p>
          <p style={{
          margin: '5px 0'
        }}>Plugins Available: <strong>{pluginCount}</strong></p>
          <Flex style={{
          marginTop: '10px',
          display: 'flex',
          gap: '10px'
        }}>
            <button onClick={getContent} style={{
            padding: '8px 16px'
          }}>Get Content</button>
            <button onClick={setContent} style={{
            padding: '8px 16px'
          }}>Set Content</button>
          </Flex>
        </Box>

        <div ref={editorRef}>
          <EditoraEditor plugins={allNativePlugins} statusbar={{
          enabled: true
        }} defaultValue={\`
              <h3>Web Component API Demo</h3>
              <p>This editor can be controlled via the global <code>window.Editora</code> object.</p>
              <p>Try the buttons above to interact with the editor programmatically.</p>
            \`} />
        </div>

        {output ? <Box style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e8f5e9',
        borderRadius: '4px'
      }}>
            <h4 style={{
          margin: '0 0 10px 0'
        }}>Output</h4>
            <pre style={{
          overflow: 'auto',
          fontSize: '12px'
        }}>{output}</pre>
          </Box> : null}
      </div>;
  }
}`,...(y=(x=s.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var w,v,C;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: '20px',
      padding: '15px',
      background: '#fff3e0',
      borderRadius: '4px'
    }}>
        <h4 style={{
        margin: '0 0 10px 0'
      }}>Custom Toolbar</h4>
        <p style={{
        margin: 0,
        fontSize: '14px'
      }}>Only essential formatting tools are shown in the toolbar.</p>
      </Box>

      <EditoraEditor plugins={[BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), StrikethroughPlugin(), LinkPlugin(), HistoryPlugin()]} statusbar={{
      enabled: true
    }} toolbar={{
      items: 'undo redo | bold italic underline strikethrough | link',
      sticky: true
    }} defaultValue={\`
          <h2>Minimal Editor</h2>
          <p>This editor has a <strong>simplified toolbar</strong> with only essential formatting options.</p>
          <p>Perfect for comments, lightweight review flows, or simple text input.</p>
        \`} />
    </div>
}`,...(C=(v=l.parameters)==null?void 0:v.docs)==null?void 0:C.source}}};var E,k,P;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const [readonly, setReadonly] = useState(true);
    return <div>
        <Box style={{
        marginBottom: '20px',
        padding: '15px',
        background: '#f3e5f5',
        borderRadius: '4px'
      }}>
          <h4 style={{
          margin: '0 0 10px 0'
        }}>Readonly Mode</h4>
          <button onClick={() => setReadonly(!readonly)} style={{
          padding: '8px 16px'
        }}>
            {readonly ? 'Enable Editing' : 'Disable Editing'}
          </button>
        </Box>

        <EditoraEditor plugins={allNativePlugins} statusbar={{
        enabled: true
      }} readonly={readonly} defaultValue={\`
            <h2>Readonly Content</h2>
            <p>This content is <strong>\${readonly ? 'readonly' : 'editable'}</strong>.</p>
            <p>Click the button above to toggle editing mode.</p>
            <ul>
              <li>Useful for previews and audit views</li>
              <li>Good for formatted document display</li>
              <li>Supports review-mode workflows</li>
            </ul>
          \`} />
      </div>;
  }
}`,...(P=(k=d.parameters)==null?void 0:k.docs)==null?void 0:P.source}}};const re=["Basic","WebComponentAPI","CustomToolbar","ReadonlyMode"];export{a as Basic,l as CustomToolbar,d as ReadonlyMode,s as WebComponentAPI,re as __namedExportsOrder,ie as default};
