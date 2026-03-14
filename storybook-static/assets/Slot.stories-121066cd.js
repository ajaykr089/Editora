import{al as n,j as a,G as g,a as e,b as k,F as N,B as z}from"./index-c1b18327.js";import{r as t}from"./index-93f6b7ae.js";const q={title:"UI/Slot",component:n},i=()=>{const o=t.useRef(null),[r,l]=t.useState(0),[u,p]=t.useState(!0);return t.useEffect(()=>{const s=o.current;if(!s)return;const f=()=>l(E=>E+1);return s.addEventListener("slotchange",f),()=>s.removeEventListener("slotchange",f)},[]),a(g,{gap:"12px",style:{maxWidth:520},children:[e(k,{size:"sm",variant:"secondary",onClick:()=>p(s=>!s),children:"Toggle slotted content"}),a(N,{align:"center",gap:"8px",children:[e("span",{children:"Document title"}),e(n,{ref:o,name:"badge",variant:"chip",tone:"brand",fallback:"No badge",children:u?e("span",{slot:"badge",style:{padding:"2px 8px",borderRadius:999,background:"#dbeafe",fontSize:12},children:"Beta"}):null})]}),a(z,{style:{fontSize:13,color:"#475569"},children:["slotchange fired: ",r]})]})},c=()=>a(g,{columns:{initial:"1fr",md:"repeat(2, minmax(0, 1fr))"},gap:"12px",style:{maxWidth:680},children:[e(n,{variant:"surface",fallback:"No assignee",children:e("span",{style:{fontSize:12},children:"Assignee: Ava"})}),e(n,{variant:"outline",tone:"warning",fallback:"No due date",children:e("span",{style:{fontSize:12},children:"Due: Tomorrow"})}),e(n,{variant:"soft",tone:"success",fallback:"No status",children:e("span",{style:{fontSize:12},children:"Status: Healthy"})}),e(n,{variant:"contrast",fallback:"No environment",children:e("span",{style:{fontSize:12},children:"Environment: Production"})})]}),d=()=>{const[o,r]=t.useState(!1),[l,u]=t.useState(!1);return a(g,{gap:"12px",style:{maxWidth:480},children:[e(k,{size:"sm",onClick:()=>u(p=>!p),children:l?"Remove content":"Resolve content"}),e(n,{required:!0,name:"status",fallback:"Missing required slot",variant:"outline",tone:"danger",onMissing:()=>r(!1),onResolved:()=>r(!0),children:l?e("span",{slot:"status",children:"Ready"}):null}),a(z,{style:{fontSize:13,color:"#475569"},children:["Required slot resolved: ",o?"yes":"no"]})]})};var m,h,S;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const ref = useRef<HTMLElement | null>(null);
  const [changes, setChanges] = useState(0);
  const [showBadge, setShowBadge] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onSlotChange = () => setChanges(value => value + 1);
    el.addEventListener('slotchange', onSlotChange as EventListener);
    return () => el.removeEventListener('slotchange', onSlotChange as EventListener);
  }, []);
  return <Grid gap="12px" style={{
    maxWidth: 520
  }}>
      <Button size="sm" variant="secondary" onClick={() => setShowBadge(value => !value)}>
        Toggle slotted content
      </Button>

      <Flex align="center" gap="8px">
        <span>Document title</span>
        <Slot ref={ref as any} name="badge" variant="chip" tone="brand" fallback="No badge">
          {showBadge ? <span slot="badge" style={{
          padding: '2px 8px',
          borderRadius: 999,
          background: '#dbeafe',
          fontSize: 12
        }}>
              Beta
            </span> : null}
        </Slot>
      </Flex>

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>slotchange fired: {changes}</Box>
    </Grid>;
}`,...(S=(h=i.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};var v,x,y;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`() => <Grid columns={{
  initial: '1fr',
  md: 'repeat(2, minmax(0, 1fr))'
} as any} gap="12px" style={{
  maxWidth: 680
}}>
    <Slot variant="surface" fallback="No assignee">
      <span style={{
      fontSize: 12
    }}>Assignee: Ava</span>
    </Slot>

    <Slot variant="outline" tone="warning" fallback="No due date">
      <span style={{
      fontSize: 12
    }}>Due: Tomorrow</span>
    </Slot>

    <Slot variant="soft" tone="success" fallback="No status">
      <span style={{
      fontSize: 12
    }}>Status: Healthy</span>
    </Slot>

    <Slot variant="contrast" fallback="No environment">
      <span style={{
      fontSize: 12
    }}>Environment: Production</span>
    </Slot>
  </Grid>`,...(y=(x=c.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var b,R,B;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`() => {
  const [resolved, setResolved] = useState(false);
  const [value, setValue] = useState(false);
  return <Grid gap="12px" style={{
    maxWidth: 480
  }}>
      <Button size="sm" onClick={() => setValue(current => !current)}>
        {value ? 'Remove content' : 'Resolve content'}
      </Button>

      <Slot required name="status" fallback="Missing required slot" variant="outline" tone="danger" onMissing={() => setResolved(false)} onResolved={() => setResolved(true)}>
        {value ? <span slot="status">Ready</span> : null}
      </Slot>

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Required slot resolved: {resolved ? 'yes' : 'no'}
      </Box>
    </Grid>;
}`,...(B=(R=d.parameters)==null?void 0:R.docs)==null?void 0:B.source}}};const G=["NamedSlot","VisualModes","RequiredState"];export{i as NamedSlot,d as RequiredState,c as VisualModes,G as __namedExportsOrder,q as default};
