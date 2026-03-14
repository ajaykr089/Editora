import{at as w,a as e,j as n,B as r,G as x,au as G}from"./index-ce0e40fa.js";import{r as i}from"./index-93f6b7ae.js";import{S as Q,a as p,b as W,c as S,s as u,d as b}from"./storybook-showcase-2b62d73c.js";import"./index-c197feae.js";const N={title:"UI/FileUpload",component:w,argTypes:{label:{control:"text"},description:{control:"text"},accept:{control:"text"},multiple:{control:"boolean"},required:{control:"boolean"},disabled:{control:"boolean"},maxFiles:{control:"number"},maxSize:{control:"number"},buttonText:{control:"text"},dropLabel:{control:"text"},uploadOnSelect:{control:"boolean"},uploadButtonText:{control:"text"}}},c=t=>{const[o,s]=i.useState([]);return e(Q,{eyebrow:"File Intake",title:"Upload surfaces should feel operationally trustworthy, not like a browser-default afterthought",description:"These stories validate pickup, drag-and-drop hierarchy, queue readability, and whether the upload contract looks at home in audit, asset, and ops workflows.",meta:[{label:"Accepts",value:t.accept},{label:"Limit",value:`${t.maxFiles} files`},{label:"Surface",value:"Picker + dropzone",tone:"success"}],children:e(p,{eyebrow:"Default Pattern",title:"Attachments",description:"The base field should work in a form without losing hierarchy or overwhelming the surrounding layout.",children:n(r,{style:{maxWidth:680,display:"grid",gap:16},children:[n("div",{style:W,children:[e("span",{style:S,children:"Validation-aware"}),e("span",{style:S,children:"Queue display"}),e("span",{style:S,children:"Form-ready"})]}),e(w,{...t,onChange:l=>s(l.map(a=>a.name))}),n(r,{style:u,children:[e("strong",{style:{color:"#0f172a"},children:"Selected files"}),e(r,{style:{color:"#64748b",fontSize:13},children:o.length?o.join(", "):"none"})]})]})})})};c.args={label:"Attachments",description:"Upload release notes, screenshots, or audit artifacts.",accept:".pdf,.png,.jpg",multiple:!0,required:!1,disabled:!1,maxFiles:4,maxSize:5e6,buttonText:"Browse files",dropLabel:"Drop files here or browse",uploadOnSelect:!1,uploadButtonText:"Start upload"};const m=()=>{const[t,o]=i.useState([]),[s,l]=i.useState({});return e(p,{eyebrow:"Operational Intake",title:"Drag-and-drop evidence capture",description:"The dropzone pattern should feel substantial enough for incident response and audit workflows, with a queue summary that stays readable as files accumulate.",children:n(x,{style:{display:"grid",gap:16,gridTemplateColumns:"minmax(320px, 1fr) minmax(260px, 320px)"},children:[e(G,{label:"Evidence bundle",description:"Optimized for drag-and-drop ingestion in incident workflows.",accept:".pdf,.csv,.json",multiple:!0,maxFiles:6,maxSize:8e6,showPreviews:!0,progress:s,onChange:a=>{o(a.map(d=>d.name));const h={};a.forEach((d,O)=>{h[`${d.name}::${d.size}::${d.lastModified}`]=Math.min(100,35+O*20)}),l(h)}}),n(r,{style:u,children:[e("strong",{style:{color:"#0f172a"},children:"Queued files"}),e(r,{style:{color:"#64748b",fontSize:13},children:t.length?t.join(", "):"Drop files to populate the queue."}),e("p",{style:b,children:"Use the side summary when the upload outcome drives a review or submission step nearby."})]})]})})};function v(t=420,o=!1){return async({signal:s,setProgress:l})=>{for(const a of[18,42,67,88,100]){if(s.aborted)throw new DOMException("Aborted","AbortError");await new Promise(h=>setTimeout(h,t/5)),l(a)}if(o)throw new Error("Server rejected this file")}}const f=()=>{const[t,o]=i.useState([]);return e(p,{eyebrow:"Upload Workflow",title:"Manual start upload with lifecycle feedback",description:"This is the production path for review or submission workflows where files should be queued first and uploaded only after user confirmation.",children:n(x,{style:{display:"grid",gap:16,gridTemplateColumns:"minmax(320px, 1fr) minmax(260px, 320px)"},children:[e(w,{label:"Release assets",description:"Queue files, then start upload when the batch is ready.",accept:".zip,.pdf,.png",multiple:!0,maxFiles:5,maxSize:12e6,uploadButtonText:"Start upload",onUploadRequest:v(),onUploadStart:()=>o(s=>["Upload started",...s].slice(0,5)),onUploadSuccess:s=>o(l=>{var a;return[`Uploaded ${(a=s.file)==null?void 0:a.name}`,...l].slice(0,5)}),onUploadError:s=>o(l=>{var a;return[`Failed ${(a=s.file)==null?void 0:a.name}: ${s.error}`,...l].slice(0,5)})}),n(r,{style:u,children:[e("strong",{style:{color:"#0f172a"},children:"Recent lifecycle events"}),e(r,{style:{color:"#64748b",fontSize:13},children:t.length?t.join(" | "):"Select files and start the upload to inspect the lifecycle."}),e("p",{style:b,children:"Use this pattern when files must be reviewed before hitting the server."})]})]})})},y=()=>{const[t,o]=i.useState("Waiting for files");return e(p,{eyebrow:"Auto Upload",title:"Automatic upload after selection",description:"This path suits messenger, support, and intake tools where the interaction should immediately start the transfer.",children:n(x,{style:{display:"grid",gap:16,gridTemplateColumns:"minmax(320px, 1fr) minmax(260px, 320px)"},children:[e(G,{label:"Incident evidence",description:"Files begin uploading as soon as they are dropped.",multiple:!0,uploadOnSelect:!0,uploadButtonText:"Uploading",onUploadRequest:v(360),onUploadStart:()=>o("Upload started"),onUploadComplete:()=>o("All uploads finished")}),n(r,{style:u,children:[e("strong",{style:{color:"#0f172a"},children:"Queue status"}),e(r,{style:{color:"#64748b",fontSize:13},children:t}),e("p",{style:b,children:"Auto-start is best when there is no separate review gate."})]})]})})},g=()=>{const[t,o]=i.useState(!0);return e(p,{eyebrow:"Recovery",title:"Failure and retry workflow",description:"A production uploader needs an honest failure path that leaves the queue actionable instead of silently resetting the file row.",children:n(x,{style:{display:"grid",gap:16,gridTemplateColumns:"minmax(320px, 1fr) minmax(260px, 320px)"},children:[e(w,{label:"Compliance package",description:"The first attempt fails, then retries succeed.",multiple:!0,uploadButtonText:"Retry uploads",onUploadRequest:async s=>{await v(320,t)(s),o(!1)}}),n(r,{style:u,children:[e("strong",{style:{color:"#0f172a"},children:"Failure contract"}),e(r,{style:{color:"#64748b",fontSize:13},children:"First run returns a server error. Use the per-file retry action or the queue-level retry button to recover."})]})]})})};var U,F,k;c.parameters={...c.parameters,docs:{...(U=c.parameters)==null?void 0:U.docs,source:{originalSource:`(args: any) => {
  const [names, setNames] = useState<string[]>([]);
  return <ShowcasePage eyebrow="File Intake" title="Upload surfaces should feel operationally trustworthy, not like a browser-default afterthought" description="These stories validate pickup, drag-and-drop hierarchy, queue readability, and whether the upload contract looks at home in audit, asset, and ops workflows." meta={[{
    label: 'Accepts',
    value: args.accept
  }, {
    label: 'Limit',
    value: \`\${args.maxFiles} files\`
  }, {
    label: 'Surface',
    value: 'Picker + dropzone',
    tone: 'success'
  }]}>
      <ShowcaseSection eyebrow="Default Pattern" title="Attachments" description="The base field should work in a form without losing hierarchy or overwhelming the surrounding layout.">
        <Box style={{
        maxWidth: 680,
        display: 'grid',
        gap: 16
      }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Validation-aware</span>
            <span style={showcaseChipStyle}>Queue display</span>
            <span style={showcaseChipStyle}>Form-ready</span>
          </div>
          <FileUpload {...args} onChange={files => setNames(files.map(file => file.name))} />
          <Box style={showcasePanelStyle}>
            <strong style={{
            color: '#0f172a'
          }}>Selected files</strong>
            <Box style={{
            color: '#64748b',
            fontSize: 13
          }}>
              {names.length ? names.join(', ') : 'none'}
            </Box>
          </Box>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>;
}`,...(k=(F=c.parameters)==null?void 0:F.docs)==null?void 0:k.source}}};var B,T,z;m.parameters={...m.parameters,docs:{...(B=m.parameters)==null?void 0:B.docs,source:{originalSource:`() => {
  const [files, setFiles] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  return <ShowcaseSection eyebrow="Operational Intake" title="Drag-and-drop evidence capture" description="The dropzone pattern should feel substantial enough for incident response and audit workflows, with a queue summary that stays readable as files accumulate.">
      <Grid style={{
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)'
    }}>
        <Dropzone label="Evidence bundle" description="Optimized for drag-and-drop ingestion in incident workflows." accept=".pdf,.csv,.json" multiple maxFiles={6} maxSize={8_000_000} showPreviews progress={progress} onChange={next => {
        setFiles(next.map(file => file.name));
        const nextProgress: Record<string, number> = {};
        next.forEach((file, index) => {
          nextProgress[\`\${file.name}::\${file.size}::\${file.lastModified}\`] = Math.min(100, 35 + index * 20);
        });
        setProgress(nextProgress);
      }} />
        <Box style={showcasePanelStyle}>
          <strong style={{
          color: '#0f172a'
        }}>Queued files</strong>
          <Box style={{
          color: '#64748b',
          fontSize: 13
        }}>
            {files.length ? files.join(', ') : 'Drop files to populate the queue.'}
          </Box>
          <p style={showcaseCaptionStyle}>Use the side summary when the upload outcome drives a review or submission step nearby.</p>
        </Box>
      </Grid>
    </ShowcaseSection>;
}`,...(z=(T=m.parameters)==null?void 0:T.docs)==null?void 0:z.source}}};var C,P,A;f.parameters={...f.parameters,docs:{...(C=f.parameters)==null?void 0:C.docs,source:{originalSource:`() => {
  const [events, setEvents] = useState<string[]>([]);
  return <ShowcaseSection eyebrow="Upload Workflow" title="Manual start upload with lifecycle feedback" description="This is the production path for review or submission workflows where files should be queued first and uploaded only after user confirmation.">
      <Grid style={{
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)'
    }}>
        <FileUpload label="Release assets" description="Queue files, then start upload when the batch is ready." accept=".zip,.pdf,.png" multiple maxFiles={5} maxSize={12_000_000} uploadButtonText="Start upload" onUploadRequest={simulateUpload()} onUploadStart={() => setEvents(current => ['Upload started', ...current].slice(0, 5))} onUploadSuccess={detail => setEvents(current => [\`Uploaded \${detail.file?.name}\`, ...current].slice(0, 5))} onUploadError={detail => setEvents(current => [\`Failed \${detail.file?.name}: \${detail.error}\`, ...current].slice(0, 5))} />
        <Box style={showcasePanelStyle}>
          <strong style={{
          color: '#0f172a'
        }}>Recent lifecycle events</strong>
          <Box style={{
          color: '#64748b',
          fontSize: 13
        }}>
            {events.length ? events.join(' | ') : 'Select files and start the upload to inspect the lifecycle.'}
          </Box>
          <p style={showcaseCaptionStyle}>Use this pattern when files must be reviewed before hitting the server.</p>
        </Box>
      </Grid>
    </ShowcaseSection>;
}`,...(A=(P=f.parameters)==null?void 0:P.docs)==null?void 0:A.source}}};var q,R,E;y.parameters={...y.parameters,docs:{...(q=y.parameters)==null?void 0:q.docs,source:{originalSource:`() => {
  const [summary, setSummary] = useState('Waiting for files');
  return <ShowcaseSection eyebrow="Auto Upload" title="Automatic upload after selection" description="This path suits messenger, support, and intake tools where the interaction should immediately start the transfer.">
      <Grid style={{
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)'
    }}>
        <Dropzone label="Incident evidence" description="Files begin uploading as soon as they are dropped." multiple uploadOnSelect uploadButtonText="Uploading" onUploadRequest={simulateUpload(360)} onUploadStart={() => setSummary('Upload started')} onUploadComplete={() => setSummary('All uploads finished')} />
        <Box style={showcasePanelStyle}>
          <strong style={{
          color: '#0f172a'
        }}>Queue status</strong>
          <Box style={{
          color: '#64748b',
          fontSize: 13
        }}>{summary}</Box>
          <p style={showcaseCaptionStyle}>Auto-start is best when there is no separate review gate.</p>
        </Box>
      </Grid>
    </ShowcaseSection>;
}`,...(E=(R=y.parameters)==null?void 0:R.docs)==null?void 0:E.source}}};var D,$,j;g.parameters={...g.parameters,docs:{...(D=g.parameters)==null?void 0:D.docs,source:{originalSource:`() => {
  const [shouldFail, setShouldFail] = useState(true);
  return <ShowcaseSection eyebrow="Recovery" title="Failure and retry workflow" description="A production uploader needs an honest failure path that leaves the queue actionable instead of silently resetting the file row.">
      <Grid style={{
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)'
    }}>
        <FileUpload label="Compliance package" description="The first attempt fails, then retries succeed." multiple uploadButtonText="Retry uploads" onUploadRequest={async context => {
        await simulateUpload(320, shouldFail)(context);
        setShouldFail(false);
      }} />
        <Box style={showcasePanelStyle}>
          <strong style={{
          color: '#0f172a'
        }}>Failure contract</strong>
          <Box style={{
          color: '#64748b',
          fontSize: 13
        }}>
            First run returns a server error. Use the per-file retry action or the queue-level retry button to recover.
          </Box>
        </Box>
      </Grid>
    </ShowcaseSection>;
}`,...(j=($=g.parameters)==null?void 0:$.docs)==null?void 0:j.source}}};const V=["Playground","DragAndDropSurface","UploadWorkflow","AutoUploadQueue","FailureAndRetry"];export{y as AutoUploadQueue,m as DragAndDropSurface,g as FailureAndRetry,c as Playground,f as UploadWorkflow,V as __namedExportsOrder,N as default};
