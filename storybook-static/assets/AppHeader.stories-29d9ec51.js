import{i as m,a as e,G as t,j as n,M as D,N as I,O as P,P as O,B as a,Q as W,F as u,R as E,U,V,b as h,W as L,l as _}from"./index-ce0e40fa.js";import{R as Q}from"./index-93f6b7ae.js";import{d as J,S as K,e as X,B as Y}from"./icons-b73c9b18.js";import"./index-c197feae.js";const ne={title:"UI/AppHeader",component:m,args:{bordered:!0,sticky:!1,variant:"surface",tone:"neutral",size:"md",elevation:"low",radius:12},argTypes:{variant:{control:"select",options:["surface","soft","outline","solid"]},tone:{control:"select",options:["neutral","info","success","warning","danger"]},size:{control:"select",options:["sm","md","lg"]},elevation:{control:"select",options:["none","low","high"]},radius:{control:"text"}}};function p(r){return n(m,{...r,style:{width:"100%"},children:[e(W,{children:n(u,{align:"center",style:{gap:10},children:[e(a,{style:{width:30,height:30,borderRadius:10,display:"inline-flex",alignItems:"center",justifyContent:"center",background:"color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)",color:"var(--ui-color-primary, #2563eb)"},children:e(K,{size:15})}),e(u,{direction:"column",style:{gap:0},children:e(a,{style:{fontWeight:600},children:"Editora Ops"})})]})}),e(L,{children:e(_,{tone:"info",variant:"soft",children:"Live"})}),e(E,{children:"Clinical Command Center"}),e(U,{children:"North campus · Shift A · 08:15 UTC"}),n(V,{children:[n(h,{size:"sm",recipe:"soft",variant:"secondary",children:[e(X,{size:14}),"Search"]}),n(h,{size:"sm",recipe:"soft",variant:"secondary",children:[e(Y,{size:14}),"Alerts"]})]})]})}function j(r){const[q,F]=Q.useState(!1);return n(t,{style:{gap:12},children:[e(p,{...r,showMenuButton:!0,onMenuTrigger:()=>F(N=>!N)}),e(a,{style:{display:q?"block":"none",padding:14,borderRadius:14,border:"1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)",background:"color-mix(in srgb, var(--ui-color-surface-alt, #f8fafc) 78%, transparent)"},children:n(u,{direction:"column",style:{gap:8},children:[e(a,{style:{fontWeight:600},children:"Navigation"}),e(a,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"Dashboard, Patients, Staffing, and Billing are available from the app shell."})]})})]})}const i={render:r=>e(t,{style:{gap:16},children:n(D,{radius:16,children:[n(I,{children:[e(P,{children:"App header"}),e(O,{children:"Token-backed shell for branding, title context, search/actions, and mobile navigation."})]}),e(a,{slot:"inset",style:{padding:12},children:e(j,{...r})})]})})},o={render:()=>e(t,{style:{gap:14},children:[{label:"Surface",variant:"surface",tone:"neutral"},{label:"Soft",variant:"soft",tone:"info"},{label:"Outline",variant:"outline",tone:"warning"},{label:"Solid",variant:"solid",tone:"info"}].map(r=>n(t,{style:{gap:8},children:[e(a,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:r.label}),e(p,{bordered:!0,showMenuButton:!0,variant:r.variant,tone:r.tone,radius:12})]},r.label))})},s={render:()=>e(t,{style:{gap:14},children:[{label:"Small",size:"sm"},{label:"Medium",size:"md"},{label:"Large",size:"lg"}].map(r=>n(t,{style:{gap:8},children:[e(a,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:r.label}),e(p,{bordered:!0,showMenuButton:!0,size:r.size,radius:r.size==="lg"?16:12})]},r.label))})},l={render:()=>n(t,{style:{gap:14},children:[e(j,{sticky:!0,bordered:!0,variant:"soft",tone:"info",elevation:"low",radius:16}),e(t,{style:{gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))"},children:[{title:"Critical escalations",description:"3 cases require acknowledgment inside the next 30 minutes."},{title:"Automation coverage",description:"92% of nightly triage rules completed without manual intervention."},{title:"Priority releases",description:"Two release trains are queued for clinical review and approval."}].map(r=>e(D,{variant:"soft",radius:16,children:n(I,{children:[e(P,{children:r.title}),e(O,{children:r.description})]})},r.title))}),e(a,{style:{padding:16,borderRadius:16,border:"1px dashed color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)",color:"var(--ui-color-muted, #64748b)"},children:"Scrollable workspace content begins here. The header remains visually stable and can switch between surface, soft, outline, and solid treatments without story-specific CSS overrides."})]})},d={render:()=>e(p,{dense:!0,bordered:!0,showMenuButton:!0,variant:"outline",tone:"neutral",radius:8,elevation:"none"})},c={render:()=>n(m,{variant:"solid",tone:"success",size:"sm",bordered:!0,radius:12,children:[e(W,{children:n(u,{align:"center",style:{gap:8,fontWeight:600},children:[e(J,{size:14}),"Deployment complete"]})}),e(E,{children:"Release 2026.03.12.4 is now active"}),e(U,{children:"Observability checks are healthy across all regions"}),e(V,{children:e(h,{size:"sm",recipe:"surface",variant:"secondary",children:"View changes"})})]})};var g,b,f;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: args => <Grid style={{
    gap: 16
  }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>App header</CardTitle>
        <CardDescription>
          Token-backed shell for branding, title context, search/actions, and mobile navigation.
        </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{
        padding: 12
      }}>
          <InteractiveHeaderShell {...args} />
        </Box>
      </Card>
    </Grid>
}`,...(f=(b=i.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var y,v,S;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14
  }}>
      {[{
      label: 'Surface',
      variant: 'surface',
      tone: 'neutral'
    }, {
      label: 'Soft',
      variant: 'soft',
      tone: 'info'
    }, {
      label: 'Outline',
      variant: 'outline',
      tone: 'warning'
    }, {
      label: 'Solid',
      variant: 'solid',
      tone: 'info'
    }].map(entry => <Grid key={entry.label} style={{
      gap: 8
    }}>
          <Box style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{entry.label}</Box>
          <HeaderChrome bordered showMenuButton variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'} tone={entry.tone as 'neutral' | 'info' | 'warning'} radius={12} />
        </Grid>)}
    </Grid>
}`,...(S=(v=o.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var w,C,x;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14
  }}>
      {[{
      label: 'Small',
      size: 'sm'
    }, {
      label: 'Medium',
      size: 'md'
    }, {
      label: 'Large',
      size: 'lg'
    }].map(entry => <Grid key={entry.label} style={{
      gap: 8
    }}>
          <Box style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{entry.label}</Box>
          <HeaderChrome bordered showMenuButton size={entry.size as 'sm' | 'md' | 'lg'} radius={entry.size === 'lg' ? 16 : 12} />
        </Grid>)}
    </Grid>
}`,...(x=(C=s.parameters)==null?void 0:C.docs)==null?void 0:x.source}}};var z,H,B;l.parameters={...l.parameters,docs:{...(z=l.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14
  }}>
      <InteractiveHeaderShell sticky bordered variant="soft" tone="info" elevation="low" radius={16} />
      <Grid style={{
      gap: 12,
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
    }}>
        {[{
        title: 'Critical escalations',
        description: '3 cases require acknowledgment inside the next 30 minutes.'
      }, {
        title: 'Automation coverage',
        description: '92% of nightly triage rules completed without manual intervention.'
      }, {
        title: 'Priority releases',
        description: 'Two release trains are queued for clinical review and approval.'
      }].map(card => <Card key={card.title} variant="soft" radius={16}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </Card>)}
      </Grid>
      <Box style={{
      padding: 16,
      borderRadius: 16,
      border: '1px dashed color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
      color: 'var(--ui-color-muted, #64748b)'
    }}>
        Scrollable workspace content begins here. The header remains visually stable and can switch between surface,
        soft, outline, and solid treatments without story-specific CSS overrides.
      </Box>
    </Grid>
}`,...(B=(H=l.parameters)==null?void 0:H.docs)==null?void 0:B.source}}};var A,k,G;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <HeaderChrome dense bordered showMenuButton variant="outline" tone="neutral" radius={8} elevation="none" />
}`,...(G=(k=d.parameters)==null?void 0:k.docs)==null?void 0:G.source}}};var T,M,R;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <AppHeader variant="solid" tone="success" size="sm" bordered radius={12}>
      <AppHeaderStart>
        <Flex align="center" style={{
        gap: 8,
        fontWeight: 600
      }}>
          <SparklesIcon size={14} />
          Deployment complete
        </Flex>
      </AppHeaderStart>
      <AppHeaderTitle>Release 2026.03.12.4 is now active</AppHeaderTitle>
      <AppHeaderSubtitle>Observability checks are healthy across all regions</AppHeaderSubtitle>
      <AppHeaderEnd>
        <Button size="sm" recipe="surface" variant="secondary">
          View changes
        </Button>
      </AppHeaderEnd>
    </AppHeader>
}`,...(R=(M=c.parameters)==null?void 0:M.docs)==null?void 0:R.source}}};const ae=["Playground","VariantGallery","SizeGallery","ProductShellPattern","DenseUtilityRail","SignalBar"];export{d as DenseUtilityRail,i as Playground,l as ProductShellPattern,c as SignalBar,s as SizeGallery,o as VariantGallery,ae as __namedExportsOrder,ne as default};
