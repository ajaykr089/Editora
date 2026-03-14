import{j as p,F as g,a as s,b as n,br as m,bs as o,bt as f,bu as v}from"./index-ce0e40fa.js";import"./index-93f6b7ae.js";import"./index-c197feae.js";const k={title:"UI/ToastAPI"},a=()=>p(g,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[s(n,{onClick:()=>m("Saved"),children:"toast()"}),s(n,{variant:"secondary",onClick:()=>o.success("Published"),children:"success()"}),s(n,{variant:"secondary",onClick:()=>o.error("Publish failed"),children:"error()"}),s(n,{variant:"secondary",onClick:()=>o.warning("Storage is almost full"),children:"warning()"}),s(n,{variant:"secondary",onClick:()=>o.info("Background sync started"),children:"info()"})]});function h(){const t=v();return p(g,{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[s(n,{onClick:()=>t.success("Policy saved"),children:"useToast().success"}),s(n,{variant:"secondary",onClick:()=>t.loading("Uploading assets"),children:"useToast().loading"})]})}const r=()=>s(f,{config:{position:"bottom-right",theme:"glass"},children:s(h,{})});var e,i,c;a.parameters={...a.parameters,docs:{...(e=a.parameters)==null?void 0:e.docs,source:{originalSource:`() => <Flex style={{
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
  </Flex>`,...(c=(i=a.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var l,d,u;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`() => <ToastProvider config={{
  position: 'bottom-right',
  theme: 'glass'
}}>
    <ProviderDemoInner />
  </ToastProvider>`,...(u=(d=r.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};const x=["Basic","ProviderPattern"];export{a as Basic,r as ProviderPattern,x as __namedExportsOrder,k as default};
