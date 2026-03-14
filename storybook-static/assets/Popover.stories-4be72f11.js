import{aX as i,a as e,B as t,j as n,b as p,F as P}from"./index-ce0e40fa.js";import"./index-93f6b7ae.js";import"./index-c197feae.js";const H={title:"UI/Popover",component:i,args:{placement:"bottom",offset:8,closeOnEscape:!0,closeOnOutside:!0}},r=o=>e(t,{style:{padding:60},children:n(i,{...o,children:[e(p,{slot:"trigger",children:"Show popover"}),n(t,{slot:"content",style:{padding:8},children:["Popover content with ",e("strong",{children:"HTML"})]})]})}),s=()=>{const{referenceRef:o,floatingRef:k,getReferenceProps:F,getFloatingProps:R,coords:d,toggle:O,open:S}=require("@editora/ui-react").useFloating({placement:"bottom",offset:8});return n(t,{style:{padding:80,position:"relative"},children:[e("button",{...F(),ref:o,style:{padding:"8px 12px"},children:"Anchor (headless)"}),e(t,{...R(),ref:k,style:{position:"absolute",top:d.top,left:d.left,pointerEvents:"auto"},children:n(t,{style:{padding:8,background:"#fff",border:"1px solid #e6e6e6",borderRadius:6,boxShadow:"0 8px 30px rgba(2,6,23,0.08)"},children:[n(P,{style:{display:"flex",gap:8,alignItems:"center"},children:[e("strong",{children:"Headless panel"}),e("em",{style:{color:"#666"},children:d.placement}),e(t,{style:{marginLeft:"auto"},children:e("button",{onClick:()=>O(),children:S?"Close":"Open"})})]}),e(t,{style:{marginTop:8},children:"Use Arrow keys and Escape — keyboard helpers are wired by the headless hook."})]})})]})},a=()=>n(t,{style:{padding:24},children:[n("p",{children:["Click the button near the right edge to trigger ",e("code",{children:"shift"})," and watch the arrow animate."]}),e(t,{style:{position:"relative",height:140},children:e(t,{style:{position:"absolute",right:8,top:40},children:n(i,{children:[e(p,{slot:"trigger",children:"Edge trigger"}),e(t,{slot:"content",style:{padding:12,width:220},children:"This popover uses arrow + shift — it should stay on-screen and the arrow will move smoothly."})]})})})]}),l=()=>e(P,{style:{display:"flex",gap:24,flexWrap:"wrap",padding:60},children:["top","right","bottom-start","left-end"].map(o=>n(i,{placement:o,offset:12,closeOnOutside:!0,children:[e(p,{slot:"trigger",children:o}),n(t,{slot:"content",style:{padding:10,minWidth:180},children:["Placement: ",e("strong",{children:o})]})]},o))});var c,g,h;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`(args: any) => <Box style={{
  padding: 60
}}>
    <Popover {...args}>
      <Button slot="trigger">Show popover</Button>
      <Box slot="content" style={{
      padding: 8
    }}>Popover content with <strong>HTML</strong></Box>
    </Popover>
  </Box>`,...(h=(g=r.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var u,f,m;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`() => {
  const {
    referenceRef,
    floatingRef,
    getReferenceProps,
    getFloatingProps,
    coords,
    toggle,
    open
  } = require('@editora/ui-react').useFloating({
    placement: 'bottom',
    offset: 8
  });
  return <Box style={{
    padding: 80,
    position: 'relative'
  }}>
      <button {...getReferenceProps()} ref={referenceRef as any} style={{
      padding: '8px 12px'
    }}>Anchor (headless)</button>
      <Box {...getFloatingProps()} ref={floatingRef as any} style={{
      position: 'absolute',
      top: coords.top,
      left: coords.left,
      pointerEvents: 'auto'
    }}>
        <Box style={{
        padding: 8,
        background: '#fff',
        border: '1px solid #e6e6e6',
        borderRadius: 6,
        boxShadow: '0 8px 30px rgba(2,6,23,0.08)'
      }}>
          <Flex style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}>
            <strong>Headless panel</strong>
            <em style={{
            color: '#666'
          }}>{coords.placement}</em>
            <Box style={{
            marginLeft: 'auto'
          }}><button onClick={() => toggle()}>{open ? 'Close' : 'Open'}</button></Box>
          </Flex>
          <Box style={{
          marginTop: 8
        }}>Use Arrow keys and Escape — keyboard helpers are wired by the headless hook.</Box>
        </Box>
      </Box>
    </Box>;
}`,...(m=(f=s.parameters)==null?void 0:f.docs)==null?void 0:m.source}}};var x,y,B;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`() => <Box style={{
  padding: 24
}}>
    <p>Click the button near the right edge to trigger <code>shift</code> and watch the arrow animate.</p>
    <Box style={{
    position: 'relative',
    height: 140
  }}>
      <Box style={{
      position: 'absolute',
      right: 8,
      top: 40
    }}>
        <Popover>
          <Button slot="trigger">Edge trigger</Button>
          <Box slot="content" style={{
          padding: 12,
          width: 220
        }}>This popover uses arrow + shift — it should stay on-screen and the arrow will move smoothly.</Box>
        </Popover>
      </Box>
    </Box>
  </Box>`,...(B=(y=a.parameters)==null?void 0:y.docs)==null?void 0:B.source}}};var b,w,v;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`() => <Flex style={{
  display: 'flex',
  gap: 24,
  flexWrap: 'wrap',
  padding: 60
}}>
    {(['top', 'right', 'bottom-start', 'left-end'] as const).map(placement => <Popover key={placement} placement={placement} offset={12} closeOnOutside>
        <Button slot="trigger">{placement}</Button>
        <Box slot="content" style={{
      padding: 10,
      minWidth: 180
    }}>
          Placement: <strong>{placement}</strong>
        </Box>
      </Popover>)}
  </Flex>`,...(v=(w=l.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};const T=["Default","Headless","ArrowAndShift","PlacementMatrix"];export{a as ArrowAndShift,r as Default,s as Headless,l as PlacementMatrix,T as __namedExportsOrder,H as default};
