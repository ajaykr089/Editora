import{T as g,j as o,G as w,a as s,F as m,b as l,B as S}from"./index-c1b18327.js";import{R as r}from"./index-93f6b7ae.js";const I={title:"UI/Toast",component:g},e=()=>{const a=r.useRef(null),[n,T]=r.useState(null),[y,i]=r.useState("none"),d=(t,v=2200)=>{var u;const c=(u=a.current)==null?void 0:u.show(t,{duration:v});c!=null&&T(c)};return o(w,{style:{display:"grid",gap:12},children:[s(g,{ref:a,onShow:t=>i(`show #${t.id}`),onHide:t=>i(`hide #${t.id}`)}),o(m,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[s(l,{onClick:()=>d("Saved successfully"),children:"Show toast"}),s(l,{variant:"secondary",onClick:()=>d("Publishing in progress...",4e3),children:"Show long toast"}),s(l,{variant:"secondary",onClick:()=>{var t;n!=null&&((t=a.current)==null||t.hide(n))},children:"Hide last toast"})]}),o(S,{style:{fontSize:13,color:"#475569"},children:["Last event: ",y," ",n!=null?`(id: ${n})`:""]})]})};var h,f,p;e.parameters={...e.parameters,docs:{...(h=e.parameters)==null?void 0:h.docs,source:{originalSource:`() => {
  const ref = React.useRef<ToastElement | null>(null);
  const [lastToastId, setLastToastId] = React.useState<string | number | null>(null);
  const [lastEvent, setLastEvent] = React.useState<string>('none');
  const showToast = (message: string, duration = 2200) => {
    const id = ref.current?.show(message, {
      duration
    });
    if (id != null) setLastToastId(id);
  };
  return <Grid style={{
    display: 'grid',
    gap: 12
  }}>
      <Toast ref={ref} onShow={detail => setLastEvent(\`show #\${detail.id}\`)} onHide={detail => setLastEvent(\`hide #\${detail.id}\`)} />

      <Flex style={{
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Button onClick={() => showToast('Saved successfully')}>Show toast</Button>
        <Button variant="secondary" onClick={() => showToast('Publishing in progress...', 4000)}>
          Show long toast
        </Button>
        <Button variant="secondary" onClick={() => {
        if (lastToastId != null) ref.current?.hide(lastToastId);
      }}>
          Hide last toast
        </Button>
      </Flex>

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Last event: {lastEvent} {lastToastId != null ? \`(id: \${lastToastId})\` : ''}
      </Box>
    </Grid>;
}`,...(p=(f=e.parameters)==null?void 0:f.docs)==null?void 0:p.source}}};const E=["Playground"];export{e as Playground,E as __namedExportsOrder,I as default};
