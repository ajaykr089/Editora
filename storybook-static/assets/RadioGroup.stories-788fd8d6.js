import{b7 as o,j as n,G as p,a,B as d}from"./index-ce0e40fa.js";import{r as c}from"./index-93f6b7ae.js";import"./index-c197feae.js";const V={title:"UI/RadioGroup",component:o,argTypes:{orientation:{control:"select",options:["vertical","horizontal"]},variant:{control:"select",options:["default","card","segmented"]},size:{control:"select",options:["sm","md","lg"]},tone:{control:"select",options:["brand","neutral","success","warning","danger","info"]},disabled:{control:"boolean"},required:{control:"boolean"}}},r=e=>{const u=c.useMemo(()=>[{value:"draft",label:"Draft",description:"Visible only to team members"},{value:"review",label:"In review",description:"Pending editorial approval"},{value:"published",label:"Published",description:"Publicly available to readers"}],[]),[t,z]=c.useState("draft");return n(p,{style:{display:"grid",gap:12,maxWidth:720},children:[a(o,{value:t,options:u,orientation:e.orientation,variant:e.variant,size:e.size,tone:e.tone,disabled:e.disabled,required:e.required,onValueChange:i=>{i!=null&&i.value&&z(i.value)}}),n(d,{style:{fontSize:13,color:"#475569"},children:["Selected value: ",t]})]})};r.args={orientation:"vertical",variant:"card",size:"md",tone:"brand",disabled:!1,required:!1};const s=()=>{const[e,u]=c.useState("pro");return n(p,{style:{display:"grid",gap:12,maxWidth:620},children:[n(o,{value:e,variant:"segmented",orientation:"horizontal",onValueChange:t=>u(t.value),children:[a("div",{"data-radio":!0,"data-value":"starter","data-description":"For personal projects",children:"Starter"}),a("div",{"data-radio":!0,"data-value":"pro","data-description":"For growing teams",children:"Professional"}),a("div",{"data-radio":!0,"data-value":"enterprise","data-description":"Custom workflows","data-disabled":!0,children:"Enterprise"})]}),n(d,{style:{fontSize:13,color:"#475569"},children:["Selected plan: ",e]})]})},l=()=>n(p,{style:{display:"grid",gap:14,maxWidth:760},children:[n(d,{style:{border:"1px solid #e2e8f0",borderRadius:14,padding:12},children:[a("strong",{style:{fontSize:13},children:"Card + Success"}),a(o,{variant:"card",tone:"success",options:[{value:"a",label:"Automatic backup",description:"Runs every 4 hours"},{value:"b",label:"Manual backup",description:"Trigger from dashboard"}],value:"a"})]}),n(d,{style:{border:"1px solid #e2e8f0",borderRadius:14,padding:12},children:[a("strong",{style:{fontSize:13},children:"Segmented + Horizontal"}),a(o,{variant:"segmented",orientation:"horizontal",size:"sm",tone:"info",options:[{value:"day",label:"Day"},{value:"week",label:"Week"},{value:"month",label:"Month"}],value:"week"})]})]});var v,g,b;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`(args: any) => {
  const options = useMemo(() => [{
    value: 'draft',
    label: 'Draft',
    description: 'Visible only to team members'
  }, {
    value: 'review',
    label: 'In review',
    description: 'Pending editorial approval'
  }, {
    value: 'published',
    label: 'Published',
    description: 'Publicly available to readers'
  }], []);
  const [value, setValue] = useState('draft');
  return <Grid style={{
    display: 'grid',
    gap: 12,
    maxWidth: 720
  }}>
      <RadioGroup value={value} options={options} orientation={args.orientation} variant={args.variant} size={args.size} tone={args.tone} disabled={args.disabled} required={args.required} onValueChange={detail => {
      if (detail?.value) setValue(detail.value);
    }} />
      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>Selected value: {value}</Box>
    </Grid>;
}`,...(b=(g=r.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var m,h,y;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const [value, setValue] = useState('pro');
  return <Grid style={{
    display: 'grid',
    gap: 12,
    maxWidth: 620
  }}>
      <RadioGroup value={value} variant="segmented" orientation="horizontal" onValueChange={detail => setValue(detail.value)}>
        <div data-radio data-value="starter" data-description="For personal projects">Starter</div>
        <div data-radio data-value="pro" data-description="For growing teams">Professional</div>
        <div data-radio data-value="enterprise" data-description="Custom workflows" data-disabled>
          Enterprise
        </div>
      </RadioGroup>

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>Selected plan: {value}</Box>
    </Grid>;
}`,...(y=(h=s.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var f,S,x;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 14,
  maxWidth: 760
}}>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    padding: 12
  }}>
      <strong style={{
      fontSize: 13
    }}>Card + Success</strong>
      <RadioGroup variant="card" tone="success" options={[{
      value: 'a',
      label: 'Automatic backup',
      description: 'Runs every 4 hours'
    }, {
      value: 'b',
      label: 'Manual backup',
      description: 'Trigger from dashboard'
    }]} value="a" />
    </Box>

    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    padding: 12
  }}>
      <strong style={{
      fontSize: 13
    }}>Segmented + Horizontal</strong>
      <RadioGroup variant="segmented" orientation="horizontal" size="sm" tone="info" options={[{
      value: 'day',
      label: 'Day'
    }, {
      value: 'week',
      label: 'Week'
    }, {
      value: 'month',
      label: 'Month'
    }]} value="week" />
    </Box>
  </Grid>`,...(x=(S=l.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};const k=["Playground","LegacySlottedUsage","VisualModes"];export{s as LegacySlottedUsage,r as Playground,l as VisualModes,k as __namedExportsOrder,V as default};
