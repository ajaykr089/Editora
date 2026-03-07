import{ae as l,j as n,B as r,a as t,b as o,F as z}from"./index-c1b18327.js";import{R as y}from"./index-93f6b7ae.js";const S={title:"UI/QuickActions",component:l,argTypes:{mode:{control:"select",options:["bar","fab"]},orientation:{control:"select",options:["horizontal","vertical"]},variant:{control:"select",options:["default","soft","contrast","minimal"]},floating:{control:"boolean"},collapsible:{control:"boolean"}}},a=e=>{const[f,x]=y.useState("No action selected");return n(r,{style:{minHeight:240,display:"grid",gap:10,alignContent:"start"},children:[n(l,{mode:e.mode||"bar",orientation:e.orientation||"horizontal",variant:e.variant||"default",floating:!!e.floating,collapsible:typeof e.collapsible=="boolean"?e.collapsible:!0,onSelect:B=>x(`Selected: ${B.label}`),children:[t(o,{slot:"action",size:"sm",children:"Create"}),t(o,{slot:"action",size:"sm",variant:"secondary",children:"Assign"}),t(o,{slot:"action",size:"sm",variant:"ghost",children:"Export"})]}),t(r,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:f})]})};a.args={mode:"bar",orientation:"horizontal",variant:"default",floating:!1,collapsible:!0};const i=()=>n(r,{style:{minHeight:320,border:"1px solid var(--ui-color-border, #cbd5e1)",borderRadius:"calc(var(--ui-radius, 12px) + 2px)",position:"relative",padding:"var(--ui-space-lg, 16px)"},children:[t(z,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:"Floating quick actions for dense admin workflows."}),n(l,{mode:"fab",floating:!0,placement:"bottom-right",label:"Quick actions",onSelect:()=>{},children:[t(o,{slot:"action",size:"sm",children:"New patient"}),t(o,{slot:"action",size:"sm",variant:"secondary",children:"New class"}),t(o,{slot:"action",size:"sm",variant:"ghost",children:"New invoice"})]})]}),s=()=>t(r,{variant:"contrast",p:"12px",radius:"lg",style:{maxWidth:240},children:n(l,{mode:"bar",orientation:"vertical",variant:"contrast",collapsible:!0,children:[t(o,{slot:"action",size:"sm",children:"Alerts"}),t(o,{slot:"action",size:"sm",variant:"secondary",children:"Incidents"}),t(o,{slot:"action",size:"sm",variant:"ghost",children:"Escalate"})]})});var c,d,u;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`(args: any) => {
  const [message, setMessage] = React.useState('No action selected');
  return <Box style={{
    minHeight: 240,
    display: 'grid',
    gap: 10,
    alignContent: 'start'
  }}>
      <QuickActions mode={args.mode || 'bar'} orientation={args.orientation || 'horizontal'} variant={args.variant || 'default'} floating={!!args.floating} collapsible={typeof args.collapsible === 'boolean' ? args.collapsible : true} onSelect={detail => setMessage(\`Selected: \${detail.label}\`)}>
        <Button slot="action" size="sm">Create</Button>
        <Button slot="action" size="sm" variant="secondary">Assign</Button>
        <Button slot="action" size="sm" variant="ghost">Export</Button>
      </QuickActions>

      <Box style={{
      fontSize: 'var(--ui-font-size-md, 14px)',
      color: 'var(--ui-color-muted, #64748b)'
    }}>{message}</Box>
    </Box>;
}`,...(u=(d=a.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var m,p,g;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`() => <Box style={{
  minHeight: 320,
  border: '1px solid var(--ui-color-border, #cbd5e1)',
  borderRadius: 'calc(var(--ui-radius, 12px) + 2px)',
  position: 'relative',
  padding: 'var(--ui-space-lg, 16px)'
}}>
    <Flex style={{
    fontSize: 'var(--ui-font-size-md, 14px)',
    color: 'var(--ui-color-muted, #64748b)'
  }}>Floating quick actions for dense admin workflows.</Flex>
    <QuickActions mode="fab" floating placement="bottom-right" label="Quick actions" onSelect={() => {}}>
      <Button slot="action" size="sm">New patient</Button>
      <Button slot="action" size="sm" variant="secondary">New class</Button>
      <Button slot="action" size="sm" variant="ghost">New invoice</Button>
    </QuickActions>
  </Box>`,...(g=(p=i.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var b,v,h;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`() => <Box variant="contrast" p="12px" radius="lg" style={{
  maxWidth: 240
}}>
    <QuickActions mode="bar" orientation="vertical" variant="contrast" collapsible>
      <Button slot="action" size="sm">Alerts</Button>
      <Button slot="action" size="sm" variant="secondary">Incidents</Button>
      <Button slot="action" size="sm" variant="ghost">Escalate</Button>
    </QuickActions>
  </Box>`,...(h=(v=s.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};const Q=["ActionBar","FloatingFab","ContrastVertical"];export{a as ActionBar,s as ContrastVertical,i as FloatingFab,Q as __namedExportsOrder,S as default};
