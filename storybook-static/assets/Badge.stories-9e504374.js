import{l as t,a as e,G as r,j as a,M as P,N as j,O as D,P as M,B as o,F as l,b as L}from"./index-ce0e40fa.js";import{R as x}from"./index-93f6b7ae.js";import{S as N,A as f,a as v,b as y,c as m,X}from"./icons-b73c9b18.js";import"./index-c197feae.js";const J={title:"UI/Badge",component:t,args:{tone:"neutral",variant:"surface",size:"md",radius:"full",elevation:"none",state:"idle",dot:!1,interactive:!1,removable:!1,disabled:!1,truncate:!1,text:"Operations"},argTypes:{tone:{control:"select",options:["neutral","info","success","warning","danger","purple"]},variant:{control:"select",options:["surface","soft","solid","outline","ghost"]},size:{control:"select",options:["xs","sm","md","lg","xl","1","2","3"]},radius:{control:"text"},elevation:{control:"select",options:["none","low","high"]},state:{control:"select",options:["idle","loading","error","success"]},dot:{control:"boolean"},interactive:{control:"boolean"},removable:{control:"boolean"},disabled:{control:"boolean"},truncate:{control:"boolean"},maxWidth:{control:"text"}}},c={render:n=>e(r,{style:{gap:16,maxInlineSize:760},children:a(P,{radius:16,children:[a(j,{children:[e(D,{children:"Badge"}),e(M,{children:"Compact status surface for workflow labels, queue states, live filters, and removable metadata chips."})]}),e(o,{slot:"inset",style:{padding:16},children:e(l,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:a(l,{align:"center",style:{gap:10,flexWrap:"wrap"},children:[e(t,{...n,children:n.text}),e(o,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"Attached to the real `ui-badge` API: tone, variant, size, radius, elevation, state, and interaction props."})]})})})]})})},d={render:()=>e(r,{style:{gap:14,maxInlineSize:980},children:[{label:"Surface",variant:"surface",tone:"neutral",icon:e(N,{size:12})},{label:"Soft",variant:"soft",tone:"info",icon:e(f,{size:12})},{label:"Outline",variant:"outline",tone:"warning",icon:e(v,{size:12})},{label:"Solid",variant:"solid",tone:"success",icon:e(y,{size:12})},{label:"Ghost",variant:"ghost",tone:"danger",icon:e(m,{size:12})}].map(n=>a(r,{style:{gap:8},children:[e(o,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:n.label}),a(l,{align:"center",style:{gap:10,flexWrap:"wrap"},children:[a(t,{variant:n.variant,tone:n.tone,radius:"full",children:[e("span",{slot:"icon",children:n.icon}),n.label," workflow"]}),a(t,{variant:n.variant,tone:n.tone,radius:12,dot:!0,children:[n.label," queue"]}),a(t,{variant:n.variant,tone:n.tone,radius:4,elevation:"low",children:[n.label," tag"]})]})]},n.label))})},u={render:()=>e(r,{style:{gap:14,maxInlineSize:880},children:[{label:"Extra small",size:"xs"},{label:"Small",size:"sm"},{label:"Medium",size:"md"},{label:"Large",size:"lg"},{label:"Extra large",size:"xl"}].map(n=>a(r,{style:{gap:8},children:[e(o,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:n.label}),a(l,{align:"center",style:{gap:10,flexWrap:"wrap"},children:[a(t,{size:n.size,tone:"info",variant:"surface",children:[e("span",{slot:"icon",children:e(f,{size:12})}),"Live monitor"]}),e(t,{size:n.size,tone:"success",variant:"soft",dot:!0,children:"Healthy"}),e(t,{size:n.size,tone:"warning",variant:"outline",removable:!0,children:"Needs review"})]})]},n.label))})},g={render:()=>e(r,{style:{gap:14,maxInlineSize:900},children:a(l,{align:"center",style:{gap:10,flexWrap:"wrap"},children:[e(t,{tone:"neutral",variant:"surface",children:"Idle"}),e(t,{tone:"info",variant:"soft",state:"loading",children:"Syncing queue"}),a(t,{tone:"danger",variant:"outline",state:"error",children:[e("span",{slot:"icon",children:e(X,{size:12})}),"Feed delayed"]}),e(t,{tone:"success",variant:"solid",state:"success",dot:!0,children:"Healthy"}),e(t,{tone:"purple",variant:"surface",elevation:"high",children:"Priority"}),e(t,{tone:"warning",variant:"ghost",interactive:!0,children:"Clickable"}),e(t,{tone:"neutral",variant:"surface",disabled:!0,children:"Disabled"})]})})},p={render:()=>{const[n,O]=x.useState("critical"),[b,h]=x.useState([{id:"critical",label:"Critical",tone:"danger",icon:e(m,{size:12}),count:7},{id:"monitoring",label:"Monitoring",tone:"warning",icon:e(v,{size:12}),count:11},{id:"stable",label:"Stable",tone:"success",icon:e(y,{size:12}),count:32},{id:"telemetry",label:"Telemetry",tone:"info",icon:e(f,{size:12}),count:5}]);return e(r,{style:{gap:14,maxInlineSize:980},children:a(P,{radius:16,children:[a(j,{children:[e(D,{children:"Incident filter rail"}),e(M,{children:"Interactive triage labels, queue states, and removable routing chips for production monitoring surfaces."})]}),a(o,{slot:"inset",style:{padding:14,display:"grid",gap:14},children:[a(r,{style:{gap:8},children:[e(o,{style:{fontSize:13,color:"var(--ui-color-muted, #64748b)"},children:"Active filters"}),a(l,{align:"center",style:{gap:8,flexWrap:"wrap"},children:[b.map(i=>{const s=n===i.id;return a(t,{tone:i.tone,variant:s?"solid":"soft",interactive:!0,dot:!0,elevation:s?"high":"none",onClick:()=>O(i.id),children:[e("span",{slot:"icon",children:i.icon}),i.label," (",i.count,")"]},i.id)}),e(t,{tone:"warning",variant:"outline",state:"loading",children:"Syncing queue"})]})]}),a(r,{style:{gap:8},children:[a(l,{align:"center",justify:"space-between",style:{gap:10,flexWrap:"wrap"},children:[e(o,{style:{fontSize:13,color:"var(--ui-color-muted, #64748b)"},children:"Routing chips"}),e(L,{size:"sm",variant:"secondary",onClick:()=>h([{id:"critical",label:"Critical",tone:"danger",icon:e(m,{size:12}),count:7},{id:"monitoring",label:"Monitoring",tone:"warning",icon:e(v,{size:12}),count:11},{id:"stable",label:"Stable",tone:"success",icon:e(y,{size:12}),count:32},{id:"telemetry",label:"Telemetry",tone:"info",icon:e(f,{size:12}),count:5}]),children:"Reset filters"})]}),e(l,{align:"center",style:{gap:8,flexWrap:"wrap"},children:b.map(i=>a(t,{tone:i.tone,variant:"outline",removable:!0,truncate:!0,maxWidth:"18ch",onRemove:()=>h(s=>s.filter(E=>E.id!==i.id)),children:[e("span",{slot:"icon",children:i.icon}),i.label," escalation route"]},`${i.id}-chip`))})]})]})]})})}};var z,B,S;c.parameters={...c.parameters,docs:{...(z=c.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: args => <Grid style={{
    gap: 16,
    maxInlineSize: 760
  }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Badge</CardTitle>
          <CardDescription>
            Compact status surface for workflow labels, queue states, live filters, and removable metadata chips.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{
        padding: 16
      }}>
          <Flex align="center" justify="space-between" style={{
          gap: 12,
          flexWrap: 'wrap'
        }}>
            <Flex align="center" style={{
            gap: 10,
            flexWrap: 'wrap'
          }}>
              <Badge {...args}>{args.text}</Badge>
              <Box style={{
              color: 'var(--ui-color-muted, #64748b)',
              fontSize: 13
            }}>
                Attached to the real \`ui-badge\` API: tone, variant, size, radius, elevation, state, and interaction props.
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Card>
    </Grid>
}`,...(S=(B=c.parameters)==null?void 0:B.docs)==null?void 0:S.source}}};var w,C,I;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14,
    maxInlineSize: 980
  }}>
      {[{
      label: 'Surface',
      variant: 'surface',
      tone: 'neutral',
      icon: <ShieldIcon size={12} />
    }, {
      label: 'Soft',
      variant: 'soft',
      tone: 'info',
      icon: <ActivityIcon size={12} />
    }, {
      label: 'Outline',
      variant: 'outline',
      tone: 'warning',
      icon: <ClockIcon size={12} />
    }, {
      label: 'Solid',
      variant: 'solid',
      tone: 'success',
      icon: <CheckCircleIcon size={12} />
    }, {
      label: 'Ghost',
      variant: 'ghost',
      tone: 'danger',
      icon: <AlertTriangleIcon size={12} />
    }].map(entry => <Grid key={entry.label} style={{
      gap: 8
    }}>
          <Box style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{entry.label}</Box>
          <Flex align="center" style={{
        gap: 10,
        flexWrap: 'wrap'
      }}>
            <Badge variant={entry.variant as any} tone={entry.tone as any} radius="full">
              <span slot="icon">{entry.icon}</span>
              {entry.label} workflow
            </Badge>
            <Badge variant={entry.variant as any} tone={entry.tone as any} radius={12} dot>
              {entry.label} queue
            </Badge>
            <Badge variant={entry.variant as any} tone={entry.tone as any} radius={4} elevation="low">
              {entry.label} tag
            </Badge>
          </Flex>
        </Grid>)}
    </Grid>
}`,...(I=(C=d.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};var G,F,W;u.parameters={...u.parameters,docs:{...(G=u.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14,
    maxInlineSize: 880
  }}>
      {[{
      label: 'Extra small',
      size: 'xs'
    }, {
      label: 'Small',
      size: 'sm'
    }, {
      label: 'Medium',
      size: 'md'
    }, {
      label: 'Large',
      size: 'lg'
    }, {
      label: 'Extra large',
      size: 'xl'
    }].map(entry => <Grid key={entry.label} style={{
      gap: 8
    }}>
          <Box style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{entry.label}</Box>
          <Flex align="center" style={{
        gap: 10,
        flexWrap: 'wrap'
      }}>
            <Badge size={entry.size as any} tone="info" variant="surface">
              <span slot="icon">
                <ActivityIcon size={12} />
              </span>
              Live monitor
            </Badge>
            <Badge size={entry.size as any} tone="success" variant="soft" dot>
              Healthy
            </Badge>
            <Badge size={entry.size as any} tone="warning" variant="outline" removable>
              Needs review
            </Badge>
          </Flex>
        </Grid>)}
    </Grid>
}`,...(W=(F=u.parameters)==null?void 0:F.docs)==null?void 0:W.source}}};var k,A,T;g.parameters={...g.parameters,docs:{...(k=g.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14,
    maxInlineSize: 900
  }}>
      <Flex align="center" style={{
      gap: 10,
      flexWrap: 'wrap'
    }}>
        <Badge tone="neutral" variant="surface">
          Idle
        </Badge>
        <Badge tone="info" variant="soft" state="loading">
          Syncing queue
        </Badge>
        <Badge tone="danger" variant="outline" state="error">
          <span slot="icon">
            <XCircleIcon size={12} />
          </span>
          Feed delayed
        </Badge>
        <Badge tone="success" variant="solid" state="success" dot>
          Healthy
        </Badge>
        <Badge tone="purple" variant="surface" elevation="high">
          Priority
        </Badge>
        <Badge tone="warning" variant="ghost" interactive>
          Clickable
        </Badge>
        <Badge tone="neutral" variant="surface" disabled>
          Disabled
        </Badge>
      </Flex>
    </Grid>
}`,...(T=(A=g.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};var q,R,H;p.parameters={...p.parameters,docs:{...(q=p.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = React.useState('critical');
    const [filters, setFilters] = React.useState([{
      id: 'critical',
      label: 'Critical',
      tone: 'danger' as const,
      icon: <AlertTriangleIcon size={12} />,
      count: 7
    }, {
      id: 'monitoring',
      label: 'Monitoring',
      tone: 'warning' as const,
      icon: <ClockIcon size={12} />,
      count: 11
    }, {
      id: 'stable',
      label: 'Stable',
      tone: 'success' as const,
      icon: <CheckCircleIcon size={12} />,
      count: 32
    }, {
      id: 'telemetry',
      label: 'Telemetry',
      tone: 'info' as const,
      icon: <ActivityIcon size={12} />,
      count: 5
    }]);
    return <Grid style={{
      gap: 14,
      maxInlineSize: 980
    }}>
        <Card radius={16}>
          <CardHeader>
            <CardTitle>Incident filter rail</CardTitle>
            <CardDescription>
              Interactive triage labels, queue states, and removable routing chips for production monitoring surfaces.
            </CardDescription>
          </CardHeader>

          <Box slot="inset" style={{
          padding: 14,
          display: 'grid',
          gap: 14
        }}>
            <Grid style={{
            gap: 8
          }}>
              <Box style={{
              fontSize: 13,
              color: 'var(--ui-color-muted, #64748b)'
            }}>Active filters</Box>
              <Flex align="center" style={{
              gap: 8,
              flexWrap: 'wrap'
            }}>
                {filters.map(filter => {
                const active = selected === filter.id;
                return <Badge key={filter.id} tone={filter.tone} variant={active ? 'solid' : 'soft'} interactive dot elevation={active ? 'high' : 'none'} onClick={() => setSelected(filter.id)}>
                      <span slot="icon">{filter.icon}</span>
                      {filter.label} ({filter.count})
                    </Badge>;
              })}
                <Badge tone="warning" variant="outline" state="loading">
                  Syncing queue
                </Badge>
              </Flex>
            </Grid>

            <Grid style={{
            gap: 8
          }}>
              <Flex align="center" justify="space-between" style={{
              gap: 10,
              flexWrap: 'wrap'
            }}>
                <Box style={{
                fontSize: 13,
                color: 'var(--ui-color-muted, #64748b)'
              }}>Routing chips</Box>
                <Button size="sm" variant="secondary" onClick={() => setFilters([{
                id: 'critical',
                label: 'Critical',
                tone: 'danger',
                icon: <AlertTriangleIcon size={12} />,
                count: 7
              }, {
                id: 'monitoring',
                label: 'Monitoring',
                tone: 'warning',
                icon: <ClockIcon size={12} />,
                count: 11
              }, {
                id: 'stable',
                label: 'Stable',
                tone: 'success',
                icon: <CheckCircleIcon size={12} />,
                count: 32
              }, {
                id: 'telemetry',
                label: 'Telemetry',
                tone: 'info',
                icon: <ActivityIcon size={12} />,
                count: 5
              }])}>
                  Reset filters
                </Button>
              </Flex>

              <Flex align="center" style={{
              gap: 8,
              flexWrap: 'wrap'
            }}>
                {filters.map(filter => <Badge key={\`\${filter.id}-chip\`} tone={filter.tone} variant="outline" removable truncate maxWidth="18ch" onRemove={() => setFilters(current => current.filter(entry => entry.id !== filter.id))}>
                    <span slot="icon">{filter.icon}</span>
                    {filter.label} escalation route
                  </Badge>)}
              </Flex>
            </Grid>
          </Box>
        </Card>
      </Grid>;
  }
}`,...(H=(R=p.parameters)==null?void 0:R.docs)==null?void 0:H.source}}};const K=["Playground","VariantGallery","SizeGallery","StateGallery","OperationsFilterPattern"];export{p as OperationsFilterPattern,c as Playground,u as SizeGallery,g as StateGallery,d as VariantGallery,K as __namedExportsOrder,J as default};
