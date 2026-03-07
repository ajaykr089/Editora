import{a6 as r,j as t,B as n,a as e,b as s,G as C,F as A}from"./index-c1b18327.js";import{R as x}from"./index-93f6b7ae.js";const z={title:"UI/Menu",component:r,argTypes:{placement:{control:"select",options:["bottom","top","left","right"]},variant:{control:"select",options:["default","solid","flat","line","glass","contrast"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["default","square","soft"]},elevation:{control:"select",options:["default","none","low","high"]},tone:{control:"select",options:["default","brand","danger","success","warning"]},closeOnSelect:{control:"boolean"},typeahead:{control:"boolean"}}},d=()=>t(n,{slot:"content",children:[t(n,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"✏"}),e("span",{className:"label",children:"Rename"}),e("span",{className:"shortcut",children:"R"})]}),t(n,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"⧉"}),e("span",{className:"label",children:"Duplicate"}),e("span",{className:"shortcut",children:"D"})]}),e(n,{role:"separator",className:"separator"}),t(n,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"📦"}),e("span",{className:"label",children:"Archive"}),e("span",{className:"shortcut",children:"A"})]}),t(n,{role:"menuitem",tabIndex:-1,"data-value":"delete",style:{color:"#b91c1c"},children:[e("span",{className:"icon",children:"🗑"}),e("span",{className:"label",children:"Delete permanently"}),e("span",{className:"shortcut",children:"⌘⌫"})]})]}),c=o=>{const[l,a]=x.useState("none");return t(n,{style:{padding:64},children:[t(r,{open:o.open,placement:o.placement,variant:o.variant,density:o.density,shape:o.shape,elevation:o.elevation,tone:o.tone,closeOnSelect:o.closeOnSelect,typeahead:o.typeahead,onSelectDetail:i=>{const w=i.label||i.value||(typeof i.index=="number"?`#${i.index}`:"item");a(w)},children:[e(s,{slot:"trigger",children:"Open menu"}),e(d,{})]}),t(n,{style:{marginTop:12,fontSize:13,color:"#475569"},children:["Last action: ",l]})]})};c.args={open:!1,placement:"bottom",variant:"default",density:"default",shape:"default",elevation:"default",tone:"default",closeOnSelect:!0,typeahead:!0};const p=()=>t(C,{style:{display:"grid",gridTemplateColumns:"repeat(3, minmax(240px, 1fr))",gap:16,padding:20},children:[t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14},children:[e("strong",{children:"Default Soft"}),e(n,{style:{marginTop:10},children:t(r,{open:!0,shape:"soft",children:[e(s,{slot:"trigger",children:"Actions"}),e(d,{})]})})]}),t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14},children:[e("strong",{children:"Square Flat"}),e(n,{style:{marginTop:10},children:t(r,{open:!0,shape:"square",variant:"flat",elevation:"none",density:"compact",children:[e(s,{slot:"trigger",children:"Actions"}),e(d,{})]})})]}),t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14},children:[e("strong",{children:"Line / Warning"}),e(n,{style:{marginTop:10},children:t(r,{open:!0,variant:"line",shape:"square",density:"compact",tone:"warning",children:[e(s,{slot:"trigger",children:"Actions"}),e(d,{})]})})]}),t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14},children:[e("strong",{children:"Solid Comfortable"}),e(n,{style:{marginTop:10},children:t(r,{open:!0,variant:"solid",density:"comfortable",elevation:"low",children:[e(s,{slot:"trigger",children:"Actions"}),e(d,{})]})})]}),t(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14,background:"linear-gradient(135deg, #f8fafc, #eef2ff)"},children:[e("strong",{children:"Glass"}),e(n,{style:{marginTop:10},children:t(r,{open:!0,variant:"glass",shape:"soft",elevation:"high",children:[e(s,{slot:"trigger",children:"Actions"}),e(d,{})]})})]}),t(n,{style:{border:"1px solid #1e293b",borderRadius:12,padding:14,background:"#0f172a",color:"#e2e8f0"},children:[e("strong",{children:"Contrast + Danger"}),e(n,{style:{marginTop:10},children:t(r,{open:!0,variant:"contrast",tone:"danger",elevation:"high",children:[e(s,{slot:"trigger",children:"Actions"}),e(d,{})]})})]})]}),u=()=>{const o=["Rename","Duplicate","Archive","Delete"],[l,a]=x.useState(null);return t(A,{style:{display:"flex",flexDirection:"column",gap:12,padding:24},children:[t(r,{onSelect:i=>a(i),children:[e(s,{slot:"trigger",variant:"secondary",children:"Legacy item slots"}),o.map(i=>e(n,{slot:"item",children:i},i))]}),t(n,{style:{fontSize:13,color:"#475569"},children:["Selected index: ",l??"none"," ",l==null?"":`(${o[l]})`]})]})},m=()=>{const[o,l]=x.useState("none");return t(n,{style:{padding:56},children:[t(r,{open:!0,closeOnSelect:!1,onSelectDetail:a=>l(`${a.label||a.value||(typeof a.index=="number"?`item-${a.index}`:"item")}${typeof a.checked=="boolean"?` (${a.checked?"on":"off"})`:""}`),children:[e(s,{slot:"trigger",children:"View options"}),t(n,{slot:"content",children:[e(n,{role:"menuitemcheckbox","aria-checked":"true","data-value":"show-grid",tabIndex:-1,children:"Show grid"}),e(n,{role:"menuitemcheckbox","aria-checked":"false","data-value":"snap-guides",tabIndex:-1,children:"Snap to guides"}),e(n,{role:"separator",className:"separator"}),e(n,{role:"menuitemradio","data-group":"mode","aria-checked":"true","data-value":"mode-edit",tabIndex:-1,children:"Mode: Edit"}),e(n,{role:"menuitemradio","data-group":"mode","aria-checked":"false","data-value":"mode-review",tabIndex:-1,children:"Mode: Review"})]})]}),t(n,{style:{marginTop:12,fontSize:13,color:"#475569"},children:["Last action: ",o]})]})},g=()=>{const[o,l]=x.useState("none");return t(n,{style:{padding:56},children:[t(r,{open:!0,closeOnSelect:!1,onSelectDetail:a=>l(a.label||a.value||"item"),children:[e(s,{slot:"trigger",children:"Project menu"}),t(n,{slot:"content",children:[e(n,{role:"menuitem",tabIndex:-1,children:"Rename"}),e(n,{role:"menuitem",tabIndex:-1,children:"Duplicate"}),e(n,{role:"separator",className:"separator"}),t(n,{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 8px",borderRadius:8,gap:8},children:[e("span",{style:{fontSize:13,color:"#334155"},children:"Share"}),t(r,{placement:"right",density:"compact",shape:"square",variant:"line",onSelectDetail:a=>l(`share:${a.label||a.value||"item"}`),children:[e("button",{slot:"trigger",style:{fontSize:12,border:"1px solid #cbd5e1",borderRadius:6,background:"#fff",padding:"4px 8px",cursor:"pointer"},children:"More ▸"}),t(n,{slot:"content",children:[e(n,{role:"menuitem",tabIndex:-1,children:"Copy link"}),e(n,{role:"menuitem",tabIndex:-1,children:"Invite by email"}),e(n,{role:"menuitem",tabIndex:-1,children:"Manage access"})]})]})]}),e(n,{role:"separator",className:"separator"}),e(n,{role:"menuitem",tabIndex:-1,style:{color:"#b91c1c"},children:"Delete"})]})]}),t(n,{style:{marginTop:12,fontSize:13,color:"#475569"},children:["Last action: ",o]})]})};var h,b,f;c.parameters={...c.parameters,docs:{...(h=c.parameters)==null?void 0:h.docs,source:{originalSource:`(args: any) => {
  const [last, setLast] = React.useState('none');
  return <Box style={{
    padding: 64
  }}>
      <Menu open={args.open} placement={args.placement} variant={args.variant} density={args.density} shape={args.shape} elevation={args.elevation} tone={args.tone} closeOnSelect={args.closeOnSelect} typeahead={args.typeahead} onSelectDetail={detail => {
      const token = detail.label || detail.value || (typeof detail.index === 'number' ? \`#\${detail.index}\` : 'item');
      setLast(token);
    }}>
        <Button slot="trigger">Open menu</Button>
        <BaseMenuContent />
      </Menu>
      <Box style={{
      marginTop: 12,
      fontSize: 13,
      color: '#475569'
    }}>
        Last action: {last}
      </Box>
    </Box>;
}`,...(f=(b=c.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var B,y,S;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))',
  gap: 16,
  padding: 20
}}>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 14
  }}>
      <strong>Default Soft</strong>
      <Box style={{
      marginTop: 10
    }}>
        <Menu open shape="soft">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 14
  }}>
      <strong>Square Flat</strong>
      <Box style={{
      marginTop: 10
    }}>
        <Menu open shape="square" variant="flat" elevation="none" density="compact">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 14
  }}>
      <strong>Line / Warning</strong>
      <Box style={{
      marginTop: 10
    }}>
        <Menu open variant="line" shape="square" density="compact" tone="warning">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 14
  }}>
      <strong>Solid Comfortable</strong>
      <Box style={{
      marginTop: 10
    }}>
        <Menu open variant="solid" density="comfortable" elevation="low">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
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
        <Menu open variant="glass" shape="soft" elevation="high">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{
    border: '1px solid #1e293b',
    borderRadius: 12,
    padding: 14,
    background: '#0f172a',
    color: '#e2e8f0'
  }}>
      <strong>Contrast + Danger</strong>
      <Box style={{
      marginTop: 10
    }}>
        <Menu open variant="contrast" tone="danger" elevation="high">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
  </Grid>`,...(S=(y=p.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};var v,M,I;u.parameters={...u.parameters,docs:{...(v=u.parameters)==null?void 0:v.docs,source:{originalSource:`() => {
  const actions = ['Rename', 'Duplicate', 'Archive', 'Delete'];
  const [selected, setSelected] = React.useState<number | null>(null);
  return <Flex style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 24
  }}>
      <Menu onSelect={index => setSelected(index)}>
        <Button slot="trigger" variant="secondary">Legacy item slots</Button>
        {actions.map(action => <Box key={action} slot="item">{action}</Box>)}
      </Menu>
      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Selected index: {selected == null ? 'none' : selected} {selected == null ? '' : \`(\${actions[selected]})\`}
      </Box>
    </Flex>;
}`,...(I=(M=u.parameters)==null?void 0:M.docs)==null?void 0:I.source}}};var R,k,D;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`() => {
  const [last, setLast] = React.useState<string>('none');
  return <Box style={{
    padding: 56
  }}>
      <Menu open closeOnSelect={false} onSelectDetail={detail => setLast(\`\${detail.label || detail.value || (typeof detail.index === 'number' ? \`item-\${detail.index}\` : 'item')}\${typeof detail.checked === 'boolean' ? \` (\${detail.checked ? 'on' : 'off'})\` : ''}\`)}>
        <Button slot="trigger">View options</Button>
        <Box slot="content">
          <Box role="menuitemcheckbox" aria-checked="true" data-value="show-grid" tabIndex={-1}>Show grid</Box>
          <Box role="menuitemcheckbox" aria-checked="false" data-value="snap-guides" tabIndex={-1}>Snap to guides</Box>
          <Box role="separator" className="separator" />
          <Box role="menuitemradio" data-group="mode" aria-checked="true" data-value="mode-edit" tabIndex={-1}>Mode: Edit</Box>
          <Box role="menuitemradio" data-group="mode" aria-checked="false" data-value="mode-review" tabIndex={-1}>Mode: Review</Box>
        </Box>
      </Menu>
      <Box style={{
      marginTop: 12,
      fontSize: 13,
      color: '#475569'
    }}>Last action: {last}</Box>
    </Box>;
}`,...(D=(k=m.parameters)==null?void 0:k.docs)==null?void 0:D.source}}};var L,T,N;g.parameters={...g.parameters,docs:{...(L=g.parameters)==null?void 0:L.docs,source:{originalSource:`() => {
  const [last, setLast] = React.useState('none');
  return <Box style={{
    padding: 56
  }}>
      <Menu open closeOnSelect={false} onSelectDetail={detail => setLast(detail.label || detail.value || 'item')}>
        <Button slot="trigger">Project menu</Button>
        <Box slot="content">
          <Box role="menuitem" tabIndex={-1}>Rename</Box>
          <Box role="menuitem" tabIndex={-1}>Duplicate</Box>
          <Box role="separator" className="separator" />
          <Box style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 8px',
          borderRadius: 8,
          gap: 8
        }}>
            <span style={{
            fontSize: 13,
            color: '#334155'
          }}>Share</span>
            <Menu placement="right" density="compact" shape="square" variant="line" onSelectDetail={detail => setLast(\`share:\${detail.label || detail.value || 'item'}\`)}>
              <button slot="trigger" style={{
              fontSize: 12,
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              background: '#fff',
              padding: '4px 8px',
              cursor: 'pointer'
            }}>
                More ▸
              </button>
              <Box slot="content">
                <Box role="menuitem" tabIndex={-1}>Copy link</Box>
                <Box role="menuitem" tabIndex={-1}>Invite by email</Box>
                <Box role="menuitem" tabIndex={-1}>Manage access</Box>
              </Box>
            </Menu>
          </Box>
          <Box role="separator" className="separator" />
          <Box role="menuitem" tabIndex={-1} style={{
          color: '#b91c1c'
        }}>Delete</Box>
        </Box>
      </Menu>
      <Box style={{
      marginTop: 12,
      fontSize: 13,
      color: '#475569'
    }}>Last action: {last}</Box>
    </Box>;
}`,...(N=(T=g.parameters)==null?void 0:T.docs)==null?void 0:N.source}}};const q=["Playground","VisualModes","LegacySlotItems","PersistentSelection","SubmenuExample"];export{u as LegacySlotItems,m as PersistentSelection,c as Playground,g as SubmenuExample,p as VisualModes,q as __namedExportsOrder,z as default};
