import{a7 as p,j as t,G as z,a as e,B as n,F as P,b as x,a6 as C}from"./index-c1b18327.js";import{R as V}from"./index-93f6b7ae.js";const j={title:"UI/Menubar",component:p,argTypes:{selected:{control:"number"},open:{control:"boolean"},loop:{control:"boolean"},placement:{control:"select",options:["bottom","top","left","right"]},variant:{control:"select",options:["default","solid","flat","line","glass","contrast"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["default","square","soft"]},elevation:{control:"select",options:["default","none","low","high"]},tone:{control:"select",options:["default","brand","danger","success","warning"]}}};function o(a){return t(p,{...a,children:[e("button",{slot:"item",children:"File"}),e("button",{slot:"item",children:"Edit"}),e("button",{slot:"item",children:"View"}),t(n,{slot:"content",style:{minWidth:220},children:[t(n,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"📄"}),e("span",{className:"label",children:"New document"}),e("span",{className:"shortcut",children:"⌘N"})]}),t(n,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"📂"}),e("span",{className:"label",children:"Open…"}),e("span",{className:"shortcut",children:"⌘O"})]}),t(n,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"💾"}),e("span",{className:"label",children:"Save"}),e("span",{className:"shortcut",children:"⌘S"})]}),e(n,{role:"separator",className:"separator"}),t(n,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"📤"}),e("span",{className:"label",children:"Export PDF"}),e("span",{className:"shortcut",children:"⇧⌘E"})]})]}),t(n,{slot:"content",style:{minWidth:220},children:[t(n,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"↶"}),e("span",{className:"label",children:"Undo"}),e("span",{className:"shortcut",children:"⌘Z"})]}),t(n,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"↷"}),e("span",{className:"label",children:"Redo"}),e("span",{className:"shortcut",children:"⇧⌘Z"})]}),e(n,{role:"separator",className:"separator"}),t(n,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"🔎"}),e("span",{className:"label",children:"Find"}),e("span",{className:"shortcut",children:"⌘F"})]}),t(n,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"🪄"}),e("span",{className:"label",children:"Replace"}),e("span",{className:"shortcut",children:"⌘H"})]})]}),t(n,{slot:"content",style:{minWidth:220},children:[e(n,{role:"menuitemcheckbox","aria-checked":"true",tabIndex:-1,children:"Show minimap"}),e(n,{role:"menuitemcheckbox","aria-checked":"false",tabIndex:-1,children:"Wrap lines"}),e(n,{role:"separator",className:"separator"}),e(n,{role:"menuitemradio","data-group":"zoom","aria-checked":"true",tabIndex:-1,children:"100%"}),e(n,{role:"menuitemradio","data-group":"zoom","aria-checked":"false",tabIndex:-1,children:"125%"}),e(n,{role:"menuitemradio","data-group":"zoom","aria-checked":"false",tabIndex:-1,children:"150%"})]})]})}const s=o;s.args={selected:0,open:!1,loop:!0,placement:"bottom",variant:"default",density:"default",shape:"default",elevation:"default",tone:"default"};const i=()=>{const[a,u]=V.useState({open:!1,selected:0});return t(z,{style:{display:"grid",gap:10},children:[e(o,{selected:a.selected,open:a.open,onOpen:r=>u({open:!0,selected:r}),onClose:()=>u(r=>({...r,open:!1})),onChange:r=>u({open:r.open,selected:r.selected})}),t(n,{style:{fontSize:13,color:"#475569"},children:["open: ",String(a.open)," | selected: ",a.selected]})]})},l=o;l.args={selected:1,open:!0};const d=()=>t(z,{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(320px, 1fr))",gap:16,padding:20},children:[t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14},children:[e("strong",{children:"Default"}),e(n,{style:{marginTop:10},children:e(o,{selected:0,open:!0,variant:"default"})})]}),t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14},children:[e("strong",{children:"Square / Flat"}),e(n,{style:{marginTop:10},children:e(o,{selected:1,open:!0,variant:"flat",shape:"square",density:"compact",elevation:"none"})})]}),t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14,background:"linear-gradient(135deg, #f8fafc, #eef2ff)"},children:[e("strong",{children:"Glass"}),e(n,{style:{marginTop:10},children:e(o,{selected:2,open:!0,variant:"glass",shape:"soft",elevation:"high"})})]}),t(n,{style:{border:"1px solid #1e293b",borderRadius:12,padding:14,background:"#0f172a",color:"#e2e8f0"},children:[e("strong",{children:"Contrast + Warning"}),e(n,{style:{marginTop:10},children:e(o,{selected:0,open:!0,variant:"contrast",tone:"warning"})})]})]}),c=()=>t(P,{style:{display:"flex",gap:16,padding:24,alignItems:"flex-start"},children:[t(p,{orientation:"vertical",open:!0,selected:0,shape:"soft",density:"comfortable",style:{width:240},children:[e(x,{slot:"item",variant:"ghost",children:"Project"}),e(x,{slot:"item",variant:"ghost",children:"Team"}),e(x,{slot:"item",variant:"ghost",children:"Settings"}),t(n,{slot:"content",children:[e(n,{role:"menuitem",tabIndex:-1,children:"Overview"}),e(n,{role:"menuitem",tabIndex:-1,children:"Files"}),e(n,{role:"menuitem",tabIndex:-1,children:"Activity"})]}),t(n,{slot:"content",children:[e(n,{role:"menuitem",tabIndex:-1,children:"Members"}),e(n,{role:"menuitem",tabIndex:-1,children:"Roles"}),e(n,{role:"menuitem",tabIndex:-1,children:"Invites"})]}),t(n,{slot:"content",children:[e(n,{role:"menuitem",tabIndex:-1,children:"Preferences"}),e(n,{role:"menuitem",tabIndex:-1,children:"Billing"}),e(n,{role:"menuitem",tabIndex:-1,children:"API Keys"})]})]}),e(n,{style:{fontSize:13,color:"#64748b"},children:"Vertical mode is useful for command strips and compact admin side tools."})]}),m=()=>e(n,{style:{padding:32},children:t(p,{open:!0,selected:0,closeOnSelect:!1,children:[e("button",{slot:"item",children:"File"}),e("button",{slot:"item",children:"Edit"}),e("button",{slot:"item",children:"View"}),t(n,{slot:"content",style:{minWidth:240},children:[e(n,{role:"menuitem",tabIndex:-1,children:"New file"}),e(n,{role:"menuitem",tabIndex:-1,children:"Open…"}),e(n,{role:"separator",className:"separator"}),t(n,{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,padding:"6px 8px",borderRadius:8},children:[e("span",{style:{fontSize:13,color:"#334155"},children:"Export"}),t(C,{placement:"right",density:"compact",shape:"square",variant:"line",children:[e("button",{slot:"trigger",style:{fontSize:12,border:"1px solid #cbd5e1",borderRadius:6,background:"#fff",padding:"4px 8px",cursor:"pointer"},children:"Formats ▸"}),t(n,{slot:"content",children:[e(n,{role:"menuitem",tabIndex:-1,children:"Export as PDF"}),e(n,{role:"menuitem",tabIndex:-1,children:"Export as HTML"}),e(n,{role:"menuitem",tabIndex:-1,children:"Export as Markdown"})]})]})]})]}),t(n,{slot:"content",children:[e(n,{role:"menuitem",tabIndex:-1,children:"Undo"}),e(n,{role:"menuitem",tabIndex:-1,children:"Redo"})]}),t(n,{slot:"content",children:[e(n,{role:"menuitemcheckbox","aria-checked":"true",tabIndex:-1,children:"Show toolbar"}),e(n,{role:"menuitemcheckbox","aria-checked":"false",tabIndex:-1,children:"Show minimap"})]})]})});var h,b,g;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:"EditorMenubar",...(g=(b=s.parameters)==null?void 0:b.docs)==null?void 0:g.source}}};var f,B,y;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`() => {
  const [state, setState] = React.useState({
    open: false,
    selected: 0
  });
  return <Grid style={{
    display: 'grid',
    gap: 10
  }}>
      <EditorMenubar selected={state.selected} open={state.open} onOpen={selected => setState({
      open: true,
      selected
    })} onClose={() => setState(prev => ({
      ...prev,
      open: false
    }))} onChange={detail => setState({
      open: detail.open,
      selected: detail.selected
    })} />
      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        open: {String(state.open)} | selected: {state.selected}
      </Box>
    </Grid>;
}`,...(y=(B=i.parameters)==null?void 0:B.docs)==null?void 0:y.source}}};var I,v,S;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:"EditorMenubar",...(S=(v=l.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var N,M,E;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(320px, 1fr))',
  gap: 16,
  padding: 20
}}>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 14
  }}>
      <strong>Default</strong>
      <Box style={{
      marginTop: 10
    }}>
        <EditorMenubar selected={0} open variant="default" />
      </Box>
    </Box>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 14
  }}>
      <strong>Square / Flat</strong>
      <Box style={{
      marginTop: 10
    }}>
        <EditorMenubar selected={1} open variant="flat" shape="square" density="compact" elevation="none" />
      </Box>
    </Box>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 14,
    background: 'linear-gradient(135deg, #f8fafc, #eef2ff)'
  }}>
      <strong>Glass</strong>
      <Box style={{
      marginTop: 10
    }}>
        <EditorMenubar selected={2} open variant="glass" shape="soft" elevation="high" />
      </Box>
    </Box>
    <Box style={{
    border: '1px solid #1e293b',
    borderRadius: 12,
    padding: 14,
    background: '#0f172a',
    color: '#e2e8f0'
  }}>
      <strong>Contrast + Warning</strong>
      <Box style={{
      marginTop: 10
    }}>
        <EditorMenubar selected={0} open variant="contrast" tone="warning" />
      </Box>
    </Box>
  </Grid>`,...(E=(M=d.parameters)==null?void 0:M.docs)==null?void 0:E.source}}};var k,w,R;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`() => <Flex style={{
  display: 'flex',
  gap: 16,
  padding: 24,
  alignItems: 'flex-start'
}}>
    <Menubar orientation="vertical" open selected={0} shape="soft" density="comfortable" style={{
    width: 240
  }}>
      <Button slot="item" variant="ghost">Project</Button>
      <Button slot="item" variant="ghost">Team</Button>
      <Button slot="item" variant="ghost">Settings</Button>

      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Overview</Box>
        <Box role="menuitem" tabIndex={-1}>Files</Box>
        <Box role="menuitem" tabIndex={-1}>Activity</Box>
      </Box>
      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Members</Box>
        <Box role="menuitem" tabIndex={-1}>Roles</Box>
        <Box role="menuitem" tabIndex={-1}>Invites</Box>
      </Box>
      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Preferences</Box>
        <Box role="menuitem" tabIndex={-1}>Billing</Box>
        <Box role="menuitem" tabIndex={-1}>API Keys</Box>
      </Box>
    </Menubar>
    <Box style={{
    fontSize: 13,
    color: '#64748b'
  }}>
      Vertical mode is useful for command strips and compact admin side tools.
    </Box>
  </Flex>`,...(R=(w=c.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};var F,T,O;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:`() => <Box style={{
  padding: 32
}}>
    <Menubar open selected={0} closeOnSelect={false}>
      <button slot="item">File</button>
      <button slot="item">Edit</button>
      <button slot="item">View</button>

      <Box slot="content" style={{
      minWidth: 240
    }}>
        <Box role="menuitem" tabIndex={-1}>New file</Box>
        <Box role="menuitem" tabIndex={-1}>Open…</Box>
        <Box role="separator" className="separator" />
        <Box style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: '6px 8px',
        borderRadius: 8
      }}>
          <span style={{
          fontSize: 13,
          color: '#334155'
        }}>Export</span>
          <Menu placement="right" density="compact" shape="square" variant="line">
            <button slot="trigger" style={{
            fontSize: 12,
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            background: '#fff',
            padding: '4px 8px',
            cursor: 'pointer'
          }}>
              Formats ▸
            </button>
            <Box slot="content">
              <Box role="menuitem" tabIndex={-1}>Export as PDF</Box>
              <Box role="menuitem" tabIndex={-1}>Export as HTML</Box>
              <Box role="menuitem" tabIndex={-1}>Export as Markdown</Box>
            </Box>
          </Menu>
        </Box>
      </Box>

      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Undo</Box>
        <Box role="menuitem" tabIndex={-1}>Redo</Box>
      </Box>

      <Box slot="content">
        <Box role="menuitemcheckbox" aria-checked="true" tabIndex={-1}>Show toolbar</Box>
        <Box role="menuitemcheckbox" aria-checked="false" tabIndex={-1}>Show minimap</Box>
      </Box>
    </Menubar>
  </Box>`,...(O=(T=m.parameters)==null?void 0:T.docs)==null?void 0:O.source}}};const q=["Playground","Interactive","OpenByDefault","VisualModes","Vertical","SubmenuExample"];export{i as Interactive,l as OpenByDefault,s as Playground,m as SubmenuExample,c as Vertical,d as VisualModes,q as __namedExportsOrder,j as default};
