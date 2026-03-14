import{a9 as g,j as o,G as P,F as h,a as n,b as e,B as y}from"./index-c1b18327.js";import{r as l}from"./index-93f6b7ae.js";const f={title:"UI/PluginPanel",component:g,argTypes:{open:{control:"boolean"},position:{control:"select",options:["right","left","bottom"]}}},t=i=>{const[a,u]=l.useState(!!i.open),[r,s]=l.useState(i.position||"right");return o(P,{style:{display:"grid",gap:12},children:[o(h,{style:{display:"flex",gap:8},children:[n(e,{size:"sm",onClick:()=>u(m=>!m),children:a?"Close panel":"Open panel"}),n(e,{size:"sm",variant:"secondary",onClick:()=>s("right"),children:"Right"}),n(e,{size:"sm",variant:"secondary",onClick:()=>s("left"),children:"Left"}),n(e,{size:"sm",variant:"secondary",onClick:()=>s("bottom"),children:"Bottom"})]}),n(g,{open:a,position:r,children:o(y,{style:{padding:12,minWidth:220},children:[n("strong",{children:"Plugin Panel"}),o("p",{style:{margin:"8px 0 0",color:"#475569"},children:["Position: ",r]})]})})]})};t.args={open:!0,position:"right"};var p,c,d;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`(args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [position, setPosition] = useState(args.position || 'right');
  return <Grid style={{
    display: 'grid',
    gap: 12
  }}>
      <Flex style={{
      display: 'flex',
      gap: 8
    }}>
        <Button size="sm" onClick={() => setOpen(v => !v)}>{open ? 'Close panel' : 'Open panel'}</Button>
        <Button size="sm" variant="secondary" onClick={() => setPosition('right')}>Right</Button>
        <Button size="sm" variant="secondary" onClick={() => setPosition('left')}>Left</Button>
        <Button size="sm" variant="secondary" onClick={() => setPosition('bottom')}>Bottom</Button>
      </Flex>

      <PluginPanel open={open} position={position}>
        <Box style={{
        padding: 12,
        minWidth: 220
      }}>
          <strong>Plugin Panel</strong>
          <p style={{
          margin: '8px 0 0',
          color: '#475569'
        }}>Position: {position}</p>
        </Box>
      </PluginPanel>
    </Grid>;
}`,...(d=(c=t.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};const C=["Default"];export{t as Default,C as __namedExportsOrder,f as default};
