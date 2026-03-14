import{aG as m,j as t,B as p,a as e,b as h,G as C,F as I,aH as f,aI as a,aJ as v}from"./index-ce0e40fa.js";import{R as g}from"./index-93f6b7ae.js";import"./index-c197feae.js";const V={title:"UI/Menu",component:m,argTypes:{placement:{control:"select",options:["bottom","top","left","right"]},variant:{control:"select",options:["surface","soft","solid","outline","flat","contrast"]},size:{control:"select",options:["sm","md","lg"]},radius:{control:"text"},tone:{control:"select",options:["default","neutral","info","success","warning","danger"]},elevation:{control:"select",options:["default","none","low","high"]},closeOnSelect:{control:"boolean"},typeahead:{control:"boolean"}}};function R(){return t("div",{slot:"content",children:[e(a,{icon:"✏",shortcut:"R",children:"Rename"}),e(a,{icon:"⧉",shortcut:"D",children:"Duplicate"}),e(v,{}),e(a,{role:"menuitemcheckbox",checked:!0,shortcut:"⌘L",caption:"Editor preference",children:"Show line numbers"}),e(v,{}),e(a,{tone:"danger",icon:"🗑",shortcut:"⌘⌫",children:"Delete permanently"})]})}function u({label:n,menuProps:o,buttonRecipe:r="surface",children:i}){const[A,G]=g.useState(!1);return t(I,{style:{display:"flex",flexDirection:"column",gap:12},children:[i,t(m,{open:A,onOpenChange:D=>G(!!D),...o,children:[e(h,{slot:"trigger",recipe:r,children:n}),R()]})]})}const l=n=>{const[o,r]=g.useState("none");return t(p,{style:{padding:64},children:[t(m,{open:n.open,placement:n.placement,variant:n.variant,size:n.size,radius:n.radius,tone:n.tone,elevation:n.elevation,closeOnSelect:n.closeOnSelect,typeahead:n.typeahead,onSelectDetail:i=>{r(i.label||i.value||(typeof i.index=="number"?`item-${i.index}`:"item"))},children:[e(h,{slot:"trigger",recipe:"solid",children:"Open menu"}),R()]}),t(p,{style:{marginTop:12,fontSize:13,color:"#475569"},children:["Last action: ",o]})]})};l.args={open:!1,placement:"bottom",variant:"surface",size:"md",tone:"default",elevation:"default",closeOnSelect:!0,typeahead:!0,radius:""};const s=()=>e(C,{style:{display:"grid",gridTemplateColumns:"repeat(3, minmax(260px, 1fr))",gap:18,padding:20},children:[["Surface",{variant:"surface"}],["Soft",{variant:"soft"}],["Solid",{variant:"solid"}],["Outline",{variant:"outline"}],["Flat",{variant:"flat",elevation:"none"}],["Contrast",{variant:"contrast",elevation:"high"}]].map(([n,o])=>t(p,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14},children:[e("div",{style:{fontWeight:600,marginBottom:12},children:n}),e(u,{label:"Open menu",menuProps:o})]},n))}),c=()=>t(C,{style:{display:"grid",gridTemplateColumns:"160px repeat(3, minmax(240px, 1fr))",gap:18,padding:20,alignItems:"start"},children:[e("div",{}),e("div",{style:{textAlign:"center",color:"#64748b"},children:"Surface"}),e("div",{style:{textAlign:"center",color:"#64748b"},children:"Soft"}),e("div",{style:{textAlign:"center",color:"#64748b"},children:"Solid"}),["sm","md","lg"].map(n=>t(g.Fragment,{children:[e("div",{style:{fontSize:18,color:"#64748b",alignSelf:"center"},children:n.toUpperCase()}),e(u,{label:"Open menu",menuProps:{size:n,variant:"surface"}}),e(u,{label:"Open menu",menuProps:{size:n,variant:"soft"}}),e(u,{label:"Open menu",menuProps:{size:n,variant:"solid"}})]},n))]}),d=()=>{const[n,o]=g.useState("none");return t(I,{style:{display:"flex",flexDirection:"column",gap:12,padding:24},children:[t(m,{closeOnSelect:!1,onSelectDetail:r=>o(r.label||r.value||"item"),children:[e(h,{slot:"trigger",recipe:"surface",children:"View options"}),t("div",{slot:"content",children:[e(f,{children:"Canvas"}),e(a,{role:"menuitemcheckbox",checked:!0,"data-value":"show-grid",children:"Show grid"}),e(a,{role:"menuitemcheckbox","data-value":"snap-guides",children:"Snap to guides"}),e(v,{}),e(f,{children:"Mode"}),e(a,{role:"menuitemradio","data-group":"mode",checked:!0,"data-value":"mode-edit",children:"Mode: Edit"}),e(a,{role:"menuitemradio","data-group":"mode","data-value":"mode-review",children:"Mode: Review"})]})]}),t(p,{style:{fontSize:13,color:"#475569"},children:["Last action: ",n]})]})};var S,y,x;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`(args: any) => {
  const [lastAction, setLastAction] = React.useState('none');
  return <Box style={{
    padding: 64
  }}>
      <Menu open={args.open} placement={args.placement} variant={args.variant} size={args.size} radius={args.radius} tone={args.tone} elevation={args.elevation} closeOnSelect={args.closeOnSelect} typeahead={args.typeahead} onSelectDetail={detail => {
      setLastAction(detail.label || detail.value || (typeof detail.index === 'number' ? \`item-\${detail.index}\` : 'item'));
    }}>
        <Button slot="trigger" recipe="solid">Open menu</Button>
        {menuContent()}
      </Menu>
      <Box style={{
      marginTop: 12,
      fontSize: 13,
      color: '#475569'
    }}>Last action: {lastAction}</Box>
    </Box>;
}`,...(x=(y=l.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var b,M,O;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(260px, 1fr))',
  gap: 18,
  padding: 20
}}>
    {[['Surface', {
    variant: 'surface'
  }], ['Soft', {
    variant: 'soft'
  }], ['Solid', {
    variant: 'solid'
  }], ['Outline', {
    variant: 'outline'
  }], ['Flat', {
    variant: 'flat',
    elevation: 'none'
  }], ['Contrast', {
    variant: 'contrast',
    elevation: 'high'
  }]].map(([label, props]) => <Box key={label as string} style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 14
  }}>
        <div style={{
      fontWeight: 600,
      marginBottom: 12
    }}>{label}</div>
        <PreviewMenu label="Open menu" menuProps={props as Record<string, unknown>} />
      </Box>)}
  </Grid>`,...(O=(M=s.parameters)==null?void 0:M.docs)==null?void 0:O.source}}};var w,B,z;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gridTemplateColumns: '160px repeat(3, minmax(240px, 1fr))',
  gap: 18,
  padding: 20,
  alignItems: 'start'
}}>
    <div />
    <div style={{
    textAlign: 'center',
    color: '#64748b'
  }}>Surface</div>
    <div style={{
    textAlign: 'center',
    color: '#64748b'
  }}>Soft</div>
    <div style={{
    textAlign: 'center',
    color: '#64748b'
  }}>Solid</div>

    {(['sm', 'md', 'lg'] as const).map(size => <React.Fragment key={size}>
        <div style={{
      fontSize: 18,
      color: '#64748b',
      alignSelf: 'center'
    }}>{size.toUpperCase()}</div>
        <PreviewMenu label="Open menu" menuProps={{
      size,
      variant: 'surface'
    }} />
        <PreviewMenu label="Open menu" menuProps={{
      size,
      variant: 'soft'
    }} />
        <PreviewMenu label="Open menu" menuProps={{
      size,
      variant: 'solid'
    }} />
      </React.Fragment>)}
  </Grid>`,...(z=(B=c.parameters)==null?void 0:B.docs)==null?void 0:z.source}}};var L,P,k;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`() => {
  const [last, setLast] = React.useState('none');
  return <Flex style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 24
  }}>
      <Menu closeOnSelect={false} onSelectDetail={detail => setLast(detail.label || detail.value || 'item')}>
        <Button slot="trigger" recipe="surface">View options</Button>
        <div slot="content">
          <MenuSectionLabel>Canvas</MenuSectionLabel>
          <MenuItem role="menuitemcheckbox" checked data-value="show-grid">
            Show grid
          </MenuItem>
          <MenuItem role="menuitemcheckbox" data-value="snap-guides">
            Snap to guides
          </MenuItem>
          <MenuSeparator />
          <MenuSectionLabel>Mode</MenuSectionLabel>
          <MenuItem role="menuitemradio" data-group="mode" checked data-value="mode-edit">
            Mode: Edit
          </MenuItem>
          <MenuItem role="menuitemradio" data-group="mode" data-value="mode-review">
            Mode: Review
          </MenuItem>
        </div>
      </Menu>
      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>Last action: {last}</Box>
    </Flex>;
}`,...(k=(P=d.parameters)==null?void 0:P.docs)==null?void 0:k.source}}};const j=["Playground","VariantGallery","SizeGallery","SelectionModes"];export{l as Playground,d as SelectionModes,c as SizeGallery,s as VariantGallery,j as __namedExportsOrder,V as default};
