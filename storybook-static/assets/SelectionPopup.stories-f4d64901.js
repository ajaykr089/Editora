import{aj as g,j as s,G as k,F as c,a as n,b as a,B as d}from"./index-c1b18327.js";import{r as m}from"./index-93f6b7ae.js";const C={title:"UI/SelectionPopup",component:g,argTypes:{open:{control:"boolean"},anchorId:{control:"text"},placement:{control:"select",options:["top","bottom","left","right","auto"]},variant:{control:"select",options:["default","surface","soft","glass","contrast"]},size:{control:"select",options:["sm","md","lg"]}}},r=t=>{const[i,o]=m.useState(!!t.open),[e,p]=m.useState("No quick action selected"),h=t.anchorId||"sel-anchor";return s(k,{style:{display:"grid",gap:14},children:[s(c,{style:{display:"flex",gap:8},children:[n(a,{size:"sm",onClick:()=>o(!0),children:"Show popup"}),n(a,{size:"sm",variant:"secondary",onClick:()=>o(!1),children:"Hide popup"})]}),n(d,{id:h,style:{margin:42,padding:18,border:"1px dashed #94a3b8",borderRadius:12,display:"inline-block",background:"#f8fafc"},children:"Highlight this paragraph region to trigger formatting actions."}),n(g,{anchorId:h,open:i,placement:t.placement||"top",variant:t.variant||"glass",size:t.size||"md",arrow:!0,onClose:()=>o(!1),children:s(c,{slot:"content",style:{display:"flex",gap:8},children:[n(a,{size:"sm",onClick:()=>p("Bold applied"),children:"Bold"}),n(a,{size:"sm",variant:"secondary",onClick:()=>p("Comment added"),children:"Comment"}),n(a,{size:"sm",variant:"ghost",onClick:()=>p("Tag created"),children:"Tag"})]})}),n(d,{style:{fontSize:13,color:"#475569"},children:e})]})};r.args={open:!0,anchorId:"sel-anchor",placement:"top",variant:"glass",size:"md"};const l=()=>{const[t,i]=m.useState("top-anchor"),o=[{id:"top-anchor",label:"Top",placement:"top"},{id:"right-anchor",label:"Right",placement:"right"},{id:"bottom-anchor",label:"Bottom",placement:"bottom"},{id:"left-anchor",label:"Left",placement:"left"}];return s(k,{style:{display:"grid",gap:16},children:[n(c,{style:{display:"flex",flexWrap:"wrap",gap:10},children:o.map(e=>n(a,{size:"sm",variant:t===e.id?"primary":"secondary",onClick:()=>i(e.id),children:e.label},e.id))}),n(c,{style:{display:"flex",gap:18,flexWrap:"wrap"},children:o.map(e=>s(d,{id:e.id,style:{minWidth:130,padding:14,borderRadius:10,border:"1px solid #cbd5e1",background:"#ffffff"},children:["Anchor: ",e.label,n(g,{anchorId:e.id,open:t===e.id,placement:e.placement,arrow:!0,variant:e.id==="left-anchor"?"contrast":"soft",tone:e.id==="bottom-anchor"?"success":"brand",closeOnOutside:!0,onClose:()=>i(""),children:s(d,{slot:"content",style:{padding:4,fontSize:12},children:["Popup placement: ",e.placement]})})]},e.id))})]})};var u,f,y;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`(args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [message, setMessage] = useState('No quick action selected');
  const anchorId = args.anchorId || 'sel-anchor';
  return <Grid style={{
    display: 'grid',
    gap: 14
  }}>
      <Flex style={{
      display: 'flex',
      gap: 8
    }}>
        <Button size="sm" onClick={() => setOpen(true)}>Show popup</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Hide popup</Button>
      </Flex>

      <Box id={anchorId} style={{
      margin: 42,
      padding: 18,
      border: '1px dashed #94a3b8',
      borderRadius: 12,
      display: 'inline-block',
      background: '#f8fafc'
    }}>
        Highlight this paragraph region to trigger formatting actions.
      </Box>

      <SelectionPopup anchorId={anchorId} open={open} placement={args.placement || 'top'} variant={args.variant || 'glass'} size={args.size || 'md'} arrow onClose={() => setOpen(false)}>
        <Flex slot="content" style={{
        display: 'flex',
        gap: 8
      }}>
          <Button size="sm" onClick={() => setMessage('Bold applied')}>Bold</Button>
          <Button size="sm" variant="secondary" onClick={() => setMessage('Comment added')}>Comment</Button>
          <Button size="sm" variant="ghost" onClick={() => setMessage('Tag created')}>Tag</Button>
        </Flex>
      </SelectionPopup>

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>{message}</Box>
    </Grid>;
}`,...(y=(f=r.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var x,b,B;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`() => {
  const [openId, setOpenId] = useState('top-anchor');
  const items = [{
    id: 'top-anchor',
    label: 'Top',
    placement: 'top' as const
  }, {
    id: 'right-anchor',
    label: 'Right',
    placement: 'right' as const
  }, {
    id: 'bottom-anchor',
    label: 'Bottom',
    placement: 'bottom' as const
  }, {
    id: 'left-anchor',
    label: 'Left',
    placement: 'left' as const
  }];
  return <Grid style={{
    display: 'grid',
    gap: 16
  }}>
      <Flex style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }}>
        {items.map(item => <Button key={item.id} size="sm" variant={openId === item.id ? 'primary' : 'secondary'} onClick={() => setOpenId(item.id)}>
            {item.label}
          </Button>)}
      </Flex>
      <Flex style={{
      display: 'flex',
      gap: 18,
      flexWrap: 'wrap'
    }}>
        {items.map(item => <Box key={item.id} id={item.id} style={{
        minWidth: 130,
        padding: 14,
        borderRadius: 10,
        border: '1px solid #cbd5e1',
        background: '#ffffff'
      }}>
            Anchor: {item.label}
            <SelectionPopup anchorId={item.id} open={openId === item.id} placement={item.placement} arrow variant={item.id === 'left-anchor' ? 'contrast' : 'soft'} tone={item.id === 'bottom-anchor' ? 'success' : 'brand'} closeOnOutside onClose={() => setOpenId('')}>
              <Box slot="content" style={{
            padding: 4,
            fontSize: 12
          }}>
                Popup placement: {item.placement}
              </Box>
            </SelectionPopup>
          </Box>)}
      </Flex>
    </Grid>;
}`,...(B=(b=l.parameters)==null?void 0:b.docs)==null?void 0:B.source}}};const I=["Default","PlacementMatrix"];export{r as Default,l as PlacementMatrix,I as __namedExportsOrder,C as default};
