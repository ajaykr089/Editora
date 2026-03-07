import{ak as a,j as r,G as v,a as e,B as p}from"./index-c1b18327.js";import{R as x}from"./index-93f6b7ae.js";const N={title:"UI/Slider",component:a,argTypes:{value:{control:{type:"number",min:0,max:100,step:1}},min:{control:{type:"number",min:0,max:100,step:1}},max:{control:{type:"number",min:1,max:200,step:1}},step:{control:{type:"number",min:.1,max:25,step:.1}},range:{control:"boolean"},orientation:{control:"select",options:["horizontal","vertical"]},variant:{control:"select",options:["default","soft","glass","contrast","minimal"]},tone:{control:"select",options:["brand","success","warning","danger"]}}},o=n=>{const[l,s]=x.useState(Number(n.value)||36),i=Number(n.min??0),t=Number(n.max??100);return x.useEffect(()=>{s(G=>Math.max(i,Math.min(t,G)))},[i,t]),r(v,{gap:"12px",style:{maxWidth:420},children:[e(a,{...n,value:l,min:i,max:t,showValue:!0,label:"Saturation",description:"Applies to selected data visualization surfaces.",marks:[0,25,50,75,100],onInput:s}),r(p,{style:{fontSize:13,color:"#475569"},children:["Value: ",l]})]})};o.args={value:36,min:0,max:100,step:1,range:!1,orientation:"horizontal",variant:"glass",tone:"brand"};const d=()=>{const[n,l]=x.useState(20),[s,i]=x.useState(68);return r(v,{gap:"12px",style:{maxWidth:460},children:[e(a,{range:!0,min:0,max:100,step:1,valueStart:n,valueEnd:s,label:"Allowed request window",description:"Select the acceptable request-rate range.",format:"range",variant:"soft",tone:"success",marks:[{value:0,label:"0"},{value:25,label:"25"},{value:50,label:"50"},{value:75,label:"75"},{value:100,label:"100"}],onValueChange:t=>{l(t.valueStart),i(t.valueEnd)}}),r(p,{style:{fontSize:13,color:"#475569"},children:["Current range: ",n," - ",s]})]})},c=()=>r(v,{columns:"repeat(2, minmax(0, 1fr))",gap:"14px",style:{maxWidth:520},children:[e(p,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:14,display:"grid",justifyItems:"center"},children:e(a,{orientation:"vertical",value:58,min:0,max:100,format:"percent",label:"Volume",variant:"default",marks:[0,50,100]})}),e(p,{style:{border:"1px solid #1e293b",borderRadius:12,padding:14,background:"#020617",display:"grid",gap:10},children:e(a,{value:72,min:0,max:100,format:"percent",label:"Latency threshold",description:"Command center mode",variant:"contrast",tone:"warning",marks:[0,25,50,75,100]})})]}),m=()=>e(a,{value:40,min:0,max:100,disabled:!0,label:"Read-only metric",description:"Disabled interaction state"}),u=()=>r(v,{gap:"14px",style:{maxWidth:500},children:[e(a,{value:42,min:0,max:100,label:"Interactive signal threshold",description:"Animated indicator follows active thumb.",variant:"glass",tone:"brand",marks:[0,25,50,75,100]}),e(a,{range:!0,valueStart:28,valueEnd:76,min:0,max:100,format:"range",label:"Range indicator",description:"Start and end indicators animate while active.",variant:"soft",tone:"success"})]});var b,g,S;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`(args: any) => {
  const [value, setValue] = React.useState(Number(args.value) || 36);
  const min = Number(args.min ?? 0);
  const max = Number(args.max ?? 100);
  React.useEffect(() => {
    setValue(current => Math.max(min, Math.min(max, current)));
  }, [min, max]);
  return <Grid gap="12px" style={{
    maxWidth: 420
  }}>
      <Slider {...args} value={value} min={min} max={max} showValue label="Saturation" description="Applies to selected data visualization surfaces." marks={[0, 25, 50, 75, 100]} onInput={setValue} />
      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Value: {value}
      </Box>
    </Grid>;
}`,...(S=(g=o.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var h,f,w;d.parameters={...d.parameters,docs:{...(h=d.parameters)==null?void 0:h.docs,source:{originalSource:`() => {
  const [windowStart, setWindowStart] = React.useState(20);
  const [windowEnd, setWindowEnd] = React.useState(68);
  return <Grid gap="12px" style={{
    maxWidth: 460
  }}>
      <Slider range min={0} max={100} step={1} valueStart={windowStart} valueEnd={windowEnd} label="Allowed request window" description="Select the acceptable request-rate range." format="range" variant="soft" tone="success" marks={[{
      value: 0,
      label: '0'
    }, {
      value: 25,
      label: '25'
    }, {
      value: 50,
      label: '50'
    }, {
      value: 75,
      label: '75'
    }, {
      value: 100,
      label: '100'
    }]} onValueChange={detail => {
      setWindowStart(detail.valueStart);
      setWindowEnd(detail.valueEnd);
    }} />
      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Current range: {windowStart} - {windowEnd}
      </Box>
    </Grid>;
}`,...(w=(f=d.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};var y,E,R;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`() => <Grid columns="repeat(2, minmax(0, 1fr))" gap="14px" style={{
  maxWidth: 520
}}>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 14,
    display: 'grid',
    justifyItems: 'center'
  }}>
      <Slider orientation="vertical" value={58} min={0} max={100} format="percent" label="Volume" variant="default" marks={[0, 50, 100]} />
    </Box>

    <Box style={{
    border: '1px solid #1e293b',
    borderRadius: 12,
    padding: 14,
    background: '#020617',
    display: 'grid',
    gap: 10
  }}>
      <Slider value={72} min={0} max={100} format="percent" label="Latency threshold" description="Command center mode" variant="contrast" tone="warning" marks={[0, 25, 50, 75, 100]} />
    </Box>
  </Grid>`,...(R=(E=c.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};var V,W,k;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:'() => <Slider value={40} min={0} max={100} disabled label="Read-only metric" description="Disabled interaction state" />',...(k=(W=m.parameters)==null?void 0:W.docs)==null?void 0:k.source}}};var A,B,C;u.parameters={...u.parameters,docs:{...(A=u.parameters)==null?void 0:A.docs,source:{originalSource:`() => <Grid gap="14px" style={{
  maxWidth: 500
}}>
    <Slider value={42} min={0} max={100} label="Interactive signal threshold" description="Animated indicator follows active thumb." variant="glass" tone="brand" marks={[0, 25, 50, 75, 100]} />
    <Slider range valueStart={28} valueEnd={76} min={0} max={100} format="range" label="Range indicator" description="Start and end indicators animate while active." variant="soft" tone="success" />
  </Grid>`,...(C=(B=u.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};const j=["Controlled","RangeSelection","VerticalAndContrast","Disabled","AnimatedIndicators"];export{u as AnimatedIndicators,o as Controlled,m as Disabled,d as RangeSelection,c as VerticalAndContrast,j as __namedExportsOrder,N as default};
