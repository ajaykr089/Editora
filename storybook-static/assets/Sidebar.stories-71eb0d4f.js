import{S as s,j as t,G as h,F as g,a as e,l as F,B as a,b as u,L as A}from"./index-c1b18327.js";import{r as d}from"./index-93f6b7ae.js";const R={title:"UI/Sidebar",component:s,argTypes:{collapsed:{control:"boolean"},collapsible:{control:"boolean"},rail:{control:"boolean"},position:{control:"select",options:["left","right"]},variant:{control:"select",options:["surface","soft","floating","contrast","minimal","split"]},density:{control:"select",options:["compact","default","comfortable"]},size:{control:"select",options:["sm","md","lg"]}}},c=n=>{const[l,r]=d.useState("dashboard"),[i,f]=d.useState(!!n.collapsed);return t(h,{columns:"auto 1fr",style:{minHeight:440,border:"1px solid var(--ui-color-border, #cbd5e1)",borderRadius:"calc(var(--ui-radius, 12px) + 4px)",overflow:"hidden"},children:[t(s,{value:l,collapsed:i,collapsible:n.collapsible,rail:n.rail,position:n.position||"left",variant:n.variant||"floating",density:n.density||"default",size:n.size||"md",onSelect:o=>r(o.value),onToggle:f,children:[t(g,{slot:"header",align:"center",justify:"space-between",style:{fontWeight:700},children:[e("span",{children:"Editora Admin"}),e(F,{tone:"info",variant:"soft",size:"sm",children:"v3"})]}),e(a,{slot:"search",variant:"outline",radius:"lg",p:"8px",style:{fontSize:"var(--ui-font-size-sm, 12px)",color:"var(--ui-color-muted, #64748b)"},children:"Search apps, teams, reports..."}),e(a,{slot:"item","data-section":"Workspace","data-value":"dashboard","data-icon":"🏠","data-description":"Overview and KPIs","data-active":!0,children:"Dashboard"}),e(a,{slot:"item","data-section":"Workspace","data-value":"analytics","data-icon":"📈","data-description":"Funnels and retention","data-badge":"12",children:"Analytics"}),e(a,{slot:"item","data-section":"Workspace","data-value":"customers","data-icon":"👥","data-description":"Segments and lifecycle",children:"Customers"}),e(a,{slot:"item","data-section":"Operations","data-value":"orders","data-icon":"📦","data-description":"Pending fulfillment","data-badge":"8","data-tone":"warning",children:"Orders"}),e(a,{slot:"item","data-section":"Operations","data-value":"incidents","data-icon":"🚨","data-description":"Urgent incidents","data-badge":"3","data-tone":"danger",children:"Incidents"}),e(a,{slot:"item","data-section":"System","data-value":"settings","data-icon":"⚙️","data-description":"Preferences and access",children:"Settings"}),e(a,{slot:"footer",children:"Signed in as owner@editora.dev"})]}),t(a,{variant:"surface",p:"20px",style:{background:"var(--ui-color-surface-alt, #f8fafc)"},children:[t(a,{style:{fontSize:"var(--ui-font-size-lg, 18px)",fontWeight:700,marginBottom:8},children:["Section: ",l]}),e(a,{style:{color:"var(--ui-color-muted, #64748b)",marginBottom:12},children:"Production shell pattern with grouped items, badge states, keyboard navigation, and collapsible rail mode."}),t(g,{gap:"10px",align:"center",children:[e(u,{size:"sm",variant:"secondary",onClick:()=>f(o=>!o),children:i?"Expand nav":"Collapse nav"}),e(u,{size:"sm",variant:"ghost",onClick:()=>r("dashboard"),children:"Reset selection"})]})]})]})};c.args={collapsed:!1,collapsible:!0,rail:!1,position:"left",variant:"floating",density:"default",size:"md"};const p=()=>{const[n,l]=d.useState("overview"),r=d.useMemo(()=>[{section:"General",value:"overview",label:"Overview",icon:"🧭",description:"Health summary",active:!0},{section:"General",value:"reports",label:"Reports",icon:"🧾",description:"Revenue exports",badge:"4"},{section:"Management",value:"team",label:"Team",icon:"🫂",description:"Roles and invites"},{section:"Management",value:"security",label:"Security",icon:"🔐",description:"Policies",tone:"danger"}],[]);return t(h,{columns:"auto 1fr",style:{minHeight:360,border:"1px solid var(--ui-color-border, #cbd5e1)",borderRadius:"calc(var(--ui-radius, 12px) + 2px)",overflow:"hidden"},children:[e(s,{items:r,value:n,variant:"soft",tone:"brand",showBadges:!0,collapsible:!0,onSelect:i=>l(i.value),children:e(a,{slot:"header",style:{fontWeight:700},children:"Data-driven Navigation"})}),t(a,{p:"18px",style:{background:"var(--ui-color-surface-alt, #f8fafc)"},children:[e("strong",{children:"Active:"})," ",n]})]})},m=()=>t(h,{columns:{initial:"1fr",lg:"repeat(3, minmax(0, 1fr))"},gap:"14px",children:[t(s,{variant:"surface",value:"home",style:{height:300},children:[e(a,{slot:"header",style:{fontWeight:700},children:"Surface"}),e(a,{slot:"item","data-value":"home","data-icon":"🏠","data-active":!0,children:"Home"}),e(a,{slot:"item","data-value":"updates","data-icon":"🛰",children:"Updates"}),e(a,{slot:"item","data-value":"tasks","data-icon":"✅",children:"Tasks"})]}),t(s,{variant:"soft",tone:"success",density:"comfortable",value:"review",style:{height:300},children:[e(a,{slot:"header",style:{fontWeight:700},children:"Soft Success"}),e(a,{slot:"item","data-value":"builds","data-icon":"⚙️",children:"Builds"}),e(a,{slot:"item","data-value":"review","data-icon":"🔍","data-active":!0,children:"Review"}),e(a,{slot:"item","data-value":"deploy","data-icon":"🚀","data-badge":"2",children:"Deploy"})]}),t(s,{variant:"contrast",value:"alerts",style:{height:300},children:[e(a,{slot:"header",style:{fontWeight:700},children:"Contrast"}),e(a,{slot:"item","data-value":"alerts","data-icon":"🚨","data-tone":"danger","data-active":!0,children:"Alerts"}),e(a,{slot:"item","data-value":"ops","data-icon":"🧠",children:"Ops"}),e(a,{slot:"item","data-value":"logs","data-icon":"📜",children:"Logs"}),e(a,{slot:"footer",children:"24/7 command center"})]})]}),v=()=>{const[n,l]=d.useState("overview"),[r,i]=d.useState(!1);return t(h,{columns:"auto 1fr",style:{minHeight:520,border:"1px solid var(--ui-color-border, #cbd5e1)",borderRadius:"calc(var(--ui-radius, 12px) + 4px)",overflow:"hidden"},children:[t(s,{value:n,collapsible:!0,variant:"floating",density:"compact",onSelect:o=>l(o.value),children:[e(a,{slot:"header",style:{fontWeight:700},children:"Operations Hub"}),e(a,{slot:"search",variant:"outline",radius:"lg",p:"8px",style:{fontSize:"var(--ui-font-size-sm, 12px)",color:"var(--ui-color-muted, #64748b)"},children:"Cmd + K for command palette"}),e(a,{slot:"item","data-section":"Overview","data-value":"overview","data-icon":"🧭","data-active":!0,children:"Overview"}),e(a,{slot:"item","data-section":"Overview","data-value":"alerts","data-icon":"🚨","data-badge":"5","data-tone":"danger",children:"Live alerts"}),e(a,{slot:"item","data-section":"Clinical","data-value":"appointments","data-icon":"🩺","data-badge":"18",children:"Appointments"}),e(a,{slot:"item","data-section":"Clinical","data-value":"patients","data-icon":"🏥",children:"Patients"}),e(a,{slot:"item","data-section":"Academic","data-value":"classes","data-icon":"🏫",children:"Classes"}),e(a,{slot:"item","data-section":"Academic","data-value":"attendance","data-icon":"🗓","data-badge":"9","data-tone":"warning",children:"Attendance"}),e(a,{slot:"item","data-section":"Finance","data-value":"billing","data-icon":"💳",children:"Billing"}),e(a,{slot:"item","data-section":"Finance","data-value":"reports","data-icon":"📊",children:"Reports"})]}),t(a,{p:"18px",style:{background:"var(--ui-color-surface-alt, #f8fafc)",display:"grid",gap:12,alignContent:"start"},children:[t(g,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"},children:[t(a,{style:{fontSize:20,fontWeight:700},children:["Module: ",n]}),t(g,{style:{display:"flex",gap:8},children:[e(u,{size:"sm",onClick:()=>i(!0),children:"Open command palette"}),e(u,{size:"sm",variant:"secondary",children:"Create ticket"}),e(u,{size:"sm",variant:"ghost",children:"Quick export"})]})]}),e(a,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:"var(--ui-font-size-md, 14px)"},children:"Dense navigation pattern with grouped modules, fast actions, and command-palette jump workflow for admin-heavy apps."})]}),e(A,{open:r,onSelect:()=>i(!1),children:["Create patient profile","Schedule consultation","Open billing queue","Jump to admissions","Run attendance sync","Generate monthly report"].map(o=>e(a,{slot:"command",children:o},o))})]})};var x,b,B;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`(args: any) => {
  const [value, setValue] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(!!args.collapsed);
  return <Grid columns="auto 1fr" style={{
    minHeight: 440,
    border: '1px solid var(--ui-color-border, #cbd5e1)',
    borderRadius: 'calc(var(--ui-radius, 12px) + 4px)',
    overflow: 'hidden'
  }}>
      <Sidebar value={value} collapsed={collapsed} collapsible={args.collapsible} rail={args.rail} position={args.position || 'left'} variant={args.variant || 'floating'} density={args.density || 'default'} size={args.size || 'md'} onSelect={detail => setValue(detail.value)} onToggle={setCollapsed}>
        <Flex slot="header" align="center" justify="space-between" style={{
        fontWeight: 700
      }}>
          <span>Editora Admin</span>
          <Badge tone="info" variant="soft" size="sm">v3</Badge>
        </Flex>

        <Box slot="search" variant="outline" radius="lg" p="8px" style={{
        fontSize: 'var(--ui-font-size-sm, 12px)',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Search apps, teams, reports...
        </Box>

        <Box slot="item" data-section="Workspace" data-value="dashboard" data-icon="🏠" data-description="Overview and KPIs" data-active>
          Dashboard
        </Box>
        <Box slot="item" data-section="Workspace" data-value="analytics" data-icon="📈" data-description="Funnels and retention" data-badge="12">
          Analytics
        </Box>
        <Box slot="item" data-section="Workspace" data-value="customers" data-icon="👥" data-description="Segments and lifecycle">
          Customers
        </Box>
        <Box slot="item" data-section="Operations" data-value="orders" data-icon="📦" data-description="Pending fulfillment" data-badge="8" data-tone="warning">
          Orders
        </Box>
        <Box slot="item" data-section="Operations" data-value="incidents" data-icon="🚨" data-description="Urgent incidents" data-badge="3" data-tone="danger">
          Incidents
        </Box>
        <Box slot="item" data-section="System" data-value="settings" data-icon="⚙️" data-description="Preferences and access">
          Settings
        </Box>

        <Box slot="footer">Signed in as owner@editora.dev</Box>
      </Sidebar>

      <Box variant="surface" p="20px" style={{
      background: 'var(--ui-color-surface-alt, #f8fafc)'
    }}>
        <Box style={{
        fontSize: 'var(--ui-font-size-lg, 18px)',
        fontWeight: 700,
        marginBottom: 8
      }}>Section: {value}</Box>
        <Box style={{
        color: 'var(--ui-color-muted, #64748b)',
        marginBottom: 12
      }}>
          Production shell pattern with grouped items, badge states, keyboard navigation, and collapsible rail mode.
        </Box>
        <Flex gap="10px" align="center">
          <Button size="sm" variant="secondary" onClick={() => setCollapsed(current => !current)}>
            {collapsed ? 'Expand nav' : 'Collapse nav'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setValue('dashboard')}>Reset selection</Button>
        </Flex>
      </Box>
    </Grid>;
}`,...(B=(b=c.parameters)==null?void 0:b.docs)==null?void 0:B.source}}};var y,D,S;p.parameters={...p.parameters,docs:{...(y=p.parameters)==null?void 0:y.docs,source:{originalSource:`() => {
  const [value, setValue] = useState('overview');
  const items = useMemo(() => [{
    section: 'General',
    value: 'overview',
    label: 'Overview',
    icon: '🧭',
    description: 'Health summary',
    active: true
  }, {
    section: 'General',
    value: 'reports',
    label: 'Reports',
    icon: '🧾',
    description: 'Revenue exports',
    badge: '4'
  }, {
    section: 'Management',
    value: 'team',
    label: 'Team',
    icon: '🫂',
    description: 'Roles and invites'
  }, {
    section: 'Management',
    value: 'security',
    label: 'Security',
    icon: '🔐',
    description: 'Policies',
    tone: 'danger' as const
  }], []);
  return <Grid columns="auto 1fr" style={{
    minHeight: 360,
    border: '1px solid var(--ui-color-border, #cbd5e1)',
    borderRadius: 'calc(var(--ui-radius, 12px) + 2px)',
    overflow: 'hidden'
  }}>
      <Sidebar items={items} value={value} variant="soft" tone="brand" showBadges collapsible onSelect={detail => setValue(detail.value)}>
        <Box slot="header" style={{
        fontWeight: 700
      }}>Data-driven Navigation</Box>
      </Sidebar>
      <Box p="18px" style={{
      background: 'var(--ui-color-surface-alt, #f8fafc)'
    }}>
        <strong>Active:</strong> {value}
      </Box>
    </Grid>;
}`,...(S=(D=p.parameters)==null?void 0:D.docs)==null?void 0:S.source}}};var w,C,z;m.parameters={...m.parameters,docs:{...(w=m.parameters)==null?void 0:w.docs,source:{originalSource:`() => <Grid columns={{
  initial: '1fr',
  lg: 'repeat(3, minmax(0, 1fr))'
} as any} gap="14px">
    <Sidebar variant="surface" value="home" style={{
    height: 300
  }}>
      <Box slot="header" style={{
      fontWeight: 700
    }}>Surface</Box>
      <Box slot="item" data-value="home" data-icon="🏠" data-active>Home</Box>
      <Box slot="item" data-value="updates" data-icon="🛰">Updates</Box>
      <Box slot="item" data-value="tasks" data-icon="✅">Tasks</Box>
    </Sidebar>

    <Sidebar variant="soft" tone="success" density="comfortable" value="review" style={{
    height: 300
  }}>
      <Box slot="header" style={{
      fontWeight: 700
    }}>Soft Success</Box>
      <Box slot="item" data-value="builds" data-icon="⚙️">Builds</Box>
      <Box slot="item" data-value="review" data-icon="🔍" data-active>Review</Box>
      <Box slot="item" data-value="deploy" data-icon="🚀" data-badge="2">Deploy</Box>
    </Sidebar>

    <Sidebar variant="contrast" value="alerts" style={{
    height: 300
  }}>
      <Box slot="header" style={{
      fontWeight: 700
    }}>Contrast</Box>
      <Box slot="item" data-value="alerts" data-icon="🚨" data-tone="danger" data-active>Alerts</Box>
      <Box slot="item" data-value="ops" data-icon="🧠">Ops</Box>
      <Box slot="item" data-value="logs" data-icon="📜">Logs</Box>
      <Box slot="footer">24/7 command center</Box>
    </Sidebar>
  </Grid>`,...(z=(C=m.parameters)==null?void 0:C.docs)==null?void 0:z.source}}};var k,E,O;v.parameters={...v.parameters,docs:{...(k=v.parameters)==null?void 0:k.docs,source:{originalSource:`() => {
  const [value, setValue] = useState('overview');
  const [openPalette, setOpenPalette] = useState(false);
  const commands = ['Create patient profile', 'Schedule consultation', 'Open billing queue', 'Jump to admissions', 'Run attendance sync', 'Generate monthly report'];
  return <Grid columns="auto 1fr" style={{
    minHeight: 520,
    border: '1px solid var(--ui-color-border, #cbd5e1)',
    borderRadius: 'calc(var(--ui-radius, 12px) + 4px)',
    overflow: 'hidden'
  }}>
      <Sidebar value={value} collapsible variant="floating" density="compact" onSelect={detail => setValue(detail.value)}>
        <Box slot="header" style={{
        fontWeight: 700
      }}>Operations Hub</Box>
        <Box slot="search" variant="outline" radius="lg" p="8px" style={{
        fontSize: 'var(--ui-font-size-sm, 12px)',
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Cmd + K for command palette
        </Box>

        <Box slot="item" data-section="Overview" data-value="overview" data-icon="🧭" data-active>Overview</Box>
        <Box slot="item" data-section="Overview" data-value="alerts" data-icon="🚨" data-badge="5" data-tone="danger">Live alerts</Box>
        <Box slot="item" data-section="Clinical" data-value="appointments" data-icon="🩺" data-badge="18">Appointments</Box>
        <Box slot="item" data-section="Clinical" data-value="patients" data-icon="🏥">Patients</Box>
        <Box slot="item" data-section="Academic" data-value="classes" data-icon="🏫">Classes</Box>
        <Box slot="item" data-section="Academic" data-value="attendance" data-icon="🗓" data-badge="9" data-tone="warning">Attendance</Box>
        <Box slot="item" data-section="Finance" data-value="billing" data-icon="💳">Billing</Box>
        <Box slot="item" data-section="Finance" data-value="reports" data-icon="📊">Reports</Box>
      </Sidebar>

      <Box p="18px" style={{
      background: 'var(--ui-color-surface-alt, #f8fafc)',
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }}>
        <Flex style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }}>
          <Box style={{
          fontSize: 20,
          fontWeight: 700
        }}>Module: {value}</Box>
          <Flex style={{
          display: 'flex',
          gap: 8
        }}>
            <Button size="sm" onClick={() => setOpenPalette(true)}>Open command palette</Button>
            <Button size="sm" variant="secondary">Create ticket</Button>
            <Button size="sm" variant="ghost">Quick export</Button>
          </Flex>
        </Flex>
        <Box style={{
        color: 'var(--ui-color-muted, #64748b)',
        fontSize: 'var(--ui-font-size-md, 14px)'
      }}>
          Dense navigation pattern with grouped modules, fast actions, and command-palette jump workflow for admin-heavy apps.
        </Box>
      </Box>

      <CommandPalette open={openPalette} onSelect={() => setOpenPalette(false)}>
        {commands.map(command => <Box key={command} slot="command">{command}</Box>)}
      </CommandPalette>
    </Grid>;
}`,...(O=(E=v.parameters)==null?void 0:E.docs)==null?void 0:O.source}}};const G=["InteractiveShell","DataDriven","VisualModes","MegaNavigationAndQuickActions"];export{p as DataDriven,c as InteractiveShell,v as MegaNavigationAndQuickActions,m as VisualModes,G as __namedExportsOrder,R as default};
