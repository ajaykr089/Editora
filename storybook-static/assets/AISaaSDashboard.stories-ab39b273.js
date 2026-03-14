import{j as n,G as i,a as e,T as R,F as v,B as u,b as s,c as T,D as k}from"./index-ce0e40fa.js";import{R as r}from"./index-93f6b7ae.js";import"./index-c197feae.js";const d=({title:o,value:l,delta:c,tone:t="neutral"})=>n(u,{variant:"surface",p:"14px",radius:"md",style:{border:"1px solid #e2e8f0",background:"#ffffff"},children:[e("div",{style:{fontSize:12,color:"#64748b",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em"},children:o}),e("div",{style:{fontSize:28,fontWeight:700,color:"#0f172a",lineHeight:1.1},children:l}),e("div",{style:{marginTop:8,fontSize:13,fontWeight:600,color:t==="success"?"#15803d":t==="danger"?"#b91c1c":"#475569"},children:c})]}),O=({open:o,title:l,onClose:c,children:t})=>e(k,{open:o,title:l,description:"Review release and audit context before approval.",submitText:"Approve",cancelText:"Cancel",dismissible:!0,closeOnOverlay:!0,closeOnEsc:!0,onDialogClose:c,children:t}),z={title:"AI/SaaS Dashboard"},p=()=>{const[o,l]=r.useState(0),[c,t]=r.useState(!1),[h,g]=r.useState(!1),m=r.useRef(null),a=r.useCallback((w,C="info")=>{var f;(f=m.current)==null||f.show(w,{type:C,duration:1400,theme:"light"})},[]),S=r.useCallback(()=>{h||(g(!0),a("Syncing dashboard metrics...","loading"),window.setTimeout(()=>{g(!1),a("Metrics synced successfully","success")},900))},[h,a]);return n(i,{gap:"16px",style:{maxWidth:1080,margin:"0 auto",padding:8},children:[e(R,{ref:m,position:"bottom-right",theme:"light"}),n(v,{justify:"between",align:"center",wrap:"wrap",gap:"10px",children:[n(u,{children:[e("h2",{style:{margin:0,fontSize:28,color:"#0f172a"},children:"SaaS Operations Dashboard"}),e("p",{style:{margin:"6px 0 0 0",color:"#64748b"},children:"Monitor subscriptions, incident risk, and deployment health."})]}),n(v,{gap:"8px",children:[e(s,{onClick:S,children:h?"Syncing...":"Sync Data"}),e(s,{variant:"secondary",onClick:()=>t(!0),children:"Open Modal"})]})]}),n(i,{columns:{initial:"1fr",md:"1fr 1fr",lg:"1fr 1fr 1fr 1fr"},gap:"10px",children:[e(d,{title:"MRR",value:"$412K",delta:"+8.4% vs last month",tone:"success"}),e(d,{title:"Active Teams",value:"1,248",delta:"+34 new this week",tone:"success"}),e(d,{title:"Churn Risk",value:"2.1%",delta:"-0.6% after onboarding changes",tone:"success"}),e(d,{title:"Incidents",value:"3",delta:"1 critical alert",tone:"danger"})]}),e(u,{variant:"surface",p:"12px",radius:"md",style:{border:"1px solid #e2e8f0"},children:n(T,{selected:o,variant:"soft",onChange:l,children:[e("div",{slot:"tab","data-value":"overview",children:"Overview"}),e("div",{slot:"panel",children:n(i,{gap:"8px",children:[e("div",{style:{color:"#334155"},children:"Revenue velocity improved after pricing page experiment."}),e(s,{size:"sm",onClick:()=>a("Quarterly summary exported","success"),children:"Export Summary"})]})}),e("div",{slot:"tab","data-value":"deployments",children:"Deployments"}),e("div",{slot:"panel",children:n(i,{gap:"8px",children:[e("div",{style:{color:"#334155"},children:"Latest release passed health checks in all regions."}),e(s,{size:"sm",variant:"secondary",onClick:()=>t(!0),children:"Review Approval"})]})}),e("div",{slot:"tab","data-value":"alerts",children:"Alerts"}),e("div",{slot:"panel",children:n(i,{gap:"8px",children:[e("div",{style:{color:"#334155"},children:"One account reached API quota threshold."}),e(s,{size:"sm",variant:"danger",onClick:()=>a("Escalation sent to on-call","error"),children:"Escalate Incident"})]})})]})}),e(O,{open:c,title:"Deployment Approval",onClose:()=>t(!1),children:n(i,{gap:"10px",children:[n(u,{variant:"outline",p:"10px",radius:"sm",color:"#475569",children:["Release ",e("strong",{children:"v1.2.8"})," includes billing retries, SOC2 audit logging, and dashboard performance fixes."]}),n(v,{gap:"8px",wrap:"wrap",children:[e(s,{size:"sm",onClick:()=>{a("Release approved and queued","success"),t(!1)},children:"Approve"}),e(s,{size:"sm",variant:"secondary",onClick:()=>{a("Release returned for review","info"),t(!1)},children:"Request Changes"})]})]})})]})};var y,x,b;p.parameters={...p.parameters,docs:{...(y=p.parameters)==null?void 0:y.docs,source:{originalSource:`() => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const toastRef = React.useRef<ToastElement | null>(null);
  const showToast = React.useCallback((message: string, type: 'success' | 'error' | 'info' | 'loading' = 'info') => {
    toastRef.current?.show(message, {
      type,
      duration: 1400,
      theme: 'light'
    });
  }, []);
  const handleSync = React.useCallback(() => {
    if (isSyncing) return;
    setIsSyncing(true);
    showToast('Syncing dashboard metrics...', 'loading');
    window.setTimeout(() => {
      setIsSyncing(false);
      showToast('Metrics synced successfully', 'success');
    }, 900);
  }, [isSyncing, showToast]);
  return <Grid gap="16px" style={{
    maxWidth: 1080,
    margin: '0 auto',
    padding: 8
  }}>
      <Toast ref={toastRef} position="bottom-right" theme="light" />

      <Flex justify="between" align="center" wrap="wrap" gap="10px">
        <Box>
          <h2 style={{
          margin: 0,
          fontSize: 28,
          color: '#0f172a'
        }}>SaaS Operations Dashboard</h2>
          <p style={{
          margin: '6px 0 0 0',
          color: '#64748b'
        }}>Monitor subscriptions, incident risk, and deployment health.</p>
        </Box>
        <Flex gap="8px">
          <Button onClick={handleSync}>{isSyncing ? 'Syncing...' : 'Sync Data'}</Button>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
        </Flex>
      </Flex>

      <Grid columns={{
      initial: '1fr',
      md: '1fr 1fr',
      lg: '1fr 1fr 1fr 1fr'
    }} gap="10px">
        <Card title="MRR" value="$412K" delta="+8.4% vs last month" tone="success" />
        <Card title="Active Teams" value="1,248" delta="+34 new this week" tone="success" />
        <Card title="Churn Risk" value="2.1%" delta="-0.6% after onboarding changes" tone="success" />
        <Card title="Incidents" value="3" delta="1 critical alert" tone="danger" />
      </Grid>

      <Box variant="surface" p="12px" radius="md" style={{
      border: '1px solid #e2e8f0'
    }}>
        <Tabs selected={activeTab} variant="soft" onChange={setActiveTab}>
          <div slot="tab" data-value="overview">
            Overview
          </div>
          <div slot="panel">
            <Grid gap="8px">
              <div style={{
              color: '#334155'
            }}>Revenue velocity improved after pricing page experiment.</div>
              <Button size="sm" onClick={() => showToast('Quarterly summary exported', 'success')}>
                Export Summary
              </Button>
            </Grid>
          </div>

          <div slot="tab" data-value="deployments">
            Deployments
          </div>
          <div slot="panel">
            <Grid gap="8px">
              <div style={{
              color: '#334155'
            }}>Latest release passed health checks in all regions.</div>
              <Button size="sm" variant="secondary" onClick={() => setModalOpen(true)}>
                Review Approval
              </Button>
            </Grid>
          </div>

          <div slot="tab" data-value="alerts">
            Alerts
          </div>
          <div slot="panel">
            <Grid gap="8px">
              <div style={{
              color: '#334155'
            }}>One account reached API quota threshold.</div>
              <Button size="sm" variant="danger" onClick={() => showToast('Escalation sent to on-call', 'error')}>
                Escalate Incident
              </Button>
            </Grid>
          </div>
        </Tabs>
      </Box>

      <Modal open={modalOpen} title="Deployment Approval" onClose={() => setModalOpen(false)}>
        <Grid gap="10px">
          <Box variant="outline" p="10px" radius="sm" color="#475569">
            Release <strong>v1.2.8</strong> includes billing retries, SOC2 audit logging, and dashboard performance fixes.
          </Box>
          <Flex gap="8px" wrap="wrap">
            <Button size="sm" onClick={() => {
            showToast('Release approved and queued', 'success');
            setModalOpen(false);
          }}>
              Approve
            </Button>
            <Button size="sm" variant="secondary" onClick={() => {
            showToast('Release returned for review', 'info');
            setModalOpen(false);
          }}>
              Request Changes
            </Button>
          </Flex>
        </Grid>
      </Modal>
    </Grid>;
}`,...(b=(x=p.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};const G=["EnterpriseOps"];export{p as EnterpriseOps,G as __namedExportsOrder,z as default};
