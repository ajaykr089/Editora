import{b5 as a,j as s,G as g,F as G,a as e,b as i,B as o}from"./index-ce0e40fa.js";import{R as p}from"./index-93f6b7ae.js";import"./index-c197feae.js";const I={title:"UI/Progress",component:a,argTypes:{value:{control:{type:"number",min:0,max:100,step:1}},buffer:{control:{type:"number",min:0,max:100,step:1}},max:{control:{type:"number",min:1,max:200,step:1}},variant:{control:"select",options:["default","solid","soft","line","glass","contrast"]},tone:{control:"select",options:["brand","success","warning","danger","info","neutral"]},size:{control:"select",options:["xs","sm","md","lg"]},shape:{control:"select",options:["pill","round","square"]},mode:{control:"select",options:["line","circle"]},format:{control:"select",options:["percent","value","fraction"]},showLabel:{control:"boolean"},striped:{control:"boolean"},animated:{control:"boolean"},indeterminate:{control:"boolean"}}},t=n=>{const[f,b]=p.useState(Number(n.value)||32),[h,x]=p.useState(Number(n.buffer)||48),l=Number(n.max)||100,[v,y]=p.useState([]);return s(g,{style:{display:"grid",gap:12,maxWidth:620},children:[s(G,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[e(i,{size:"sm",variant:"secondary",onClick:()=>b(r=>Math.max(0,r-10)),children:"-10 value"}),e(i,{size:"sm",onClick:()=>b(r=>Math.min(l,r+10)),children:"+10 value"}),e(i,{size:"sm",variant:"secondary",onClick:()=>x(r=>Math.max(0,r-10)),children:"-10 buffer"}),e(i,{size:"sm",onClick:()=>x(r=>Math.min(l,r+10)),children:"+10 buffer"})]}),e(a,{value:f,buffer:h,max:l,format:n.format,showLabel:n.showLabel,striped:n.striped,animated:n.animated,indeterminate:n.indeterminate,variant:n.variant,size:n.size,shape:n.shape,mode:n.mode,tone:n.tone,onValueChange:r=>y(m=>[`change -> ${r.value.toFixed(0)} / ${r.max.toFixed(0)}`,...m].slice(0,4)),onComplete:r=>y(m=>[`complete -> ${r.value.toFixed(0)} / ${r.max.toFixed(0)}`,...m].slice(0,4))}),s(o,{style:{fontSize:13,color:"#475569"},children:["value: ",f," / ",l," | buffer: ",h]}),e(o,{style:{fontSize:12,color:"#64748b"},children:v.length?v.join(" | "):"No events yet"})]})};t.args={value:32,buffer:48,max:100,variant:"default",tone:"brand",size:"md",shape:"pill",mode:"line",format:"percent",showLabel:!0,striped:!1,animated:!1,indeterminate:!1};const d=()=>s(g,{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(260px, 1fr))",gap:14,maxWidth:760},children:[s(o,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:12},children:[e("strong",{children:"Soft + Brand"}),e(a,{value:56,showLabel:!0,format:"percent",tone:"brand",variant:"soft"})]}),s(o,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:12},children:[e("strong",{children:"Solid + Success"}),e(a,{value:72,showLabel:!0,format:"value",tone:"success",variant:"solid"})]}),s(o,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:12},children:[e("strong",{children:"Line + Warning + Striped"}),e(a,{value:41,showLabel:!0,striped:!0,tone:"warning",variant:"line"})]}),s(o,{style:{border:"1px solid #1f2937",borderRadius:12,padding:12,background:"#0f172a",color:"#e2e8f0"},children:[e("strong",{children:"Contrast + Danger"}),e(a,{value:88,showLabel:!0,tone:"danger",variant:"contrast"})]}),s(o,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:12,background:"linear-gradient(135deg, #f8fafc, #eef2ff)"},children:[e("strong",{children:"Glass + Info"}),e(a,{value:34,buffer:62,showLabel:!0,tone:"info",variant:"glass"})]}),s(o,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:12},children:[e("strong",{children:"Indeterminate"}),e(a,{indeterminate:!0,tone:"neutral",showLabel:!0,label:"Processing..."})]})]}),u=()=>s(g,{style:{display:"grid",gap:10,maxWidth:680},children:[e(a,{value:28,size:"xs",shape:"square",showLabel:!0,label:"xs + square"}),e(a,{value:42,size:"sm",shape:"round",showLabel:!0,label:"sm + round"}),e(a,{value:63,size:"md",shape:"pill",showLabel:!0,label:"md + pill"}),e(a,{value:81,size:"lg",shape:"pill",showLabel:!0,label:"lg + pill"})]}),c=()=>s(G,{style:{display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"},children:[e(a,{mode:"circle",value:24,size:"sm",tone:"info",showLabel:!0}),e(a,{mode:"circle",value:56,size:"md",tone:"brand",variant:"soft",showLabel:!0}),e(a,{mode:"circle",value:82,size:"lg",tone:"success",variant:"solid",showLabel:!0}),e(a,{mode:"circle",indeterminate:!0,size:"md",tone:"warning",label:"Loading",showLabel:!0})]});var w,L,z;t.parameters={...t.parameters,docs:{...(w=t.parameters)==null?void 0:w.docs,source:{originalSource:`(args: any) => {
  const [value, setValue] = React.useState(Number(args.value) || 32);
  const [buffer, setBuffer] = React.useState(Number(args.buffer) || 48);
  const max = Number(args.max) || 100;
  const [events, setEvents] = React.useState<string[]>([]);
  return <Grid style={{
    display: 'grid',
    gap: 12,
    maxWidth: 620
  }}>
      <Flex style={{
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Button size="sm" variant="secondary" onClick={() => setValue(v => Math.max(0, v - 10))}>-10 value</Button>
        <Button size="sm" onClick={() => setValue(v => Math.min(max, v + 10))}>+10 value</Button>
        <Button size="sm" variant="secondary" onClick={() => setBuffer(v => Math.max(0, v - 10))}>-10 buffer</Button>
        <Button size="sm" onClick={() => setBuffer(v => Math.min(max, v + 10))}>+10 buffer</Button>
      </Flex>

      <Progress value={value} buffer={buffer} max={max} format={args.format} showLabel={args.showLabel} striped={args.striped} animated={args.animated} indeterminate={args.indeterminate} variant={args.variant} size={args.size} shape={args.shape} mode={args.mode} tone={args.tone} onValueChange={detail => setEvents(prev => [\`change -> \${detail.value.toFixed(0)} / \${detail.max.toFixed(0)}\`, ...prev].slice(0, 4))} onComplete={detail => setEvents(prev => [\`complete -> \${detail.value.toFixed(0)} / \${detail.max.toFixed(0)}\`, ...prev].slice(0, 4))} />

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        value: {value} / {max} | buffer: {buffer}
      </Box>
      <Box style={{
      fontSize: 12,
      color: '#64748b'
    }}>
        {events.length ? events.join(' | ') : 'No events yet'}
      </Box>
    </Grid>;
}`,...(z=(L=t.parameters)==null?void 0:L.docs)==null?void 0:z.source}}};var B,S,P;d.parameters={...d.parameters,docs:{...(B=d.parameters)==null?void 0:B.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))',
  gap: 14,
  maxWidth: 760
}}>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12
  }}>
      <strong>Soft + Brand</strong>
      <Progress value={56} showLabel format="percent" tone="brand" variant="soft" />
    </Box>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12
  }}>
      <strong>Solid + Success</strong>
      <Progress value={72} showLabel format="value" tone="success" variant="solid" />
    </Box>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12
  }}>
      <strong>Line + Warning + Striped</strong>
      <Progress value={41} showLabel striped tone="warning" variant="line" />
    </Box>
    <Box style={{
    border: '1px solid #1f2937',
    borderRadius: 12,
    padding: 12,
    background: '#0f172a',
    color: '#e2e8f0'
  }}>
      <strong>Contrast + Danger</strong>
      <Progress value={88} showLabel tone="danger" variant="contrast" />
    </Box>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12,
    background: 'linear-gradient(135deg, #f8fafc, #eef2ff)'
  }}>
      <strong>Glass + Info</strong>
      <Progress value={34} buffer={62} showLabel tone="info" variant="glass" />
    </Box>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12
  }}>
      <strong>Indeterminate</strong>
      <Progress indeterminate tone="neutral" showLabel label="Processing..." />
    </Box>
  </Grid>`,...(P=(S=d.parameters)==null?void 0:S.docs)==null?void 0:P.source}}};var C,R,F;u.parameters={...u.parameters,docs:{...(C=u.parameters)==null?void 0:C.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 10,
  maxWidth: 680
}}>
    <Progress value={28} size="xs" shape="square" showLabel label="xs + square" />
    <Progress value={42} size="sm" shape="round" showLabel label="sm + round" />
    <Progress value={63} size="md" shape="pill" showLabel label="md + pill" />
    <Progress value={81} size="lg" shape="pill" showLabel label="lg + pill" />
  </Grid>`,...(F=(R=u.parameters)==null?void 0:R.docs)==null?void 0:F.source}}};var M,k,W;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`() => <Flex style={{
  display: 'flex',
  gap: 20,
  flexWrap: 'wrap',
  alignItems: 'center'
}}>
    <Progress mode="circle" value={24} size="sm" tone="info" showLabel />
    <Progress mode="circle" value={56} size="md" tone="brand" variant="soft" showLabel />
    <Progress mode="circle" value={82} size="lg" tone="success" variant="solid" showLabel />
    <Progress mode="circle" indeterminate size="md" tone="warning" label="Loading" showLabel />
  </Flex>`,...(W=(k=c.parameters)==null?void 0:k.docs)==null?void 0:W.source}}};const j=["Playground","VisualModes","SizeShapeMatrix","CircularModes"];export{c as CircularModes,t as Playground,u as SizeShapeMatrix,d as VisualModes,j as __namedExportsOrder,I as default};
