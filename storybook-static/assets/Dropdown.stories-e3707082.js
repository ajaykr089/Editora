import{ay as pe,az as f,a as e,B as o,j as r,b as d,G as fe,g as ge}from"./index-c1b18327.js";import{r as i,R as ie}from"./index-93f6b7ae.js";function _(s,c){if(s){if(typeof s=="function"){s(c);return}s.current=c}}function me(s){const{placement:c="bottom",offset:u=8,open:B,onOpen:x,onClose:T,role:L="menu"}=s||{},F=i.useRef(null),w=i.useRef(null),g=i.useRef(null),z=i.useRef(`floating-${Math.random().toString(36).slice(2,9)}`),[E,ce]=i.useState({top:0,left:0,placement:c}),A=typeof B<"u",[de,ue]=i.useState(!!B),b=A?!!B:de,k=i.useCallback(()=>{const t=F.current,a=w.current;if(!t||!a)return;const l=pe(t,a,{placement:c,offset:u});ce({top:Math.round(l.top),left:Math.round(l.left),placement:l.placement,arrow:l.x||l.y?{x:l.x,y:l.y}:void 0})},[c,u]),y=i.useCallback(t=>{A||ue(t),t?x==null||x():T==null||T()},[A,x,T]),N=i.useCallback(()=>y(!b),[b,y]),q=i.useCallback(()=>y(!0),[y]),$=i.useCallback(()=>y(!1),[y]);i.useEffect(()=>{if(!b)return;const t=F.current,a=w.current;if(!t||!a)return;k();const l=()=>{g.current&&cancelAnimationFrame(g.current),g.current=requestAnimationFrame(()=>k())},m=()=>{g.current&&cancelAnimationFrame(g.current),g.current=requestAnimationFrame(()=>k())};window.addEventListener("scroll",l,!0),window.addEventListener("resize",m);let p=null,n=null;try{typeof ResizeObserver<"u"&&(p=new ResizeObserver(m),n=new ResizeObserver(m),p.observe(t),n.observe(a))}catch{p=n=null}return()=>{window.removeEventListener("scroll",l,!0),window.removeEventListener("resize",m),p==null||p.disconnect(),n==null||n.disconnect(),g.current&&cancelAnimationFrame(g.current),g.current=null}},[b,k]);const G=i.useCallback(t=>{F.current=t},[]),V=i.useCallback(t=>{w.current=t},[]),D=()=>w.current?Array.from(w.current.querySelectorAll('[role="menuitem"], .item, [data-menu-item]')).filter(Boolean):[],R=t=>{const a=D();if(!a.length)return;const l=Math.max(0,Math.min(a.length-1,t));try{a[l].focus()}catch{}},O=()=>R(0),H=()=>{const t=D();t.length&&R(t.length-1)},j=()=>{const t=D(),a=t.findIndex(l=>l===document.activeElement);R(a<0?0:(a+1)%t.length)},W=()=>{const t=D(),a=t.findIndex(l=>l===document.activeElement);R(a<=0?t.length-1:a-1)};return{referenceRef:G,floatingRef:V,coords:E,update:k,open:b,setOpen:y,toggle:N,openPopup:q,closePopup:$,getReferenceProps:(t={})=>{const{onClick:a,onKeyDown:l,ref:m,...p}=t;return{...p,ref:n=>{G(n),_(m,n)},"aria-haspopup":L,"aria-controls":z.current,"aria-expanded":b?"true":"false",onClick:n=>{a==null||a(n),!n.defaultPrevented&&N()},onKeyDown:n=>{l==null||l(n),!n.defaultPrevented&&n.key==="ArrowDown"&&(n.preventDefault(),q(),setTimeout(()=>O(),0))}}},getFloatingProps:(t={})=>{const{onKeyDown:a,style:l,ref:m,...p}=t;return{...p,id:z.current,ref:n=>{V(n),_(m,n)},role:L,tabIndex:-1,style:{...l||{},position:"absolute",top:`${E.top}px`,left:`${E.left}px`},hidden:!b,onKeyDown:n=>{a==null||a(n),!n.defaultPrevented&&(n.key==="Escape"?(n.preventDefault(),$()):n.key==="ArrowDown"?(n.preventDefault(),j()):n.key==="ArrowUp"?(n.preventDefault(),W()):n.key==="Home"?(n.preventDefault(),O()):n.key==="End"&&(n.preventDefault(),H()))}}},focusFirstItem:O,focusLastItem:H,focusNext:j,focusPrev:W}}const ve={title:"UI/Dropdown",component:f,argTypes:{placement:{control:"select",options:["bottom","top","left","right"]},variant:{control:"select",options:["default","solid","flat","line","glass","contrast"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["default","square","soft"]},elevation:{control:"select",options:["default","none","low","high"]},tone:{control:"select",options:["default","brand","danger","success","warning"]},closeOnSelect:{control:"boolean"},typeahead:{control:"boolean"}}},v={border:"1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))",borderRadius:12,padding:14,background:"var(--ui-color-surface, #ffffff)",color:"var(--ui-color-text, #0f172a)"},h=()=>r(o,{slot:"content",role:"menu",style:{minWidth:200,padding:0,borderRadius:0,boxShadow:"var(--ui-shadow-sm, 0 2px 6px rgba(16,24,40,0.08))"},children:[r(o,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"✏"}),e("span",{className:"label",children:"Edit"}),e("span",{className:"shortcut",children:"E"})]}),r(o,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"⧉"}),e("span",{className:"label",children:"Duplicate"}),e("span",{className:"shortcut",children:"D"})]}),e(o,{className:"separator",role:"separator"}),r(o,{role:"menuitem",tabIndex:-1,children:[e("span",{className:"icon",children:"🗂"}),e("span",{className:"label",children:"Archive"}),e("span",{className:"meta",children:"⌘A"})]})]}),S=s=>e(o,{style:{padding:60},children:r(f,{open:s.open,placement:s.placement,variant:s.variant,density:s.density,shape:s.shape,elevation:s.elevation,tone:s.tone,closeOnSelect:s.closeOnSelect,typeahead:s.typeahead,style:{"--ui-dropdown-menu-padding":"0px","--ui-dropdown-menu-radius":"0px","--ui-dropdown-menu-border":"0","--ui-dropdown-menu-shadow":"none"},children:[e(d,{slot:"trigger",children:"Open dropdown"}),e(h,{})]})});S.args={open:!1,placement:"bottom",variant:"default",density:"default",shape:"default",elevation:"default",tone:"default",closeOnSelect:!0,typeahead:!0};const C=()=>r(fe,{style:{display:"grid",gridTemplateColumns:"repeat(3, minmax(240px, 1fr))",gap:16,padding:20},children:[r(o,{style:v,children:[e("strong",{children:"Soft Default"}),e(o,{style:{marginTop:10},children:r(f,{open:!0,shape:"soft",placement:"bottom",children:[e(d,{slot:"trigger",children:"Trigger"}),e(h,{})]})})]}),r(o,{style:v,children:[e("strong",{children:"Square Flat"}),e(o,{style:{marginTop:10},children:r(f,{open:!0,shape:"square",variant:"flat",elevation:"none",density:"compact",children:[e(d,{slot:"trigger",children:"Trigger"}),e(h,{})]})})]}),r(o,{style:v,children:[e("strong",{children:"Line / Compact"}),e(o,{style:{marginTop:10},children:r(f,{open:!0,variant:"line",shape:"square",density:"compact",tone:"warning",children:[e(d,{slot:"trigger",children:"Trigger"}),e(h,{})]})})]}),r(o,{style:v,children:[e("strong",{children:"Solid Comfortable"}),e(o,{style:{marginTop:10},children:r(f,{open:!0,variant:"solid",density:"comfortable",elevation:"low",children:[e(d,{slot:"trigger",children:"Trigger"}),e(h,{})]})})]}),r(o,{style:{...v,background:"var(--ui-color-surface-alt, #f8fafc)"},children:[e("strong",{children:"Glass Surface"}),e(o,{style:{marginTop:10},children:r(f,{open:!0,variant:"glass",shape:"soft",elevation:"high",children:[e(d,{slot:"trigger",children:"Trigger"}),e(h,{})]})})]}),r(o,{style:v,children:[e("strong",{children:"Contrast + Danger Tone"}),e(o,{style:{marginTop:10},children:r(f,{open:!0,variant:"contrast",tone:"danger",elevation:"high",children:[e(d,{slot:"trigger",children:"Trigger"}),e(h,{})]})})]})]}),I=()=>{const[s,c]=ie.useState("none");return r(o,{style:{padding:56},children:[r(f,{open:!0,closeOnSelect:!1,onSelect:u=>c(`${u.label||u.value||"item"}${typeof u.checked=="boolean"?` (${u.checked?"on":"off"})`:""}`),children:[e(d,{slot:"trigger",children:"Options"}),r(o,{slot:"content",children:[e(o,{role:"menuitemcheckbox","aria-checked":"true","data-value":"show-grid",tabIndex:-1,children:"Show grid"}),e(o,{role:"menuitemcheckbox","aria-checked":"false","data-value":"snap",tabIndex:-1,children:"Snap to guides"}),e(o,{className:"separator",role:"separator"}),e(o,{role:"menuitemradio","data-group":"mode","aria-checked":"true","data-value":"mode-edit",tabIndex:-1,children:"Mode: Edit"}),e(o,{role:"menuitemradio","data-group":"mode","aria-checked":"false","data-value":"mode-read",tabIndex:-1,children:"Mode: Read"})]})]}),r(o,{style:{marginTop:10,fontSize:13,color:"var(--ui-color-muted, #64748b)"},children:["Last action: ",s]})]})},P=()=>{const{referenceRef:s,floatingRef:c,getReferenceProps:u,getFloatingProps:B,coords:x}=me({placement:"bottom",offset:6});return r(o,{style:{padding:80},children:[e("button",{...u(),ref:s,style:{padding:"8px 12px",borderRadius:8,border:"1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))",background:"var(--ui-color-surface, #ffffff)",color:"var(--ui-color-text, #0f172a)"},children:"Headless trigger"}),e(o,{...B(),ref:c,style:{position:"absolute",top:x.top,left:x.left,pointerEvents:"auto"},children:r(o,{style:{background:"var(--ui-color-surface, #ffffff)",color:"var(--ui-color-text, #0f172a)",border:"1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))",borderRadius:6,boxShadow:"var(--ui-shadow-md, 0 8px 30px rgba(2,6,23,0.12))",minWidth:160},role:"menu",children:[e(o,{role:"menuitem",tabIndex:-1,style:{padding:8},children:"First (headless)"}),e(o,{role:"menuitem",tabIndex:-1,style:{padding:8},children:"Second"}),e(o,{role:"menuitem",tabIndex:-1,style:{padding:8},children:"Third"})]})})]})},M=()=>{const[s,c]=ie.useState("light");return e(ge,{tokens:s==="light"?{colors:{primary:"#0f766e",surface:"#ffffff",surfaceAlt:"#f8fafc",text:"#0f172a",muted:"#64748b",border:"rgba(15, 23, 42, 0.16)",focusRing:"#0f766e",success:"#15803d",warning:"#b45309",danger:"#b91c1c"}}:{colors:{primary:"#38bdf8",surface:"#0f172a",surfaceAlt:"#111c33",text:"#e2e8f0",muted:"#94a3b8",border:"#334155",focusRing:"#7dd3fc",success:"#22c55e",warning:"#f59e0b",danger:"#f87171"}},children:r(o,{style:{padding:32,background:"var(--ui-color-background, #ffffff)",color:"var(--ui-color-text, #0f172a)"},children:[r(Flex,{style:{display:"flex",gap:8,marginBottom:12},children:[e(d,{size:"sm",onClick:()=>c("light"),children:"Light Tokens"}),e(d,{size:"sm",variant:"secondary",onClick:()=>c("dark"),children:"Dark Tokens"})]}),r(f,{open:!0,variant:"soft",elevation:"low",shape:"soft",children:[e(d,{slot:"trigger",children:"Themed Dropdown"}),e(h,{})]})]})})};var K,U,J;S.parameters={...S.parameters,docs:{...(K=S.parameters)==null?void 0:K.docs,source:{originalSource:`(args: any) => <Box style={{
  padding: 60
}}>
    <Dropdown open={args.open} placement={args.placement} variant={args.variant} density={args.density} shape={args.shape} elevation={args.elevation} tone={args.tone} closeOnSelect={args.closeOnSelect} typeahead={args.typeahead} style={{
    ["--ui-dropdown-menu-padding" as any]: "0px",
    ["--ui-dropdown-menu-radius" as any]: "0px",
    ["--ui-dropdown-menu-border" as any]: "0",
    ["--ui-dropdown-menu-shadow" as any]: "none"
  }}>
      <Button slot="trigger">Open dropdown</Button>
      <MenuContent />
    </Dropdown>
  </Box>`,...(J=(U=S.parameters)==null?void 0:U.docs)==null?void 0:J.source}}};var Q,X,Y;C.parameters={...C.parameters,docs:{...(Q=C.parameters)==null?void 0:Q.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))',
  gap: 16,
  padding: 20
}}>
    <Box style={cardStyle}>
      <strong>Soft Default</strong>
      <Box style={{
      marginTop: 10
    }}>
        <Dropdown open shape="soft" placement="bottom">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={cardStyle}>
      <strong>Square Flat</strong>
      <Box style={{
      marginTop: 10
    }}>
        <Dropdown open shape="square" variant="flat" elevation="none" density="compact">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={cardStyle}>
      <strong>Line / Compact</strong>
      <Box style={{
      marginTop: 10
    }}>
        <Dropdown open variant="line" shape="square" density="compact" tone="warning">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={cardStyle}>
      <strong>Solid Comfortable</strong>
      <Box style={{
      marginTop: 10
    }}>
        <Dropdown open variant="solid" density="comfortable" elevation="low">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={{
    ...cardStyle,
    background: 'var(--ui-color-surface-alt, #f8fafc)'
  }}>
      <strong>Glass Surface</strong>
      <Box style={{
      marginTop: 10
    }}>
        <Dropdown open variant="glass" shape="soft" elevation="high">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={cardStyle}>
      <strong>Contrast + Danger Tone</strong>
      <Box style={{
      marginTop: 10
    }}>
        <Dropdown open variant="contrast" tone="danger" elevation="high">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>
  </Grid>`,...(Y=(X=C.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,ne;I.parameters={...I.parameters,docs:{...(Z=I.parameters)==null?void 0:Z.docs,source:{originalSource:`() => {
  const [last, setLast] = React.useState<string>('none');
  return <Box style={{
    padding: 56
  }}>
      <Dropdown open closeOnSelect={false} onSelect={d => setLast(\`\${d.label || d.value || 'item'}\${typeof d.checked === 'boolean' ? \` (\${d.checked ? 'on' : 'off'})\` : ''}\`)}>
        <Button slot="trigger">Options</Button>
        <Box slot="content">
          <Box role="menuitemcheckbox" aria-checked="true" data-value="show-grid" tabIndex={-1}>Show grid</Box>
          <Box role="menuitemcheckbox" aria-checked="false" data-value="snap" tabIndex={-1}>Snap to guides</Box>
          <Box className="separator" role="separator" />
        <Box role="menuitemradio" data-group="mode" aria-checked="true" data-value="mode-edit" tabIndex={-1}>Mode: Edit</Box>
        <Box role="menuitemradio" data-group="mode" aria-checked="false" data-value="mode-read" tabIndex={-1}>Mode: Read</Box>
      </Box>
      </Dropdown>
      <Box style={{
      marginTop: 10,
      fontSize: 13,
      color: 'var(--ui-color-muted, #64748b)'
    }}>Last action: {last}</Box>
    </Box>;
}`,...(ne=(ee=I.parameters)==null?void 0:ee.docs)==null?void 0:ne.source}}};var oe,te,re;P.parameters={...P.parameters,docs:{...(oe=P.parameters)==null?void 0:oe.docs,source:{originalSource:`() => {
  const {
    referenceRef,
    floatingRef,
    getReferenceProps,
    getFloatingProps,
    coords
  } = useFloating({
    placement: 'bottom',
    offset: 6
  });
  return <Box style={{
    padding: 80
  }}>
      <button {...getReferenceProps()} ref={referenceRef as any} style={{
      padding: '8px 12px',
      borderRadius: 8,
      border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
      background: 'var(--ui-color-surface, #ffffff)',
      color: 'var(--ui-color-text, #0f172a)'
    }}>
        Headless trigger
      </button>
      <Box {...getFloatingProps()} ref={floatingRef as any} style={{
      position: 'absolute',
      top: coords.top,
      left: coords.left,
      pointerEvents: 'auto'
    }}>
        <Box style={{
        background: 'var(--ui-color-surface, #ffffff)',
        color: 'var(--ui-color-text, #0f172a)',
        border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
        borderRadius: 6,
        boxShadow: 'var(--ui-shadow-md, 0 8px 30px rgba(2,6,23,0.12))',
        minWidth: 160
      }} role="menu">
          <Box role="menuitem" tabIndex={-1} style={{
          padding: 8
        }}>First (headless)</Box>
          <Box role="menuitem" tabIndex={-1} style={{
          padding: 8
        }}>Second</Box>
          <Box role="menuitem" tabIndex={-1} style={{
          padding: 8
        }}>Third</Box>
        </Box>
      </Box>
    </Box>;
}`,...(re=(te=P.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};var ae,se,le;M.parameters={...M.parameters,docs:{...(ae=M.parameters)==null?void 0:ae.docs,source:{originalSource:`() => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const tokens = mode === 'light' ? {
    colors: {
      primary: '#0f766e',
      surface: '#ffffff',
      surfaceAlt: '#f8fafc',
      text: '#0f172a',
      muted: '#64748b',
      border: 'rgba(15, 23, 42, 0.16)',
      focusRing: '#0f766e',
      success: '#15803d',
      warning: '#b45309',
      danger: '#b91c1c'
    }
  } : {
    colors: {
      primary: '#38bdf8',
      surface: '#0f172a',
      surfaceAlt: '#111c33',
      text: '#e2e8f0',
      muted: '#94a3b8',
      border: '#334155',
      focusRing: '#7dd3fc',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#f87171'
    }
  };
  return <ThemeProvider tokens={tokens as any}>
      <Box style={{
      padding: 32,
      background: 'var(--ui-color-background, #ffffff)',
      color: 'var(--ui-color-text, #0f172a)'
    }}>
        <Flex style={{
        display: 'flex',
        gap: 8,
        marginBottom: 12
      }}>
          <Button size="sm" onClick={() => setMode('light')}>Light Tokens</Button>
          <Button size="sm" variant="secondary" onClick={() => setMode('dark')}>Dark Tokens</Button>
        </Flex>
        <Dropdown open variant="soft" elevation="low" shape="soft">
          <Button slot="trigger">Themed Dropdown</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </ThemeProvider>;
}`,...(le=(se=M.parameters)==null?void 0:se.docs)==null?void 0:le.source}}};const Be=["Playground","VisualVariants","PersistentSelection","Headless","ThemeProviderVerification"];export{P as Headless,I as PersistentSelection,S as Playground,M as ThemeProviderVerification,C as VisualVariants,Be as __namedExportsOrder,ve as default};
