import{as as s,j as r,G as m,a as e,B as x,F as o}from"./index-c1b18327.js";import{R as f}from"./index-93f6b7ae.js";const w={title:"UI/Toggle",component:s,argTypes:{pressed:{control:"boolean"},disabled:{control:"boolean"},size:{control:"select",options:["sm","md","lg"]},variant:{control:"select",options:["default","soft","outline","contrast","minimal"]},tone:{control:"select",options:["brand","success","warning","danger"]}}},a=n=>{const[l,T]=f.useState(!!n.pressed);return r(m,{gap:"12px",style:{maxWidth:420},children:[e(s,{pressed:l,disabled:n.disabled,size:n.size||"md",variant:n.variant||"default",tone:n.tone||"brand",iconOn:"✓",iconOff:"○",onChange:h=>T(h.pressed),children:"Bold"}),r(x,{style:{fontSize:13,color:"#475569"},children:["Pressed: ",e("strong",{children:String(l)})]})]})};a.args={pressed:!1,disabled:!1,size:"md",variant:"default",tone:"brand"};const t=()=>r(m,{gap:"12px",style:{maxWidth:700},children:[r(o,{gap:"10px",wrap:"wrap",children:[e(s,{variant:"default",pressed:!0,children:"Default"}),e(s,{variant:"soft",pressed:!0,children:"Soft"}),e(s,{variant:"outline",pressed:!0,children:"Outline"}),e(s,{variant:"minimal",pressed:!0,children:"Minimal"})]}),e(x,{variant:"contrast",p:"12px",radius:"lg",children:r(o,{gap:"10px",wrap:"wrap",children:[e(s,{variant:"contrast",tone:"success",pressed:!0,children:"Success"}),e(s,{variant:"contrast",tone:"warning",pressed:!0,children:"Warning"}),e(s,{variant:"contrast",tone:"danger",pressed:!0,children:"Danger"})]})}),r(o,{gap:"10px",wrap:"wrap",children:[e(s,{size:"sm",children:"Small"}),e(s,{size:"md",children:"Medium"}),e(s,{size:"lg",children:"Large"}),e(s,{disabled:!0,pressed:!0,children:"Disabled"})]})]});var i,d,g;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`(args: any) => {
  const [pressed, setPressed] = React.useState(Boolean(args.pressed));
  return <Grid gap="12px" style={{
    maxWidth: 420
  }}>
      <Toggle pressed={pressed} disabled={args.disabled} size={args.size || 'md'} variant={args.variant || 'default'} tone={args.tone || 'brand'} iconOn="✓" iconOff="○" onChange={detail => setPressed(detail.pressed)}>
        Bold
      </Toggle>
      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>Pressed: <strong>{String(pressed)}</strong></Box>
    </Grid>;
}`,...(g=(d=a.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var p,c,u;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`() => <Grid gap="12px" style={{
  maxWidth: 700
}}>
    <Flex gap="10px" wrap="wrap">
      <Toggle variant="default" pressed>Default</Toggle>
      <Toggle variant="soft" pressed>Soft</Toggle>
      <Toggle variant="outline" pressed>Outline</Toggle>
      <Toggle variant="minimal" pressed>Minimal</Toggle>
    </Flex>

    <Box variant="contrast" p="12px" radius="lg">
      <Flex gap="10px" wrap="wrap">
        <Toggle variant="contrast" tone="success" pressed>Success</Toggle>
        <Toggle variant="contrast" tone="warning" pressed>Warning</Toggle>
        <Toggle variant="contrast" tone="danger" pressed>Danger</Toggle>
      </Flex>
    </Box>

    <Flex gap="10px" wrap="wrap">
      <Toggle size="sm">Small</Toggle>
      <Toggle size="md">Medium</Toggle>
      <Toggle size="lg">Large</Toggle>
      <Toggle disabled pressed>Disabled</Toggle>
    </Flex>
  </Grid>`,...(u=(c=t.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};const z=["Controlled","VisualModes"];export{a as Controlled,t as VisualModes,z as __namedExportsOrder,w as default};
