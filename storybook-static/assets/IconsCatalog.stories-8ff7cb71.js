import{a1 as f,a2 as a,j as s,B as i,a as o,G as y}from"./index-c1b18327.js";import{R as c}from"./index-93f6b7ae.js";const b={title:"UI/Icons Catalog",component:f,argTypes:{iconVariant:{control:"select",options:["outline","solid","duotone"]},size:{control:"number"},strokeWidth:{control:"number"},variant:{control:"select",options:["default","surface","soft","contrast","minimal","elevated"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},shape:{control:"select",options:["default","square","soft"]},color:{control:"color"},secondaryColor:{control:"color"}}},t=e=>{const[r,m]=c.useState(""),l=c.useMemo(()=>{const n=r.trim().toLowerCase();return n?a.filter(g=>g.includes(n)):a},[r]);return s(i,{style:{display:"grid",gap:12},children:[s(i,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12,color:"#475569"},children:[s("span",{children:["Showing ",l.length," / ",a.length," icons"]}),o("span",{children:"Source: @editora/icons"})]}),o("input",{value:r,onChange:n=>m(n.target.value),placeholder:"Search icons...",style:{width:"100%",border:"1px solid #cbd5e1",borderRadius:10,padding:"10px 12px",fontSize:14,outline:"none"}}),o(y,{columns:"repeat(auto-fill, minmax(48px, 1fr))",gap:"10px",children:l.map(n=>o(i,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:10,display:"grid",gap:8,justifyItems:"start",background:"linear-gradient(180deg, #ffffff, #f8fafc)"},children:o(f,{name:n,iconVariant:e.iconVariant,size:e.size,strokeWidth:e.strokeWidth,variant:e.variant,tone:e.tone,shape:e.shape,color:e.color||void 0,secondaryColor:e.secondaryColor||void 0,label:n,decorative:!1})},n))})]})};t.args={iconVariant:"outline",size:18,strokeWidth:1.5,variant:"minimal",tone:"default",shape:"default",color:"",secondaryColor:""};var d,p,u;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`(args: any) => {
  const [query, setQuery] = React.useState('');
  const filteredNames = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return iconNameList;
    return iconNameList.filter(name => name.includes(term));
  }, [query]);
  return <Box style={{
    display: 'grid',
    gap: 12
  }}>
      <Box style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 12,
      color: '#475569'
    }}>
        <span>Showing {filteredNames.length} / {iconNameList.length} icons</span>
        <span>Source: @editora/icons</span>
      </Box>

      <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search icons..." style={{
      width: '100%',
      border: '1px solid #cbd5e1',
      borderRadius: 10,
      padding: '10px 12px',
      fontSize: 14,
      outline: 'none'
    }} />

      <Grid columns="repeat(auto-fill, minmax(48px, 1fr))" gap="10px">
        {filteredNames.map(name => <Box key={name} style={{
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 10,
        display: 'grid',
        gap: 8,
        justifyItems: 'start',
        background: 'linear-gradient(180deg, #ffffff, #f8fafc)'
      }}>
            <Icon name={name} iconVariant={args.iconVariant} size={args.size} strokeWidth={args.strokeWidth} variant={args.variant} tone={args.tone} shape={args.shape} color={args.color || undefined} secondaryColor={args.secondaryColor || undefined} label={name} decorative={false} />
            {/* <Box style={{ fontSize: 11, color: '#334155', lineHeight: 1.25, wordBreak: 'break-word' }}>{name}</Box> */}
          </Box>)}
      </Grid>
    </Box>;
}`,...(u=(p=t.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};const v=["AllIcons"];export{t as AllIcons,v as __namedExportsOrder,b as default};
