import{bp as t,a as s,B as b,j as v,G as x}from"./index-ce0e40fa.js";import{r as l}from"./index-93f6b7ae.js";import"./index-c197feae.js";const h={title:"UI/TagsInput",component:t,argTypes:{label:{control:"text"},description:{control:"text"},placeholder:{control:"text"},required:{control:"boolean"},disabled:{control:"boolean"},readOnly:{control:"boolean"},counter:{control:"boolean"},maxTags:{control:"number"},allowDuplicates:{control:"boolean"},addOnBlur:{control:"boolean"}}},e=n=>{const[a,o]=l.useState(["design","ops"]);return s(b,{style:{maxWidth:560},children:s(t,{...n,value:a,onChange:o})})};e.args={label:"Owners",description:"Add recipients, labels, or reviewer groups.",placeholder:"Add an owner",required:!1,disabled:!1,readOnly:!1,counter:!0,maxTags:6,allowDuplicates:!1,addOnBlur:!0};const r=()=>{const[n,a]=l.useState(["ops","security","platform"]),[o,g]=l.useState(["p0","incident","customer-visible"]);return v(x,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(2, minmax(280px, 1fr))"},children:[s(t,{label:"Incident reviewers",description:"Fast keyboard entry for multi-owner assignment.",value:n,onChange:a,maxTags:8,counter:!0,addOnBlur:!0}),s(t,{label:"Saved search filters",description:"Tokenized filters without dropdown dependence.",value:o,onChange:g,counter:!0})]})};var i,d,u;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`(args: any) => {
  const [value, setValue] = useState<string[]>(['design', 'ops']);
  return <Box style={{
    maxWidth: 560
  }}>
      <TagsInput {...args} value={value} onChange={setValue} />
    </Box>;
}`,...(u=(d=e.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var c,p,m;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const [reviewers, setReviewers] = useState(['ops', 'security', 'platform']);
  const [filters, setFilters] = useState(['p0', 'incident', 'customer-visible']);
  return <Grid style={{
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))'
  }}>
      <TagsInput label="Incident reviewers" description="Fast keyboard entry for multi-owner assignment." value={reviewers} onChange={setReviewers} maxTags={8} counter addOnBlur />
      <TagsInput label="Saved search filters" description="Tokenized filters without dropdown dependence." value={filters} onChange={setFilters} counter />
    </Grid>;
}`,...(m=(p=r.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};const T=["Playground","ProductionPatterns"];export{e as Playground,r as ProductionPatterns,T as __namedExportsOrder,h as default};
