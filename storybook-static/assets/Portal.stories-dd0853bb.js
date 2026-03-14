import{aY as d,j as r,G as R,a as e,F as T,b as v,B as n}from"./index-ce0e40fa.js";import{R as b}from"./index-93f6b7ae.js";import"./index-c197feae.js";const C={title:"UI/Portal",component:d,argTypes:{target:{control:"text"},strategy:{control:"select",options:["append","prepend"]},headless:{control:"boolean"},disabled:{control:"boolean"}}},a=s=>{const[g,k]=b.useState(!0),[c,i]=b.useState([]);return r(R,{style:{display:"grid",gap:12},children:[e(T,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:e(v,{size:"sm",onClick:()=>k(t=>!t),children:g?"Unmount portaled content":"Mount portaled content"})}),r(n,{id:"storybook-portal-target",style:{minHeight:96,padding:12,border:"1px dashed #94a3b8",borderRadius:10,background:"linear-gradient(180deg, #f8fafc, #f1f5f9)"},children:[e("strong",{style:{display:"block",marginBottom:8},children:"Portal target container"}),"Incoming content should render inside this box."]}),g&&e(d,{target:s.target,strategy:s.strategy,headless:s.headless,disabled:s.disabled,onMount:t=>i(o=>[`mount (${t.count})`,...o].slice(0,4)),onUnmount:t=>i(o=>[`unmount (${t.count})`,...o].slice(0,4)),onSync:t=>i(o=>[`sync (${t.count})`,...o].slice(0,4)),onTargetMissing:t=>i(o=>[`target missing: ${t.target}`,...o].slice(0,4)),children:r(n,{style:{padding:10,borderRadius:8,background:"#dbeafe",border:"1px solid #bfdbfe"},children:["This content is rendered by ",e("code",{children:"ui-portal"}),"."]})}),e(n,{style:{fontSize:12,color:"#64748b"},children:c.length?c.join(" | "):"No portal events yet."})]})};a.args={target:"#storybook-portal-target",strategy:"append",headless:!1,disabled:!1};const l=()=>r(R,{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(260px, 1fr))",gap:14},children:[r(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:12},children:[e("strong",{children:"Append Strategy"}),r(n,{id:"portal-append-target",style:{marginTop:8,minHeight:72,padding:10,border:"1px dashed #cbd5e1",borderRadius:8},children:[e(n,{style:{fontSize:12,color:"#64748b",marginBottom:6},children:"Existing content A"}),e(d,{target:"#portal-append-target",strategy:"append",children:e(n,{style:{padding:8,borderRadius:8,background:"#e0f2fe"},children:"Portaled (append)"})})]})]}),r(n,{style:{border:"1px solid #e2e8f0",borderRadius:12,padding:12},children:[e("strong",{children:"Prepend Strategy"}),r(n,{id:"portal-prepend-target",style:{marginTop:8,minHeight:72,padding:10,border:"1px dashed #cbd5e1",borderRadius:8},children:[e(n,{style:{fontSize:12,color:"#64748b",marginBottom:6},children:"Existing content B"}),e(d,{target:"#portal-prepend-target",strategy:"prepend",children:e(n,{style:{padding:8,borderRadius:8,background:"#dcfce7"},children:"Portaled (prepend)"})})]})]})]}),p=()=>e(d,{children:e(n,{style:{position:"fixed",right:20,bottom:20,zIndex:1600,background:"#0f172a",color:"#fff",padding:"8px 10px",borderRadius:8,boxShadow:"0 14px 26px rgba(2, 6, 23, 0.28)"},children:"Portaled to document.body"})});var u,x,y;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`(args: any) => {
  const [show, setShow] = React.useState(true);
  const [log, setLog] = React.useState<string[]>([]);
  return <Grid style={{
    display: 'grid',
    gap: 12
  }}>
      <Flex style={{
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }}>
        <Button size="sm" onClick={() => setShow(v => !v)}>
          {show ? 'Unmount portaled content' : 'Mount portaled content'}
        </Button>
      </Flex>

      <Box id="storybook-portal-target" style={{
      minHeight: 96,
      padding: 12,
      border: '1px dashed #94a3b8',
      borderRadius: 10,
      background: 'linear-gradient(180deg, #f8fafc, #f1f5f9)'
    }}>
        <strong style={{
        display: 'block',
        marginBottom: 8
      }}>Portal target container</strong>
        Incoming content should render inside this box.
      </Box>

      {show && <Portal target={args.target} strategy={args.strategy} headless={args.headless} disabled={args.disabled} onMount={d => setLog(prev => [\`mount (\${d.count})\`, ...prev].slice(0, 4))} onUnmount={d => setLog(prev => [\`unmount (\${d.count})\`, ...prev].slice(0, 4))} onSync={d => setLog(prev => [\`sync (\${d.count})\`, ...prev].slice(0, 4))} onTargetMissing={d => setLog(prev => [\`target missing: \${d.target}\`, ...prev].slice(0, 4))}>
          <Box style={{
        padding: 10,
        borderRadius: 8,
        background: '#dbeafe',
        border: '1px solid #bfdbfe'
      }}>
            This content is rendered by <code>ui-portal</code>.
          </Box>
        </Portal>}

      <Box style={{
      fontSize: 12,
      color: '#64748b'
    }}>{log.length ? log.join(' | ') : 'No portal events yet.'}</Box>
    </Grid>;
}`,...(y=(x=a.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var m,h,f;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))',
  gap: 14
}}>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12
  }}>
      <strong>Append Strategy</strong>
      <Box id="portal-append-target" style={{
      marginTop: 8,
      minHeight: 72,
      padding: 10,
      border: '1px dashed #cbd5e1',
      borderRadius: 8
    }}>
        <Box style={{
        fontSize: 12,
        color: '#64748b',
        marginBottom: 6
      }}>Existing content A</Box>
        <Portal target="#portal-append-target" strategy="append">
          <Box style={{
          padding: 8,
          borderRadius: 8,
          background: '#e0f2fe'
        }}>Portaled (append)</Box>
        </Portal>
      </Box>
    </Box>
    <Box style={{
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 12
  }}>
      <strong>Prepend Strategy</strong>
      <Box id="portal-prepend-target" style={{
      marginTop: 8,
      minHeight: 72,
      padding: 10,
      border: '1px dashed #cbd5e1',
      borderRadius: 8
    }}>
        <Box style={{
        fontSize: 12,
        color: '#64748b',
        marginBottom: 6
      }}>Existing content B</Box>
        <Portal target="#portal-prepend-target" strategy="prepend">
          <Box style={{
          padding: 8,
          borderRadius: 8,
          background: '#dcfce7'
        }}>Portaled (prepend)</Box>
        </Portal>
      </Box>
    </Box>
  </Grid>`,...(f=(h=l.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var B,S,P;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`() => <Portal>
    <Box style={{
    position: 'fixed',
    right: 20,
    bottom: 20,
    zIndex: 1600,
    background: '#0f172a',
    color: '#fff',
    padding: '8px 10px',
    borderRadius: 8,
    boxShadow: '0 14px 26px rgba(2, 6, 23, 0.28)'
  }}>
      Portaled to document.body
    </Box>
  </Portal>`,...(P=(S=p.parameters)==null?void 0:S.docs)==null?void 0:P.source}}};const G=["TargetedPortal","StrategyComparison","BodyPortal"];export{p as BodyPortal,l as StrategyComparison,a as TargetedPortal,G as __namedExportsOrder,C as default};
