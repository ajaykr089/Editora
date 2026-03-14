import{a3 as t,a as e,B as c,j as r,G as g,F as b,t as i,l as S,b as n}from"./index-ce0e40fa.js";import{R as v}from"./index-93f6b7ae.js";import{A as C,T as j,q as U,r as V,s as f,t as x,R as W,c as J,b as N}from"./icons-b73c9b18.js";/* empty css              *//* empty css                */import"./index-c197feae.js";const ee={title:"UI/Chart",component:t,argTypes:{type:{control:"select",options:["line","area","step","scatter","bar","donut","radial"]},variant:{control:"select",options:["default","contrast","minimal"]},state:{control:"select",options:["idle","loading","error","success"]},interactive:{control:"boolean"},showLegend:{control:"boolean"},showSummary:{control:"boolean"},disabled:{control:"boolean"}}},l=[{label:"Mon",value:182},{label:"Tue",value:214},{label:"Wed",value:201},{label:"Thu",value:236},{label:"Fri",value:263},{label:"Sat",value:191},{label:"Sun",value:208}],O=[{label:"Jan",value:12},{label:"Feb",value:-4},{label:"Mar",value:8},{label:"Apr",value:16},{label:"May",value:-2},{label:"Jun",value:10}],R=[{label:"Inpatient",value:42,tone:"#2563eb"},{label:"Outpatient",value:33,tone:"#16a34a"},{label:"Pharmacy",value:15,tone:"#d97706"},{label:"Labs",value:10,tone:"#dc2626"}];function _(){const[s,o]=v.useState("idle"),[E,d]=v.useState("line"),[G,F]=v.useState(l);return r(g,{style:{gap:16,maxInlineSize:1100},children:[e(c,{variant:"gradient",tone:"brand",radius:"xl",p:"16px",style:{display:"grid",gap:10},children:r(b,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:[r("div",{children:[e("div",{style:{fontWeight:700,fontSize:18},children:"Enterprise Care Analytics"}),e("div",{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13,marginTop:4},children:"Throughput, margin variance, and service allocation in one operational view."})]}),r(b,{align:"center",style:{gap:8,color:"var(--ui-color-muted, #64748b)",fontSize:12},children:[e(C,{size:14}),"Real-time stream"]})]})}),r(g,{style:{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))"},children:[e(c,{style:{display:"grid",gap:8},children:e(t,{type:E,title:"Patient Throughput",subtitle:"Visits per day",data:G,state:s,showLegend:!0,showSummary:!0,onPointSelect:a=>{i.info(`${a.label}: ${a.value} visits`,{duration:900,theme:"light"})}})}),e(c,{style:{display:"grid",gap:8},children:e(t,{type:"bar",title:"Monthly Margin Variance",subtitle:"Positive and negative movement",data:O,state:s==="error"?"error":"idle",onPointSelect:a=>{(a.value<0?"error":"success")==="error"?i.error(`${a.label}: ${a.value}%`,{duration:900,theme:"light"}):i.success(`${a.label}: +${a.value}%`,{duration:900,theme:"light"})}})}),e(c,{style:{display:"grid",gap:8},children:e(t,{type:"donut",title:"Service Allocation",subtitle:"Current distribution",data:R,state:s==="loading"?"loading":"success",onPointSelect:a=>{i.info(`${a.label} share selected`,{duration:900,theme:"light"})}})})]}),r(b,{align:"center",style:{gap:8,flexWrap:"wrap"},children:[r(S,{tone:"brand",children:[e(j,{size:12}),"+14.8% weekly throughput"]}),r(S,{tone:"warning",children:[e(U,{size:12}),"-2.1% margin variance risk"]}),e(n,{size:"sm",variant:"secondary",startIcon:e(V,{size:14}),onClick:()=>d("line"),children:"Line"}),e(n,{size:"sm",variant:"secondary",startIcon:e(f,{size:14}),onClick:()=>d("step"),children:"Step"}),e(n,{size:"sm",variant:"secondary",startIcon:e(C,{size:14}),onClick:()=>d("scatter"),children:"Scatter"}),e(n,{size:"sm",variant:"secondary",startIcon:e(f,{size:14}),onClick:()=>d("bar"),children:"Bar"}),e(n,{size:"sm",variant:"secondary",startIcon:e(x,{size:14}),onClick:()=>d("donut"),children:"Donut"}),e(n,{size:"sm",variant:"secondary",startIcon:e(x,{size:14}),onClick:()=>d("radial"),children:"Radial"}),e(n,{size:"sm",variant:"secondary",startIcon:e(W,{size:14}),onClick:()=>{o("loading"),i.loading("Syncing chart stream...",{duration:900,theme:"light"}),window.setTimeout(()=>{F(a=>a.map(y=>({...y,value:Math.max(40,Math.round(y.value+(Math.random()*24-12)))}))),o("idle"),i.success("Chart data refreshed",{duration:1e3,theme:"light"})},900)},children:"Refresh Data"}),e(n,{size:"sm",variant:"secondary",startIcon:e(J,{size:14}),onClick:()=>{o("error"),i.error("Feed degraded: fallback dataset active",{duration:1200,theme:"light"})},children:"Simulate Error"}),e(n,{size:"sm",startIcon:e(N,{size:14}),onClick:()=>{o("success"),i.success("Pipeline healthy and synchronized",{duration:1200,theme:"light"})},children:"Mark Healthy"})]})]})}const p=_,q=s=>e(c,{style:{maxInlineSize:860},children:e(t,{...s,title:"Playground Throughput",subtitle:"Use controls to test chart states",data:l,onPointSelect:o=>{i.info(`${o.label}: ${o.value}`,{duration:800,theme:"light"})}})}),u=q.bind({});u.args={type:"line",variant:"default",state:"idle",interactive:!0,showLegend:!0,showSummary:!0,disabled:!1};const h=()=>e(c,{variant:"contrast",p:"12px",radius:"lg",children:r(g,{style:{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))"},children:[e(t,{variant:"contrast",type:"area",title:"Night Shift Throughput",subtitle:"Last 7 days",data:l.map(s=>({...s,value:Math.round(s.value*.72)})),state:"success"}),e(t,{variant:"contrast",type:"donut",title:"Incident Categories",subtitle:"Current month",data:[{label:"API",value:14,tone:"#93c5fd"},{label:"DB",value:7,tone:"#34d399"},{label:"Infra",value:4,tone:"#fbbf24"}]})]})}),m=()=>r(g,{style:{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))"},children:[e(t,{type:"line",title:"Line",subtitle:"Daily trend",data:l}),e(t,{type:"area",title:"Area",subtitle:"Volume envelope",data:l}),e(t,{type:"step",title:"Step",subtitle:"Discrete changes",data:l}),e(t,{type:"scatter",title:"Scatter",subtitle:"Point distribution",data:l}),e(t,{type:"bar",title:"Bar",subtitle:"Category compare",data:l}),e(t,{type:"donut",title:"Donut",subtitle:"Share split",data:R}),e(t,{type:"radial",title:"Radial",subtitle:"Multi-axis spread",data:l})]});var I,z,T;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:"EnterpriseChartDashboard",...(T=(z=p.parameters)==null?void 0:z.docs)==null?void 0:T.source}}};var P,w,A;u.parameters={...u.parameters,docs:{...(P=u.parameters)==null?void 0:P.docs,source:{originalSource:`(args: Record<string, unknown>) => <Box style={{
  maxInlineSize: 860
}}>
    <Chart {...args} title="Playground Throughput" subtitle="Use controls to test chart states" data={throughputSeries} onPointSelect={detail => {
    toastAdvanced.info(\`\${detail.label}: \${detail.value}\`, {
      duration: 800,
      theme: 'light'
    });
  }} />
  </Box>`,...(A=(w=u.parameters)==null?void 0:w.docs)==null?void 0:A.source}}};var k,B,D;h.parameters={...h.parameters,docs:{...(k=h.parameters)==null?void 0:k.docs,source:{originalSource:`() => <Box variant="contrast" p="12px" radius="lg">
    <Grid style={{
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
  }}>
      <Chart variant="contrast" type="area" title="Night Shift Throughput" subtitle="Last 7 days" data={throughputSeries.map(item => ({
      ...item,
      value: Math.round(item.value * 0.72)
    }))} state="success" />
      <Chart variant="contrast" type="donut" title="Incident Categories" subtitle="Current month" data={[{
      label: 'API',
      value: 14,
      tone: '#93c5fd'
    }, {
      label: 'DB',
      value: 7,
      tone: '#34d399'
    }, {
      label: 'Infra',
      value: 4,
      tone: '#fbbf24'
    }]} />
    </Grid>
  </Box>`,...(D=(B=h.parameters)==null?void 0:B.docs)==null?void 0:D.source}}};var M,$,L;m.parameters={...m.parameters,docs:{...(M=m.parameters)==null?void 0:M.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
}}>
    <Chart type="line" title="Line" subtitle="Daily trend" data={throughputSeries} />
    <Chart type="area" title="Area" subtitle="Volume envelope" data={throughputSeries} />
    <Chart type="step" title="Step" subtitle="Discrete changes" data={throughputSeries} />
    <Chart type="scatter" title="Scatter" subtitle="Point distribution" data={throughputSeries} />
    <Chart type="bar" title="Bar" subtitle="Category compare" data={throughputSeries} />
    <Chart type="donut" title="Donut" subtitle="Share split" data={allocationSeries} />
    <Chart type="radial" title="Radial" subtitle="Multi-axis spread" data={throughputSeries} />
  </Grid>`,...(L=($=m.parameters)==null?void 0:$.docs)==null?void 0:L.source}}};const te=["EnterpriseAnalytics","Playground","Contrast","AllTypes"];export{m as AllTypes,h as Contrast,p as EnterpriseAnalytics,u as Playground,te as __namedExportsOrder,ee as default};
