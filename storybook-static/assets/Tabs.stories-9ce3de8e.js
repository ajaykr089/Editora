import{c as t,j as e,G as l,a,B as u,F as O}from"./index-c1b18327.js";import{R}from"./index-93f6b7ae.js";const K={title:"UI/Tabs",component:t,argTypes:{selected:{control:{type:"number",min:0,max:5,step:1}},orientation:{control:"select",options:["horizontal","vertical"]},activation:{control:"select",options:["auto","manual"]},variant:{control:"select",options:["default","soft","outline","solid","ghost","glass","indicator","indicator-line","underline","line","segmented","cards","contrast","minimal"]},size:{control:"select",options:["sm","md","lg"]},density:{control:"select",options:["default","compact","comfortable"]},tone:{control:"select",options:["brand","success","warning","danger"]},shape:{control:"select",options:["rounded","square","pill"]},elevation:{control:"select",options:["low","none","high"]},loop:{control:"boolean"},stretched:{control:"boolean"},bare:{control:"boolean"}}},n=i=>{const[h,I]=R.useState(Number(i.selected??0));return e(l,{gap:"12px",style:{maxWidth:860},children:[e(t,{selected:h,orientation:i.orientation||"horizontal",activation:i.activation||"auto",variant:i.variant||"soft",size:i.size||"md",density:i.density||"default",tone:i.tone||"brand",shape:i.shape||"rounded",elevation:i.elevation||"low",stretched:!!i.stretched,bare:!!i.bare,loop:i.loop??!0,onChange:I,children:[a("div",{slot:"tab","data-value":"overview","data-icon":"📊",children:"Overview"}),a("div",{slot:"panel",children:"Workspace KPIs, revenue velocity, and trend deltas for this week."}),a("div",{slot:"tab","data-value":"activity","data-icon":"🕒",children:"Activity"}),a("div",{slot:"panel",children:"Approvals, assignments, and SLA response timeline across teams."}),a("div",{slot:"tab","data-value":"permissions","data-icon":"🔐",children:"Permissions"}),a("div",{slot:"panel",children:"Role-based access mapping with tenant-level override rules."}),a("div",{slot:"tab","data-value":"webhooks","data-icon":"⚡",children:"Webhooks"}),a("div",{slot:"panel",children:"Delivery retries, endpoint errors, and queue throughput analytics."})]}),e(u,{style:{fontSize:13,color:"#475569"},children:["Selected tab index: ",a("strong",{children:h})]})]})};n.args={selected:0,orientation:"horizontal",activation:"auto",variant:"soft",size:"md",density:"default",tone:"brand",shape:"rounded",elevation:"low",loop:!0,stretched:!1,bare:!1};const d=()=>e(l,{gap:"14px",style:{maxWidth:980},children:[e(t,{variant:"segmented",selected:0,children:[a("div",{slot:"tab","data-value":"board",children:"Board"}),a("div",{slot:"panel",children:"Segmented pattern: compact for switch-like workflows."}),a("div",{slot:"tab","data-value":"list",children:"List"}),a("div",{slot:"panel",children:"Best for light mode admin dashboards with dense controls."}),a("div",{slot:"tab","data-value":"timeline",children:"Timeline"}),a("div",{slot:"panel",children:"Provides clear mode switching with high scanability."})]}),e(t,{variant:"line",selected:1,children:[a("div",{slot:"tab","data-value":"critical",children:"Critical"}),a("div",{slot:"panel",children:"Line pattern: minimal visual noise for data-heavy layouts."}),a("div",{slot:"tab","data-value":"standard",children:"Standard"}),a("div",{slot:"panel",children:"Keeps the active state clear while preserving table focus."}),a("div",{slot:"tab","data-value":"longtail",children:"Long-tail"}),a("div",{slot:"panel",children:"Great for settings surfaces with many small sections."})]}),e(t,{variant:"cards",shape:"square",selected:0,children:[a("div",{slot:"tab","data-value":"pending","data-icon":"🩺",children:"Pending"}),a("div",{slot:"panel",children:"Cards pattern: stronger surface separation for enterprise portals."}),a("div",{slot:"tab","data-value":"approved","data-icon":"✅",children:"Approved"}),a("div",{slot:"panel",children:"Works well in operations dashboards and compliance screens."}),a("div",{slot:"tab","data-value":"archived","data-icon":"📦",children:"Archived"}),a("div",{slot:"panel",children:"Square corners support flat UI systems without custom CSS forks."})]}),a(u,{variant:"contrast",p:"14px",radius:"lg",children:e(t,{variant:"contrast",tone:"warning",size:"lg",stretched:!0,selected:2,children:[a("div",{slot:"tab","data-value":"alerts",children:"Alerts"}),a("div",{slot:"panel",children:"Contrast pattern for command-center and dark operational themes."}),a("div",{slot:"tab","data-value":"runtime",children:"Runtime"}),a("div",{slot:"panel",children:"Large hit targets improve usability in high-pressure contexts."}),a("div",{slot:"tab","data-value":"logs",children:"Logs"}),a("div",{slot:"panel",children:"Color contrast and focus ring remain WCAG-friendly."})]})})]}),s=()=>e(l,{gap:"14px",style:{maxWidth:980},children:[e(t,{variant:"outline",selected:0,children:[a("div",{slot:"tab","data-value":"summary",children:"Summary"}),a("div",{slot:"panel",children:"Outline style for admin dashboards that prefer clear strokes over fills."}),a("div",{slot:"tab","data-value":"queues",children:"Queues"}),a("div",{slot:"panel",children:"Strong contrast in low-noise layouts."}),a("div",{slot:"tab","data-value":"history",children:"History"}),a("div",{slot:"panel",children:"Easy to theme with token overrides."})]}),e(t,{variant:"solid",tone:"success",selected:1,children:[a("div",{slot:"tab","data-value":"healthy",children:"Healthy"}),a("div",{slot:"panel",children:"Solid style acts like mode chips for operational UIs."}),a("div",{slot:"tab","data-value":"monitoring",children:"Monitoring"}),a("div",{slot:"panel",children:"Selected tab remains highly visible."}),a("div",{slot:"tab","data-value":"alerts",children:"Alerts"}),a("div",{slot:"panel",children:"Works with success/warning/danger tones."})]}),e(t,{variant:"ghost",selected:0,children:[a("div",{slot:"tab","data-value":"week",children:"Week"}),a("div",{slot:"panel",children:"Ghost style removes container chrome for embedded views."}),a("div",{slot:"tab","data-value":"month",children:"Month"}),a("div",{slot:"panel",children:"Good with tables/charts where tab chrome should be minimal."}),a("div",{slot:"tab","data-value":"quarter",children:"Quarter"}),a("div",{slot:"panel",children:"Still keyboard/focus accessible."})]}),e(t,{variant:"glass",selected:2,children:[a("div",{slot:"tab","data-value":"north",children:"North"}),a("div",{slot:"panel",children:"Glass style for modern high-end SaaS shells."}),a("div",{slot:"tab","data-value":"south",children:"South"}),a("div",{slot:"panel",children:"Uses transparent surfaces and backdrop blur."}),a("div",{slot:"tab","data-value":"global",children:"Global"}),a("div",{slot:"panel",children:"Useful when page backgrounds are textured."})]})]}),o=()=>e(l,{gap:"14px",style:{maxWidth:980},children:[e(t,{variant:"indicator",selected:1,children:[a("div",{slot:"tab","data-value":"triage",children:"Triage"}),a("div",{slot:"panel",children:"Moving pill indicator for modern SaaS top navigation."}),a("div",{slot:"tab","data-value":"review",children:"Review"}),a("div",{slot:"panel",children:"Selection motion follows click and keyboard transitions."}),a("div",{slot:"tab","data-value":"approved",children:"Approved"}),a("div",{slot:"panel",children:"Tab labels stay readable while indicator animates beneath."}),a("div",{slot:"tab","data-value":"done",children:"Done"}),a("div",{slot:"panel",children:"Works with overflow and reduced motion settings."})]}),e(t,{variant:"indicator-line",selected:0,children:[a("div",{slot:"tab","data-value":"overview",children:"Overview"}),a("div",{slot:"panel",children:"Animated underline indicator for low-noise enterprise surfaces."}),a("div",{slot:"tab","data-value":"ops",children:"Ops"}),a("div",{slot:"panel",children:"The line tracks active tab width and position."}),a("div",{slot:"tab","data-value":"audit",children:"Audit"}),a("div",{slot:"panel",children:"Strong visual hierarchy for data-dense workflows."}),a("div",{slot:"tab","data-value":"logs",children:"Logs"}),a("div",{slot:"panel",children:"Keyboard navigation updates the line instantly."})]}),e(t,{variant:"indicator-line",orientation:"vertical",activation:"manual",loop:!1,selected:2,children:[a("div",{slot:"tab","data-value":"profile",children:"Profile"}),a("div",{slot:"panel",children:"Vertical mode uses a side indicator rail."}),a("div",{slot:"tab","data-value":"billing",children:"Billing"}),a("div",{slot:"panel",children:"Manual activation remains supported."}),a("div",{slot:"tab","data-value":"security",children:"Security"}),a("div",{slot:"panel",children:"Line indicator adapts to vertical dimensions."}),a("div",{slot:"tab","data-value":"notifications",children:"Notifications"}),a("div",{slot:"panel",children:"Loop disabled prevents wrap-around navigation."})]})]}),r=()=>a(u,{style:{maxWidth:980},children:e(t,{orientation:"vertical",activation:"manual",variant:"underline",loop:!1,selected:1,children:[a("div",{slot:"tab","data-value":"profile",children:"Profile"}),a("div",{slot:"panel",children:"Manual activation: arrow keys move focus; Enter/Space commits selection."}),a("div",{slot:"tab","data-value":"billing",children:"Billing"}),a("div",{slot:"panel",children:"Loop disabled: navigation stops at first/last enabled tab."}),a("div",{slot:"tab","data-value":"security","data-disabled":"true",children:"Security (Disabled)"}),a("div",{slot:"panel",children:"Disabled tabs are skipped in keyboard traversal and cannot be selected."}),a("div",{slot:"tab","data-value":"notifications",children:"Notifications"}),a("div",{slot:"panel",children:"Vertical overflow remains scrollable for large tab sets."})]})}),v=()=>e(l,{gap:"12px",style:{maxWidth:920},children:[a(u,{variant:"surface",p:"12px",style:{border:"1px solid #cbd5e1",borderRadius:6,"--ui-tabs-border":"#94a3b8","--ui-tabs-accent":"#0f172a","--ui-tabs-nav-bg":"#ffffff","--ui-tabs-panel-bg":"#ffffff"},children:e(t,{variant:"minimal",shape:"square",elevation:"none",bare:!0,selected:0,children:[a("div",{slot:"tab","data-value":"summary",children:"Summary"}),a("div",{slot:"panel",children:"Flat tabs: no default shadow, sharp edges, token-based control retained."}),a("div",{slot:"tab","data-value":"financials",children:"Financials"}),a("div",{slot:"panel",children:"Useful for teams that enforce strict flat design language."}),a("div",{slot:"tab","data-value":"notes",children:"Notes"}),a("div",{slot:"panel",children:"Still supports tone/size variants without visual debt."})]})}),e(O,{gap:"10px",wrap:"wrap",children:[e(t,{variant:"default",size:"sm",shape:"square",elevation:"none",selected:0,children:[a("div",{slot:"tab","data-value":"a",children:"A"}),a("div",{slot:"panel",children:"Small"}),a("div",{slot:"tab","data-value":"b",children:"B"}),a("div",{slot:"panel",children:"Small"})]}),e(t,{variant:"default",size:"md",shape:"rounded",elevation:"low",selected:0,children:[a("div",{slot:"tab","data-value":"a",children:"A"}),a("div",{slot:"panel",children:"Medium"}),a("div",{slot:"tab","data-value":"b",children:"B"}),a("div",{slot:"panel",children:"Medium"})]}),e(t,{variant:"default",size:"lg",shape:"pill",elevation:"high",selected:0,children:[a("div",{slot:"tab","data-value":"a",children:"A"}),a("div",{slot:"panel",children:"Large"}),a("div",{slot:"tab","data-value":"b",children:"B"}),a("div",{slot:"panel",children:"Large"})]})]})]}),c=()=>e(l,{gap:"12px",style:{maxWidth:980},children:[e(t,{variant:"soft",density:"compact",selected:0,children:[a("div",{slot:"tab","data-value":"compact-a",children:"Compact A"}),a("div",{slot:"panel",children:"Compact density for data-heavy enterprise screens."}),a("div",{slot:"tab","data-value":"compact-b",children:"Compact B"}),a("div",{slot:"panel",children:"Tighter spacing with preserved tap targets."})]}),e(t,{variant:"soft",density:"default",selected:0,children:[a("div",{slot:"tab","data-value":"default-a",children:"Default A"}),a("div",{slot:"panel",children:"Balanced default density for most dashboard workflows."}),a("div",{slot:"tab","data-value":"default-b",children:"Default B"}),a("div",{slot:"panel",children:"Good middle ground for mixed content."})]}),e(t,{variant:"soft",density:"comfortable",selected:0,children:[a("div",{slot:"tab","data-value":"comfortable-a",children:"Comfortable A"}),a("div",{slot:"panel",children:"Comfortable density for touch-heavy and executive views."}),a("div",{slot:"tab","data-value":"comfortable-b",children:"Comfortable B"}),a("div",{slot:"panel",children:"Improved spacing and larger targets."})]})]}),p=()=>e(t,{variant:"soft",selected:5,children:[a("div",{slot:"tab","data-value":"mon",children:"Mon"}),a("div",{slot:"panel",children:"Mon capacity"}),a("div",{slot:"tab","data-value":"tue",children:"Tue"}),a("div",{slot:"panel",children:"Tue capacity"}),a("div",{slot:"tab","data-value":"wed",children:"Wed"}),a("div",{slot:"panel",children:"Wed capacity"}),a("div",{slot:"tab","data-value":"thu",children:"Thu"}),a("div",{slot:"panel",children:"Thu capacity"}),a("div",{slot:"tab","data-value":"fri",children:"Fri"}),a("div",{slot:"panel",children:"Fri capacity"}),a("div",{slot:"tab","data-value":"sat",children:"Sat"}),a("div",{slot:"panel",children:"Sat capacity"}),a("div",{slot:"tab","data-value":"sun",children:"Sun"}),a("div",{slot:"panel",children:"Sun capacity"}),a("div",{slot:"tab","data-value":"next",children:"Next Week"}),a("div",{slot:"panel",children:"Next week planning"})]});var b,m,f;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`(args: any) => {
  const [selected, setSelected] = React.useState(Number(args.selected ?? 0));
  return <Grid gap="12px" style={{
    maxWidth: 860
  }}>
      <Tabs selected={selected} orientation={args.orientation || 'horizontal'} activation={args.activation || 'auto'} variant={args.variant || 'soft'} size={args.size || 'md'} density={args.density || 'default'} tone={args.tone || 'brand'} shape={args.shape || 'rounded'} elevation={args.elevation || 'low'} stretched={Boolean(args.stretched)} bare={Boolean(args.bare)} loop={args.loop ?? true} onChange={setSelected}>
        <div slot="tab" data-value="overview" data-icon="📊">Overview</div>
        <div slot="panel">Workspace KPIs, revenue velocity, and trend deltas for this week.</div>

        <div slot="tab" data-value="activity" data-icon="🕒">Activity</div>
        <div slot="panel">Approvals, assignments, and SLA response timeline across teams.</div>

        <div slot="tab" data-value="permissions" data-icon="🔐">Permissions</div>
        <div slot="panel">Role-based access mapping with tenant-level override rules.</div>

        <div slot="tab" data-value="webhooks" data-icon="⚡">Webhooks</div>
        <div slot="panel">Delivery retries, endpoint errors, and queue throughput analytics.</div>
      </Tabs>

      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Selected tab index: <strong>{selected}</strong>
      </Box>
    </Grid>;
}`,...(f=(m=n.parameters)==null?void 0:m.docs)==null?void 0:f.source}}};var g,y,w;d.parameters={...d.parameters,docs:{...(g=d.parameters)==null?void 0:g.docs,source:{originalSource:`() => <Grid gap="14px" style={{
  maxWidth: 980
}}>
    <Tabs variant="segmented" selected={0}>
      <div slot="tab" data-value="board">Board</div>
      <div slot="panel">Segmented pattern: compact for switch-like workflows.</div>
      <div slot="tab" data-value="list">List</div>
      <div slot="panel">Best for light mode admin dashboards with dense controls.</div>
      <div slot="tab" data-value="timeline">Timeline</div>
      <div slot="panel">Provides clear mode switching with high scanability.</div>
    </Tabs>

    <Tabs variant="line" selected={1}>
      <div slot="tab" data-value="critical">Critical</div>
      <div slot="panel">Line pattern: minimal visual noise for data-heavy layouts.</div>
      <div slot="tab" data-value="standard">Standard</div>
      <div slot="panel">Keeps the active state clear while preserving table focus.</div>
      <div slot="tab" data-value="longtail">Long-tail</div>
      <div slot="panel">Great for settings surfaces with many small sections.</div>
    </Tabs>

    <Tabs variant="cards" shape="square" selected={0}>
      <div slot="tab" data-value="pending" data-icon="🩺">Pending</div>
      <div slot="panel">Cards pattern: stronger surface separation for enterprise portals.</div>
      <div slot="tab" data-value="approved" data-icon="✅">Approved</div>
      <div slot="panel">Works well in operations dashboards and compliance screens.</div>
      <div slot="tab" data-value="archived" data-icon="📦">Archived</div>
      <div slot="panel">Square corners support flat UI systems without custom CSS forks.</div>
    </Tabs>

    <Box variant="contrast" p="14px" radius="lg">
      <Tabs variant="contrast" tone="warning" size="lg" stretched selected={2}>
        <div slot="tab" data-value="alerts">Alerts</div>
        <div slot="panel">Contrast pattern for command-center and dark operational themes.</div>
        <div slot="tab" data-value="runtime">Runtime</div>
        <div slot="panel">Large hit targets improve usability in high-pressure contexts.</div>
        <div slot="tab" data-value="logs">Logs</div>
        <div slot="panel">Color contrast and focus ring remain WCAG-friendly.</div>
      </Tabs>
    </Box>
  </Grid>`,...(w=(y=d.parameters)==null?void 0:y.docs)==null?void 0:w.source}}};var S,x,T;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`() => <Grid gap="14px" style={{
  maxWidth: 980
}}>
    <Tabs variant="outline" selected={0}>
      <div slot="tab" data-value="summary">Summary</div>
      <div slot="panel">Outline style for admin dashboards that prefer clear strokes over fills.</div>
      <div slot="tab" data-value="queues">Queues</div>
      <div slot="panel">Strong contrast in low-noise layouts.</div>
      <div slot="tab" data-value="history">History</div>
      <div slot="panel">Easy to theme with token overrides.</div>
    </Tabs>

    <Tabs variant="solid" tone="success" selected={1}>
      <div slot="tab" data-value="healthy">Healthy</div>
      <div slot="panel">Solid style acts like mode chips for operational UIs.</div>
      <div slot="tab" data-value="monitoring">Monitoring</div>
      <div slot="panel">Selected tab remains highly visible.</div>
      <div slot="tab" data-value="alerts">Alerts</div>
      <div slot="panel">Works with success/warning/danger tones.</div>
    </Tabs>

    <Tabs variant="ghost" selected={0}>
      <div slot="tab" data-value="week">Week</div>
      <div slot="panel">Ghost style removes container chrome for embedded views.</div>
      <div slot="tab" data-value="month">Month</div>
      <div slot="panel">Good with tables/charts where tab chrome should be minimal.</div>
      <div slot="tab" data-value="quarter">Quarter</div>
      <div slot="panel">Still keyboard/focus accessible.</div>
    </Tabs>

    <Tabs variant="glass" selected={2}>
      <div slot="tab" data-value="north">North</div>
      <div slot="panel">Glass style for modern high-end SaaS shells.</div>
      <div slot="tab" data-value="south">South</div>
      <div slot="panel">Uses transparent surfaces and backdrop blur.</div>
      <div slot="tab" data-value="global">Global</div>
      <div slot="panel">Useful when page backgrounds are textured.</div>
    </Tabs>
  </Grid>`,...(T=(x=s.parameters)==null?void 0:x.docs)==null?void 0:T.source}}};var k,A,B;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`() => <Grid gap="14px" style={{
  maxWidth: 980
}}>
    <Tabs variant="indicator" selected={1}>
      <div slot="tab" data-value="triage">Triage</div>
      <div slot="panel">Moving pill indicator for modern SaaS top navigation.</div>
      <div slot="tab" data-value="review">Review</div>
      <div slot="panel">Selection motion follows click and keyboard transitions.</div>
      <div slot="tab" data-value="approved">Approved</div>
      <div slot="panel">Tab labels stay readable while indicator animates beneath.</div>
      <div slot="tab" data-value="done">Done</div>
      <div slot="panel">Works with overflow and reduced motion settings.</div>
    </Tabs>

    <Tabs variant="indicator-line" selected={0}>
      <div slot="tab" data-value="overview">Overview</div>
      <div slot="panel">Animated underline indicator for low-noise enterprise surfaces.</div>
      <div slot="tab" data-value="ops">Ops</div>
      <div slot="panel">The line tracks active tab width and position.</div>
      <div slot="tab" data-value="audit">Audit</div>
      <div slot="panel">Strong visual hierarchy for data-dense workflows.</div>
      <div slot="tab" data-value="logs">Logs</div>
      <div slot="panel">Keyboard navigation updates the line instantly.</div>
    </Tabs>

    <Tabs variant="indicator-line" orientation="vertical" activation="manual" loop={false} selected={2}>
      <div slot="tab" data-value="profile">Profile</div>
      <div slot="panel">Vertical mode uses a side indicator rail.</div>
      <div slot="tab" data-value="billing">Billing</div>
      <div slot="panel">Manual activation remains supported.</div>
      <div slot="tab" data-value="security">Security</div>
      <div slot="panel">Line indicator adapts to vertical dimensions.</div>
      <div slot="tab" data-value="notifications">Notifications</div>
      <div slot="panel">Loop disabled prevents wrap-around navigation.</div>
    </Tabs>
  </Grid>`,...(B=(A=o.parameters)==null?void 0:A.docs)==null?void 0:B.source}}};var W,D,C;r.parameters={...r.parameters,docs:{...(W=r.parameters)==null?void 0:W.docs,source:{originalSource:`() => <Box style={{
  maxWidth: 980
}}>
    <Tabs orientation="vertical" activation="manual" variant="underline" loop={false} selected={1}>
      <div slot="tab" data-value="profile">Profile</div>
      <div slot="panel">Manual activation: arrow keys move focus; Enter/Space commits selection.</div>

      <div slot="tab" data-value="billing">Billing</div>
      <div slot="panel">Loop disabled: navigation stops at first/last enabled tab.</div>

      <div slot="tab" data-value="security" data-disabled="true">Security (Disabled)</div>
      <div slot="panel">Disabled tabs are skipped in keyboard traversal and cannot be selected.</div>

      <div slot="tab" data-value="notifications">Notifications</div>
      <div slot="panel">Vertical overflow remains scrollable for large tab sets.</div>
    </Tabs>
  </Box>`,...(C=(D=r.parameters)==null?void 0:D.docs)==null?void 0:C.source}}};var G,L,z;v.parameters={...v.parameters,docs:{...(G=v.parameters)==null?void 0:G.docs,source:{originalSource:`() => <Grid gap="12px" style={{
  maxWidth: 920
}}>
    <Box variant="surface" p="12px" style={{
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    ['--ui-tabs-border' as any]: '#94a3b8',
    ['--ui-tabs-accent' as any]: '#0f172a',
    ['--ui-tabs-nav-bg' as any]: '#ffffff',
    ['--ui-tabs-panel-bg' as any]: '#ffffff'
  }}>
      <Tabs variant="minimal" shape="square" elevation="none" bare selected={0}>
        <div slot="tab" data-value="summary">Summary</div>
        <div slot="panel">Flat tabs: no default shadow, sharp edges, token-based control retained.</div>

        <div slot="tab" data-value="financials">Financials</div>
        <div slot="panel">Useful for teams that enforce strict flat design language.</div>

        <div slot="tab" data-value="notes">Notes</div>
        <div slot="panel">Still supports tone/size variants without visual debt.</div>
      </Tabs>
    </Box>

    <Flex gap="10px" wrap="wrap">
      <Tabs variant="default" size="sm" shape="square" elevation="none" selected={0}>
        <div slot="tab" data-value="a">A</div>
        <div slot="panel">Small</div>
        <div slot="tab" data-value="b">B</div>
        <div slot="panel">Small</div>
      </Tabs>

      <Tabs variant="default" size="md" shape="rounded" elevation="low" selected={0}>
        <div slot="tab" data-value="a">A</div>
        <div slot="panel">Medium</div>
        <div slot="tab" data-value="b">B</div>
        <div slot="panel">Medium</div>
      </Tabs>

      <Tabs variant="default" size="lg" shape="pill" elevation="high" selected={0}>
        <div slot="tab" data-value="a">A</div>
        <div slot="panel">Large</div>
        <div slot="tab" data-value="b">B</div>
        <div slot="panel">Large</div>
      </Tabs>
    </Flex>
  </Grid>`,...(z=(L=v.parameters)==null?void 0:L.docs)==null?void 0:z.source}}};var M,q,E;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`() => <Grid gap="12px" style={{
  maxWidth: 980
}}>
    <Tabs variant="soft" density="compact" selected={0}>
      <div slot="tab" data-value="compact-a">Compact A</div>
      <div slot="panel">Compact density for data-heavy enterprise screens.</div>
      <div slot="tab" data-value="compact-b">Compact B</div>
      <div slot="panel">Tighter spacing with preserved tap targets.</div>
    </Tabs>

    <Tabs variant="soft" density="default" selected={0}>
      <div slot="tab" data-value="default-a">Default A</div>
      <div slot="panel">Balanced default density for most dashboard workflows.</div>
      <div slot="tab" data-value="default-b">Default B</div>
      <div slot="panel">Good middle ground for mixed content.</div>
    </Tabs>

    <Tabs variant="soft" density="comfortable" selected={0}>
      <div slot="tab" data-value="comfortable-a">Comfortable A</div>
      <div slot="panel">Comfortable density for touch-heavy and executive views.</div>
      <div slot="tab" data-value="comfortable-b">Comfortable B</div>
      <div slot="panel">Improved spacing and larger targets.</div>
    </Tabs>
  </Grid>`,...(E=(q=c.parameters)==null?void 0:q.docs)==null?void 0:E.source}}};var F,N,P;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`() => <Tabs variant="soft" selected={5}>
    <div slot="tab" data-value="mon">Mon</div><div slot="panel">Mon capacity</div>
    <div slot="tab" data-value="tue">Tue</div><div slot="panel">Tue capacity</div>
    <div slot="tab" data-value="wed">Wed</div><div slot="panel">Wed capacity</div>
    <div slot="tab" data-value="thu">Thu</div><div slot="panel">Thu capacity</div>
    <div slot="tab" data-value="fri">Fri</div><div slot="panel">Fri capacity</div>
    <div slot="tab" data-value="sat">Sat</div><div slot="panel">Sat capacity</div>
    <div slot="tab" data-value="sun">Sun</div><div slot="panel">Sun capacity</div>
    <div slot="tab" data-value="next">Next Week</div><div slot="panel">Next week planning</div>
  </Tabs>`,...(P=(N=p.parameters)==null?void 0:N.docs)==null?void 0:P.source}}};const H=["EnterpriseWorkspace","DesignPatterns","AdditionalVariants","AnimatedIndicators","VerticalEdgeScenarios","FlatBareEnterprise","DensityModes","OverflowWithScroll"];export{s as AdditionalVariants,o as AnimatedIndicators,c as DensityModes,d as DesignPatterns,n as EnterpriseWorkspace,v as FlatBareEnterprise,p as OverflowWithScroll,r as VerticalEdgeScenarios,H as __namedExportsOrder,K as default};
