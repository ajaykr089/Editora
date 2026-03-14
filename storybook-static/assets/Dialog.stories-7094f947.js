import{D as p,j as n,G as o,F as G,a as e,b as t,B as r}from"./index-ce0e40fa.js";import{R as i}from"./index-93f6b7ae.js";import"./index-c197feae.js";const F={title:"UI/Dialog",component:p,argTypes:{open:{control:"boolean"},dismissible:{control:"boolean"},closeOnOverlay:{control:"boolean"},closeOnEsc:{control:"boolean"},size:{control:{type:"radio",options:["1","2","3","sm","md","lg"]}}}},u=s=>{const[a,l]=i.useState(!!s.open),[c,m]=i.useState("none"),[L,x]=i.useState("none");return i.useEffect(()=>{l(!!s.open)},[s.open]),n(o,{gap:"12px",children:[n(G,{gap:"8px",wrap:"wrap",children:[e(t,{onClick:()=>l(!0),children:"Open Dialog"}),e(t,{variant:"secondary",onClick:()=>{m("none"),x("none")},children:"Reset Event Log"})]}),e(p,{...s,open:a,title:"Publish changes",description:"Review details before publishing this version.",submitText:"Publish",cancelText:"Cancel",onRequestClose:d=>m(d.reason),onDialogClose:d=>{x(`${d.action}${d.source?`:${d.source}`:""}`),l(!1)},children:n(o,{gap:"10px",children:[e(r,{variant:"surface",p:"10px",radius:"sm",color:"#475569",children:"This action updates the shared workspace for all collaborators."}),n(r,{variant:"outline",p:"10px",radius:"sm",color:"#475569",children:["Press ",e("strong",{children:"Tab"})," / ",e("strong",{children:"Shift+Tab"})," to verify focus trapping."]})]})}),n(r,{variant:"surface",p:"10px",radius:"sm",color:"#475569",children:["Request reason: ",e("strong",{children:c})," | Close result: ",e("strong",{children:L})]})]})};u.args={open:!1,dismissible:!0,closeOnOverlay:!0,closeOnEsc:!0,size:"md"};const g=()=>{const[s,a]=i.useState(!1),[l,c]=i.useState(null);return n(o,{gap:"12px",children:[e(t,{onClick:()=>a(!0),children:"Open Large Dialog"}),e(p,{open:s,size:"lg",title:"Team activity report",description:"Weekly summary across all editors.",submitText:"Apply Filters",onDialogSubmit:m=>{c(m.formData||null)},onDialogClose:()=>a(!1),children:n(o,{gap:"10px",children:[e("form",{children:n(o,{gap:"8px",columns:{initial:"1fr",md:"1fr 1fr"},children:[n("label",{children:[e("span",{children:"Owner"}),e("input",{name:"owner",defaultValue:"Operations"})]}),n("label",{children:[e("span",{children:"Window"}),e("input",{name:"window",defaultValue:"Last 7 days"})]})]})}),n(o,{gap:"8px",columns:{initial:"1fr",md:"1fr 1fr 1fr"},children:[e(r,{variant:"surface",p:"10px",radius:"sm",children:"Documents created: 42"}),e(r,{variant:"surface",p:"10px",radius:"sm",children:"Comments resolved: 128"}),e(r,{variant:"surface",p:"10px",radius:"sm",children:"Pending approvals: 6"})]})]})}),n(r,{variant:"surface",p:"10px",radius:"sm",color:"#475569",children:["Last form data: ",l?JSON.stringify(l):"none"]})]})},f=()=>{const[s,a]=i.useState(!1);return n(o,{gap:"12px",children:[e(t,{onClick:()=>a(!0),children:"Open Strict Dialog"}),e(p,{open:s,title:"Security confirmation",description:"This dialog can only close via submit action.",dismissible:!1,closeOnOverlay:!1,closeOnEsc:!1,config:{showCancel:!1,showClose:!1},submitText:"I Understand",onDialogClose:()=>a(!1),children:e(r,{variant:"outline",p:"10px",radius:"sm",color:"#475569",children:"Confirm to continue with protected operation."})})]})},h=()=>{const[s,a]=i.useState(!1),[l,c]=i.useState(!1);return n(o,{gap:"12px",children:[n(r,{variant:"outline",tone:"brand",p:"12px",radius:"lg",color:"#1e3a8a",children:["Focus trap keys: ",e("strong",{children:"Tab / Shift+Tab"}),". Dismiss keys: ",e("strong",{children:"Escape"})," and overlay click (if enabled). RTL: verify mirrored layout with ",e("code",{children:'dir="rtl"'}),"."]}),n(G,{gap:"8px",wrap:"wrap",children:[e(t,{onClick:()=>a(!0),children:"Open LTR Dialog"}),e(t,{variant:"secondary",onClick:()=>c(!0),children:"Open RTL Dialog"})]}),e(p,{open:s,title:"Accessibility map",description:"Use keyboard only to validate trap behavior.",onDialogClose:()=>a(!1),children:n(o,{gap:"8px",children:[e(t,{size:"sm",children:"Primary"}),e(t,{size:"sm",variant:"secondary",children:"Secondary"})]})}),e(r,{dir:"rtl",children:e(p,{open:l,title:"RTL Dialog",description:"Controls should mirror with logical CSS properties.",onDialogClose:()=>c(!1),children:n(o,{gap:"8px",children:[e(t,{size:"sm",children:"Approve"}),e(t,{size:"sm",variant:"secondary",children:"Dismiss"})]})})})]})};var b,y,D;u.parameters={...u.parameters,docs:{...(b=u.parameters)==null?void 0:b.docs,source:{originalSource:`(args: any) => {
  const [open, setOpen] = React.useState(Boolean(args.open));
  const [requestReason, setRequestReason] = React.useState('none');
  const [result, setResult] = React.useState('none');
  React.useEffect(() => {
    setOpen(Boolean(args.open));
  }, [args.open]);
  return <Grid gap="12px">
      <Flex gap="8px" wrap="wrap">
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Button variant="secondary" onClick={() => {
        setRequestReason('none');
        setResult('none');
      }}>
          Reset Event Log
        </Button>
      </Flex>

      <Dialog {...args} open={open} title="Publish changes" description="Review details before publishing this version." submitText="Publish" cancelText="Cancel" onRequestClose={detail => setRequestReason(detail.reason)} onDialogClose={detail => {
      setResult(\`\${detail.action}\${detail.source ? \`:\${detail.source}\` : ''}\`);
      setOpen(false);
    }}>
        <Grid gap="10px">
          <Box variant="surface" p="10px" radius="sm" color="#475569">
            This action updates the shared workspace for all collaborators.
          </Box>
          <Box variant="outline" p="10px" radius="sm" color="#475569">
            Press <strong>Tab</strong> / <strong>Shift+Tab</strong> to verify focus trapping.
          </Box>
        </Grid>
      </Dialog>

      <Box variant="surface" p="10px" radius="sm" color="#475569">
        Request reason: <strong>{requestReason}</strong> | Close result: <strong>{result}</strong>
      </Box>
    </Grid>;
}`,...(D=(y=u.parameters)==null?void 0:y.docs)==null?void 0:D.source}}};var v,O,R;g.parameters={...g.parameters,docs:{...(v=g.parameters)==null?void 0:v.docs,source:{originalSource:`() => {
  const [open, setOpen] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<Record<string, string | string[]> | null>(null);
  return <Grid gap="12px">
      <Button onClick={() => setOpen(true)}>Open Large Dialog</Button>

      <Dialog open={open} size="lg" title="Team activity report" description="Weekly summary across all editors." submitText="Apply Filters" onDialogSubmit={detail => {
      setSubmittedData(detail.formData || null);
    }} onDialogClose={() => setOpen(false)}>
        <Grid gap="10px">
          <form>
            <Grid gap="8px" columns={{
            initial: '1fr',
            md: '1fr 1fr'
          }}>
              <label>
                <span>Owner</span>
                <input name="owner" defaultValue="Operations" />
              </label>
              <label>
                <span>Window</span>
                <input name="window" defaultValue="Last 7 days" />
              </label>
            </Grid>
          </form>

          <Grid gap="8px" columns={{
          initial: '1fr',
          md: '1fr 1fr 1fr'
        }}>
            <Box variant="surface" p="10px" radius="sm">Documents created: 42</Box>
            <Box variant="surface" p="10px" radius="sm">Comments resolved: 128</Box>
            <Box variant="surface" p="10px" radius="sm">Pending approvals: 6</Box>
          </Grid>
        </Grid>
      </Dialog>

      <Box variant="surface" p="10px" radius="sm" color="#475569">
        Last form data: {submittedData ? JSON.stringify(submittedData) : 'none'}
      </Box>
    </Grid>;
}`,...(R=(O=g.parameters)==null?void 0:O.docs)==null?void 0:R.source}}};var B,S,C;f.parameters={...f.parameters,docs:{...(B=f.parameters)==null?void 0:B.docs,source:{originalSource:`() => {
  const [open, setOpen] = React.useState(false);
  return <Grid gap="12px">
      <Button onClick={() => setOpen(true)}>Open Strict Dialog</Button>
      <Dialog open={open} title="Security confirmation" description="This dialog can only close via submit action." dismissible={false} closeOnOverlay={false} closeOnEsc={false} config={{
      showCancel: false,
      showClose: false
    }} submitText="I Understand" onDialogClose={() => setOpen(false)}>
        <Box variant="outline" p="10px" radius="sm" color="#475569">
          Confirm to continue with protected operation.
        </Box>
      </Dialog>
    </Grid>;
}`,...(C=(S=f.parameters)==null?void 0:S.docs)==null?void 0:C.source}}};var w,T,k;h.parameters={...h.parameters,docs:{...(w=h.parameters)==null?void 0:w.docs,source:{originalSource:`() => {
  const [open, setOpen] = React.useState(false);
  const [openRtl, setOpenRtl] = React.useState(false);
  return <Grid gap="12px">
      <Box variant="outline" tone="brand" p="12px" radius="lg" color="#1e3a8a">
        Focus trap keys: <strong>Tab / Shift+Tab</strong>.
        Dismiss keys: <strong>Escape</strong> and overlay click (if enabled).
        RTL: verify mirrored layout with <code>dir="rtl"</code>.
      </Box>

      <Flex gap="8px" wrap="wrap">
        <Button onClick={() => setOpen(true)}>Open LTR Dialog</Button>
        <Button variant="secondary" onClick={() => setOpenRtl(true)}>Open RTL Dialog</Button>
      </Flex>

      <Dialog open={open} title="Accessibility map" description="Use keyboard only to validate trap behavior." onDialogClose={() => setOpen(false)}>
        <Grid gap="8px">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
        </Grid>
      </Dialog>

      <Box dir="rtl">
        <Dialog open={openRtl} title="RTL Dialog" description="Controls should mirror with logical CSS properties." onDialogClose={() => setOpenRtl(false)}>
          <Grid gap="8px">
            <Button size="sm">Approve</Button>
            <Button size="sm" variant="secondary">Dismiss</Button>
          </Grid>
        </Dialog>
      </Box>
    </Grid>;
}`,...(k=(T=h.parameters)==null?void 0:T.docs)==null?void 0:k.source}}};const P=["Default","Large","NonDismissable","AccessibilityKeyboardMap"];export{h as AccessibilityKeyboardMap,u as Default,g as Large,f as NonDismissable,P as __namedExportsOrder,F as default};
