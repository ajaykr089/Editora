import{j as n,G as o,a as e,T as P,F as b,B as a,b as u,c as T,D as O}from"./index-ce0e40fa.js";import{R as t}from"./index-93f6b7ae.js";import{R as B}from"./RichTextEditor-c94fbf83.js";import{B as D,I as E,U as L,a as G,L as z,T as F,H as W}from"./A11yCheckerPlugin.native-b89c1fcd.js";import"./SearchExtension-5db95884.js";import{C as A}from"./ContentRulesPlugin.native-706a3efc.js";/* empty css                */import"./index-c197feae.js";const c=({title:i,value:s,note:r})=>n(a,{variant:"surface",p:"12px",radius:"md",style:{border:"1px solid #e2e8f0",background:"#fff"},children:[e("div",{style:{fontSize:12,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.04em"},children:i}),e("div",{style:{marginTop:6,fontSize:24,fontWeight:700,color:"#0f172a"},children:s}),e("div",{style:{marginTop:6,fontSize:13,color:"#475569"},children:r})]}),M=({open:i,onClose:s,onPublish:r})=>e(O,{open:i,title:"Publish Editorial Update",description:"Confirm release notes and compliance checks before publishing.",submitText:"Publish",cancelText:"Cancel",dismissible:!0,closeOnOverlay:!0,closeOnEsc:!0,onDialogSubmit:r,onDialogClose:s,children:n(o,{gap:"10px",children:[e(a,{variant:"outline",p:"10px",radius:"sm",color:"#475569",children:"This release updates customer-facing workflows and internal policy wording."}),e(a,{variant:"surface",p:"10px",radius:"sm",color:"#334155",children:"Ensure terminology and risk statements pass content rules before approval."})]})}),j=[D(),E(),L(),G(),z(),F(),W(),A({bannedWords:["obviously","simply"],requiredHeadings:["Summary"],maxSentenceWords:30,minReadabilityScore:55,enableRealtime:!0})],$={title:"Editor/AI SaaS Workspace"},p={render:()=>{const[i,s]=t.useState(0),[r,d]=t.useState(!1),[k,w]=t.useState(0),[f,g]=t.useState(!1),m=t.useRef(null),l=t.useCallback((h,R="info")=>{var v;(v=m.current)==null||v.show(h,{type:R,theme:"light",duration:1400})},[]),S=t.useCallback(()=>{f||(g(!0),l("Saving draft...","loading"),window.setTimeout(()=>{g(!1),l("Draft saved to editorial queue","success")},900))},[l,f]);return n(o,{gap:"14px",style:{maxWidth:1120,margin:"0 auto",padding:8},children:[e(P,{ref:m,position:"bottom-right",theme:"light"}),n(b,{justify:"between",align:"center",wrap:"wrap",gap:"10px",children:[n(a,{children:[e("h2",{style:{margin:0,fontSize:28,color:"#0f172a"},children:"Editorial Operations Workspace"}),e("p",{style:{margin:"6px 0 0 0",color:"#64748b"},children:"AI-assisted release drafting, review workflows, and policy-safe publishing."})]}),n(b,{gap:"8px",children:[e(u,{onClick:S,children:f?"Saving...":"Save Draft"}),e(u,{variant:"secondary",onClick:()=>d(!0),children:"Open Modal"})]})]}),n(o,{columns:{initial:"1fr",md:"1fr 1fr",lg:"1fr 1fr 1fr 1fr"},gap:"10px",children:[e(c,{title:"Documents",value:"48",note:"6 pending legal review"}),e(c,{title:"Open Comments",value:"129",note:"22 unresolved blockers"}),e(c,{title:"Content Risk",value:"Low",note:"No banned terms detected"}),e(c,{title:"Current Draft",value:`${k} chars`,note:"Realtime onChange tracked"})]}),e(a,{variant:"surface",p:"12px",radius:"md",style:{border:"1px solid #e2e8f0"},children:n(T,{selected:i,variant:"soft",onChange:s,children:[e("div",{slot:"tab","data-value":"draft",children:"Draft"}),e("div",{slot:"panel",children:e(B,{plugins:j,statusbar:{enabled:!0,position:"bottom"},toolbar:{items:"undo redo | bold italic underline | link | bullist numlist | table",sticky:!0},defaultValue:"<h2>Summary</h2><p>Draft your enterprise release update here.</p>",onChange:h=>w(h.length)})}),e("div",{slot:"tab","data-value":"review",children:"Review"}),e("div",{slot:"panel",children:n(o,{gap:"8px",children:[e(a,{variant:"outline",p:"10px",radius:"sm",color:"#475569",children:"Reviewer queue: Product, Legal, Security."}),e(u,{size:"sm",onClick:()=>l("Review checklist refreshed","info"),children:"Refresh Checklist"})]})}),e("div",{slot:"tab","data-value":"publish",children:"Publish"}),e("div",{slot:"panel",children:n(o,{gap:"8px",children:[e(a,{variant:"outline",p:"10px",radius:"sm",color:"#475569",children:"Final release gating passed. You can publish this document now."}),e(u,{size:"sm",onClick:()=>d(!0),children:"Open Publish Modal"})]})})]})}),e(M,{open:r,onClose:()=>d(!1),onPublish:()=>{l("Release published successfully","success"),d(!1)}})]})}};var x,y,C;p.parameters={...p.parameters,docs:{...(x=p.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => {
    const [activeTab, setActiveTab] = React.useState(0);
    const [publishOpen, setPublishOpen] = React.useState(false);
    const [contentLength, setContentLength] = React.useState(0);
    const [saving, setSaving] = React.useState(false);
    const toastRef = React.useRef<ToastElement | null>(null);
    const notify = React.useCallback((message: string, type: 'success' | 'error' | 'info' | 'loading' = 'info') => {
      toastRef.current?.show(message, {
        type,
        theme: 'light',
        duration: 1400
      });
    }, []);
    const saveDraft = React.useCallback(() => {
      if (saving) return;
      setSaving(true);
      notify('Saving draft...', 'loading');
      window.setTimeout(() => {
        setSaving(false);
        notify('Draft saved to editorial queue', 'success');
      }, 900);
    }, [notify, saving]);
    return <Grid gap="14px" style={{
      maxWidth: 1120,
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
          }}>Editorial Operations Workspace</h2>
            <p style={{
            margin: '6px 0 0 0',
            color: '#64748b'
          }}>
              AI-assisted release drafting, review workflows, and policy-safe publishing.
            </p>
          </Box>
          <Flex gap="8px">
            <Button onClick={saveDraft}>{saving ? 'Saving...' : 'Save Draft'}</Button>
            <Button variant="secondary" onClick={() => setPublishOpen(true)}>
              Open Modal
            </Button>
          </Flex>
        </Flex>

        <Grid columns={{
        initial: '1fr',
        md: '1fr 1fr',
        lg: '1fr 1fr 1fr 1fr'
      }} gap="10px">
          <Card title="Documents" value="48" note="6 pending legal review" />
          <Card title="Open Comments" value="129" note="22 unresolved blockers" />
          <Card title="Content Risk" value="Low" note="No banned terms detected" />
          <Card title="Current Draft" value={\`\${contentLength} chars\`} note="Realtime onChange tracked" />
        </Grid>

        <Box variant="surface" p="12px" radius="md" style={{
        border: '1px solid #e2e8f0'
      }}>
          <Tabs selected={activeTab} variant="soft" onChange={setActiveTab}>
            <div slot="tab" data-value="draft">Draft</div>
            <div slot="panel">
              <EditoraEditor plugins={plugins} statusbar={{
              enabled: true,
              position: 'bottom'
            }} toolbar={{
              items: 'undo redo | bold italic underline | link | bullist numlist | table',
              sticky: true
            }} defaultValue="<h2>Summary</h2><p>Draft your enterprise release update here.</p>" onChange={html => setContentLength(html.length)} />
            </div>

            <div slot="tab" data-value="review">Review</div>
            <div slot="panel">
              <Grid gap="8px">
                <Box variant="outline" p="10px" radius="sm" color="#475569">
                  Reviewer queue: Product, Legal, Security.
                </Box>
                <Button size="sm" onClick={() => notify('Review checklist refreshed', 'info')}>
                  Refresh Checklist
                </Button>
              </Grid>
            </div>

            <div slot="tab" data-value="publish">Publish</div>
            <div slot="panel">
              <Grid gap="8px">
                <Box variant="outline" p="10px" radius="sm" color="#475569">
                  Final release gating passed. You can publish this document now.
                </Box>
                <Button size="sm" onClick={() => setPublishOpen(true)}>
                  Open Publish Modal
                </Button>
              </Grid>
            </div>
          </Tabs>
        </Box>

        <Modal open={publishOpen} onClose={() => setPublishOpen(false)} onPublish={() => {
        notify('Release published successfully', 'success');
        setPublishOpen(false);
      }} />
      </Grid>;
  }
}`,...(C=(y=p.parameters)==null?void 0:y.docs)==null?void 0:C.source}}};const J=["EnterpriseEditorOps"];export{p as EnterpriseEditorOps,J as __namedExportsOrder,$ as default};
