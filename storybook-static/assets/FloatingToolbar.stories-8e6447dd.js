import{_ as u,j as t,G as f,F as i,a as e,b as n,B as a,p as E,O as P,g as w}from"./index-c1b18327.js";import{R as r}from"./index-93f6b7ae.js";const M={title:"UI/FloatingToolbar",component:u,argTypes:{open:{control:"boolean"},anchorId:{control:"text"},placement:{control:"select",options:["auto","top","bottom"]},align:{control:"select",options:["center","start","end"]},offset:{control:{type:"number",min:0,max:40,step:1}},variant:{control:"select",options:["default","soft","flat","glass","contrast"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["default","square","soft"]},elevation:{control:"select",options:["default","none","low","high"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},closeOnOutside:{control:"boolean"},closeOnEscape:{control:"boolean"}}};function G(){return t(i,{slot:"toolbar",style:{display:"flex",gap:6},children:[e(n,{size:"sm",children:"Bold"}),e(n,{size:"sm",children:"Italic"}),e(n,{size:"sm",children:"Underline"}),e(n,{size:"sm",variant:"secondary",children:"Link"}),e(n,{size:"sm",variant:"secondary",children:"Comment"})]})}const d=o=>{const[s,l]=r.useState(!!o.open),[p,c]=r.useState(o.anchorId||"ft-story-anchor-main"),[O,R]=r.useState("none");return r.useEffect(()=>l(!!o.open),[o.open]),r.useEffect(()=>c(o.anchorId||"ft-story-anchor-main"),[o.anchorId]),t(f,{style:{display:"grid",gap:14},children:[t(i,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[e(n,{size:"sm",onClick:()=>l(!0),children:"Open"}),e(n,{size:"sm",variant:"secondary",onClick:()=>l(!1),children:"Close"}),e(n,{size:"sm",variant:"secondary",onClick:()=>c("ft-story-anchor-main"),children:"Main Anchor"}),e(n,{size:"sm",variant:"secondary",onClick:()=>c("ft-story-anchor-alt"),children:"Alt Anchor"})]}),t(f,{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(260px, 1fr))",gap:12},children:[e(a,{id:"ft-story-anchor-main",style:{border:"1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))",borderRadius:12,padding:18,background:"var(--ui-color-surface, #ffffff)",color:"var(--ui-color-text, #0f172a)"},children:"Main editable block"}),e(a,{id:"ft-story-anchor-alt",style:{border:"1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))",borderRadius:12,padding:18,background:"var(--ui-color-surface, #ffffff)",color:"var(--ui-color-text, #0f172a)"},children:"Secondary block"})]}),e(u,{anchorId:p,open:s,placement:o.placement,align:o.align,offset:o.offset,variant:o.variant,density:o.density,shape:o.shape,elevation:o.elevation,tone:o.tone,closeOnOutside:o.closeOnOutside,closeOnEscape:o.closeOnEscape,onClose:A=>R(A.reason||"unknown"),children:e(G,{})}),t(a,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:["Last close reason: ",O]})]})};d.args={open:!0,anchorId:"ft-story-anchor-main",placement:"auto",align:"center",offset:8,variant:"default",density:"default",shape:"default",elevation:"default",tone:"default",closeOnOutside:!0,closeOnEscape:!0};const h=()=>{const[o,s]=r.useState(!0),[l,p]=r.useState(!1);return t(f,{style:{display:"grid",gap:14,maxWidth:940},children:[t(i,{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[t(a,{children:[e("h3",{style:{margin:0,fontSize:24,lineHeight:1.2,color:"var(--ui-color-text, #0f172a)"},children:"Clinical Policy Editor"}),e("p",{style:{margin:"6px 0 0",fontSize:14,color:"var(--ui-color-muted, #64748b)"},children:"Inline authoring toolbar with anchored contextual controls."})]}),e(n,{size:"sm",variant:"secondary",onClick:()=>s(c=>!c),children:o?"Hide Toolbar":"Show Toolbar"})]}),t(a,{id:"ft-enterprise-anchor",style:{border:"1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))",borderRadius:14,padding:18,background:"var(--ui-color-surface, #ffffff)"},children:[e(E,{label:"Policy Section Title",htmlFor:"policy-title",shell:"outline",children:e(P,{id:"policy-title",value:"Medication Reconciliation Requirements"})}),e("p",{style:{margin:"14px 0 0",fontSize:14,lineHeight:1.55,color:"var(--ui-color-text, #0f172a)"},children:"Providers must verify medication history at admission, transition, and discharge. Exceptions require documented clinical justification."})]}),e(u,{anchorId:"ft-enterprise-anchor",open:o,variant:"soft",density:"comfortable",elevation:"high",tone:"brand",align:"start",offset:10,children:t(i,{slot:"toolbar",style:{display:"flex",gap:6},children:[e(n,{size:"sm",children:"H1"}),e(n,{size:"sm",children:"H2"}),e(n,{size:"sm",children:"B"}),e(n,{size:"sm",children:"I"}),e(n,{size:"sm",children:"List"}),e(n,{size:"sm",variant:"secondary",onClick:()=>{p(!0),setTimeout(()=>p(!1),1200)},children:l?"Saved":"Save"})]})})]})},m=()=>t(f,{style:{display:"grid",gap:12,maxWidth:760},children:[e(a,{id:"ft-flat-anchor",style:{border:"1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))",borderRadius:8,padding:18,background:"var(--ui-color-surface, #ffffff)",color:"var(--ui-color-text, #0f172a)"},children:"Flat UI anchor surface"}),e(u,{anchorId:"ft-flat-anchor",open:!0,placement:"bottom",align:"end",variant:"flat",shape:"square",elevation:"none",density:"compact",style:{"--ui-floating-toolbar-border":"1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))","--ui-floating-toolbar-bg":"var(--ui-color-surface, #ffffff)"},children:t(i,{slot:"toolbar",style:{display:"flex",gap:4},children:[e(n,{size:"sm",variant:"secondary",children:"Cut"}),e(n,{size:"sm",variant:"secondary",children:"Copy"}),e(n,{size:"sm",variant:"secondary",children:"Paste"})]})})]}),g=()=>{const[o,s]=r.useState("light");return e(w,{tokens:o==="light"?{colors:{primary:"#0f766e",surface:"#ffffff",surfaceAlt:"#f8fafc",text:"#0f172a",muted:"#64748b",border:"rgba(15, 23, 42, 0.16)",focusRing:"#0f766e"}}:{colors:{primary:"#38bdf8",surface:"#0f172a",surfaceAlt:"#111c33",text:"#e2e8f0",muted:"#94a3b8",border:"#334155",focusRing:"#7dd3fc"}},children:t(f,{style:{display:"grid",gap:12,maxWidth:720,background:"var(--ui-color-background, #ffffff)",padding:8},children:[t(i,{style:{display:"flex",gap:8},children:[e(n,{size:"sm",onClick:()=>s("light"),children:"Light Tokens"}),e(n,{size:"sm",variant:"secondary",onClick:()=>s("dark"),children:"Dark Tokens"})]}),e(a,{id:"ft-theme-anchor",style:{border:"1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))",borderRadius:10,padding:16,background:"var(--ui-color-surface, #ffffff)",color:"var(--ui-color-text, #0f172a)"},children:"Theme-aware floating toolbar anchor"}),e(u,{anchorId:"ft-theme-anchor",open:!0,variant:"soft",tone:"brand",children:t(i,{slot:"toolbar",style:{display:"flex",gap:6},children:[e(n,{size:"sm",children:"A"}),e(n,{size:"sm",children:"B"}),e(n,{size:"sm",variant:"secondary",children:"C"})]})})]})})};var y,b,v;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`(args: any) => {
  const [open, setOpen] = React.useState(!!args.open);
  const [anchorId, setAnchorId] = React.useState(args.anchorId || 'ft-story-anchor-main');
  const [lastClose, setLastClose] = React.useState('none');
  React.useEffect(() => setOpen(!!args.open), [args.open]);
  React.useEffect(() => setAnchorId(args.anchorId || 'ft-story-anchor-main'), [args.anchorId]);
  return <Grid style={{
    display: 'grid',
    gap: 14
  }}>
      <Flex style={{
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Button size="sm" onClick={() => setOpen(true)}>Open</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
        <Button size="sm" variant="secondary" onClick={() => setAnchorId('ft-story-anchor-main')}>Main Anchor</Button>
        <Button size="sm" variant="secondary" onClick={() => setAnchorId('ft-story-anchor-alt')}>Alt Anchor</Button>
      </Flex>

      <Grid style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))',
      gap: 12
    }}>
        <Box id="ft-story-anchor-main" style={{
        border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
        borderRadius: 12,
        padding: 18,
        background: 'var(--ui-color-surface, #ffffff)',
        color: 'var(--ui-color-text, #0f172a)'
      }}>
          Main editable block
        </Box>

        <Box id="ft-story-anchor-alt" style={{
        border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
        borderRadius: 12,
        padding: 18,
        background: 'var(--ui-color-surface, #ffffff)',
        color: 'var(--ui-color-text, #0f172a)'
      }}>
          Secondary block
        </Box>
      </Grid>

      <FloatingToolbar anchorId={anchorId} open={open} placement={args.placement} align={args.align} offset={args.offset} variant={args.variant} density={args.density} shape={args.shape} elevation={args.elevation} tone={args.tone} closeOnOutside={args.closeOnOutside} closeOnEscape={args.closeOnEscape} onClose={detail => setLastClose(detail.reason || 'unknown')}>
        <ToolbarActions />
      </FloatingToolbar>

      <Box style={{
      fontSize: 12,
      color: 'var(--ui-color-muted, #64748b)'
    }}>Last close reason: {lastClose}</Box>
    </Grid>;
}`,...(v=(b=d.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var x,B,k;h.parameters={...h.parameters,docs:{...(x=h.parameters)==null?void 0:x.docs,source:{originalSource:`() => {
  const [open, setOpen] = React.useState(true);
  const [saved, setSaved] = React.useState(false);
  return <Grid style={{
    display: 'grid',
    gap: 14,
    maxWidth: 940
  }}>
      <Flex style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
        <Box>
          <h3 style={{
          margin: 0,
          fontSize: 24,
          lineHeight: 1.2,
          color: 'var(--ui-color-text, #0f172a)'
        }}>Clinical Policy Editor</h3>
          <p style={{
          margin: '6px 0 0',
          fontSize: 14,
          color: 'var(--ui-color-muted, #64748b)'
        }}>Inline authoring toolbar with anchored contextual controls.</p>
        </Box>
        <Button size="sm" variant="secondary" onClick={() => setOpen(v => !v)}>
          {open ? 'Hide Toolbar' : 'Show Toolbar'}
        </Button>
      </Flex>

      <Box id="ft-enterprise-anchor" style={{
      border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
      borderRadius: 14,
      padding: 18,
      background: 'var(--ui-color-surface, #ffffff)'
    }}>
        <Field label="Policy Section Title" htmlFor="policy-title" shell="outline">
          <Input id="policy-title" value="Medication Reconciliation Requirements" />
        </Field>
        <p style={{
        margin: '14px 0 0',
        fontSize: 14,
        lineHeight: 1.55,
        color: 'var(--ui-color-text, #0f172a)'
      }}>
          Providers must verify medication history at admission, transition, and discharge. Exceptions require documented clinical justification.
        </p>
      </Box>

      <FloatingToolbar anchorId="ft-enterprise-anchor" open={open} variant="soft" density="comfortable" elevation="high" tone="brand" align="start" offset={10}>
        <Flex slot="toolbar" style={{
        display: 'flex',
        gap: 6
      }}>
          <Button size="sm">H1</Button>
          <Button size="sm">H2</Button>
          <Button size="sm">B</Button>
          <Button size="sm">I</Button>
          <Button size="sm">List</Button>
          <Button size="sm" variant="secondary" onClick={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 1200);
        }}>
            {saved ? 'Saved' : 'Save'}
          </Button>
        </Flex>
      </FloatingToolbar>
    </Grid>;
}`,...(k=(B=h.parameters)==null?void 0:B.docs)==null?void 0:k.source}}};var z,C,S;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 12,
  maxWidth: 760
}}>
    <Box id="ft-flat-anchor" style={{
    border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
    borderRadius: 8,
    padding: 18,
    background: 'var(--ui-color-surface, #ffffff)',
    color: 'var(--ui-color-text, #0f172a)'
  }}>
      Flat UI anchor surface
    </Box>

    <FloatingToolbar anchorId="ft-flat-anchor" open placement="bottom" align="end" variant="flat" shape="square" elevation="none" density="compact" style={{
    ['--ui-floating-toolbar-border' as any]: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
    ['--ui-floating-toolbar-bg' as any]: 'var(--ui-color-surface, #ffffff)'
  }}>
      <Flex slot="toolbar" style={{
      display: 'flex',
      gap: 4
    }}>
        <Button size="sm" variant="secondary">Cut</Button>
        <Button size="sm" variant="secondary">Copy</Button>
        <Button size="sm" variant="secondary">Paste</Button>
      </Flex>
    </FloatingToolbar>
  </Grid>`,...(S=(C=m.parameters)==null?void 0:C.docs)==null?void 0:S.source}}};var T,I,F;g.parameters={...g.parameters,docs:{...(T=g.parameters)==null?void 0:T.docs,source:{originalSource:`() => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const tokens = mode === 'light' ? {
    colors: {
      primary: '#0f766e',
      surface: '#ffffff',
      surfaceAlt: '#f8fafc',
      text: '#0f172a',
      muted: '#64748b',
      border: 'rgba(15, 23, 42, 0.16)',
      focusRing: '#0f766e'
    }
  } : {
    colors: {
      primary: '#38bdf8',
      surface: '#0f172a',
      surfaceAlt: '#111c33',
      text: '#e2e8f0',
      muted: '#94a3b8',
      border: '#334155',
      focusRing: '#7dd3fc'
    }
  };
  return <ThemeProvider tokens={tokens as any}>
      <Grid style={{
      display: 'grid',
      gap: 12,
      maxWidth: 720,
      background: 'var(--ui-color-background, #ffffff)',
      padding: 8
    }}>
        <Flex style={{
        display: 'flex',
        gap: 8
      }}>
          <Button size="sm" onClick={() => setMode('light')}>Light Tokens</Button>
          <Button size="sm" variant="secondary" onClick={() => setMode('dark')}>Dark Tokens</Button>
        </Flex>

        <Box id="ft-theme-anchor" style={{
        border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
        borderRadius: 10,
        padding: 16,
        background: 'var(--ui-color-surface, #ffffff)',
        color: 'var(--ui-color-text, #0f172a)'
      }}>
          Theme-aware floating toolbar anchor
        </Box>

        <FloatingToolbar anchorId="ft-theme-anchor" open variant="soft" tone="brand">
          <Flex slot="toolbar" style={{
          display: 'flex',
          gap: 6
        }}>
            <Button size="sm">A</Button>
            <Button size="sm">B</Button>
            <Button size="sm" variant="secondary">C</Button>
          </Flex>
        </FloatingToolbar>
      </Grid>
    </ThemeProvider>;
}`,...(F=(I=g.parameters)==null?void 0:I.docs)==null?void 0:F.source}}};const W=["Playground","EnterpriseDocumentEditor","FlatToolbar","ThemeProviderVerification"];export{h as EnterpriseDocumentEditor,m as FlatToolbar,d as Playground,g as ThemeProviderVerification,W as __namedExportsOrder,M as default};
