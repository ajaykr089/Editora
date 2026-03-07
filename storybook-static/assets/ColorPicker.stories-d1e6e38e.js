import{K as v,a as e,B as u,j as r,G as f,F as g,l as S,t as s,b as o}from"./index-c1b18327.js";import{R as d}from"./index-93f6b7ae.js";import{S as A,R as F,A as V,a as W}from"./icons-f697cb21.js";/* empty css              *//* empty css                */const U={title:"UI/ColorPicker",component:v,argTypes:{value:{control:"text"},format:{control:{type:"radio",options:["hex","rgb","hsl"]}},alpha:{control:"boolean"},disabled:{control:"boolean"},readOnly:{control:"boolean"},size:{control:{type:"radio",options:["sm","md","lg"]}},variant:{control:{type:"radio",options:["default","contrast"]}},state:{control:{type:"radio",options:["idle","loading","error","success"]}},tone:{control:{type:"radio",options:["brand","neutral","success","warning","danger"]}},mode:{control:{type:"radio",options:["inline","popover"]}},open:{control:"boolean"},closeOnEscape:{control:"boolean"},recent:{control:"boolean"},persist:{control:"boolean"},maxRecent:{control:{type:"number",min:1,max:24,step:1}}}},P=["#1d4ed8","#0369a1","#0f766e","#15803d","#b45309","#b91c1c","#7e22ce","#334155","#111827"],C={border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)",borderRadius:16,padding:16,background:"linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)",boxShadow:"0 12px 28px rgba(15, 23, 42, 0.08)"},p=i=>e(u,{style:{...C,maxInlineSize:980},children:r(f,{style:{display:"grid",gap:12},children:[r(g,{align:"center",justify:"space-between",style:{gap:10,flexWrap:"wrap"},children:[r("div",{children:[e("div",{style:{fontSize:20,fontWeight:700},children:"Enterprise Theme Color Controls"}),e("div",{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13,marginTop:4},children:"Validate runtime palette updates for alerts, badges, and analytics highlights."})]}),e(S,{tone:"brand",children:"Design System"})]}),e(v,{...i,presets:P,onChange:n=>{s.info(`Updated ${n.value} via ${n.source}`,{duration:900,theme:"light"})},onInvalid:n=>{s.warning(`Invalid token: ${n.raw}`,{duration:1200,theme:"light"})},onCloseDetail:n=>{s.info(`Picker closed via ${n.source}`,{duration:850,theme:"light"})},"aria-label":"Theme color picker"})]})});p.args={value:"#2563eb",format:"hex",alpha:!0,disabled:!1,readOnly:!1,size:"md",variant:"default",state:"idle",tone:"brand",mode:"inline",open:!1,closeOnEscape:!0,placeholder:"Choose theme color",recent:!0,persist:!0,maxRecent:10};const h=()=>{const[i,n]=d.useState("rgb(37 99 235 / 0.92)"),[l,t]=d.useState(!1),[a,m]=d.useState("idle"),[O,T]=d.useState("none");return e(f,{style:{display:"grid",gap:12,maxInlineSize:1040},children:r(u,{style:C,children:[r(g,{align:"center",justify:"space-between",style:{gap:10,flexWrap:"wrap"},children:[r(g,{align:"center",style:{gap:8},children:[e(A,{size:15}),e("span",{style:{fontWeight:700,fontSize:16},children:"Release Color Governance"})]}),e(S,{tone:a==="error"?"danger":a==="success"?"success":"brand",children:a.toUpperCase()})]}),e(u,{style:{marginTop:12},children:e(v,{mode:"popover",open:l,onOpen:()=>t(!0),onClose:()=>t(!1),onCloseDetail:c=>{t(!1),T(c.source)},state:a,tone:a==="error"?"danger":a==="success"?"success":"brand",alpha:!0,recent:!0,persist:!0,maxRecent:12,format:"rgb",value:i,presets:P,closeOnEscape:!0,onChange:c=>{n(c.value),c.source==="eyedropper"&&s.success("Eyedropper value committed",{duration:1100,theme:"light"})},"aria-label":"Release palette picker"})}),r(g,{align:"center",style:{gap:8,flexWrap:"wrap",marginTop:12},children:[e(o,{size:"sm",variant:"secondary",startIcon:e(F,{size:14}),onClick:()=>{m("loading"),s.loading("Validating palette consistency...",{duration:850,theme:"light"}),window.setTimeout(()=>m("idle"),900)},children:"Validate"}),e(o,{size:"sm",variant:"secondary",startIcon:e(V,{size:14}),onClick:()=>{m("error"),s.error("Contrast regression detected for warning badge",{duration:1300,theme:"light"})},children:"Force Error"}),e(o,{size:"sm",variant:"secondary",startIcon:e(W,{size:14}),onClick:()=>{m("success"),s.success("Palette approved for release",{duration:1200,theme:"light"})},children:"Mark Success"}),e(o,{size:"sm",onClick:()=>t(c=>!c),children:l?"Close Picker":"Open Picker"})]}),r(u,{style:{marginTop:10,fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:["Value: ",i," | Last close source: ",O]})]})})},y=()=>{const[i,n]=d.useState("#0ea5e9"),[l,t]=d.useState("idle");return e(f,{style:{display:"grid",gap:12,maxInlineSize:980},children:e(u,{style:C,children:r(f,{style:{display:"grid",gap:10},children:[e(S,{tone:"warning",children:"Edge Scenarios"}),e(v,{alpha:!0,format:"hex",mode:"inline",state:l,tone:l==="error"?"danger":l==="success"?"success":"warning",value:i,presets:["#fff","#000","#16a34a","#dc2626","#f59e0b","#2563eb"],onChange:a=>n(a.value),onInvalid:a=>{t("error"),s.warning(`Input recovery required: ${a.reason}`,{duration:1300,theme:"light"})},"aria-label":"Edge-case color picker"}),r(g,{align:"center",style:{gap:8,flexWrap:"wrap"},children:[e(o,{size:"sm",variant:"secondary",onClick:()=>t("idle"),children:"Idle"}),e(o,{size:"sm",variant:"secondary",onClick:()=>t("loading"),children:"Loading"}),e(o,{size:"sm",variant:"secondary",onClick:()=>t("error"),children:"Error"}),e(o,{size:"sm",variant:"secondary",onClick:()=>t("success"),children:"Success"})]})]})})})};var b,x,k;p.parameters={...p.parameters,docs:{...(b=p.parameters)==null?void 0:b.docs,source:{originalSource:`(args: any) => <Box style={{
  ...cardStyle,
  maxInlineSize: 980
}}>
    <Grid style={{
    display: 'grid',
    gap: 12
  }}>
      <Flex align="center" justify="space-between" style={{
      gap: 10,
      flexWrap: 'wrap'
    }}>
        <div>
          <div style={{
          fontSize: 20,
          fontWeight: 700
        }}>Enterprise Theme Color Controls</div>
          <div style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13,
          marginTop: 4
        }}>
            Validate runtime palette updates for alerts, badges, and analytics highlights.
          </div>
        </div>
        <Badge tone="brand">Design System</Badge>
      </Flex>

      <ColorPicker {...args} presets={enterprisePresets} onChange={detail => {
      toastAdvanced.info(\`Updated \${detail.value} via \${detail.source}\`, {
        duration: 900,
        theme: 'light'
      });
    }} onInvalid={detail => {
      toastAdvanced.warning(\`Invalid token: \${detail.raw}\`, {
        duration: 1200,
        theme: 'light'
      });
    }} onCloseDetail={detail => {
      toastAdvanced.info(\`Picker closed via \${detail.source}\`, {
        duration: 850,
        theme: 'light'
      });
    }} aria-label="Theme color picker" />
    </Grid>
  </Box>`,...(k=(x=p.parameters)==null?void 0:x.docs)==null?void 0:k.source}}};var z,B,w;h.parameters={...h.parameters,docs:{...(z=h.parameters)==null?void 0:z.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState('rgb(37 99 235 / 0.92)');
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [lastCloseSource, setLastCloseSource] = React.useState('none');
  return <Grid style={{
    display: 'grid',
    gap: 12,
    maxInlineSize: 1040
  }}>
      <Box style={cardStyle}>
        <Flex align="center" justify="space-between" style={{
        gap: 10,
        flexWrap: 'wrap'
      }}>
          <Flex align="center" style={{
          gap: 8
        }}>
            <ShieldIcon size={15} />
            <span style={{
            fontWeight: 700,
            fontSize: 16
          }}>Release Color Governance</span>
          </Flex>
          <Badge tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'}>
            {state.toUpperCase()}
          </Badge>
        </Flex>

        <Box style={{
        marginTop: 12
      }}>
          <ColorPicker mode="popover" open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} onCloseDetail={detail => {
          setOpen(false);
          setLastCloseSource(detail.source);
        }} state={state} tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'} alpha recent persist maxRecent={12} format="rgb" value={value} presets={enterprisePresets} closeOnEscape onChange={detail => {
          setValue(detail.value);
          if (detail.source === 'eyedropper') {
            toastAdvanced.success('Eyedropper value committed', {
              duration: 1100,
              theme: 'light'
            });
          }
        }} aria-label="Release palette picker" />
        </Box>

        <Flex align="center" style={{
        gap: 8,
        flexWrap: 'wrap',
        marginTop: 12
      }}>
          <Button size="sm" variant="secondary" startIcon={<RefreshCwIcon size={14} />} onClick={() => {
          setState('loading');
          toastAdvanced.loading('Validating palette consistency...', {
            duration: 850,
            theme: 'light'
          });
          window.setTimeout(() => setState('idle'), 900);
        }}>
            Validate
          </Button>
          <Button size="sm" variant="secondary" startIcon={<AlertTriangleIcon size={14} />} onClick={() => {
          setState('error');
          toastAdvanced.error('Contrast regression detected for warning badge', {
            duration: 1300,
            theme: 'light'
          });
        }}>
            Force Error
          </Button>
          <Button size="sm" variant="secondary" startIcon={<CheckCircleIcon size={14} />} onClick={() => {
          setState('success');
          toastAdvanced.success('Palette approved for release', {
            duration: 1200,
            theme: 'light'
          });
        }}>
            Mark Success
          </Button>
          <Button size="sm" onClick={() => setOpen(current => !current)}>
            {open ? 'Close Picker' : 'Open Picker'}
          </Button>
        </Flex>

        <Box style={{
        marginTop: 10,
        fontSize: 12,
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Value: {value} | Last close source: {lastCloseSource}
        </Box>
      </Box>
    </Grid>;
}`,...(w=(B=h.parameters)==null?void 0:B.docs)==null?void 0:w.source}}};var I,R,E;y.parameters={...y.parameters,docs:{...(I=y.parameters)==null?void 0:I.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState('#0ea5e9');
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
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
          <Badge tone="warning">Edge Scenarios</Badge>
          <ColorPicker alpha format="hex" mode="inline" state={state} tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'warning'} value={value} presets={['#fff', '#000', '#16a34a', '#dc2626', '#f59e0b', '#2563eb']} onChange={detail => setValue(detail.value)} onInvalid={detail => {
          setState('error');
          toastAdvanced.warning(\`Input recovery required: \${detail.reason}\`, {
            duration: 1300,
            theme: 'light'
          });
        }} aria-label="Edge-case color picker" />
          <Flex align="center" style={{
          gap: 8,
          flexWrap: 'wrap'
        }}>
            <Button size="sm" variant="secondary" onClick={() => setState('idle')}>Idle</Button>
            <Button size="sm" variant="secondary" onClick={() => setState('loading')}>Loading</Button>
            <Button size="sm" variant="secondary" onClick={() => setState('error')}>Error</Button>
            <Button size="sm" variant="secondary" onClick={() => setState('success')}>Success</Button>
          </Flex>
        </Grid>
      </Box>
    </Grid>;
}`,...(E=(R=y.parameters)==null?void 0:R.docs)==null?void 0:E.source}}};const q=["Playground","EnterpriseReleaseWorkflow","EdgeCasesAndRecovery"];export{y as EdgeCasesAndRecovery,h as EnterpriseReleaseWorkflow,p as Playground,q as __namedExportsOrder,U as default};
