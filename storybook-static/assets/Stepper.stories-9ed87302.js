import{am as i,j as r,B as t,a as e}from"./index-c1b18327.js";import{R as S}from"./index-93f6b7ae.js";const C={title:"UI/Stepper",component:i,argTypes:{orientation:{control:"select",options:["horizontal","vertical"]},variant:{control:"select",options:["default","contrast","minimal"]},linear:{control:"boolean"},clickable:{control:"boolean"}}},y=[{value:"org",label:"Organization",description:"Basic profile details"},{value:"modules",label:"Modules",description:"Enable hospital/school modules"},{value:"policies",label:"Policies",description:"Security and retention rules"},{value:"review",label:"Review",description:"Validate all config"}],a=n=>{const[s,x]=S.useState("org");return r(t,{style:{maxWidth:920,display:"grid",gap:10},children:[e(i,{steps:y,value:s,orientation:n.orientation||"horizontal",variant:n.variant||"default",linear:n.linear,clickable:n.clickable,onChange:f=>x(f.value)}),r(t,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:["Active step: ",e("strong",{children:s})]})]})};a.args={orientation:"horizontal",variant:"default",linear:!1,clickable:!0};const l=()=>e(t,{variant:"contrast",p:"12px",radius:"lg",style:{maxWidth:320},children:e(i,{variant:"contrast",orientation:"vertical",linear:!0,clickable:!0,steps:[{value:"1",label:"Collect data",description:"Fetch records",state:"complete"},{value:"2",label:"Normalize",description:"Map tenant schema"},{value:"3",label:"Validate",description:"Audit and policy checks"},{value:"4",label:"Publish",description:"Push to dashboard"}],value:"2"})}),o=()=>r(t,{style:{maxWidth:920,display:"grid",gap:10},children:[e(i,{clickable:!0,value:"policies",steps:[{value:"org",label:"Organization",description:"Tenant profile",state:"complete"},{value:"modules",label:"Modules",description:"Enable packages",state:"complete"},{value:"policies",label:"Policies",description:"Current review step"},{value:"review",label:"Review",description:"Final confirmation"}]}),e(t,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:"Current step shows animated indicator and connector flow."})]});var c,p,d;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`(args: any) => {
  const [value, setValue] = React.useState('org');
  return <Box style={{
    maxWidth: 920,
    display: 'grid',
    gap: 10
  }}>
      <Stepper steps={onboardingSteps} value={value} orientation={args.orientation || 'horizontal'} variant={args.variant || 'default'} linear={args.linear} clickable={args.clickable} onChange={detail => setValue(detail.value)} />
      <Box style={{
      fontSize: 'var(--ui-font-size-md, 14px)',
      color: 'var(--ui-color-muted, #64748b)'
    }}>Active step: <strong>{value}</strong></Box>
    </Box>;
}`,...(d=(p=a.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var u,v,m;l.parameters={...l.parameters,docs:{...(u=l.parameters)==null?void 0:u.docs,source:{originalSource:`() => <Box variant="contrast" p="12px" radius="lg" style={{
  maxWidth: 320
}}>
    <Stepper variant="contrast" orientation="vertical" linear clickable steps={[{
    value: '1',
    label: 'Collect data',
    description: 'Fetch records',
    state: 'complete'
  }, {
    value: '2',
    label: 'Normalize',
    description: 'Map tenant schema'
  }, {
    value: '3',
    label: 'Validate',
    description: 'Audit and policy checks'
  }, {
    value: '4',
    label: 'Publish',
    description: 'Push to dashboard'
  }]} value="2" />
  </Box>`,...(m=(v=l.parameters)==null?void 0:v.docs)==null?void 0:m.source}}};var b,g,h;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`() => <Box style={{
  maxWidth: 920,
  display: 'grid',
  gap: 10
}}>
    <Stepper clickable value="policies" steps={[{
    value: 'org',
    label: 'Organization',
    description: 'Tenant profile',
    state: 'complete'
  }, {
    value: 'modules',
    label: 'Modules',
    description: 'Enable packages',
    state: 'complete'
  }, {
    value: 'policies',
    label: 'Policies',
    description: 'Current review step'
  }, {
    value: 'review',
    label: 'Review',
    description: 'Final confirmation'
  }]} />
    <Box style={{
    fontSize: 'var(--ui-font-size-md, 14px)',
    color: 'var(--ui-color-muted, #64748b)'
  }}>
      Current step shows animated indicator and connector flow.
    </Box>
  </Box>`,...(h=(g=o.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const B=["Controlled","ContrastVertical","AnimatedCurrentStep"];export{o as AnimatedCurrentStep,l as ContrastVertical,a as Controlled,B as __namedExportsOrder,C as default};
