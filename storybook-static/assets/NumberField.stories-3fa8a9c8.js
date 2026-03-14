import{aP as t,a as e,j as a,B as u,G as B}from"./index-ce0e40fa.js";import{r as p}from"./index-93f6b7ae.js";import{S as F,a as m,b as N,c as h,s as k,d as P}from"./storybook-showcase-2b62d73c.js";import"./index-c197feae.js";const O={title:"UI/NumberField",component:t,argTypes:{value:{control:"text"},min:{control:"number"},max:{control:"number"},step:{control:"number"},precision:{control:"number"},locale:{control:"text"},format:{control:"select",options:["grouped","plain"]},placeholder:{control:"text"},label:{control:"text"},description:{control:"text"},required:{control:"boolean"},disabled:{control:"boolean"},readOnly:{control:"boolean"},allowWheel:{control:"boolean"},showSteppers:{control:"boolean"},clampOnBlur:{control:"boolean"}}},o=r=>{const[s,c]=p.useState(12500);return e(F,{eyebrow:"Numeric Entry",title:"Number fields should feel precise, native, and stable under fast keyboard interaction",description:"These stories validate spinbutton semantics, formatting, validation states, and whether the control still looks composed inside serious enterprise forms.",meta:[{label:"Locale",value:r.locale},{label:"Step",value:`${r.step}`},{label:"Steppers",value:r.showSteppers?"Visible":"Hidden"}],children:e(m,{eyebrow:"Primary Pattern",title:"Budget ceiling",description:"The base story should demonstrate strong label hierarchy, precise step behavior, and enough context for the value to feel operational rather than generic.",children:a(u,{style:{maxWidth:640,display:"grid",gap:16},children:[a("div",{style:N,children:[e("span",{style:h,children:"Locale-aware"}),e("span",{style:h,children:"Stepper-integrated"}),e("span",{style:h,children:"Clamp on blur"})]}),e(t,{...r,value:s??"",onValueChange:d=>c(d.value),prefix:"USD"}),a(u,{style:k,children:[e("strong",{style:{color:"#0f172a"},children:"Live value"}),e(u,{style:{color:"#64748b",fontSize:13},children:s==null?"empty":s.toLocaleString("en-US")})]})]})})})};o.args={label:"Monthly budget ceiling",description:"Locale-aware number entry with spinbutton semantics.",min:0,max:1e5,step:250,precision:0,locale:"en-US",format:"grouped",placeholder:"0",showSteppers:!0,clampOnBlur:!0,allowWheel:!0};const i=()=>{const[r,s]=p.useState(18e3),[c,d]=p.useState(12.5),[T,V]=p.useState(350);return e(m,{eyebrow:"Dashboard Row",title:"Finance controls",description:"A realistic field row should keep numeric inputs visually aligned while still showing distinct prefixes, suffixes, and ranges.",children:a(B,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(3, minmax(220px, 1fr))"},children:[e(t,{label:"Spend limit",description:"Hard ceiling for campaign automation.",value:r??"",min:0,max:5e4,step:500,prefix:"USD",showSteppers:!0,onValueChange:n=>s(n.value)}),e(t,{label:"Safety buffer",description:"Percent headroom before throttling.",value:c??"",min:0,max:100,step:.5,precision:1,suffix:"%",showSteppers:!0,onValueChange:n=>d(n.value)}),e(t,{label:"Ops throughput",description:"Expected tasks processed per hour.",value:T??"",min:50,max:1e3,step:25,suffix:"req/h",showSteppers:!0,onValueChange:n=>V(n.value)})]})})},l=()=>a(m,{eyebrow:"State Coverage",title:"Validation and policy states",description:"The component should preserve hierarchy and legibility across required, readonly, error, and disabled states without collapsing into inconsistent spacing.",children:[a(B,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(2, minmax(240px, 1fr))"},children:[e(t,{label:"Incident threshold",description:"Escalate after this many failures.",value:"5",min:1,max:12,step:1,showSteppers:!0,required:!0}),e(t,{label:"Reserved capacity",description:"This value is locked by policy.",value:"2500",prefix:"GB",readOnly:!0,showSteppers:!0}),e(t,{label:"Quota floor",description:"Demonstrates inline error messaging.",value:"0",min:10,max:100,error:"Value must be at least 10.",showSteppers:!0}),e(t,{label:"Archive batch size",description:"Control disabled during background migration.",value:"400",suffix:"items",disabled:!0,showSteppers:!0})]}),e("p",{style:P,children:"Error, readonly, and disabled states should still feel like part of the same product system."})]});var b,g,y;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`(args: any) => {
  const [current, setCurrent] = useState<number | null>(12500);
  return <ShowcasePage eyebrow="Numeric Entry" title="Number fields should feel precise, native, and stable under fast keyboard interaction" description="These stories validate spinbutton semantics, formatting, validation states, and whether the control still looks composed inside serious enterprise forms." meta={[{
    label: 'Locale',
    value: args.locale
  }, {
    label: 'Step',
    value: \`\${args.step}\`
  }, {
    label: 'Steppers',
    value: args.showSteppers ? 'Visible' : 'Hidden'
  }]}>
      <ShowcaseSection eyebrow="Primary Pattern" title="Budget ceiling" description="The base story should demonstrate strong label hierarchy, precise step behavior, and enough context for the value to feel operational rather than generic.">
        <Box style={{
        maxWidth: 640,
        display: 'grid',
        gap: 16
      }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Locale-aware</span>
            <span style={showcaseChipStyle}>Stepper-integrated</span>
            <span style={showcaseChipStyle}>Clamp on blur</span>
          </div>
          <NumberField {...args} value={current ?? ''} onValueChange={detail => setCurrent(detail.value)} prefix="USD" />
          <Box style={showcasePanelStyle}>
            <strong style={{
            color: '#0f172a'
          }}>Live value</strong>
            <Box style={{
            color: '#64748b',
            fontSize: 13
          }}>
              {current == null ? 'empty' : current.toLocaleString('en-US')}
            </Box>
          </Box>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>;
}`,...(y=(g=o.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var f,S,w;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`() => {
  const [limit, setLimit] = useState<number | null>(18000);
  const [buffer, setBuffer] = useState<number | null>(12.5);
  const [throughput, setThroughput] = useState<number | null>(350);
  return <ShowcaseSection eyebrow="Dashboard Row" title="Finance controls" description="A realistic field row should keep numeric inputs visually aligned while still showing distinct prefixes, suffixes, and ranges.">
      <Grid style={{
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))'
    }}>
        <NumberField label="Spend limit" description="Hard ceiling for campaign automation." value={limit ?? ''} min={0} max={50000} step={500} prefix="USD" showSteppers onValueChange={detail => setLimit(detail.value)} />
        <NumberField label="Safety buffer" description="Percent headroom before throttling." value={buffer ?? ''} min={0} max={100} step={0.5} precision={1} suffix="%" showSteppers onValueChange={detail => setBuffer(detail.value)} />
        <NumberField label="Ops throughput" description="Expected tasks processed per hour." value={throughput ?? ''} min={50} max={1000} step={25} suffix="req/h" showSteppers onValueChange={detail => setThroughput(detail.value)} />
      </Grid>
    </ShowcaseSection>;
}`,...(w=(S=i.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var v,x,C;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="State Coverage" title="Validation and policy states" description="The component should preserve hierarchy and legibility across required, readonly, error, and disabled states without collapsing into inconsistent spacing.">
    <Grid style={{
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))'
  }}>
      <NumberField label="Incident threshold" description="Escalate after this many failures." value="5" min={1} max={12} step={1} showSteppers required />
      <NumberField label="Reserved capacity" description="This value is locked by policy." value="2500" prefix="GB" readOnly showSteppers />
      <NumberField label="Quota floor" description="Demonstrates inline error messaging." value="0" min={10} max={100} error="Value must be at least 10." showSteppers />
      <NumberField label="Archive batch size" description="Control disabled during background migration." value="400" suffix="items" disabled showSteppers />
    </Grid>
    <p style={showcaseCaptionStyle}>Error, readonly, and disabled states should still feel like part of the same product system.</p>
  </ShowcaseSection>`,...(C=(x=l.parameters)==null?void 0:x.docs)==null?void 0:C.source}}};const U=["Playground","FinanceControls","ValidationStates"];export{i as FinanceControls,o as Playground,l as ValidationStates,U as __namedExportsOrder,O as default};
