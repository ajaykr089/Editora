import{aQ as y,a as e,j as o,B as n,aR as s,aS as u,F as w,b as B}from"./index-ce0e40fa.js";import{r as h}from"./index-93f6b7ae.js";import{S as v,a as z,b as k,c as p,s as P,d as C}from"./storybook-showcase-2b62d73c.js";import"./index-c197feae.js";const l={inlineSize:"100%",blockSize:"100%",minInlineSize:0,minBlockSize:0,boxSizing:"border-box",borderRadius:14,border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)",background:"linear-gradient(180deg, color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, #f8fafc 4%), var(--ui-color-surface, #ffffff))",padding:16,display:"grid",gap:10},E={title:"UI/PanelGroup",component:y},r=()=>{const[a,i]=h.useState([26,46,28]),c=h.useMemo(()=>a.map(d=>`${Math.round(d)}%`).join(" / "),[a]);return e(v,{eyebrow:"Resizable Layout",title:"Panel groups should feel architectural, not like a demo-only splitter",description:"These stories validate surface hierarchy, persisted layout behavior, and whether the resizable shell still looks deliberate when populated with real product content.",meta:[{label:"Persistence",value:"Enabled",tone:"success"},{label:"Panels",value:"3"},{label:"Current layout",value:c}],children:e(z,{eyebrow:"Workspace Shell",title:"Three-panel editing layout",description:"This pattern is for application shells where navigation, workspace, and metadata all need a clear but adjustable relationship.",children:o(n,{style:{display:"grid",gap:16},children:[o("div",{style:k,children:[e("span",{style:p,children:"Persisted layout"}),e("span",{style:p,children:"Three-panel shell"}),e("span",{style:p,children:"Production app chrome"})]}),o(y,{style:{blockSize:460},storageKey:"storybook-workspace-shell",autoSave:!0,onLayoutChange:d=>i(d.sizes),children:[e(s,{size:26,minSize:18,maxSize:40,children:o(n,{style:l,children:[e("strong",{children:"Signal queue"}),e(n,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"Triage board, alert filters, and incident routing live in this narrow rail."}),o(n,{style:{display:"grid",gap:8},children:[e(n,{style:{padding:10,borderRadius:10,background:"color-mix(in srgb, #2563eb 10%, transparent)"},children:"Escalations"}),e(n,{style:{padding:10,borderRadius:10,background:"color-mix(in srgb, #0f172a 5%, transparent)"},children:"Policies"}),e(n,{style:{padding:10,borderRadius:10,background:"color-mix(in srgb, #16a34a 10%, transparent)"},children:"Automations"})]})]})}),e(u,{ariaLabel:"Resize navigation and workspace"}),e(s,{size:46,minSize:28,children:o(n,{style:l,children:[e("strong",{children:"Active workspace"}),e(n,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"Primary editing surface with enough width to show why panel persistence matters."}),e(n,{style:{padding:14,borderRadius:12,background:"color-mix(in srgb, #0f172a 4%, transparent)",minBlockSize:220},children:"Draft response plan, live metrics, and annotations."})]})}),e(u,{ariaLabel:"Resize workspace and inspector"}),e(s,{size:28,minSize:18,collapsedSize:8,children:o(n,{style:l,children:[e("strong",{children:"Inspector"}),e(n,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"Metadata, ownership, audit trail, and task assignment."}),o(n,{style:{display:"grid",gap:8},children:[e(n,{style:{padding:10,borderRadius:10,background:"color-mix(in srgb, #f59e0b 12%, transparent)"},children:"Severity: P1"}),e(n,{style:{padding:10,borderRadius:10,background:"color-mix(in srgb, #ef4444 10%, transparent)"},children:"SLA at risk"})]})]})})]})]})})})},t=()=>{const[a,i]=h.useState(!1);return e(z,{eyebrow:"Console Stack",title:"Collapsible console",description:"Vertical panel groups should feel just as resolved as horizontal shells, especially when used for editor and console pairings.",children:o(n,{style:{display:"grid",gap:16},children:[o(w,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12},children:[o(n,{children:[e("strong",{children:"Analysis shell"}),e(n,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:12},children:"Vertical panel layouts work for console-and-output stacks as well."})]}),e(B,{onClick:()=>i(c=>!c),variant:"secondary",children:a?"Expand console":"Collapse console"})]}),o(y,{orientation:"vertical",style:{blockSize:440},children:[e(s,{size:68,minSize:42,children:o(n,{style:l,children:[e("strong",{children:"Query composer"}),e(n,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"Main editor surface with stacked tool output below it."}),e(n,{style:{minBlockSize:180,borderRadius:12,background:"color-mix(in srgb, #0f172a 4%, transparent)"}})]})}),e(u,{ariaLabel:"Resize editor and console"}),e(s,{size:32,minSize:18,collapsed:a,collapsedSize:8,children:o(n,{style:l,children:[e("strong",{children:"Execution console"}),e(n,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"Persisted logs, validation results, and post-run diagnostics."}),o(n,{style:{fontFamily:"IBM Plex Mono, monospace",fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:["09:42 validate schema",e("br",{}),"09:43 compile assets",e("br",{}),"09:44 publish preview"]})]})})]}),o(n,{style:P,children:[e("strong",{style:{color:"#0f172a"},children:"Why this pattern matters"}),e("p",{style:C,children:"Console regions need a believable collapsed state because they spend most of their time secondary to the primary editing surface."})]})]})})};var b,g,m;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`() => {
  const [sizes, setSizes] = useState<number[]>([26, 46, 28]);
  const summary = useMemo(() => sizes.map(size => \`\${Math.round(size)}%\`).join(' / '), [sizes]);
  return <ShowcasePage eyebrow="Resizable Layout" title="Panel groups should feel architectural, not like a demo-only splitter" description="These stories validate surface hierarchy, persisted layout behavior, and whether the resizable shell still looks deliberate when populated with real product content." meta={[{
    label: 'Persistence',
    value: 'Enabled',
    tone: 'success'
  }, {
    label: 'Panels',
    value: '3'
  }, {
    label: 'Current layout',
    value: summary
  }]}>
      <ShowcaseSection eyebrow="Workspace Shell" title="Three-panel editing layout" description="This pattern is for application shells where navigation, workspace, and metadata all need a clear but adjustable relationship.">
        <Box style={{
        display: 'grid',
        gap: 16
      }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Persisted layout</span>
            <span style={showcaseChipStyle}>Three-panel shell</span>
            <span style={showcaseChipStyle}>Production app chrome</span>
          </div>
          <PanelGroup style={{
          blockSize: 460
        }} storageKey="storybook-workspace-shell" autoSave={true} onLayoutChange={detail => setSizes(detail.sizes)}>
            <Panel size={26} minSize={18} maxSize={40}>
              <Box style={panelShell}>
                <strong>Signal queue</strong>
                <Box style={{
                color: 'var(--ui-color-muted, #64748b)',
                fontSize: 13
              }}>
                  Triage board, alert filters, and incident routing live in this narrow rail.
                </Box>
                <Box style={{
                display: 'grid',
                gap: 8
              }}>
                  <Box style={{
                  padding: 10,
                  borderRadius: 10,
                  background: 'color-mix(in srgb, #2563eb 10%, transparent)'
                }}>Escalations</Box>
                  <Box style={{
                  padding: 10,
                  borderRadius: 10,
                  background: 'color-mix(in srgb, #0f172a 5%, transparent)'
                }}>Policies</Box>
                  <Box style={{
                  padding: 10,
                  borderRadius: 10,
                  background: 'color-mix(in srgb, #16a34a 10%, transparent)'
                }}>Automations</Box>
                </Box>
              </Box>
            </Panel>
            <Splitter ariaLabel="Resize navigation and workspace" />
            <Panel size={46} minSize={28}>
              <Box style={panelShell}>
                <strong>Active workspace</strong>
                <Box style={{
                color: 'var(--ui-color-muted, #64748b)',
                fontSize: 13
              }}>
                  Primary editing surface with enough width to show why panel persistence matters.
                </Box>
                <Box style={{
                padding: 14,
                borderRadius: 12,
                background: 'color-mix(in srgb, #0f172a 4%, transparent)',
                minBlockSize: 220
              }}>
                  Draft response plan, live metrics, and annotations.
                </Box>
              </Box>
            </Panel>
            <Splitter ariaLabel="Resize workspace and inspector" />
            <Panel size={28} minSize={18} collapsedSize={8}>
              <Box style={panelShell}>
                <strong>Inspector</strong>
                <Box style={{
                color: 'var(--ui-color-muted, #64748b)',
                fontSize: 13
              }}>
                  Metadata, ownership, audit trail, and task assignment.
                </Box>
                <Box style={{
                display: 'grid',
                gap: 8
              }}>
                  <Box style={{
                  padding: 10,
                  borderRadius: 10,
                  background: 'color-mix(in srgb, #f59e0b 12%, transparent)'
                }}>Severity: P1</Box>
                  <Box style={{
                  padding: 10,
                  borderRadius: 10,
                  background: 'color-mix(in srgb, #ef4444 10%, transparent)'
                }}>SLA at risk</Box>
                </Box>
              </Box>
            </Panel>
          </PanelGroup>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>;
}`,...(m=(g=r.parameters)==null?void 0:g.docs)==null?void 0:m.source}}};var S,x,f;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`() => {
  const [collapsed, setCollapsed] = useState(false);
  return <ShowcaseSection eyebrow="Console Stack" title="Collapsible console" description="Vertical panel groups should feel just as resolved as horizontal shells, especially when used for editor and console pairings.">
      <Box style={{
      display: 'grid',
      gap: 16
    }}>
        <Flex style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12
      }}>
          <Box>
            <strong>Analysis shell</strong>
            <Box style={{
            color: 'var(--ui-color-muted, #64748b)',
            fontSize: 12
          }}>
              Vertical panel layouts work for console-and-output stacks as well.
            </Box>
          </Box>
          <Button onClick={() => setCollapsed(value => !value)} variant="secondary">
            {collapsed ? 'Expand console' : 'Collapse console'}
          </Button>
        </Flex>

        <PanelGroup orientation="vertical" style={{
        blockSize: 440
      }}>
          <Panel size={68} minSize={42}>
            <Box style={panelShell}>
              <strong>Query composer</strong>
              <Box style={{
              color: 'var(--ui-color-muted, #64748b)',
              fontSize: 13
            }}>
                Main editor surface with stacked tool output below it.
              </Box>
              <Box style={{
              minBlockSize: 180,
              borderRadius: 12,
              background: 'color-mix(in srgb, #0f172a 4%, transparent)'
            }} />
            </Box>
          </Panel>
          <Splitter ariaLabel="Resize editor and console" />
          <Panel size={32} minSize={18} collapsed={collapsed} collapsedSize={8}>
            <Box style={panelShell}>
              <strong>Execution console</strong>
              <Box style={{
              color: 'var(--ui-color-muted, #64748b)',
              fontSize: 13
            }}>
                Persisted logs, validation results, and post-run diagnostics.
              </Box>
              <Box style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 12,
              color: 'var(--ui-color-muted, #64748b)'
            }}>
                09:42 validate schema
                <br />
                09:43 compile assets
                <br />
                09:44 publish preview
              </Box>
            </Box>
          </Panel>
        </PanelGroup>
        <Box style={showcasePanelStyle}>
          <strong style={{
          color: '#0f172a'
        }}>Why this pattern matters</strong>
          <p style={showcaseCaptionStyle}>Console regions need a believable collapsed state because they spend most of their time secondary to the primary editing surface.</p>
        </Box>
      </Box>
    </ShowcaseSection>;
}`,...(f=(x=t.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};const T=["WorkspaceShell","CollapsibleConsole"];export{t as CollapsibleConsole,r as WorkspaceShell,T as __namedExportsOrder,E as default};
