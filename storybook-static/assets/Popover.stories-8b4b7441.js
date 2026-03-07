import{aa as l,a as e,B as o,j as n,b as m,F as k}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const S={title:"UI/Popover",component:l},t=i=>e(o,{style:{padding:60},children:n(l,{children:[e(m,{slot:"trigger",children:"Show popover"}),n(o,{slot:"content",style:{padding:8},children:["Popover content with ",e("strong",{children:"HTML"})]})]})}),r=()=>{const{referenceRef:i,floatingRef:b,getReferenceProps:B,getFloatingProps:w,coords:a,toggle:v,open:P}=require("@editora/ui-react").useFloating({placement:"bottom",offset:8});return n(o,{style:{padding:80,position:"relative"},children:[e("button",{...B(),ref:i,style:{padding:"8px 12px"},children:"Anchor (headless)"}),e(o,{...w(),ref:b,style:{position:"absolute",top:a.top,left:a.left,pointerEvents:"auto"},children:n(o,{style:{padding:8,background:"#fff",border:"1px solid #e6e6e6",borderRadius:6,boxShadow:"0 8px 30px rgba(2,6,23,0.08)"},children:[n(k,{style:{display:"flex",gap:8,alignItems:"center"},children:[e("strong",{children:"Headless panel"}),e("em",{style:{color:"#666"},children:a.placement}),e(o,{style:{marginLeft:"auto"},children:e("button",{onClick:()=>v(),children:P?"Close":"Open"})})]}),e(o,{style:{marginTop:8},children:"Use Arrow keys and Escape — keyboard helpers are wired by the headless hook."})]})})]})},s=()=>n(o,{style:{padding:24},children:[n("p",{children:["Click the button near the right edge to trigger ",e("code",{children:"shift"})," and watch the arrow animate."]}),e(o,{style:{position:"relative",height:140},children:e(o,{style:{position:"absolute",right:8,top:40},children:n(l,{children:[e(m,{slot:"trigger",children:"Edge trigger"}),e(o,{slot:"content",style:{padding:12,width:220},children:"This popover uses arrow + shift — it should stay on-screen and the arrow will move smoothly."})]})})})]});var d,p,c;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`(args: any) => <Box style={{
  padding: 60
}}>
    <Popover>
      <Button slot="trigger">Show popover</Button>
      <Box slot="content" style={{
      padding: 8
    }}>Popover content with <strong>HTML</strong></Box>
    </Popover>
  </Box>`,...(c=(p=t.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};var g,h,u;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`() => {
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
}`,...(u=(h=r.parameters)==null?void 0:h.docs)==null?void 0:u.source}}};var f,x,y;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`() => <Box style={{
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
  </Box>`,...(y=(x=s.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};const A=["Default","Headless","ArrowAndShift"];export{s as ArrowAndShift,t as Default,r as Headless,A as __namedExportsOrder,S as default};
