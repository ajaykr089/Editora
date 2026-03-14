import{ab as c,j as r,G as C,F as B,a as n,b as g,B as b}from"./index-ce0e40fa.js";import{r as s}from"./index-93f6b7ae.js";import"./index-c197feae.js";const w={title:"UI/Pagination",component:c,argTypes:{page:{control:{type:"number",min:1,max:50,step:1}},count:{control:{type:"number",min:1,max:50,step:1}},variant:{control:"select",options:["classic","flat","outline","solid"]}}},t=a=>{const[l,z]=s.useState(Number(a.page)||1),[p,u]=s.useState(Number(a.count)||12),[G,R]=s.useState("change"),k=s.useRef(null);return r(C,{style:{display:"grid",gap:12},children:[r(B,{style:{display:"flex",gap:8},children:[n(g,{size:"sm",variant:"secondary",onClick:()=>u(e=>Math.max(1,e-1)),children:"- count"}),n(g,{size:"sm",variant:"secondary",onClick:()=>u(e=>e+1),children:"+ count"})]}),n(c,{ref:k,page:l,count:p,variant:a.variant||"classic",onPageChange:e=>{z(e.page),R(e.reason)}}),r(b,{style:{fontSize:13,color:"#475569"},children:["Page ",l," of ",p," • last action: ",G]})]})};t.args={page:3,count:12,variant:"classic"};const o=()=>n(c,{page:4,count:18,variant:"outline",style:{"--ui-pagination-active-bg":"#0ea5e9","--ui-pagination-radius":"999px","--ui-pagination-padding":"6px 12px"}}),i=()=>n(C,{style:{display:"grid",gap:18},children:["classic","flat","outline","solid"].map(a=>r(B,{style:{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"},children:[n(b,{style:{width:72,fontSize:13,color:"#475569",textTransform:"capitalize"},children:a}),n(c,{page:4,count:18,variant:a})]},a))});var d,m,y;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`(args: any) => {
  const [page, setPage] = useState(Number(args.page) || 1);
  const [count, setCount] = useState(Number(args.count) || 12);
  const [lastReason, setLastReason] = useState('change');
  const ref = useRef<any>(null);
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

      <Pagination ref={ref} page={page} count={count} variant={args.variant || 'classic'} onPageChange={detail => {
      setPage(detail.page);
      setLastReason(detail.reason);
    }} />

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Page {page} of {count} • last action: {lastReason}
      </Box>
    </Grid>;
}`,...(y=(m=t.parameters)==null?void 0:m.docs)==null?void 0:y.source}}};var x,f,v;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`() => <Pagination page={4} count={18} variant="outline" style={{
  ['--ui-pagination-active-bg' as any]: '#0ea5e9',
  ['--ui-pagination-radius' as any]: '999px',
  ['--ui-pagination-padding' as any]: '6px 12px'
}} />`,...(v=(f=o.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var h,P,S;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 18
}}>
    {(['classic', 'flat', 'outline', 'solid'] as const).map(variant => <Flex key={variant} style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap'
  }}>
        <Box style={{
      width: 72,
      fontSize: 13,
      color: '#475569',
      textTransform: 'capitalize'
    }}>{variant}</Box>
        <Pagination page={4} count={18} variant={variant} />
      </Flex>)}
  </Grid>`,...(S=(P=i.parameters)==null?void 0:P.docs)==null?void 0:S.source}}};const N=["Interactive","CustomTokens","VariantGallery"];export{o as CustomTokens,t as Interactive,i as VariantGallery,N as __namedExportsOrder,w as default};
