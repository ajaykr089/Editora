import{N as g,a as e,B as t,j as n,G as x,F as p,l as y,t as l,b as f}from"./index-c1b18327.js";import{R as r}from"./index-93f6b7ae.js";import{S as F,c as G,R as S,A as b,a as $,m as T,n as E,U as M,b as j}from"./icons-f697cb21.js";/* empty css              *//* empty css                */const Q={title:"UI/ContextMenu",component:g,argTypes:{open:{control:"boolean"},anchorId:{control:"text"},disabled:{control:"boolean"},state:{control:{type:"radio",options:["idle","loading","error","success"]}},stateText:{control:"text"},variant:{control:{type:"radio",options:["default","solid","flat","contrast"]}},density:{control:{type:"radio",options:["default","compact","comfortable"]}},shape:{control:{type:"radio",options:["default","square","soft"]}},elevation:{control:{type:"radio",options:["default","none","low","high"]}},tone:{control:{type:"radio",options:["default","brand","danger","success"]}},closeOnSelect:{control:"boolean"},closeOnEscape:{control:"boolean"},typeahead:{control:"boolean"}}},v={border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)",borderRadius:16,padding:16,background:"linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)",boxShadow:"0 12px 28px rgba(15, 23, 42, 0.08)"},H=[{label:"Create Follow-up Task",description:"Assign a remediation owner",icon:e(E,{size:14}),shortcut:"T"},{label:"Edit Incident Notes",description:"Update timeline and context",icon:e(T,{size:14}),shortcut:"E"},{label:"Share with Command Center",description:"Notify escalation room",icon:e(M,{size:14}),shortcut:"S"},{separator:!0},{label:"Move Incident",description:"Transfer to another queue",icon:e(j,{size:14}),submenu:[{label:"Critical Queue",description:"On-call triage",shortcut:"1"},{label:"Compliance Queue",description:"Audit pathway",shortcut:"2"},{label:"Archive",description:"Resolved long-term",shortcut:"3"}]},{label:"Delete Incident",description:"Requires supervisor approval",icon:e(b,{size:14}),disabled:!0}],d=o=>e(t,{style:{...v,maxInlineSize:980},children:n(x,{style:{display:"grid",gap:12},children:[n(p,{align:"center",justify:"space-between",style:{gap:10,flexWrap:"wrap"},children:[n("div",{children:[e("div",{style:{fontWeight:700,fontSize:18},children:"Enterprise Incident Actions"}),e("div",{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13,marginTop:4},children:"Validate navigation, submenu behavior, and action safety states."})]}),e(y,{tone:"brand",children:"Playground"})]}),e(t,{id:"ctx-enterprise-anchor",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",minHeight:110,borderRadius:12,border:"1px dashed #94a3b8",color:"#334155",background:"#f8fafc"},children:"Action Surface Anchor"}),e(g,{...o,anchorId:o.anchorId||"ctx-enterprise-anchor",items:H,onSelect:a=>{l.info(`${a.label||a.value||"Action"} selected`,{duration:900,theme:"light"})},onOpenDetail:a=>{a.source!=="attribute"&&l.info(`Menu ${a.open?"opened":"closed"} via ${a.source}`,{duration:850,theme:"light"})}})]})});d.args={open:!0,anchorId:"ctx-enterprise-anchor",disabled:!1,state:"idle",stateText:"",variant:"default",density:"default",shape:"default",elevation:"default",tone:"default",closeOnSelect:!0,closeOnEscape:!0,typeahead:!0};const m=()=>{const[o,a]=r.useState(!1),[c,O]=r.useState(void 0),[i,u]=r.useState("idle"),[P,L]=r.useState("none"),W=i==="loading"?"Syncing policy actions":i==="error"?"Action pipeline unavailable":i==="success"?"Action pipeline healthy":"";return e(t,{style:{...v,maxInlineSize:980},children:n(x,{style:{display:"grid",gap:12},children:[n(p,{align:"center",justify:"space-between",style:{gap:10,flexWrap:"wrap"},children:[n(p,{align:"center",style:{gap:8},children:[e(F,{size:15}),e("span",{style:{fontWeight:700},children:"Critical Escalation Workspace"})]}),e(y,{tone:i==="error"?"danger":i==="success"?"success":"brand",children:i.toUpperCase()})]}),e(t,{onContextMenu:s=>{s.preventDefault(),O({x:s.clientX,y:s.clientY}),a(!0)},style:{minHeight:170,borderRadius:12,border:"1px dashed #94a3b8",background:"linear-gradient(160deg, #f8fafc 0%, #eef2ff 100%)",display:"grid",placeItems:"center",color:"#334155",fontWeight:600},children:"Right-click to open incident actions"}),e(g,{open:o,anchorPoint:c,state:i,stateText:W,closeOnSelect:!0,onOpen:()=>a(!0),onClose:()=>a(!1),onSelect:s=>{L(s.label||s.value||"unknown"),l.success(`${s.label||s.value||"Action"} executed`,{duration:1100,theme:"light"})},items:[{label:"Run Safety Validation",description:"Check protocol consistency",icon:e(G,{size:14}),shortcut:"V"},{label:"Refresh Incident Stream",description:"Rehydrate event context",icon:e(S,{size:14}),shortcut:"R"},{label:"Escalate to Supervisor",description:"Critical route",icon:e(b,{size:14}),shortcut:"X"}]}),n(p,{align:"center",style:{gap:8,flexWrap:"wrap"},children:[e(f,{size:"sm",variant:"secondary",startIcon:e(S,{size:14}),onClick:()=>{u("loading"),l.loading("Syncing action policies...",{duration:900,theme:"light"}),window.setTimeout(()=>u("idle"),950)},children:"Loading"}),e(f,{size:"sm",variant:"secondary",startIcon:e(b,{size:14}),onClick:()=>{u("error"),l.error("Policy service timeout",{duration:1300,theme:"light"})},children:"Error"}),e(f,{size:"sm",variant:"secondary",startIcon:e($,{size:14}),onClick:()=>{u("success"),l.success("Policy checks passed",{duration:1e3,theme:"light"})},children:"Success"})]}),n(t,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:["Last action: ",P]})]})})},h=()=>{const[o,a]=r.useState("none");return e(t,{style:{...v,maxInlineSize:820},children:n(x,{style:{display:"grid",gap:12},children:[n(p,{align:"center",justify:"space-between",style:{gap:10,flexWrap:"wrap"},children:[e(y,{tone:"info",children:"Persistent Selection"}),e(t,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:"Live preference panel"})]}),n(t,{id:"ctx-functional",style:{padding:16,border:"1px dashed #cbd5e1",borderRadius:12,display:"inline-flex",alignItems:"center",gap:8,color:"#334155",background:"linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)"},children:[e(T,{size:14}),"Toggle options (menu stays open)"]}),e(g,{open:!0,anchorId:"ctx-functional",closeOnSelect:!1,density:"comfortable",shape:"soft",onSelect:c=>{a(`${c.label||c.value||"item"}${typeof c.checked=="boolean"?` (${c.checked?"on":"off"})`:""}`)},children:n("div",{slot:"menu",children:[e("div",{className:"section-label",children:"Layout Preferences"}),n("div",{className:"menuitem",role:"menuitemcheckbox","aria-checked":"true","data-value":"show-grid",tabIndex:0,children:[e("span",{className:"icon selection-icon","aria-hidden":"true"}),n("span",{className:"label",children:[e("span",{className:"text",children:"Show Grid"}),e("span",{className:"caption",children:"Visual alignment overlay"})]}),e("span",{className:"shortcut",children:"Cmd+G"})]}),n("div",{className:"menuitem",role:"menuitemcheckbox","aria-checked":"false","data-value":"snap",tabIndex:0,children:[e("span",{className:"icon selection-icon","aria-hidden":"true"}),n("span",{className:"label",children:[e("span",{className:"text",children:"Snap to Guides"}),e("span",{className:"caption",children:"Precision drag behavior"})]}),e("span",{className:"shortcut",children:"Alt+S"})]}),n("div",{className:"menuitem",role:"menuitemcheckbox","aria-checked":"true","data-value":"context-hints",tabIndex:0,children:[e("span",{className:"icon selection-icon","aria-hidden":"true"}),n("span",{className:"label",children:[e("span",{className:"text",children:"Context Hints"}),e("span",{className:"caption",children:"Inline action recommendations"})]}),e("span",{className:"shortcut",children:"Cmd+H"})]}),e("div",{className:"separator",role:"separator"}),e("div",{className:"section-label",children:"Theme Mode"}),n("div",{className:"menuitem",role:"menuitemradio","data-group":"theme","aria-checked":"true","data-value":"theme-light",tabIndex:0,children:[e("span",{className:"icon selection-icon","aria-hidden":"true"}),n("span",{className:"label",children:[e("span",{className:"text",children:"Theme: Light"}),e("span",{className:"caption",children:"High contrast workspace"})]}),e("span",{className:"shortcut",children:"1"})]}),n("div",{className:"menuitem",role:"menuitemradio","data-group":"theme","aria-checked":"false","data-value":"theme-dark",tabIndex:0,children:[e("span",{className:"icon selection-icon","aria-hidden":"true"}),n("span",{className:"label",children:[e("span",{className:"text",children:"Theme: Dark"}),e("span",{className:"caption",children:"Low-glare night shift mode"})]}),e("span",{className:"shortcut",children:"2"})]}),n("div",{className:"menuitem",role:"menuitemradio","data-group":"theme","aria-checked":"false","data-value":"theme-system",tabIndex:0,children:[e("span",{className:"icon selection-icon","aria-hidden":"true"}),n("span",{className:"label",children:[e("span",{className:"text",children:"Theme: System"}),e("span",{className:"caption",children:"Follow OS color scheme"})]}),e("span",{className:"shortcut",children:"3"})]})]})}),n(t,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:["Last action: ",o]})]})})};var N,I,k;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`(args: any) => <Box style={{
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
          fontWeight: 700,
          fontSize: 18
        }}>Enterprise Incident Actions</div>
          <div style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13,
          marginTop: 4
        }}>
            Validate navigation, submenu behavior, and action safety states.
          </div>
        </div>
        <Badge tone="brand">Playground</Badge>
      </Flex>

      <Box id="ctx-enterprise-anchor" style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 110,
      borderRadius: 12,
      border: '1px dashed #94a3b8',
      color: '#334155',
      background: '#f8fafc'
    }}>
        Action Surface Anchor
      </Box>

      <ContextMenu {...args} anchorId={args.anchorId || 'ctx-enterprise-anchor'} items={baseItems as any} onSelect={detail => {
      toastAdvanced.info(\`\${detail.label || detail.value || 'Action'} selected\`, {
        duration: 900,
        theme: 'light'
      });
    }} onOpenDetail={detail => {
      if (detail.source !== 'attribute') {
        toastAdvanced.info(\`Menu \${detail.open ? 'opened' : 'closed'} via \${detail.source}\`, {
          duration: 850,
          theme: 'light'
        });
      }
    }} />
    </Grid>
  </Box>`,...(k=(I=d.parameters)==null?void 0:I.docs)==null?void 0:k.source}}};var C,z,w;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`() => {
  const [open, setOpen] = React.useState(false);
  const [point, setPoint] = React.useState<{
    x: number;
    y: number;
  } | undefined>(undefined);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [lastAction, setLastAction] = React.useState('none');
  const stateText = state === 'loading' ? 'Syncing policy actions' : state === 'error' ? 'Action pipeline unavailable' : state === 'success' ? 'Action pipeline healthy' : '';
  return <Box style={{
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
          <Flex align="center" style={{
          gap: 8
        }}>
            <ShieldIcon size={15} />
            <span style={{
            fontWeight: 700
          }}>Critical Escalation Workspace</span>
          </Flex>
          <Badge tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'}>{state.toUpperCase()}</Badge>
        </Flex>

        <Box onContextMenu={event => {
        event.preventDefault();
        setPoint({
          x: event.clientX,
          y: event.clientY
        });
        setOpen(true);
      }} style={{
        minHeight: 170,
        borderRadius: 12,
        border: '1px dashed #94a3b8',
        background: 'linear-gradient(160deg, #f8fafc 0%, #eef2ff 100%)',
        display: 'grid',
        placeItems: 'center',
        color: '#334155',
        fontWeight: 600
      }}>
          Right-click to open incident actions
        </Box>

        <ContextMenu open={open} anchorPoint={point} state={state} stateText={stateText} closeOnSelect onOpen={() => setOpen(true)} onClose={() => setOpen(false)} onSelect={detail => {
        setLastAction(detail.label || detail.value || 'unknown');
        toastAdvanced.success(\`\${detail.label || detail.value || 'Action'} executed\`, {
          duration: 1100,
          theme: 'light'
        });
      }} items={[{
        label: 'Run Safety Validation',
        description: 'Check protocol consistency',
        icon: <ClipboardCheckIcon size={14} />,
        shortcut: 'V'
      }, {
        label: 'Refresh Incident Stream',
        description: 'Rehydrate event context',
        icon: <RefreshCwIcon size={14} />,
        shortcut: 'R'
      }, {
        label: 'Escalate to Supervisor',
        description: 'Critical route',
        icon: <AlertTriangleIcon size={14} />,
        shortcut: 'X'
      }] as any} />

        <Flex align="center" style={{
        gap: 8,
        flexWrap: 'wrap'
      }}>
          <Button size="sm" variant="secondary" startIcon={<RefreshCwIcon size={14} />} onClick={() => {
          setState('loading');
          toastAdvanced.loading('Syncing action policies...', {
            duration: 900,
            theme: 'light'
          });
          window.setTimeout(() => setState('idle'), 950);
        }}>
            Loading
          </Button>
          <Button size="sm" variant="secondary" startIcon={<AlertTriangleIcon size={14} />} onClick={() => {
          setState('error');
          toastAdvanced.error('Policy service timeout', {
            duration: 1300,
            theme: 'light'
          });
        }}>
            Error
          </Button>
          <Button size="sm" variant="secondary" startIcon={<CheckCircleIcon size={14} />} onClick={() => {
          setState('success');
          toastAdvanced.success('Policy checks passed', {
            duration: 1000,
            theme: 'light'
          });
        }}>
            Success
          </Button>
        </Flex>

        <Box style={{
        fontSize: 12,
        color: 'var(--ui-color-muted, #64748b)'
      }}>Last action: {lastAction}</Box>
      </Grid>
    </Box>;
}`,...(w=(z=m.parameters)==null?void 0:z.docs)==null?void 0:w.source}}};var A,B,R;h.parameters={...h.parameters,docs:{...(A=h.parameters)==null?void 0:A.docs,source:{originalSource:`() => {
  const [last, setLast] = React.useState<string>('none');
  return <Box style={{
    ...cardStyle,
    maxInlineSize: 820
  }}>
      <Grid style={{
      display: 'grid',
      gap: 12
    }}>
        <Flex align="center" justify="space-between" style={{
        gap: 10,
        flexWrap: 'wrap'
      }}>
          <Badge tone="info">Persistent Selection</Badge>
          <Box style={{
          fontSize: 12,
          color: 'var(--ui-color-muted, #64748b)'
        }}>Live preference panel</Box>
        </Flex>
        <Box id="ctx-functional" style={{
        padding: 16,
        border: '1px dashed #cbd5e1',
        borderRadius: 12,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        color: '#334155',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
          <SparklesIcon size={14} />
          Toggle options (menu stays open)
        </Box>
        <ContextMenu open anchorId="ctx-functional" closeOnSelect={false} density="comfortable" shape="soft" onSelect={detail => {
        setLast(\`\${detail.label || detail.value || 'item'}\${typeof detail.checked === 'boolean' ? \` (\${detail.checked ? 'on' : 'off'})\` : ''}\`);
      }}>
          <div slot="menu">
            <div className="section-label">Layout Preferences</div>
            <div className="menuitem" role="menuitemcheckbox" aria-checked="true" data-value="show-grid" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Show Grid</span><span className="caption">Visual alignment overlay</span></span>
              <span className="shortcut">Cmd+G</span>
            </div>
            <div className="menuitem" role="menuitemcheckbox" aria-checked="false" data-value="snap" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Snap to Guides</span><span className="caption">Precision drag behavior</span></span>
              <span className="shortcut">Alt+S</span>
            </div>
            <div className="menuitem" role="menuitemcheckbox" aria-checked="true" data-value="context-hints" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Context Hints</span><span className="caption">Inline action recommendations</span></span>
              <span className="shortcut">Cmd+H</span>
            </div>
            <div className="separator" role="separator" />
            <div className="section-label">Theme Mode</div>
            <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="true" data-value="theme-light" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Theme: Light</span><span className="caption">High contrast workspace</span></span>
              <span className="shortcut">1</span>
            </div>
            <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="false" data-value="theme-dark" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Theme: Dark</span><span className="caption">Low-glare night shift mode</span></span>
              <span className="shortcut">2</span>
            </div>
            <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="false" data-value="theme-system" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Theme: System</span><span className="caption">Follow OS color scheme</span></span>
              <span className="shortcut">3</span>
            </div>
          </div>
        </ContextMenu>

        <Box style={{
        fontSize: 12,
        color: 'var(--ui-color-muted, #64748b)'
      }}>Last action: {last}</Box>
      </Grid>
    </Box>;
}`,...(R=(B=h.parameters)==null?void 0:B.docs)==null?void 0:R.source}}};const Y=["Playground","IncidentWorkflow","PersistentSelection"];export{m as IncidentWorkflow,h as PersistentSelection,d as Playground,Y as __namedExportsOrder,Q as default};
