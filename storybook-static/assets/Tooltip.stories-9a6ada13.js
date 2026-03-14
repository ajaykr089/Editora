import{av as e,a as t,b as o,j as p,F as d,B as M}from"./index-c1b18327.js";import{R as O}from"./index-93f6b7ae.js";const D={title:"UI/Tooltip",component:e,argTypes:{text:{control:"text"},placement:{control:"select",options:["top","right","bottom","left"]},variant:{control:"select",options:["default","soft","contrast","minimal"]},trigger:{control:"text"}}},a=n=>t(e,{text:n.text,placement:n.placement||"top",variant:n.variant||"default",trigger:n.trigger||"hover focus",children:t(o,{size:"sm",children:"Hover me"})});a.args={text:"Helpful tooltip text",placement:"top",variant:"default",trigger:"hover focus"};const s=()=>p(d,{gap:"14px",align:"center",wrap:"wrap",style:{padding:20},children:[t(e,{text:"Default tooltip",variant:"default",children:t(o,{size:"sm",children:"Default"})}),t(e,{text:"Soft accent tooltip",variant:"soft",children:t(o,{size:"sm",children:"Soft"})}),t(e,{text:"High contrast tooltip",variant:"contrast",children:t(o,{size:"sm",children:"Contrast"})}),t(e,{text:"Minimal tooltip",variant:"minimal",children:t(o,{size:"sm",children:"Minimal"})}),t(e,{text:"Success state",tone:"success",children:t(o,{size:"sm",children:"Success"})}),t(e,{text:"Warning state",tone:"warning",children:t(o,{size:"sm",children:"Warning"})}),t(e,{text:"Danger state",tone:"danger",children:t(o,{size:"sm",children:"Danger"})})]}),r=()=>p(d,{gap:"20px",align:"center",justify:"center",style:{padding:40},children:[t(e,{text:"Top",placement:"top",children:t(o,{size:"sm",children:"Top"})}),t(e,{text:"Right",placement:"right",children:t(o,{size:"sm",children:"Right"})}),t(e,{text:"Bottom",placement:"bottom",children:t(o,{size:"sm",children:"Bottom"})}),t(e,{text:"Left",placement:"left",children:t(o,{size:"sm",children:"Left"})})]}),i=()=>{const[n,c]=O.useState(!1);return p(M,{style:{padding:24,display:"grid",gap:12},children:[p(d,{gap:"10px",children:[t(o,{size:"sm",onClick:()=>c(!0),children:"Open"}),t(o,{size:"sm",variant:"secondary",onClick:()=>c(!1),children:"Close"})]}),t(e,{text:"Manually controlled tooltip",open:n,trigger:"manual",onOpenChange:c,children:t(o,{size:"sm",children:"Manual trigger target"})})]})},l=()=>t(M,{style:{padding:30},children:t(e,{text:"Headless tooltip",headless:!0,children:t("button",{style:{padding:"8px 10px",borderRadius:8,border:"1px solid #cbd5e1",background:"white"},children:"Headless trigger"})})});var m,u,g;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`(args: any) => <Tooltip text={args.text} placement={args.placement || 'top'} variant={args.variant || 'default'} trigger={args.trigger || 'hover focus'}>
    <Button size="sm">Hover me</Button>
  </Tooltip>`,...(g=(u=a.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var x,h,B;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`() => <Flex gap="14px" align="center" wrap="wrap" style={{
  padding: 20
}}>
    <Tooltip text="Default tooltip" variant="default"><Button size="sm">Default</Button></Tooltip>
    <Tooltip text="Soft accent tooltip" variant="soft"><Button size="sm">Soft</Button></Tooltip>
    <Tooltip text="High contrast tooltip" variant="contrast"><Button size="sm">Contrast</Button></Tooltip>
    <Tooltip text="Minimal tooltip" variant="minimal"><Button size="sm">Minimal</Button></Tooltip>
    <Tooltip text="Success state" tone="success"><Button size="sm">Success</Button></Tooltip>
    <Tooltip text="Warning state" tone="warning"><Button size="sm">Warning</Button></Tooltip>
    <Tooltip text="Danger state" tone="danger"><Button size="sm">Danger</Button></Tooltip>
  </Flex>`,...(B=(h=s.parameters)==null?void 0:h.docs)==null?void 0:B.source}}};var f,T,z;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`() => <Flex gap="20px" align="center" justify="center" style={{
  padding: 40
}}>
    <Tooltip text="Top" placement="top"><Button size="sm">Top</Button></Tooltip>
    <Tooltip text="Right" placement="right"><Button size="sm">Right</Button></Tooltip>
    <Tooltip text="Bottom" placement="bottom"><Button size="sm">Bottom</Button></Tooltip>
    <Tooltip text="Left" placement="left"><Button size="sm">Left</Button></Tooltip>
  </Flex>`,...(z=(T=r.parameters)==null?void 0:T.docs)==null?void 0:z.source}}};var v,y,b;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`() => {
  const [open, setOpen] = React.useState(false);
  return <Box style={{
    padding: 24,
    display: 'grid',
    gap: 12
  }}>
      <Flex gap="10px">
        <Button size="sm" onClick={() => setOpen(true)}>Open</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Flex>
      <Tooltip text="Manually controlled tooltip" open={open} trigger="manual" onOpenChange={setOpen}>
        <Button size="sm">Manual trigger target</Button>
      </Tooltip>
    </Box>;
}`,...(b=(y=i.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var S,H,C;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`() => <Box style={{
  padding: 30
}}>
    <Tooltip text="Headless tooltip" headless>
      <button style={{
      padding: '8px 10px',
      borderRadius: 8,
      border: '1px solid #cbd5e1',
      background: 'white'
    }}>
        Headless trigger
      </button>
    </Tooltip>
  </Box>`,...(C=(H=l.parameters)==null?void 0:H.docs)==null?void 0:C.source}}};const F=["Hover","VisualModes","PlacementMatrix","ControlledOpen","Headless"];export{i as ControlledOpen,l as Headless,a as Hover,r as PlacementMatrix,s as VisualModes,F as __namedExportsOrder,D as default};
