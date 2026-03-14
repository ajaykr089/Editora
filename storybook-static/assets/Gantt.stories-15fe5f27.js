import{aw as r,a as s,B as l}from"./index-ce0e40fa.js";import"./index-93f6b7ae.js";import"./index-c197feae.js";const g={title:"UI/Gantt",component:r},p=[{id:"1",label:"Admissions Module",start:"2026-02-01",end:"2026-02-14",progress:88,tone:"success"},{id:"2",label:"Billing Integrations",start:"2026-02-05",end:"2026-02-22",progress:54,tone:"warning"},{id:"3",label:"Staff Scheduling",start:"2026-02-11",end:"2026-02-27",progress:32,tone:"default"},{id:"4",label:"Audit + Compliance",start:"2026-02-15",end:"2026-03-01",progress:22,tone:"danger"}],t=()=>s(l,{style:{maxWidth:860},children:s(r,{tasks:p})}),a=()=>s(l,{variant:"contrast",p:"12px",radius:"lg",style:{maxWidth:860},children:s(r,{tasks:p,variant:"contrast"})});var e,n,o;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`() => <Box style={{
  maxWidth: 860
}}>
    <Gantt tasks={tasks} />
  </Box>`,...(o=(n=t.parameters)==null?void 0:n.docs)==null?void 0:o.source}}};var i,d,c;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`() => <Box variant="contrast" p="12px" radius="lg" style={{
  maxWidth: 860
}}>
    <Gantt tasks={tasks} variant="contrast" />
  </Box>`,...(c=(d=a.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};const f=["Default","Contrast"];export{a as Contrast,t as Default,f as __namedExportsOrder,g as default};
