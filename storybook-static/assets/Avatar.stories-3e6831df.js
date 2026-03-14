import{Y as s,a as e,G as l,j as n,M as R,N as L,O as T,P as O,B as t,F as i,b as v}from"./index-ce0e40fa.js";import{R as q}from"./index-93f6b7ae.js";import{a as E,A as P,S as H,B as M,b as N}from"./icons-b73c9b18.js";import"./index-c197feae.js";const _={title:"UI/Avatar",component:s,args:{variant:"surface",tone:"neutral",size:"md",elevation:"low",radius:"full"},argTypes:{variant:{control:"select",options:["surface","soft","outline","solid"]},tone:{control:"select",options:["neutral","info","success","warning","danger"]},size:{control:"select",options:["sm","md","lg"]},elevation:{control:"select",options:["none","low","high"]}}},c=[{id:"dr-ava",name:"Dr. Ava Singh",role:"ICU Lead",status:"online",tone:"success",badge:"1",src:"https://randomuser.me/api/portraits/women/68.jpg"},{id:"nurse-luca",name:"Luca Chen",role:"Charge Nurse",status:"away",tone:"warning",state:"loading",badge:"2",src:"https://randomuser.me/api/portraits/men/35.jpg"},{id:"dr-omar",name:"Dr. Omar Hale",role:"Cardiology",status:"busy",tone:"danger",src:"https://randomuser.me/api/portraits/men/48.jpg"}],d={render:a=>e(l,{style:{gap:16},children:n(R,{radius:16,children:[n(L,{children:[e(T,{children:"Avatar"}),e(O,{children:"Identity surface for people, queues, and entities with presence, badge, and fallback states."})]}),e(t,{slot:"inset",style:{padding:12},children:n(i,{align:"center",style:{gap:12},children:[e(s,{...a,src:"https://randomuser.me/api/portraits/women/68.jpg",alt:"Dr. Ava Singh",status:"online",badge:"1",interactive:!0}),n(i,{direction:"column",style:{gap:2},children:[e(t,{style:{fontWeight:600},children:"Dr. Ava Singh"}),e(t,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13},children:"ICU Lead"})]})]})})]})})},u={render:()=>e(l,{style:{gap:14},children:[{label:"Surface",variant:"surface",tone:"neutral"},{label:"Soft",variant:"soft",tone:"info"},{label:"Outline",variant:"outline",tone:"warning"},{label:"Solid",variant:"solid",tone:"success"}].map(a=>n(l,{style:{gap:8},children:[e(t,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:a.label}),n(i,{align:"center",style:{gap:12},children:[e(s,{alt:`${a.label} avatar`,initials:"EA",variant:a.variant,tone:a.tone,radius:"full",elevation:"low"}),e(s,{alt:`${a.label} image avatar`,src:"https://randomuser.me/api/portraits/women/68.jpg",variant:a.variant,tone:a.tone,radius:12,shape:"rounded"})]})]},a.label))})},p={render:()=>e(l,{style:{gap:14},children:[{label:"Small",size:"sm"},{label:"Medium",size:"md"},{label:"Large",size:"lg"}].map(a=>n(l,{style:{gap:8},children:[e(t,{style:{fontSize:13,fontWeight:600,color:"var(--ui-color-muted, #64748b)"},children:a.label}),n(i,{align:"center",style:{gap:12},children:[e(s,{size:a.size,initials:"AV",tone:"info"}),e(s,{size:a.size,src:"https://randomuser.me/api/portraits/women/68.jpg",alt:"Dr. Ava Singh",status:"online",badge:"1",tone:"success"})]})]},a.label))})},g={render:()=>e(l,{style:{gap:14},children:n(i,{align:"center",style:{gap:12,flexWrap:"wrap"},children:[e(s,{initials:"ID",state:"idle",tone:"neutral"}),e(s,{initials:"LD",state:"loading",tone:"info"}),e(s,{initials:"ER",state:"error",tone:"danger"}),e(s,{initials:"OK",state:"success",tone:"success"}),e(s,{initials:"DS",disabled:!0})]})})},m={render:()=>{var b;const[a,D]=q.useState(((b=c[0])==null?void 0:b.id)||""),f=c.find(r=>r.id===a)||c[0];return n(l,{style:{gap:14,maxInlineSize:980},children:[e(t,{style:{border:"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:16,padding:16,background:"color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--ui-color-surface, #fff))"},children:n(i,{align:"center",justify:"space-between",style:{gap:12,flexWrap:"wrap"},children:[n(t,{children:[e(t,{style:{fontWeight:700,fontSize:18},children:"Clinical presence roster"}),e(t,{style:{color:"var(--ui-color-muted, #64748b)",fontSize:13,marginTop:4},children:"Presence, fallback, queue badges, and quick escalation actions for live operations."})]}),n(i,{align:"center",style:{gap:8,color:"var(--ui-color-muted, #64748b)",fontSize:12},children:[e(E,{size:14}),"Shift status: Live"]})]})}),e(l,{style:{gap:10,gridTemplateColumns:"repeat(auto-fit, minmax(230px, 1fr))"},children:c.map(r=>{const o=r.id===a;return e(t,{style:{border:o?"1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 48%, transparent)":"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:14,padding:12,background:"var(--ui-color-surface, #fff)",boxShadow:o?"0 10px 24px rgba(37, 99, 235, 0.14)":"0 1px 2px rgba(15, 23, 42, 0.05)"},children:n(i,{align:"center",justify:"space-between",style:{gap:10},children:[n(i,{align:"center",style:{gap:10,minWidth:0},children:[e(s,{src:r.src,alt:r.name,size:"lg",status:r.status,tone:r.tone,state:o?"success":r.state,badge:r.badge,interactive:!0,disabled:r.state==="loading",ring:o,variant:o?"solid":"soft",onClick:()=>D(r.id)}),n(t,{style:{minWidth:0},children:[e(t,{style:{fontWeight:650,fontSize:14,overflow:"hidden",textOverflow:"ellipsis"},children:r.name}),e(t,{style:{fontSize:12,color:"var(--ui-color-muted, #64748b)",marginTop:2},children:r.role})]})]}),n(i,{align:"center",style:{gap:5,fontSize:11,color:o?"var(--ui-color-primary, #2563eb)":"var(--ui-color-muted, #64748b)"},children:[e(P,{size:12}),r.status]})]})},r.id)})}),e(t,{style:{border:"1px solid var(--ui-color-border, #d8e1ec)",borderRadius:16,padding:14,background:"var(--ui-color-surface, #fff)"},children:n(i,{justify:"space-between",align:"center",style:{gap:10,flexWrap:"wrap"},children:[n(i,{align:"center",style:{gap:8,fontSize:14,fontWeight:650},children:[e(H,{size:15}),(f==null?void 0:f.name)||"Clinician"," selected for escalation coverage"]}),n(i,{style:{gap:8,flexWrap:"wrap"},children:[n(v,{size:"sm",recipe:"soft",variant:"secondary",children:[e(M,{size:14}),"Notify"]}),n(v,{size:"sm",children:[e(N,{size:14}),"Assign lead"]})]})]})})]})}};var y,x,h;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: args => <Grid style={{
    gap: 16
  }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            Identity surface for people, queues, and entities with presence, badge, and fallback states.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{
        padding: 12
      }}>
          <Flex align="center" style={{
          gap: 12
        }}>
            <Avatar {...args} src="https://randomuser.me/api/portraits/women/68.jpg" alt="Dr. Ava Singh" status="online" badge="1" interactive />
            <Flex direction="column" style={{
            gap: 2
          }}>
              <Box style={{
              fontWeight: 600
            }}>Dr. Ava Singh</Box>
              <Box style={{
              color: 'var(--ui-color-muted, #64748b)',
              fontSize: 13
            }}>ICU Lead</Box>
            </Flex>
          </Flex>
        </Box>
      </Card>
    </Grid>
}`,...(h=(x=d.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};var S,z,w;u.parameters={...u.parameters,docs:{...(S=u.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
      tone: 'success'
    }].map(entry => <Grid key={entry.label} style={{
      gap: 8
    }}>
          <Box style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--ui-color-muted, #64748b)'
      }}>{entry.label}</Box>
          <Flex align="center" style={{
        gap: 12
      }}>
            <Avatar alt={\`\${entry.label} avatar\`} initials="EA" variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'} tone={entry.tone as 'neutral' | 'info' | 'warning' | 'success'} radius="full" elevation="low" />
            <Avatar alt={\`\${entry.label} image avatar\`} src="https://randomuser.me/api/portraits/women/68.jpg" variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'} tone={entry.tone as 'neutral' | 'info' | 'warning' | 'success'} radius={12} shape="rounded" />
          </Flex>
        </Grid>)}
    </Grid>
}`,...(w=(z=u.parameters)==null?void 0:z.docs)==null?void 0:w.source}}};var A,B,C;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
          <Flex align="center" style={{
        gap: 12
      }}>
            <Avatar size={entry.size as 'sm' | 'md' | 'lg'} initials="AV" tone="info" />
            <Avatar size={entry.size as 'sm' | 'md' | 'lg'} src="https://randomuser.me/api/portraits/women/68.jpg" alt="Dr. Ava Singh" status="online" badge="1" tone="success" />
          </Flex>
        </Grid>)}
    </Grid>
}`,...(C=(B=p.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};var F,W,G;g.parameters={...g.parameters,docs:{...(F=g.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <Grid style={{
    gap: 14
  }}>
      <Flex align="center" style={{
      gap: 12,
      flexWrap: 'wrap'
    }}>
        <Avatar initials="ID" state="idle" tone="neutral" />
        <Avatar initials="LD" state="loading" tone="info" />
        <Avatar initials="ER" state="error" tone="danger" />
        <Avatar initials="OK" state="success" tone="success" />
        <Avatar initials="DS" disabled />
      </Flex>
    </Grid>
}`,...(G=(W=g.parameters)==null?void 0:W.docs)==null?void 0:G.source}}};var k,I,j;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = React.useState(clinicians[0]?.id || '');
    const selectedMember = clinicians.find(member => member.id === selected) || clinicians[0];
    return <Grid style={{
      gap: 14,
      maxInlineSize: 980
    }}>
        <Box style={{
        border: '1px solid var(--ui-color-border, #d8e1ec)',
        borderRadius: 16,
        padding: 16,
        background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--ui-color-surface, #fff))'
      }}>
          <Flex align="center" justify="space-between" style={{
          gap: 12,
          flexWrap: 'wrap'
        }}>
            <Box>
              <Box style={{
              fontWeight: 700,
              fontSize: 18
            }}>Clinical presence roster</Box>
              <Box style={{
              color: 'var(--ui-color-muted, #64748b)',
              fontSize: 13,
              marginTop: 4
            }}>
                Presence, fallback, queue badges, and quick escalation actions for live operations.
              </Box>
            </Box>
            <Flex align="center" style={{
            gap: 8,
            color: 'var(--ui-color-muted, #64748b)',
            fontSize: 12
          }}>
              <ClockIcon size={14} />
              Shift status: Live
            </Flex>
          </Flex>
        </Box>

        <Grid style={{
        gap: 10,
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))'
      }}>
          {clinicians.map(member => {
          const isActive = member.id === selected;
          return <Box key={member.id} style={{
            border: isActive ? '1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 48%, transparent)' : '1px solid var(--ui-color-border, #d8e1ec)',
            borderRadius: 14,
            padding: 12,
            background: 'var(--ui-color-surface, #fff)',
            boxShadow: isActive ? '0 10px 24px rgba(37, 99, 235, 0.14)' : '0 1px 2px rgba(15, 23, 42, 0.05)'
          }}>
                <Flex align="center" justify="space-between" style={{
              gap: 10
            }}>
                  <Flex align="center" style={{
                gap: 10,
                minWidth: 0
              }}>
                    <Avatar src={member.src} alt={member.name} size="lg" status={member.status} tone={member.tone} state={isActive ? 'success' : member.state} badge={member.badge} interactive disabled={member.state === 'loading'} ring={isActive} variant={isActive ? 'solid' : 'soft'} onClick={() => setSelected(member.id)} />
                    <Box style={{
                  minWidth: 0
                }}>
                      <Box style={{
                    fontWeight: 650,
                    fontSize: 14,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{member.name}</Box>
                      <Box style={{
                    fontSize: 12,
                    color: 'var(--ui-color-muted, #64748b)',
                    marginTop: 2
                  }}>{member.role}</Box>
                    </Box>
                  </Flex>
                  <Flex align="center" style={{
                gap: 5,
                fontSize: 11,
                color: isActive ? 'var(--ui-color-primary, #2563eb)' : 'var(--ui-color-muted, #64748b)'
              }}>
                    <ActivityIcon size={12} />
                    {member.status}
                  </Flex>
                </Flex>
              </Box>;
        })}
        </Grid>

        <Box style={{
        border: '1px solid var(--ui-color-border, #d8e1ec)',
        borderRadius: 16,
        padding: 14,
        background: 'var(--ui-color-surface, #fff)'
      }}>
          <Flex justify="space-between" align="center" style={{
          gap: 10,
          flexWrap: 'wrap'
        }}>
            <Flex align="center" style={{
            gap: 8,
            fontSize: 14,
            fontWeight: 650
          }}>
              <ShieldIcon size={15} />
              {selectedMember?.name || 'Clinician'} selected for escalation coverage
            </Flex>
            <Flex style={{
            gap: 8,
            flexWrap: 'wrap'
          }}>
              <Button size="sm" recipe="soft" variant="secondary">
                <BellIcon size={14} />
                Notify
              </Button>
              <Button size="sm">
                <CheckCircleIcon size={14} />
                Assign lead
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Grid>;
  }
}`,...(j=(I=m.parameters)==null?void 0:I.docs)==null?void 0:j.source}}};const Y=["Playground","VariantGallery","SizeGallery","StateGallery","ClinicalRosterWorkflow"];export{m as ClinicalRosterWorkflow,d as Playground,p as SizeGallery,g as StateGallery,u as VariantGallery,Y as __namedExportsOrder,_ as default};
