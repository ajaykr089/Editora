import{j as a,G as y,B as b,a as e}from"./index-ce0e40fa.js";import{r as s}from"./index-93f6b7ae.js";import{R as E}from"./RichTextEditor-c94fbf83.js";/* empty css                *//* empty css             */import{H as k}from"./HeadingPlugin.native-b74ae03d.js";import{H as R,B as M,U as T}from"./A11yCheckerPlugin.native-b89c1fcd.js";import"./SearchExtension-5db95884.js";import{P}from"./PIIRedactionPlugin.native-6cafc2ca.js";import"./index-c197feae.js";const O={title:"Editor/Plugins/PII Redaction Scenario",parameters:{layout:"padded",docs:{source:{type:"code"},description:{component:"Scenario story for validating PII detection/redaction lifecycle with realtime scan, redact-all flow, and multi-instance isolation."}}}};function D(){return[R(),k(),M(),T(),P({enableRealtime:!0,redactionMode:"token",redactionToken:"REDACTED",maxFindings:160})]}const m={render:()=>{const p=s.useRef(null),g=s.useRef(null),[h,v]=s.useState([]),w=s.useMemo(()=>D(),[]),x=s.useMemo(()=>[R(),P({enableRealtime:!0,redactionMode:"mask",maxFindings:80})],[]);return s.useEffect(()=>{const n=f=>{var u,d;const r=f,t=(r.detail||{}).stats||{},o=r.target;if(!o)return;let i="";(u=p.current)!=null&&u.contains(o)&&(i="Primary Memo"),(d=g.current)!=null&&d.contains(o)&&(i="Secondary Memo"),i&&v(L=>[{source:i,type:r.type,total:Number(t.total||0),high:Number(t.high||0),medium:Number(t.medium||0),low:Number(t.low||0),redactedCount:Number(t.redactedCount||0),time:new Date().toLocaleTimeString()},...L].slice(0,14))},c=f=>{var o,i;const r=f,l=r.target;if(!l)return;let t="";(o=p.current)!=null&&o.contains(l)&&(t="Primary Memo"),(i=g.current)!=null&&i.contains(l)&&(t="Secondary Memo"),t&&v(u=>{var d;return[{source:t,type:r.type,total:0,high:0,medium:0,low:0,redactedCount:Number(((d=r.detail)==null?void 0:d.redactedCount)||0),time:new Date().toLocaleTimeString()},...u].slice(0,14)})};return document.addEventListener("editora:pii-scan",n),document.addEventListener("editora:pii-findings",n),document.addEventListener("editora:pii-redacted",c),()=>{document.removeEventListener("editora:pii-scan",n),document.removeEventListener("editora:pii-findings",n),document.removeEventListener("editora:pii-redacted",c)}},[]),a(y,{style:{display:"grid",gap:16},children:[a(b,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:14,background:"#f8fafc"},children:[e("h3",{style:{margin:0},children:"Dummy Scenario: Incident Memo Pre-Share PII Sweep"}),e("p",{style:{margin:"8px 0 12px",lineHeight:1.45},children:"Use the plugin before export/share to detect and redact sensitive values."}),a("ol",{style:{margin:0,paddingInlineStart:20,display:"grid",gap:6},children:[e("li",{children:"Open panel with Ctrl/Cmd + Alt + Shift + I."}),e("li",{children:"Run scan with Ctrl/Cmd + Alt + Shift + U."}),e("li",{children:"Verify email/phone/API key findings appear."}),e("li",{children:"Use Locate to inspect context, then redact selected findings."}),e("li",{children:"Run Redact All (Ctrl/Cmd + Alt + Shift + M) and re-scan to confirm clean result."}),e("li",{children:"Check secondary editor remains independent."})]})]}),a(y,{style:{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16},children:[a(y,{style:{display:"grid",gap:16},children:[e("div",{ref:p,children:e(E,{plugins:w,statusbar:{enabled:!0,position:"bottom"},floatingToolbar:!0,defaultValue:`
                  <h2>Customer Incident Communication Memo</h2>
                  <p>Owner: Content Lead | Reviewer: Security Team</p>
                  <h3>Draft Message</h3>
                  <p>Please contact incident-owner@acme-secure.com for escalations and call +1 (415) 555-0136 for urgent updates.</p>
                  <p>Temporary debug token (remove before publish): sk-proj-9x8A12B34C56D78E90F12G34H56I78J.</p>
                  <p>Customer support fallback: support-team@acme-secure.com</p>
                `})}),e("div",{ref:g,children:e(E,{plugins:x,statusbar:{enabled:!0,position:"bottom"},floatingToolbar:!0,defaultValue:`
                  <h3>Secondary Draft (Isolation Check)</h3>
                  <p>This instance should keep its own findings/state. Test value: test.secondary@acme.com</p>
                `})})]}),a(b,{style:{border:"1px solid #e2e8f0",borderRadius:10,padding:12,background:"#ffffff"},children:[e("h4",{style:{margin:"0 0 8px"},children:"PII Event Log"}),e("p",{style:{margin:"0 0 12px",fontSize:12,color:"#475569"},children:"Tracks scan/findings/redaction events from both editors."}),h.length===0?e("p",{style:{margin:0,fontSize:13,color:"#64748b"},children:"No PII events captured yet."}):e("ol",{style:{margin:0,paddingInlineStart:18,display:"grid",gap:8},children:h.map((n,c)=>a("li",{style:{fontSize:12,lineHeight:1.4},children:["[",n.time,"] ",n.source," | ",n.type," | total=",n.total," | high=",n.high," | medium=",n.medium," | low=",n.low," | redacted=",n.redactedCount]},`${n.time}-${c}`))})]})]})]})}};var S,C,I;m.parameters={...m.parameters,docs:{...(S=m.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    const primaryRef = useRef<HTMLDivElement>(null);
    const secondaryRef = useRef<HTMLDivElement>(null);
    const [events, setEvents] = useState<PIIEventLog[]>([]);
    const primaryPlugins = useMemo(() => createPIIPlugins(), []);
    const secondaryPlugins = useMemo(() => [HistoryPlugin(), PIIRedactionPlugin({
      enableRealtime: true,
      redactionMode: "mask",
      maxFindings: 80
    })], []);
    useEffect(() => {
      const onScan = (rawEvent: Event) => {
        const event = rawEvent as CustomEvent<{
          findings?: any[];
          stats?: any;
        }>;
        const detail = event.detail || {};
        const stats = detail.stats || {};
        const target = event.target as Node | null;
        if (!target) return;
        let source = "";
        if (primaryRef.current?.contains(target)) source = "Primary Memo";
        if (secondaryRef.current?.contains(target)) source = "Secondary Memo";
        if (!source) return;
        setEvents(prev => [{
          source,
          type: event.type,
          total: Number(stats.total || 0),
          high: Number(stats.high || 0),
          medium: Number(stats.medium || 0),
          low: Number(stats.low || 0),
          redactedCount: Number(stats.redactedCount || 0),
          time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 14));
      };
      const onRedacted = (rawEvent: Event) => {
        const event = rawEvent as CustomEvent<{
          redactedCount?: number;
        }>;
        const target = event.target as Node | null;
        if (!target) return;
        let source = "";
        if (primaryRef.current?.contains(target)) source = "Primary Memo";
        if (secondaryRef.current?.contains(target)) source = "Secondary Memo";
        if (!source) return;
        setEvents(prev => [{
          source,
          type: event.type,
          total: 0,
          high: 0,
          medium: 0,
          low: 0,
          redactedCount: Number(event.detail?.redactedCount || 0),
          time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 14));
      };
      document.addEventListener("editora:pii-scan", onScan as EventListener);
      document.addEventListener("editora:pii-findings", onScan as EventListener);
      document.addEventListener("editora:pii-redacted", onRedacted as EventListener);
      return () => {
        document.removeEventListener("editora:pii-scan", onScan as EventListener);
        document.removeEventListener("editora:pii-findings", onScan as EventListener);
        document.removeEventListener("editora:pii-redacted", onRedacted as EventListener);
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
        }}>Dummy Scenario: Incident Memo Pre-Share PII Sweep</h3>
          <p style={{
          margin: "8px 0 12px",
          lineHeight: 1.45
        }}>
            Use the plugin before export/share to detect and redact sensitive values.
          </p>
          <ol style={{
          margin: 0,
          paddingInlineStart: 20,
          display: "grid",
          gap: 6
        }}>
            <li>Open panel with Ctrl/Cmd + Alt + Shift + I.</li>
            <li>Run scan with Ctrl/Cmd + Alt + Shift + U.</li>
            <li>Verify email/phone/API key findings appear.</li>
            <li>Use Locate to inspect context, then redact selected findings.</li>
            <li>Run Redact All (Ctrl/Cmd + Alt + Shift + M) and re-scan to confirm clean result.</li>
            <li>Check secondary editor remains independent.</li>
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
            <div ref={primaryRef}>
              <EditoraEditor plugins={primaryPlugins} statusbar={{
              enabled: true,
              position: "bottom"
            }} floatingToolbar={true} defaultValue={\`
                  <h2>Customer Incident Communication Memo</h2>
                  <p>Owner: Content Lead | Reviewer: Security Team</p>
                  <h3>Draft Message</h3>
                  <p>Please contact incident-owner@acme-secure.com for escalations and call +1 (415) 555-0136 for urgent updates.</p>
                  <p>Temporary debug token (remove before publish): sk-proj-9x8A12B34C56D78E90F12G34H56I78J.</p>
                  <p>Customer support fallback: support-team@acme-secure.com</p>
                \`} />
            </div>

            <div ref={secondaryRef}>
              <EditoraEditor plugins={secondaryPlugins} statusbar={{
              enabled: true,
              position: "bottom"
            }} floatingToolbar={true} defaultValue={\`
                  <h3>Secondary Draft (Isolation Check)</h3>
                  <p>This instance should keep its own findings/state. Test value: test.secondary@acme.com</p>
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
          }}>PII Event Log</h4>
            <p style={{
            margin: "0 0 12px",
            fontSize: 12,
            color: "#475569"
          }}>
              Tracks scan/findings/redaction events from both editors.
            </p>
            {events.length === 0 ? <p style={{
            margin: 0,
            fontSize: 13,
            color: "#64748b"
          }}>No PII events captured yet.</p> : <ol style={{
            margin: 0,
            paddingInlineStart: 18,
            display: "grid",
            gap: 8
          }}>
                {events.map((entry, index) => <li key={\`\${entry.time}-\${index}\`} style={{
              fontSize: 12,
              lineHeight: 1.4
            }}>
                    [{entry.time}] {entry.source} | {entry.type} | total={entry.total} | high={entry.high} | medium=
                    {entry.medium} | low={entry.low} | redacted={entry.redactedCount}
                  </li>)}
              </ol>}
          </Box>
        </Grid>
      </Grid>;
  }
}`,...(I=(C=m.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};const $=["SecurityComplianceReview"];export{m as SecurityComplianceReview,$ as __namedExportsOrder,O as default};
