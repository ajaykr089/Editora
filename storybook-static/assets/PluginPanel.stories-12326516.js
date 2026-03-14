import{aW as m,j as e,G as h,F as P,a as n,b as i,B as y}from"./index-ce0e40fa.js";import{r as c}from"./index-93f6b7ae.js";import"./index-c197feae.js";const C={title:"UI/PluginPanel",component:m,argTypes:{open:{control:"boolean"},position:{control:"select",options:["right","left","bottom"]}}},t=a=>{const[l,r]=c.useState(!!a.open),[p,o]=c.useState(a.position||"right");return e(h,{style:{display:"grid",gap:12},children:[e(P,{style:{display:"flex",gap:8},children:[n(i,{size:"sm",onClick:()=>r(s=>!s),children:l?"Close panel":"Open panel"}),n(i,{size:"sm",variant:"secondary",onClick:()=>o("right"),children:"Right"}),n(i,{size:"sm",variant:"secondary",onClick:()=>o("left"),children:"Left"}),n(i,{size:"sm",variant:"secondary",onClick:()=>o("bottom"),children:"Bottom"})]}),n(m,{open:l,position:p,title:"Plugin inspector",description:"Review plugin output and close the panel with the built-in dismiss action.",dismissible:!0,onOpenChange:s=>r(s.open),children:e(y,{style:{padding:12,minWidth:220},children:[n("strong",{children:"Plugin Panel"}),e("p",{style:{margin:"8px 0 0",color:"#475569"},children:["Position: ",p]})]})})]})};t.args={open:!0,position:"right"};var d,u,g;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`(args: any) => {
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

      <PluginPanel open={open} position={position} title="Plugin inspector" description="Review plugin output and close the panel with the built-in dismiss action." dismissible onOpenChange={detail => setOpen(detail.open)}>
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
}`,...(g=(u=t.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};const v=["Default"];export{t as Default,v as __namedExportsOrder,C as default};
