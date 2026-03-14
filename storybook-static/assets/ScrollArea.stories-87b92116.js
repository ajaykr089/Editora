import{b9 as c,j as a,G as l,a as e,b as u,B as s}from"./index-ce0e40fa.js";import{r as g}from"./index-93f6b7ae.js";import"./index-c197feae.js";const v={title:"UI/ScrollArea",component:c,argTypes:{orientation:{control:"select",options:["vertical","horizontal","both"]},variant:{control:"select",options:["default","soft","inset","contrast","minimal"]},size:{control:"select",options:["sm","md","lg"]},tone:{control:"select",options:["neutral","brand","info","success","warning","danger"]},autoHide:{control:"boolean"},shadows:{control:"boolean"}}},i=r=>{const t=g.useRef(null),[S,p]=g.useState("Scroll to inspect edge events");return a(l,{style:{display:"grid",gap:12,maxWidth:720},children:[a(l,{style:{display:"grid",gridTemplateColumns:"repeat(3, max-content)",gap:8},children:[e(u,{size:"sm",variant:"secondary",onClick:()=>{var n,o;return(o=(n=t.current)==null?void 0:n.scrollToTop)==null?void 0:o.call(n,"smooth")},children:"Scroll Top"}),e(u,{size:"sm",variant:"secondary",onClick:()=>{var n,o;return(o=(n=t.current)==null?void 0:n.scrollToBottom)==null?void 0:o.call(n,"smooth")},children:"Scroll Bottom"}),e(u,{size:"sm",variant:"secondary",onClick:()=>{var n,o;return(o=(n=t.current)==null?void 0:n.scrollToIndex)==null?void 0:o.call(n,24,"smooth")},children:"Scroll to Row 25"})]}),e(c,{ref:t,orientation:r.orientation,variant:r.variant,size:r.size,tone:r.tone,autoHide:r.autoHide,shadows:r.shadows,style:{maxHeight:220},onScrollChange:n=>{p(`top: ${Math.round(n.scrollTop)}px | left: ${Math.round(n.scrollLeft)}px`)},onReachStart:()=>p("Reached start"),onReachEnd:()=>p("Reached end"),children:Array.from({length:30}).map((n,o)=>a(s,{style:{padding:"10px 12px",borderBottom:"1px solid #e2e8f0"},children:["Activity row #",o+1]},o))}),e(s,{style:{fontSize:13,color:"#475569"},children:S})]})};i.args={orientation:"vertical",variant:"soft",size:"md",tone:"neutral",autoHide:!0,shadows:!0};const d=()=>a(l,{style:{display:"grid",gap:14,maxWidth:760},children:[a(s,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:10},children:[e("strong",{style:{fontSize:13},children:"Horizontal"}),e(c,{orientation:"horizontal",variant:"inset",tone:"brand",style:{maxHeight:110},children:e(l,{style:{display:"grid",gridAutoFlow:"column",gridAutoColumns:"220px",gap:10,padding:8},children:Array.from({length:10}).map((r,t)=>a(s,{style:{border:"1px solid #dbeafe",borderRadius:10,padding:10,background:"#eff6ff"},children:["Card ",t+1]},t))})})]}),a(s,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:10},children:[e("strong",{style:{fontSize:13},children:"Both axes"}),e(c,{orientation:"both",variant:"default",tone:"info",style:{maxHeight:180},children:e(l,{style:{display:"grid",gridTemplateColumns:"repeat(8, 180px)",gap:8,padding:8},children:Array.from({length:24}).map((r,t)=>a(s,{style:{border:"1px solid #bae6fd",borderRadius:8,padding:10,background:"#f0f9ff"},children:["Item ",t+1]},t))})})]})]});var m,h,y;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`(args: any) => {
  const ref = useRef<HTMLElement | null>(null);
  const [status, setStatus] = useState('Scroll to inspect edge events');
  return <Grid style={{
    display: 'grid',
    gap: 12,
    maxWidth: 720
  }}>
      <Grid style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, max-content)',
      gap: 8
    }}>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.scrollToTop?.('smooth')}>
          Scroll Top
        </Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.scrollToBottom?.('smooth')}>
          Scroll Bottom
        </Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.scrollToIndex?.(24, 'smooth')}>
          Scroll to Row 25
        </Button>
      </Grid>

      <ScrollArea ref={ref as any} orientation={args.orientation} variant={args.variant} size={args.size} tone={args.tone} autoHide={args.autoHide} shadows={args.shadows} style={{
      maxHeight: 220
    }} onScrollChange={detail => {
      setStatus(\`top: \${Math.round(detail.scrollTop)}px | left: \${Math.round(detail.scrollLeft)}px\`);
    }} onReachStart={() => setStatus('Reached start')} onReachEnd={() => setStatus('Reached end')}>
        {Array.from({
        length: 30
      }).map((_, idx) => <Box key={idx} style={{
        padding: '10px 12px',
        borderBottom: '1px solid #e2e8f0'
      }}>
            Activity row #{idx + 1}
          </Box>)}
      </ScrollArea>

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>{status}</Box>
    </Grid>;
}`,...(y=(h=i.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var f,x,b;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 14,
  maxWidth: 760
}}>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 10
  }}>
      <strong style={{
      fontSize: 13
    }}>Horizontal</strong>
      <ScrollArea orientation="horizontal" variant="inset" tone="brand" style={{
      maxHeight: 110
    }}>
        <Grid style={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: '220px',
        gap: 10,
        padding: 8
      }}>
          {Array.from({
          length: 10
        }).map((_, idx) => <Box key={idx} style={{
          border: '1px solid #dbeafe',
          borderRadius: 10,
          padding: 10,
          background: '#eff6ff'
        }}>
              Card {idx + 1}
            </Box>)}
        </Grid>
      </ScrollArea>
    </Box>

    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 10
  }}>
      <strong style={{
      fontSize: 13
    }}>Both axes</strong>
      <ScrollArea orientation="both" variant="default" tone="info" style={{
      maxHeight: 180
    }}>
        <Grid style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 180px)',
        gap: 8,
        padding: 8
      }}>
          {Array.from({
          length: 24
        }).map((_, idx) => <Box key={idx} style={{
          border: '1px solid #bae6fd',
          borderRadius: 8,
          padding: 10,
          background: '#f0f9ff'
        }}>
              Item {idx + 1}
            </Box>)}
        </Grid>
      </ScrollArea>
    </Box>
  </Grid>`,...(b=(x=d.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};const R=["Playground","HorizontalAndBoth"];export{d as HorizontalAndBoth,i as Playground,R as __namedExportsOrder,v as default};
