import{M as e,j as g,G as f,a as r}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const u={title:"UI/Container",component:e,argTypes:{size:{control:"select",options:["sm","md","lg","xl"]}}},n=s=>g(e,{size:s.size,style:{padding:24,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:12},children:["Container content (",s.size,")"]});n.args={size:"md"};const a=()=>g(f,{style:{display:"grid",gap:10},children:[r(e,{size:"sm",style:{background:"#f1f5f9",padding:12},children:"Small"}),r(e,{size:"md",style:{background:"#f1f5f9",padding:12},children:"Medium"}),r(e,{size:"lg",style:{background:"#f1f5f9",padding:12},children:"Large"}),r(e,{size:"xl",style:{background:"#f1f5f9",padding:12},children:"Extra Large"})]});var i,o,d;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`(args: any) => <Container size={args.size} style={{
  padding: 24,
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 12
}}>
    Container content ({args.size})
  </Container>`,...(d=(o=n.parameters)==null?void 0:o.docs)==null?void 0:d.source}}};var t,l,c;a.parameters={...a.parameters,docs:{...(t=a.parameters)==null?void 0:t.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 10
}}>
    <Container size="sm" style={{
    background: '#f1f5f9',
    padding: 12
  }}>Small</Container>
    <Container size="md" style={{
    background: '#f1f5f9',
    padding: 12
  }}>Medium</Container>
    <Container size="lg" style={{
    background: '#f1f5f9',
    padding: 12
  }}>Large</Container>
    <Container size="xl" style={{
    background: '#f1f5f9',
    padding: 12
  }}>Extra Large</Container>
  </Grid>`,...(c=(l=a.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};const z=["Default","SizeComparison"];export{n as Default,a as SizeComparison,z as __namedExportsOrder,u as default};
