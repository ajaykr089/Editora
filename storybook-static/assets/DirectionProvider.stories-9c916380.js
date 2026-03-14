import{am as n,a as r,B as u,j as o,G as D,b as x}from"./index-ce0e40fa.js";import{r as y}from"./index-93f6b7ae.js";import"./index-c197feae.js";const B={title:"UI/DirectionProvider",component:n,argTypes:{dir:{control:"select",options:["ltr","rtl","auto"]}}},i=e=>r(n,{dir:e.dir,children:r(u,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:12},children:r("p",{style:{margin:0},children:"Navigation / التنقل / ניווט"})})});i.args={dir:"ltr"};const t=()=>{const[e,g]=y.useState("ltr");return o(D,{style:{display:"grid",gap:12},children:[o(x,{size:"sm",onClick:()=>g(m=>m==="ltr"?"rtl":"ltr"),children:["Switch direction (",e,")"]}),r(n,{dir:e,children:o(u,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:12},children:[r("strong",{children:"Current dir:"})," ",e,r("p",{style:{marginBottom:0},children:"Toolbar | Sidebar | Inspector"})]})})]})};var s,d,a;i.parameters={...i.parameters,docs:{...(s=i.parameters)==null?void 0:s.docs,source:{originalSource:`(args: any) => <DirectionProvider dir={args.dir}>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: 12
  }}>
      <p style={{
      margin: 0
    }}>Navigation / التنقل / ניווט</p>
    </Box>
  </DirectionProvider>`,...(a=(d=i.parameters)==null?void 0:d.docs)==null?void 0:a.source}}};var l,c,p;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`() => {
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  return <Grid style={{
    display: 'grid',
    gap: 12
  }}>
      <Button size="sm" onClick={() => setDir(v => v === 'ltr' ? 'rtl' : 'ltr')}>Switch direction ({dir})</Button>
      <DirectionProvider dir={dir}>
        <Box style={{
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        padding: 12
      }}>
          <strong>Current dir:</strong> {dir}
          <p style={{
          marginBottom: 0
        }}>Toolbar | Sidebar | Inspector</p>
        </Box>
      </DirectionProvider>
    </Grid>;
}`,...(p=(c=t.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};const f=["Default","ToggleDirection"];export{i as Default,t as ToggleDirection,f as __namedExportsOrder,B as default};
