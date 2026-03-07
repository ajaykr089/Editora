import{C as p,a as e,B as l,j as n,G as u,F as v,l as b,t as i,b as h}from"./index-c1b18327.js";import{R as c}from"./index-93f6b7ae.js";import{S as F,R as W,A as G,a as j,U as D}from"./icons-f697cb21.js";/* empty css              *//* empty css                */const V={title:"UI/Combobox",component:p,argTypes:{value:{control:"text"},open:{control:"boolean"},state:{control:{type:"radio",options:["idle","loading","error","success"]}},stateText:{control:"text"},placeholder:{control:"text"},disabled:{control:"boolean"},readOnly:{control:"boolean"},clearable:{control:"boolean"},debounce:{control:"number"},allowCustom:{control:"boolean"},noFilter:{control:"boolean"},validation:{control:{type:"radio",options:["none","error","success"]}},size:{control:{type:"radio",options:["sm","md","lg","1","2","3"]}},variant:{control:{type:"radio",options:["classic","surface","soft"]}},radius:{control:{type:"radio",options:["none","large","full"]}},label:{control:"text"},description:{control:"text"},emptyText:{control:"text"}}},f={border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)",borderRadius:16,padding:16,background:"linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)",boxShadow:"0 12px 28px rgba(15, 23, 42, 0.08)"},P=[{value:"dr-nadia-khan",label:"Dr. Nadia Khan",description:"ICU - Critical Care"},{value:"dr-oliver-johnson",label:"Dr. Oliver Johnson",description:"Cardiology"},{value:"nurse-amy-chen",label:"Nurse Amy Chen",description:"Emergency Triage"},{value:"nurse-sam-patel",label:"Nurse Sam Patel",description:"Ward Operations"},{value:"admin-rachel-park",label:"Rachel Park",description:"Admissions Manager"},{value:"qa-ravi-mehta",label:"Ravi Mehta",description:"Clinical QA Lead"}],C=()=>P.map(t=>e("option",{value:t.value,"data-description":t.description,children:t.label},t.value)),d=t=>e(l,{style:{...f,maxInlineSize:900},children:n(u,{style:{display:"grid",gap:12},children:[n(v,{align:"center",justify:"space-between",style:{gap:8,flexWrap:"wrap"},children:[n("div",{children:[e("div",{style:{fontWeight:700,fontSize:18},children:"Enterprise Assignment Combobox"}),e("div",{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13,marginTop:4},children:"Test keyboard filtering, async states, and validation feedback."})]}),e(b,{tone:"brand",children:"SaaS Ready"})]}),e(p,{...t,onChange:a=>i.info(`Assigned ${a||"none"}`,{duration:900,theme:"light"}),onOpenDetail:a=>{a.source!=="attribute"&&i.info(`Combobox ${a.open?"opened":"closed"} via ${a.source}`,{duration:850,theme:"light"})},children:C()})]})});d.args={value:"",placeholder:"Search staff and departments...",clearable:!0,debounce:220,disabled:!1,readOnly:!1,validation:"none",size:"md",variant:"surface",radius:"large",label:"Assignee",description:"Choose the incident owner for this escalation.",allowCustom:!1,noFilter:!1,state:"idle",stateText:"",emptyText:"No matching staff found."};const m=()=>{const[t,a]=c.useState(""),[g,E]=c.useState(""),[o,s]=c.useState("idle"),[S,x]=c.useState(!1);return e(l,{style:{...f,maxInlineSize:980},children:n(u,{style:{display:"grid",gap:12},children:[n(v,{align:"center",justify:"space-between",style:{gap:8,flexWrap:"wrap"},children:[n(v,{align:"center",style:{gap:8},children:[e(F,{size:15}),e("span",{style:{fontWeight:700},children:"Critical Incident Routing"})]}),e(b,{tone:o==="error"?"danger":o==="success"?"success":"brand",children:o.toUpperCase()})]}),e(p,{open:S,value:t,clearable:!0,debounce:280,state:o,stateText:o==="loading"?"Syncing on-call directory":o==="error"?"Directory unavailable":o==="success"?"Directory verified":"",label:"Clinical owner",description:"Type to search clinician roster and assign incident ownership.",placeholder:"Find clinician...",validation:o==="error"?"error":o==="success"?"success":"none",onOpen:()=>x(!0),onClose:()=>x(!1),onInput:r=>{E(r),s("loading"),window.setTimeout(()=>{s(r.trim().length>1?"success":"idle")},500)},onChange:r=>{a(r),i.success(`Incident assigned to ${r||"unassigned"}`,{duration:1200,theme:"light"})},onOpenDetail:r=>{r.source==="outside"&&i.info("Combobox dismissed by outside click",{duration:900,theme:"light"})},children:C()}),n(v,{align:"center",style:{gap:8,flexWrap:"wrap"},children:[e(h,{size:"sm",variant:"secondary",startIcon:e(W,{size:14}),onClick:()=>{s("loading"),i.loading("Refreshing staffing directory...",{duration:900,theme:"light"}),window.setTimeout(()=>s("idle"),900)},children:"Refresh"}),e(h,{size:"sm",variant:"secondary",startIcon:e(G,{size:14}),onClick:()=>{s("error"),i.error("Roster API timeout detected",{duration:1400,theme:"light"})},children:"Simulate Error"}),e(h,{size:"sm",variant:"secondary",startIcon:e(j,{size:14}),onClick:()=>{s("success"),i.success("Roster cache warmed and ready",{duration:1100,theme:"light"})},children:"Mark Success"}),e(h,{size:"sm",startIcon:e(D,{size:14}),onClick:()=>x(r=>!r),children:S?"Close List":"Open List"})]}),n(l,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:["value: ",e("code",{children:t||"(none)"})," | query: ",e("code",{children:g||"(empty)"})]})]})})},y=()=>{const[t,a]=c.useState("");return n(u,{style:{display:"grid",gap:12,maxInlineSize:980},children:[e(l,{style:f,children:n(u,{style:{display:"grid",gap:10},children:[e(b,{tone:"warning",children:"Custom + Empty State"}),n(p,{allowCustom:!0,clearable:!0,debounce:250,emptyText:"No known clinical tags. Press Enter to use custom value.",label:"Escalation Tag",description:"Supports custom tags when no preset value matches.",placeholder:"Type severity tag...",onChange:g=>{a(g),i.info(`Tag set to ${g||"(empty)"}`,{duration:900,theme:"light"})},children:[e("option",{value:"high-risk","data-description":"Immediate supervisory review",children:"High Risk"}),e("option",{value:"compliance","data-description":"Policy validation required",children:"Compliance"}),e("option",{value:"handover","data-description":"Shift transition dependency",children:"Handover"})]}),n(l,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:["Current tag: ",e("code",{children:t||"(none)"})]})]})}),e(l,{style:f,children:n(u,{style:{display:"grid",gap:10},children:[e(b,{tone:"info",children:"Read-Only Review"}),e(p,{readOnly:!0,value:"dr-oliver-johnson",label:"Escalation reviewer",description:"Read-only snapshot for approval audit trail.",placeholder:"Reviewer",children:C()})]})})]})};var w,I,R;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`(args: any) => <Box style={{
  ...cardStyle,
  maxInlineSize: 900
}}>
    <Grid style={{
    display: 'grid',
    gap: 12
  }}>
      <Flex align="center" justify="space-between" style={{
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <div>
          <div style={{
          fontWeight: 700,
          fontSize: 18
        }}>Enterprise Assignment Combobox</div>
          <div style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13,
          marginTop: 4
        }}>
            Test keyboard filtering, async states, and validation feedback.
          </div>
        </div>
        <Badge tone="brand">SaaS Ready</Badge>
      </Flex>

      <Combobox {...args} onChange={next => toastAdvanced.info(\`Assigned \${next || 'none'}\`, {
      duration: 900,
      theme: 'light'
    })} onOpenDetail={detail => {
      if (detail.source !== 'attribute') {
        toastAdvanced.info(\`Combobox \${detail.open ? 'opened' : 'closed'} via \${detail.source}\`, {
          duration: 850,
          theme: 'light'
        });
      }
    }}>
        {renderOptions()}
      </Combobox>
    </Grid>
  </Box>`,...(R=(I=d.parameters)==null?void 0:I.docs)==null?void 0:R.source}}};var z,B,k;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [open, setOpen] = React.useState(false);
  return <Box style={{
    ...cardStyle,
    maxInlineSize: 980
  }}>
      <Grid style={{
      display: 'grid',
      gap: 12
    }}>
        <Flex align="center" justify="space-between" style={{
        gap: 8,
        flexWrap: 'wrap'
      }}>
          <Flex align="center" style={{
          gap: 8
        }}>
            <ShieldIcon size={15} />
            <span style={{
            fontWeight: 700
          }}>Critical Incident Routing</span>
          </Flex>
          <Badge tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'}>
            {state.toUpperCase()}
          </Badge>
        </Flex>

        <Combobox open={open} value={value} clearable debounce={280} state={state} stateText={state === 'loading' ? 'Syncing on-call directory' : state === 'error' ? 'Directory unavailable' : state === 'success' ? 'Directory verified' : ''} label="Clinical owner" description="Type to search clinician roster and assign incident ownership." placeholder="Find clinician..." validation={state === 'error' ? 'error' : state === 'success' ? 'success' : 'none'} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} onInput={nextQuery => {
        setQuery(nextQuery);
        setState('loading');
        window.setTimeout(() => {
          setState(nextQuery.trim().length > 1 ? 'success' : 'idle');
        }, 500);
      }} onChange={next => {
        setValue(next);
        toastAdvanced.success(\`Incident assigned to \${next || 'unassigned'}\`, {
          duration: 1200,
          theme: 'light'
        });
      }} onOpenDetail={detail => {
        if (detail.source === 'outside') {
          toastAdvanced.info('Combobox dismissed by outside click', {
            duration: 900,
            theme: 'light'
          });
        }
      }}>
          {renderOptions()}
        </Combobox>

        <Flex align="center" style={{
        gap: 8,
        flexWrap: 'wrap'
      }}>
          <Button size="sm" variant="secondary" startIcon={<RefreshCwIcon size={14} />} onClick={() => {
          setState('loading');
          toastAdvanced.loading('Refreshing staffing directory...', {
            duration: 900,
            theme: 'light'
          });
          window.setTimeout(() => setState('idle'), 900);
        }}>
            Refresh
          </Button>
          <Button size="sm" variant="secondary" startIcon={<AlertTriangleIcon size={14} />} onClick={() => {
          setState('error');
          toastAdvanced.error('Roster API timeout detected', {
            duration: 1400,
            theme: 'light'
          });
        }}>
            Simulate Error
          </Button>
          <Button size="sm" variant="secondary" startIcon={<CheckCircleIcon size={14} />} onClick={() => {
          setState('success');
          toastAdvanced.success('Roster cache warmed and ready', {
            duration: 1100,
            theme: 'light'
          });
        }}>
            Mark Success
          </Button>
          <Button size="sm" startIcon={<UsersIcon size={14} />} onClick={() => setOpen(current => !current)}>
            {open ? 'Close List' : 'Open List'}
          </Button>
        </Flex>

        <Box style={{
        fontSize: 12,
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          value: <code>{value || '(none)'}</code> | query: <code>{query || '(empty)'}</code>
        </Box>
      </Grid>
    </Box>;
}`,...(k=(B=m.parameters)==null?void 0:B.docs)==null?void 0:k.source}}};var T,O,A;y.parameters={...y.parameters,docs:{...(T=y.parameters)==null?void 0:T.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState('');
  return <Grid style={{
    display: 'grid',
    gap: 12,
    maxInlineSize: 980
  }}>
      <Box style={cardStyle}>
        <Grid style={{
        display: 'grid',
        gap: 10
      }}>
          <Badge tone="warning">Custom + Empty State</Badge>
          <Combobox allowCustom clearable debounce={250} emptyText="No known clinical tags. Press Enter to use custom value." label="Escalation Tag" description="Supports custom tags when no preset value matches." placeholder="Type severity tag..." onChange={next => {
          setValue(next);
          toastAdvanced.info(\`Tag set to \${next || '(empty)'}\`, {
            duration: 900,
            theme: 'light'
          });
        }}>
            <option value="high-risk" data-description="Immediate supervisory review">
              High Risk
            </option>
            <option value="compliance" data-description="Policy validation required">
              Compliance
            </option>
            <option value="handover" data-description="Shift transition dependency">
              Handover
            </option>
          </Combobox>
          <Box style={{
          fontSize: 12,
          color: 'var(--ui-color-muted, #64748b)'
        }}>
            Current tag: <code>{value || '(none)'}</code>
          </Box>
        </Grid>
      </Box>

      <Box style={cardStyle}>
        <Grid style={{
        display: 'grid',
        gap: 10
      }}>
          <Badge tone="info">Read-Only Review</Badge>
          <Combobox readOnly value="dr-oliver-johnson" label="Escalation reviewer" description="Read-only snapshot for approval audit trail." placeholder="Reviewer">
            {renderOptions()}
          </Combobox>
        </Grid>
      </Box>
    </Grid>;
}`,...(A=(O=y.parameters)==null?void 0:O.docs)==null?void 0:A.source}}};const L=["Playground","EnterpriseTriageWorkflow","EdgeCases"];export{y as EdgeCases,m as EnterpriseTriageWorkflow,d as Playground,L as __namedExportsOrder,V as default};
