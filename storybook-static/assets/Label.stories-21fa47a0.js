import{a3 as o,j as r,G as d,a as e,O as t,B as s}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const L={title:"UI/Label",component:o,argTypes:{htmlFor:{control:"text"},required:{control:"boolean"},description:{control:"text"},variant:{control:"select",options:["default","surface","soft","contrast","minimal","elevated"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},size:{control:"select",options:["sm","md","lg","1","2","3"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["default","square","soft"]}}},n=a=>r(d,{style:{display:"grid",gap:8,maxWidth:360},children:[e(o,{htmlFor:a.htmlFor,required:a.required,description:a.description,variant:a.variant,tone:a.tone,size:a.size,density:a.density,shape:a.shape,children:"Workspace name"}),e(t,{id:a.htmlFor,placeholder:"Acme Production"})]});n.args={htmlFor:"storybook-label-input",required:!0,description:"Used in account settings and billing reports.",variant:"surface",tone:"default",size:"md",density:"default",shape:"default"};const i=()=>r(d,{style:{display:"grid",gap:14,gridTemplateColumns:"repeat(3, minmax(220px, 1fr))"},children:[r(s,{style:{display:"grid",gap:8,border:"1px solid #e2e8f0",borderRadius:12,padding:12},children:[e(o,{htmlFor:"label-mui",variant:"surface",tone:"brand",children:"MUI-like Label"}),e(t,{id:"label-mui",placeholder:"Outlined control",variant:"outlined"})]}),r(s,{style:{display:"grid",gap:8,border:"1px solid #e2e8f0",borderRadius:12,padding:12,background:"linear-gradient(145deg, #f8fafc, #eef2ff)"},children:[e(o,{htmlFor:"label-chakra",variant:"soft",tone:"success",shape:"soft",description:"Low-noise form grouping",children:"Chakra-like Label"}),e(t,{id:"label-chakra",placeholder:"Soft control",variant:"soft",shape:"soft"})]}),r(s,{style:{display:"grid",gap:8,border:"1px solid #1e293b",borderRadius:12,padding:12,background:"#020617"},children:[e(o,{htmlFor:"label-ant",variant:"contrast",description:"Dark admin mode",children:"Ant-like Label"}),e(t,{id:"label-ant",placeholder:"Contrast control",variant:"contrast"})]})]}),l=()=>r(d,{style:{display:"grid",gap:8,maxWidth:360},children:[r(o,{htmlFor:"storybook-email-input",required:!0,children:["Email",e("span",{slot:"description",children:"We use this only for account notifications."})]}),e(t,{id:"storybook-email-input",type:"email",placeholder:"you@company.com"})]});var c,p,u;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`(args: any) => <Grid style={{
  display: 'grid',
  gap: 8,
  maxWidth: 360
}}>
    <Label htmlFor={args.htmlFor} required={args.required} description={args.description} variant={args.variant} tone={args.tone} size={args.size} density={args.density} shape={args.shape}>
      Workspace name
    </Label>
    <Input id={args.htmlFor} placeholder="Acme Production" />
  </Grid>`,...(u=(p=n.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var m,h,b;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))'
}}>
    <Box style={{
    display: 'grid',
    gap: 8,
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12
  }}>
      <Label htmlFor="label-mui" variant="surface" tone="brand">MUI-like Label</Label>
      <Input id="label-mui" placeholder="Outlined control" variant="outlined" />
    </Box>

    <Box style={{
    display: 'grid',
    gap: 8,
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12,
    background: 'linear-gradient(145deg, #f8fafc, #eef2ff)'
  }}>
      <Label htmlFor="label-chakra" variant="soft" tone="success" shape="soft" description="Low-noise form grouping">Chakra-like Label</Label>
      <Input id="label-chakra" placeholder="Soft control" variant="soft" shape="soft" />
    </Box>

    <Box style={{
    display: 'grid',
    gap: 8,
    border: '1px solid #1e293b',
    borderRadius: 12,
    padding: 12,
    background: '#020617'
  }}>
      <Label htmlFor="label-ant" variant="contrast" description="Dark admin mode">Ant-like Label</Label>
      <Input id="label-ant" placeholder="Contrast control" variant="contrast" />
    </Box>
  </Grid>`,...(b=(h=i.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var g,f,y;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 8,
  maxWidth: 360
}}>
    <Label htmlFor="storybook-email-input" required>
      Email
      <span slot="description">We use this only for account notifications.</span>
    </Label>
    <Input id="storybook-email-input" type="email" placeholder="you@company.com" />
  </Grid>`,...(y=(f=l.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};const v=["Playground","ProModes","WithHintSlot"];export{n as Playground,i as ProModes,l as WithHintSlot,v as __namedExportsOrder,L as default};
