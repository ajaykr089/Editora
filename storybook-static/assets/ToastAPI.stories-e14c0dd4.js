import{j as i,F as c,a,b as n,aq as l,ar as t}from"./index-c1b18327.js";import"./index-93f6b7ae.js";const p={title:"UI/ToastAPI"},s=()=>i(c,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[a(n,{onClick:()=>l("Saved"),children:"toast()"}),a(n,{variant:"secondary",onClick:()=>t.success("Published"),children:"success()"}),a(n,{variant:"secondary",onClick:()=>t.error("Publish failed"),children:"error()"}),a(n,{variant:"secondary",onClick:()=>t.warning("Storage is almost full"),children:"warning()"}),a(n,{variant:"secondary",onClick:()=>t.info("Background sync started"),children:"info()"})]});var o,r,e;s.parameters={...s.parameters,docs:{...(o=s.parameters)==null?void 0:o.docs,source:{originalSource:`() => <Flex style={{
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap'
}}>
    <Button onClick={() => toast('Saved')}>toast()</Button>
    <Button variant="secondary" onClick={() => toastApi.success('Published')}>
      success()
    </Button>
    <Button variant="secondary" onClick={() => toastApi.error('Publish failed')}>
      error()
    </Button>
    <Button variant="secondary" onClick={() => toastApi.warning('Storage is almost full')}>
      warning()
    </Button>
    <Button variant="secondary" onClick={() => toastApi.info('Background sync started')}>
      info()
    </Button>
  </Flex>`,...(e=(r=s.parameters)==null?void 0:r.docs)==null?void 0:e.source}}};const B=["Basic"];export{s as Basic,B as __namedExportsOrder,p as default};
