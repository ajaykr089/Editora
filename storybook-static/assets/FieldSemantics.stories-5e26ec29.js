import{ao as i,j as t,B as S,a as e,ac as f,ap as x,aq as k,ar as g,a4 as r,as as s,b as l}from"./index-ce0e40fa.js";import"./index-93f6b7ae.js";import"./index-c197feae.js";const B={title:"UI/FieldSemantics",component:i},n=()=>t(S,{style:{display:"grid",gap:10,maxWidth:520},children:[e(f,{id:"story-email",placeholder:"ops@workspace.dev"}),e(x,{htmlFor:"story-email",children:"Used for incident digests and weekly delivery reports."}),e(k,{htmlFor:"story-email",active:!0,children:"Email domain must be allow-listed before rollout."})]}),o=()=>e(i,{legend:"Notification channels",description:"Select the delivery paths that should receive deployment and incident updates.",variant:"surface",tone:"brand",style:{maxWidth:640},children:t(g,{label:"Channels",orientation:"horizontal",variant:"soft",children:[e(r,{checked:!0}),e("span",{children:"Email"}),e(r,{}),e("span",{children:"SMS"}),e(r,{checked:!0}),e("span",{children:"Slack"})]})}),a=()=>t(i,{legend:"Publishing policy",description:"These settings control how releases are exposed to customers.",error:"Approval and public release cannot both be disabled.",invalid:!0,variant:"soft",tone:"warning",style:{maxWidth:720},children:[t(g,{label:"Release controls",orientation:"horizontal",variant:"surface",children:[e(s,{checked:!0}),e("span",{children:"Require approval"}),e(s,{}),e("span",{children:"Auto-publish changelog"}),e(s,{checked:!0}),e("span",{children:"Notify account owners"})]}),e("div",{slot:"actions",children:e(l,{size:"sm",variant:"secondary",children:"Reset"})}),e("div",{slot:"footer",children:e(l,{size:"sm",children:"Save policy"})})]});var c,d,p;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`() => <Box style={{
  display: 'grid',
  gap: 10,
  maxWidth: 520
}}>
    <Input id="story-email" placeholder="ops@workspace.dev" />
    <Description htmlFor="story-email">Used for incident digests and weekly delivery reports.</Description>
    <FieldError htmlFor="story-email" active>
      Email domain must be allow-listed before rollout.
    </FieldError>
  </Box>`,...(p=(d=n.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var h,u,m;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`() => <Fieldset legend="Notification channels" description="Select the delivery paths that should receive deployment and incident updates." variant="surface" tone="brand" style={{
  maxWidth: 640
}}>
    <ControlGroup label="Channels" orientation="horizontal" variant="soft">
      <Checkbox checked />
      <span>Email</span>
      <Checkbox />
      <span>SMS</span>
      <Checkbox checked />
      <span>Slack</span>
    </ControlGroup>
  </Fieldset>`,...(m=(u=o.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var v,y,b;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`() => <Fieldset legend="Publishing policy" description="These settings control how releases are exposed to customers." error="Approval and public release cannot both be disabled." invalid variant="soft" tone="warning" style={{
  maxWidth: 720
}}>
    <ControlGroup label="Release controls" orientation="horizontal" variant="surface">
      <Switch checked />
      <span>Require approval</span>
      <Switch />
      <span>Auto-publish changelog</span>
      <Switch checked />
      <span>Notify account owners</span>
    </ControlGroup>
    <div slot="actions">
      <Button size="sm" variant="secondary">Reset</Button>
    </div>
    <div slot="footer">
      <Button size="sm">Save policy</Button>
    </div>
  </Fieldset>`,...(b=(y=a.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};const z=["StandaloneAssociations","GroupedControls","PolicyReview"];export{o as GroupedControls,a as PolicyReview,n as StandaloneAssociations,z as __namedExportsOrder,B as default};
