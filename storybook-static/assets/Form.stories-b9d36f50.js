import{aA as g,a as e,B as l,j as a,b as c,G as C,p as s,O as p,q as k,ad as L,F as z,aB as T,o as $}from"./index-c1b18327.js";import{r as o}from"./index-93f6b7ae.js";function b(){const t=o.useRef(null),d=o.useCallback(async()=>{const n=t.current;return n?await n.submit():!1},[]),i=o.useCallback(async()=>{const n=t.current;return n?await n.validate():{valid:!0,errors:{}}},[]),u=o.useCallback(()=>{var r;const n=t.current;return n?(r=n.getValues)==null?void 0:r.call(n):{}},[]),f=o.useCallback(n=>{var v;const r=t.current;return(v=r==null?void 0:r.reset)==null?void 0:v.call(r,n)},[]),h=o.useCallback(()=>{var r;const n=t.current;return n?typeof n.isDirty=="function"?!!n.isDirty():((r=n.hasAttribute)==null?void 0:r.call(n,"dirty"))||!1:!1},[]),m=o.useCallback(n=>{var v;const r=t.current;return(v=r==null?void 0:r.markClean)==null?void 0:v.call(r,n)},[]);return{ref:t,submit:d,validate:i,getValues:u,reset:f,isDirty:h,markClean:m}}const _={title:"UI/Form",component:g,argTypes:{heading:{control:"text"},description:{control:"text"},state:{control:"select",options:["default","success","warning","error"]},stateText:{control:"text"},loadingText:{control:"text"},variant:{control:"select",options:["default","surface","outline","soft","contrast","minimal","elevated"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["default","square","soft"]},elevation:{control:"select",options:["default","none","low","high"]},gap:{control:"text"},novalidate:{control:"boolean"}}},x=t=>{const{ref:d,submit:i,getValues:u,validate:f}=b(),[h,m]=o.useState("No action yet");return e(l,{style:{maxWidth:620},children:a(g,{ref:d,heading:t.heading,description:t.description,state:t.state,stateText:t.stateText,loadingText:t.loadingText,variant:t.variant,tone:t.tone,density:t.density,shape:t.shape,elevation:t.elevation,gap:t.gap,novalidate:t.novalidate,onSubmit:n=>m(`Submitted: ${JSON.stringify(n)}`),onInvalid:n=>m(`Invalid: ${JSON.stringify(n)}`),children:[e(c,{slot:"actions",size:"sm",variant:"secondary",onClick:()=>m(`Preview values: ${JSON.stringify(u())}`),children:"Preview"}),a(C,{style:{display:"grid",gap:12},children:[e(s,{label:"First name",htmlFor:"form-first-name",required:!0,variant:"outline",children:e(p,{id:"form-first-name",name:"firstName",placeholder:"Jane",required:!0})}),e(s,{label:"Email",htmlFor:"form-email",required:!0,variant:"outline",children:e(p,{id:"form-email",name:"email",type:"email",placeholder:"you@company.com",required:!0})}),e(s,{label:"Notes",htmlFor:"form-notes",description:"Optional context for reviewers.",variant:"soft",children:e(k,{id:"form-notes",name:"notes",rows:4,placeholder:"Add additional details..."})})]}),a(l,{style:{marginTop:12},children:[e(c,{onClick:()=>i(),children:"Submit"}),e(c,{style:{marginLeft:8},variant:"secondary",onClick:async()=>m(JSON.stringify(await f())),children:"Validate"}),e(c,{style:{marginLeft:8},variant:"ghost",onClick:()=>m(JSON.stringify(u())),children:"Get values"})]}),e(l,{slot:"status",style:{fontSize:"var(--ui-font-size-sm, 12px)"},children:h})]})})};x.args={heading:"Provider Profile",description:"Collect and validate core details before provisioning.",state:"default",stateText:"",loadingText:"Saving profile...",variant:"surface",tone:"default",density:"default",shape:"default",elevation:"default",gap:"12px",novalidate:!1};const S=()=>{const{ref:t,submit:d}=b(),[i,u]=o.useState("idle"),[f,h]=o.useState("default");return e(l,{style:{maxWidth:560},children:a(g,{ref:t,heading:"Project Access Policy",description:"Validation should prevent misconfigured policy codes.",variant:"outline",tone:"warning",state:f,stateText:i==="idle"?"":`Validation state: ${i}`,onSubmit:()=>{u("submitted"),h("success")},onInvalid:()=>{u("invalid"),h("error")},children:[e(s,{label:"Project code",htmlFor:"form-code",required:!0,children:e(p,{id:"form-code",name:"code",pattern:"[A-Z]{3}-[0-9]{3}",required:!0,placeholder:"ABC-123"})}),a(l,{style:{marginTop:12},children:[e(c,{onClick:()=>d(),children:"Run validation"}),a(l,{style:{marginTop:8,fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:["State: ",i]})]})]})})},F=()=>{const{ref:t,submit:d}=b();return e(l,{style:{maxWidth:620,background:"color-mix(in srgb, var(--ui-color-text, #0f172a) 94%, transparent)",padding:"var(--ui-space-md, 12px)",borderRadius:"calc(var(--ui-radius, 12px) + 2px)"},children:a(g,{ref:t,heading:"Dark Surface Audit Form",description:"High-contrast form with consistent typography and spacing.",variant:"contrast",shape:"soft",elevation:"high",onSubmit:()=>{},children:[e(s,{label:"Workspace",htmlFor:"form-workspace",variant:"contrast",children:e(p,{id:"form-workspace",name:"workspace",value:"Editora"})}),e(s,{label:"Release notes",htmlFor:"form-release",variant:"contrast",description:"Visible in changelog panel.",children:e(k,{id:"form-release",name:"release",rows:3,value:"Sprint 3: hardening complete."})}),e(l,{style:{marginTop:12},children:e(c,{onClick:()=>d(),children:"Save"})})]})})},w=()=>{const{ref:t,submit:d}=b();return a(C,{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(280px, 1fr))",gap:14},children:[a(g,{ref:t,variant:"minimal",tone:"brand",onSubmit:()=>{},children:[e("span",{slot:"title",children:"Minimal form"}),e(s,{label:"Minimal form",htmlFor:"form-minimal",children:e(p,{id:"form-minimal",name:"minimal",placeholder:"Flat mode for dense pages"})}),e(c,{onClick:()=>d(),children:"Submit"})]}),a(g,{variant:"elevated",tone:"success",shape:"soft",elevation:"high",heading:"Elevated approval form",onSubmit:()=>{},children:[e(s,{label:"Elevated form",htmlFor:"form-elevated",variant:"elevated",children:e(p,{id:"form-elevated",name:"elevated",placeholder:"Depth-rich mode"})}),e(c,{children:"Save"})]})]})},B=()=>{const{ref:t,submit:d}=b(),[i,u]=o.useState(1),[f,h]=o.useState(!1),[m,n]=o.useState("never"),[r,v]=o.useState("idle");return a(l,{style:{maxWidth:760,display:"grid",gap:12},children:[e(L,{value:i===1?34:i===2?68:100,max:100,shape:"round"}),a(z,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"},children:[a(l,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-muted, #64748b)"},children:["Step ",i," of 3 • Dirty: ",e("strong",{children:String(f)})," • Autosave: ",e("strong",{children:m})]}),e(l,{style:{fontSize:"var(--ui-font-size-sm, 12px)",color:"var(--ui-color-muted, #64748b)"},children:"Unsaved-change guard is enabled on this story."})]}),a(g,{ref:t,heading:"Tenant Provisioning Wizard",description:"Autosave and unsaved-change guard are active for this flow.",variant:"elevated",tone:"brand",autosave:!0,autosaveDelay:700,guardUnsaved:!0,onAutosave:()=>n(new Date().toLocaleTimeString()),onDirtyChange:y=>h(y),onSubmit:()=>v("submitted"),onInvalid:()=>v("invalid"),children:[a(C,{style:{display:"grid",gap:12},children:[i===1&&a(T,{children:[e(s,{label:"Organization name",htmlFor:"wizard-org",required:!0,variant:"outline",children:e(p,{id:"wizard-org",name:"organization",required:!0,placeholder:"Northstar Health"})}),e(s,{label:"Primary admin email",htmlFor:"wizard-email",required:!0,variant:"outline",children:e(p,{id:"wizard-email",name:"adminEmail",type:"email",required:!0,placeholder:"admin@northstar.health"})})]}),i===2&&a(T,{children:[e(s,{label:"Module type",htmlFor:"wizard-module",required:!0,variant:"soft",children:a($,{id:"wizard-module",name:"moduleType",required:!0,children:[e("option",{value:"",children:"Choose module"}),e("option",{value:"hospital",children:"Hospital"}),e("option",{value:"school",children:"School"}),e("option",{value:"enterprise",children:"Enterprise shared"})]})}),e(s,{label:"Record retention policy",htmlFor:"wizard-policy",required:!0,description:"Use uppercase code format.",variant:"soft",children:e(p,{id:"wizard-policy",name:"policyCode",required:!0,pattern:"[A-Z]{3}-[0-9]{2}",placeholder:"MED-07"})})]}),i===3&&e(s,{label:"Launch notes",htmlFor:"wizard-notes",description:"Inline validation remains consistent across steps.",variant:"elevated",children:e(k,{id:"wizard-notes",name:"notes",rows:4,placeholder:"Team onboarding checklist and runbook notes..."})})]}),a(z,{style:{display:"flex",justifyContent:"space-between",marginTop:12,gap:8},children:[e(c,{variant:"ghost",onClick:()=>u(y=>Math.max(1,y-1)),disabled:i===1,children:"Previous"}),e(z,{style:{display:"flex",gap:8},children:i<3?e(c,{variant:"secondary",onClick:()=>u(y=>Math.min(3,y+1)),children:"Next"}):e(c,{onClick:()=>d(),children:"Submit setup"})})]})]}),a(l,{style:{fontSize:"var(--ui-font-size-md, 14px)",color:"var(--ui-color-text, #0f172a)"},children:["Validation state: ",e("strong",{children:r})]})]})};var A,q,P;x.parameters={...x.parameters,docs:{...(A=x.parameters)==null?void 0:A.docs,source:{originalSource:`(args: any) => {
  const {
    ref,
    submit,
    getValues,
    validate
  } = useForm();
  const [message, setMessage] = useState('No action yet');
  return <Box style={{
    maxWidth: 620
  }}>
      <Form ref={ref} heading={args.heading} description={args.description} state={args.state} stateText={args.stateText} loadingText={args.loadingText} variant={args.variant} tone={args.tone} density={args.density} shape={args.shape} elevation={args.elevation} gap={args.gap} novalidate={args.novalidate} onSubmit={values => setMessage(\`Submitted: \${JSON.stringify(values)}\`)} onInvalid={errors => setMessage(\`Invalid: \${JSON.stringify(errors)}\`)}>
        <Button slot="actions" size="sm" variant="secondary" onClick={() => setMessage(\`Preview values: \${JSON.stringify(getValues())}\`)}>
          Preview
        </Button>
        <Grid style={{
        display: 'grid',
        gap: 12
      }}>
          <Field label="First name" htmlFor="form-first-name" required variant="outline">
            <Input id="form-first-name" name="firstName" placeholder="Jane" required />
          </Field>

          <Field label="Email" htmlFor="form-email" required variant="outline">
            <Input id="form-email" name="email" type="email" placeholder="you@company.com" required />
          </Field>

          <Field label="Notes" htmlFor="form-notes" description="Optional context for reviewers." variant="soft">
            <Textarea id="form-notes" name="notes" rows={4} placeholder="Add additional details..." />
          </Field>
        </Grid>

        <Box style={{
        marginTop: 12
      }}>
          <Button onClick={() => submit()}>Submit</Button>
          <Button style={{
          marginLeft: 8
        }} variant="secondary" onClick={async () => setMessage(JSON.stringify(await validate()))}>
            Validate
          </Button>
          <Button style={{
          marginLeft: 8
        }} variant="ghost" onClick={() => setMessage(JSON.stringify(getValues()))}>
            Get values
          </Button>
        </Box>
        <Box slot="status" style={{
        fontSize: 'var(--ui-font-size-sm, 12px)'
      }}>
          {message}
        </Box>
      </Form>
    </Box>;
}`,...(P=(q=x.parameters)==null?void 0:q.docs)==null?void 0:P.source}}};var I,M,D;S.parameters={...S.parameters,docs:{...(I=S.parameters)==null?void 0:I.docs,source:{originalSource:`() => {
  const {
    ref,
    submit
  } = useForm();
  const [state, setState] = useState('idle');
  const [formState, setFormState] = useState<'default' | 'success' | 'warning' | 'error'>('default');
  return <Box style={{
    maxWidth: 560
  }}>
      <Form ref={ref} heading="Project Access Policy" description="Validation should prevent misconfigured policy codes." variant="outline" tone="warning" state={formState} stateText={state === 'idle' ? '' : \`Validation state: \${state}\`} onSubmit={() => {
      setState('submitted');
      setFormState('success');
    }} onInvalid={() => {
      setState('invalid');
      setFormState('error');
    }}>
        <Field label="Project code" htmlFor="form-code" required>
          <Input id="form-code" name="code" pattern="[A-Z]{3}-[0-9]{3}" required placeholder="ABC-123" />
        </Field>

        <Box style={{
        marginTop: 12
      }}>
          <Button onClick={() => submit()}>Run validation</Button>
          <Box style={{
          marginTop: 8,
          fontSize: 'var(--ui-font-size-md, 14px)',
          color: 'var(--ui-color-muted, #64748b)'
        }}>State: {state}</Box>
        </Box>
      </Form>
    </Box>;
}`,...(D=(M=S.parameters)==null?void 0:M.docs)==null?void 0:D.source}}};var N,V,E;F.parameters={...F.parameters,docs:{...(N=F.parameters)==null?void 0:N.docs,source:{originalSource:`() => {
  const {
    ref,
    submit
  } = useForm();
  return <Box style={{
    maxWidth: 620,
    background: 'color-mix(in srgb, var(--ui-color-text, #0f172a) 94%, transparent)',
    padding: 'var(--ui-space-md, 12px)',
    borderRadius: 'calc(var(--ui-radius, 12px) + 2px)'
  }}>
      <Form ref={ref} heading="Dark Surface Audit Form" description="High-contrast form with consistent typography and spacing." variant="contrast" shape="soft" elevation="high" onSubmit={() => {}}>
        <Field label="Workspace" htmlFor="form-workspace" variant="contrast">
          <Input id="form-workspace" name="workspace" value="Editora" />
        </Field>

        <Field label="Release notes" htmlFor="form-release" variant="contrast" description="Visible in changelog panel.">
          <Textarea id="form-release" name="release" rows={3} value="Sprint 3: hardening complete." />
        </Field>

        <Box style={{
        marginTop: 12
      }}>
          <Button onClick={() => submit()}>Save</Button>
        </Box>
      </Form>
    </Box>;
}`,...(E=(V=F.parameters)==null?void 0:V.docs)==null?void 0:E.source}}};var O,W,J;w.parameters={...w.parameters,docs:{...(O=w.parameters)==null?void 0:O.docs,source:{originalSource:`() => {
  const {
    ref,
    submit
  } = useForm();
  return <Grid style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))',
    gap: 14
  }}>
      <Form ref={ref} variant="minimal" tone="brand" onSubmit={() => {}}>
        <span slot="title">Minimal form</span>
        <Field label="Minimal form" htmlFor="form-minimal">
          <Input id="form-minimal" name="minimal" placeholder="Flat mode for dense pages" />
        </Field>
        <Button onClick={() => submit()}>Submit</Button>
      </Form>

      <Form variant="elevated" tone="success" shape="soft" elevation="high" heading="Elevated approval form" onSubmit={() => {}}>
        <Field label="Elevated form" htmlFor="form-elevated" variant="elevated">
          <Input id="form-elevated" name="elevated" placeholder="Depth-rich mode" />
        </Field>
        <Button>Save</Button>
      </Form>
    </Grid>;
}`,...(J=(W=w.parameters)==null?void 0:W.docs)==null?void 0:J.source}}};var j,G,R;B.parameters={...B.parameters,docs:{...(j=B.parameters)==null?void 0:j.docs,source:{originalSource:`() => {
  const {
    ref,
    submit
  } = useForm();
  const [step, setStep] = useState(1);
  const [dirty, setDirty] = useState(false);
  const [autosaveAt, setAutosaveAt] = useState('never');
  const [status, setStatus] = useState('idle');
  const progress = step === 1 ? 34 : step === 2 ? 68 : 100;
  return <Box style={{
    maxWidth: 760,
    display: 'grid',
    gap: 12
  }}>
      <Progress value={progress} max={100} shape="round" />
      <Flex style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Box style={{
        fontSize: 'var(--ui-font-size-md, 14px)',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Step {step} of 3 • Dirty: <strong>{String(dirty)}</strong> • Autosave: <strong>{autosaveAt}</strong>
        </Box>
        <Box style={{
        fontSize: 'var(--ui-font-size-sm, 12px)',
        color: 'var(--ui-color-muted, #64748b)'
      }}>Unsaved-change guard is enabled on this story.</Box>
      </Flex>

      <Form ref={ref} heading="Tenant Provisioning Wizard" description="Autosave and unsaved-change guard are active for this flow." variant="elevated" tone="brand" autosave autosaveDelay={700} guardUnsaved onAutosave={() => setAutosaveAt(new Date().toLocaleTimeString())} onDirtyChange={nextDirty => setDirty(nextDirty)} onSubmit={() => setStatus('submitted')} onInvalid={() => setStatus('invalid')}>
        <Grid style={{
        display: 'grid',
        gap: 12
      }}>
          {step === 1 && <>
              <Field label="Organization name" htmlFor="wizard-org" required variant="outline">
                <Input id="wizard-org" name="organization" required placeholder="Northstar Health" />
              </Field>
              <Field label="Primary admin email" htmlFor="wizard-email" required variant="outline">
                <Input id="wizard-email" name="adminEmail" type="email" required placeholder="admin@northstar.health" />
              </Field>
            </>}

          {step === 2 && <>
              <Field label="Module type" htmlFor="wizard-module" required variant="soft">
                <Select id="wizard-module" name="moduleType" required>
                  <option value="">Choose module</option>
                  <option value="hospital">Hospital</option>
                  <option value="school">School</option>
                  <option value="enterprise">Enterprise shared</option>
                </Select>
              </Field>
              <Field label="Record retention policy" htmlFor="wizard-policy" required description="Use uppercase code format." variant="soft">
                <Input id="wizard-policy" name="policyCode" required pattern="[A-Z]{3}-[0-9]{2}" placeholder="MED-07" />
              </Field>
            </>}

          {step === 3 && <Field label="Launch notes" htmlFor="wizard-notes" description="Inline validation remains consistent across steps." variant="elevated">
              <Textarea id="wizard-notes" name="notes" rows={4} placeholder="Team onboarding checklist and runbook notes..." />
            </Field>}
        </Grid>

        <Flex style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 12,
        gap: 8
      }}>
          <Button variant="ghost" onClick={() => setStep(current => Math.max(1, current - 1))} disabled={step === 1}>
            Previous
          </Button>
          <Flex style={{
          display: 'flex',
          gap: 8
        }}>
            {step < 3 ? <Button variant="secondary" onClick={() => setStep(current => Math.min(3, current + 1))}>
                Next
              </Button> : <Button onClick={() => submit()}>Submit setup</Button>}
          </Flex>
        </Flex>
      </Form>

      <Box style={{
      fontSize: 'var(--ui-font-size-md, 14px)',
      color: 'var(--ui-color-text, #0f172a)'
    }}>Validation state: <strong>{status}</strong></Box>
    </Box>;
}`,...(R=(G=B.parameters)==null?void 0:G.docs)==null?void 0:R.source}}};const K=["Playground","ValidationFlow","ContrastMode","ProVisualModes","AdvancedAdminFlow"];export{B as AdvancedAdminFlow,F as ContrastMode,x as Playground,w as ProVisualModes,S as ValidationFlow,K as __namedExportsOrder,_ as default};
