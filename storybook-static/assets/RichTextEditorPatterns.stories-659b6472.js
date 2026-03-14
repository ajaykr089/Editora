import{j as n,B as u,a as e,G as f,F as x}from"./index-ce0e40fa.js";import{r as i}from"./index-93f6b7ae.js";import{R as o}from"./RichTextEditor-2dfe365c.js";import{B as m,I as g,U as M}from"./A11yCheckerPlugin.native-b89c1fcd.js";import"./SearchExtension-5db95884.js";/* empty css                *//* empty css             */import{a as d}from"./richTextEditor.shared-1995808a.js";import"./index-c197feae.js";import"./HeadingPlugin.native-b74ae03d.js";import"./TextAlignmentPlugin.native-8d0de10f.js";import"./index-76e7d200.js";import"./ReadOnlyExtension-88fcf3b5.js";import"./ApprovalWorkflowPlugin.native-eaed16b3.js";import"./ContentRulesPlugin.native-706a3efc.js";import"./PIIRedactionPlugin.native-6cafc2ca.js";import"./iframe-c526a5dc.js";import"../sb-preview/runtime.js";const X={title:"Editor/Rich Text Editor - Web Component/Patterns & State",component:o,parameters:{layout:"padded",docs:{source:{type:"code"},description:{component:"State-heavy editor examples were moved here so the core docs page no longer renders multiple live instances at once."}}}},s={render:()=>n("div",{children:[n(u,{style:{marginBottom:"20px",padding:"15px",background:"#e3f2fd",borderRadius:"4px"},children:[e("h4",{style:{margin:"0 0 10px 0"},children:"Placeholder Patterns"}),e("p",{style:{margin:0,fontSize:"14px"},children:"Simple, detailed, and prefilled placeholder states are grouped here instead of the main docs page."})]}),n(f,{style:{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:"16px"},children:[n("div",{children:[e("h4",{style:{margin:"0 0 8px 0"},children:"Simple Placeholder"}),e(o,{plugins:[m(),g()],toolbar:{items:"bold italic",showMoreOptions:!1},statusbar:{enabled:!0},placeholder:"Type something here..."})]}),n("div",{children:[e("h4",{style:{margin:"0 0 8px 0"},children:"Detailed Placeholder"}),e(o,{plugins:[m(),g(),M()],toolbar:{items:"bold italic underline",showMoreOptions:!1},statusbar:{enabled:!0},placeholder:"Draft release notes: summary, impact, migration steps, and rollback plan."})]}),n("div",{children:[e("h4",{style:{margin:"0 0 8px 0"},children:"Prefilled Then Clear"}),e(o,{plugins:[m(),g()],toolbar:{items:"bold italic",showMoreOptions:!1},statusbar:{enabled:!0},placeholder:"Delete all content to show this placeholder.",defaultValue:"<p>This editor starts with content. Clear it to reveal placeholder.</p>"})]})]})]})},p={render:()=>{const[a,t]=i.useState("default"),[r,l]=i.useState("dark"),b=y=>y==="default"?"dark":y==="dark"?"acme":"default";return n("div",{children:[n(u,{style:{marginBottom:"20px",padding:"15px",background:"#ede7f6",borderRadius:"4px"},children:[e("h4",{style:{margin:"0 0 10px 0"},children:"Theme Switcher (Editor Only)"}),e("p",{style:{margin:"0 0 12px 0",fontSize:"14px"},children:"Switch only the editor theme wrappers without changing the Storybook page theme."}),n(x,{style:{display:"flex",gap:"10px",flexWrap:"wrap"},children:[e("button",{onClick:()=>t(b(a)),style:{padding:"8px 16px"},children:"Cycle Editor A"}),e("button",{onClick:()=>l(b(r)),style:{padding:"8px 16px"},children:"Cycle Editor B"}),e("button",{onClick:()=>{t("dark"),l("dark")},style:{padding:"8px 16px"},children:"Set Both Dark"}),e("button",{onClick:()=>{t("default"),l("default")},style:{padding:"8px 16px"},children:"Set Both Default"}),e("button",{onClick:()=>{t("acme"),l("acme")},style:{padding:"8px 16px"},children:"Set Both Acme"})]})]}),n(f,{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[n("div",{"data-theme":a,style:{padding:"10px",borderRadius:"8px",background:a==="dark"?"#0b1220":a==="acme"?"#eef4fb":"#ffffff"},children:[e("h4",{style:{margin:"0 0 8px 0",color:a==="dark"?"#f8fafc":a==="acme"?"#0f4f4a":"#111827"},children:"Editor A"}),e(o,{plugins:d,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},floatingToolbar:!0,defaultValue:"<p>Editor A theme is controlled independently.</p>"})]}),n("div",{"data-theme":r,style:{padding:"10px",borderRadius:"8px",background:r==="dark"?"#0b1220":r==="acme"?"#eef4fb":"#ffffff"},children:[e("h4",{style:{margin:"0 0 8px 0",color:r==="dark"?"#f8fafc":r==="acme"?"#0f4f4a":"#111827"},children:"Editor B"}),e(o,{plugins:d,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},floatingToolbar:!0,defaultValue:"<p>Editor B can use a different theme from Editor A.</p>"})]})]})]})}},c={render:()=>{const[a,t]=i.useState(""),[r,l]=i.useState("");return n("div",{children:[n(u,{style:{marginBottom:"20px",padding:"15px",background:"#fff9c4",borderRadius:"4px"},children:[e("h4",{style:{margin:"0 0 10px 0"},children:"Multiple Editors"}),e("p",{style:{margin:"0 0 10px 0",fontSize:"14px"},children:"Two independent editor instances with content synchronization."}),n(x,{style:{display:"flex",gap:"10px"},children:[e("button",{onClick:()=>l(a),style:{padding:"8px 16px"},children:"Sync A → B"}),e("button",{onClick:()=>t(r),style:{padding:"8px 16px"},children:"Sync B → A"})]})]}),n(f,{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"},children:[n("div",{children:[e("h4",{children:"Editor A"}),e(o,{plugins:d,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},onChange:t,defaultValue:"<h3>Editor A</h3><p>Type here...</p>"})]}),n("div",{children:[e("h4",{children:"Editor B"}),e(o,{plugins:d,toolbar:{showMoreOptions:!1},statusbar:{enabled:!0},value:r,onChange:l,defaultValue:"<h3>Editor B</h3><p>Type here...</p>"})]})]})]})}},h={render:()=>{const[a,t]=i.useState(`
      <h2>Controlled Editor</h2>
      <p>This editor's content is controlled by React state.</p>
    `);return n("div",{children:[n(u,{style:{marginBottom:"20px",padding:"15px",background:"#e0f2f1",borderRadius:"4px"},children:[e("h4",{style:{margin:"0 0 10px 0"},children:"Controlled Component"}),n(x,{style:{display:"flex",gap:"10px"},children:[e("button",{onClick:()=>t(`<h2>Reset!</h2><p>Content was reset at ${new Date().toLocaleTimeString()}</p>`),style:{padding:"8px 16px"},children:"Reset Content"}),e("button",{onClick:()=>t(r=>r+`<p>Appended at ${new Date().toLocaleTimeString()}</p>`),style:{padding:"8px 16px"},children:"Append Content"})]})]}),e(o,{plugins:d,statusbar:{enabled:!0},value:a,onChange:t})]})}};var B,C,k;s.parameters={...s.parameters,docs:{...(B=s.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div>
      <Box style={{
      marginBottom: '20px',
      padding: '15px',
      background: '#e3f2fd',
      borderRadius: '4px'
    }}>
        <h4 style={{
        margin: '0 0 10px 0'
      }}>Placeholder Patterns</h4>
        <p style={{
        margin: 0,
        fontSize: '14px'
      }}>Simple, detailed, and prefilled placeholder states are grouped here instead of the main docs page.</p>
      </Box>

      <Grid style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '16px'
    }}>
        <div>
          <h4 style={{
          margin: '0 0 8px 0'
        }}>Simple Placeholder</h4>
          <EditoraEditor plugins={[BoldPlugin(), ItalicPlugin()]} toolbar={{
          items: 'bold italic',
          showMoreOptions: false
        }} statusbar={{
          enabled: true
        }} placeholder="Type something here..." />
        </div>

        <div>
          <h4 style={{
          margin: '0 0 8px 0'
        }}>Detailed Placeholder</h4>
          <EditoraEditor plugins={[BoldPlugin(), ItalicPlugin(), UnderlinePlugin()]} toolbar={{
          items: 'bold italic underline',
          showMoreOptions: false
        }} statusbar={{
          enabled: true
        }} placeholder="Draft release notes: summary, impact, migration steps, and rollback plan." />
        </div>

        <div>
          <h4 style={{
          margin: '0 0 8px 0'
        }}>Prefilled Then Clear</h4>
          <EditoraEditor plugins={[BoldPlugin(), ItalicPlugin()]} toolbar={{
          items: 'bold italic',
          showMoreOptions: false
        }} statusbar={{
          enabled: true
        }} placeholder="Delete all content to show this placeholder." defaultValue="<p>This editor starts with content. Clear it to reveal placeholder.</p>" />
        </div>
      </Grid>
    </div>
}`,...(k=(C=s.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var E,v,T;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const [themeA, setThemeA] = useState<'default' | 'dark' | 'acme'>('default');
    const [themeB, setThemeB] = useState<'default' | 'dark' | 'acme'>('dark');
    const cycleTheme = (theme: 'default' | 'dark' | 'acme') => {
      if (theme === 'default') return 'dark';
      if (theme === 'dark') return 'acme';
      return 'default';
    };
    return <div>
        <Box style={{
        marginBottom: '20px',
        padding: '15px',
        background: '#ede7f6',
        borderRadius: '4px'
      }}>
          <h4 style={{
          margin: '0 0 10px 0'
        }}>Theme Switcher (Editor Only)</h4>
          <p style={{
          margin: '0 0 12px 0',
          fontSize: '14px'
        }}>
            Switch only the editor theme wrappers without changing the Storybook page theme.
          </p>
          <Flex style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
            <button onClick={() => setThemeA(cycleTheme(themeA))} style={{
            padding: '8px 16px'
          }}>Cycle Editor A</button>
            <button onClick={() => setThemeB(cycleTheme(themeB))} style={{
            padding: '8px 16px'
          }}>Cycle Editor B</button>
            <button onClick={() => {
            setThemeA('dark');
            setThemeB('dark');
          }} style={{
            padding: '8px 16px'
          }}>Set Both Dark</button>
            <button onClick={() => {
            setThemeA('default');
            setThemeB('default');
          }} style={{
            padding: '8px 16px'
          }}>Set Both Default</button>
            <button onClick={() => {
            setThemeA('acme');
            setThemeB('acme');
          }} style={{
            padding: '8px 16px'
          }}>Set Both Acme</button>
          </Flex>
        </Box>

        <Grid style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
          <div data-theme={themeA} style={{
          padding: '10px',
          borderRadius: '8px',
          background: themeA === 'dark' ? '#0b1220' : themeA === 'acme' ? '#eef4fb' : '#ffffff'
        }}>
            <h4 style={{
            margin: '0 0 8px 0',
            color: themeA === 'dark' ? '#f8fafc' : themeA === 'acme' ? '#0f4f4a' : '#111827'
          }}>Editor A</h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{
            showMoreOptions: false
          }} statusbar={{
            enabled: true
          }} floatingToolbar={true} defaultValue="<p>Editor A theme is controlled independently.</p>" />
          </div>

          <div data-theme={themeB} style={{
          padding: '10px',
          borderRadius: '8px',
          background: themeB === 'dark' ? '#0b1220' : themeB === 'acme' ? '#eef4fb' : '#ffffff'
        }}>
            <h4 style={{
            margin: '0 0 8px 0',
            color: themeB === 'dark' ? '#f8fafc' : themeB === 'acme' ? '#0f4f4a' : '#111827'
          }}>Editor B</h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{
            showMoreOptions: false
          }} statusbar={{
            enabled: true
          }} floatingToolbar={true} defaultValue="<p>Editor B can use a different theme from Editor A.</p>" />
          </div>
        </Grid>
      </div>;
  }
}`,...(T=(v=p.parameters)==null?void 0:v.docs)==null?void 0:T.source}}};var S,A,w;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    const [contentA, setContentA] = useState('');
    const [contentB, setContentB] = useState('');
    return <div>
        <Box style={{
        marginBottom: '20px',
        padding: '15px',
        background: '#fff9c4',
        borderRadius: '4px'
      }}>
          <h4 style={{
          margin: '0 0 10px 0'
        }}>Multiple Editors</h4>
          <p style={{
          margin: '0 0 10px 0',
          fontSize: '14px'
        }}>Two independent editor instances with content synchronization.</p>
          <Flex style={{
          display: 'flex',
          gap: '10px'
        }}>
            <button onClick={() => setContentB(contentA)} style={{
            padding: '8px 16px'
          }}>Sync A → B</button>
            <button onClick={() => setContentA(contentB)} style={{
            padding: '8px 16px'
          }}>Sync B → A</button>
          </Flex>
        </Box>

        <Grid style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
          <div>
            <h4>Editor A</h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{
            showMoreOptions: false
          }} statusbar={{
            enabled: true
          }} onChange={setContentA} defaultValue="<h3>Editor A</h3><p>Type here...</p>" />
          </div>
          <div>
            <h4>Editor B</h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{
            showMoreOptions: false
          }} statusbar={{
            enabled: true
          }} value={contentB} onChange={setContentB} defaultValue="<h3>Editor B</h3><p>Type here...</p>" />
          </div>
        </Grid>
      </div>;
  }
}`,...(w=(A=c.parameters)==null?void 0:A.docs)==null?void 0:w.source}}};var P,R,O;h.parameters={...h.parameters,docs:{...(P=h.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState(\`
      <h2>Controlled Editor</h2>
      <p>This editor's content is controlled by React state.</p>
    \`);
    return <div>
        <Box style={{
        marginBottom: '20px',
        padding: '15px',
        background: '#e0f2f1',
        borderRadius: '4px'
      }}>
          <h4 style={{
          margin: '0 0 10px 0'
        }}>Controlled Component</h4>
          <Flex style={{
          display: 'flex',
          gap: '10px'
        }}>
            <button onClick={() => setValue(\`<h2>Reset!</h2><p>Content was reset at \${new Date().toLocaleTimeString()}</p>\`)} style={{
            padding: '8px 16px'
          }}>
              Reset Content
            </button>
            <button onClick={() => setValue(prev => prev + \`<p>Appended at \${new Date().toLocaleTimeString()}</p>\`)} style={{
            padding: '8px 16px'
          }}>
              Append Content
            </button>
          </Flex>
        </Box>

        <EditoraEditor plugins={allNativePlugins} statusbar={{
        enabled: true
      }} value={value} onChange={setValue} />
      </div>;
  }
}`,...(O=(R=h.parameters)==null?void 0:R.docs)==null?void 0:O.source}}};const Y=["PlaceholderPatterns","ThemeSwitcherEditorOnly","MultipleEditors","ControlledEditor"];export{h as ControlledEditor,c as MultipleEditors,s as PlaceholderPatterns,p as ThemeSwitcherEditorOnly,Y as __namedExportsOrder,X as default};
