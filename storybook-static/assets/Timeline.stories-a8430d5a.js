import{ag as a,a as i,B as m}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const x={title:"UI/Timeline",component:a},d=[{title:"Spec freeze",time:"Feb 10, 2026",description:"Finalized sprint scope and acceptance criteria.",tone:"info"},{title:"Internal QA sign-off",time:"Feb 14, 2026",description:"All critical regressions resolved.",tone:"success"},{title:"Security review",time:"Feb 18, 2026",description:"Permission model and audit logs validated.",tone:"warning"},{title:"Production release",time:"Feb 21, 2026",description:"Rolled out to all admin tenants.",tone:"default",active:!0}],e=()=>i(m,{style:{maxWidth:680},children:i(a,{items:d})}),t=()=>i(m,{variant:"contrast",p:"12px",radius:"lg",style:{maxWidth:680},children:i(a,{variant:"contrast",items:d})});var r,s,n;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`() => <Box style={{
  maxWidth: 680
}}>
    <Timeline items={releaseTimeline} />
  </Box>`,...(n=(s=e.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};var o,l,c;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`() => <Box variant="contrast" p="12px" radius="lg" style={{
  maxWidth: 680
}}>
    <Timeline variant="contrast" items={releaseTimeline} />
  </Box>`,...(c=(l=t.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};const f=["Default","Contrast"];export{t as Contrast,e as Default,f as __namedExportsOrder,x as default};
