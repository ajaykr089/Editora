import{a as e,j as n,G as h,F as c,B as d,b as r,t,c as b,D as y}from"./index-c1b18327.js";import{R as u}from"./index-93f6b7ae.js";import{u as x,R as I,S as m,U as C,a as S,A}from"./icons-f697cb21.js";const T={title:"AI/React Icons SaaS Dashboard"},l=({icon:i,title:a,value:p,tone:o="#0f172a"})=>e(d,{variant:"surface",p:"12px",radius:"md",style:{border:"1px solid #e2e8f0",background:"#fff"},children:n(c,{justify:"between",align:"center",children:[n("div",{children:[e("div",{style:{fontSize:12,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.04em"},children:a}),e("div",{style:{marginTop:6,fontSize:24,fontWeight:700,color:o},children:p})]}),i]})}),k=({open:i,onClose:a})=>e(y,{open:i,title:"Icon Set Governance",description:"Approve stroke and semantic icon usage policy.",submitText:"Approve",cancelText:"Cancel",onDialogSubmit:()=>{t.success("Icon governance policy approved",{theme:"light",duration:1200}),a()},onDialogClose:a,children:e(d,{variant:"outline",p:"10px",radius:"sm",color:"#475569",children:"Team standard: `IconProvider(size=18, strokeWidth=1.9)` and semantic icon mapping for status."})}),s={render:()=>{const[i,a]=u.useState(0),[p,o]=u.useState(!1);return e(x,{value:{size:20,strokeWidth:1.9},children:n(h,{gap:"14px",style:{maxWidth:1040,margin:"0 auto",padding:8},children:[n(c,{justify:"between",align:"center",wrap:"wrap",gap:"10px",children:[n(d,{children:[e("h2",{style:{margin:0,fontSize:28,color:"#0f172a"},children:"React Icons Operations Dashboard"}),e("p",{style:{margin:"6px 0 0 0",color:"#64748b"},children:"Icon-driven telemetry for enterprise SaaS workflows."})]}),n(c,{gap:"8px",children:[n(r,{onClick:()=>{t.loading("Refreshing icon telemetry...",{theme:"light",duration:850}),setTimeout(()=>t.success("Icon telemetry updated",{theme:"light",duration:1100}),900)},children:[e(I,{ariaLabel:"Refresh",style:{marginInlineEnd:6}}),"Refresh"]}),n(r,{variant:"secondary",onClick:()=>o(!0),children:[e(m,{ariaLabel:"Policy",style:{marginInlineEnd:6}}),"Policy"]})]})]}),n(h,{columns:{initial:"1fr",md:"1fr 1fr",lg:"1fr 1fr 1fr 1fr"},gap:"10px",children:[e(l,{icon:e(C,{ariaLabel:"Users",color:"#1d4ed8"}),title:"Active Seats",value:"1,842"}),e(l,{icon:e(S,{ariaLabel:"Healthy",color:"#15803d"}),title:"Healthy Services",value:"23",tone:"#15803d"}),e(l,{icon:e(A,{ariaLabel:"Warning",color:"#b45309"}),title:"Warnings",value:"4",tone:"#b45309"}),e(l,{icon:e(m,{ariaLabel:"Compliance",color:"#475569"}),title:"Policy Score",value:"98.7%"})]}),e(d,{variant:"surface",p:"12px",radius:"md",style:{border:"1px solid #e2e8f0"},children:n(b,{selected:i,variant:"soft",onChange:a,children:[e("div",{slot:"tab","data-value":"system",children:"System"}),e("div",{slot:"panel",children:e(c,{gap:"8px",wrap:"wrap",children:e(r,{size:"sm",onClick:()=>t.success("Status icon mapping validated",{theme:"light"}),children:"Validate Mapping"})})}),e("div",{slot:"tab","data-value":"alerts",children:"Alerts"}),e("div",{slot:"panel",children:e(r,{size:"sm",variant:"warning",onClick:()=>t.warning("Icon contrast check required",{theme:"light"}),children:"Run Contrast Check"})}),e("div",{slot:"tab","data-value":"accessibility",children:"A11y"}),e("div",{slot:"panel",children:e(r,{size:"sm",onClick:()=>t.info("Aria label audit completed",{theme:"light"}),children:"Audit Aria Labels"})})]})}),e(k,{open:p,onClose:()=>o(!1)})]})})}};var v,g,f;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => {
    const [tab, setTab] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    return <IconProvider value={{
      size: 20,
      strokeWidth: 1.9
    }}>
        <Grid gap="14px" style={{
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
            }}>React Icons Operations Dashboard</h2>
              <p style={{
              margin: '6px 0 0 0',
              color: '#64748b'
            }}>Icon-driven telemetry for enterprise SaaS workflows.</p>
            </Box>
            <Flex gap="8px">
              <Button onClick={() => {
              toastAdvanced.loading('Refreshing icon telemetry...', {
                theme: 'light',
                duration: 850
              });
              setTimeout(() => toastAdvanced.success('Icon telemetry updated', {
                theme: 'light',
                duration: 1100
              }), 900);
            }}>
                <RefreshCwIcon ariaLabel="Refresh" style={{
                marginInlineEnd: 6
              }} />
                Refresh
              </Button>
              <Button variant="secondary" onClick={() => setOpen(true)}>
                <ShieldIcon ariaLabel="Policy" style={{
                marginInlineEnd: 6
              }} />
                Policy
              </Button>
            </Flex>
          </Flex>

          <Grid columns={{
          initial: '1fr',
          md: '1fr 1fr',
          lg: '1fr 1fr 1fr 1fr'
        }} gap="10px">
            <Card icon={<UsersIcon ariaLabel="Users" color="#1d4ed8" />} title="Active Seats" value="1,842" />
            <Card icon={<CheckCircleIcon ariaLabel="Healthy" color="#15803d" />} title="Healthy Services" value="23" tone="#15803d" />
            <Card icon={<AlertTriangleIcon ariaLabel="Warning" color="#b45309" />} title="Warnings" value="4" tone="#b45309" />
            <Card icon={<ShieldIcon ariaLabel="Compliance" color="#475569" />} title="Policy Score" value="98.7%" />
          </Grid>

          <Box variant="surface" p="12px" radius="md" style={{
          border: '1px solid #e2e8f0'
        }}>
            <Tabs selected={tab} variant="soft" onChange={setTab}>
              <div slot="tab" data-value="system">System</div>
              <div slot="panel">
                <Flex gap="8px" wrap="wrap">
                  <Button size="sm" onClick={() => toastAdvanced.success('Status icon mapping validated', {
                  theme: 'light'
                })}>
                    Validate Mapping
                  </Button>
                </Flex>
              </div>

              <div slot="tab" data-value="alerts">Alerts</div>
              <div slot="panel">
                <Button size="sm" variant="warning" onClick={() => toastAdvanced.warning('Icon contrast check required', {
                theme: 'light'
              })}>
                  Run Contrast Check
                </Button>
              </div>

              <div slot="tab" data-value="accessibility">A11y</div>
              <div slot="panel">
                <Button size="sm" onClick={() => toastAdvanced.info('Aria label audit completed', {
                theme: 'light'
              })}>
                  Audit Aria Labels
                </Button>
              </div>
            </Tabs>
          </Box>

          <Modal open={open} onClose={() => setOpen(false)} />
        </Grid>
      </IconProvider>;
  }
}`,...(f=(g=s.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};const L=["IconDrivenOperations"];export{s as IconDrivenOperations,L as __namedExportsOrder,T as default};
