import{p as t,a as e,B as h,ac as n,j as i,G as f,q as G,F as O,a4 as R,g as _,b as m}from"./index-ce0e40fa.js";import{r as D}from"./index-93f6b7ae.js";import"./index-c197feae.js";const N={title:"UI/Field",component:t,argTypes:{label:{control:"text"},description:{control:"text"},error:{control:"text"},required:{control:"boolean"},invalid:{control:"boolean"},orientation:{control:{type:"radio",options:["vertical","horizontal"]}},variant:{control:"select",options:["default","surface","outline","soft","contrast","minimal","elevated"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["default","square","soft"]},shell:{control:"select",options:["none","outline","filled","soft","line"]}}},r=l=>e(h,{style:{maxWidth:560},children:e(t,{label:l.label,description:l.description,error:l.error,required:l.required,invalid:l.invalid,orientation:l.orientation,variant:l.variant,tone:l.tone,density:l.density,shape:l.shape,shell:l.shell,htmlFor:"field-name",children:e(n,{id:"field-name",placeholder:"Jane Doe"})})});r.args={label:"Full name",description:"Used across workspace profile and audit views.",error:"",required:!0,invalid:!1,orientation:"vertical",variant:"surface",tone:"default",density:"default",shape:"default",shell:"none"};const o=()=>i(f,{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(260px, 1fr))",gap:14},children:[e(t,{label:"Surface",description:"Balanced default for admin forms.",variant:"surface",shell:"outline",htmlFor:"field-surface",children:e(n,{id:"field-surface",placeholder:"Surface variant"})}),e(t,{label:"Outline / Brand",description:"Crisp borders with accent tone.",variant:"outline",tone:"brand",shell:"line",htmlFor:"field-outline",children:e(n,{id:"field-outline",placeholder:"Outline variant"})}),e(t,{label:"Soft / Success",description:"Low-noise positive data entry state.",variant:"soft",tone:"success",shell:"soft",htmlFor:"field-soft",children:e(n,{id:"field-soft",placeholder:"Soft variant"})}),e(t,{label:"Minimal",description:"Flat grouped style for dense admin layouts.",variant:"minimal",tone:"brand",htmlFor:"field-minimal",children:e(n,{id:"field-minimal",placeholder:"Minimal variant"})}),e(h,{style:{background:"var(--ui-color-text, #0f172a)",borderRadius:16,padding:10},children:e(t,{label:"Contrast",description:"Dark mode parity.",variant:"contrast",shell:"outline",htmlFor:"field-contrast",children:e(n,{id:"field-contrast",placeholder:"Contrast variant"})})}),e(t,{label:"Elevated",description:"Premium surface with stronger depth.",variant:"elevated",shell:"filled",htmlFor:"field-elevated",children:e(n,{id:"field-elevated",placeholder:"Elevated variant"})})]}),d=()=>{const[l,a]=D.useState(!1);return i(f,{style:{display:"grid",gap:14,maxWidth:620},children:[i(t,{required:!0,invalid:!0,error:"Please provide implementation notes.",htmlFor:"field-notes",variant:"soft",tone:"warning",shell:"soft",children:[e("span",{slot:"label",children:"Implementation Notes"}),e("span",{slot:"actions",style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:"Markdown supported"}),e("span",{slot:"description",children:"Document migration and rollout details for the team."}),e(G,{id:"field-notes",rows:5,placeholder:"Describe migration strategy..."})]}),e(t,{label:"Confirmation",description:"Required before submitting.",variant:"outline",shell:"line",htmlFor:"field-confirm",children:i(O,{style:{display:"flex",alignItems:"center",gap:10},children:[e(R,{id:"field-confirm",checked:l,onClick:()=>a(u=>!u)}),e("span",{children:"I verified these details."})]})})]})},s=()=>e(h,{style:{maxWidth:820},children:e(t,{orientation:"horizontal",label:"API Key",description:"Used by backend integrations.",htmlFor:"field-key",labelWidth:"220px",variant:"surface",shell:"outline",children:e(n,{id:"field-key",value:"sk_live_****************",readOnly:!0})})}),c=()=>i(f,{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(280px, 1fr))",gap:16,maxWidth:720},children:[e(t,{label:"Flat field (default shell)",description:"No wrapper chrome around the control.",htmlFor:"field-flat",children:e(n,{id:"field-flat",placeholder:"No control-shell styling by default"})}),e(t,{label:"Opt-in control shell",description:"Consumers can enable shell with a single prop or CSS tokens.",shell:"outline",htmlFor:"field-shell",children:e(n,{id:"field-shell",placeholder:"Outline shell enabled"})})]}),p=()=>{const[l,a]=D.useState("light");return e(_,{tokens:l==="light"?{colors:{primary:"#2563eb",surface:"#ffffff",surfaceAlt:"#f8fafc",text:"#0f172a",muted:"#64748b",border:"rgba(15, 23, 42, 0.16)",focusRing:"#2563eb"}}:{colors:{primary:"#7dd3fc",surface:"#0f172a",surfaceAlt:"#111827",text:"#e2e8f0",muted:"#93a4bd",border:"#334155",focusRing:"#7dd3fc"}},children:i(f,{style:{display:"grid",gap:12,maxWidth:640,padding:8,background:"var(--ui-color-background, #ffffff)"},children:[i(O,{style:{display:"flex",gap:8},children:[e(m,{size:"sm",onClick:()=>a("light"),children:"Light Tokens"}),e(m,{size:"sm",variant:"secondary",onClick:()=>a("dark"),children:"Dark Tokens"})]}),e(t,{label:"Themed Field",description:"ThemeProvider tokens should update this instantly.",shell:"outline",variant:"surface",htmlFor:"field-themed",children:e(n,{id:"field-themed",placeholder:"Theme-aware input shell"})})]})})};var v,g,b;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`(args: any) => <Box style={{
  maxWidth: 560
}}>
    <Field label={args.label} description={args.description} error={args.error} required={args.required} invalid={args.invalid} orientation={args.orientation} variant={args.variant} tone={args.tone} density={args.density} shape={args.shape} shell={args.shell} htmlFor="field-name">
      <Input id="field-name" placeholder="Jane Doe" />
    </Field>
  </Box>`,...(b=(g=r.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var y,F,x;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))',
  gap: 14
}}>
    <Field label="Surface" description="Balanced default for admin forms." variant="surface" shell="outline" htmlFor="field-surface">
      <Input id="field-surface" placeholder="Surface variant" />
    </Field>

    <Field label="Outline / Brand" description="Crisp borders with accent tone." variant="outline" tone="brand" shell="line" htmlFor="field-outline">
      <Input id="field-outline" placeholder="Outline variant" />
    </Field>

    <Field label="Soft / Success" description="Low-noise positive data entry state." variant="soft" tone="success" shell="soft" htmlFor="field-soft">
      <Input id="field-soft" placeholder="Soft variant" />
    </Field>

    <Field label="Minimal" description="Flat grouped style for dense admin layouts." variant="minimal" tone="brand" htmlFor="field-minimal">
      <Input id="field-minimal" placeholder="Minimal variant" />
    </Field>

    <Box style={{
    background: 'var(--ui-color-text, #0f172a)',
    borderRadius: 16,
    padding: 10
  }}>
      <Field label="Contrast" description="Dark mode parity." variant="contrast" shell="outline" htmlFor="field-contrast">
        <Input id="field-contrast" placeholder="Contrast variant" />
      </Field>
    </Box>

    <Field label="Elevated" description="Premium surface with stronger depth." variant="elevated" shell="filled" htmlFor="field-elevated">
      <Input id="field-elevated" placeholder="Elevated variant" />
    </Field>
  </Grid>`,...(x=(F=o.parameters)==null?void 0:F.docs)==null?void 0:x.source}}};var k,S,C;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`() => {
  const [checked, setChecked] = useState(false);
  return <Grid style={{
    display: 'grid',
    gap: 14,
    maxWidth: 620
  }}>
      <Field required invalid error="Please provide implementation notes." htmlFor="field-notes" variant="soft" tone="warning" shell="soft">
        <span slot="label">Implementation Notes</span>
        <span slot="actions" style={{
        fontSize: 12,
        color: 'var(--ui-color-muted, #64748b)'
      }}>Markdown supported</span>
        <span slot="description">Document migration and rollout details for the team.</span>
        <Textarea id="field-notes" rows={5} placeholder="Describe migration strategy..." />
      </Field>

      <Field label="Confirmation" description="Required before submitting." variant="outline" shell="line" htmlFor="field-confirm">
        <Flex style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
          <Checkbox id="field-confirm" checked={checked} onClick={() => setChecked(v => !v)} />
          <span>I verified these details.</span>
        </Flex>
      </Field>
    </Grid>;
}`,...(C=(S=d.parameters)==null?void 0:S.docs)==null?void 0:C.source}}};var T,w,I;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`() => <Box style={{
  maxWidth: 820
}}>
    <Field orientation="horizontal" label="API Key" description="Used by backend integrations." htmlFor="field-key" labelWidth="220px" variant="surface" shell="outline">
      <Input id="field-key" value="sk_live_****************" readOnly />
    </Field>
  </Box>`,...(I=(w=s.parameters)==null?void 0:w.docs)==null?void 0:I.source}}};var B,P,W;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))',
  gap: 16,
  maxWidth: 720
}}>
    <Field label="Flat field (default shell)" description="No wrapper chrome around the control." htmlFor="field-flat">
      <Input id="field-flat" placeholder="No control-shell styling by default" />
    </Field>
    <Field label="Opt-in control shell" description="Consumers can enable shell with a single prop or CSS tokens." shell="outline" htmlFor="field-shell">
      <Input id="field-shell" placeholder="Outline shell enabled" />
    </Field>
  </Grid>`,...(W=(P=c.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var q,M,z;p.parameters={...p.parameters,docs:{...(q=p.parameters)==null?void 0:q.docs,source:{originalSource:`() => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const tokens = mode === 'light' ? {
    colors: {
      primary: '#2563eb',
      surface: '#ffffff',
      surfaceAlt: '#f8fafc',
      text: '#0f172a',
      muted: '#64748b',
      border: 'rgba(15, 23, 42, 0.16)',
      focusRing: '#2563eb'
    }
  } : {
    colors: {
      primary: '#7dd3fc',
      surface: '#0f172a',
      surfaceAlt: '#111827',
      text: '#e2e8f0',
      muted: '#93a4bd',
      border: '#334155',
      focusRing: '#7dd3fc'
    }
  };
  return <ThemeProvider tokens={tokens as any}>
      <Grid style={{
      display: 'grid',
      gap: 12,
      maxWidth: 640,
      padding: 8,
      background: 'var(--ui-color-background, #ffffff)'
    }}>
        <Flex style={{
        display: 'flex',
        gap: 8
      }}>
          <Button size="sm" onClick={() => setMode('light')}>Light Tokens</Button>
          <Button size="sm" variant="secondary" onClick={() => setMode('dark')}>Dark Tokens</Button>
        </Flex>
        <Field label="Themed Field" description="ThemeProvider tokens should update this instantly." shell="outline" variant="surface" htmlFor="field-themed">
          <Input id="field-themed" placeholder="Theme-aware input shell" />
        </Field>
      </Grid>
    </ThemeProvider>;
}`,...(z=(M=p.parameters)==null?void 0:M.docs)==null?void 0:z.source}}};const V=["Playground","VisualModes","WithCustomSlots","HorizontalLayout","FlatVsShell","ThemeProviderVerification"];export{c as FlatVsShell,s as HorizontalLayout,r as Playground,p as ThemeProviderVerification,o as VisualModes,d as WithCustomSlots,V as __namedExportsOrder,N as default};
