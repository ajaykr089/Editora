import{q as a,j as o,G as C,a as e,B as i,g as D}from"./index-c1b18327.js";import{R as c}from"./index-93f6b7ae.js";const B={title:"UI/Textarea",component:a,argTypes:{value:{control:"text"},placeholder:{control:"text"},clearable:{control:"boolean"},debounce:{control:"number"},validation:{control:{type:"radio",options:["none","error","success"]}},size:{control:{type:"radio",options:["1","2","3","sm","md","lg"]}},rows:{control:{type:"number",min:2,max:12,step:1}},maxlength:{control:"number"},resize:{control:{type:"radio",options:["none","vertical","horizontal","both"]}},variant:{control:{type:"radio",options:["classic","surface","soft","filled","ghost","contrast"]}},disabled:{control:"boolean"},readOnly:{control:"boolean"}}},S=t=>e(a,{...t}),r=S.bind({});r.args={value:"",placeholder:"Write a release summary for stakeholders...",clearable:!0,debounce:250,validation:"none",rows:4,resize:"vertical",variant:"surface",size:"md"};const n=()=>{const[t,T]=c.useState("Release candidate notes..."),[R,z]=c.useState("Release candidate notes...");return o(C,{gap:"10px",style:{maxWidth:560},children:[e(a,{value:t,clearable:!0,debounce:320,rows:5,variant:"soft",label:"Release notes",description:"Debounced output updates after 320ms",onInput:T,onDebouncedInput:z}),o(i,{variant:"surface",p:"10px",style:{fontSize:13,color:"#475569"},children:[o("div",{children:[e("strong",{children:"Live:"})," ",t||"(empty)"]}),o("div",{children:[e("strong",{children:"Debounced:"})," ",R||"(empty)"]})]})]})},s=()=>o(C,{gap:"12px",style:{maxWidth:620},children:[e(a,{label:"Change reason",description:"Required for audit trails",maxlength:160,showCount:!0,validation:"error",value:"",placeholder:"Describe what changed and why...",clearable:!0,children:e(i,{slot:"error",children:"Please provide a clear reason before publishing."})}),e(a,{label:"Internal context",description:"Autosize grows up to 8 rows",autosize:!0,maxRows:8,rows:3,showCount:!0,maxlength:600,variant:"filled",tone:"success",placeholder:"Add operational context for support and QA teams..."})]}),l=()=>e(D,{tokens:{colors:{background:"#020617",surface:"#0f172a",text:"#e2e8f0",primary:"#93c5fd",border:"rgba(148, 163, 184, 0.38)"}},children:e(i,{bg:"var(--ui-color-background)",p:"14px",radius:"lg",style:{maxWidth:640},children:e(a,{variant:"contrast",size:"lg",rows:4,label:"Command center note",description:"High-contrast operational annotation",placeholder:"Type a runtime directive...",showCount:!0,maxlength:220})})});var d,u,p;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:"(args: any) => <Textarea {...args} />",...(p=(u=r.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var m,h,b;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState('Release candidate notes...');
  const [debounced, setDebounced] = React.useState('Release candidate notes...');
  return <Grid gap="10px" style={{
    maxWidth: 560
  }}>
      <Textarea value={value} clearable debounce={320} rows={5} variant="soft" label="Release notes" description="Debounced output updates after 320ms" onInput={setValue} onDebouncedInput={setDebounced} />

      <Box variant="surface" p="10px" style={{
      fontSize: 13,
      color: '#475569'
    }}>
        <div><strong>Live:</strong> {value || '(empty)'}</div>
        <div><strong>Debounced:</strong> {debounced || '(empty)'}</div>
      </Box>
    </Grid>;
}`,...(b=(h=n.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var g,x,v;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`() => <Grid gap="12px" style={{
  maxWidth: 620
}}>
    <Textarea label="Change reason" description="Required for audit trails" maxlength={160} showCount validation="error" value="" placeholder="Describe what changed and why..." clearable>
      <Box slot="error">Please provide a clear reason before publishing.</Box>
    </Textarea>

    <Textarea label="Internal context" description="Autosize grows up to 8 rows" autosize maxRows={8} rows={3} showCount maxlength={600} variant="filled" tone="success" placeholder="Add operational context for support and QA teams..." />
  </Grid>`,...(v=(x=s.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var f,y,w;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`() => <ThemeProvider tokens={{
  colors: {
    background: '#020617',
    surface: '#0f172a',
    text: '#e2e8f0',
    primary: '#93c5fd',
    border: 'rgba(148, 163, 184, 0.38)'
  }
}}>
    <Box bg="var(--ui-color-background)" p="14px" radius="lg" style={{
    maxWidth: 640
  }}>
      <Textarea variant="contrast" size="lg" rows={4} label="Command center note" description="High-contrast operational annotation" placeholder="Type a runtime directive..." showCount maxlength={220} />
    </Box>
  </ThemeProvider>`,...(w=(y=l.parameters)==null?void 0:y.docs)==null?void 0:w.source}}};const k=["Playground","ControlledWithDebounce","ValidationAndCounter","ContrastVariant"];export{l as ContrastVariant,n as ControlledWithDebounce,r as Playground,s as ValidationAndCounter,k as __namedExportsOrder,B as default};
