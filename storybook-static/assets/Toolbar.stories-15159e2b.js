import{au as o,j as n,a as e,b as t,at as p,as as a,G as v,B as h}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const z={title:"UI/Toolbar",component:o,argTypes:{orientation:{control:"select",options:["horizontal","vertical"]},variant:{control:"select",options:["default","soft","contrast","minimal"]},wrap:{control:"boolean"}}},r=s=>n(o,{orientation:s.orientation||"horizontal",variant:s.variant||"default",wrap:s.wrap,"aria-label":"Editor toolbar",children:[e(t,{size:"sm",children:"Undo"}),e(t,{size:"sm",children:"Redo"}),e("div",{"data-separator":!0}),n(p,{multiple:!0,value:["bold"],children:[e(a,{value:"bold",children:"Bold"}),e(a,{value:"italic",children:"Italic"}),e(a,{value:"underline",children:"Underline"})]}),e("div",{"data-separator":!0}),e(t,{size:"sm",variant:"secondary",children:"Comment"})]});r.args={orientation:"horizontal",variant:"default",wrap:!1};const i=()=>n(v,{gap:"14px",style:{maxWidth:860},children:[n(o,{variant:"default",children:[e(t,{size:"sm",children:"Default"}),e(t,{size:"sm",variant:"secondary",children:"Actions"}),e(a,{pressed:!0,children:"Pin"})]}),n(o,{variant:"soft",size:"lg",wrap:!0,children:[e(t,{size:"sm",children:"Soft"}),e(t,{size:"sm",variant:"secondary",children:"Export"}),e(a,{pressed:!0,tone:"success",children:"Live"}),e(a,{children:"Preview"}),e(a,{children:"Share"})]}),e(h,{variant:"contrast",p:"12px",radius:"lg",children:n(o,{variant:"contrast",density:"compact",children:[e(t,{size:"sm",children:"Runtime"}),e(t,{size:"sm",variant:"secondary",children:"Logs"}),e(a,{pressed:!0,tone:"warning",children:"Alerts"})]})}),n(o,{variant:"minimal",orientation:"vertical",style:{maxWidth:220},children:[e(t,{size:"sm",children:"Cut"}),e(t,{size:"sm",children:"Copy"}),e(t,{size:"sm",children:"Paste"})]})]});var l,d,c;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`(args: any) => <Toolbar orientation={args.orientation || 'horizontal'} variant={args.variant || 'default'} wrap={args.wrap} aria-label="Editor toolbar">
    <Button size="sm">Undo</Button>
    <Button size="sm">Redo</Button>
    <div data-separator />
    <ToggleGroup multiple value={["bold"]}>
      <Toggle value="bold">Bold</Toggle>
      <Toggle value="italic">Italic</Toggle>
      <Toggle value="underline">Underline</Toggle>
    </ToggleGroup>
    <div data-separator />
    <Button size="sm" variant="secondary">Comment</Button>
  </Toolbar>`,...(c=(d=r.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var u,m,g;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`() => <Grid gap="14px" style={{
  maxWidth: 860
}}>
    <Toolbar variant="default">
      <Button size="sm">Default</Button>
      <Button size="sm" variant="secondary">Actions</Button>
      <Toggle pressed>Pin</Toggle>
    </Toolbar>

    <Toolbar variant="soft" size="lg" wrap>
      <Button size="sm">Soft</Button>
      <Button size="sm" variant="secondary">Export</Button>
      <Toggle pressed tone="success">Live</Toggle>
      <Toggle>Preview</Toggle>
      <Toggle>Share</Toggle>
    </Toolbar>

    <Box variant="contrast" p="12px" radius="lg">
      <Toolbar variant="contrast" density="compact">
        <Button size="sm">Runtime</Button>
        <Button size="sm" variant="secondary">Logs</Button>
        <Toggle pressed tone="warning">Alerts</Toggle>
      </Toolbar>
    </Box>

    <Toolbar variant="minimal" orientation="vertical" style={{
    maxWidth: 220
  }}>
      <Button size="sm">Cut</Button>
      <Button size="sm">Copy</Button>
      <Button size="sm">Paste</Button>
    </Toolbar>
  </Grid>`,...(g=(m=i.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};const b=["Default","VisualModes"];export{r as Default,i as VisualModes,b as __namedExportsOrder,z as default};
