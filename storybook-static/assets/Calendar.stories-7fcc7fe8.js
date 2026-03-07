import{z as g,a as e,G as u,j as n,B as i,l as h,F as y,b as p,t as d}from"./index-c1b18327.js";import{R as v}from"./index-93f6b7ae.js";import{S as N,p as U,R as V,A as W,a as j,c as P}from"./icons-f697cb21.js";/* empty css              *//* empty css                */const ee={title:"UI/Calendar",component:g,argTypes:{selection:{control:{type:"radio",options:["single","range","multiple"]}},size:{control:{type:"radio",options:["sm","md","lg"]}},state:{control:{type:"radio",options:["idle","loading","error","success"]}},tone:{control:{type:"radio",options:["neutral","info","success","warning","danger"]}},eventsDisplay:{control:{type:"radio",options:["dots","badges","count"]}},outsideClick:{control:{type:"radio",options:["none","navigate","select"]}},disabled:{control:"boolean"},readOnly:{control:"boolean"},bare:{control:"boolean"}}},m=[{date:"2026-03-05",title:"ICU handover",tone:"info"},{date:"2026-03-06",title:"Medication audit",tone:"warning"},{date:"2026-03-09",title:"Surgery board",tone:"success"},{date:"2026-03-09",title:"Insurance review",tone:"default"},{date:"2026-03-13",title:"Emergency drill",tone:"danger"},{date:"2026-03-18",title:"Radiology sync",tone:"info"},{date:"2026-03-22",title:"Discharge planning",tone:"success"},{date:"2026-03-26",title:"Pharmacy restock",tone:"warning"}];function T(r){const t=/^(\d{4})-(\d{2})-\d{2}$/.exec((r||"").trim());if(!t)return null;const s=Number(t[1]),l=Number(t[2]);return!Number.isInteger(s)||!Number.isInteger(l)||l<1||l>12?null:{year:s,month:l}}function $(){const[r,t]=v.useState("idle"),[s,l]=v.useState("2026-03-09"),[c,S]=v.useState({year:2026,month:3});return n(u,{style:{gap:16,maxInlineSize:1040},children:[e(i,{variant:"gradient",tone:"brand",radius:"xl",p:"16px",style:{display:"grid",gap:10},children:n(y,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:[n("div",{children:[e("div",{style:{fontWeight:700,fontSize:18},children:"Clinical Scheduling Calendar"}),e("div",{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13,marginTop:4},children:"Enterprise-grade calendar for capacity planning, compliance checks, and daily operation routing."})]}),n(y,{align:"center",style:{gap:8,color:"var(--ui-color-muted, #64748b)",fontSize:12},children:[e(N,{size:14}),"HIPAA-aware Workflow"]})]})}),e(g,{year:c.year,month:c.month,value:s,events:m,selection:"single",eventsDisplay:"badges",eventsMax:2,state:r,tone:r==="error"?"danger":r==="success"?"success":"info",ariaLabel:"Hospital schedule calendar",onSelect:o=>{l(o.value);const f=T(o.value);f&&S(f),d.info(`Selected ${o.value}`,{duration:1e3,theme:"light"})},onMonthChange:o=>{S({year:o.year,month:o.month}),d.info(`Navigated to ${o.year}-${String(o.month).padStart(2,"0")}`,{duration:900,theme:"light"})}}),n(y,{align:"center",style:{gap:8,flexWrap:"wrap"},children:[n(h,{tone:"brand",children:[e(U,{size:12}),s]}),e(p,{size:"sm",variant:"secondary",startIcon:e(V,{size:14}),onClick:()=>{t("loading"),d.loading("Syncing calendar events...",{duration:900,theme:"light"}),window.setTimeout(()=>t("idle"),900)},children:"Sync"}),e(p,{size:"sm",variant:"secondary",startIcon:e(W,{size:14}),onClick:()=>{t("error"),d.error("Scheduling feed unavailable",{duration:1300,theme:"light"})},children:"Simulate Error"}),e(p,{size:"sm",variant:"secondary",startIcon:e(j,{size:14}),onClick:()=>{t("success"),d.success("Schedule synced successfully",{duration:1300,theme:"light"})},children:"Mark Synced"}),e(p,{size:"sm",startIcon:e(P,{size:14}),onClick:()=>{t("idle"),d.info("State reset",{duration:900,theme:"light"})},children:"Reset"})]})]})}const Y=`import { Badge, Box, Button, Calendar, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { AlertTriangleIcon, CalendarIcon, CheckCircleIcon, RefreshCwIcon } from '@editora/react-icons';

const hospitalEvents = [
  { date: '2026-03-05', title: 'ICU handover', tone: 'info' },
  { date: '2026-03-09', title: 'Surgery board', tone: 'success' },
];

export function EnterpriseScheduleCalendar() {
  const [value, setValue] = React.useState('2026-03-09');
  const [view, setView] = React.useState({ year: 2026, month: 3 });
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  return (
    <Grid style={{ gap: 16, maxInlineSize: 1040 }}>
      <Calendar
        year={view.year}
        month={view.month}
        value={value}
        events={hospitalEvents}
        selection="single"
        eventsDisplay="badges"
        state={state}
        onSelect={(detail) => {
          setValue(detail.value);
          toastAdvanced.info(\`Selected \${detail.value}\`);
        }}
        onMonthChange={(detail) => setView({ year: detail.year, month: detail.month })}
        ariaLabel="Hospital schedule calendar"
      />
      <Flex style={{ gap: 8 }}>
        <Badge tone="brand"><CalendarIcon size={12} />{value}</Badge>
        <Button size="sm" variant="secondary" startIcon={<RefreshCwIcon size={14} />} onClick={() => setState('loading')}>Sync</Button>
        <Button size="sm" variant="secondary" startIcon={<AlertTriangleIcon size={14} />} onClick={() => setState('error')}>Simulate Error</Button>
        <Button size="sm" variant="secondary" startIcon={<CheckCircleIcon size={14} />} onClick={() => setState('success')}>Mark Synced</Button>
      </Flex>
    </Grid>
  );
}`,H=`import { Calendar } from '@editora/ui-react';

<Calendar
  year={2026}
  month={3}
  value="2026-03-09"
  selection="single"
  size="md"
  state="idle"
  tone="info"
  eventsDisplay="dots"
  outsideClick="navigate"
  ariaLabel="Playground calendar"
/>;
`,J=`import { Badge, Box, Calendar, Grid } from '@editora/ui-react';

<Grid style={{ gap: 12, maxInlineSize: 760 }}>
  <Box variant="elevated" p="14px" radius="xl" style={{ display: 'grid', gap: 8 }}>
    <Badge tone="info">Bare calendar surface</Badge>
    <Calendar
      year={2026}
      month={3}
      value="2026-03-09"
      selection="single"
      eventsDisplay="dots"
      tone="info"
      bare
      ariaLabel="Bare calendar"
    />
  </Box>
</Grid>;
`,_=`import { Calendar } from '@editora/ui-react';

<Calendar
  year={2026}
  month={3}
  value="2026-03-09"
  locale="fr-FR"
  weekStart={1}
  translations={JSON.stringify({
    fr: {
      today: 'Aujourd hui',
      chooseMonthYear: 'Choisir mois/annee',
      scheduleSynced: 'Planning a jour',
    },
  })}
  ariaLabel="Localized calendar"
/>;
`,b={render:()=>e($,{}),parameters:{docs:{source:{type:"code",code:Y}}}},x={render:r=>e(g,{...r,year:2026,month:3,events:m,value:"2026-03-09",ariaLabel:"Playground calendar"}),args:{selection:"single",size:"md",bare:!1,state:"idle",tone:"info",eventsDisplay:"dots",outsideClick:"navigate",disabled:!1,readOnly:!1},parameters:{docs:{source:{type:"code",code:H}}}},C={render:()=>e(u,{style:{gap:12,maxInlineSize:760},children:n(i,{variant:"elevated",p:"14px",radius:"xl",style:{display:"grid",gap:8},children:[e(h,{tone:"info",children:"Bare calendar surface"}),e(i,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"`bare` removes calendar panel chrome (border/shadow/background) for flat UI surfaces."}),e(g,{year:2026,month:3,value:"2026-03-09",selection:"single",events:m,eventsDisplay:"dots",tone:"info",bare:!0,ariaLabel:"Bare calendar"})]})}),parameters:{docs:{source:{type:"code",code:J}}}},B={render:()=>{const[r,t]=v.useState("en-US"),[s,l]=v.useState("2026-03-09"),[c,S]=v.useState(1),o=[{value:"en-US",label:"English"},{value:"zh-CN",label:"Chinese"},{value:"fr-FR",label:"French"}],f=[{value:0,label:"Sun first"},{value:1,label:"Mon first"},{value:6,label:"Sat first"}],M=JSON.stringify({fr:{today:"Aujourd hui",chooseMonthYear:"Choisir mois/annee",scheduleSynced:"Planning a jour"}});return n(u,{style:{gap:12,maxInlineSize:980},children:[n(i,{variant:"elevated",p:"14px",radius:"xl",style:{display:"grid",gap:10},children:[e(h,{tone:"brand",children:"Calendar localization"}),e(i,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"Switch locale and week start to validate month labels, weekdays, and action text."}),e(y,{align:"center",style:{gap:8,flexWrap:"wrap"},children:o.map(a=>e(p,{size:"sm",variant:r===a.value?void 0:"secondary",onClick:()=>t(a.value),children:a.label},a.value))}),e(y,{align:"center",style:{gap:8,flexWrap:"wrap"},children:f.map(a=>e(p,{size:"sm",variant:c===a.value?void 0:"secondary",onClick:()=>S(a.value),children:a.label},a.value))})]}),n(u,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:12},children:[e(i,{variant:"elevated",p:"14px",radius:"xl",children:n(u,{style:{gap:10},children:[e(h,{tone:"info",children:"Built-in locale"}),e(g,{year:2026,month:3,value:s,locale:r,weekStart:c,events:m,eventsDisplay:"dots",onSelect:a=>l(a.value),ariaLabel:"Localized calendar"})]})}),e(i,{variant:"elevated",p:"14px",radius:"xl",children:n(u,{style:{gap:10},children:[e(h,{tone:"success",children:"French custom override"}),e(g,{year:2026,month:3,value:s,locale:"fr-FR",weekStart:c,translations:M,events:m,eventsDisplay:"dots",onSelect:a=>l(a.value),ariaLabel:"French override calendar"})]})})]})]})},parameters:{docs:{source:{type:"code",code:_}}}};var z,k,w;b.parameters={...b.parameters,docs:{...(z=b.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <EnterpriseClinicalCalendar />,
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: enterpriseScheduleSource
      }
    }
  }
}`,...(w=(k=b.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var I,F,L;x.parameters={...x.parameters,docs:{...(I=x.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: args => <Calendar {...args} year={2026} month={3} events={hospitalEvents} value="2026-03-09" ariaLabel="Playground calendar" />,
  args: {
    selection: 'single',
    size: 'md',
    bare: false,
    state: 'idle',
    tone: 'info',
    eventsDisplay: 'dots',
    outsideClick: 'navigate',
    disabled: false,
    readOnly: false
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: playgroundSource
      }
    }
  }
}`,...(L=(F=x.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var R,E,G;C.parameters={...C.parameters,docs:{...(R=C.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 12,
    maxInlineSize: 760
  }}>
      <Box variant="elevated" p="14px" radius="xl" style={{
      display: 'grid',
      gap: 8
    }}>
        <Badge tone="info">Bare calendar surface</Badge>
        <Box style={{
        color: 'var(--ui-color-muted, #64748b)',
        fontSize: 13
      }}>
          \`bare\` removes calendar panel chrome (border/shadow/background) for flat UI surfaces.
        </Box>
        <Calendar year={2026} month={3} value="2026-03-09" selection="single" events={hospitalEvents} eventsDisplay="dots" tone="info" bare ariaLabel="Bare calendar" />
      </Box>
    </Grid>,
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: bareFlatSource
      }
    }
  }
}`,...(G=(E=C.parameters)==null?void 0:E.docs)==null?void 0:G.source}}};var O,A,D;B.parameters={...B.parameters,docs:{...(O=B.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => {
    const [locale, setLocale] = React.useState<'en-US' | 'zh-CN' | 'fr-FR'>('en-US');
    const [value, setValue] = React.useState('2026-03-09');
    const [weekStart, setWeekStart] = React.useState<0 | 1 | 6>(1);
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
    const weekStartOptions: Array<{
      value: 0 | 1 | 6;
      label: string;
    }> = [{
      value: 0,
      label: 'Sun first'
    }, {
      value: 1,
      label: 'Mon first'
    }, {
      value: 6,
      label: 'Sat first'
    }];
    const frenchOverride = JSON.stringify({
      fr: {
        today: 'Aujourd hui',
        chooseMonthYear: 'Choisir mois/annee',
        scheduleSynced: 'Planning a jour'
      }
    });
    return <Grid style={{
      gap: 12,
      maxInlineSize: 980
    }}>
      <Box variant="elevated" p="14px" radius="xl" style={{
        display: 'grid',
        gap: 10
      }}>
        <Badge tone="brand">Calendar localization</Badge>
        <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13
        }}>
          Switch locale and week start to validate month labels, weekdays, and action text.
        </Box>
        <Flex align="center" style={{
          gap: 8,
          flexWrap: 'wrap'
        }}>
          {localeOptions.map(option => <Button key={option.value} size="sm" variant={locale === option.value ? undefined : 'secondary'} onClick={() => setLocale(option.value)}>
              {option.label}
            </Button>)}
        </Flex>
        <Flex align="center" style={{
          gap: 8,
          flexWrap: 'wrap'
        }}>
          {weekStartOptions.map(option => <Button key={option.value} size="sm" variant={weekStart === option.value ? undefined : 'secondary'} onClick={() => setWeekStart(option.value)}>
              {option.label}
            </Button>)}
        </Flex>
      </Box>

      <Grid style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 12
      }}>
        <Box variant="elevated" p="14px" radius="xl">
          <Grid style={{
            gap: 10
          }}>
            <Badge tone="info">Built-in locale</Badge>
            <Calendar year={2026} month={3} value={value} locale={locale} weekStart={weekStart} events={hospitalEvents} eventsDisplay="dots" onSelect={detail => setValue(detail.value)} ariaLabel="Localized calendar" />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="xl">
          <Grid style={{
            gap: 10
          }}>
            <Badge tone="success">French custom override</Badge>
            <Calendar year={2026} month={3} value={value} locale="fr-FR" weekStart={weekStart} translations={frenchOverride} events={hospitalEvents} eventsDisplay="dots" onSelect={detail => setValue(detail.value)} ariaLabel="French override calendar" />
          </Grid>
        </Box>
      </Grid>
    </Grid>;
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: localizationSource
      }
    }
  }
}`,...(D=(A=B.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};const ae=["EnterpriseSchedule","Playground","BareFlat","Localization"];export{C as BareFlat,b as EnterpriseSchedule,B as Localization,x as Playground,ae as __namedExportsOrder,ee as default};
