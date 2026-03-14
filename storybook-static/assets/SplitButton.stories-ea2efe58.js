import{bm as o,a as e,j as s,B as i}from"./index-ce0e40fa.js";import{R as r}from"./index-93f6b7ae.js";import{S as L,a as l,b as I,c as S,d as v,s as z,f as M}from"./storybook-showcase-2b62d73c.js";import"./index-c197feae.js";const _={title:"UI/SplitButton",component:o};function c({value:a}){return s("div",{style:{...z,gap:8},children:[e("div",{style:{fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#64748b"},children:"Last action"}),e("div",{style:{fontSize:15,color:"#0f172a"},children:e("code",{style:M,children:a||"(none)"})})]})}function f(){return[{value:"schedule",label:"Schedule publish",description:"Queue this update for the next release window.",shortcut:"⌘K"},{value:"duplicate",label:"Duplicate release",description:"Fork the current draft into a new release candidate."},{value:"archive",label:"Archive draft",description:"Remove the draft from the active publishing queue."}]}const d=()=>{const[a,n]=r.useState("");return e(L,{eyebrow:"Primary Pattern",title:"Split button with a clear primary action and an attached command menu",description:"The trigger should feel decisive, while the menu reads like the same product family rather than a generic dropdown bolted onto the side.",meta:[{label:"Variant",value:"Primary"},{label:"Density",value:"Comfortable"},{label:"Menu",value:"Attached surface",tone:"success"}],children:e(l,{eyebrow:"Workspace Actions",title:"Release workflow",description:"This is the baseline production pattern for publish flows, approvals, and workspace actions that have one dominant path plus a few adjacent commands.",children:s(i,{style:{display:"grid",gap:16,maxWidth:560},children:[s("div",{style:I,children:[e("span",{style:S,children:"Primary emphasis"}),e("span",{style:S,children:"Attached menu"}),e("span",{style:S,children:"Shortcut support"})]}),e(o,{label:"Publish update",menuHeading:"Publish workflow",menuDescription:"Choose the next release action without leaving the editor.",items:f(),onSelect:t=>n(t.value||"")}),e("p",{style:v,children:"Use this treatment when one action should carry most of the visual weight and the alternates are secondary."}),e(c,{value:a})]})})})},u=()=>{const[a,n]=r.useState("");return e(l,{eyebrow:"Neutral Toolbar",title:"Low-emphasis split action",description:"A flatter, quieter shell for inspector panels, rails, and dense application chrome where the control still needs menu affordance without dominating the layout.",children:s(i,{style:{display:"grid",gap:16,maxWidth:580},children:[e(o,{label:"Create issue",menuHeading:"Issue actions",menuDescription:"Use the primary action for a standard issue or switch to an alternate workflow.",variant:"neutral",items:[{value:"bug",label:"Create bug",description:"Capture a defect with triage defaults.",shortcut:"B"},{value:"incident",label:"Create incident",description:"Open a high-priority incident workflow.",shortcut:"I"},{value:"followup",label:"Create follow-up",description:"Spawn a linked task after a review."}],onSelect:t=>n(t.value||"")}),e(c,{value:a})]})})},p=()=>{const[a,n]=r.useState("");return e(l,{eyebrow:"Decision Pattern",title:"High-contrast split action",description:"A stronger treatment for review or approval flows where the primary action needs confidence but dangerous alternatives must still remain visible and well-separated.",children:s(i,{style:{display:"grid",gap:16,maxWidth:580},children:[e(o,{label:"Resolve request",menuHeading:"Review decision",menuDescription:"Promote the approved path as primary and keep destructive actions clearly separated.",variant:"contrast",items:[{value:"approve",label:"Approve and close",description:"Complete the review and notify stakeholders.",shortcut:"↵"},{value:"request-changes",label:"Request changes",description:"Send the item back with actionable feedback."},{value:"reject",label:"Reject request",description:"Permanently reject this submission.",tone:"danger",shortcut:"⌥⌫"}],onSelect:t=>n(t.value||"")}),e(c,{value:a})]})})},h=()=>{const[a,n]=r.useState("");return e(l,{eyebrow:"Compact Rail",title:"Dense utility action",description:"Compact density should still preserve touch targets, shortcut legibility, and menu rhythm. This variation exists for side rails and analytics toolbars.",children:s(i,{style:{display:"grid",gap:16,maxWidth:540},children:[e(o,{label:"Export",menuHeading:"Export format",menuDescription:"Compact treatment for dense toolbars and admin rails.",density:"compact",items:[{value:"pdf",label:"Export as PDF",description:"Print-friendly shareable document.",shortcut:"P"},{value:"csv",label:"Export as CSV",description:"Structured data for spreadsheets."},{value:"json",label:"Export as JSON",description:"Raw system payload for integrations."}],onSelect:t=>n(t.value||"")}),e(c,{value:a})]})})},m=()=>{const[a,n]=r.useState("");return e(l,{eyebrow:"Flat Pattern",title:"Low-radius, low-chrome split action",description:"This is the flatter product language for tables, editors, and admin workspaces where the control should feel integrated into the surrounding frame instead of elevated above it.",children:s(i,{style:{display:"grid",gap:16,maxWidth:580},children:[e(o,{label:"Save changes",menuHeading:"Save options",menuDescription:"Flat treatment for dense productivity views and inspector panels.",variant:"flat",menuShape:"flat",items:[{value:"save",label:"Save now",description:"Persist current changes immediately.",shortcut:"⌘S"},{value:"save-close",label:"Save and close",description:"Commit and return to the list view."},{value:"discard",label:"Discard draft",description:"Revert unpublished local changes.",tone:"danger"}],onSelect:t=>n(t.value||"")}),e(c,{value:a})]})})},y=()=>{const[a,n]=r.useState("");return e(l,{eyebrow:"Menu Rhythm",title:"Listbox density variations",description:"The menu should scale across flat, standard, and premium surfaces without breaking the relationship between button shell and menu content.",children:s(i,{style:{display:"grid",gap:20},children:[s("div",{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))"},children:[s(i,{style:{display:"grid",gap:12},children:[e("div",{style:{fontSize:13,fontWeight:700,color:"#475569"},children:"Flat"}),e("p",{style:v,children:"Tight list density for flatter workhorse layouts."}),e(o,{label:"Flat menu",menuHeading:"Flat commands",menuDescription:"Tight, low-noise listbox treatment.",variant:"flat",menuDensity:"compact",menuShape:"flat",items:f(),onSelect:t=>n(t.value||"")})]}),s(i,{style:{display:"grid",gap:12},children:[e("div",{style:{fontSize:13,fontWeight:700,color:"#475569"},children:"Comfortable"}),e("p",{style:v,children:"Balanced default for most dashboard and editor surfaces."}),e(o,{label:"Comfortable menu",menuHeading:"Comfortable commands",menuDescription:"Balanced default for most app surfaces.",items:f(),onSelect:t=>n(t.value||"")})]}),s(i,{style:{display:"grid",gap:12},children:[e("div",{style:{fontSize:13,fontWeight:700,color:"#475569"},children:"Airy"}),e("p",{style:v,children:"Looser spacing for premium actions and lower-frequency menus."}),e(o,{label:"Airy menu",menuHeading:"Airy commands",menuDescription:"Looser listbox rhythm for premium dashboard actions.",menuDensity:"airy",menuShape:"soft",items:f(),onSelect:t=>n(t.value||"")})]})]}),e(c,{value:a})]})})};var b,w,g;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`() => {
  const [selected, setSelected] = React.useState('');
  return <ShowcasePage eyebrow="Primary Pattern" title="Split button with a clear primary action and an attached command menu" description="The trigger should feel decisive, while the menu reads like the same product family rather than a generic dropdown bolted onto the side." meta={[{
    label: 'Variant',
    value: 'Primary'
  }, {
    label: 'Density',
    value: 'Comfortable'
  }, {
    label: 'Menu',
    value: 'Attached surface',
    tone: 'success'
  }]}>
      <ShowcaseSection eyebrow="Workspace Actions" title="Release workflow" description="This is the baseline production pattern for publish flows, approvals, and workspace actions that have one dominant path plus a few adjacent commands.">
        <Box style={{
        display: 'grid',
        gap: 16,
        maxWidth: 560
      }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Primary emphasis</span>
            <span style={showcaseChipStyle}>Attached menu</span>
            <span style={showcaseChipStyle}>Shortcut support</span>
          </div>
          <SplitButton label="Publish update" menuHeading="Publish workflow" menuDescription="Choose the next release action without leaving the editor." items={baseItems()} onSelect={detail => setSelected(detail.value || '')} />
          <p style={showcaseCaptionStyle}>
            Use this treatment when one action should carry most of the visual weight and the alternates are secondary.
          </p>
          <ActionEcho value={selected} />
        </Box>
      </ShowcaseSection>
    </ShowcasePage>;
}`,...(g=(w=d.parameters)==null?void 0:w.docs)==null?void 0:g.source}}};var x,C,B;u.parameters={...u.parameters,docs:{...(x=u.parameters)==null?void 0:x.docs,source:{originalSource:`() => {
  const [selected, setSelected] = React.useState('');
  return <ShowcaseSection eyebrow="Neutral Toolbar" title="Low-emphasis split action" description="A flatter, quieter shell for inspector panels, rails, and dense application chrome where the control still needs menu affordance without dominating the layout.">
      <Box style={{
      display: 'grid',
      gap: 16,
      maxWidth: 580
    }}>
        <SplitButton label="Create issue" menuHeading="Issue actions" menuDescription="Use the primary action for a standard issue or switch to an alternate workflow." variant="neutral" items={[{
        value: 'bug',
        label: 'Create bug',
        description: 'Capture a defect with triage defaults.',
        shortcut: 'B'
      }, {
        value: 'incident',
        label: 'Create incident',
        description: 'Open a high-priority incident workflow.',
        shortcut: 'I'
      }, {
        value: 'followup',
        label: 'Create follow-up',
        description: 'Spawn a linked task after a review.'
      }]} onSelect={detail => setSelected(detail.value || '')} />
        <ActionEcho value={selected} />
      </Box>
    </ShowcaseSection>;
}`,...(B=(C=u.parameters)==null?void 0:C.docs)==null?void 0:B.source}}};var k,D,R;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`() => {
  const [selected, setSelected] = React.useState('');
  return <ShowcaseSection eyebrow="Decision Pattern" title="High-contrast split action" description="A stronger treatment for review or approval flows where the primary action needs confidence but dangerous alternatives must still remain visible and well-separated.">
      <Box style={{
      display: 'grid',
      gap: 16,
      maxWidth: 580
    }}>
        <SplitButton label="Resolve request" menuHeading="Review decision" menuDescription="Promote the approved path as primary and keep destructive actions clearly separated." variant="contrast" items={[{
        value: 'approve',
        label: 'Approve and close',
        description: 'Complete the review and notify stakeholders.',
        shortcut: '↵'
      }, {
        value: 'request-changes',
        label: 'Request changes',
        description: 'Send the item back with actionable feedback.'
      }, {
        value: 'reject',
        label: 'Reject request',
        description: 'Permanently reject this submission.',
        tone: 'danger',
        shortcut: '⌥⌫'
      }]} onSelect={detail => setSelected(detail.value || '')} />
        <ActionEcho value={selected} />
      </Box>
    </ShowcaseSection>;
}`,...(R=(D=p.parameters)==null?void 0:D.docs)==null?void 0:R.source}}};var P,A,T;h.parameters={...h.parameters,docs:{...(P=h.parameters)==null?void 0:P.docs,source:{originalSource:`() => {
  const [selected, setSelected] = React.useState('');
  return <ShowcaseSection eyebrow="Compact Rail" title="Dense utility action" description="Compact density should still preserve touch targets, shortcut legibility, and menu rhythm. This variation exists for side rails and analytics toolbars.">
      <Box style={{
      display: 'grid',
      gap: 16,
      maxWidth: 540
    }}>
        <SplitButton label="Export" menuHeading="Export format" menuDescription="Compact treatment for dense toolbars and admin rails." density="compact" items={[{
        value: 'pdf',
        label: 'Export as PDF',
        description: 'Print-friendly shareable document.',
        shortcut: 'P'
      }, {
        value: 'csv',
        label: 'Export as CSV',
        description: 'Structured data for spreadsheets.'
      }, {
        value: 'json',
        label: 'Export as JSON',
        description: 'Raw system payload for integrations.'
      }]} onSelect={detail => setSelected(detail.value || '')} />
        <ActionEcho value={selected} />
      </Box>
    </ShowcaseSection>;
}`,...(T=(A=h.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};var W,E,H;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`() => {
  const [selected, setSelected] = React.useState('');
  return <ShowcaseSection eyebrow="Flat Pattern" title="Low-radius, low-chrome split action" description="This is the flatter product language for tables, editors, and admin workspaces where the control should feel integrated into the surrounding frame instead of elevated above it.">
      <Box style={{
      display: 'grid',
      gap: 16,
      maxWidth: 580
    }}>
        <SplitButton label="Save changes" menuHeading="Save options" menuDescription="Flat treatment for dense productivity views and inspector panels." variant="flat" menuShape="flat" items={[{
        value: 'save',
        label: 'Save now',
        description: 'Persist current changes immediately.',
        shortcut: '⌘S'
      }, {
        value: 'save-close',
        label: 'Save and close',
        description: 'Commit and return to the list view.'
      }, {
        value: 'discard',
        label: 'Discard draft',
        description: 'Revert unpublished local changes.',
        tone: 'danger'
      }]} onSelect={detail => setSelected(detail.value || '')} />
        <ActionEcho value={selected} />
      </Box>
    </ShowcaseSection>;
}`,...(H=(E=m.parameters)==null?void 0:E.docs)==null?void 0:H.source}}};var F,j,q;y.parameters={...y.parameters,docs:{...(F=y.parameters)==null?void 0:F.docs,source:{originalSource:`() => {
  const [selected, setSelected] = React.useState('');
  return <ShowcaseSection eyebrow="Menu Rhythm" title="Listbox density variations" description="The menu should scale across flat, standard, and premium surfaces without breaking the relationship between button shell and menu content.">
      <Box style={{
      display: 'grid',
      gap: 20
    }}>
        <div style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
      }}>
          <Box style={{
          display: 'grid',
          gap: 12
        }}>
            <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#475569'
          }}>Flat</div>
            <p style={showcaseCaptionStyle}>Tight list density for flatter workhorse layouts.</p>
            <SplitButton label="Flat menu" menuHeading="Flat commands" menuDescription="Tight, low-noise listbox treatment." variant="flat" menuDensity="compact" menuShape="flat" items={baseItems()} onSelect={detail => setSelected(detail.value || '')} />
          </Box>

          <Box style={{
          display: 'grid',
          gap: 12
        }}>
            <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#475569'
          }}>Comfortable</div>
            <p style={showcaseCaptionStyle}>Balanced default for most dashboard and editor surfaces.</p>
            <SplitButton label="Comfortable menu" menuHeading="Comfortable commands" menuDescription="Balanced default for most app surfaces." items={baseItems()} onSelect={detail => setSelected(detail.value || '')} />
          </Box>

          <Box style={{
          display: 'grid',
          gap: 12
        }}>
            <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#475569'
          }}>Airy</div>
            <p style={showcaseCaptionStyle}>Looser spacing for premium actions and lower-frequency menus.</p>
            <SplitButton label="Airy menu" menuHeading="Airy commands" menuDescription="Looser listbox rhythm for premium dashboard actions." menuDensity="airy" menuShape="soft" items={baseItems()} onSelect={detail => setSelected(detail.value || '')} />
          </Box>
        </div>
        <ActionEcho value={selected} />
      </Box>
    </ShowcaseSection>;
}`,...(q=(j=y.parameters)==null?void 0:j.docs)==null?void 0:q.source}}};const J=["WorkspaceActions","NeutralToolbar","DestructiveReview","CompactUtilityRail","FlatActions","MenuListboxVariations"];export{h as CompactUtilityRail,p as DestructiveReview,m as FlatActions,y as MenuListboxVariations,u as NeutralToolbar,d as WorkspaceActions,J as __namedExportsOrder,_ as default};
