import{aD as i,a as n,j as g,B as t,G as m}from"./index-ce0e40fa.js";import"./index-93f6b7ae.js";import"./index-c197feae.js";const h={title:"UI/Section",component:i,argTypes:{size:{control:"select",options:["small","medium","large"]},variant:{control:"select",options:["default","surface","muted","outline","elevated","gradient","contrast"]},tone:{control:"select",options:["neutral","brand","success","warning","danger","info"]},radius:{control:"select",options:["none","sm","md","lg","xl"]},density:{control:"select",options:["compact","comfortable"]},inset:{control:"boolean"}}},o=e=>n(i,{size:e.size,variant:e.variant,tone:e.tone,radius:e.radius,density:e.density,inset:e.inset,children:g(t,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:14,background:"#f8fafc"},children:[n("strong",{children:"Section content"}),n(t,{style:{marginTop:8,fontSize:13,color:"#475569"},children:"Use this primitive for page bands, grouped layouts, and themed content zones."})]})});o.args={size:"medium",variant:"surface",tone:"neutral",radius:"md",density:"comfortable",inset:!1};const a=()=>g(m,{style:{display:"grid",gap:14,maxWidth:760},children:[n(i,{variant:"surface",size:"small",radius:"sm",children:n(t,{style:{padding:10},children:"Surface small section"})}),n(i,{variant:"outline",tone:"brand",size:"medium",radius:"md",children:n(t,{style:{padding:10},children:"Outline + brand accent"})}),n(i,{variant:"gradient",tone:"info",size:"large",radius:"lg",children:n(t,{style:{padding:10},children:"Gradient + info tone for highlight blocks"})}),n(i,{variant:"contrast",size:"medium",radius:"lg",children:n(t,{style:{padding:10},children:"Contrast mode for dark regions"})})]});var r,s,d;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`(args: any) => <Section size={args.size} variant={args.variant} tone={args.tone} radius={args.radius} density={args.density} inset={args.inset}>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: 14,
    background: '#f8fafc'
  }}>
      <strong>Section content</strong>
      <Box style={{
      marginTop: 8,
      fontSize: 13,
      color: '#475569'
    }}>
        Use this primitive for page bands, grouped layouts, and themed content zones.
      </Box>
    </Box>
  </Section>`,...(d=(s=o.parameters)==null?void 0:s.docs)==null?void 0:d.source}}};var l,c,u;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 14,
  maxWidth: 760
}}>
    <Section variant="surface" size="small" radius="sm">
      <Box style={{
      padding: 10
    }}>Surface small section</Box>
    </Section>

    <Section variant="outline" tone="brand" size="medium" radius="md">
      <Box style={{
      padding: 10
    }}>Outline + brand accent</Box>
    </Section>

    <Section variant="gradient" tone="info" size="large" radius="lg">
      <Box style={{
      padding: 10
    }}>Gradient + info tone for highlight blocks</Box>
    </Section>

    <Section variant="contrast" size="medium" radius="lg">
      <Box style={{
      padding: 10
    }}>Contrast mode for dark regions</Box>
    </Section>
  </Grid>`,...(u=(c=a.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};const x=["Playground","VisualModes"];export{o as Playground,a as VisualModes,x as __namedExportsOrder,h as default};
