import{P as r,j as o,G as P,F as B,a as s,b as x,B as L}from"./index-c1b18327.js";import{r as t}from"./index-93f6b7ae.js";const F={title:"UI/Pagination",component:r,argTypes:{page:{control:{type:"number",min:1,max:50,step:1}},count:{control:{type:"number",min:1,max:50,step:1}}}},e=i=>{const[c,b]=t.useState(Number(i.page)||1),[u,g]=t.useState(Number(i.count)||12),p=t.useRef(null);return t.useEffect(()=>{const n=p.current;if(!n)return;const l=S=>{var m;const d=(m=S.detail)==null?void 0:m.page;typeof d=="number"&&b(d)};return n.addEventListener("change",l),()=>n.removeEventListener("change",l)},[]),o(P,{style:{display:"grid",gap:12},children:[o(B,{style:{display:"flex",gap:8},children:[s(x,{size:"sm",variant:"secondary",onClick:()=>g(n=>Math.max(1,n-1)),children:"- count"}),s(x,{size:"sm",variant:"secondary",onClick:()=>g(n=>n+1),children:"+ count"})]}),s(r,{ref:p,page:String(c),count:String(u)}),o(L,{style:{fontSize:13,color:"#475569"},children:["Page ",c," of ",u]})]})};e.args={page:3,count:12};const a=()=>s(r,{page:"4",count:"18",style:{"--ui-pagination-active-bg":"#0ea5e9","--ui-pagination-radius":"999px","--ui-pagination-padding":"6px 12px"}});var f,y,v;e.parameters={...e.parameters,docs:{...(f=e.parameters)==null?void 0:f.docs,source:{originalSource:`(args: any) => {
  const [page, setPage] = useState(Number(args.page) || 1);
  const [count, setCount] = useState(Number(args.count) || 12);
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleChange = (event: Event) => {
      const next = (event as CustomEvent<{
        page: number;
      }>).detail?.page;
      if (typeof next === 'number') setPage(next);
    };
    el.addEventListener('change', handleChange as EventListener);
    return () => el.removeEventListener('change', handleChange as EventListener);
  }, []);
  return <Grid style={{
    display: 'grid',
    gap: 12
  }}>
      <Flex style={{
      display: 'flex',
      gap: 8
    }}>
        <Button size="sm" variant="secondary" onClick={() => setCount(v => Math.max(1, v - 1))}>- count</Button>
        <Button size="sm" variant="secondary" onClick={() => setCount(v => v + 1)}>+ count</Button>
      </Flex>

      <Pagination ref={ref as any} page={String(page)} count={String(count)} />

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Page {page} of {count}
      </Box>
    </Grid>;
}`,...(v=(y=e.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var h,C,E;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`() => <Pagination page="4" count="18" style={{
  ['--ui-pagination-active-bg' as any]: '#0ea5e9',
  ['--ui-pagination-radius' as any]: '999px',
  ['--ui-pagination-padding' as any]: '6px 12px'
}} />`,...(E=(C=a.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};const G=["Interactive","CustomTokens"];export{a as CustomTokens,e as Interactive,G as __namedExportsOrder,F as default};
