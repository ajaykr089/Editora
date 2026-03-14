import{ax as o,j as a,B as t,a as e,p as m,O as V,o as I,q as O,F as x,b as y}from"./index-c1b18327.js";import{R as h}from"./index-93f6b7ae.js";const q={title:"UI/Wizard",component:o,argTypes:{linear:{control:"boolean"},variant:{control:"select",options:["default","soft","glass","flat","contrast","minimal"]},orientation:{control:"select",options:["horizontal","vertical"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["rounded","square","pill"]},showProgress:{control:"boolean"},busy:{control:"boolean"}}},n=i=>{const[c,p]=h.useState("org"),[P,v]=h.useState(!1),[E,u]=h.useState("idle");return a(t,{style:{maxWidth:920,display:"grid",gap:12},children:[a(o,{value:c,linear:i.linear,variant:i.variant||"glass",orientation:i.orientation||"horizontal",density:i.density||"default",shape:i.shape||"rounded",showProgress:i.showProgress??!0,busy:P||i.busy,title:"Workspace Provisioning",description:"Configure tenant profile, modules, and policy in a guided enterprise flow.",onBeforeChange:s=>!(s.nextValue==="review"&&!c),onChange:s=>{p(s.value),u(`step:${s.value}`)},onComplete:()=>{v(!0),u("publishing"),window.setTimeout(()=>{v(!1),u("complete")},1100)},children:[e(t,{slot:"step","data-value":"org","data-title":"Organization","data-description":"Tenant profile",children:e(m,{label:"Organization name",htmlFor:"wizard-org-name",required:!0,children:e(V,{id:"wizard-org-name",placeholder:"Northstar Hospital",required:!0})})}),e(t,{slot:"step","data-value":"modules","data-title":"Modules","data-description":"Feature toggles",children:e(m,{label:"Primary module",htmlFor:"wizard-module",children:a(I,{id:"wizard-module",value:"hospital",children:[e("option",{value:"hospital",children:"Hospital management"}),e("option",{value:"school",children:"School management"}),e("option",{value:"commerce",children:"E-commerce operations"})]})})}),e(t,{slot:"step","data-value":"policy","data-title":"Policy","data-description":"Validation rules",children:e(m,{label:"Retention policy",htmlFor:"wizard-policy",children:e(O,{id:"wizard-policy",rows:3,value:"7 years for records"})})}),e(t,{slot:"step","data-value":"review","data-title":"Review","data-description":"Ready to ship",children:e(t,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:"Review all fields and click Finish to publish this admin workspace."})})]}),a(x,{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"},children:[a(t,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:["Current value: ",e("strong",{children:c})," • Event: ",e("strong",{children:E})]}),a(x,{style:{display:"flex",gap:8},children:[e(y,{size:"sm",variant:"secondary",onClick:()=>p("org"),children:"Reset"}),e(y,{size:"sm",onClick:()=>p("review"),children:"Jump review"})]})]})]})};n.args={linear:!0,variant:"glass",orientation:"horizontal",density:"default",shape:"rounded",showProgress:!0,busy:!1};const r=()=>e(t,{style:{maxWidth:340},children:a(o,{value:"triage",orientation:"vertical",linear:!0,variant:"soft",density:"compact",title:"Clinical Intake",description:"Guided patient onboarding checklist",finishLabel:"Complete intake",children:[e(t,{slot:"step","data-value":"register","data-title":"Registration","data-description":"Identity and insurance","data-state":"success",children:e(t,{style:{fontSize:"13px"},children:"Registration data captured."})}),e(t,{slot:"step","data-value":"triage","data-title":"Triage","data-description":"Vitals and severity","data-state":"warning",children:e(t,{style:{fontSize:"13px"},children:"Vitals pending manual review."})}),e(t,{slot:"step","data-value":"doctor","data-title":"Doctor","data-description":"Assign physician",children:e(t,{style:{fontSize:"13px"},children:"Physician assignment queued."})}),e(t,{slot:"step","data-value":"admit","data-title":"Admission","data-description":"Finalize care plan","data-optional":!0,children:e(t,{style:{fontSize:"13px"},children:"Optional for outpatient cases."})})]})}),l=()=>e(t,{variant:"contrast",p:"12px",radius:"lg",style:{maxWidth:920},children:a(o,{value:"2",variant:"contrast",linear:!0,title:"Deployment Control",description:"Secure release workflow",children:[e(t,{slot:"step","data-value":"1","data-title":"Data import","data-description":"Source mapping","data-state":"success",children:e(t,{style:{fontSize:"var(--ui-font-size-md, 14px)"},children:"Import source selected."})}),e(t,{slot:"step","data-value":"2","data-title":"Schema","data-description":"Validate entities",children:e(t,{style:{fontSize:"var(--ui-font-size-md, 14px)"},children:"Schema validation in progress."})}),e(t,{slot:"step","data-value":"3","data-title":"Permissions","data-description":"RBAC rules","data-state":"error",children:e(t,{style:{fontSize:"var(--ui-font-size-md, 14px)"},children:"Permissions policy conflict detected."})})]})}),d=()=>e(t,{style:{maxWidth:700},children:e(o,{title:"New Flow",description:"No steps attached yet.",emptyLabel:"Add <Box slot='step'> panels to initialize this wizard."})});var g,f,z;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`(args: any) => {
  const [value, setValue] = React.useState('org');
  const [busy, setBusy] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState('idle');
  return <Box style={{
    maxWidth: 920,
    display: 'grid',
    gap: 12
  }}>
      <Wizard value={value} linear={args.linear} variant={args.variant || 'glass'} orientation={args.orientation || 'horizontal'} density={args.density || 'default'} shape={args.shape || 'rounded'} showProgress={args.showProgress ?? true} busy={busy || args.busy} title="Workspace Provisioning" description="Configure tenant profile, modules, and policy in a guided enterprise flow." onBeforeChange={detail => {
      if (detail.nextValue === 'review' && !value) return false;
      return true;
    }} onChange={detail => {
      setValue(detail.value);
      setLastEvent(\`step:\${detail.value}\`);
    }} onComplete={() => {
      setBusy(true);
      setLastEvent('publishing');
      window.setTimeout(() => {
        setBusy(false);
        setLastEvent('complete');
      }, 1100);
    }}>
        <Box slot="step" data-value="org" data-title="Organization" data-description="Tenant profile">
          <Field label="Organization name" htmlFor="wizard-org-name" required>
            <Input id="wizard-org-name" placeholder="Northstar Hospital" required />
          </Field>
        </Box>

        <Box slot="step" data-value="modules" data-title="Modules" data-description="Feature toggles">
          <Field label="Primary module" htmlFor="wizard-module">
            <Select id="wizard-module" value="hospital">
              <option value="hospital">Hospital management</option>
              <option value="school">School management</option>
              <option value="commerce">E-commerce operations</option>
            </Select>
          </Field>
        </Box>

        <Box slot="step" data-value="policy" data-title="Policy" data-description="Validation rules">
          <Field label="Retention policy" htmlFor="wizard-policy">
            <Textarea id="wizard-policy" rows={3} value="7 years for records" />
          </Field>
        </Box>

        <Box slot="step" data-value="review" data-title="Review" data-description="Ready to ship">
          <Box style={{
          fontSize: 'var(--ui-font-size-md, 14px)',
          color: 'var(--ui-color-muted, #64748b)'
        }}>
            Review all fields and click Finish to publish this admin workspace.
          </Box>
        </Box>
      </Wizard>

      <Flex style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Box style={{
        fontSize: 'var(--ui-font-size-md, 14px)',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Current value: <strong>{value}</strong> • Event: <strong>{lastEvent}</strong>
        </Box>
        <Flex style={{
        display: 'flex',
        gap: 8
      }}>
          <Button size="sm" variant="secondary" onClick={() => setValue('org')}>Reset</Button>
          <Button size="sm" onClick={() => setValue('review')}>Jump review</Button>
        </Flex>
      </Flex>
    </Box>;
}`,...(z=(f=n.parameters)==null?void 0:f.docs)==null?void 0:z.source}}};var B,w,S;r.parameters={...r.parameters,docs:{...(B=r.parameters)==null?void 0:B.docs,source:{originalSource:`() => <Box style={{
  maxWidth: 340
}}>
    <Wizard value="triage" orientation="vertical" linear variant="soft" density="compact" title="Clinical Intake" description="Guided patient onboarding checklist" finishLabel="Complete intake">
      <Box slot="step" data-value="register" data-title="Registration" data-description="Identity and insurance" data-state="success">
        <Box style={{
        fontSize: '13px'
      }}>Registration data captured.</Box>
      </Box>
      <Box slot="step" data-value="triage" data-title="Triage" data-description="Vitals and severity" data-state="warning">
        <Box style={{
        fontSize: '13px'
      }}>Vitals pending manual review.</Box>
      </Box>
      <Box slot="step" data-value="doctor" data-title="Doctor" data-description="Assign physician">
        <Box style={{
        fontSize: '13px'
      }}>Physician assignment queued.</Box>
      </Box>
      <Box slot="step" data-value="admit" data-title="Admission" data-description="Finalize care plan" data-optional>
        <Box style={{
        fontSize: '13px'
      }}>Optional for outpatient cases.</Box>
      </Box>
    </Wizard>
  </Box>`,...(S=(w=r.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};var b,C,F;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`() => <Box variant="contrast" p="12px" radius="lg" style={{
  maxWidth: 920
}}>
    <Wizard value="2" variant="contrast" linear title="Deployment Control" description="Secure release workflow">
      <Box slot="step" data-value="1" data-title="Data import" data-description="Source mapping" data-state="success">
        <Box style={{
        fontSize: 'var(--ui-font-size-md, 14px)'
      }}>Import source selected.</Box>
      </Box>
      <Box slot="step" data-value="2" data-title="Schema" data-description="Validate entities">
        <Box style={{
        fontSize: 'var(--ui-font-size-md, 14px)'
      }}>Schema validation in progress.</Box>
      </Box>
      <Box slot="step" data-value="3" data-title="Permissions" data-description="RBAC rules" data-state="error">
        <Box style={{
        fontSize: 'var(--ui-font-size-md, 14px)'
      }}>Permissions policy conflict detected.</Box>
      </Box>
    </Wizard>
  </Box>`,...(F=(C=l.parameters)==null?void 0:C.docs)==null?void 0:F.source}}};var R,W,k;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`() => <Box style={{
  maxWidth: 700
}}>
    <Wizard title="New Flow" description="No steps attached yet." emptyLabel="Add <Box slot='step'> panels to initialize this wizard." />
  </Box>`,...(k=(W=d.parameters)==null?void 0:W.docs)==null?void 0:k.source}}};const A=["EnterpriseOnboarding","VerticalClinicalChecklist","ContrastReview","EmptyState"];export{l as ContrastReview,d as EmptyState,n as EnterpriseOnboarding,r as VerticalClinicalChecklist,A as __namedExportsOrder,q as default};
