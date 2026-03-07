import{o,j as n,G as c,a as e,B as l,F as p,ai as A}from"./index-c1b18327.js";import{R as u}from"./index-93f6b7ae.js";const k={title:"UI/Select",component:o,argTypes:{value:{control:"text"},disabled:{control:"boolean"},loading:{control:"boolean"},variant:{control:"select",options:["classic","surface","soft","filled","outline","line","minimal","ghost","solid","glass","contrast"]},size:{control:"select",options:["sm","md","lg"]},density:{control:"select",options:["default","compact","comfortable"]},shape:{control:"select",options:["rounded","square","pill"]},elevation:{control:"select",options:["low","none","high"]},tone:{control:"select",options:["default","brand","success","warning","danger"]},validation:{control:"select",options:["none","success","warning","error"]}}},i=a=>{const[t,C]=u.useState(a.value||"draft");return n(c,{style:{display:"grid",gap:14,maxWidth:420},children:[n(o,{...a,label:"Workflow status",description:"Used by approvers and automations.",value:t,onChange:C,variant:a.variant||"soft",tone:a.tone||"brand",shape:a.shape||"rounded",elevation:a.elevation||"low",density:a.density||"default",validation:a.validation&&a.validation!=="none"?a.validation:void 0,children:[e("option",{value:"draft",children:"Draft"}),e("option",{value:"review",children:"In Review"}),e("option",{value:"published",children:"Published"}),e("option",{value:"archived",children:"Archived"})]}),n(l,{style:{fontSize:13,color:"#475569"},children:["Selected value: ",t]})]})};i.args={value:"draft",disabled:!1,loading:!1,size:"md",density:"default",shape:"rounded",elevation:"low",variant:"soft",tone:"brand",validation:"none"};const r=()=>{const[a,t]=u.useState("high");return n(c,{style:{display:"grid",gap:16,maxWidth:980},children:[n(p,{style:{display:"flex",gap:12,flexWrap:"wrap"},children:[e(l,{style:{minWidth:220},children:n(o,{label:"Classic",value:a,onChange:t,variant:"classic",children:[e("option",{value:"low",children:"Low priority"}),e("option",{value:"medium",children:"Medium priority"}),e("option",{value:"high",children:"High priority"}),e("option",{value:"critical",children:"Critical"})]})}),e(l,{style:{minWidth:220},children:n(o,{label:"Outline",value:"healthy",variant:"outline",tone:"success",validation:"success",children:[e("option",{value:"healthy",children:"Healthy"}),e("option",{value:"degraded",children:"Degraded"}),e("option",{value:"outage",children:"Outage"})]})}),e(l,{style:{minWidth:220},children:n(o,{label:"Line",value:"ops",variant:"line",tone:"warning",description:"Dense dashboard pattern",children:[e("option",{value:"ops",children:"Ops"}),e("option",{value:"support",children:"Support"}),e("option",{value:"security",children:"Security"})]})}),e(l,{style:{minWidth:220},children:n(o,{label:"Solid",value:"team-a",variant:"solid",tone:"brand",shape:"pill",children:[e("option",{value:"team-a",children:"Team A"}),e("option",{value:"team-b",children:"Team B"}),e("option",{value:"team-c",children:"Team C"})]})})]}),e(A,{label:"Glass / Contrast / Ghost",variant:"gradient"}),n(p,{style:{display:"flex",gap:12,flexWrap:"wrap"},children:[e(l,{style:{minWidth:220},children:n(o,{label:"Glass",value:"monthly",variant:"glass",shape:"rounded",children:[e("option",{value:"weekly",children:"Weekly"}),e("option",{value:"monthly",children:"Monthly"}),e("option",{value:"quarterly",children:"Quarterly"})]})}),e(l,{style:{minWidth:220},children:n(o,{label:"Ghost",value:"api",variant:"ghost",elevation:"none",children:[e("option",{value:"api",children:"API"}),e("option",{value:"sdk",children:"SDK"}),e("option",{value:"cli",children:"CLI"})]})}),e(l,{style:{minWidth:220},children:n(o,{label:"Contrast",value:"p1",variant:"contrast",tone:"warning",children:[e("option",{value:"p0",children:"P0"}),e("option",{value:"p1",children:"P1"}),e("option",{value:"p2",children:"P2"})]})}),e(l,{style:{minWidth:220},children:n(o,{label:"Minimal",value:"en",variant:"minimal",elevation:"none",children:[e("option",{value:"en",children:"English"}),e("option",{value:"fr",children:"French"}),e("option",{value:"zh",children:"Chinese"})]})})]})]})},s=()=>e(c,{style:{display:"grid",gap:12,maxWidth:900},children:e(l,{variant:"surface",p:"12px",style:{border:"1px solid #cbd5e1",borderRadius:6,"--ui-select-border-color":"#94a3b8","--ui-select-bg":"#ffffff","--ui-select-accent":"#0f172a","--ui-select-elevation":"none"},children:n(p,{style:{display:"flex",gap:10,flexWrap:"wrap"},children:[e(l,{style:{minWidth:220},children:n(o,{label:"Square flat",variant:"outline",shape:"square",elevation:"none",value:"ready",children:[e("option",{value:"ready",children:"Ready"}),e("option",{value:"blocked",children:"Blocked"}),e("option",{value:"done",children:"Done"})]})}),e(l,{style:{minWidth:220},children:n(o,{label:"Compact",density:"compact",variant:"line",shape:"square",value:"7d",children:[e("option",{value:"24h",children:"24h"}),e("option",{value:"7d",children:"7d"}),e("option",{value:"30d",children:"30d"})]})}),e(l,{style:{minWidth:220},children:n(o,{label:"Comfortable",density:"comfortable",variant:"surface",shape:"rounded",value:"all",children:[e("option",{value:"all",children:"All projects"}),e("option",{value:"active",children:"Active"}),e("option",{value:"archived",children:"Archived"})]})})]})})}),d=()=>{const[a,t]=u.useState("");return n(c,{style:{display:"grid",gap:12,maxWidth:760},children:[n(o,{label:"Required with placeholder",description:"Placeholder remains visible until user picks a value.",required:!0,placeholder:"Choose owner",value:a,validation:a?"success":"error",error:a?"":"Owner is required",onChange:t,children:[e("option",{value:"ajay",children:"Ajay Kumar"}),e("option",{value:"sarah",children:"Sarah Lee"}),e("option",{value:"alex",children:"Alex Chen"})]}),n(o,{label:"Grouped options",value:"ap-south",children:[n("optgroup",{label:"US",children:[e("option",{value:"us-east",children:"US East"}),e("option",{value:"us-west",children:"US West"})]}),n("optgroup",{label:"APAC",children:[e("option",{value:"ap-south",children:"AP South"}),e("option",{value:"ap-southeast",children:"AP Southeast"})]})]}),n(p,{style:{display:"flex",gap:12,flexWrap:"wrap"},children:[e(l,{style:{minWidth:220},children:n(o,{label:"Loading",loading:!0,value:"sync",description:"Shows non-blocking spinner state",children:[e("option",{value:"sync",children:"Syncing…"}),e("option",{value:"done",children:"Done"})]})}),e(l,{style:{minWidth:220},children:e(o,{label:"Disabled",disabled:!0,value:"readonly",children:e("option",{value:"readonly",children:"Read only"})})})]})]})};var h,v,y;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`(args: any) => {
  const [value, setValue] = React.useState(args.value || 'draft');
  return <Grid style={{
    display: 'grid',
    gap: 14,
    maxWidth: 420
  }}>
      <Select {...args} label="Workflow status" description="Used by approvers and automations." value={value} onChange={setValue} variant={args.variant || 'soft'} tone={args.tone || 'brand'} shape={args.shape || 'rounded'} elevation={args.elevation || 'low'} density={args.density || 'default'} validation={args.validation && args.validation !== 'none' ? args.validation : undefined}>
        <option value="draft">Draft</option>
        <option value="review">In Review</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </Select>
      <Box style={{
      fontSize: 13,
      color: '#475569'
    }}>Selected value: {value}</Box>
    </Grid>;
}`,...(y=(v=i.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var m,g,b;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const [priority, setPriority] = React.useState('high');
  return <Grid style={{
    display: 'grid',
    gap: 16,
    maxWidth: 980
  }}>
      <Flex style={{
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }}>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Classic" value={priority} onChange={setPriority} variant="classic">
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
            <option value="critical">Critical</option>
          </Select>
        </Box>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Outline" value="healthy" variant="outline" tone="success" validation="success">
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="outage">Outage</option>
          </Select>
        </Box>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Line" value="ops" variant="line" tone="warning" description="Dense dashboard pattern">
            <option value="ops">Ops</option>
            <option value="support">Support</option>
            <option value="security">Security</option>
          </Select>
        </Box>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Solid" value="team-a" variant="solid" tone="brand" shape="pill">
            <option value="team-a">Team A</option>
            <option value="team-b">Team B</option>
            <option value="team-c">Team C</option>
          </Select>
        </Box>
      </Flex>

      <Separator label="Glass / Contrast / Ghost" variant="gradient" />

      <Flex style={{
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }}>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Glass" value="monthly" variant="glass" shape="rounded">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </Select>
        </Box>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Ghost" value="api" variant="ghost" elevation="none">
            <option value="api">API</option>
            <option value="sdk">SDK</option>
            <option value="cli">CLI</option>
          </Select>
        </Box>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Contrast" value="p1" variant="contrast" tone="warning">
            <option value="p0">P0</option>
            <option value="p1">P1</option>
            <option value="p2">P2</option>
          </Select>
        </Box>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Minimal" value="en" variant="minimal" elevation="none">
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="zh">Chinese</option>
          </Select>
        </Box>
      </Flex>
    </Grid>;
}`,...(b=(g=r.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var S,x,f;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`() => <Grid style={{
  display: 'grid',
  gap: 12,
  maxWidth: 900
}}>
    <Box variant="surface" p="12px" style={{
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    ['--ui-select-border-color' as any]: '#94a3b8',
    ['--ui-select-bg' as any]: '#ffffff',
    ['--ui-select-accent' as any]: '#0f172a',
    ['--ui-select-elevation' as any]: 'none'
  }}>
      <Flex style={{
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }}>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Square flat" variant="outline" shape="square" elevation="none" value="ready">
            <option value="ready">Ready</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </Select>
        </Box>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Compact" density="compact" variant="line" shape="square" value="7d">
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
          </Select>
        </Box>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Comfortable" density="comfortable" variant="surface" shape="rounded" value="all">
            <option value="all">All projects</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </Select>
        </Box>
      </Flex>
    </Box>
  </Grid>`,...(f=(x=s.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var w,W,B;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`() => {
  const [owner, setOwner] = React.useState('');
  return <Grid style={{
    display: 'grid',
    gap: 12,
    maxWidth: 760
  }}>
      <Select label="Required with placeholder" description="Placeholder remains visible until user picks a value." required placeholder="Choose owner" value={owner} validation={owner ? 'success' : 'error'} error={owner ? '' : 'Owner is required'} onChange={setOwner}>
        <option value="ajay">Ajay Kumar</option>
        <option value="sarah">Sarah Lee</option>
        <option value="alex">Alex Chen</option>
      </Select>

      <Select label="Grouped options" value="ap-south">
        <optgroup label="US">
          <option value="us-east">US East</option>
          <option value="us-west">US West</option>
        </optgroup>
        <optgroup label="APAC">
          <option value="ap-south">AP South</option>
          <option value="ap-southeast">AP Southeast</option>
        </optgroup>
      </Select>

      <Flex style={{
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }}>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Loading" loading value="sync" description="Shows non-blocking spinner state">
            <option value="sync">Syncing…</option>
            <option value="done">Done</option>
          </Select>
        </Box>
        <Box style={{
        minWidth: 220
      }}>
          <Select label="Disabled" disabled value="readonly">
            <option value="readonly">Read only</option>
          </Select>
        </Box>
      </Flex>
    </Grid>;
}`,...(B=(W=d.parameters)==null?void 0:W.docs)==null?void 0:B.source}}};const D=["EnterpriseWorkflow","DesignPatterns","FlatAdminSystem","EdgeScenarios"];export{r as DesignPatterns,d as EdgeScenarios,i as EnterpriseWorkflow,s as FlatAdminSystem,D as __namedExportsOrder,k as default};
