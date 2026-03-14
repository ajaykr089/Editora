import{a1 as a,j as o,F as t,a as e,B as s,G as y}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const z={title:"UI/Icon",component:a,argTypes:{name:{control:"text"},size:{control:"text"},variant:{control:"select",options:["default","surface","soft","contrast","minimal","elevated"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},shape:{control:"select",options:["default","square","soft"]},color:{control:"color"},label:{control:"text"},spin:{control:"boolean"},pulse:{control:"boolean"},badge:{control:"boolean"},decorative:{control:"boolean"}}},r=n=>o(t,{style:{display:"flex",alignItems:"center",gap:16},children:[e(a,{name:n.name,size:n.size,variant:n.variant,tone:n.tone,shape:n.shape,color:n.color,label:n.label,spin:n.spin,pulse:n.pulse,badge:n.badge,decorative:n.decorative}),e(s,{style:{fontSize:14,color:"#475569"},children:"Token-driven icon with accessible modes and visual variants."})]});r.args={name:"check",size:"20px",variant:"surface",tone:"brand",shape:"soft",color:"",label:"Confirmed",spin:!1,pulse:!1,badge:!1,decorative:!1};const i=()=>o(y,{style:{display:"grid",gap:14,gridTemplateColumns:"repeat(3, minmax(200px, 1fr))"},children:[o(s,{style:{display:"grid",gap:10,border:"1px solid #e2e8f0",borderRadius:12,padding:12,background:"#f8fafc"},children:[e(s,{style:{fontSize:12,color:"#64748b"},children:"MUI-like"}),o(t,{style:{display:"flex",gap:10,alignItems:"center"},children:[e(a,{name:"check",variant:"surface",tone:"brand",size:"22"}),e(a,{name:"x",variant:"surface",tone:"danger",size:"22"})]})]}),o(s,{style:{display:"grid",gap:10,border:"1px solid #e2e8f0",borderRadius:12,padding:12,background:"linear-gradient(145deg, #f8fafc, #eef2ff)"},children:[e(s,{style:{fontSize:12,color:"#64748b"},children:"Chakra-like"}),o(t,{style:{display:"flex",gap:10,alignItems:"center"},children:[e(a,{name:"check",variant:"soft",tone:"success",shape:"soft",size:"22"}),e(a,{name:"x",variant:"soft",tone:"warning",shape:"soft",size:"22"})]})]}),o(s,{style:{display:"grid",gap:10,border:"1px solid #1e293b",borderRadius:12,padding:12,background:"#020617",color:"#e2e8f0"},children:[e(s,{style:{fontSize:12,color:"#93a4bd"},children:"Ant-like"}),o(t,{style:{display:"flex",gap:10,alignItems:"center"},children:[e(a,{name:"check",variant:"contrast",size:"22"}),e(a,{name:"x",variant:"contrast",tone:"danger",size:"22",badge:!0})]})]})]}),l=()=>o(t,{style:{display:"flex",alignItems:"center",gap:16},children:[e(a,{name:"check",spin:!0,tone:"brand",variant:"minimal",size:"24",label:"Syncing",decorative:!1}),e(a,{name:"x",pulse:!0,tone:"warning",variant:"elevated",size:"22"}),e(a,{name:"unknown",variant:"surface",tone:"danger",size:"22"})]});var c,d,p;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`(args: any) => <Flex style={{
  display: 'flex',
  alignItems: 'center',
  gap: 16
}}>
    <Icon name={args.name} size={args.size} variant={args.variant} tone={args.tone} shape={args.shape} color={args.color} label={args.label} spin={args.spin} pulse={args.pulse} badge={args.badge} decorative={args.decorative} />
    <Box style={{
    fontSize: 14,
    color: '#475569'
  }}>Token-driven icon with accessible modes and visual variants.</Box>
  </Flex>`,...(p=(d=r.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var g,f,m;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))'
}}>
    <Box style={{
    display: 'grid',
    gap: 10,
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12,
    background: '#f8fafc'
  }}>
      <Box style={{
      fontSize: 12,
      color: '#64748b'
    }}>MUI-like</Box>
      <Flex style={{
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }}>
        <Icon name="check" variant="surface" tone="brand" size="22" />
        <Icon name="x" variant="surface" tone="danger" size="22" />
      </Flex>
    </Box>

    <Box style={{
    display: 'grid',
    gap: 10,
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12,
    background: 'linear-gradient(145deg, #f8fafc, #eef2ff)'
  }}>
      <Box style={{
      fontSize: 12,
      color: '#64748b'
    }}>Chakra-like</Box>
      <Flex style={{
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }}>
        <Icon name="check" variant="soft" tone="success" shape="soft" size="22" />
        <Icon name="x" variant="soft" tone="warning" shape="soft" size="22" />
      </Flex>
    </Box>

    <Box style={{
    display: 'grid',
    gap: 10,
    border: '1px solid #1e293b',
    borderRadius: 12,
    padding: 12,
    background: '#020617',
    color: '#e2e8f0'
  }}>
      <Box style={{
      fontSize: 12,
      color: '#93a4bd'
    }}>Ant-like</Box>
      <Flex style={{
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }}>
        <Icon name="check" variant="contrast" size="22" />
        <Icon name="x" variant="contrast" tone="danger" size="22" badge />
      </Flex>
    </Box>
  </Grid>`,...(m=(f=i.parameters)==null?void 0:f.docs)==null?void 0:m.source}}};var x,b,u;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`() => <Flex style={{
  display: 'flex',
  alignItems: 'center',
  gap: 16
}}>
    <Icon name="check" spin tone="brand" variant="minimal" size="24" label="Syncing" decorative={false} />
    <Icon name="x" pulse tone="warning" variant="elevated" size="22" />
    <Icon name="unknown" variant="surface" tone="danger" size="22" />
  </Flex>`,...(u=(b=l.parameters)==null?void 0:b.docs)==null?void 0:u.source}}};const k=["Playground","DesignModes","MotionAndFallback"];export{i as DesignModes,l as MotionAndFallback,r as Playground,k as __namedExportsOrder,z as default};
