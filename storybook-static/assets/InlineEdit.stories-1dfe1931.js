import{aA as t,j as u,B as c,a}from"./index-ce0e40fa.js";import{R as n}from"./index-93f6b7ae.js";import"./index-c197feae.js";const g={title:"UI/InlineEdit",component:t},e=()=>{const[o,s]=n.useState("Q2 Incident Review"),[d,m]=n.useState("Summarize the operational learnings and remediation follow-up for the release train.");return u(c,{style:{display:"grid",gap:18,maxWidth:720},children:[a(t,{value:o,placeholder:"Untitled note",onValueChange:s}),a(t,{multiline:!0,value:d,placeholder:"Add summary",onValueChange:m})]})};var r,i,l;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`() => {
  const [title, setTitle] = React.useState('Q2 Incident Review');
  const [summary, setSummary] = React.useState('Summarize the operational learnings and remediation follow-up for the release train.');
  return <Box style={{
    display: 'grid',
    gap: 18,
    maxWidth: 720
  }}>
      <InlineEdit value={title} placeholder="Untitled note" onValueChange={setTitle} />
      <InlineEdit multiline value={summary} placeholder="Add summary" onValueChange={setSummary} />
    </Box>;
}`,...(l=(i=e.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const S=["EditorialCard"];export{e as EditorialCard,S as __namedExportsOrder,g as default};
