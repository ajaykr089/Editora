import{aM as r,a as e,B as l,j as n,G as x,F as f}from"./index-ce0e40fa.js";import"./index-93f6b7ae.js";import"./index-c197feae.js";const C={title:"UI/Meter",component:r,argTypes:{value:{control:"number"},min:{control:"number"},max:{control:"number"},low:{control:"number"},high:{control:"number"},optimum:{control:"number"},label:{control:"text"},showLabel:{control:"boolean"},format:{control:"select",options:["value","percent","fraction"]},precision:{control:"number"},size:{control:"select",options:["xs","sm","md","lg"]},variant:{control:"select",options:["default","soft","solid","contrast"]},tone:{control:"select",options:["auto","brand","success","warning","danger","neutral"]},shape:{control:"select",options:["pill","round","square"]},mode:{control:"select",options:["line","circle"]}}},a=b=>e(l,{style:{maxWidth:520},children:e(r,{...b})});a.args={value:68,min:0,max:100,low:35,high:80,label:"Storage health",showLabel:!0,format:"percent",precision:0,size:"md",variant:"default",tone:"auto",shape:"pill",mode:"line"};const o=()=>n(x,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(2, minmax(220px, 1fr))"},children:[n(l,{style:{display:"grid",gap:12},children:[e(r,{value:24,max:100,low:35,high:80,label:"Cluster A",showLabel:!0,format:"percent"}),e(r,{value:57,max:100,low:35,high:80,label:"Cluster B",showLabel:!0,format:"percent"}),e(r,{value:91,max:100,low:35,high:80,label:"Cluster C",showLabel:!0,format:"percent"})]}),n(l,{style:{border:"1px solid var(--ui-color-border, #cbd5e1)",borderRadius:"var(--ui-radius, 12px)",background:"var(--ui-color-surface, #ffffff)",padding:16},children:[e("strong",{children:"Why meter instead of progress"}),e(l,{style:{marginTop:8,color:"var(--ui-color-muted, #64748b)"},children:"Use meter when the value is a measurement or score, not a task moving toward completion. Health, quality, capacity, and quota are meter semantics."})]})]}),t=()=>n(f,{style:{display:"flex",gap:18,flexWrap:"wrap",alignItems:"center"},children:[e(r,{mode:"circle",value:.82,max:1,low:.45,high:.72,optimum:.9,format:"percent",precision:0,label:"Reliability",showLabel:!0}),e(r,{mode:"circle",value:.63,max:1,low:.45,high:.72,optimum:.9,format:"percent",precision:0,label:"Coverage",showLabel:!0,variant:"soft"}),e(r,{mode:"circle",value:.37,max:1,low:.45,high:.72,optimum:.9,format:"percent",precision:0,label:"Risk",showLabel:!0,variant:"contrast"})]});var s,i,c;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`(args: any) => <Box style={{
  maxWidth: 520
}}>
    <Meter {...args} />
  </Box>`,...(c=(i=a.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var m,p,u;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))'
}}>
    <Box style={{
    display: 'grid',
    gap: 12
  }}>
      <Meter value={24} max={100} low={35} high={80} label="Cluster A" showLabel format="percent" />
      <Meter value={57} max={100} low={35} high={80} label="Cluster B" showLabel format="percent" />
      <Meter value={91} max={100} low={35} high={80} label="Cluster C" showLabel format="percent" />
    </Box>
    <Box style={{
    border: '1px solid var(--ui-color-border, #cbd5e1)',
    borderRadius: 'var(--ui-radius, 12px)',
    background: 'var(--ui-color-surface, #ffffff)',
    padding: 16
  }}>
      <strong>Why meter instead of progress</strong>
      <Box style={{
      marginTop: 8,
      color: 'var(--ui-color-muted, #64748b)'
    }}>
        Use meter when the value is a measurement or score, not a task moving toward completion. Health, quality, capacity, and quota are meter semantics.
      </Box>
    </Box>
  </Grid>`,...(u=(p=o.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var d,h,g;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`() => <Flex style={{
  display: 'flex',
  gap: 18,
  flexWrap: 'wrap',
  alignItems: 'center'
}}>
    <Meter mode="circle" value={0.82} max={1} low={0.45} high={0.72} optimum={0.9} format="percent" precision={0} label="Reliability" showLabel />
    <Meter mode="circle" value={0.63} max={1} low={0.45} high={0.72} optimum={0.9} format="percent" precision={0} label="Coverage" showLabel variant="soft" />
    <Meter mode="circle" value={0.37} max={1} low={0.45} high={0.72} optimum={0.9} format="percent" precision={0} label="Risk" showLabel variant="contrast" />
  </Flex>`,...(g=(h=t.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};const B=["Playground","CapacityBands","CircularScores"];export{o as CapacityBands,t as CircularScores,a as Playground,B as __namedExportsOrder,C as default};
