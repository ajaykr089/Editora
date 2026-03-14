import{aN as t,a as e,j as n,B as c,G as s}from"./index-ce0e40fa.js";import{r as f}from"./index-93f6b7ae.js";import{S as _,a as r,b as U,c as y,s as v,d as S}from"./storybook-showcase-2b62d73c.js";import"./index-c197feae.js";const o=[{value:"ops",label:"Operations",description:"Incident response and escalations"},{value:"security",label:"Security",description:"Threat review and approvals"},{value:"platform",label:"Platform",description:"Infrastructure and tooling"},{value:"support",label:"Support",description:"Customer-facing coordination"}],H=[{label:"Core response",options:[{value:"ops",label:"Operations",description:"Incident response and escalations"},{value:"security",label:"Security",description:"Threat review and approvals"}]},{label:"Platform delivery",options:[{value:"platform",label:"Platform",description:"Infrastructure and tooling"},{value:"support",label:"Support",description:"Customer-facing coordination"}]}],J=Array.from({length:320},(i,a)=>({value:`team-${a+1}`,label:`Team ${a+1}`,description:`Operational slice ${a+1}`})),ee={title:"UI/MultiSelect",component:t,argTypes:{selectionIndicator:{control:"radio",options:["checkbox","check","none"]},optionBorder:{control:"boolean"},variant:{control:"select",options:["default","surface","soft","solid","outline","flat","contrast"]},tone:{control:"select",options:["default","neutral","info","success","warning","danger"]},density:{control:"select",options:["default","compact","comfortable"]},radius:{control:"text"},optionRadius:{control:"text"},elevation:{control:"select",options:["none","low","high"]},size:{control:"select",options:["sm","md","lg","1","2","3"]},clearable:{control:"boolean"},loading:{control:"boolean"},readOnly:{control:"boolean"},disabled:{control:"boolean"}}},l=i=>{const[a,K]=f.useState(["ops","security"]);return e(_,{eyebrow:"Composed Selection",title:"Multi-select should behave like a serious filter control, not a stitched-together tag input",description:"These stories validate token rhythm, searchable listbox behavior, and how selected values stay legible when the control becomes dense.",meta:[{label:"Pattern",value:"Filter + tokens"},{label:"Indicator",value:i.selectionIndicator},{label:"Selection",value:`${a.length} active`}],children:e(r,{eyebrow:"Default Pattern",title:"Owning teams",description:"The default treatment should feel clean enough for dashboards and structured enough for admin forms.",children:n(c,{style:{display:"grid",gap:16,maxWidth:680},children:[n("div",{style:U,children:[e("span",{style:y,children:"Searchable"}),e("span",{style:y,children:"Tokenized"}),e("span",{style:y,children:"Indicator optional"})]}),e(t,{...i,label:"Owning teams",description:"Composed from listbox and token selection behavior.",options:o,value:a,onValueChange:K,placeholder:"Filter teams"}),n("div",{style:v,children:[e("strong",{style:{color:"#0f172a"},children:"Selected teams"}),e("div",{style:{color:"#64748b",fontSize:13},children:a.length?a.join(", "):"No teams selected"})]})]})})})};l.args={selectionIndicator:"checkbox",optionBorder:!1,variant:"surface",tone:"default",density:"default",radius:12,optionRadius:10,elevation:"low",size:"md",clearable:!0,loading:!1,readOnly:!1,disabled:!1};const d=()=>e(r,{eyebrow:"Selection Affordance",title:"Indicator modes",description:"Some products want checkbox-like options, some want a lighter checkmark, and some want no leading affordance at all.",children:n(s,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))"},children:[e(t,{label:"Checkbox indicator",options:o,value:["ops"],selectionIndicator:"checkbox"}),e(t,{label:"Check indicator",options:o,value:["security"],selectionIndicator:"check"}),e(t,{label:"No indicator",options:o,value:["platform"],selectionIndicator:"none"})]})}),p=()=>e(r,{eyebrow:"Option Geometry",title:"Option radius",description:"Option rows can follow the shell radius or use their own tighter or softer corners depending on the density of the menu.",children:n(s,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))"},children:[e(t,{label:"Sharp rows",options:o,value:["ops"],optionRadius:0,optionBorder:!0,clearable:!0}),e(t,{label:"Default rows",options:o,value:["security"],optionRadius:10,clearable:!0}),e(t,{label:"Soft rows",options:o,value:["platform"],optionRadius:16,clearable:!0}),e(t,{label:"Pill rows",options:o,value:["support"],optionRadius:"full",clearable:!0})]})}),u=()=>{const[i,a]=f.useState(["platform"]);return e(r,{eyebrow:"Operational States",title:"Production state coverage",description:"The component should hold up in disabled, readonly, loading, invalid, and constrained-selection scenarios.",children:n(s,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))"},children:[e(t,{label:"Readonly review",description:"Selected values stay visible, but no changes can be made.",options:o,value:["ops","security"],readOnly:!0}),e(t,{label:"Loading remote teams",description:"Used while async filters or server results are being refreshed.",options:o,value:[],loading:!0,loadingText:"Refreshing available teams...",clearable:!0}),e(t,{label:"Invalid selection",description:"Required filter with no selected owners.",options:o,value:[],required:!0,error:"At least one owning team is required.",tone:"danger"}),e(t,{label:"Max constrained",description:"Keeps the most recent two selections.",options:o,value:i,onValueChange:a,maxSelections:2,clearable:!0}),e(t,{label:"Disabled",description:"Locked after workflow finalization.",options:o,value:["support"],disabled:!0})]})})},m=()=>e(r,{eyebrow:"Visual System",title:"Variant, density, and shape gallery",description:"These patterns cover the main product contexts: filters, console rails, minimal in-table controls, and contrast-heavy admin shells.",children:n(s,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))"},children:[e(t,{label:"Surface default",options:o,value:["ops"],variant:"surface"}),e(t,{label:"Soft warning",options:o,value:["security"],variant:"soft",tone:"warning"}),e(t,{label:"Solid compact",options:o,value:["platform"],variant:"solid",density:"compact",size:"sm"}),e(t,{label:"Flat no indicator",options:o,value:["support"],variant:"flat",selectionIndicator:"none"}),e(t,{label:"Contrast shell",options:o,value:["ops"],variant:"contrast",radius:16}),e(t,{label:"Comfortable outline",options:o,value:["security"],density:"comfortable",variant:"outline",radius:0,size:"lg"})]})}),h=()=>{const[i,a]=f.useState(["platform"]);return e(r,{eyebrow:"Operational Form",title:"Dense filter builder",description:"This pattern is for settings pages and incident tooling where the selected values need to remain readable alongside their downstream meaning.",children:n(s,{style:{display:"grid",gap:16,gridTemplateColumns:"minmax(320px, 1fr) minmax(260px, 320px)"},children:[e(t,{label:"Escalation policy",description:"Tokenized selection with searchable options.",options:o,value:i,onValueChange:a,placeholder:"Add teams",maxSelections:3,density:"compact",clearable:!0}),n(c,{style:v,children:[e("strong",{style:{color:"#0f172a"},children:"Selected values"}),e(c,{style:{color:"#64748b",fontSize:13},children:i.length?i.join(", "):"No teams selected"}),e("p",{style:S,children:"Keep the summary adjacent when the selected values change downstream rules or routing."})]})]})})},g=()=>e(r,{eyebrow:"Enterprise Structure",title:"Grouped options",description:"Large organizations rarely present flat team lists. Grouped sections keep taxonomy readable without giving up the same selection model.",children:n(c,{style:{maxWidth:640,display:"grid",gap:14},children:[e(t,{label:"Response partners",description:"Grouped by operating function.",options:H,value:["security"],selectionIndicator:"check",clearable:!0}),e("p",{style:S,children:"The grouped rendering path is intended for enterprise routing, ownership, and taxonomy-driven filters."})]})}),b=()=>e(r,{eyebrow:"Performance Guard",title:"Large dataset fallback",description:"For big option sets, the control caps rendered rows and asks the user to keep narrowing the query instead of dumping hundreds of live buttons.",children:n(s,{style:{display:"grid",gap:16,gridTemplateColumns:"minmax(320px, 1fr) minmax(260px, 320px)"},children:[e(t,{label:"Service ownership",description:"Large catalog path with render limiting.",options:J,value:[],renderLimit:40,clearable:!0,placeholder:"Search 320 services"}),n(c,{style:v,children:[e("strong",{style:{color:"#0f172a"},children:"Why this exists"}),e("p",{style:S,children:"This is the current performance guard: render a bounded subset, preserve search, and guide the user to narrow the result set."})]})]})});var w,x,O;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`(args: any) => {
  const [value, setValue] = useState<string[]>(['ops', 'security']);
  return <ShowcasePage eyebrow="Composed Selection" title="Multi-select should behave like a serious filter control, not a stitched-together tag input" description="These stories validate token rhythm, searchable listbox behavior, and how selected values stay legible when the control becomes dense." meta={[{
    label: 'Pattern',
    value: 'Filter + tokens'
  }, {
    label: 'Indicator',
    value: args.selectionIndicator
  }, {
    label: 'Selection',
    value: \`\${value.length} active\`
  }]}>
      <ShowcaseSection eyebrow="Default Pattern" title="Owning teams" description="The default treatment should feel clean enough for dashboards and structured enough for admin forms.">
        <Box style={{
        display: 'grid',
        gap: 16,
        maxWidth: 680
      }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Searchable</span>
            <span style={showcaseChipStyle}>Tokenized</span>
            <span style={showcaseChipStyle}>Indicator optional</span>
          </div>
          <MultiSelect {...args} label="Owning teams" description="Composed from listbox and token selection behavior." options={teamOptions} value={value} onValueChange={setValue} placeholder="Filter teams" />
          <div style={showcasePanelStyle}>
            <strong style={{
            color: '#0f172a'
          }}>Selected teams</strong>
            <div style={{
            color: '#64748b',
            fontSize: 13
          }}>
              {value.length ? value.join(', ') : 'No teams selected'}
            </div>
          </div>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>;
}`,...(O=(x=l.parameters)==null?void 0:x.docs)==null?void 0:O.source}}};var k,C,T;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="Selection Affordance" title="Indicator modes" description="Some products want checkbox-like options, some want a lighter checkmark, and some want no leading affordance at all.">
    <Grid style={{
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
  }}>
      <MultiSelect label="Checkbox indicator" options={teamOptions} value={['ops']} selectionIndicator="checkbox" />
      <MultiSelect label="Check indicator" options={teamOptions} value={['security']} selectionIndicator="check" />
      <MultiSelect label="No indicator" options={teamOptions} value={['platform']} selectionIndicator="none" />
    </Grid>
  </ShowcaseSection>`,...(T=(C=d.parameters)==null?void 0:C.docs)==null?void 0:T.source}}};var M,G,I;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="Option Geometry" title="Option radius" description="Option rows can follow the shell radius or use their own tighter or softer corners depending on the density of the menu.">
    <Grid style={{
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
  }}>
      <MultiSelect label="Sharp rows" options={teamOptions} value={['ops']} optionRadius={0} optionBorder clearable />
      <MultiSelect label="Default rows" options={teamOptions} value={['security']} optionRadius={10} clearable />
      <MultiSelect label="Soft rows" options={teamOptions} value={['platform']} optionRadius={16} clearable />
      <MultiSelect label="Pill rows" options={teamOptions} value={['support']} optionRadius="full" clearable />
    </Grid>
  </ShowcaseSection>`,...(I=(G=p.parameters)==null?void 0:G.docs)==null?void 0:I.source}}};var P,R,z;u.parameters={...u.parameters,docs:{...(P=u.parameters)==null?void 0:P.docs,source:{originalSource:`() => {
  const [active, setActive] = useState<string[]>(['platform']);
  return <ShowcaseSection eyebrow="Operational States" title="Production state coverage" description="The component should hold up in disabled, readonly, loading, invalid, and constrained-selection scenarios.">
      <Grid style={{
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
    }}>
        <MultiSelect label="Readonly review" description="Selected values stay visible, but no changes can be made." options={teamOptions} value={['ops', 'security']} readOnly />
        <MultiSelect label="Loading remote teams" description="Used while async filters or server results are being refreshed." options={teamOptions} value={[]} loading loadingText="Refreshing available teams..." clearable />
        <MultiSelect label="Invalid selection" description="Required filter with no selected owners." options={teamOptions} value={[]} required error="At least one owning team is required." tone="danger" />
        <MultiSelect label="Max constrained" description="Keeps the most recent two selections." options={teamOptions} value={active} onValueChange={setActive} maxSelections={2} clearable />
        <MultiSelect label="Disabled" description="Locked after workflow finalization." options={teamOptions} value={['support']} disabled />
      </Grid>
    </ShowcaseSection>;
}`,...(z=(R=u.parameters)==null?void 0:R.docs)==null?void 0:z.source}}};var B,V,L;m.parameters={...m.parameters,docs:{...(B=m.parameters)==null?void 0:B.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="Visual System" title="Variant, density, and shape gallery" description="These patterns cover the main product contexts: filters, console rails, minimal in-table controls, and contrast-heavy admin shells.">
    <Grid style={{
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
  }}>
      <MultiSelect label="Surface default" options={teamOptions} value={['ops']} variant="surface" />
      <MultiSelect label="Soft warning" options={teamOptions} value={['security']} variant="soft" tone="warning" />
      <MultiSelect label="Solid compact" options={teamOptions} value={['platform']} variant="solid" density="compact" size="sm" />
      <MultiSelect label="Flat no indicator" options={teamOptions} value={['support']} variant="flat" selectionIndicator="none" />
      <MultiSelect label="Contrast shell" options={teamOptions} value={['ops']} variant="contrast" radius={16} />
      <MultiSelect label="Comfortable outline" options={teamOptions} value={['security']} density="comfortable" variant="outline" radius={0} size="lg" />
    </Grid>
  </ShowcaseSection>`,...(L=(V=m.parameters)==null?void 0:V.docs)==null?void 0:L.source}}};var D,F,A;h.parameters={...h.parameters,docs:{...(D=h.parameters)==null?void 0:D.docs,source:{originalSource:`() => {
  const [value, setValue] = useState<string[]>(['platform']);
  return <ShowcaseSection eyebrow="Operational Form" title="Dense filter builder" description="This pattern is for settings pages and incident tooling where the selected values need to remain readable alongside their downstream meaning.">
      <Grid style={{
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)'
    }}>
        <MultiSelect label="Escalation policy" description="Tokenized selection with searchable options." options={teamOptions} value={value} onValueChange={setValue} placeholder="Add teams" maxSelections={3} density="compact" clearable />
        <Box style={showcasePanelStyle}>
          <strong style={{
          color: '#0f172a'
        }}>Selected values</strong>
          <Box style={{
          color: '#64748b',
          fontSize: 13
        }}>
            {value.length ? value.join(', ') : 'No teams selected'}
          </Box>
          <p style={showcaseCaptionStyle}>Keep the summary adjacent when the selected values change downstream rules or routing.</p>
        </Box>
      </Grid>
    </ShowcaseSection>;
}`,...(A=(F=h.parameters)==null?void 0:F.docs)==null?void 0:A.source}}};var j,q,W;g.parameters={...g.parameters,docs:{...(j=g.parameters)==null?void 0:j.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="Enterprise Structure" title="Grouped options" description="Large organizations rarely present flat team lists. Grouped sections keep taxonomy readable without giving up the same selection model.">
    <Box style={{
    maxWidth: 640,
    display: 'grid',
    gap: 14
  }}>
      <MultiSelect label="Response partners" description="Grouped by operating function." options={groupedOptions} value={['security']} selectionIndicator="check" clearable />
      <p style={showcaseCaptionStyle}>The grouped rendering path is intended for enterprise routing, ownership, and taxonomy-driven filters.</p>
    </Box>
  </ShowcaseSection>`,...(W=(q=g.parameters)==null?void 0:q.docs)==null?void 0:W.source}}};var N,E,$;b.parameters={...b.parameters,docs:{...(N=b.parameters)==null?void 0:N.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="Performance Guard" title="Large dataset fallback" description="For big option sets, the control caps rendered rows and asks the user to keep narrowing the query instead of dumping hundreds of live buttons.">
    <Grid style={{
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)'
  }}>
      <MultiSelect label="Service ownership" description="Large catalog path with render limiting." options={largeOptions} value={[]} renderLimit={40} clearable placeholder="Search 320 services" />
      <Box style={showcasePanelStyle}>
        <strong style={{
        color: '#0f172a'
      }}>Why this exists</strong>
        <p style={showcaseCaptionStyle}>This is the current performance guard: render a bounded subset, preserve search, and guide the user to narrow the result set.</p>
      </Box>
    </Grid>
  </ShowcaseSection>`,...($=(E=b.parameters)==null?void 0:E.docs)==null?void 0:$.source}}};const te=["Playground","IndicatorModes","OptionRadiusGallery","StateMatrix","VariantGallery","DenseFilterBuilder","GroupedWorkflow","LargeDataset"];export{h as DenseFilterBuilder,g as GroupedWorkflow,d as IndicatorModes,b as LargeDataset,p as OptionRadiusGallery,l as Playground,u as StateMatrix,m as VariantGallery,te as __namedExportsOrder,ee as default};
