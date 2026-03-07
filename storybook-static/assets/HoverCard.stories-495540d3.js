import{a0 as r,j as e,a as n,G as b,B as a}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const v={title:"UI/HoverCard",component:r,argTypes:{delay:{control:{type:"number",min:0,max:1200,step:20}},closeDelay:{control:{type:"number",min:0,max:1200,step:20}},placement:{control:"select",options:["bottom","top","left","right"]},offset:{control:{type:"number",min:0,max:40,step:1}},variant:{control:"select",options:["default","line","glass","contrast","minimal","elevated"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["default","square","soft"]},elevation:{control:"select",options:["default","none","low","high"]}}},d=t=>e(r,{delay:t.delay,closeDelay:t.closeDelay,placement:t.placement,offset:t.offset,variant:t.variant,tone:t.tone,density:t.density,shape:t.shape,elevation:t.elevation,style:{display:"inline-block"},children:[n("button",{style:{padding:"8px 12px"},children:"Hover me"}),e("div",{slot:"card",children:[n("strong",{children:"Editora"}),n("p",{style:{margin:"6px 0 0",fontSize:13,color:"#475569"},children:"Composable editor UI primitives."})]})]});d.args={delay:120,closeDelay:140,placement:"bottom",offset:10,variant:"default",tone:"default",density:"default",shape:"default",elevation:"default"};const o=()=>e(b,{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(260px, 1fr))",gap:16,padding:10},children:[n(a,{style:{padding:14,border:"1px solid #e2e8f0",borderRadius:12},children:e(r,{variant:"line",tone:"brand",placement:"right",closeDelay:180,children:[n("button",{style:{padding:"8px 12px"},children:"Line / Brand"}),e(a,{slot:"card",style:{display:"grid",gap:6},children:[n("strong",{children:"Activity"}),n("span",{children:"Last edited by Priya"}),n("span",{children:"2 minutes ago"})]})]})}),n(a,{style:{padding:14,border:"1px solid #e2e8f0",borderRadius:12,background:"linear-gradient(145deg, #f8fafc, #eef2ff)"},children:e(r,{variant:"glass",shape:"soft",elevation:"high",placement:"left",children:[n("button",{style:{padding:"8px 12px"},children:"Glass / Soft"}),e(a,{slot:"card",style:{display:"grid",gap:6},children:[n("strong",{children:"Workspace"}),n("span",{children:"12 collaborators online"}),n("span",{children:"Theme-safe surface"})]})]})}),n(a,{style:{padding:14,border:"1px solid #e2e8f0",borderRadius:12},children:e(r,{variant:"default",tone:"success",density:"compact",placement:"top",children:[n("button",{style:{padding:"8px 12px"},children:"Compact / Success"}),e(a,{slot:"card",style:{display:"grid",gap:4},children:[n("strong",{children:"Deployment"}),n("span",{children:"Build healthy"}),n("span",{children:"All checks passed"})]})]})}),n(a,{style:{padding:14,border:"1px solid #1e293b",borderRadius:12,background:"#020617",color:"#e2e8f0"},children:e(r,{variant:"contrast",tone:"danger",placement:"bottom",shape:"square",children:[n("button",{style:{padding:"8px 12px"},children:"Contrast / Danger"}),e(a,{slot:"card",style:{display:"grid",gap:6},children:[n("strong",{children:"Critical Action"}),n("span",{children:"This cannot be undone."})]})]})}),n(a,{style:{padding:14,border:"1px dashed #94a3b8",borderRadius:12},children:e(r,{variant:"minimal",tone:"brand",placement:"bottom",children:[n("button",{style:{padding:"8px 12px"},children:"Minimal / Brand"}),e(a,{slot:"card",style:{display:"grid",gap:6},children:[n("strong",{children:"Quick details"}),n("span",{children:"Low-noise compact surface."})]})]})}),n(a,{style:{padding:14,border:"1px solid #e2e8f0",borderRadius:12,background:"linear-gradient(155deg, #f8fafc, #eef2ff)"},children:e(r,{variant:"elevated",tone:"warning",placement:"right",elevation:"high",children:[n("button",{style:{padding:"8px 12px"},children:"Elevated / Warning"}),e(a,{slot:"card",style:{display:"grid",gap:6},children:[n("strong",{children:"Review required"}),n("span",{children:"Premium floating card with depth."})]})]})})]}),s=()=>e(r,{children:[n("span",{tabIndex:0,style:{display:"inline-block",padding:8,borderBottom:"1px dashed #94a3b8"},children:"Product details"}),e(b,{slot:"card",style:{display:"grid",gap:6},children:[e("div",{children:["Release: ",n("strong",{children:"2.0"})]}),n("div",{children:"Support: LTR / RTL"}),n("div",{children:"Theme-ready tokens"})]})]});var i,l,p;d.parameters={...d.parameters,docs:{...(i=d.parameters)==null?void 0:i.docs,source:{originalSource:`(args: any) => <HoverCard delay={args.delay} closeDelay={args.closeDelay} placement={args.placement} offset={args.offset} variant={args.variant} tone={args.tone} density={args.density} shape={args.shape} elevation={args.elevation} style={{
  display: 'inline-block'
}}>
    <button style={{
    padding: '8px 12px'
  }}>Hover me</button>
    <div slot="card">
      <strong>Editora</strong>
      <p style={{
      margin: '6px 0 0',
      fontSize: 13,
      color: '#475569'
    }}>Composable editor UI primitives.</p>
    </div>
  </HoverCard>`,...(p=(l=d.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var c,g,y;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))',
  gap: 16,
  padding: 10
}}>
    <Box style={{
    padding: 14,
    border: '1px solid #e2e8f0',
    borderRadius: 12
  }}>
      <HoverCard variant="line" tone="brand" placement="right" closeDelay={180}>
        <button style={{
        padding: '8px 12px'
      }}>Line / Brand</button>
        <Box slot="card" style={{
        display: 'grid',
        gap: 6
      }}>
          <strong>Activity</strong>
          <span>Last edited by Priya</span>
          <span>2 minutes ago</span>
        </Box>
      </HoverCard>
    </Box>

    <Box style={{
    padding: 14,
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    background: 'linear-gradient(145deg, #f8fafc, #eef2ff)'
  }}>
      <HoverCard variant="glass" shape="soft" elevation="high" placement="left">
        <button style={{
        padding: '8px 12px'
      }}>Glass / Soft</button>
        <Box slot="card" style={{
        display: 'grid',
        gap: 6
      }}>
          <strong>Workspace</strong>
          <span>12 collaborators online</span>
          <span>Theme-safe surface</span>
        </Box>
      </HoverCard>
    </Box>

    <Box style={{
    padding: 14,
    border: '1px solid #e2e8f0',
    borderRadius: 12
  }}>
      <HoverCard variant="default" tone="success" density="compact" placement="top">
        <button style={{
        padding: '8px 12px'
      }}>Compact / Success</button>
        <Box slot="card" style={{
        display: 'grid',
        gap: 4
      }}>
          <strong>Deployment</strong>
          <span>Build healthy</span>
          <span>All checks passed</span>
        </Box>
      </HoverCard>
    </Box>

    <Box style={{
    padding: 14,
    border: '1px solid #1e293b',
    borderRadius: 12,
    background: '#020617',
    color: '#e2e8f0'
  }}>
      <HoverCard variant="contrast" tone="danger" placement="bottom" shape="square">
        <button style={{
        padding: '8px 12px'
      }}>Contrast / Danger</button>
        <Box slot="card" style={{
        display: 'grid',
        gap: 6
      }}>
          <strong>Critical Action</strong>
          <span>This cannot be undone.</span>
        </Box>
      </HoverCard>
    </Box>

    <Box style={{
    padding: 14,
    border: '1px dashed #94a3b8',
    borderRadius: 12
  }}>
      <HoverCard variant="minimal" tone="brand" placement="bottom">
        <button style={{
        padding: '8px 12px'
      }}>Minimal / Brand</button>
        <Box slot="card" style={{
        display: 'grid',
        gap: 6
      }}>
          <strong>Quick details</strong>
          <span>Low-noise compact surface.</span>
        </Box>
      </HoverCard>
    </Box>

    <Box style={{
    padding: 14,
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    background: 'linear-gradient(155deg, #f8fafc, #eef2ff)'
  }}>
      <HoverCard variant="elevated" tone="warning" placement="right" elevation="high">
        <button style={{
        padding: '8px 12px'
      }}>Elevated / Warning</button>
        <Box slot="card" style={{
        display: 'grid',
        gap: 6
      }}>
          <strong>Review required</strong>
          <span>Premium floating card with depth.</span>
        </Box>
      </HoverCard>
    </Box>
  </Grid>`,...(y=(g=o.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var h,u,m;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`() => <HoverCard>
    <span tabIndex={0} style={{
    display: 'inline-block',
    padding: 8,
    borderBottom: '1px dashed #94a3b8'
  }}>Product details</span>
    <Grid slot="card" style={{
    display: 'grid',
    gap: 6
  }}>
      <div>Release: <strong>2.0</strong></div>
      <div>Support: LTR / RTL</div>
      <div>Theme-ready tokens</div>
    </Grid>
  </HoverCard>`,...(m=(u=s.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};const B=["Playground","VisualModes","RichCardContent"];export{d as Playground,s as RichCardContent,o as VisualModes,B as __namedExportsOrder,v as default};
