import{j as t,G as p,B as h,a as e}from"./index-ce0e40fa.js";import{r as o}from"./index-93f6b7ae.js";import{R as v}from"./RichTextEditor-2dfe365c.js";/* empty css                *//* empty css             */import{H as L}from"./HeadingPlugin.native-b74ae03d.js";import{H as S,B as M,I,U as T,L as O,a as W}from"./A11yCheckerPlugin.native-b89c1fcd.js";import"./SearchExtension-5db95884.js";import{A as b,T as D}from"./ApprovalWorkflowPlugin.native-eaed16b3.js";import"./index-c197feae.js";const _={title:"Editor/Plugins/Approval Workflow Scenario",parameters:{layout:"padded",docs:{source:{type:"code"},description:{component:"Scenario story for validating Approval Workflow in a realistic editorial process with required sign-off comments, lock-on-approval, and multi-instance checks."}}}};function B(i){return[S(),L(),M(),I(),T(),O(),W(),D({author:i,enabledByDefault:!0}),b({defaultStatus:"draft",lockOnApproval:!0,requireCommentOnApprove:!0,defaultActor:i})]}const s={render:()=>{const i=o.useRef(null),m=o.useRef(null),[u,E]=o.useState([]),C=o.useMemo(()=>B("Policy Owner"),[]),x=o.useMemo(()=>[S(),b({defaultStatus:"draft",lockOnApproval:!0,requireCommentOnApprove:!0,defaultActor:"Secondary Owner"})],[]);return o.useEffect(()=>{const n=l=>{var g,f,y;const d=l,r=(g=d.detail)==null?void 0:g.state;if(!r)return;const c=d.target;if(!c)return;let a="";if((f=i.current)!=null&&f.contains(c)&&(a="Primary Memo"),(y=m.current)!=null&&y.contains(c)&&(a="Secondary Memo"),!a)return;const P={source:a,type:d.type,status:String(r.status||"unknown"),locked:!!r.locked,comments:Array.isArray(r.comments)?r.comments.length:0,signoffs:Array.isArray(r.signoffs)?r.signoffs.length:0,time:new Date().toLocaleTimeString()};E(R=>[P,...R].slice(0,12))};return document.addEventListener("editora:approval-state-changed",n),document.addEventListener("editora:approval-state",n),()=>{document.removeEventListener("editora:approval-state-changed",n),document.removeEventListener("editora:approval-state",n)}},[]),t(p,{style:{display:"grid",gap:16},children:[t(h,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:14,background:"#f8fafc"},children:[e("h3",{style:{margin:0},children:"Dummy Scenario: Security Incident Customer Memo"}),e("p",{style:{margin:"8px 0 12px",lineHeight:1.45},children:"Validate Draft - Review - Approved lifecycle with mandatory approval comment and editor lock."}),t("ol",{style:{margin:0,paddingInlineStart:20,display:"grid",gap:6},children:[e("li",{children:"Open workflow panel using Ctrl/Cmd + Alt + Shift + A."}),e("li",{children:"Add comment: Initial draft ready for review."}),e("li",{children:"Request review using toolbar button or Ctrl/Cmd + Alt + Shift + R."}),e("li",{children:"Try approve without comment. It should fail."}),e("li",{children:"Approve with comment and verify editor becomes read-only."}),e("li",{children:"Reopen draft with Ctrl/Cmd + Alt + Shift + D and confirm editing works again."}),e("li",{children:"Repeat actions in secondary editor to confirm state isolation."})]})]}),t(p,{style:{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16},children:[t(p,{style:{display:"grid",gap:16},children:[e("div",{ref:i,children:e(v,{plugins:C,statusbar:{enabled:!0,position:"bottom"},floatingToolbar:!0,defaultValue:`
                  <h2>Security Incident Customer Communication Memo</h2>
                  <p><strong>Owner:</strong> Content Lead | <strong>Audience:</strong> Enterprise Customers</p>
                  <h3>Summary</h3>
                  <p>A service disruption was detected on March 4, 2026. This memo outlines customer-facing messaging and next steps.</p>
                  <h3>Message Draft</h3>
                  <ul>
                    <li>Acknowledge the disruption and impact window.</li>
                    <li>Provide current mitigation status and next ETA checkpoint.</li>
                    <li>Include customer support channel and incident page link.</li>
                  </ul>
                  <p>Open Approval Workflow and follow the checklist above.</p>
                `})}),e("div",{ref:m,children:e(v,{plugins:x,statusbar:{enabled:!0,position:"bottom"},floatingToolbar:!0,defaultValue:`
                  <h3>Secondary Memo (Instance Isolation Check)</h3>
                  <p>Use this editor to confirm approval state/comments do not leak from the primary memo.</p>
                `})})]}),t(h,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:12,background:"#ffffff"},children:[e("h4",{style:{margin:"0 0 8px"},children:"Approval Event Log"}),t("p",{style:{margin:"0 0 12px",fontSize:12,color:"#475569"},children:["Captures ",e("code",{children:"editora:approval-state-changed"})," and ",e("code",{children:"editora:approval-state"}),"."]}),u.length===0?e("p",{style:{margin:0,fontSize:13,color:"#64748b"},children:"No approval events captured yet."}):e("ol",{style:{margin:0,paddingInlineStart:18,display:"grid",gap:8},children:u.map((n,l)=>t("li",{style:{fontSize:12,lineHeight:1.4},children:["[",n.time,"] ",n.source," | ",n.type," | status=",n.status," | locked=",String(n.locked)," | comments=",n.comments," | signoffs=",n.signoffs]},`${n.time}-${l}`))})]})]})]})}};var w,k,A;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => {
    const primaryWrapperRef = useRef<HTMLDivElement>(null);
    const secondaryWrapperRef = useRef<HTMLDivElement>(null);
    const [events, setEvents] = useState<WorkflowEventLog[]>([]);
    const primaryPlugins = useMemo(() => createScenarioPlugins("Policy Owner"), []);
    const secondaryPlugins = useMemo(() => [HistoryPlugin(), ApprovalWorkflowPlugin({
      defaultStatus: "draft",
      lockOnApproval: true,
      requireCommentOnApprove: true,
      defaultActor: "Secondary Owner"
    })], []);
    useEffect(() => {
      const handler = (rawEvent: Event) => {
        const event = rawEvent as CustomEvent<{
          state?: any;
        }>;
        const state = event.detail?.state;
        if (!state) return;
        const target = event.target as Node | null;
        if (!target) return;
        let source = "";
        if (primaryWrapperRef.current?.contains(target)) source = "Primary Memo";
        if (secondaryWrapperRef.current?.contains(target)) source = "Secondary Memo";
        if (!source) return;
        const next: WorkflowEventLog = {
          source,
          type: event.type,
          status: String(state.status || "unknown"),
          locked: Boolean(state.locked),
          comments: Array.isArray(state.comments) ? state.comments.length : 0,
          signoffs: Array.isArray(state.signoffs) ? state.signoffs.length : 0,
          time: new Date().toLocaleTimeString()
        };
        setEvents(prev => [next, ...prev].slice(0, 12));
      };
      document.addEventListener("editora:approval-state-changed", handler as EventListener);
      document.addEventListener("editora:approval-state", handler as EventListener);
      return () => {
        document.removeEventListener("editora:approval-state-changed", handler as EventListener);
        document.removeEventListener("editora:approval-state", handler as EventListener);
      };
    }, []);
    return <Grid style={{
      display: "grid",
      gap: 16
    }}>
        <Box style={{
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: 14,
        background: "#f8fafc"
      }}>
          <h3 style={{
          margin: 0
        }}>Dummy Scenario: Security Incident Customer Memo</h3>
          <p style={{
          margin: "8px 0 12px",
          lineHeight: 1.45
        }}>
            Validate Draft - Review - Approved lifecycle with mandatory approval comment and editor lock.
          </p>
          <ol style={{
          margin: 0,
          paddingInlineStart: 20,
          display: "grid",
          gap: 6
        }}>
            <li>Open workflow panel using Ctrl/Cmd + Alt + Shift + A.</li>
            <li>Add comment: Initial draft ready for review.</li>
            <li>Request review using toolbar button or Ctrl/Cmd + Alt + Shift + R.</li>
            <li>Try approve without comment. It should fail.</li>
            <li>Approve with comment and verify editor becomes read-only.</li>
            <li>Reopen draft with Ctrl/Cmd + Alt + Shift + D and confirm editing works again.</li>
            <li>Repeat actions in secondary editor to confirm state isolation.</li>
          </ol>
        </Box>

        <Grid style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 16
      }}>
          <Grid style={{
          display: "grid",
          gap: 16
        }}>
            <div ref={primaryWrapperRef}>
              <EditoraEditor plugins={primaryPlugins} statusbar={{
              enabled: true,
              position: "bottom"
            }} floatingToolbar={true} defaultValue={\`
                  <h2>Security Incident Customer Communication Memo</h2>
                  <p><strong>Owner:</strong> Content Lead | <strong>Audience:</strong> Enterprise Customers</p>
                  <h3>Summary</h3>
                  <p>A service disruption was detected on March 4, 2026. This memo outlines customer-facing messaging and next steps.</p>
                  <h3>Message Draft</h3>
                  <ul>
                    <li>Acknowledge the disruption and impact window.</li>
                    <li>Provide current mitigation status and next ETA checkpoint.</li>
                    <li>Include customer support channel and incident page link.</li>
                  </ul>
                  <p>Open Approval Workflow and follow the checklist above.</p>
                \`} />
            </div>

            <div ref={secondaryWrapperRef}>
              <EditoraEditor plugins={secondaryPlugins} statusbar={{
              enabled: true,
              position: "bottom"
            }} floatingToolbar={true} defaultValue={\`
                  <h3>Secondary Memo (Instance Isolation Check)</h3>
                  <p>Use this editor to confirm approval state/comments do not leak from the primary memo.</p>
                \`} />
            </div>
          </Grid>

          <Box style={{
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: 12,
          background: "#ffffff"
        }}>
            <h4 style={{
            margin: "0 0 8px"
          }}>Approval Event Log</h4>
            <p style={{
            margin: "0 0 12px",
            fontSize: 12,
            color: "#475569"
          }}>
              Captures <code>editora:approval-state-changed</code> and <code>editora:approval-state</code>.
            </p>
            {events.length === 0 ? <p style={{
            margin: 0,
            fontSize: 13,
            color: "#64748b"
          }}>No approval events captured yet.</p> : <ol style={{
            margin: 0,
            paddingInlineStart: 18,
            display: "grid",
            gap: 8
          }}>
                {events.map((entry, index) => <li key={\`\${entry.time}-\${index}\`} style={{
              fontSize: 12,
              lineHeight: 1.4
            }}>
                    [{entry.time}] {entry.source} | {entry.type} | status={entry.status} | locked=
                    {String(entry.locked)} | comments={entry.comments} | signoffs={entry.signoffs}
                  </li>)}
              </ol>}
          </Box>
        </Grid>
      </Grid>;
  }
}`,...(A=(k=s.parameters)==null?void 0:k.docs)==null?void 0:A.source}}};const J=["PolicyMemoApprovalFlow"];export{s as PolicyMemoApprovalFlow,J as __namedExportsOrder,_ as default};
