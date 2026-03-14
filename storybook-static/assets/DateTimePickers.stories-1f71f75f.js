import{a as e,B as a,j as n,G as l,l as r,Q as g,R as x,U as ie,V as G,W as R,b as ce}from"./index-c1b18327.js";import{R as o}from"./index-93f6b7ae.js";const me={title:"UI/Date Time Pickers"};function pe(t){o.useEffect(()=>{if(!t||typeof window>"u")return;const i=window.matchMedia,s=u=>u.includes("(max-width: 639px)")?{matches:!0,media:u,onchange:null,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return!1}}:i.call(window,u);return window.matchMedia=s,()=>{window.matchMedia=i}},[t])}const v=()=>{const[t,i]=o.useState("2026-02-23");return e(a,{w:"min(560px, 100%)",variant:"elevated",p:"14px",radius:"xl",children:n(l,{gap:"10px",children:[e(r,{tone:"brand",children:"Single date picker"}),e(g,{hint:"Accepts ISO and locale-like input.",value:t||void 0,min:"2026-01-01",max:"2026-12-31",onValueChange:s=>i(s),clearable:!0,bare:!0,showFooter:!1}),n(a,{bg:"surface",p:"10px",radius:"lg",children:["Current value: ",t||"null"]})]})})},m=()=>{const[t,i]=o.useState("2026-08-14"),[s,u]=o.useState("");return n(l,{gap:"12px",style:{maxWidth:960},children:[e(a,{variant:"elevated",p:"16px",radius:"xl",children:n(l,{gap:"8px",children:[e(r,{tone:"brand",children:"Enterprise date picker states"}),e(a,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:"14px"},children:"Includes loading/success visuals, square + soft shape variants, and reversed min/max safety."})]})}),n(l,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"12px"},children:[e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"info",children:"Default"}),e(g,{label:"Procedure date",hint:"Normal popover interaction",value:t||void 0,clearable:!0,onValueChange:c=>i(c),onInvalid:c=>u(c.reason)})]})}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"warning",children:"Loading"}),e(g,{label:"Syncing schedule",state:"loading",hint:"Interaction is blocked while loading.",value:t||void 0,shape:"square"})]})}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"success",children:"Success + Soft"}),e(g,{label:"Confirmed date",state:"success",hint:"Soft corners for dashboard surfaces.",value:t||void 0,shape:"soft"})]})})]}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"danger",children:"Edge case: reversed bounds"}),e(g,{label:"Auto-corrected bounds",hint:"`min` is intentionally later than `max`; component normalizes internally.",min:"2026-12-31",max:"2026-01-01",defaultValue:"2026-06-15",clearable:!0}),n(a,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:"12px"},children:["Last invalid reason: ",s||"none"]})]})})]})},h=()=>{const[t,i]=o.useState('{"start":"2026-02-10","end":"2026-02-18"}');return e(a,{w:"min(760px, 100%)",variant:"elevated",p:"14px",radius:"xl",children:n(l,{gap:"10px",children:[e(r,{tone:"success",children:"Date range picker"}),e(x,{label:"Billing cycle",hint:"Choose a range for reports.",value:t,rangeVariant:"two-fields",closeOnSelect:!1,onValueChange:s=>i(s||""),bare:!0,showFooter:!1}),n(a,{bg:"surface",p:"10px",radius:"lg",children:["Current value: ",t||"null"]})]})})},f=()=>{const[t,i]=o.useState('{"start":"2026-09-01","end":"2026-09-07"}'),[s,u]=o.useState("");return n(l,{gap:"12px",style:{maxWidth:980},children:[e(a,{variant:"elevated",p:"16px",radius:"xl",children:n(l,{gap:"8px",children:[e(r,{tone:"brand",children:"Enterprise date range states"}),e(a,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:"14px"},children:"Covers loading/success states, single-field parsing, and reversed min/max normalization."})]})}),n(l,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"12px"},children:[e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"info",children:"Two-field default"}),e(x,{label:"Coverage window",hint:"Operational range for claims analysis.",value:t,onValueChange:c=>i(c||""),onInvalid:c=>u(c.reason),clearable:!0})]})}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"warning",children:"Loading + square"}),e(x,{label:"Syncing date range",hint:"Inputs/actions are blocked during background sync.",value:t,state:"loading",shape:"square"})]})}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"success",children:"Single-field + soft"}),e(x,{label:"Review range",hint:"Single-field parser accepts: `Sep 1 2026 — Sep 7 2026`.",value:t,rangeVariant:"single-field",state:"success",shape:"soft"})]})})]}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"danger",children:"Edge case: reversed bounds + strict rules"}),e(x,{label:"Strict range",hint:"`min` is later than `max`, and same-day/partial ranges are disabled.",min:"2026-12-31",max:"2026-01-01",defaultValue:'{"start":"2026-06-15","end":"2026-06-20"}',allowPartial:!1,allowSameDay:!1,clearable:!0}),n(a,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:"12px"},children:["Last invalid reason: ",s||"none"]})]})})]})},b=()=>{const[t,i]=o.useState("09:30");return e(a,{w:"min(560px, 100%)",variant:"elevated",p:"14px",radius:"xl",children:n(l,{gap:"10px",children:[e(r,{tone:"warning",children:"Time picker"}),e(ie,{label:"Shift start",hint:"Arrow up/down steps by configured minutes.",value:t||void 0,format:"24h",step:5,min:"06:00",max:"23:00",onValueChange:s=>i(s)}),n(a,{bg:"surface",p:"10px",radius:"lg",children:["Current value: ",t||"null"]})]})})},B=()=>{const[t,i]=o.useState("2026-02-23T09:30");return e(a,{w:"min(760px, 100%)",variant:"elevated",p:"14px",radius:"xl",children:n(l,{gap:"10px",children:[e(r,{tone:"brand",children:"Date-time picker"}),e(G,{label:"Procedure schedule",value:t||void 0,step:10,min:"2026-02-01T08:00",max:"2026-03-15T20:00",onValueChange:s=>i(s)}),n(a,{bg:"surface",p:"10px",radius:"lg",children:["Current value: ",t||"null"]})]})})},S=()=>{const[t,i]=o.useState('{"start":"2026-02-23T09:00","end":"2026-02-23T12:30"}');return e(a,{w:"min(860px, 100%)",variant:"elevated",p:"14px",radius:"xl",children:n(l,{gap:"10px",children:[e(r,{tone:"danger",children:"Range date-time picker"}),e(R,{label:"Operating room slot",hint:"Complete range with date and time.",value:t,step:15,autoNormalize:!0,allowPartial:!1,min:"2026-02-01T06:00",max:"2026-12-31T23:00",onValueChange:s=>i(s||"")}),n(a,{bg:"surface",p:"10px",radius:"lg",children:["Current value: ",t||"null"]})]})})},V=()=>{const[t,i]=o.useState("2026-04-10"),[s,u]=o.useState('{"start":"2026-04-08","end":"2026-04-14"}'),[c,w]=o.useState("2026-04-10T10:30"),[C,k]=o.useState('{"start":"2026-04-10T08:00","end":"2026-04-10T12:00"}');return n(l,{gap:"12px",style:{maxWidth:1100},children:[e(a,{variant:"elevated",p:"16px",radius:"xl",children:n(l,{gap:"8px",children:[e(r,{tone:"brand",children:"`bare` + `showFooter` configuration"}),n(a,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:"14px"},children:["Use ",e("code",{children:"bare"})," for flat/no-panel chrome and ",e("code",{children:"showFooter"})," to control actions. Calendar-only inline layouts use ",e("code",{children:"showFooter={false}"}),"."]})]})}),n(l,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:"12px"},children:[e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"info",children:"Date picker: calendar-only"}),e(g,{mode:"inline",bare:!0,showFooter:!1,label:"Flat admission calendar",value:t||void 0,onValueChange:p=>i(p)})]})}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"success",children:"Range picker: calendar-only"}),e(x,{mode:"inline",bare:!0,showFooter:!1,label:"Flat reporting range",value:s,onValueChange:p=>u(p||"")})]})}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"warning",children:"Date-time: flat with actions"}),e(G,{mode:"inline",bare:!0,showFooter:!0,label:"Flat schedule editor",value:c||void 0,step:10,onValueChange:p=>w(p)})]})}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"danger",children:"Range date-time: flat + no footer"}),e(R,{mode:"inline",bare:!0,showFooter:!1,label:"Flat operating slot",value:C,step:15,onValueChange:p=>k(p||"")})]})})]})]})},T=()=>{const[t,i]=o.useState("en-US"),[s,u]=o.useState("2026-05-14"),[c,w]=o.useState('{"start":"2026-05-10","end":"2026-05-18"}'),[C,k]=o.useState("14:30"),[p,se]=o.useState("2026-05-14T14:30"),[oe,de]=o.useState('{"start":"2026-05-14T09:00","end":"2026-05-14T12:30"}'),ue=JSON.stringify({fr:{today:"Aujourd hui (Clinique)",apply:"Valider",clear:"Reinitialiser",startTime:"Debut de service",endTime:"Fin de service"}});return n(l,{gap:"12px",style:{maxWidth:1100},children:[e(a,{variant:"elevated",p:"16px",radius:"xl",children:n(l,{gap:"10px",children:[e(r,{tone:"brand",children:"Localization demo"}),e(a,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:"14px"},children:"Built-in localization supports English, Chinese, and French. Switch locale and inspect calendar labels, time labels, and action text."}),e(l,{style:{display:"flex",gap:"8px",flexWrap:"wrap"},children:[{value:"en-US",label:"English"},{value:"zh-CN",label:"Chinese"},{value:"fr-FR",label:"French"}].map(d=>e(ce,{size:"sm",variant:t===d.value?void 0:"secondary",onClick:()=>i(d.value),children:d.label},d.value))})]})}),n(l,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:"12px"},children:[e(a,{variant:"elevated",p:"14px",radius:"lg",children:e(g,{label:"Admission date",locale:t,value:s||void 0,onValueChange:d=>u(d),clearable:!0})}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:e(x,{label:"Billing range",locale:t,value:c,onValueChange:d=>w(d||""),closeOnSelect:!1})}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:e(ie,{label:"Shift start",locale:t,value:C||void 0,onValueChange:d=>k(d),clearable:!0})}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:e(G,{label:"Procedure schedule",locale:t,value:p||void 0,onValueChange:d=>se(d),step:10})}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:e(R,{label:"Operating slot",locale:t,value:oe,onValueChange:d=>de(d||""),step:15,closeOnSelect:!1})})]}),e(a,{variant:"elevated",p:"14px",radius:"lg",children:n(l,{gap:"8px",children:[e(r,{tone:"info",children:"Custom translation override (French)"}),e(R,{locale:"fr-FR",label:"Bloc operatoire",value:'{"start":"2026-05-20T08:00","end":"2026-05-20T11:00"}',translations:ue,step:15,closeOnSelect:!1})]})})]})},y=()=>{pe(!0);const[t,i]=o.useState("2026-02-23");return e(a,{w:"360px",variant:"elevated",p:"14px",radius:"xl",children:n(l,{gap:"10px",children:[e(r,{tone:"brand",children:"Forced mobile sheet preview"}),e(g,{label:"Mobile sheet date picker",value:t||void 0,onValueChange:s=>i(s),closeOnSelect:!1,hint:"This story forces mobile media query to validate bottom-sheet spacing."}),e(x,{label:"Mobile range picker",value:'{"start":"2026-02-20","end":"2026-02-24"}',closeOnSelect:!1,hint:"Check footer actions and scroll-lock behavior."})]})})};var D,F,P;v.parameters={...v.parameters,docs:{...(D=v.parameters)==null?void 0:D.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState<string | null>('2026-02-23');
  return <Box w="min(560px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="brand">Single date picker</Badge>
        <DatePicker
      // label="Admission date"
      hint="Accepts ISO and locale-like input." value={value || undefined} min="2026-01-01" max="2026-12-31" onValueChange={(next: any) => setValue(next)} clearable bare showFooter={false} />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || "null"}
        </Box>
      </Grid>
    </Box>;
}`,...(P=(F=v.parameters)==null?void 0:F.docs)==null?void 0:P.source}}};var z,O,E;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState<string | null>('2026-08-14');
  const [invalidReason, setInvalidReason] = React.useState('');
  return <Grid gap="12px" style={{
    maxWidth: 960
  }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="8px">
          <Badge tone="brand">Enterprise date picker states</Badge>
          <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: '14px'
        }}>
            Includes loading/success visuals, square + soft shape variants, and reversed min/max safety.
          </Box>
        </Grid>
      </Box>

      <Grid style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '12px'
    }}>
        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="info">Default</Badge>
            <DatePicker label="Procedure date" hint="Normal popover interaction" value={value || undefined} clearable onValueChange={next => setValue(next)} onInvalid={detail => setInvalidReason(detail.reason)} />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="warning">Loading</Badge>
            <DatePicker label="Syncing schedule" state="loading" hint="Interaction is blocked while loading." value={value || undefined} shape="square" />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="success">Success + Soft</Badge>
            <DatePicker label="Confirmed date" state="success" hint="Soft corners for dashboard surfaces." value={value || undefined} shape="soft" />
          </Grid>
        </Box>
      </Grid>

      <Box variant="elevated" p="14px" radius="lg">
        <Grid gap="8px">
          <Badge tone="danger">Edge case: reversed bounds</Badge>
          <DatePicker label="Auto-corrected bounds" hint="\`min\` is intentionally later than \`max\`; component normalizes internally." min="2026-12-31" max="2026-01-01" defaultValue="2026-06-15" clearable />
          <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: '12px'
        }}>
            Last invalid reason: {invalidReason || 'none'}
          </Box>
        </Grid>
      </Box>
    </Grid>;
}`,...(E=(O=m.parameters)==null?void 0:O.docs)==null?void 0:E.source}}};var I,L,A;h.parameters={...h.parameters,docs:{...(I=h.parameters)==null?void 0:I.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState('{"start":"2026-02-10","end":"2026-02-18"}');
  return <Box w="min(760px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="success">Date range picker</Badge>
        <DateRangePicker label="Billing cycle" hint="Choose a range for reports." value={value} rangeVariant="two-fields" closeOnSelect={false} onValueChange={next => setValue(next || "")} bare showFooter={false} />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || "null"}
        </Box>
      </Grid>
    </Box>;
}`,...(A=(L=h.parameters)==null?void 0:L.docs)==null?void 0:A.source}}};var M,W,q;f.parameters={...f.parameters,docs:{...(M=f.parameters)==null?void 0:M.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState('{"start":"2026-09-01","end":"2026-09-07"}');
  const [invalidReason, setInvalidReason] = React.useState('');
  return <Grid gap="12px" style={{
    maxWidth: 980
  }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="8px">
          <Badge tone="brand">Enterprise date range states</Badge>
          <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: '14px'
        }}>
            Covers loading/success states, single-field parsing, and reversed min/max normalization.
          </Box>
        </Grid>
      </Box>

      <Grid style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '12px'
    }}>
        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="info">Two-field default</Badge>
            <DateRangePicker label="Coverage window" hint="Operational range for claims analysis." value={value} onValueChange={next => setValue(next || '')} onInvalid={detail => setInvalidReason(detail.reason)} clearable />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="warning">Loading + square</Badge>
            <DateRangePicker label="Syncing date range" hint="Inputs/actions are blocked during background sync." value={value} state="loading" shape="square" />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="success">Single-field + soft</Badge>
            <DateRangePicker label="Review range" hint="Single-field parser accepts: \`Sep 1 2026 — Sep 7 2026\`." value={value} rangeVariant="single-field" state="success" shape="soft" />
          </Grid>
        </Box>
      </Grid>

      <Box variant="elevated" p="14px" radius="lg">
        <Grid gap="8px">
          <Badge tone="danger">Edge case: reversed bounds + strict rules</Badge>
          <DateRangePicker label="Strict range" hint="\`min\` is later than \`max\`, and same-day/partial ranges are disabled." min="2026-12-31" max="2026-01-01" defaultValue='{"start":"2026-06-15","end":"2026-06-20"}' allowPartial={false} allowSameDay={false} clearable />
          <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: '12px'
        }}>
            Last invalid reason: {invalidReason || 'none'}
          </Box>
        </Grid>
      </Box>
    </Grid>;
}`,...(q=(W=f.parameters)==null?void 0:W.docs)==null?void 0:q.source}}};var N,U,j;b.parameters={...b.parameters,docs:{...(N=b.parameters)==null?void 0:N.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState<string | null>('09:30');
  return <Box w="min(560px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="warning">Time picker</Badge>
        <TimePicker label="Shift start" hint="Arrow up/down steps by configured minutes." value={value || undefined} format="24h" step={5} min="06:00" max="23:00" onValueChange={next => setValue(next)} />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>;
}`,...(j=(U=b.parameters)==null?void 0:U.docs)==null?void 0:j.source}}};var _,J,Q;B.parameters={...B.parameters,docs:{...(_=B.parameters)==null?void 0:_.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState<string | null>('2026-02-23T09:30');
  return <Box w="min(760px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="brand">Date-time picker</Badge>
        <DateTimePicker label="Procedure schedule" value={value || undefined} step={10} min="2026-02-01T08:00" max="2026-03-15T20:00" onValueChange={next => setValue(next)} />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>;
}`,...(Q=(J=B.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var H,K,X;S.parameters={...S.parameters,docs:{...(H=S.parameters)==null?void 0:H.docs,source:{originalSource:`() => {
  const [value, setValue] = React.useState('{"start":"2026-02-23T09:00","end":"2026-02-23T12:30"}');
  return <Box w="min(860px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="danger">Range date-time picker</Badge>
        <DateRangeTimePicker label="Operating room slot" hint="Complete range with date and time." value={value} step={15} autoNormalize allowPartial={false} min="2026-02-01T06:00" max="2026-12-31T23:00" onValueChange={next => setValue(next || '')} />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>;
}`,...(X=(K=S.parameters)==null?void 0:K.docs)==null?void 0:X.source}}};var Y,Z,$;V.parameters={...V.parameters,docs:{...(Y=V.parameters)==null?void 0:Y.docs,source:{originalSource:`() => {
  const [singleValue, setSingleValue] = React.useState<string | null>('2026-04-10');
  const [rangeValue, setRangeValue] = React.useState('{"start":"2026-04-08","end":"2026-04-14"}');
  const [dateTimeValue, setDateTimeValue] = React.useState<string | null>('2026-04-10T10:30');
  const [rangeTimeValue, setRangeTimeValue] = React.useState('{"start":"2026-04-10T08:00","end":"2026-04-10T12:00"}');
  return <Grid gap="12px" style={{
    maxWidth: 1100
  }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="8px">
          <Badge tone="brand">\`bare\` + \`showFooter\` configuration</Badge>
          <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: '14px'
        }}>
            Use <code>bare</code> for flat/no-panel chrome and <code>showFooter</code> to control actions.
            Calendar-only inline layouts use <code>showFooter=&#123;false&#125;</code>.
          </Box>
        </Grid>
      </Box>

      <Grid style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '12px'
    }}>
        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="info">Date picker: calendar-only</Badge>
            <DatePicker mode="inline" bare showFooter={false} label="Flat admission calendar" value={singleValue || undefined} onValueChange={next => setSingleValue(next)} />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="success">Range picker: calendar-only</Badge>
            <DateRangePicker mode="inline" bare showFooter={false} label="Flat reporting range" value={rangeValue} onValueChange={next => setRangeValue(next || '')} />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="warning">Date-time: flat with actions</Badge>
            <DateTimePicker mode="inline" bare showFooter label="Flat schedule editor" value={dateTimeValue || undefined} step={10} onValueChange={next => setDateTimeValue(next)} />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="danger">Range date-time: flat + no footer</Badge>
            <DateRangeTimePicker mode="inline" bare showFooter={false} label="Flat operating slot" value={rangeTimeValue} step={15} onValueChange={next => setRangeTimeValue(next || '')} />
          </Grid>
        </Box>
      </Grid>
    </Grid>;
}`,...($=(Z=V.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,ae,ne;T.parameters={...T.parameters,docs:{...(ee=T.parameters)==null?void 0:ee.docs,source:{originalSource:`() => {
  const [locale, setLocale] = React.useState<'en-US' | 'zh-CN' | 'fr-FR'>('en-US');
  const [dateValue, setDateValue] = React.useState<string | null>('2026-05-14');
  const [rangeValue, setRangeValue] = React.useState('{"start":"2026-05-10","end":"2026-05-18"}');
  const [timeValue, setTimeValue] = React.useState<string | null>('14:30');
  const [dateTimeValue, setDateTimeValue] = React.useState<string | null>('2026-05-14T14:30');
  const [rangeTimeValue, setRangeTimeValue] = React.useState('{"start":"2026-05-14T09:00","end":"2026-05-14T12:30"}');
  const customFrenchTranslations = JSON.stringify({
    fr: {
      today: 'Aujourd hui (Clinique)',
      apply: 'Valider',
      clear: 'Reinitialiser',
      startTime: 'Debut de service',
      endTime: 'Fin de service'
    }
  });
  const localeOptions: Array<{
    value: 'en-US' | 'zh-CN' | 'fr-FR';
    label: string;
  }> = [{
    value: 'en-US',
    label: 'English'
  }, {
    value: 'zh-CN',
    label: 'Chinese'
  }, {
    value: 'fr-FR',
    label: 'French'
  }];
  return <Grid gap="12px" style={{
    maxWidth: 1100
  }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="10px">
          <Badge tone="brand">Localization demo</Badge>
          <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: '14px'
        }}>
            Built-in localization supports English, Chinese, and French. Switch locale and inspect calendar labels,
            time labels, and action text.
          </Box>
          <Grid style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
            {localeOptions.map(option => <Button key={option.value} size="sm" variant={locale === option.value ? undefined : 'secondary'} onClick={() => setLocale(option.value)}>
                {option.label}
              </Button>)}
          </Grid>
        </Grid>
      </Box>

      <Grid style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '12px'
    }}>
        <Box variant="elevated" p="14px" radius="lg">
          <DatePicker label="Admission date" locale={locale} value={dateValue || undefined} onValueChange={next => setDateValue(next)} clearable />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <DateRangePicker label="Billing range" locale={locale} value={rangeValue} onValueChange={next => setRangeValue(next || '')} closeOnSelect={false} />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <TimePicker label="Shift start" locale={locale} value={timeValue || undefined} onValueChange={next => setTimeValue(next)} clearable />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <DateTimePicker label="Procedure schedule" locale={locale} value={dateTimeValue || undefined} onValueChange={next => setDateTimeValue(next)} step={10} />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <DateRangeTimePicker label="Operating slot" locale={locale} value={rangeTimeValue} onValueChange={next => setRangeTimeValue(next || '')} step={15} closeOnSelect={false} />
        </Box>
      </Grid>

      <Box variant="elevated" p="14px" radius="lg">
        <Grid gap="8px">
          <Badge tone="info">Custom translation override (French)</Badge>
          <DateRangeTimePicker locale="fr-FR" label="Bloc operatoire" value='{"start":"2026-05-20T08:00","end":"2026-05-20T11:00"}' translations={customFrenchTranslations} step={15} closeOnSelect={false} />
        </Grid>
      </Box>
    </Grid>;
}`,...(ne=(ae=T.parameters)==null?void 0:ae.docs)==null?void 0:ne.source}}};var te,le,re;y.parameters={...y.parameters,docs:{...(te=y.parameters)==null?void 0:te.docs,source:{originalSource:`() => {
  useForcedMobileSheet(true);
  const [value, setValue] = React.useState<string | null>('2026-02-23');
  return <Box w="360px" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="brand">Forced mobile sheet preview</Badge>
        <DatePicker label="Mobile sheet date picker" value={value || undefined} onValueChange={next => setValue(next)} closeOnSelect={false} hint="This story forces mobile media query to validate bottom-sheet spacing." />
        <DateRangePicker label="Mobile range picker" value='{"start":"2026-02-20","end":"2026-02-24"}' closeOnSelect={false} hint="Check footer actions and scroll-lock behavior." />
      </Grid>
    </Box>;
}`,...(re=(le=y.parameters)==null?void 0:le.docs)==null?void 0:re.source}}};const he=["SingleDate","DatePickerEnterpriseStates","DateRange","DateRangeEnterpriseStates","TimeOnly","DateTime","DateRangeTime","BareAndFooterVariants","Localization","MobileSheetBehavior"];export{V as BareAndFooterVariants,m as DatePickerEnterpriseStates,h as DateRange,f as DateRangeEnterpriseStates,S as DateRangeTime,B as DateTime,T as Localization,y as MobileSheetBehavior,v as SingleDate,b as TimeOnly,he as __namedExportsOrder,me as default};
