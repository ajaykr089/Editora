import{G as d,j as l,a as n,B as a}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const g={title:"UI/Grid",component:d},r=()=>l(d,{columns:"repeat(3, minmax(0, 1fr))",gap:"10px",children:[n(a,{style:{background:"#e2e8f0",padding:12,borderRadius:8},children:"1"}),n(a,{style:{background:"#e2e8f0",padding:12,borderRadius:8},children:"2"}),n(a,{style:{background:"#e2e8f0",padding:12,borderRadius:8},children:"3"})]}),e=()=>n(d,{columns:{initial:"1fr",md:"repeat(2, minmax(0, 1fr))",lg:"repeat(4, minmax(0, 1fr))"},gap:{initial:"8px",md:"12px"},children:Array.from({length:8}).map((u,o)=>l(a,{style:{background:"#f1f5f9",padding:12,borderRadius:8},children:["Item ",o+1]},o))});var s,i,t;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`() => <Grid columns="repeat(3, minmax(0, 1fr))" gap="10px">
    <Box style={{
    background: '#e2e8f0',
    padding: 12,
    borderRadius: 8
  }}>1</Box>
    <Box style={{
    background: '#e2e8f0',
    padding: 12,
    borderRadius: 8
  }}>2</Box>
    <Box style={{
    background: '#e2e8f0',
    padding: 12,
    borderRadius: 8
  }}>3</Box>
  </Grid>`,...(t=(i=r.parameters)==null?void 0:i.docs)==null?void 0:t.source}}};var m,p,c;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`() => <Grid columns={{
  initial: '1fr',
  md: 'repeat(2, minmax(0, 1fr))',
  lg: 'repeat(4, minmax(0, 1fr))'
} as any} gap={{
  initial: '8px',
  md: '12px'
} as any}>
    {Array.from({
    length: 8
  }).map((_, idx) => <Box key={idx} style={{
    background: '#f1f5f9',
    padding: 12,
    borderRadius: 8
  }}>
        Item {idx + 1}
      </Box>)}
  </Grid>`,...(c=(p=e.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};const b=["Default","ResponsiveColumns"];export{r as Default,e as ResponsiveColumns,b as __namedExportsOrder,g as default};
