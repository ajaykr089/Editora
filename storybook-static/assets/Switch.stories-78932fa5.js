import{as as n,j as a,G as i,a as e,B as d,F as l}from"./index-ce0e40fa.js";import{R as F}from"./index-93f6b7ae.js";import"./index-c197feae.js";const q={title:"UI/Switch",component:n,argTypes:{checked:{control:"boolean"},disabled:{control:"boolean"},loading:{control:"boolean"},size:{control:"select",options:["sm","md","lg"]},variant:{control:"select",options:["default","soft","outline","contrast","minimal"]},tone:{control:"select",options:["brand","success","warning","danger"]},shape:{control:"select",options:["pill","rounded","square"]},elevation:{control:"select",options:["low","none","high"]}}},r=t=>{const[h,C]=F.useState(!!t.checked);return a(i,{gap:"12px",style:{maxWidth:520},children:[a(n,{checked:h,disabled:t.disabled,loading:t.loading,size:t.size||"md",variant:t.variant||"default",tone:t.tone||"brand",shape:t.shape||"pill",elevation:t.elevation||"low",onChange:z=>C(z.checked),children:["Enable workspace automations",e("span",{slot:"description",children:"Run triggers when publishing or archiving content."})]}),a(d,{variant:"surface",p:"10px",style:{fontSize:13,color:"#475569"},children:["Current state: ",e("strong",{children:h?"on":"off"})]})]})};r.args={checked:!0,disabled:!1,loading:!1,size:"md",variant:"default",tone:"brand",shape:"pill",elevation:"low"};const c=()=>a(i,{gap:"12px",style:{maxWidth:760},children:[a(l,{gap:"12px",wrap:"wrap",children:[e(n,{checked:!0,variant:"default",children:"Default"}),e(n,{checked:!0,variant:"soft",children:"Soft"}),e(n,{checked:!0,variant:"outline",children:"Outline"}),e(n,{checked:!0,variant:"minimal",children:"Minimal"})]}),e(d,{variant:"contrast",p:"12px",radius:"lg",children:a(n,{checked:!0,variant:"contrast",tone:"warning",children:["Contrast mode",e("span",{slot:"description",children:"Improved visibility for command center layouts."})]})}),a(l,{gap:"12px",wrap:"wrap",children:[e(n,{checked:!0,tone:"success",children:"Healthy sync"}),e(n,{checked:!0,tone:"warning",children:"Pending approvals"}),e(n,{checked:!0,tone:"danger",children:"Destructive action"}),e(n,{loading:!0,checked:!0,children:"Syncing"}),e(n,{disabled:!0,checked:!0,children:"Disabled"})]})]}),s=()=>a(i,{gap:"12px",style:{maxWidth:760},children:[e(d,{variant:"surface",p:"12px",style:{border:"1px solid #cbd5e1",borderRadius:6,"--ui-switch-radius":"4px","--ui-switch-track-bg":"#ffffff","--ui-switch-track-border":"#94a3b8","--ui-switch-thumb-bg":"#0f172a","--ui-switch-thumb-color":"#ffffff","--ui-switch-accent":"#0f172a","--ui-switch-accent-hover":"#1e293b"},children:a(i,{gap:"10px",children:[a(n,{checked:!0,shape:"square",elevation:"none",variant:"outline",children:["Flat square",e("span",{slot:"description",children:"No shadow, crisp border for dense dashboards."})]}),e(n,{shape:"rounded",elevation:"none",variant:"outline",children:"Flat rounded"})]})}),a(l,{gap:"12px",wrap:"wrap",children:[e(n,{checked:!0,size:"sm",shape:"square",elevation:"none",children:"Small"}),e(n,{checked:!0,size:"md",shape:"rounded",elevation:"low",children:"Medium"}),e(n,{checked:!0,size:"lg",shape:"pill",elevation:"high",children:"Large"})]})]}),o=()=>e(i,{gap:"12px",style:{maxWidth:760},children:e(d,{variant:"surface",p:"12px",style:{border:"1px solid #e2e8f0",borderRadius:10},children:a(i,{gap:"10px",children:[a(n,{checked:!0,name:"alerts",value:"email-alerts",required:!0,children:["Press Arrow Left/Right, Home, End",e("span",{slot:"description",children:"Label click also toggles. Inner links are non-toggling interactive targets."})]}),a(n,{children:["Incident digest",e("a",{slot:"description",href:"#","data-ui-switch-no-toggle":!0,onClick:t=>t.preventDefault(),children:"Open policy (does not toggle)"})]})]})})});var p,u,g;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`(args: any) => {
  const [checked, setChecked] = React.useState(Boolean(args.checked));
  return <Grid gap="12px" style={{
    maxWidth: 520
  }}>
      <Switch checked={checked} disabled={args.disabled} loading={args.loading} size={args.size || 'md'} variant={args.variant || 'default'} tone={args.tone || 'brand'} shape={args.shape || 'pill'} elevation={args.elevation || 'low'} onChange={detail => setChecked(detail.checked)}>
        Enable workspace automations
        <span slot="description">Run triggers when publishing or archiving content.</span>
      </Switch>

      <Box variant="surface" p="10px" style={{
      fontSize: 13,
      color: '#475569'
    }}>
        Current state: <strong>{checked ? 'on' : 'off'}</strong>
      </Box>
    </Grid>;
}`,...(g=(u=r.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var w,m,f;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`() => <Grid gap="12px" style={{
  maxWidth: 760
}}>
    <Flex gap="12px" wrap="wrap">
      <Switch checked variant="default">Default</Switch>
      <Switch checked variant="soft">Soft</Switch>
      <Switch checked variant="outline">Outline</Switch>
      <Switch checked variant="minimal">Minimal</Switch>
    </Flex>

    <Box variant="contrast" p="12px" radius="lg">
      <Switch checked variant="contrast" tone="warning">
        Contrast mode
        <span slot="description">Improved visibility for command center layouts.</span>
      </Switch>
    </Box>

    <Flex gap="12px" wrap="wrap">
      <Switch checked tone="success">Healthy sync</Switch>
      <Switch checked tone="warning">Pending approvals</Switch>
      <Switch checked tone="danger">Destructive action</Switch>
      <Switch loading checked>Syncing</Switch>
      <Switch disabled checked>Disabled</Switch>
    </Flex>
  </Grid>`,...(f=(m=c.parameters)==null?void 0:m.docs)==null?void 0:f.source}}};var v,x,k;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`() => <Grid gap="12px" style={{
  maxWidth: 760
}}>
    <Box variant="surface" p="12px" style={{
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    ['--ui-switch-radius' as any]: '4px',
    ['--ui-switch-track-bg' as any]: '#ffffff',
    ['--ui-switch-track-border' as any]: '#94a3b8',
    ['--ui-switch-thumb-bg' as any]: '#0f172a',
    ['--ui-switch-thumb-color' as any]: '#ffffff',
    ['--ui-switch-accent' as any]: '#0f172a',
    ['--ui-switch-accent-hover' as any]: '#1e293b'
  }}>
      <Grid gap="10px">
        <Switch checked shape="square" elevation="none" variant="outline">
          Flat square
          <span slot="description">No shadow, crisp border for dense dashboards.</span>
        </Switch>
        <Switch shape="rounded" elevation="none" variant="outline">Flat rounded</Switch>
      </Grid>
    </Box>

    <Flex gap="12px" wrap="wrap">
      <Switch checked size="sm" shape="square" elevation="none">Small</Switch>
      <Switch checked size="md" shape="rounded" elevation="low">Medium</Switch>
      <Switch checked size="lg" shape="pill" elevation="high">Large</Switch>
    </Flex>
  </Grid>`,...(k=(x=s.parameters)==null?void 0:x.docs)==null?void 0:k.source}}};var b,S,y;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`() => <Grid gap="12px" style={{
  maxWidth: 760
}}>
    <Box variant="surface" p="12px" style={{
    border: '1px solid #e2e8f0',
    borderRadius: 10
  }}>
      <Grid gap="10px">
        <Switch checked name="alerts" value="email-alerts" required>
          Press Arrow Left/Right, Home, End
          <span slot="description">Label click also toggles. Inner links are non-toggling interactive targets.</span>
        </Switch>
        <Switch>
          Incident digest
          <a slot="description" href="#" data-ui-switch-no-toggle onClick={e => e.preventDefault()}>
            Open policy (does not toggle)
          </a>
        </Switch>
      </Grid>
    </Box>
  </Grid>`,...(y=(S=o.parameters)==null?void 0:S.docs)==null?void 0:y.source}}};const E=["Controlled","VisualModes","FlatEnterpriseShapes","KeyboardAndEdgeCases"];export{r as Controlled,s as FlatEnterpriseShapes,o as KeyboardAndEdgeCases,c as VisualModes,E as __namedExportsOrder,q as default};
