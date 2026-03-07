import{J as i,a as e,B as n,j as a,F as c,l as d,t,G as r,b as g}from"./index-c1b18327.js";import{R as y}from"./index-93f6b7ae.js";import{S as A,U as T,A as I,c as O,R as E,a as F,m as P}from"./icons-f697cb21.js";/* empty css              *//* empty css                */const q={title:"UI/Collapsible",component:i,argTypes:{open:{control:"boolean"},headless:{control:"boolean"},disabled:{control:"boolean"},readOnly:{control:"boolean"},state:{control:{type:"radio",options:["idle","loading","error","success"]}},size:{control:{type:"radio",options:["sm","md","lg"]}},variant:{control:{type:"radio",options:["default","subtle","outline","ghost"]}},tone:{control:{type:"radio",options:["neutral","info","success","warning","danger"]}},iconPosition:{control:{type:"radio",options:["left","right"]}},closeOnEscape:{control:"boolean"}}},k={border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)",borderRadius:16,padding:14,background:"linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)",boxShadow:"0 10px 24px rgba(15, 23, 42, 0.08)"},D=a(r,{style:{display:"grid",gap:8},children:[e(n,{children:"1. Require reviewer approval for enterprise policy changes."}),e(n,{children:"2. Enforce audit trail retention for 365 days."}),e(n,{children:"3. Limit export scope for restricted patient records."})]}),l=o=>e(n,{style:{...k,maxInlineSize:920},children:e(i,{...o,header:a(c,{align:"center",style:{gap:8},children:[e(A,{size:15}),"Compliance Configuration"]}),caption:"Security, auditing, and release governance",meta:e(d,{tone:"brand",children:"Enterprise"}),onToggleDetail:s=>{t.info(`Panel ${s.open?"expanded":"collapsed"} (${s.source})`,{duration:900,theme:"light"})},children:D})});l.args={open:!1,headless:!1,disabled:!1,readOnly:!1,state:"idle",size:"md",variant:"default",tone:"info",iconPosition:"right",closeOnEscape:!0};const h=()=>a(r,{style:{display:"grid",gap:12,maxInlineSize:980},children:[e(i,{open:!0,variant:"subtle",tone:"info",header:a(c,{align:"center",style:{gap:8},children:[e(T,{size:15}),"Access Control Matrix"]}),caption:"Role-based access for admins, reviewers, and operators",meta:e(d,{tone:"brand",children:"12 rules"}),onToggleDetail:o=>{t.info(`Access Control ${o.open?"opened":"closed"}`,{duration:900,theme:"light"})},children:a(r,{style:{display:"grid",gap:8},children:[e(n,{children:"Admins: full scope + emergency override."}),e(n,{children:"Reviewers: read + approval actions only."}),e(n,{children:"Operators: execution scope within assigned departments."})]})}),e(i,{tone:"warning",variant:"outline",header:a(c,{align:"center",style:{gap:8},children:[e(I,{size:15}),"Exception Handling Rules"]}),caption:"Fallback strategy for degraded integrations",meta:e(d,{tone:"warning",children:"Pending"}),onToggleDetail:o=>{o.open&&t.warning("Review exception thresholds before deployment",{duration:1200,theme:"light"})},children:a(r,{style:{display:"grid",gap:8},children:[e(n,{children:"Temporary fail-open max window: 10 minutes."}),e(n,{children:"Escalate to on-call after 2 consecutive sync failures."}),e(n,{children:"Disable external writes when data confidence falls below 85%."})]})}),e(i,{tone:"success",state:"success",header:a(c,{align:"center",style:{gap:8},children:[e(O,{size:15}),"Release Checklist"]}),caption:"Validated for rollout",meta:e(d,{tone:"success",children:"Ready"}),onToggleDetail:o=>{o.open&&t.success("Checklist validated. Ready for release.",{duration:1100,theme:"light"})},children:a(r,{style:{display:"grid",gap:8},children:[e(n,{children:"Schema validation: passed."}),e(n,{children:"QA sign-off: complete."}),e(n,{children:"Observability dashboard alerts: green."})]})})]}),u=()=>{const[o,s]=y.useState(!1),[m,p]=y.useState("idle");return a(n,{style:{...k,maxInlineSize:920},children:[a(c,{align:"center",style:{gap:8,flexWrap:"wrap",marginBottom:10},children:[e(g,{size:"sm",variant:"secondary",startIcon:e(E,{size:14}),onClick:()=>{p("loading"),t.loading("Syncing section…",{duration:900,theme:"light"}),window.setTimeout(()=>p("idle"),900)},children:"Sync"}),e(g,{size:"sm",variant:"secondary",startIcon:e(I,{size:14}),onClick:()=>{p("error"),t.error("Sync failed: retry required",{duration:1200,theme:"light"})},children:"Error"}),e(g,{size:"sm",variant:"secondary",startIcon:e(F,{size:14}),onClick:()=>{p("success"),t.success("Sync complete",{duration:1e3,theme:"light"})},children:"Success"}),e(g,{size:"sm",startIcon:e(P,{size:14}),onClick:()=>s(R=>!R),children:o?"Collapse":"Expand"})]}),e(i,{open:o,onChangeOpen:s,state:m,tone:m==="error"?"danger":m==="success"?"success":"info",header:"Production Deployment Controls",caption:"Coordinated release controls across teams",meta:e(d,{tone:"brand",children:"Controlled"}),children:a(r,{style:{display:"grid",gap:8},children:[e(n,{children:"Batch window: 22:00 to 02:00 UTC."}),a(n,{children:["Rollback threshold: ",">","2.5% elevated error ratio for 5 minutes."]}),e(n,{children:"Notification channels: Ops, Clinical leads, Security audit stream."})]})}),a(n,{style:{marginTop:10,fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:["Open: ",String(o)]})]})};var f,x,b;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`(args: any) => <Box style={{
  ...shellStyle,
  maxInlineSize: 920
}}>
    <Collapsible {...args} header={<Flex align="center" style={{
    gap: 8
  }}>
          <ShieldIcon size={15} />
          Compliance Configuration
        </Flex>} caption="Security, auditing, and release governance" meta={<Badge tone="brand">Enterprise</Badge>} onToggleDetail={detail => {
    toastAdvanced.info(\`Panel \${detail.open ? 'expanded' : 'collapsed'} (\${detail.source})\`, {
      duration: 900,
      theme: 'light'
    });
  }}>
      {baseContent}
    </Collapsible>
  </Box>`,...(b=(x=l.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var C,B,v;h.parameters={...h.parameters,docs:{...(C=h.parameters)==null?void 0:C.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 12,
  maxInlineSize: 980
}}>
    <Collapsible open variant="subtle" tone="info" header={<Flex align="center" style={{
    gap: 8
  }}>
          <UsersIcon size={15} />
          Access Control Matrix
        </Flex>} caption="Role-based access for admins, reviewers, and operators" meta={<Badge tone="brand">12 rules</Badge>} onToggleDetail={detail => {
    toastAdvanced.info(\`Access Control \${detail.open ? 'opened' : 'closed'}\`, {
      duration: 900,
      theme: 'light'
    });
  }}>
      <Grid style={{
      display: 'grid',
      gap: 8
    }}>
        <Box>Admins: full scope + emergency override.</Box>
        <Box>Reviewers: read + approval actions only.</Box>
        <Box>Operators: execution scope within assigned departments.</Box>
      </Grid>
    </Collapsible>

    <Collapsible tone="warning" variant="outline" header={<Flex align="center" style={{
    gap: 8
  }}>
          <AlertTriangleIcon size={15} />
          Exception Handling Rules
        </Flex>} caption="Fallback strategy for degraded integrations" meta={<Badge tone="warning">Pending</Badge>} onToggleDetail={detail => {
    if (detail.open) toastAdvanced.warning('Review exception thresholds before deployment', {
      duration: 1200,
      theme: 'light'
    });
  }}>
      <Grid style={{
      display: 'grid',
      gap: 8
    }}>
        <Box>Temporary fail-open max window: 10 minutes.</Box>
        <Box>Escalate to on-call after 2 consecutive sync failures.</Box>
        <Box>Disable external writes when data confidence falls below 85%.</Box>
      </Grid>
    </Collapsible>

    <Collapsible tone="success" state="success" header={<Flex align="center" style={{
    gap: 8
  }}>
          <ClipboardCheckIcon size={15} />
          Release Checklist
        </Flex>} caption="Validated for rollout" meta={<Badge tone="success">Ready</Badge>} onToggleDetail={detail => {
    if (detail.open) toastAdvanced.success('Checklist validated. Ready for release.', {
      duration: 1100,
      theme: 'light'
    });
  }}>
      <Grid style={{
      display: 'grid',
      gap: 8
    }}>
        <Box>Schema validation: passed.</Box>
        <Box>QA sign-off: complete.</Box>
        <Box>Observability dashboard alerts: green.</Box>
      </Grid>
    </Collapsible>
  </Grid>`,...(v=(B=h.parameters)==null?void 0:B.docs)==null?void 0:v.source}}};var S,w,z;u.parameters={...u.parameters,docs:{...(S=u.parameters)==null?void 0:S.docs,source:{originalSource:`() => {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  return <Box style={{
    ...shellStyle,
    maxInlineSize: 920
  }}>
      <Flex align="center" style={{
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 10
    }}>
        <Button size="sm" variant="secondary" startIcon={<RefreshCwIcon size={14} />} onClick={() => {
        setState('loading');
        toastAdvanced.loading('Syncing section…', {
          duration: 900,
          theme: 'light'
        });
        window.setTimeout(() => setState('idle'), 900);
      }}>
          Sync
        </Button>
        <Button size="sm" variant="secondary" startIcon={<AlertTriangleIcon size={14} />} onClick={() => {
        setState('error');
        toastAdvanced.error('Sync failed: retry required', {
          duration: 1200,
          theme: 'light'
        });
      }}>
          Error
        </Button>
        <Button size="sm" variant="secondary" startIcon={<CheckCircleIcon size={14} />} onClick={() => {
        setState('success');
        toastAdvanced.success('Sync complete', {
          duration: 1000,
          theme: 'light'
        });
      }}>
          Success
        </Button>
        <Button size="sm" startIcon={<SparklesIcon size={14} />} onClick={() => setOpen(value => !value)}>
          {open ? 'Collapse' : 'Expand'}
        </Button>
      </Flex>

      <Collapsible open={open} onChangeOpen={setOpen} state={state} tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'} header="Production Deployment Controls" caption="Coordinated release controls across teams" meta={<Badge tone="brand">Controlled</Badge>}>
        <Grid style={{
        display: 'grid',
        gap: 8
      }}>
          <Box>Batch window: 22:00 to 02:00 UTC.</Box>
          <Box>Rollback threshold: {'>'}2.5% elevated error ratio for 5 minutes.</Box>
          <Box>Notification channels: Ops, Clinical leads, Security audit stream.</Box>
        </Grid>
      </Collapsible>

      <Box style={{
      marginTop: 10,
      fontSize: 12,
      color: 'var(--ui-color-muted, #64748b)'
    }}>Open: {String(open)}</Box>
    </Box>;
}`,...(z=(w=u.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};const H=["Playground","EnterprisePolicyPanels","ControlledWorkflow"];export{u as ControlledWorkflow,h as EnterprisePolicyPanels,l as Playground,H as __namedExportsOrder,q as default};
