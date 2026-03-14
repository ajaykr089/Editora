import{j as t,G as p,F as c,B as l,a as e,b as a,t as n,c as b,D as x}from"./index-ce0e40fa.js";import{R as m}from"./index-93f6b7ae.js";/* empty css              */import"./index-c197feae.js";const k={title:"AI/Toast SaaS Center"},s=({title:o,value:i,note:d})=>t(l,{variant:"surface",p:"12px",radius:"md",style:{border:"1px solid #e2e8f0",background:"#fff"},children:[e("div",{style:{fontSize:12,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.04em"},children:o}),e("div",{style:{marginTop:6,fontSize:24,fontWeight:700,color:"#0f172a"},children:i}),e("div",{style:{marginTop:6,fontSize:13,color:"#475569"},children:d})]}),y=({open:o,onClose:i})=>e(x,{open:o,title:"Notification Policy Update",description:"Approve notification defaults before rollout.",submitText:"Approve",cancelText:"Cancel",onDialogSubmit:()=>{n.success("Policy approved and published",{theme:"light",duration:1300}),i()},onDialogClose:i,children:e(p,{gap:"8px",children:e(l,{variant:"outline",p:"10px",radius:"sm",color:"#475569",children:"Default position: bottom-right. Max visible: 4. Promise mode enabled."})})}),r={render:()=>{const[o,i]=m.useState(0),[d,u]=m.useState(!1);return t(p,{gap:"14px",style:{maxWidth:1040,margin:"0 auto",padding:8},children:[t(c,{justify:"between",align:"center",wrap:"wrap",gap:"10px",children:[t(l,{children:[e("h2",{style:{margin:0,fontSize:28,color:"#0f172a"},children:"Toast Notification Center"}),e("p",{style:{margin:"6px 0 0 0",color:"#64748b"},children:"SaaS-grade delivery patterns with grouped and promise toasts."})]}),t(c,{gap:"8px",children:[e(a,{onClick:()=>n.promise(new Promise(f=>setTimeout(f,1e3)),{loading:{message:"Publishing release notes...",duration:900},success:{message:"Release notes published",duration:1200},error:{message:"Publish failed"}}),children:"Run Promise Toast"}),e(a,{variant:"secondary",onClick:()=>u(!0),children:"Open Modal"})]})]}),t(p,{columns:{initial:"1fr",md:"1fr 1fr",lg:"1fr 1fr 1fr 1fr"},gap:"10px",children:[e(s,{title:"Toasts Today",value:"248",note:"11 grouped streams"}),e(s,{title:"Errors",value:"6",note:"Auto-retry enabled"}),e(s,{title:"Median TTL",value:"1.4s",note:"Within UX threshold"}),e(s,{title:"Queue Depth",value:"2",note:"No overload risk"})]}),e(l,{variant:"surface",p:"12px",radius:"md",style:{border:"1px solid #e2e8f0"},children:t(b,{selected:o,variant:"soft",onChange:i,children:[e("div",{slot:"tab","data-value":"signal",children:"Signal"}),e("div",{slot:"panel",children:t(c,{gap:"8px",wrap:"wrap",children:[e(a,{size:"sm",onClick:()=>n.success("Deployment healthy",{theme:"light"}),children:"Success"}),e(a,{size:"sm",variant:"warning",onClick:()=>n.warning("Latency above baseline",{theme:"light"}),children:"Warning"}),e(a,{size:"sm",variant:"danger",onClick:()=>n.error("Webhook delivery failed",{theme:"light"}),children:"Error"})]})}),e("div",{slot:"tab","data-value":"queue",children:"Queue"}),e("div",{slot:"panel",children:e(a,{size:"sm",onClick:()=>{n.group("sync-stream",{message:"Sync started",level:"info",theme:"light"}),n.group("sync-stream",{message:"50% complete",level:"info",theme:"light"}),n.group("sync-stream",{message:"Sync complete",level:"success",theme:"light"})},children:"Simulate Group Stream"})}),e("div",{slot:"tab","data-value":"config",children:"Config"}),e("div",{slot:"panel",children:e(a,{size:"sm",onClick:()=>{n.configure({maxVisible:4,position:"bottom-right",theme:"light"}),n.info("Toast defaults updated",{theme:"light"})},children:"Apply Runtime Config"})})]})}),e(y,{open:d,onClose:()=>u(!1)})]})}};var g,h,v;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const [tab, setTab] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    return <Grid gap="14px" style={{
      maxWidth: 1040,
      margin: '0 auto',
      padding: 8
    }}>
        <Flex justify="between" align="center" wrap="wrap" gap="10px">
          <Box>
            <h2 style={{
            margin: 0,
            fontSize: 28,
            color: '#0f172a'
          }}>Toast Notification Center</h2>
            <p style={{
            margin: '6px 0 0 0',
            color: '#64748b'
          }}>SaaS-grade delivery patterns with grouped and promise toasts.</p>
          </Box>
          <Flex gap="8px">
            <Button onClick={() => toastAdvanced.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: {
              message: 'Publishing release notes...',
              duration: 900
            },
            success: {
              message: 'Release notes published',
              duration: 1200
            },
            error: {
              message: 'Publish failed'
            }
          })}>
              Run Promise Toast
            </Button>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Open Modal
            </Button>
          </Flex>
        </Flex>

        <Grid columns={{
        initial: '1fr',
        md: '1fr 1fr',
        lg: '1fr 1fr 1fr 1fr'
      }} gap="10px">
          <Card title="Toasts Today" value="248" note="11 grouped streams" />
          <Card title="Errors" value="6" note="Auto-retry enabled" />
          <Card title="Median TTL" value="1.4s" note="Within UX threshold" />
          <Card title="Queue Depth" value="2" note="No overload risk" />
        </Grid>

        <Box variant="surface" p="12px" radius="md" style={{
        border: '1px solid #e2e8f0'
      }}>
          <Tabs selected={tab} variant="soft" onChange={setTab}>
            <div slot="tab" data-value="signal">Signal</div>
            <div slot="panel">
              <Flex gap="8px" wrap="wrap">
                <Button size="sm" onClick={() => toastAdvanced.success('Deployment healthy', {
                theme: 'light'
              })}>Success</Button>
                <Button size="sm" variant="warning" onClick={() => toastAdvanced.warning('Latency above baseline', {
                theme: 'light'
              })}>Warning</Button>
                <Button size="sm" variant="danger" onClick={() => toastAdvanced.error('Webhook delivery failed', {
                theme: 'light'
              })}>Error</Button>
              </Flex>
            </div>

            <div slot="tab" data-value="queue">Queue</div>
            <div slot="panel">
              <Button size="sm" onClick={() => {
              toastAdvanced.group('sync-stream', {
                message: 'Sync started',
                level: 'info',
                theme: 'light'
              });
              toastAdvanced.group('sync-stream', {
                message: '50% complete',
                level: 'info',
                theme: 'light'
              });
              toastAdvanced.group('sync-stream', {
                message: 'Sync complete',
                level: 'success',
                theme: 'light'
              });
            }}>
                Simulate Group Stream
              </Button>
            </div>

            <div slot="tab" data-value="config">Config</div>
            <div slot="panel">
              <Button size="sm" onClick={() => {
              toastAdvanced.configure({
                maxVisible: 4,
                position: 'bottom-right',
                theme: 'light'
              });
              toastAdvanced.info('Toast defaults updated', {
                theme: 'light'
              });
            }}>
                Apply Runtime Config
              </Button>
            </div>
          </Tabs>
        </Box>

        <Modal open={open} onClose={() => setOpen(false)} />
      </Grid>;
  }
}`,...(v=(h=r.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};const w=["NotificationCommandCenter"];export{r as NotificationCommandCenter,w as __namedExportsOrder,k as default};
