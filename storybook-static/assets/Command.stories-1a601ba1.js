import{a7 as y,a as e,j as a,G as g,B as t}from"./index-ce0e40fa.js";import{r as i}from"./index-93f6b7ae.js";import{S,a as f,b,c as r,s as w,d as k}from"./storybook-showcase-2b62d73c.js";import"./index-c197feae.js";const x={maxWidth:680,marginInline:"auto"},n={display:"grid",gap:2},o={fontSize:11,color:"var(--ui-color-muted, #64748b)"},L={title:"UI/Command",component:y},s=()=>{const[l,u]=i.useState("none"),[c,v]=i.useState("");return e(S,{eyebrow:"Command Primitive",title:"Command surfaces should feel crisp, fast, and deeply navigable",description:"This story exists to validate the lower-level command pattern beneath palettes and search-driven action surfaces.",meta:[{label:"Search state",value:c?"Active":"Idle"},{label:"Last command",value:l},{label:"Pattern",value:"Keyboard-first",tone:"success"}],children:e(f,{eyebrow:"Workspace Actions",title:"Command list",description:"A command surface should read like a precision tool. Search, match, and selection feedback all need clear rhythm and hierarchy.",children:a(g,{style:{display:"grid",gap:16},children:[a("div",{style:b,children:[e("span",{style:r,children:"Search-driven"}),e("span",{style:r,children:"Listbox-backed"}),e("span",{style:r,children:"Action oriented"})]}),e(t,{style:x,children:a(y,{placeholder:"Search workspace actions...",emptyText:"No matching commands in this workspace.",onQueryChange:v,onSelect:d=>{u(d.value||d.label)},children:[a("div",{slot:"command","data-value":"open-file","data-keywords":"file open workspace",style:n,children:[e("strong",{children:"Open file"}),e("span",{style:o,children:"Jump to a document or asset in the current workspace."})]}),a("div",{slot:"command","data-value":"rename-symbol","data-keywords":"rename refactor symbol",style:n,children:[e("strong",{children:"Rename symbol"}),e("span",{style:o,children:"Safely update references across the current project."})]}),a("div",{slot:"command","data-value":"format-document","data-keywords":"format prettier code",style:n,children:[e("strong",{children:"Format document"}),e("span",{style:o,children:"Apply the shared formatting policy to the active editor."})]}),a("div",{slot:"command","data-value":"toggle-sidebar","data-keywords":"sidebar navigation layout",style:n,children:[e("strong",{children:"Toggle sidebar"}),e("span",{style:o,children:"Show or hide the surrounding navigation chrome."})]})]})}),a(t,{style:{...w,maxWidth:680,marginInline:"auto"},children:[e("strong",{style:{color:"#0f172a"},children:"Command state"}),a(t,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:["Query: ",c||"empty"]}),a(t,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:["Last selected: ",l]}),e("p",{style:k,children:"The surrounding panel gives a stable place to inspect match and selection behavior during refinement."})]})]})})})};var m,h,p;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const [lastSelected, setLastSelected] = useState('none');
  const [query, setQuery] = useState('');
  return <ShowcasePage eyebrow="Command Primitive" title="Command surfaces should feel crisp, fast, and deeply navigable" description="This story exists to validate the lower-level command pattern beneath palettes and search-driven action surfaces." meta={[{
    label: 'Search state',
    value: query ? 'Active' : 'Idle'
  }, {
    label: 'Last command',
    value: lastSelected
  }, {
    label: 'Pattern',
    value: 'Keyboard-first',
    tone: 'success'
  }]}>
      <ShowcaseSection eyebrow="Workspace Actions" title="Command list" description="A command surface should read like a precision tool. Search, match, and selection feedback all need clear rhythm and hierarchy.">
        <Grid style={{
        display: 'grid',
        gap: 16
      }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Search-driven</span>
            <span style={showcaseChipStyle}>Listbox-backed</span>
            <span style={showcaseChipStyle}>Action oriented</span>
          </div>
          <Box style={commandSurface}>
            <Command placeholder="Search workspace actions..." emptyText="No matching commands in this workspace." onQueryChange={setQuery} onSelect={detail => {
            setLastSelected(detail.value || detail.label);
          }}>
              <div slot="command" data-value="open-file" data-keywords="file open workspace" style={commandItem}>
                <strong>Open file</strong>
                <span style={commandMeta}>Jump to a document or asset in the current workspace.</span>
              </div>
              <div slot="command" data-value="rename-symbol" data-keywords="rename refactor symbol" style={commandItem}>
                <strong>Rename symbol</strong>
                <span style={commandMeta}>Safely update references across the current project.</span>
              </div>
              <div slot="command" data-value="format-document" data-keywords="format prettier code" style={commandItem}>
                <strong>Format document</strong>
                <span style={commandMeta}>Apply the shared formatting policy to the active editor.</span>
              </div>
              <div slot="command" data-value="toggle-sidebar" data-keywords="sidebar navigation layout" style={commandItem}>
                <strong>Toggle sidebar</strong>
                <span style={commandMeta}>Show or hide the surrounding navigation chrome.</span>
              </div>
            </Command>
          </Box>

          <Box style={{
          ...showcasePanelStyle,
          maxWidth: 680,
          marginInline: 'auto'
        }}>
            <strong style={{
            color: '#0f172a'
          }}>Command state</strong>
            <Box style={{
            color: 'var(--ui-color-muted, #64748b)',
            fontSize: 13
          }}>
              Query: {query || 'empty'}
            </Box>
            <Box style={{
            color: 'var(--ui-color-muted, #64748b)',
            fontSize: 13
          }}>
              Last selected: {lastSelected}
            </Box>
            <p style={showcaseCaptionStyle}>The surrounding panel gives a stable place to inspect match and selection behavior during refinement.</p>
          </Box>
        </Grid>
      </ShowcaseSection>
    </ShowcasePage>;
}`,...(p=(h=s.parameters)==null?void 0:h.docs)==null?void 0:p.source}}};const P=["WorkspaceActions"];export{s as WorkspaceActions,P as __namedExportsOrder,L as default};
