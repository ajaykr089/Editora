import{B as t,a as e,G as i,j as n,M as F,N as G,O as T,P as R,F as r,b as s}from"./index-ce0e40fa.js";import{R as W}from"./index-93f6b7ae.js";import{S as w,A as C,a as H,d as j,c as I,b as k}from"./icons-b73c9b18.js";import"./index-c197feae.js";const P={title:"UI/Box",component:t,args:{variant:"surface",tone:"default",state:"idle",elevation:"low",radius:12,interactive:!1,disabled:!1},argTypes:{variant:{control:"select",options:["default","surface","elevated","outline","glass","gradient","soft","contrast"]},tone:{control:"select",options:["default","neutral","brand","info","success","warning","danger"]},state:{control:"select",options:["idle","loading","error","success"]},elevation:{control:"select",options:["default","none","low","high"]},radius:{control:"text"},interactive:{control:"boolean"},disabled:{control:"boolean"}}},l={render:a=>e(i,{style:{gap:16,maxInlineSize:760},children:n(F,{radius:16,children:[n(G,{children:[e(T,{children:"Box"}),e(R,{children:"Low-level surface and layout primitive for spacing, state, elevation, and responsive container styling."})]}),e(t,{slot:"inset",style:{padding:16},children:e(t,{p:"16px",...a,children:"Modern `ui-box` surface with theme-backed variants, tone, state, elevation, and radius."})})]})})},c={render:()=>e(i,{style:{gap:14,maxInlineSize:980},children:[{label:"Surface",variant:"surface",tone:"default"},{label:"Elevated",variant:"elevated",tone:"default"},{label:"Outline",variant:"outline",tone:"info"},{label:"Soft",variant:"soft",tone:"success"},{label:"Glass",variant:"glass",tone:"brand"},{label:"Gradient",variant:"gradient",tone:"warning"},{label:"Contrast",variant:"contrast",tone:"default"}].map(a=>n(i,{style:{gap:8},children:[e(t,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:a.label}),n(t,{variant:a.variant,tone:a.tone,elevation:"low",radius:12,p:"16px",style:{display:"grid",gap:8},children:[n(r,{align:"center",style:{gap:8},children:[e(w,{size:15}),n("strong",{children:[a.label," container"]})]}),e(t,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"Shared theme tokens control border, background, radius, shadow, and tone treatment."})]})]},a.label))})},d={render:()=>{const[a,o]=W.useState("idle");return n(i,{style:{gap:14,maxInlineSize:860},children:[n(t,{variant:"outline",tone:a==="error"?"danger":a==="success"?"success":"info",state:a,elevation:"low",radius:16,interactive:!0,p:"16px",style:{display:"grid",gap:10},children:[n(r,{align:"center",justify:"space-between",style:{gap:10,flexWrap:"wrap"},children:[n(r,{align:"center",style:{gap:8},children:[e(C,{size:16}),e("strong",{children:"Realtime monitoring panel"})]}),n(t,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)"},children:["State: ",a]})]}),e(t,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"This surface demonstrates interactive focus styling plus loading, error, and success state treatments."})]}),n(r,{align:"center",style:{gap:8,flexWrap:"wrap"},children:[n(s,{size:"sm",variant:"secondary",onClick:()=>o("idle"),children:[e(H,{size:14}),"Idle"]}),n(s,{size:"sm",variant:"secondary",onClick:()=>o("loading"),children:[e(j,{size:14}),"Loading"]}),n(s,{size:"sm",variant:"secondary",onClick:()=>o("error"),children:[e(I,{size:14}),"Error"]}),n(s,{size:"sm",onClick:()=>o("success"),children:[e(k,{size:14}),"Success"]})]})]})}},p={render:()=>n(i,{style:{gap:14,maxInlineSize:1080},children:[e(t,{variant:"gradient",tone:"brand",radius:16,p:"16px",children:n(r,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:[n(t,{children:[e(t,{style:{fontWeight:700,fontSize:18},children:"Operations dashboard shell"}),e(t,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13,marginTop:4},children:"Responsive spacing and surface composition using `ui-box` as the layout substrate."})]}),n(r,{align:"center",style:{gap:8,color:"var(--ui-color-muted, #64748b)",fontSize:12},children:[e(w,{size:14}),"Shift B"]})]})}),n(i,{style:{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(230px, 1fr))"},children:[n(t,{variant:"surface",tone:"info",elevation:"low",interactive:!0,p:"16px",style:{minHeight:134,display:"grid",gap:10},children:[n(r,{align:"center",style:{gap:8},children:[e(C,{size:16}),e("strong",{children:"Triage queue"})]}),e(t,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"22 pending assessments, average wait 9 minutes."})]}),n(t,{variant:"soft",tone:"success",elevation:"low",interactive:!0,p:"16px",style:{minHeight:134,display:"grid",gap:10},children:[n(r,{align:"center",style:{gap:8},children:[e(k,{size:16}),e("strong",{children:"Bed allocation"})]}),e(t,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"94% occupancy, 4 discharge-ready patients."})]}),n(t,{variant:"outline",tone:"warning",elevation:"low",interactive:!0,p:"16px",style:{minHeight:134,display:"grid",gap:10},children:[n(r,{align:"center",style:{gap:8},children:[e(I,{size:16}),e("strong",{children:"Compliance audit"})]}),e(t,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"2 notes require signature validation."})]})]}),e(t,{variant:"elevated",radius:16,p:{initial:"12px",md:"16px"},style:{display:"grid",gap:10},children:e(t,{style:{fontSize:13,color:"var(--ui-color-muted, #64748b)"},children:"Responsive padding here is driven by the layout props, while variant, elevation, and radius stay theme-backed."})})]})};var u,g,v;l.parameters={...l.parameters,docs:{...(u=l.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: args => <Grid style={{
    gap: 16,
    maxInlineSize: 760
  }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Box</CardTitle>
          <CardDescription>
            Low-level surface and layout primitive for spacing, state, elevation, and responsive container styling.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{
        padding: 16
      }}>
          <Box p="16px" {...args}>
            Modern \`ui-box\` surface with theme-backed variants, tone, state, elevation, and radius.
          </Box>
        </Box>
      </Card>
    </Grid>
}`,...(v=(g=l.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var y,m,x;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14,
    maxInlineSize: 980
  }}>
      {[{
      label: 'Surface',
      variant: 'surface',
      tone: 'default'
    }, {
      label: 'Elevated',
      variant: 'elevated',
      tone: 'default'
    }, {
      label: 'Outline',
      variant: 'outline',
      tone: 'info'
    }, {
      label: 'Soft',
      variant: 'soft',
      tone: 'success'
    }, {
      label: 'Glass',
      variant: 'glass',
      tone: 'brand'
    }, {
      label: 'Gradient',
      variant: 'gradient',
      tone: 'warning'
    }, {
      label: 'Contrast',
      variant: 'contrast',
      tone: 'default'
    }].map(entry => <Grid key={entry.label} style={{
      gap: 8
    }}>
          <Box style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{entry.label}</Box>
          <Box variant={entry.variant as any} tone={entry.tone as any} elevation="low" radius={12} p="16px" style={{
        display: 'grid',
        gap: 8
      }}>
            <Flex align="center" style={{
          gap: 8
        }}>
              <ShieldIcon size={15} />
              <strong>{entry.label} container</strong>
            </Flex>
            <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13
        }}>
              Shared theme tokens control border, background, radius, shadow, and tone treatment.
            </Box>
          </Box>
        </Grid>)}
    </Grid>
}`,...(x=(m=c.parameters)==null?void 0:m.docs)==null?void 0:x.source}}};var h,f,b;d.parameters={...d.parameters,docs:{...(h=d.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => {
    const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
    return <Grid style={{
      gap: 14,
      maxInlineSize: 860
    }}>
        <Box variant="outline" tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'} state={state} elevation="low" radius={16} interactive p="16px" style={{
        display: 'grid',
        gap: 10
      }}>
          <Flex align="center" justify="space-between" style={{
          gap: 10,
          flexWrap: 'wrap'
        }}>
            <Flex align="center" style={{
            gap: 8
          }}>
              <ActivityIcon size={16} />
              <strong>Realtime monitoring panel</strong>
            </Flex>
            <Box style={{
            fontSize: 12,
            color: 'var(--ui-color-muted, #64748b)'
          }}>State: {state}</Box>
          </Flex>
          <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13
        }}>
            This surface demonstrates interactive focus styling plus loading, error, and success state treatments.
          </Box>
        </Box>

        <Flex align="center" style={{
        gap: 8,
        flexWrap: 'wrap'
      }}>
          <Button size="sm" variant="secondary" onClick={() => setState('idle')}>
            <ClockIcon size={14} />
            Idle
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setState('loading')}>
            <SparklesIcon size={14} />
            Loading
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setState('error')}>
            <AlertTriangleIcon size={14} />
            Error
          </Button>
          <Button size="sm" onClick={() => setState('success')}>
            <CheckCircleIcon size={14} />
            Success
          </Button>
        </Flex>
      </Grid>;
  }
}`,...(b=(f=d.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var S,z,B;p.parameters={...p.parameters,docs:{...(S=p.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14,
    maxInlineSize: 1080
  }}>
      <Box variant="gradient" tone="brand" radius={16} p="16px">
        <Flex align="center" justify="space-between" style={{
        gap: 12,
        flexWrap: 'wrap'
      }}>
          <Box>
            <Box style={{
            fontWeight: 700,
            fontSize: 18
          }}>Operations dashboard shell</Box>
            <Box style={{
            color: 'var(--ui-color-muted, #64748b)',
            fontSize: 13,
            marginTop: 4
          }}>
              Responsive spacing and surface composition using \`ui-box\` as the layout substrate.
            </Box>
          </Box>
          <Flex align="center" style={{
          gap: 8,
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 12
        }}>
            <ShieldIcon size={14} />
            Shift B
          </Flex>
        </Flex>
      </Box>

      <Grid style={{
      display: 'grid',
      gap: 12,
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))'
    }}>
        <Box variant="surface" tone="info" elevation="low" interactive p="16px" style={{
        minHeight: 134,
        display: 'grid',
        gap: 10
      }}>
          <Flex align="center" style={{
          gap: 8
        }}>
            <ActivityIcon size={16} />
            <strong>Triage queue</strong>
          </Flex>
          <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13
        }}>22 pending assessments, average wait 9 minutes.</Box>
        </Box>

        <Box variant="soft" tone="success" elevation="low" interactive p="16px" style={{
        minHeight: 134,
        display: 'grid',
        gap: 10
      }}>
          <Flex align="center" style={{
          gap: 8
        }}>
            <CheckCircleIcon size={16} />
            <strong>Bed allocation</strong>
          </Flex>
          <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13
        }}>94% occupancy, 4 discharge-ready patients.</Box>
        </Box>

        <Box variant="outline" tone="warning" elevation="low" interactive p="16px" style={{
        minHeight: 134,
        display: 'grid',
        gap: 10
      }}>
          <Flex align="center" style={{
          gap: 8
        }}>
            <AlertTriangleIcon size={16} />
            <strong>Compliance audit</strong>
          </Flex>
          <Box style={{
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13
        }}>2 notes require signature validation.</Box>
        </Box>
      </Grid>

      <Box variant="elevated" radius={16} p={{
      initial: '12px',
      md: '16px'
    }} style={{
      display: 'grid',
      gap: 10
    }}>
        <Box style={{
        fontSize: 13,
        color: 'var(--ui-color-muted, #64748b)'
      }}>
          Responsive padding here is driven by the layout props, while variant, elevation, and radius stay theme-backed.
        </Box>
      </Box>
    </Grid>
}`,...(B=(z=p.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};const q=["Playground","VariantGallery","InteractiveStates","ResponsiveLayoutPattern"];export{d as InteractiveStates,l as Playground,p as ResponsiveLayoutPattern,c as VariantGallery,q as __namedExportsOrder,P as default};
