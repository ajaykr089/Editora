import{ai as a,j as i,B as n,a as e,F as h}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const b={title:"UI/Separator",component:a},r=()=>i(n,{style:{maxWidth:560},children:[e(n,{style:{fontSize:13,color:"#334155"},children:"Pipeline overview"}),e(a,{label:"Milestone",variant:"gradient",tone:"brand"}),e(n,{style:{fontSize:13,color:"#334155"},children:"Live environments"}),e(a,{variant:"dashed",tone:"warning",inset:"sm"}),e(n,{style:{fontSize:13,color:"#334155"},children:"Archived releases"})]}),t=()=>i(h,{style:{display:"flex",alignItems:"center",gap:10,minHeight:36},children:[e("span",{children:"Left"}),e(a,{orientation:"vertical",variant:"gradient",tone:"brand",size:"medium"}),e("span",{children:"Center"}),e(a,{orientation:"vertical",variant:"glow",tone:"success"}),e("span",{children:"Right"})]}),o=()=>i(h,{style:{display:"flex",flexDirection:"column",gap:14,maxWidth:580},children:[e(a,{label:"Solid",variant:"solid"}),e(a,{label:"Dashed",variant:"dashed",tone:"warning"}),e(a,{label:"Dotted",variant:"dotted",tone:"danger"}),e(a,{label:"Gradient",variant:"gradient",tone:"brand"}),e(a,{label:"Glow",variant:"glow",tone:"success",size:"medium"})]});var s,l,d;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`() => <Box style={{
  maxWidth: 560
}}>
    <Box style={{
    fontSize: 13,
    color: '#334155'
  }}>Pipeline overview</Box>
    <Separator label="Milestone" variant="gradient" tone="brand" />
    <Box style={{
    fontSize: 13,
    color: '#334155'
  }}>Live environments</Box>
    <Separator variant="dashed" tone="warning" inset="sm" />
    <Box style={{
    fontSize: 13,
    color: '#334155'
  }}>Archived releases</Box>
  </Box>`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var c,p,m;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`() => <Flex style={{
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minHeight: 36
}}>
    <span>Left</span>
    <Separator orientation="vertical" variant="gradient" tone="brand" size="medium" />
    <span>Center</span>
    <Separator orientation="vertical" variant="glow" tone="success" />
    <span>Right</span>
  </Flex>`,...(m=(p=t.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var v,g,x;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`() => <Flex style={{
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  maxWidth: 580
}}>
    <Separator label="Solid" variant="solid" />
    <Separator label="Dashed" variant="dashed" tone="warning" />
    <Separator label="Dotted" variant="dotted" tone="danger" />
    <Separator label="Gradient" variant="gradient" tone="brand" />
    <Separator label="Glow" variant="glow" tone="success" size="medium" />
  </Flex>`,...(x=(g=o.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const f=["Horizontal","Vertical","Variants"];export{r as Horizontal,o as Variants,t as Vertical,f as __namedExportsOrder,b as default};
