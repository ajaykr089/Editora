import{j as o,G as x,F as h,B as d,a as e,b as s,t as c,c as E,D as T}from"./index-ce0e40fa.js";import{R as a}from"./index-93f6b7ae.js";import{c as z,T as F,L as W,S as A,B as D,C as O}from"./index-76e7d200.js";/* empty css                          */import{S as V}from"./SearchExtension-5db95884.js";import"./index-c197feae.js";const P={title:"AI/Light Code Editor SaaS Workspace"},f=`export function buildReleasePayload(input) {
  const timestamp = new Date().toISOString();
  return {
    ...input,
    generatedAt: timestamp,
    status: "ready"
  };
}
`,M=({open:l,onClose:t})=>e(T,{open:l,title:"Code Policy Approval",description:"Approve lint and security checks before publishing snippet.",submitText:"Approve",cancelText:"Cancel",onDialogSubmit:()=>{c.success("Code policy approved",{theme:"light",duration:1200}),t()},onDialogClose:t,children:e(d,{variant:"outline",p:"10px",radius:"sm",color:"#475569",children:"Checks: naming conventions, export policy, and readonly review mode compliance."})}),u={render:()=>{const l=a.useRef(null),t=a.useRef(null),[C,R]=a.useState(0),[S,m]=a.useState(!1),[p,w]=a.useState(!1),[B,k]=a.useState(f.length);return a.useEffect(()=>{var n,r;if(l.current)return(r=(n=t.current)==null?void 0:n.destroy)==null||r.call(n),t.current=z(l.current,{value:f,theme:"dark",readOnly:p,extensions:[new F,new W,new A,new V({replaceAndFindNext:!0}),new D,new O]}),t.current.on("change",()=>{const i=t.current.getValue();k(i.length)}),()=>{var i,g;return(g=(i=t.current)==null?void 0:i.destroy)==null?void 0:g.call(i)}},[p]),o(x,{gap:"14px",style:{maxWidth:1120,margin:"0 auto",padding:8},children:[o(h,{justify:"between",align:"center",wrap:"wrap",gap:"10px",children:[o(d,{children:[e("h2",{style:{margin:0,fontSize:28,color:"#0f172a"},children:"Light Code Editor Workspace"}),e("p",{style:{margin:"6px 0 0 0",color:"#64748b"},children:"SaaS developer workspace for source review and policy-safe publishing."})]}),o(h,{gap:"8px",children:[e(s,{onClick:()=>{c.loading("Validating source...",{theme:"light",duration:850}),setTimeout(()=>c.success("Validation complete",{theme:"light",duration:1200}),900)},children:"Validate"}),e(s,{variant:"secondary",onClick:()=>{w(n=>!n),c.info(`Readonly ${p?"disabled":"enabled"}`,{theme:"light",duration:1e3})},children:"Toggle Readonly"}),e(s,{variant:"secondary",onClick:()=>m(!0),children:"Open Modal"})]})]}),o(x,{columns:{initial:"1fr",md:"1fr 1fr 1fr"},gap:"10px",children:[o(d,{variant:"surface",p:"12px",radius:"md",style:{border:"1px solid #e2e8f0"},children:[e("div",{style:{fontSize:12,color:"#64748b"},children:"Characters"}),e("div",{style:{marginTop:6,fontSize:24,fontWeight:700},children:B})]}),o(d,{variant:"surface",p:"12px",radius:"md",style:{border:"1px solid #e2e8f0"},children:[e("div",{style:{fontSize:12,color:"#64748b"},children:"Theme"}),e("div",{style:{marginTop:6,fontSize:24,fontWeight:700},children:"Dark"})]}),o(d,{variant:"surface",p:"12px",radius:"md",style:{border:"1px solid #e2e8f0"},children:[e("div",{style:{fontSize:12,color:"#64748b"},children:"Mode"}),e("div",{style:{marginTop:6,fontSize:24,fontWeight:700},children:p?"Readonly":"Editable"})]})]}),e(d,{variant:"surface",p:"12px",radius:"md",style:{border:"1px solid #e2e8f0"},children:o(E,{selected:C,variant:"soft",onChange:R,children:[e("div",{slot:"tab","data-value":"editor",children:"Editor"}),e("div",{slot:"panel",children:e("div",{ref:l,style:{minHeight:360,border:"1px solid #0f172a",borderRadius:10,overflow:"hidden"}})}),e("div",{slot:"tab","data-value":"commands",children:"Commands"}),e("div",{slot:"panel",children:o(h,{gap:"8px",wrap:"wrap",children:[e(s,{size:"sm",onClick:()=>{var n,r;return(r=(n=t.current)==null?void 0:n.executeCommand)==null?void 0:r.call(n,"find")},children:"Find"}),e(s,{size:"sm",onClick:()=>{var n,r;return(r=(n=t.current)==null?void 0:n.executeCommand)==null?void 0:r.call(n,"replace")},children:"Replace"}),e(s,{size:"sm",variant:"secondary",onClick:()=>{var n,r;(r=(n=t.current)==null?void 0:n.setValue)==null||r.call(n,f),c.success("Editor reset to starter code",{theme:"light",duration:1e3})},children:"Reset Code"})]})})]})}),e(M,{open:S,onClose:()=>m(!1)})]})}};var v,y,b;u.parameters={...u.parameters,docs:{...(v=u.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const editorRef = React.useRef<any>(null);
    const [tab, setTab] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [readonly, setReadonly] = React.useState(false);
    const [chars, setChars] = React.useState(starterCode.length);
    React.useEffect(() => {
      if (!hostRef.current) return;
      editorRef.current?.destroy?.();
      editorRef.current = createEditor(hostRef.current, {
        value: starterCode,
        theme: 'dark',
        readOnly: readonly,
        extensions: [new ThemeExtension(), new LineNumbersExtension(), new SyntaxHighlightingExtension(), new SearchExtension({
          replaceAndFindNext: true
        }), new BracketMatchingExtension(), new CodeFoldingExtension()]
      });
      editorRef.current.on('change', () => {
        const next = editorRef.current.getValue();
        setChars(next.length);
      });
      return () => editorRef.current?.destroy?.();
    }, [readonly]);
    return <Grid gap="14px" style={{
      maxWidth: 1120,
      margin: '0 auto',
      padding: 8
    }}>
        <Flex justify="between" align="center" wrap="wrap" gap="10px">
          <Box>
            <h2 style={{
            margin: 0,
            fontSize: 28,
            color: '#0f172a'
          }}>Light Code Editor Workspace</h2>
            <p style={{
            margin: '6px 0 0 0',
            color: '#64748b'
          }}>SaaS developer workspace for source review and policy-safe publishing.</p>
          </Box>
          <Flex gap="8px">
            <Button onClick={() => {
            toastAdvanced.loading('Validating source...', {
              theme: 'light',
              duration: 850
            });
            setTimeout(() => toastAdvanced.success('Validation complete', {
              theme: 'light',
              duration: 1200
            }), 900);
          }}>
              Validate
            </Button>
            <Button variant="secondary" onClick={() => {
            setReadonly(prev => !prev);
            toastAdvanced.info(\`Readonly \${!readonly ? 'enabled' : 'disabled'}\`, {
              theme: 'light',
              duration: 1000
            });
          }}>
              Toggle Readonly
            </Button>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Open Modal
            </Button>
          </Flex>
        </Flex>

        <Grid columns={{
        initial: '1fr',
        md: '1fr 1fr 1fr'
      }} gap="10px">
          <Box variant="surface" p="12px" radius="md" style={{
          border: '1px solid #e2e8f0'
        }}>
            <div style={{
            fontSize: 12,
            color: '#64748b'
          }}>Characters</div>
            <div style={{
            marginTop: 6,
            fontSize: 24,
            fontWeight: 700
          }}>{chars}</div>
          </Box>
          <Box variant="surface" p="12px" radius="md" style={{
          border: '1px solid #e2e8f0'
        }}>
            <div style={{
            fontSize: 12,
            color: '#64748b'
          }}>Theme</div>
            <div style={{
            marginTop: 6,
            fontSize: 24,
            fontWeight: 700
          }}>Dark</div>
          </Box>
          <Box variant="surface" p="12px" radius="md" style={{
          border: '1px solid #e2e8f0'
        }}>
            <div style={{
            fontSize: 12,
            color: '#64748b'
          }}>Mode</div>
            <div style={{
            marginTop: 6,
            fontSize: 24,
            fontWeight: 700
          }}>{readonly ? 'Readonly' : 'Editable'}</div>
          </Box>
        </Grid>

        <Box variant="surface" p="12px" radius="md" style={{
        border: '1px solid #e2e8f0'
      }}>
          <Tabs selected={tab} variant="soft" onChange={setTab}>
            <div slot="tab" data-value="editor">Editor</div>
            <div slot="panel">
              <div ref={hostRef} style={{
              minHeight: 360,
              border: '1px solid #0f172a',
              borderRadius: 10,
              overflow: 'hidden'
            }} />
            </div>

            <div slot="tab" data-value="commands">Commands</div>
            <div slot="panel">
              <Flex gap="8px" wrap="wrap">
                <Button size="sm" onClick={() => editorRef.current?.executeCommand?.('find')}>Find</Button>
                <Button size="sm" onClick={() => editorRef.current?.executeCommand?.('replace')}>Replace</Button>
                <Button size="sm" variant="secondary" onClick={() => {
                editorRef.current?.setValue?.(starterCode);
                toastAdvanced.success('Editor reset to starter code', {
                  theme: 'light',
                  duration: 1000
                });
              }}>
                  Reset Code
                </Button>
              </Flex>
            </div>
          </Tabs>
        </Box>

        <Modal open={open} onClose={() => setOpen(false)} />
      </Grid>;
  }
}`,...(b=(y=u.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};const _=["DeveloperCodeWorkspace"];export{u as DeveloperCodeWorkspace,_ as __namedExportsOrder,P as default};
