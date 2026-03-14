import{ad as l,a as e,j as n,B as t,G as m,ae as T}from"./index-ce0e40fa.js";import{r as p}from"./index-93f6b7ae.js";import{S as C,a as u,b as F,c as h,s as B,d as G}from"./storybook-showcase-2b62d73c.js";import"./index-c197feae.js";const z={title:"UI/DateTimeField",component:l},i=()=>{const[a,d]=p.useState("2026-03-09"),[s,D]=p.useState("09:30");return e(C,{eyebrow:"Segmented Fields",title:"Date and time fields should feel keyboard-native, not like weakened picker leftovers",description:"These stories validate segmented editing, range clamping, and whether the fields maintain clear hierarchy without depending on popup pickers.",meta:[{label:"Date range",value:"2024-2028"},{label:"Time mode",value:"12h"},{label:"Interaction",value:"Keyboard-first",tone:"success"}],children:e(u,{eyebrow:"Default Pattern",title:"Launch scheduling",description:"The paired date and time fields should feel calm and structured enough for scheduling, approvals, and release planning.",children:n(t,{style:{display:"grid",gap:16},children:[n("div",{style:F,children:[e("span",{style:h,children:"Segmented entry"}),e("span",{style:h,children:"Arrow-key stepping"}),e("span",{style:h,children:"Range-aware"})]}),n(m,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(2, minmax(260px, 1fr))"},children:[e(l,{label:"Launch date",description:"Segmented, keyboard-first date entry.",value:a,onValueChange:c=>d(c||""),min:"2024-01-01",max:"2028-12-31"}),e(T,{label:"Launch time",description:"Segmented time entry without opening a picker.",value:s,onValueChange:c=>D(c||""),format:"12h"})]}),n(t,{style:B,children:[e("strong",{style:{color:"#0f172a"},children:"Value snapshot"}),n(t,{style:{color:"#64748b",fontSize:13},children:[a||"empty"," ",s||"empty"]})]})]})})})},r=()=>e(u,{eyebrow:"Dense Form",title:"Admin entry row",description:"Segmented fields should compress into denser admin surfaces without losing clarity or making the active segment hard to track.",children:n(m,{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(2, minmax(260px, 1fr))"},children:[e(l,{label:"Maintenance window",description:"Optimized for dense forms and table editors.",value:"2026-04-12",locale:"en-GB"}),e(T,{label:"Window start",description:"24-hour segmented entry with seconds.",value:"21:45:10",seconds:!0})]})}),o=()=>{const[a,d]=p.useState("2026-03-09");return e(u,{eyebrow:"Range Behavior",title:"Bounded year",description:"This story exists to make clamping behavior obvious. When the configured range stays within one year, the year segment should remain visually stable under arrow-key input.",children:n(m,{style:{display:"grid",gap:16,maxWidth:560},children:[e(l,{label:"Contract year",description:"This example intentionally clamps the year. Arrow keys stop at the configured min/max range.",value:a,onValueChange:s=>d(s||""),min:"2026-01-01",max:"2026-12-31"}),n(t,{style:B,children:[e("strong",{style:{color:"#0f172a"},children:"Bounded value"}),e(t,{style:{color:"#64748b",fontSize:13},children:a})]}),e("p",{style:G,children:"If the range widens, the year segment should step normally again. This story shows the intentionally clamped case."})]})})};var y,g,w;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`() => {
  const [date, setDate] = useState('2026-03-09');
  const [time, setTime] = useState('09:30');
  return <ShowcasePage eyebrow="Segmented Fields" title="Date and time fields should feel keyboard-native, not like weakened picker leftovers" description="These stories validate segmented editing, range clamping, and whether the fields maintain clear hierarchy without depending on popup pickers." meta={[{
    label: 'Date range',
    value: '2024-2028'
  }, {
    label: 'Time mode',
    value: '12h'
  }, {
    label: 'Interaction',
    value: 'Keyboard-first',
    tone: 'success'
  }]}>
      <ShowcaseSection eyebrow="Default Pattern" title="Launch scheduling" description="The paired date and time fields should feel calm and structured enough for scheduling, approvals, and release planning.">
        <Box style={{
        display: 'grid',
        gap: 16
      }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Segmented entry</span>
            <span style={showcaseChipStyle}>Arrow-key stepping</span>
            <span style={showcaseChipStyle}>Range-aware</span>
          </div>
          <Grid style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))'
        }}>
            <DateField label="Launch date" description="Segmented, keyboard-first date entry." value={date} onValueChange={value => setDate(value || '')} min="2024-01-01" max="2028-12-31" />
            <TimeField label="Launch time" description="Segmented time entry without opening a picker." value={time} onValueChange={value => setTime(value || '')} format="12h" />
          </Grid>
          <Box style={showcasePanelStyle}>
            <strong style={{
            color: '#0f172a'
          }}>Value snapshot</strong>
            <Box style={{
            color: '#64748b',
            fontSize: 13
          }}>
              {date || 'empty'} {time || 'empty'}
            </Box>
          </Box>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>;
}`,...(w=(g=i.parameters)==null?void 0:g.docs)==null?void 0:w.source}}};var f,S,v;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`() => <ShowcaseSection eyebrow="Dense Form" title="Admin entry row" description="Segmented fields should compress into denser admin surfaces without losing clarity or making the active segment hard to track.">
    <Grid style={{
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))'
  }}>
      <DateField label="Maintenance window" description="Optimized for dense forms and table editors." value="2026-04-12" locale="en-GB" />
      <TimeField label="Window start" description="24-hour segmented entry with seconds." value="21:45:10" seconds />
    </Grid>
  </ShowcaseSection>`,...(v=(S=r.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var b,x,k;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`() => {
  const [date, setDate] = useState('2026-03-09');
  return <ShowcaseSection eyebrow="Range Behavior" title="Bounded year" description="This story exists to make clamping behavior obvious. When the configured range stays within one year, the year segment should remain visually stable under arrow-key input.">
      <Grid style={{
      display: 'grid',
      gap: 16,
      maxWidth: 560
    }}>
        <DateField label="Contract year" description="This example intentionally clamps the year. Arrow keys stop at the configured min/max range." value={date} onValueChange={value => setDate(value || '')} min="2026-01-01" max="2026-12-31" />
        <Box style={showcasePanelStyle}>
          <strong style={{
          color: '#0f172a'
        }}>Bounded value</strong>
          <Box style={{
          color: '#64748b',
          fontSize: 13
        }}>{date}</Box>
        </Box>
        <p style={showcaseCaptionStyle}>If the range widens, the year segment should step normally again. This story shows the intentionally clamped case.</p>
      </Grid>
    </ShowcaseSection>;
}`,...(k=(x=o.parameters)==null?void 0:x.docs)==null?void 0:k.source}}};const L=["Playground","DenseAdminEntry","BoundedRange"];export{o as BoundedRange,r as DenseAdminEntry,i as Playground,L as __namedExportsOrder,z as default};
